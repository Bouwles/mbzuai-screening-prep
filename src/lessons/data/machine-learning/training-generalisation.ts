import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'training-generalisation',
  know:
    '### The goal: do well on data you have never seen\n\n' +
    'A model learns from examples, but what matters is how well it does on **new** examples it has never seen. This is called **generalisation**. This topic is about measuring it honestly and improving it.\n\n' +
    '### Training, validation and test sets\n\n' +
    'Before training, split the data into three parts, each with one job:\n\n' +
    '| Set | Its job | Typical share |\n' +
    '| --- | --- | --- |\n' +
    '| Training | the model learns its weights (parameters) from it | 60 to 80% |\n' +
    '| Validation | compare models and choose hyperparameters (e.g. $\\lambda$, polynomial degree) | 10 to 20% |\n' +
    '| Test | used **once**, at the very end, to estimate performance on new data | 10 to 20% |\n\n' +
    'Sizes are just percentages: with $1000$ examples and a $70/20/10$ split, the validation set has $0.2 \\times 1000 = 200$ examples. Check the three parts add back to the total.\n\n' +
    'If you choose a model because it scored best on the test set, the test set has been used for a decision and its score becomes **too optimistic**. Choose with validation, report with test.\n\n' +
    '### Overfitting and underfitting\n\n' +
    'Compare training error with validation error:\n\n' +
    '| Training error | Validation error | Diagnosis |\n' +
    '| --- | --- | --- |\n' +
    '| low | much higher (big gap) | **overfitting** (high variance) |\n' +
    '| high | high, small gap | **underfitting** (high bias) |\n' +
    '| low | low, small gap | good fit |\n\n' +
    'An **overfitting** model has memorised the training data, noise included, like a student who memorises past papers word for word. An **underfitting** model is too simple to capture the pattern, like fitting a straight line to a curve. Note that a small gap alone does not mean "good": if both errors are bad, the model is underfitting.\n\n' +
    '### The bias-variance trade-off\n\n' +
    '- **Bias** is error from a model that is too simple (it misses the pattern).\n' +
    '- **Variance** is error from a model that is too sensitive to the particular training data (it chases noise).\n\n' +
    'As a model gets more complex (higher polynomial degree, more layers), **training error keeps going down**, but **validation error falls and then rises**, making a U-shape. The best complexity is at the **bottom of the validation curve**. Left of it is underfitting, right of it is overfitting. Never choose by training error: that always picks the most complex model.\n\n' +
    'Fixes:\n\n' +
    '- **Overfitting (high variance):** more training data, regularisation, a simpler model, fewer features, early stopping.\n' +
    '- **Underfitting (high bias):** a more flexible model, more informative features, less regularisation. More data does **not** help here.\n\n' +
    '### Cross-validation (k-fold)\n\n' +
    'One validation set can be lucky or unlucky. In **$k$-fold cross-validation** you cut the data into $k$ equal folds. Each round, one fold is the validation set and the other $k - 1$ folds are the training set. After $k$ rounds every fold has been the validation set exactly once. The **cross-validation score is the mean** of the $k$ fold scores.\n\n' +
    'With $N = 1000$ and $k = 5$: each fold has $200$ examples, each round trains on $4 \\times 200 = 800$, and $5$ models are trained. Trying $h$ hyperparameter settings means $h \\times k$ models, plus $1$ final model retrained on all the data with the best setting.\n\n' +
    '### Regularisation\n\n' +
    'Overfitting models often have very large weights. **Regularisation** adds a penalty for large weights to the loss, so the model prefers smaller weights and a smoother, simpler fit:\n\n' +
    '- **L2 (ridge):** add $\\lambda \\sum w_i^2$. Square each weight, so $(-3)^2 = 9$, never negative.\n' +
    '- **L1 (lasso):** add $\\lambda \\sum |w_i|$. Can push some weights to exactly $0$.\n\n' +
    'Bigger $\\lambda$ means a simpler model (less variance, more bias); $\\lambda = 0$ means no regularisation. $\\lambda$ is a hyperparameter, chosen with the validation set.\n\n' +
    '### Feature scaling\n\n' +
    'Features on very different scales (age in years vs salary in AED) can confuse methods that use distances or gradient descent. Two standard fixes:\n\n' +
    '- **Min-max scaling:** $x\' = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}$. The minimum becomes $0$, the maximum becomes $1$.\n' +
    '- **Standardisation:** $z = \\frac{x - \\mu}{\\sigma}$. The result has mean $0$ and standard deviation $1$; $z = 2$ means "two standard deviations above the mean".\n\n' +
    'The minimum, maximum, mean and standard deviation are computed from the **training set only**, then the same numbers are applied to validation and test data. So a test value above the training maximum gets a scaled value **above 1**, and that is fine.\n\n' +
    '### Data leakage\n\n' +
    '**Data leakage** is when information the model would not have at prediction time sneaks into training. The test score then looks better than reality. Common causes:\n\n' +
    '- computing scaling statistics on the **whole** dataset before splitting;\n' +
    '- duplicate examples appearing in both training and test sets;\n' +
    '- a feature that is only known **after** the outcome (e.g. "was prescribed insulin" when predicting diabetes);\n' +
    '- tuning on the test set.\n\n' +
    'A suspiciously perfect score (like $99.8\\%$) is the classic warning sign.',
  formulas: [
    { label: 'Size of a data split', tex: 'n_{\\text{set}} = \\frac{p}{100} \\times N', note: '$p$ = percentage for that set; the three sets add up to $N$.' },
    { label: 'Generalisation gap', tex: '\\text{gap} = \\text{validation error} - \\text{training error}', note: 'Big gap: overfitting. Both errors high with a small gap: underfitting.' },
    { label: 'k-fold: size of one fold', tex: '\\text{fold size} = \\frac{N}{k}', note: 'One fold is the validation set in each round.' },
    { label: 'k-fold: training examples per round', tex: '\\frac{k - 1}{k} \\times N' },
    { label: 'Cross-validation score', tex: '\\text{CV score} = \\frac{s_1 + s_2 + \\cdots + s_k}{k}', note: 'The mean of the $k$ fold scores.' },
    { label: 'Models trained when tuning', tex: 'h \\times k + 1', note: '$h$ settings, $k$ folds each, plus one final model on all the data.' },
    { label: 'L2 regularised loss', tex: 'J = \\text{MSE} + \\lambda \\sum w_i^2' },
    { label: 'L1 regularised loss', tex: 'J = \\text{MSE} + \\lambda \\sum |w_i|' },
    { label: 'Min-max scaling', tex: "x' = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}", note: 'Use the TRAINING min and max, even for test data.' },
    { label: 'Standardisation (z-score)', tex: 'z = \\frac{x - \\mu}{\\sigma}', note: 'Divide by the standard deviation, not the variance.' },
    { label: 'Population standard deviation', tex: '\\sigma = \\sqrt{\\frac{\\sum (x_i - \\mu)^2}{n}}' },
  ],
  examples: [
    {
      title: 'Diagnose the fit from a table',
      problem: 'Model P has training accuracy $97\\%$ and validation accuracy $68\\%$. Model Q has training accuracy $58\\%$ and validation accuracy $56\\%$. Describe each model.',
      steps: [
        'Model P: the gap is $97 - 68 = 29$ percentage points. Very good on training data, much worse on new data.',
        'A big gap means the model has memorised the training data: **overfitting** (high variance).',
        'Model Q: the gap is only $58 - 56 = 2$ points, but both accuracies are low.',
        'Bad on both sets with a small gap means the model is too simple: **underfitting** (high bias).',
      ],
      answer: 'P is overfitting (high variance); Q is underfitting (high bias).',
    },
    {
      title: 'Min-max scaling a test value',
      problem: 'In the training data a feature has minimum $30$ and maximum $80$. Scale the test value $90$ using min-max scaling.',
      steps: [
        'Use the **training** minimum and maximum: the range is $80 - 30 = 50$.',
        'Subtract the minimum: $90 - 30 = 60$.',
        'Divide by the range: $\\frac{60}{50} = 1.2$.',
        'The answer is above $1$ because $90$ is above the training maximum. That is correct; do not "clip" it to $1$ or refit the scaler on the test data.',
      ],
      answer: '$1.2$',
    },
    {
      title: 'Standardise from a small dataset',
      problem: 'The training values of a feature are $3, 5, 7, 9, 11$. Using the mean and population standard deviation, find the z-score of $13$.',
      steps: [
        'Mean: $\\mu = \\frac{3 + 5 + 7 + 9 + 11}{5} = \\frac{35}{5} = 7$.',
        'Deviations from $7$: $-4, -2, 0, 2, 4$. Squares: $16, 4, 0, 4, 16$, total $40$.',
        'Variance $= \\frac{40}{5} = 8$, so $\\sigma = \\sqrt{8} \\approx 2.828$.',
        'z-score: $z = \\frac{13 - 7}{\\sqrt{8}} = \\frac{6}{2.828} \\approx 2.12$ (to 2 d.p.).',
        'Check: dividing by the variance would give $\\frac{6}{8} = 0.75$, which is the classic wrong answer.',
      ],
      answer: '$z \\approx 2.12$',
    },
    {
      title: 'Cross-validation and regularisation together',
      problem: 'A team tries $3$ values of $\\lambda$ with $5$-fold cross-validation on $800$ examples, then retrains the best one on all the data. (a) How many examples train each model during cross-validation? (b) How many models are trained in total? (c) The best model has MSE $1.8$ and weights $w_1 = 2$, $w_2 = -3$ with $\\lambda = 0.1$. What is its L2 regularised loss?',
      steps: [
        '(a) Fold size $= \\frac{800}{5} = 160$. Each round trains on $5 - 1 = 4$ folds: $4 \\times 160 = 640$ examples.',
        '(b) Each $\\lambda$ needs $5$ models: $3 \\times 5 = 15$. Add the final model: $15 + 1 = 16$.',
        '(c) Sum of squares: $2^2 + (-3)^2 = 4 + 9 = 13$.',
        'Penalty: $0.1 \\times 13 = 1.3$.',
        'Regularised loss: $1.8 + 1.3 = 3.1$.',
      ],
      answer: '(a) $640$ (b) $16$ (c) $3.1$',
    },
  ],
  traps: [
    'Choosing the model (or $\\lambda$) using the **test** set. That turns the test set into a validation set and makes the reported score too optimistic.',
    'Thinking "training and validation errors are close" always means a good fit. If both are high, the model is underfitting (high bias).',
    'Thinking more data fixes everything. More data helps overfitting (high variance) but not underfitting: if even the training error is high, you need a more flexible model.',
    'Computing the mean, standard deviation, min or max on the **whole** dataset before splitting. That is data leakage; fit the scaler on the training set only.',
    'Dividing by the variance instead of the standard deviation in a z-score, or dividing by the maximum instead of the range in min-max scaling.',
    'In L2 regularisation, writing $(-3)^2 = -9$, or squaring the sum of the weights instead of summing the squares. Every squared weight is positive.',
  ],
  examTip:
    'Concept questions usually give a table or a graph of training vs validation error: work out the **gap** and the **level** of each, then match to overfitting (big gap), underfitting (both high) or good fit. On an error-vs-complexity graph, the best model is at the lowest point of the **validation** curve. For calculations, the wrong options are built from standard slips, so check yours against them: in min-max scaling, the minimum must map to $0$ and the maximum to $1$; a z-score must be positive for a value above the mean; a k-fold training count must be **less** than the whole dataset; a regularised loss can never be **smaller** than the plain MSE (the penalty is never negative). For "which is data leakage" questions, look for anything that lets test-set information, or information only known after the outcome, reach training.',
};
