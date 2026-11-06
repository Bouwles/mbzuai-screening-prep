import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';
import { mean, sd, sumOf } from '../../../lib/mathx';

const minMax = (x: number, lo: number, hi: number): number => (x - lo) / (hi - lo);

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'training-generalisation-001',
    subtopic: 'training-generalisation',
    difficulty: 'foundation',
    stem: 'A dataset is split into **training**, **validation** and **test** sets. What is the main purpose of the **test** set?',
    options: [
      'To learn the model\'s weights',
      'To compare settings and pick the best model',
      'To estimate how the final model performs on unseen data',
      'To give extra examples for more training',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Each part of the data has one job:\n\n' +
        '- **Training set**: the model learns its weights from it.\n' +
        '- **Validation set**: used to compare models / hyperparameters (for example the regularisation strength $\\lambda$) and choose the best one.\n' +
        '- **Test set**: kept locked away until the very end, then used **once** to estimate how well the chosen model will do on brand-new data.\n\n' +
        'Because the test set played no part in training or choosing the model, its score is an honest (unbiased) estimate of real-world performance.',
      whyWrong: [
        'Learning the weights is the job of the **training** set, not the test set.',
        'Comparing settings and choosing a model is the job of the **validation** set. If you used the test set for this, its score would no longer be an honest estimate.',
        null,
        'The test set must never be used for training at all; training on it would make its score meaningless as a measure of performance on unseen data.',
      ],
      keyIdea: 'Train on the training set, choose with the validation set, and report the final performance once on the untouched test set.',
    },
  },
  {
    id: 'training-generalisation-002',
    subtopic: 'training-generalisation',
    difficulty: 'foundation',
    stem: 'A feature has a training minimum of $10$ and a maximum of $60$. Using **min-max scaling** to the range $[0, 1]$, what is the scaled value of $40$?',
    options: ['$\\frac{2}{3}$', '$0.5$', '$0.4$', '$0.6$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Min-max scaling subtracts the minimum and divides by the **range** (max minus min):\n\n' +
        '$$x\' = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}$$\n\n' +
        'Here $x_{\\min} = 10$ and $x_{\\max} = 60$, so the range is $60 - 10 = 50$.\n\n' +
        '$$x\' = \\frac{40 - 10}{50} = \\frac{30}{50} = 0.6$$\n\n' +
        'Sanity check: $10$ maps to $0$, $60$ maps to $1$, and $40$ is three-fifths of the way from $10$ to $60$.',
      whyWrong: [
        'This is $\\frac{40}{60}$: it divides by the maximum and forgets to subtract the minimum at all.',
        'This is $\\frac{40 - 10}{60}$: it subtracts the minimum on top but divides by the maximum instead of the range $60 - 10 = 50$.',
        'This is $\\frac{60 - 40}{50}$: the subtraction is the wrong way round (distance from the maximum instead of from the minimum).',
        null,
      ],
      keyIdea: 'Min-max scaling: subtract the minimum, then divide by the range (max minus min).',
    },
    check: {
      optionValues: [2 / 3, 0.5, 0.4, 0.6],
      compute: () => minMax(40, 10, 60),
    },
  },
  {
    id: 'training-generalisation-003',
    subtopic: 'training-generalisation',
    difficulty: 'foundation',
    stem: 'The table shows the training and validation accuracy of four models on the same task. Which model is **overfitting**?',
    table: {
      headers: ['Model', 'Training accuracy (%)', 'Validation accuracy (%)'],
      rows: [
        ['W', 62, 60],
        ['X', 99, 71],
        ['Y', 91, 89],
        ['Z', 85, 86],
      ],
    },
    options: ['Model W', 'Model X', 'Model Y', 'Model Z'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Overfitting** means the model has memorised the training data (including its noise), so it scores very well on training data but much worse on new data. The sign is a **large gap**: training accuracy much higher than validation accuracy.\n\n' +
        '| Model | Training | Validation | Gap | Verdict |\n' +
        '|---|---|---|---|---|\n' +
        '| W | 62 | 60 | 2 | both low: underfitting |\n' +
        '| X | 99 | 71 | 28 | huge gap: **overfitting** |\n' +
        '| Y | 91 | 89 | 2 | both high: good fit |\n' +
        '| Z | 85 | 86 | $-1$ | no gap: not overfitting |\n\n' +
        'Model X is almost perfect on the training data but drops 28 percentage points on unseen data, so it is overfitting.',
      whyWrong: [
        'Model W has low accuracy on **both** sets with a tiny gap. That is underfitting (too simple), the opposite of overfitting.',
        null,
        'Model Y is high on both sets with only a 2-point gap; this is the best-generalising model, not an overfitting one.',
        'Model Z does about the same on both sets (validation is even 1 point higher, which is just random variation), so there is no sign of overfitting.',
      ],
      keyIdea: 'Overfitting shows up as high training performance with much lower validation performance (a big gap).',
    },
  },
  {
    id: 'training-generalisation-004',
    subtopic: 'training-generalisation',
    difficulty: 'foundation',
    stem: 'A dataset of $1500$ examples is split into $70\\%$ training, $20\\%$ validation and $10\\%$ test. How many examples are in the **validation** set?',
    options: ['$1050$', '$150$', '$300$', '$450$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The validation set is $20\\%$ of the data:\n\n' +
        '$$0.20 \\times 1500 = 300$$\n\n' +
        'Check that the three parts add up: training $0.70 \\times 1500 = 1050$, test $0.10 \\times 1500 = 150$, and $1050 + 300 + 150 = 1500$.',
      whyWrong: [
        'This is $70\\%$ of $1500$, the size of the **training** set.',
        'This is $10\\%$ of $1500$, the size of the **test** set.',
        null,
        'This is $30\\%$ of $1500$: the validation and test sets added together, not the validation set alone.',
      ],
      keyIdea: 'Each split size is its percentage times the total number of examples, and the parts must add back to the total.',
    },
    check: {
      optionValues: [1050, 150, 300, 450],
      compute: () => new Frac(20, 100).mul(1500).value(),
    },
  },
  {
    id: 'training-generalisation-005',
    subtopic: 'training-generalisation',
    difficulty: 'foundation',
    stem: 'Good models reach about $5\\%$ error on a task. A model has training error $35\\%$ and validation error $37\\%$. What is most likely happening?',
    options: [
      'Overfitting (high variance)',
      'A good fit, because the two errors are close',
      'Data leakage from the validation set',
      'Underfitting (high bias)',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Look at two things: **how big** the errors are and **how big the gap** is.\n\n' +
        '- Training error $35\\%$ is far worse than the $5\\%$ that good models achieve, so the model cannot even fit the data it was trained on.\n' +
        '- The gap is only $37 - 35 = 2$ percentage points, so it is not memorising the training data.\n\n' +
        'High error on **both** sets with a small gap means the model is too simple to capture the pattern: it is **underfitting**, also called **high bias**. A more flexible model or better features would help.',
      whyWrong: [
        'Overfitting needs a **low** training error and a much higher validation error. Here the training error is high and the gap is only 2 points.',
        'A small gap alone does not mean a good fit: both errors are about seven times worse than what good models achieve. Close but bad means underfitting.',
        'Leakage usually makes validation results look **suspiciously good**, not poor. Nothing here suggests leakage.',
        null,
      ],
      keyIdea: 'High training error and high validation error (small gap) = underfitting / high bias.',
    },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'training-generalisation-006',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    stem: 'A feature has training values $2, 4, 4, 4, 5, 5, 7, 9$. Using their mean and **population** standard deviation (divide by $n$), what is the standardised value (z-score) of $9$?',
    options: ['$4$', '$2$', '$4.5$', '$1$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Standardisation: $z = \\frac{x - \\mu}{\\sigma}$.\n\n' +
        '**Step 1: the mean.** $\\mu = \\frac{2 + 4 + 4 + 4 + 5 + 5 + 7 + 9}{8} = \\frac{40}{8} = 5$.\n\n' +
        '**Step 2: the standard deviation.** Deviations from $5$: $-3, -1, -1, -1, 0, 0, 2, 4$. Squared: $9, 1, 1, 1, 0, 0, 4, 16$, which add to $32$.\n\n' +
        'Population variance $= \\frac{32}{8} = 4$, so $\\sigma = \\sqrt{4} = 2$.\n\n' +
        '**Step 3: standardise.** $z = \\frac{9 - 5}{2} = \\frac{4}{2} = 2$.\n\n' +
        'So $9$ is $2$ standard deviations above the mean.',
      whyWrong: [
        'This is $9 - 5 = 4$: it subtracts the mean but forgets to divide by the standard deviation.',
        null,
        'This is $\\frac{9}{2}$: it divides by the standard deviation but forgets to subtract the mean first.',
        'This is $\\frac{9 - 5}{4}$: it divides by the **variance** ($4$) instead of the standard deviation ($\\sqrt{4} = 2$).',
      ],
      keyIdea: 'A z-score is (value minus mean) divided by the standard deviation, not the variance.',
    },
    check: {
      optionValues: [4, 2, 4.5, 1],
      compute: () => {
        const xs = [2, 4, 4, 4, 5, 5, 7, 9];
        return (9 - mean(xs)) / sd(xs);
      },
    },
  },
  {
    id: 'training-generalisation-007',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    stem: 'A model is evaluated with **5-fold cross-validation** on a dataset of $1200$ examples. In each round, how many examples are used to **train** the model?',
    options: ['$960$', '$240$', '$1200$', '$4800$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'In $k$-fold cross-validation the data is cut into $k$ equal folds. Each round, **one** fold is held out for validation and the other $k - 1$ folds are used for training. Over the $k$ rounds every fold takes one turn as the validation fold.\n\n' +
        '- Fold size: $\\frac{1200}{5} = 240$ examples.\n' +
        '- Training folds per round: $5 - 1 = 4$.\n' +
        '- Training examples per round: $4 \\times 240 = 960$.\n\n' +
        'Equivalently, $\\frac{4}{5} \\times 1200 = 960$. (Each example is used for validation exactly once and for training $4$ times.)',
      whyWrong: [
        null,
        'This is the size of **one** fold, $\\frac{1200}{5}$, which is the part held out for **validation** in each round.',
        'This forgets that one fold is held out every round; training on all $1200$ would leave nothing to validate on.',
        'This is $960 \\times 5$, the total number of training examples summed over all $5$ rounds, not the number in one round.',
      ],
      keyIdea: 'In $k$-fold cross-validation each round trains on $k - 1$ folds, a fraction $\\frac{k - 1}{k}$ of the data, and validates on the remaining fold.',
    },
    check: {
      optionValues: [960, 240, 1200, 4800],
      compute: () => {
        const n = 1200;
        const k = 5;
        return (n / k) * (k - 1);
      },
    },
  },
  {
    id: 'training-generalisation-008',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    stem: 'The table shows the fold accuracies of two models under 5-fold cross-validation. The model with the better **cross-validation accuracy** is chosen. What is that accuracy?',
    table: {
      headers: ['Fold', '1', '2', '3', '4', '5'],
      rows: [
        ['Model P', 0.8, 0.95, 0.7, 0.92, 0.73],
        ['Model Q', 0.85, 0.86, 0.84, 0.87, 0.83],
      ],
    },
    options: ['$0.95$', '$0.82$', '$0.87$', '$0.85$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The cross-validation score of a model is the **mean** of its $k$ fold scores.\n\n' +
        '- Model P: $\\frac{0.80 + 0.95 + 0.70 + 0.92 + 0.73}{5} = \\frac{4.10}{5} = 0.82$\n' +
        '- Model Q: $\\frac{0.85 + 0.86 + 0.84 + 0.87 + 0.83}{5} = \\frac{4.25}{5} = 0.85$\n\n' +
        'Q has the higher mean ($0.85 > 0.82$), so Q is chosen and its cross-validation accuracy is $0.85$.\n\n' +
        'Notice that Q is also much more **consistent** across folds, while P jumps between $0.70$ and $0.95$.',
      whyWrong: [
        'This is the single best fold of model P. One lucky fold says nothing about the average performance; you must average all $5$ folds.',
        'This is the mean accuracy of model P, which is the **lower** of the two means, so P would not be chosen.',
        'This is the best single fold of model Q, not its mean over all $5$ folds.',
        null,
      ],
      keyIdea: 'Cross-validation compares models by their mean score over all k folds, never by a single fold.',
    },
    check: {
      optionValues: [0.95, 0.82, 0.87, 0.85],
      compute: () => {
        const p = [0.8, 0.95, 0.7, 0.92, 0.73];
        const q = [0.85, 0.86, 0.84, 0.87, 0.83];
        return Math.max(mean(p), mean(q));
      },
    },
  },
  {
    id: 'training-generalisation-009',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    stem: 'Which of the following is an example of **data leakage**?',
    options: [
      'Training on $80\\%$ of the data and testing on the other $20\\%$',
      'Computing the scaling statistics from the **whole** dataset, then splitting it',
      'Choosing $\\lambda$ with the validation set',
      'Shuffling the data before splitting it',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Data leakage** happens when information that would not be available at prediction time (especially information from the test set) sneaks into training. The test score then looks better than the model really is.\n\n' +
        'If the scaling mean and standard deviation are computed from the **whole** dataset, the test examples have influenced those numbers, so the training process has "seen" part of the test set.\n\n' +
        'The correct order is: **split first**, compute the mean and standard deviation (or min and max) from the **training set only**, then apply those same numbers to the validation and test sets.',
      whyWrong: [
        'An 80/20 train/test split is a standard, correct practice; the test examples are kept separate from training.',
        null,
        'Choosing hyperparameters such as $\\lambda$ is exactly what the validation set is for. This is correct practice, as long as the test set is not used.',
        'Shuffling before splitting is good practice (it avoids, for example, all of one class ending up in the test set). It does not leak test information into training.',
      ],
      keyIdea: 'Fit every preprocessing step (scaling, etc.) on the training data only; using statistics from the test data is leakage.',
    },
  },
  {
    id: 'training-generalisation-010',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    stem: 'The graph shows training and validation error for polynomial models of degree $1$ to $8$. Which statement is correct?',
    chart: {
      kind: 'line',
      title: 'Error against polynomial degree',
      xLabel: 'Polynomial degree',
      yLabel: 'Mean squared error',
      categories: ['1', '2', '3', '4', '5', '6', '7', '8'],
      series: [
        { name: 'Training error', values: [40, 28, 18, 12, 9, 7, 5, 4] },
        { name: 'Validation error', values: [42, 31, 22, 17, 19, 24, 30, 38] },
      ],
    },
    options: [
      'Degree $8$ overfits: low training error, high validation error',
      'Degree $1$ overfits, because its two errors are almost equal',
      'Degree $8$ is best, because it has the lowest training error',
      'Degree $4$ has high bias, because validation error exceeds training error',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'Read the graph from left to right.\n\n' +
        '- **Degree 1**: training error $40$, validation error $42$. Both high, small gap: **underfitting** (high bias).\n' +
        '- **Degree 4**: validation error reaches its **minimum**, $17$. This is the best degree to choose.\n' +
        '- **Degree 8**: training error only $4$, but validation error has climbed to $38$. A gap of $34$: **overfitting** (high variance).\n\n' +
        'So the correct statement is that degree $8$ overfits. As complexity increases, training error keeps falling, but validation error falls and then rises again (a U-shape). That U-shape is the bias-variance trade-off.',
      whyWrong: [
        null,
        'Errors that are close **and both high** mean underfitting, not overfitting. Overfitting needs a low training error with a much higher validation error.',
        'Training error always keeps falling as the model gets more complex, so choosing by training error always picks the most complex model. You must choose by **validation** error, which is lowest at degree $4$.',
        'Validation error is almost always a bit higher than training error. At degree $4$ the validation error is the lowest of all, so this is the best balance between bias and variance, not high bias.',
      ],
      keyIdea: 'Choose the complexity with the lowest validation error; to the left is underfitting, to the right (low training error, rising validation error) is overfitting.',
    },
  },
  {
    id: 'training-generalisation-011',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    stem: 'A model has training mean squared error $2.5$ and weights $w_1 = 3$, $w_2 = -1$. **L2 regularisation** with $\\lambda = 0.1$ adds the penalty $\\lambda (w_1^2 + w_2^2)$. What is the regularised loss?',
    options: ['$2.9$', '$12.5$', '$3.5$', '$3.3$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Regularised loss $=$ MSE $+$ penalty.\n\n' +
        '**Step 1: square the weights.** $w_1^2 = 3^2 = 9$ and $w_2^2 = (-1)^2 = 1$ (a negative number squared is positive).\n\n' +
        '**Step 2: the penalty.** $\\lambda (w_1^2 + w_2^2) = 0.1 \\times (9 + 1) = 0.1 \\times 10 = 1$.\n\n' +
        '**Step 3: add to the MSE.** $2.5 + 1 = 3.5$.',
      whyWrong: [
        'This uses absolute values instead of squares, $0.1 \\times (3 + 1) = 0.4$, which is the **L1** penalty, not L2.',
        'This forgets to multiply the penalty by $\\lambda$: $2.5 + (9 + 1) = 12.5$.',
        null,
        'This treats $(-1)^2$ as $-1$, giving a penalty of $0.1 \\times (9 - 1) = 0.8$. A squared number is never negative.',
      ],
      keyIdea: 'L2 regularisation adds lambda times the sum of the squared weights to the loss, which punishes large weights.',
    },
    check: {
      optionValues: [2.9, 12.5, 3.5, 3.3],
      compute: () => {
        const w = [3, -1];
        return 2.5 + 0.1 * sumOf(w.map((x) => x * x));
      },
    },
  },
  {
    id: 'training-generalisation-012',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    stem: 'A model has $98\\%$ training accuracy but $75\\%$ validation accuracy.\n\nStatement 1: more training data is likely to help it generalise.\n\nStatement 2: regularisation that penalises large weights is likely to help.\n\nWhich is true?',
    options: [
      'Statement 1 only',
      'Statement 2 only',
      'Both statements',
      'Neither statement',
    ],
    correctIndex: 2,
    fixedOrder: true,
    markScheme: {
      solution:
        'A big gap between training and validation accuracy means **overfitting** (high variance): the model is flexible enough to memorise noise in the training set.\n\n' +
        '- **More training data** (Statement 1) makes it much harder to memorise every example, so the model is pushed to learn the real pattern. This reduces variance.\n' +
        '- **Regularisation** (Statement 2) adds a penalty for large weights. Smaller weights give a smoother, simpler model, which reduces variance.\n\n' +
        'Both statements are true.',
      whyWrong: [
        'More data does help, but regularisation also reduces overfitting, so Statement 2 is true as well.',
        'Regularisation does help, but collecting more data also reduces overfitting, so Statement 1 is true as well.',
        null,
        'Both are standard fixes for overfitting (high variance), so neither statement is false.',
      ],
      keyIdea: 'Overfitting (high variance) is reduced by more training data and by regularisation (a simpler, smoother model).',
    },
  },
  {
    id: 'training-generalisation-013',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    stem: 'A student tries $50$ hyperparameter settings, keeps the one with the best **test** accuracy, and reports that $94\\%$ as the accuracy to expect on new data. What is the main problem?',
    options: [
      'She tried too few settings',
      'The $94\\%$ is too optimistic: the test set chose the model',
      'She should have reported the training accuracy',
      'Nothing: hyperparameters should be tuned on the test set',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'By picking the setting with the **best** test score out of $50$, she has used the test set to make a decision. Some settings will score well on this particular test set partly by luck, and she chose exactly the luckiest one.\n\n' +
        'So $94\\%$ is an **optimistically biased** estimate: on genuinely new data the model will probably do worse.\n\n' +
        'The fix: choose the setting using a **validation** set (or cross-validation on the training data), then evaluate the single chosen model **once** on the test set.',
      whyWrong: [
        'Trying more settings and still choosing by test score makes the problem worse: the more settings you try, the more likely the best one is just lucky on this test set.',
        null,
        'Training accuracy is the **most** optimistic number of all, because the model has already seen those examples. It is not a fair estimate of performance on new data.',
        'Tuning hyperparameters is the job of the validation set. Once the test set is used for choosing, it cannot give an honest final estimate.',
      ],
      keyIdea: 'Never choose a model using the test set: tune on validation data and touch the test set only once at the end.',
    },
  },
  {
    id: 'training-generalisation-014',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    stem: 'A min-max scaler fitted on training data has minimum $20$ and maximum $100$. A test example has the value $110$. What is its scaled value?',
    options: ['$1.1$', '$1.375$', '$1.125$', '$1$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The scaler always uses the numbers it learned from the **training** data, even for test examples:\n\n' +
        '$$x\' = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}} = \\frac{110 - 20}{100 - 20} = \\frac{90}{80} = 1.125$$\n\n' +
        'Because $110$ is above the training maximum, the scaled value is above $1$. That is completely normal: min-max scaling only guarantees the range $[0, 1]$ for the training data itself.',
      whyWrong: [
        'This is $\\frac{110}{100}$: it divides by the maximum and forgets to subtract the minimum.',
        'This is $\\frac{110}{80}$: it divides by the correct range but forgets to subtract the minimum from the value first.',
        null,
        'This assumes scaled values can never go above $1$ (or refits the scaler with $110$ as the new maximum, which would leak test information). With the training minimum and maximum, a value outside the training range scales to outside $[0, 1]$.',
      ],
      keyIdea: 'Apply the training min and max to test data too, so test values outside the training range can scale below 0 or above 1.',
    },
    check: {
      optionValues: [1.1, 1.375, 1.125, 1],
      compute: () => minMax(110, 20, 100),
    },
  },
  {
    id: 'training-generalisation-015',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    stem: 'A model predicting diabetes scores $99.8\\%$ on the test set. One input feature is "currently prescribed insulin (yes/no)". What is the most likely explanation of the high score?',
    options: [
      'Underfitting: it relies on too few features',
      'It has generalised perfectly and is safe for screening',
      'The features were not scaled, which inflates accuracy',
      'Data leakage: insulin is usually prescribed **because** of a diabetes diagnosis',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'A score that looks too good to be true is a warning sign of **data leakage**.\n\n' +
        'Being prescribed insulin is a **consequence** of already being diagnosed with diabetes. In the historical data this feature almost perfectly reveals the label, so the model simply learns "insulin = yes means diabetes".\n\n' +
        'But the model is meant to help with patients who have **not yet** been diagnosed, and for them this feature will be "no". On real screening data the accuracy would collapse. The fix is to remove features that would not be available at the time the prediction is needed.',
      whyWrong: [
        'Underfitting gives **poor** accuracy on training and test data, not $99.8\\%$.',
        'The score is high only because the feature reveals the label. New undiagnosed patients will not yet be on insulin, so the model would perform badly on exactly the people it is meant for.',
        'Feature scaling can change how fast or how well some models train, but missing scaling does not create a suspiciously perfect score.',
        null,
      ],
      keyIdea: 'A feature that is only known after (or because of) the outcome leaks the answer and makes test scores unrealistically high.',
    },
  },
  {
    id: 'training-generalisation-016',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    stem: 'The values $10, 20, 35, 50$ are min-max scaled to the range $[0, 1]$. What are the scaled values?',
    options: [
      '$0.2, 0.4, 0.7, 1$',
      '$0, 0.25, 0.625, 1$',
      '$0, 0.2, 0.5, 0.8$',
      '$0.25, 0.5, 0.875, 1.25$',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'The minimum is $10$ and the maximum is $50$, so the range is $50 - 10 = 40$.\n\n' +
        'Min-max scaling is $x\' = \\frac{x - 10}{40}$:\n\n' +
        '| $x$ | $x - 10$ | $x\'$ |\n' +
        '|---|---|---|\n' +
        '| 10 | 0 | 0 |\n' +
        '| 20 | 10 | 0.25 |\n' +
        '| 35 | 25 | 0.625 |\n' +
        '| 50 | 40 | 1 |\n\n' +
        'The scaled values are $0, 0.25, 0.625, 1$.',
      whyWrong: [
        'This is $\\frac{x}{50}$: it forgets to subtract the minimum and divides by the maximum instead of the range.',
        null,
        'This is $\\frac{x - 10}{50}$: it subtracts the minimum but divides by the maximum. The largest value must map to $1$, so divide by the range, $40$.',
        'This is $\\frac{x}{40}$: it divides by the range but forgets to subtract the minimum, so the smallest value does not map to $0$.',
      ],
      keyIdea: 'Min-max scaling subtracts the minimum and divides by the range, which maps the minimum to 0 and the maximum to 1.',
    },
    check: {
      optionValues: ['0.2,0.4,0.7,1', '0,0.25,0.625,1', '0,0.2,0.5,0.8', '0.25,0.5,0.875,1.25'],
      compute: () => {
        const data = [10, 20, 35, 50];
        const lo = Math.min(...data);
        const hi = Math.max(...data);
        return data.map((x) => minMax(x, lo, hi)).join(',');
      },
    },
  },

  {
    id: 'training-generalisation-017',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    stem: 'A standardiser is fitted on training values $4, 8, 10, 12, 16$ using their mean and **population** standard deviation. A test example has the value $19$. What is its standardised value?',
    options: ['$2.25$', '$1.25$', '$0.5625$', '$4.75$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Fit the standardiser on the **training** values only, then apply it to the test value.\n\n' +
        '**Step 1: training mean.** $\\mu = \\frac{4 + 8 + 10 + 12 + 16}{5} = \\frac{50}{5} = 10$.\n\n' +
        '**Step 2: training standard deviation.** Deviations: $-6, -2, 0, 2, 6$. Squares: $36, 4, 0, 4, 36$, total $80$.\n\n' +
        'Variance $= \\frac{80}{5} = 16$, so $\\sigma = \\sqrt{16} = 4$.\n\n' +
        '**Step 3: standardise the test value.** $z = \\frac{19 - 10}{4} = \\frac{9}{4} = 2.25$.',
      whyWrong: [
        null,
        'This is $\\frac{19 - 4}{16 - 4} = \\frac{15}{12}$: it uses the **min-max** formula, not standardisation.',
        'This is $\\frac{19 - 10}{16}$: it divides by the **variance** instead of the standard deviation $\\sqrt{16} = 4$.',
        'This is $\\frac{19}{4}$: it divides by the standard deviation but forgets to subtract the mean.',
      ],
      keyIdea: 'Compute the mean and standard deviation from the training data, then standardise any new value with $z = \\frac{x - \\mu}{\\sigma}$.',
    },
    check: {
      optionValues: [2.25, 1.25, 0.5625, 4.75],
      compute: () => {
        const train = [4, 8, 10, 12, 16];
        return (19 - mean(train)) / sd(train);
      },
    },
  },

  // ---------------------------------------------------------------- recall
  {
    id: 'training-generalisation-022',
    subtopic: 'training-generalisation',
    difficulty: 'foundation',
    stem: 'What is a **hyperparameter**?',
    options: ['A setting chosen before training', 'A weight learned during training', 'An input feature', 'A score on the test set'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A **hyperparameter** is a setting that is chosen rather than learned, such as the learning rate, the regularisation strength $\\lambda$ or the $k$ in k-NN.\n\n' +
        'It is usually chosen by trying several values on a validation set. **Parameters** (the weights and biases) are the numbers learned from the data during training.',
      whyWrong: [
        null,
        'Weights are **parameters**: training finds their values from the data. Hyperparameters are set from outside.',
        'A feature is an input variable in the data, not a setting of the training process.',
        'A test score measures the final model. It is a result, not a setting.',
      ],
      keyIdea: 'Parameters are learned from data; hyperparameters are chosen, usually with a validation set.',
    },
  },
  {
    id: 'training-generalisation-023',
    subtopic: 'training-generalisation',
    difficulty: 'foundation',
    stem: 'Low training error with much higher validation error is a sign of:',
    options: ['Overfitting', 'Underfitting', 'Feature scaling', 'Regularisation'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The model does very well on the data it has seen and much worse on data it has not seen. It has memorised the training data, including its noise, rather than the general pattern. That is **overfitting**, also called high variance.',
      whyWrong: [
        null,
        'Underfitting means the error is high on **both** sets, because the model is too simple. Here the training error is low.',
        'Feature scaling is a preprocessing step that changes the range of an input. It is not a pattern of errors.',
        'Regularisation is a **remedy** for this situation: it penalises large weights to reduce overfitting.',
      ],
      keyIdea: 'A large gap between low training error and higher validation error means overfitting.',
    },
  },
  {
    id: 'training-generalisation-024',
    subtopic: 'training-generalisation',
    difficulty: 'foundation',
    stem: 'Which part of the data should be used to choose between models?',
    options: ['The validation set', 'The training set', 'The test set', 'All of the data together'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **validation set** is held back from training so that models and hyperparameters can be compared on data they have not seen.\n\n' +
        'The test set stays untouched until the very end, so that it gives an honest final estimate.',
      whyWrong: [
        null,
        'Training error keeps falling as a model gets more complex, so choosing on the training set always favours the most complex model, which may be overfitting.',
        'If the test set is used to choose, it is no longer unseen data and its score becomes too optimistic.',
        'Using all the data includes the test set, so no honest estimate of performance on new data remains.',
      ],
      keyIdea: 'Train on the training set, choose with the validation set, and report once on the test set.',
    },
  },
];
