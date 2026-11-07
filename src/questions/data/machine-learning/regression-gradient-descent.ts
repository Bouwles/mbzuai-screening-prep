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
      asking: 'What time does the model give for a distance of 6 km?',
      solution:
        'The formula $\\hat{y} = 2.5x + 4$ is the model. $x$ is the distance in km, and $\\hat{y}$ (say "y hat") is the predicted time in minutes.\n\n' +
        'Put $x = 6$ into the formula, so we get $\\hat{y} = 2.5 \\times 6 + 4$.\n\n' +
        'Multiply first, because multiplication comes before addition: $2.5 \\times 6 = 15$.\n\n' +
        'Then add the 4: $15 + 4 = 19$.',
      conclusion: 'Putting 6 in for $x$ gives 19, so the model predicts $19$ minutes.',
      whyWrong: [
        'This is $2.5 \\times 6 = 15$: the bias $b = 4$ was forgotten. The prediction is $wx$ **plus** $b$.',
        'This swaps the weight and the bias: $4 \\times 6 + 2.5 = 26.5$. The number multiplying $x$ is $2.5$.',
        null,
        'This is $2.5 \\times (6 + 4) = 25$: the bias was added to $x$ before multiplying. Multiply first, then add $b$.',
      ],
      keyIdea: 'To get a prediction from a line $\\hat{y} = wx + b$: put the input in for $x$, multiply by the weight $w$ (the number in front of $x$), then add the bias $b$ (the number on its own).',
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
      asking: 'Which of these four tasks does logistic regression suit?',
      solution:
        'Despite its name, **logistic regression** doesn\'t predict a number on a scale. It chooses between two classes (two groups), such as yes or no, and gives the probability of one of them.\n\n' +
        'So a selling price or a temperature, which are numbers on a scale, belong to **linear regression**. Grouping customers with no labels (no right answers attached) is **clustering**.\n\n' +
        'The email task has exactly two classes, spam and not spam, and the model can learn from emails that are already marked. That is what logistic regression is for.',
      conclusion: 'The task has two classes and labelled examples, so the answer is Predicting whether an email is spam or not spam.',
      whyWrong: [
        'A price is a continuous number, so this is a linear regression task. Logistic regression outputs a probability of belonging to a class.',
        null,
        'A temperature is a continuous quantity, so this needs linear regression. The word "regression" in "logistic regression" is misleading: it classifies.',
        'With no labels this is clustering (unsupervised learning). Logistic regression is supervised: it needs labelled examples of each class.',
      ],
      keyIdea: 'Look at what the model must output. A number on a scale means linear regression. One of two classes means logistic regression. No labels at all, only finding groups, means clustering.',
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
      asking: 'What is the new weight after one update?',
      solution:
        'A **weight** $w$ is a number the model can change. The **gradient** $\\frac{\\partial L}{\\partial w}$ tells us how the loss $L$ (the model\'s error) changes when $w$ goes up. The **learning rate** $\\eta$ (the Greek letter "eta") sets the step size.\n\n' +
        'The gradient here is positive, so the loss rises as $w$ rises. To lower the loss we must move $w$ down, which is why the rule subtracts: $w_{\\text{new}} = w - \\eta \\times \\frac{\\partial L}{\\partial w}$.\n\n' +
        'Work out the size of the step: $\\eta \\times \\frac{\\partial L}{\\partial w} = 0.1 \\times 4 = 0.4$.\n\n' +
        'Subtract it from the current weight: $3 - 0.4 = 2.6$.',
      conclusion: 'The step is 0.4 and we take it away from 3, so the answer is $2.6$.',
      whyWrong: [
        'This adds the step: $3 + 0.4 = 3.4$. That is gradient **ascent**, which makes the loss bigger. Descent subtracts $\\eta \\times$ gradient.',
        'This forgets the learning rate: $3 - 4 = -1$. The gradient must be multiplied by $\\eta = 0.1$ first, so the step is only $0.4$.',
        'This is just the step $-0.1 \\times 4 = -0.4$: the old weight $3$ was forgotten. The step is added to the current weight.',
        null,
      ],
      keyIdea: 'For any gradient descent update, use $w_{\\text{new}} = w - \\eta \\times \\text{gradient}$. Multiply first, then subtract. A positive gradient makes $w$ fall, and a negative gradient makes $w$ rise.',
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
      asking: 'What does the sigmoid formula give when $z$ is 0?',
      solution:
        'The **sigmoid** $\\sigma(z)$ (say "sigma of z") is a function that turns any number $z$ into a value between 0 and 1. To use it here, we replace $z$ with 0.\n\n' +
        'The power in the formula is $-z$. Minus 0 is just 0, so the power becomes 0 and we get $\\sigma(0) = \\frac{1}{1 + e^{0}}$.\n\n' +
        '$e$ is a fixed number, about 2.718. Any non-zero number to the power 0 equals 1, so $e^{0} = 1$.\n\n' +
        'The bottom of the fraction is $1 + 1 = 2$, so $\\sigma(0) = \\frac{1}{2}$.',
      conclusion: 'With $z = 0$ the bottom of the fraction is 2, so the answer is $\\frac{1}{2}$.',
      whyWrong: [
        'This assumes the sigmoid behaves like $f(z) = z$ (or ReLU) and gives $0$ at $z = 0$. The sigmoid is centred at $\\frac{1}{2}$, not at $0$.',
        null,
        'This uses $e^{0} = 1$ correctly but then stops, taking the answer as $e^{0}$ itself instead of $\\frac{1}{1 + e^{0}}$.',
        'This works out the denominator $1 + e^{0} = 2$ but forgets to take the reciprocal. The sigmoid output is always between $0$ and $1$, so $2$ is impossible.',
      ],
      keyIdea: 'To evaluate a formula at a value, substitute first and simplify the power before the fraction. Worth knowing: $\\sigma(0) = \\frac{1}{2}$, positive $z$ gives more than $\\frac{1}{2}$, and negative $z$ gives less.',
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
      asking: 'What actually happens in one step of gradient descent?',
      solution:
        'Training means changing the model\'s **weights** (the numbers it can adjust) so that its **loss** (its error score) gets smaller. The training data stays fixed.\n\n' +
        'To know how to change a weight, we need to know how the loss responds to it. That is the derivative of the loss with respect to that weight, also called the **gradient**.\n\n' +
        'A positive gradient means the loss rises as the weight rises, so lowering the weight lowers the loss. A negative gradient means the reverse.\n\n' +
        'So each weight moves the opposite way to its gradient. One step is: differentiate the loss with respect to each weight, then step against it.',
      conclusion: 'Only this statement differentiates the right thing and moves the right way: Differentiate the loss with respect to each weight, then step against it.',
      whyWrong: [
        'The inputs $x$ are the training data, which are fixed. Gradient descent differentiates with respect to the **weights**, because the weights are what we are allowed to change.',
        'Two errors: it differentiates the prediction instead of the **loss**, and moving in the same direction as the gradient goes uphill, increasing the loss.',
        'The loss is a measure of error, not a weight value. Weights are adjusted by small steps using the gradient, never replaced by the loss.',
        null,
      ],
      keyIdea: 'To test a description of gradient descent, ask three things. Is the loss what gets differentiated? Is it with respect to the weights? Does the step go against the gradient? All three must be yes.',
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
      asking: 'Are the two statements about loss functions true?',
      solution:
        'A **loss** is a single number that measures how wrong a model is. Training tries to make it small.\n\n' +
        'Linear regression predicts a number, so we can measure the gap between prediction and truth. **Mean squared error** (MSE) squares each gap and averages them. So Statement 1 is true.\n\n' +
        'Logistic regression predicts a probability for a class. **Cross-entropy** (log loss) gives a big penalty when the model is confident and wrong, which suits probabilities. So Statement 2 is true as well.',
      conclusion: 'Each statement matches a model with its usual loss, so the answer is Both statements.',
      whyWrong: [
        'Statement 1 is true, but so is Statement 2: cross-entropy is the standard loss for logistic regression.',
        'Statement 2 is true, but so is Statement 1: MSE is the standard loss for linear regression.',
        null,
        'Both statements are standard facts, so it cannot be that neither is true.',
      ],
      keyIdea: 'Match the loss to the output: a number on a scale uses mean squared error, and a probability for a class uses cross-entropy. For two-statement questions, decide each statement on its own before choosing.',
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
      asking: 'On average, how big are the squared prediction errors for these four houses?',
      solution:
        '**MSE** stands for mean squared error. An **error** is actual minus predicted, $y - \\hat{y}$. Squared means multiplied by itself, and mean means the average.\n\n' +
        'We square the errors so that negative errors can\'t cancel out positive ones. Work out each house in a table:\n\n| House | Actual $y$ | Predicted $\\hat{y}$ | Error $y - \\hat{y}$ | Error squared |\n|---|---|---|---|---|\n| 1 | 3 | 4 | $-1$ | 1 |\n| 2 | 5 | 5 | 0 | 0 |\n| 3 | 7 | 5 | 2 | 4 |\n| 4 | 10 | 9 | 1 | 1 |\n\n' +
        'Add up the last column. The 0 adds nothing, so the total is $1 + 4 + 1 = 6$.\n\n' +
        'The mean divides that total by the number of houses, which is 4: $\\frac{6}{4} = 1.5$.',
      conclusion: 'The squared errors total 6 across 4 houses, so the MSE is $1.5$.',
      whyWrong: [
        'This is the mean of the **signed** errors $-1$, $0$, $2$, $1$, which add up to $2$, giving $\\frac{2}{4} = 0.5$. Without squaring, positive and negative errors cancel out.',
        null,
        'This is the mean **absolute** error: the sizes $1$, $0$, $2$, $1$ add up to $4$, and $\\frac{4}{4} = 1$. MSE squares each error, so the error of $2$ counts as $4$.',
        'This is the **sum** of squared errors, $6$. The "mean" in MSE means you must divide by the number of houses, $4$.',
      ],
      keyIdea: 'For MSE, draw a table with columns for actual, predicted, error and error squared. Add up the last column, then divide by how many rows there are.',
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
      asking: 'How far is the actual score at $x = 6$ from what the line predicts?',
      solution:
        'A **residual** is the gap between the real value and the line\'s prediction: actual minus predicted. A positive residual means the point sits above the line.\n\n' +
        'Find the prediction by putting $x = 6$ into the line: $\\hat{y} = 0.5 \\times 6 + 2 = 3 + 2 = 5$.\n\n' +
        'Find the actual score by reading the chart at 6 hours of revision. The point there is at a score of 7.\n\n' +
        'Now subtract, actual minus predicted: $7 - 5 = 2$.',
      conclusion: 'The point is at 7 and the line is at 5, so the residual is $2$.',
      whyWrong: [
        'This is predicted minus actual, $5 - 7 = -2$. The residual is defined as actual minus predicted, so the sign is reversed.',
        'This is the predicted value $\\hat{y} = 5$, not the residual. You still need to subtract it from the actual score.',
        'This is the **squared** residual $2^2 = 4$, which is what goes into the MSE, not the residual itself.',
        null,
      ],
      keyIdea: 'For a residual, read the real $y$ from the point, put $x$ into the line\'s equation to get $\\hat{y}$, then work out $y - \\hat{y}$. A point above the line gives a positive value, and a point below gives a negative one.',
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
      asking: 'How quickly is the loss changing as $w$ changes, at $w = 2$?',
      solution:
        'The **gradient** $\\frac{dL}{dw}$ is the derivative of the loss $L$ with respect to $w$. It tells us how much $L$ changes when $w$ changes a little.\n\n' +
        '$L = (wx - y)^2$ is a bracket squared, so we use the **chain rule**: differentiate the outside, then multiply by the derivative of the inside.\n\n' +
        'The outside: a squared bracket differentiates to 2 times the bracket, giving $2(wx - y)$. The inside: $wx - y$ differentiates to $x$, because $x$ and $y$ are fixed numbers and only $w$ changes. So $\\frac{dL}{dw} = 2(wx - y) \\times x$.\n\n' +
        'Now put in $w = 2$, $x = 3$ and $y = 10$. The bracket is $wx - y = 2 \\times 3 - 10 = 6 - 10 = -4$.\n\n' +
        'Multiply everything together: $\\frac{dL}{dw} = 2 \\times (-4) \\times 3 = -8 \\times 3 = -24$.',
      conclusion: 'The bracket is $-4$, and multiplying it by 2 and by $x = 3$ gives the answer, $-24$.',
      whyWrong: [
        'This has the wrong sign. It uses $2(y - wx)x = 2 \\times 4 \\times 3 = 24$, forgetting that differentiating $y - wx$ with respect to $w$ gives $-x$, not $x$.',
        'This is the loss itself, $(6 - 10)^2 = 16$, not its derivative.',
        null,
        'This is $2 \\times (-4) = -8$: the chain rule factor $x = 3$ (the derivative of $wx - y$ with respect to $w$) was left out.',
      ],
      keyIdea: 'For $L = (wx - y)^2$, the gradient is $\\frac{dL}{dw} = 2(wx - y)x$. Find the bracket first, keeping its sign, then multiply by 2 and by $x$.',
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
      asking: 'Where is $w$ after one gradient descent step from $w = 1$?',
      solution:
        'Gradient descent moves $w$ downhill on the loss, using $w_{\\text{new}} = w - \\eta \\times L\'(w)$. $L\'(w)$ is the derivative of the loss (its gradient), which says how the loss changes as $w$ rises, and $\\eta$ is the learning rate, which sets the step size.\n\n' +
        'Differentiate $L(w) = (w - 5)^2 + 1$. A squared bracket differentiates to 2 times the bracket, times the derivative of the inside. The inside $w - 5$ differentiates to 1, so $(w - 5)^2$ gives $2(w - 5)$. The $+ 1$ is a constant, which doesn\'t change when $w$ changes, so it disappears. So $L\'(w) = 2(w - 5)$.\n\n' +
        'Put in the starting value $w_0 = 1$: $L\'(1) = 2(1 - 5) = 2 \\times (-4) = -8$.\n\n' +
        'Multiply by the learning rate: $0.1 \\times (-8) = -0.8$.\n\n' +
        'Subtract that from the current $w$. Taking away a negative means adding: $w_1 = 1 - (-0.8) = 1 + 0.8 = 1.8$.',
      conclusion: 'The gradient at $w = 1$ is $-8$, so $w$ moves up by 0.8 towards the minimum at 5, giving $1.8$.',
      whyWrong: [
        null,
        'This adds the step instead of subtracting it: $1 + 0.1 \\times (-8) = 0.2$. That moves $w$ away from the minimum at $5$.',
        'This forgets the learning rate: $1 - (-8) = 9$. The gradient must be multiplied by $\\eta = 0.1$.',
        'This drops the factor $2$ when differentiating, using $L\'(w) = w - 5 = -4$, so $w_1 = 1 + 0.4 = 1.4$.',
      ],
      keyIdea: 'For one step on a given loss: differentiate, put in the current $w$, multiply by $\\eta$, then subtract from $w$. For a loss like $(w - c)^2$, the lowest point is at $c$, so $w$ must move towards $c$.',
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
      asking: 'What probability does the model give at $x = 1$, and which class does that mean?',
      solution:
        'The model works in two stages. First it calculates a score $z$. Then the **sigmoid** $\\sigma(z)$ squashes that score into a probability $p$ between 0 and 1.\n\n' +
        'Find the score by putting $x = 1$ into $z = 2x - 3$: $z = 2 \\times 1 - 3 = -1$.\n\n' +
        'Now use $z = -1$ in the sigmoid. The power $-z$ is $-(-1) = 1$, so $e^{-z}$ is just $e$, which is about 2.718.\n\n' +
        'Substitute: $p = \\frac{1}{1 + 2.718} = \\frac{1}{3.718} \\approx 0.27$ to 2 decimal places.\n\n' +
        'The rule gives class 1 only when $p \\ge 0.5$. Here 0.27 is below 0.5, so the model predicts class 0.',
      conclusion: 'The negative score pushes the probability under one half, so the answer is $p = 0.27$, class 0.',
      whyWrong: [
        'This is $\\sigma(1) \\approx 0.73$: the minus sign in $e^{-z}$ was lost, so $e^{-1}$ was used instead of $e$. A negative $z$ must give $p < 0.5$.',
        null,
        'This is $e^{-1} \\approx 0.37$: it computes only the exponential, not $\\frac{1}{1 + e^{-z}}$.',
        'The probability is right, but the class is wrong: class 1 needs $p \\ge 0.5$, and $0.27$ is below the threshold.',
      ],
      keyIdea: 'For a logistic prediction: calculate $z$, then $p = \\frac{1}{1 + e^{-z}}$, then compare $p$ with 0.5. A shortcut for the class: negative $z$ always gives $p < 0.5$, and positive $z$ gives $p > 0.5$.',
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
      asking: 'What is the loss when the true class is 1 and the model says 0.8?',
      solution:
        '**Cross-entropy** measures how wrong a probability is. $y$ is the true label (here 1), $p$ is the model\'s probability for class 1 (here 0.8), and $\\ln$ is the natural logarithm, a button on your calculator.\n\n' +
        'Substitute $y = 1$ and $p = 0.8$: $L = -[1 \\times \\ln 0.8 + (1 - 1) \\times \\ln(1 - 0.8)]$.\n\n' +
        'The second part is multiplied by $1 - 1$, which is 0, so it disappears. That leaves $L = -\\ln 0.8$.\n\n' +
        'The calculator gives $\\ln 0.8 \\approx -0.2231$. The minus sign in front makes it positive: $L \\approx 0.2231$, which is 0.22 to 2 decimal places.',
      conclusion: 'Only the $\\ln p$ part survives when $y = 1$, and $-\\ln 0.8$ rounds to $0.22$.',
      whyWrong: [
        'This is $-\\ln 0.2 \\approx 1.61$: it uses the probability of the **wrong** class, $1 - p$. When $y = 1$ only the $\\ln p$ term survives.',
        'This is $1 - p = 0.20$, the gap between the label and the probability, not the cross-entropy loss (no logarithm was taken).',
        'This is the squared error $(1 - 0.8)^2 = 0.04$, which is the MSE-style loss, not cross-entropy.',
        null,
      ],
      keyIdea: 'In binary cross-entropy, one part always disappears. If $y = 1$, use $L = -\\ln p$. If $y = 0$, use $L = -\\ln(1 - p)$. Confident and right gives a small loss, and confident and wrong gives a big one.',
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
      asking: 'What value of `w` does the code print once its 3 passes are done?',
      solution:
        'Lines 1 and 2 set the starting values: `w` is 0, and `lr` (the learning rate, which sets the step size) is 0.1.\n\n' +
        'The loop on lines 3 to 6 runs 3 times, with `i` taking the values 1, 2 and 3. `i` only counts the passes and isn\'t used in the sums.\n\n' +
        'Line 4 works out the gradient from the current `w`, and line 5 then changes `w`. Because `w` changes every pass, `grad` has a new value each pass too.\n\n' +
        'Here are the first two passes:\n\n| Pass | `w` at the start | `grad` on line 4 | `lr * grad` | `w` after line 5 |\n|---|---|---|---|---|\n| 1 | 0 | $2 \\times (0 - 4) = -8$ | $-0.8$ | $0 - (-0.8) = 0.8$ |\n| 2 | 0.8 | $2 \\times (0.8 - 4) = -6.4$ | $-0.64$ | $0.8 - (-0.64) = 1.44$ |\n\n' +
        'Pass 3 starts with `w` at 1.44. Line 4 gives $2 \\times (1.44 - 4) = -5.12$, so `lr * grad` is $-0.512$. Line 5 gives $1.44 - (-0.512) = 1.952$, and line 7 prints that value.',
      conclusion: 'Each pass uses a smaller gradient as `w` creeps towards 4. After three passes `w` holds 1.952, so the code prints $1.952$.',
      whyWrong: [
        null,
        'This keeps using the first gradient $-8$ every time, giving steps of $0.8$. The gradient is recalculated inside the loop from the new $w$, so it shrinks.',
        'This adds `lr * grad` instead of subtracting it (gradient ascent), so $w$ runs away from the minimum at $4$: $-0.8$, $-1.76$, $-2.912$.',
        'This ignores `lr` and subtracts the whole gradient: $w$ goes $8$, then $0$, then $8$ again, bouncing for ever.',
      ],
      keyIdea: 'To trace gradient descent code, draw one row per pass with columns for `w`, `grad` and the step. Recalculate `grad` from the newest `w` every pass, and subtract `lr * grad`, so a negative gradient pushes `w` up.',
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
      asking: 'Which learning rate produced which loss curve?',
      solution:
        'The **learning rate** sets how big each training step is. **Loss** is the model\'s error, so good training makes the curve fall. An **epoch** is one full pass through the training data.\n\n' +
        'Think of walking down into a valley. Tiny steps get you down very slowly. Medium steps get you down quickly. Giant steps jump right over the bottom and can land you higher up the other side.\n\n' +
        'Read the three curves:\n\n| Run | What the loss does | What it suggests |\n|---|---|---|\n| A | Falls slowly, from 10 to 7.6 by epoch 6 | Steps too small |\n| B | Falls fast, from 10 to 0.9, then levels off | Steps about right |\n| C | Jumps up and down, and climbs to 30 | Steps too large |\n\n' +
        'Match these to the sizes. The smallest rate, 0.0001, fits the slow Run A. The middle rate, 0.01, fits Run B. The biggest rate, 2, fits Run C.',
      conclusion: 'Slow decline, healthy drop and blow-up go with small, medium and large rates, so the answer is Run A: $0.0001$, Run B: $0.01$, Run C: $2$.',
      whyWrong: [
        'This reverses the effect of the learning rate. A big learning rate does not make training slow and careful: it makes huge steps that overshoot, which is the zig-zagging, exploding Run C.',
        'This assumes a tiny learning rate causes instability. A tiny learning rate can only make tiny steps, so it gives the slow steady decline of Run A, not the blow-up.',
        null,
        'This assumes the largest learning rate always gives the fastest decrease. Beyond a certain size the steps overshoot the minimum, so $2$ produces the diverging Run C, while $0.01$ gives the fast smooth drop of Run B.',
      ],
      keyIdea: 'Read the shape of a loss curve. A slow steady fall means the learning rate is too small. A fast fall that levels off means about right. Zig-zags or a rising loss mean it is too large.',
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
      asking: 'Which of the two models has the smaller average squared error, and what is that error?',
      solution:
        '**MSE** (mean squared error) is how we compare the models: for each point find the error $y - \\hat{y}$, square it, then average. A lower MSE means a better fit.\n\n' +
        'Start with Model A, $\\hat{y} = 2x + 1$. Put each $x$ in:\n\n| $x$ | $y$ | $\\hat{y}$ | Error | Error squared |\n|---|---|---|---|---|\n| 1 | 3 | 3 | 0 | 0 |\n| 2 | 6 | 5 | 1 | 1 |\n| 3 | 7 | 7 | 0 | 0 |\n| 4 | 8 | 9 | $-1$ | 1 |\n\n' +
        'Model A\'s squared errors add up to $1 + 1 = 2$. Dividing by the 4 points gives an MSE of $\\frac{2}{4} = 0.5$.\n\n' +
        'Now Model B, $\\hat{y} = 1.5x + 2$:\n\n| $x$ | $y$ | $\\hat{y}$ | Error | Error squared |\n|---|---|---|---|---|\n| 1 | 3 | 3.5 | $-0.5$ | 0.25 |\n| 2 | 6 | 5 | 1 | 1 |\n| 3 | 7 | 6.5 | 0.5 | 0.25 |\n| 4 | 8 | 8 | 0 | 0 |\n\n' +
        'Model B\'s squared errors add up to $0.25 + 1 + 0.25 = 1.5$. Dividing by 4 gives $\\frac{1.5}{4} = 0.375$, which is lower than Model A\'s 0.5.',
      conclusion: 'Model B\'s error of 0.375 beats Model A\'s 0.5, so the answer is Model B, with MSE $0.375$.',
      whyWrong: [
        '$0.5$ is Model A\'s MSE, which is correct for Model A, but Model B\'s MSE ($0.375$) is lower, so Model A is not the better model.',
        'This averages Model A\'s signed errors $0$, $1$, $0$, $-1$ without squaring, so the $1$ and $-1$ cancel. Squared, they give an MSE of $0.5$, which is higher than Model B\'s $0.375$.',
        'This is Model B\'s **sum** of squared errors, $1.5$. It must be divided by the $4$ data points to get the MSE, $0.375$.',
        null,
      ],
      keyIdea: 'To compare models, build one table per model with prediction, error and error squared. Divide each total by the number of points. Square before adding, because positive and negative errors would otherwise cancel.',
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
      asking: 'Starting at 1, where is $w$ after two updates?',
      solution:
        'The update rule is $w_{\\text{new}} = w - \\eta \\times \\text{gradient}$. Here the gradient is $2w$, and $\\eta$ (the learning rate, which sets the step size) is 1.5.\n\n' +
        'First update, from $w = 1$. The gradient is $2 \\times 1 = 2$. So $w_1 = 1 - 1.5 \\times 2 = 1 - 3 = -2$.\n\n' +
        'The gradient depends on $w$, so we work it out again for the new value. At $w = -2$, the gradient is $2 \\times (-2) = -4$.\n\n' +
        'Second update, from $w = -2$: $w_2 = -2 - 1.5 \\times (-4) = -2 - (-6) = -2 + 6 = 4$.',
      conclusion: 'The steps are too big, so $w$ jumps over the minimum at 0 and gets further away each time: 1, then $-2$, then $4$.',
      whyWrong: [
        'This is $w_1 = -2$, the value after only **one** step. The question asks for two steps.',
        'This uses the size of the gradient but drops its sign in step 2: $-2 - 1.5 \\times 4 = -8$. The gradient at $w = -2$ is $2 \\times (-2) = -4$, which is negative.',
        'This adds $\\eta \\times$ gradient at each step ($w \\leftarrow w + 3w = 4w$), giving $4$ then $16$. Gradient descent subtracts.',
        null,
      ],
      keyIdea: 'For several steps, do one at a time and recalculate the gradient from the newest $w$, keeping its sign. Put brackets around negatives. If $w$ moves further from the minimum each step, the learning rate is too large.',
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
      asking: 'In $\\hat{y} = wx + b$, which letter tells you how steep the line is?',
      solution:
        'The **slope** (or gradient) of a line says how much $\\hat{y}$ goes up each time $x$ goes up by 1.\n\n' +
        'Try it with $\\hat{y} = 2x + 5$. At $x = 1$, $\\hat{y} = 7$. At $x = 2$, $\\hat{y} = 9$. So $\\hat{y}$ rises by 2 for each extra 1 in $x$, and 2 is the number multiplying $x$.\n\n' +
        'In $\\hat{y} = wx + b$, the number multiplying $x$ is $w$, so that is the slope.',
      conclusion: 'The number multiplying $x$ sets how steep the line is, so the answer is $w$.',
      whyWrong: [
        null,
        '$b$ is the **intercept**: the value of $\\hat{y}$ when $x = 0$. It moves the line up or down without changing its slope.',
        '$x$ is the input variable, not a fixed property of the line.',
        '$\\hat{y}$ is the prediction, the output of the model.',
      ],
      keyIdea: 'Compare with $y = mx + c$ from school maths. The number multiplying $x$ is the slope, and the number added on its own is the intercept, whatever letters are used.',
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
      asking: 'What changes when you change the learning rate?',
      solution:
        'Gradient descent improves a model through repeated changes to a weight $w$: $w_{\\text{new}} = w - \\eta \\times \\text{gradient}$. The **learning rate** is $\\eta$.\n\n' +
        'The gradient says which way to move. $\\eta$ multiplies it, so $\\eta$ decides how far we move each time. With a gradient of 4, $\\eta = 0.1$ moves $w$ by 0.4, but $\\eta = 0.5$ moves it by 2.',
      conclusion: '$\\eta$ scales how far each update moves the weight, so the answer is The size of each update step.',
      whyWrong: [
        null,
        'The number of features is fixed by the data, not by the update rule.',
        'The number of examples is fixed by the dataset. The learning rate only scales the step taken with them.',
        'The final loss is a result of training. The learning rate affects it only indirectly, through the steps taken.',
      ],
      keyIdea: 'Look at where a symbol sits in the update rule. In $w - \\eta \\times \\text{gradient}$, the gradient gives the direction and $\\eta$ scales the distance. Features and examples come from the data, and the loss is a result.',
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
      asking: 'What does the word residual mean in regression?',
      solution:
        'A regression model draws a line through data. For each data point there is the real value and the value the line predicts. They are rarely equal.\n\n' +
        'The **residual** is the gap between them, measured as actual minus predicted. For example, if the actual value is 7 and the prediction is 5, the residual is $7 - 5 = 2$.',
      conclusion: 'A residual is the error left over at a point, so it is the Actual value minus predicted value.',
      whyWrong: [
        null,
        'This has the sign reversed. The residual is defined as actual minus predicted.',
        'Squaring is used on the **residual** in the MSE. The square of a prediction is not a measure of error.',
        'The gradient describes the slope of the line. A residual is a vertical gap between a point and the line.',
      ],
      keyIdea: 'Think of the residual as what is left over after the prediction: actual $=$ predicted $+$ residual, which rearranges to residual $=$ actual $-$ predicted. A positive residual means the point is above the line.',
    },
  },
];

