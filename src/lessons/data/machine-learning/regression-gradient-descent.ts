import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'regression-gradient-descent',
  know:
    '### The big picture\n\n' +
    'A machine learning model is a formula with adjustable numbers inside it, called **parameters** (or **weights**). **Training** means finding the values of those numbers that make the model\'s predictions as good as possible. To do that we need three things: a **model** (how predictions are made), a **loss** (one number that measures how bad the predictions are) and an **optimiser** (a method that changes the weights to make the loss smaller). In this topic the models are linear and logistic regression, the losses are MSE and cross-entropy, and the optimiser is gradient descent.\n\n' +
    '### Linear regression: predicting a number\n\n' +
    'Linear regression predicts a **continuous** quantity (a price, a temperature, a score) with a straight line:\n\n' +
    '$$\\hat{y} = wx + b$$\n\n' +
    'Here $x$ is the input, $w$ is the **weight** (the slope: how much $\\hat{y}$ goes up when $x$ goes up by $1$), $b$ is the **bias** (the intercept: the prediction when $x = 0$) and $\\hat{y}$ ("y-hat") is the prediction. The true value is $y$. With several inputs it becomes $\\hat{y} = w_1x_1 + w_2x_2 + b$. To make a prediction, **multiply first, then add the bias**.\n\n' +
    'The **error** (or **residual**) for one point is actual minus predicted, $y - \\hat{y}$. A positive residual means the point lies above the line (the model predicted too low).\n\n' +
    '### Mean squared error (MSE)\n\n' +
    'To judge the whole line we combine the errors into one number. We cannot just add them, because positive and negative errors cancel out. So we **square** each error (making it positive and punishing big errors much more), then take the **mean**:\n\n' +
    '$$\\text{MSE} = \\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2$$\n\n' +
    'Recipe: predict every point, subtract, square, add up, **divide by $n$**. A table with columns $x$, $y$, $\\hat{y}$, $y - \\hat{y}$ and $(y - \\hat{y})^2$ makes this fast and safe. The model with the **smaller** MSE fits better.\n\n' +
    '### Logistic regression: predicting a class\n\n' +
    'Despite the name, **logistic regression is for classification** (spam or not spam, pass or fail). It first computes the same linear score $z = wx + b$, then squashes it into a probability between $0$ and $1$ with the **sigmoid** function:\n\n' +
    '$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$\n\n' +
    '| $z$ | $-3$ | $-1$ | $0$ | $1$ | $3$ |\n' +
    '| --- | --- | --- | --- | --- | --- |\n' +
    '| $\\sigma(z)$ | $0.05$ | $0.27$ | $0.5$ | $0.73$ | $0.95$ |\n\n' +
    'The output $p = \\sigma(z)$ is the probability of class 1. Usually the model predicts class 1 when $p \\ge 0.5$. Because $\\sigma(0) = 0.5$, this is the same as checking whether $z \\ge 0$: the **decision boundary** is where $wx + b = 0$. Also notice $\\sigma(-z) = 1 - \\sigma(z)$.\n\n' +
    '### Cross-entropy loss\n\n' +
    'For probabilities we use **binary cross-entropy** (log loss) instead of MSE:\n\n' +
    '$$L = -\\left[y\\ln p + (1 - y)\\ln(1 - p)\\right]$$\n\n' +
    'Only one term survives. If $y = 1$ the loss is $-\\ln p$; if $y = 0$ the loss is $-\\ln(1 - p)$. In words: take minus the log of the probability the model gave to the **true** class. Confident and right (probability near $1$) gives a loss near $0$; confident and wrong gives a huge loss. Average over the examples for the mean loss.\n\n' +
    '### Gradient descent: walking downhill\n\n' +
    'Picture the loss as a valley, with the weight $w$ along the ground. The **gradient** $\\frac{\\partial L}{\\partial w}$ is the slope of the valley where you stand: it is the **derivative of the loss with respect to the weight** (not the input, and not the prediction). A positive gradient means the loss goes up if $w$ increases, so we should decrease $w$; a negative gradient means we should increase $w$. Either way, we step **against** the gradient:\n\n' +
    '$$w_{\\text{new}} = w - \\eta\\frac{\\partial L}{\\partial w}$$\n\n' +
    'The **learning rate** $\\eta$ (eta) controls the step size. The bias is updated the same way with $\\frac{\\partial L}{\\partial b}$. Repeat many times and the weights slide down to the bottom of the valley, where the gradient is $0$. Near the bottom the gradient shrinks, so the steps get smaller automatically.\n\n' +
    'For one example with squared error $L = (wx - y)^2$, the chain rule gives $\\frac{dL}{dw} = 2(wx - y)x$: two times (prediction minus actual) times the input. Careful with the sign: the gradient uses $\\hat{y} - y$, which is the **opposite** of the residual $y - \\hat{y}$. For example, with a positive input $x$: if the model predicts too low, $\\hat{y} - y$ is negative, so the gradient is negative and the update makes $w$ bigger.\n\n' +
    '### Choosing the learning rate\n\n' +
    '| Learning rate | What happens to the loss |\n' +
    '| --- | --- |\n' +
    '| Too small | Falls, but very slowly (many tiny steps) |\n' +
    '| About right | Falls quickly, then levels off at the minimum |\n' +
    '| Too large | Overshoots the minimum, bounces from side to side, may grow (diverge) |\n\n' +
    'For $L(w) = w^2$ the update is $w \\leftarrow (1 - 2\\eta)w$: with $\\eta = 0.1$ the weight shrinks smoothly, but with $\\eta = 1.5$ it doubles in size and flips sign every step.',
  formulas: [
    { label: 'Linear regression prediction', tex: '\\hat{y} = wx + b \\qquad \\hat{y} = w_1x_1 + w_2x_2 + b', note: '$w$ = weight (slope), $b$ = bias (intercept).' },
    { label: 'Residual (error)', tex: 'e = y - \\hat{y}', note: 'Actual minus predicted; positive means the point is above the line.' },
    { label: 'Mean squared error', tex: '\\text{MSE} = \\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2', note: 'Square each error, add, divide by the number of points.' },
    { label: 'Sigmoid function', tex: '\\sigma(z) = \\frac{1}{1 + e^{-z}}, \\qquad \\sigma(0) = 0.5, \\qquad \\sigma(-z) = 1 - \\sigma(z)', note: 'Output is always strictly between $0$ and $1$.' },
    { label: 'Logistic regression', tex: 'p = \\sigma(wx + b), \\qquad \\text{class } 1 \\iff p \\ge 0.5 \\iff wx + b \\ge 0', note: 'The decision boundary is $wx + b = 0$.' },
    { label: 'Binary cross-entropy', tex: 'L = -\\left[y\\ln p + (1 - y)\\ln(1 - p)\\right]', note: 'Equals $-\\ln p$ when $y = 1$ and $-\\ln(1 - p)$ when $y = 0$.' },
    { label: 'Gradient descent update', tex: 'w \\leftarrow w - \\eta\\frac{\\partial L}{\\partial w}, \\qquad b \\leftarrow b - \\eta\\frac{\\partial L}{\\partial b}', note: '$\\eta$ = learning rate. Always subtract.' },
    { label: 'Gradient of squared error (one example)', tex: 'L = (wx + b - y)^2 \\;\\Rightarrow\\; \\frac{\\partial L}{\\partial w} = 2(\\hat{y} - y)x, \\quad \\frac{\\partial L}{\\partial b} = 2(\\hat{y} - y)' },
    { label: 'Gradient of MSE (n examples)', tex: '\\frac{\\partial L}{\\partial w} = \\frac{2}{n}\\sum_{i=1}^{n}(\\hat{y}_i - y_i)x_i, \\qquad \\frac{\\partial L}{\\partial b} = \\frac{2}{n}\\sum_{i=1}^{n}(\\hat{y}_i - y_i)' },
  ],
  examples: [
    {
      title: 'A prediction and a residual',
      problem: 'A model predicts a taxi fare (AED) from the distance $x$ (km) with $\\hat{y} = 3x + 5$. A 4 km ride actually cost AED 20. Find the prediction and the residual.',
      steps: [
        'Prediction: multiply first, then add the bias: $\\hat{y} = 3 \\times 4 + 5 = 12 + 5 = 17$.',
        'Residual = actual minus predicted: $20 - 17 = 3$.',
        'The residual is positive, so the real fare is above the line: the model under-predicted by AED 3.',
      ],
      answer: 'Prediction AED 17, residual $3$.',
    },
    {
      title: 'Computing MSE from a table',
      problem: 'A model $\\hat{y} = 2x + 1$ is tested on the points $(1, 4)$, $(2, 4)$, $(3, 7)$ and $(4, 10)$. Find the MSE.',
      steps: [
        'Predictions: $\\hat{y} = 3, 5, 7, 9$ for $x = 1, 2, 3, 4$.',
        'Errors $y - \\hat{y}$: $4 - 3 = 1$, $4 - 5 = -1$, $7 - 7 = 0$, $10 - 9 = 1$.',
        'Squares: $1$, $1$, $0$, $1$. Their sum is $3$.',
        'Divide by the number of points: $\\text{MSE} = \\frac{3}{4} = 0.75$.',
      ],
      answer: '$\\text{MSE} = 0.75$',
    },
    {
      title: 'Logistic regression and cross-entropy',
      problem: 'A logistic regression model has $z = 2x - 5$. For $x = 3$, find $p = \\sigma(z)$ to 2 decimal places, the predicted class (threshold $0.5$), and the cross-entropy loss if the true label is $y = 1$.',
      steps: [
        'Linear part: $z = 2 \\times 3 - 5 = 1$.',
        'Sigmoid: $e^{-1} \\approx 0.3679$, so $p = \\frac{1}{1 + 0.3679} \\approx 0.7311 \\approx 0.73$.',
        'Class: $0.73 \\ge 0.5$ (equivalently $z = 1 \\ge 0$), so the model predicts class 1.',
        'Loss with $y = 1$: only the first term survives, $L = -\\ln 0.7311 \\approx 0.31$.',
      ],
      answer: '$p \\approx 0.73$, class 1, loss $\\approx 0.31$',
    },
    {
      title: 'Two gradient descent steps',
      problem: 'Gradient descent is used on $L(w) = (w - 6)^2$, starting at $w_0 = 2$ with learning rate $\\eta = 0.25$. Find $w_1$ and $w_2$.',
      steps: [
        'Differentiate: $L\'(w) = 2(w - 6)$.',
        'Step 1: gradient $L\'(2) = 2 \\times (-4) = -8$, so $w_1 = 2 - 0.25 \\times (-8) = 2 + 2 = 4$.',
        'Step 2: recompute the gradient at the new weight, $L\'(4) = 2 \\times (-2) = -4$, so $w_2 = 4 - 0.25 \\times (-4) = 4 + 1 = 5$.',
        'Sense check: $w$ moves $2 \\to 4 \\to 5$, towards the minimum at $6$, with smaller steps as the slope flattens.',
      ],
      answer: '$w_1 = 4$, $w_2 = 5$',
    },
  ],
  traps: [
    'Adding instead of subtracting in the update. $w + \\eta \\times \\text{gradient}$ is gradient **ascent** and makes the loss bigger. With a negative gradient, subtracting a negative means $w$ goes **up**.',
    'Forgetting to divide by $n$ in MSE (that gives the sum of squared errors), or forgetting to square (positive and negative errors cancel).',
    'Thinking logistic regression predicts a continuous number. It is a **classification** model: it outputs a probability and then a class.',
    'Losing the minus sign in $e^{-z}$. A positive $z$ must give $p > 0.5$ and a negative $z$ must give $p < 0.5$: check the sign before trusting your calculator.',
    'Differentiating with respect to the wrong thing. Gradient descent uses the derivative of the **loss** with respect to the **weights**, not the inputs, and must include the chain-rule factor $x$ in $2(wx - y)x$.',
    'Believing a bigger learning rate is always faster. Too large a learning rate overshoots the minimum, so the loss oscillates or explodes.',
  ],
  examTip:
    'Expect short calculations (a prediction, a residual, an MSE from a small table, one or two update steps, a sigmoid value) and concept questions (which model for which task, what gradient descent differentiates, what a learning-rate curve means). Wrong options are built from the classic slips, so use them to check yourself: in an update question, the option that moved $w$ the wrong way (away from the minimum) is the ascent mistake, and an answer that is exactly double or half another option usually means a lost factor $2$ or a forgotten $\\frac{1}{n}$. For MSE, the sum of squared errors will be sitting among the options, so make sure you divided by $n$. For sigmoid questions, eliminate anything outside $0$ to $1$ and anything on the wrong side of $0.5$ for the sign of $z$. On the calculator, type $1 \\div (1 + e^{-z})$ with brackets. If a "Both A and B" option appears, check each statement separately before choosing.',
};
