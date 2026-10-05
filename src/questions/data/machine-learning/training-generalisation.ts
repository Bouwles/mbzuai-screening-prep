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
    stem: 'A dataset is split into a **training** set, a **validation** set and a **test** set. What is the main purpose of the **test** set?',
    options: [
      "To learn the model's weights (its parameters)",
      'To compare different hyperparameter settings and pick the best model',
      'To give an unbiased estimate of how the final model will perform on new, unseen data',
      'To provide extra examples so that the model can be trained for longer',
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
    stem: 'In the training data, the feature "hours studied" has a minimum of $10$ and a maximum of $60$. Using **min-max scaling** to the range $[0, 1]$, what is the scaled value of $40$?',
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
    stem: 'Four models were trained on the same task. The table shows their accuracy on the training set and on the validation set. Which model is **overfitting**?',
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
    stem: 'On a task where good models reach about $5\\%$ error, a model has a training error of $35\\%$ and a validation error of $37\\%$. What is most likely happening?',
    options: [
      'The model is overfitting (high variance)',
      'The model is a good fit, because its training and validation errors are close',
      'There is data leakage from the validation set into the training set',
      'The model is underfitting (high bias)',
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
    stem: 'A feature has training values $2, 4, 4, 4, 5, 5, 7, 9$. The feature is **standardised** using the mean and the **population** standard deviation (divide by $n$) of these values. What is the standardised value (z-score) of $9$?',
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
    stem: 'Two models, P and Q, were compared using 5-fold cross-validation. The table shows the validation accuracy in each fold. The model with the better **cross-validation accuracy** is chosen. What is the cross-validation accuracy of the chosen model?',
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
      'Computing the mean and standard deviation for standardisation from the **whole** dataset, and only then splitting it into training and test sets',
      'Using the validation set to choose the regularisation strength $\\lambda$',
      'Shuffling the data randomly before splitting it into training and test sets',
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
    stem: 'Polynomial regression models of degree $1$ to $8$ were trained on the same data. The graph shows the training error and validation error for each degree. Which statement is correct?',
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
      'At degree $8$ the model is overfitting: its training error is very low but its validation error is high.',
      'At degree $1$ the model is overfitting, because its training and validation errors are almost equal.',
      'Degree $8$ is the best choice, because it has the lowest training error.',
      'At degree $4$ the model has high bias, because its validation error is higher than its training error.',
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
    stem: 'A linear model has a training mean squared error of $2.5$ and weights $w_1 = 3$ and $w_2 = -1$. **L2 regularisation** with $\\lambda = 0.1$ adds the penalty $\\lambda (w_1^2 + w_2^2)$ to the loss. What is the regularised loss?',
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
    stem: 'A model is **overfitting**: it has $98\\%$ training accuracy but only $75\\%$ validation accuracy. Which of the following is likely to help it generalise better?',
    options: [
      'Collecting more training data',
      'Adding regularisation that penalises large weights',
      'Both A and B',
      'None of the above',
    ],
    correctIndex: 2,
    fixedOrder: true,
    markScheme: {
      solution:
        'Overfitting means **high variance**: the model is flexible enough to memorise noise in the training set.\n\n' +
        '- **More training data** (option A) makes it much harder to memorise every example, so the model is pushed to learn the real pattern. This reduces variance.\n' +
        '- **Regularisation** (option B) adds a penalty for large weights. Smaller weights give a smoother, simpler model, which reduces variance.\n\n' +
        'Both A and B help, so the answer is C.',
      whyWrong: [
        'More data does help, but it is not the only correct choice here: regularisation also reduces overfitting, so option C is better.',
        'Regularisation does help, but collecting more data also reduces overfitting, so option C is better.',
        null,
        'Both A and B are standard fixes for overfitting (high variance), so "None of the above" is false.',
      ],
      keyIdea: 'Overfitting (high variance) is reduced by more training data and by regularisation (a simpler, smoother model).',
    },
  },
  {
    id: 'training-generalisation-013',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    stem: 'A student tries $50$ different hyperparameter settings. For each one she trains on the training set and measures the accuracy on the **test** set. She then reports the best test accuracy, $94\\%$, as the accuracy to expect on new data. What is the main problem?',
    options: [
      'She tried too few settings; trying more would make the test accuracy more reliable',
      'The $94\\%$ is probably too optimistic: the test set was used to choose the model, so it is no longer unseen data',
      'She should have reported the training accuracy instead, which is a fairer estimate',
      'Nothing is wrong: the test set is the right place to tune hyperparameters',
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
    stem: 'A min-max scaler was fitted on the training data, where the feature had minimum $20$ and maximum $100$. A new test example has the value $110$. Using the **training** minimum and maximum, what is its scaled value?',
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
    stem: 'A hospital builds a model to predict whether a patient has diabetes. It scores $99.8\\%$ accuracy on the test set. One of the input features is "currently prescribed insulin (yes/no)". What is the most likely explanation of the very high score?',
    options: [
      'The model is underfitting, because it relies on only a few features',
      'The model has generalised perfectly and can be used with confidence to screen new, undiagnosed patients',
      'The features were not scaled, which inflates the accuracy',
      'Data leakage: insulin is usually prescribed **because** of a diabetes diagnosis, so this feature gives away the answer',
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
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source:
        'data = [10, 20, 35, 50]\n' +
        'lo, hi = min(data), max(data)\n' +
        'scaled = [(x - lo) / (hi - lo) for x in data]\n' +
        'print(scaled)',
    },
    options: ['`[0.2, 0.4, 0.7, 1.0]`', '`[0.0, 0.25, 0.625, 1.0]`', '`[0, 0.25, 0.625, 1]`', '`[0.25, 0.5, 0.875, 1.25]`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Line 2: `lo = 10`, `hi = 50`, so `hi - lo = 40`.\n\n' +
        'Line 3 applies min-max scaling to each value:\n\n' +
        '| `x` | `x - lo` | `(x - lo) / 40` |\n' +
        '|---|---|---|\n' +
        '| 10 | 0 | 0.0 |\n' +
        '| 20 | 10 | 0.25 |\n' +
        '| 35 | 25 | 0.625 |\n' +
        '| 50 | 40 | 1.0 |\n\n' +
        'In Python 3 the `/` operator always gives a `float`, so `0 / 40` is `0.0` and `40 / 40` is `1.0`.\n\n' +
        'Output: `[0.0, 0.25, 0.625, 1.0]`',
      whyWrong: [
        'This is each value divided by `hi` (`x / 50`): it forgets to subtract `lo` and divides by the maximum instead of the range.',
        null,
        'The numbers are right, but `/` always returns a `float` in Python 3, so Python prints `0.0` and `1.0`, not `0` and `1`.',
        'This divides each value by the range `40` but forgets to subtract `lo` first, so the smallest value does not map to `0.0`.',
      ],
      keyIdea: 'Min-max scaling maps the minimum to 0 and the maximum to 1; in Python 3, `/` always returns a float.',
    },
    python: { stdout: '[0.0, 0.25, 0.625, 1.0]' },
    check: {
      optionValues: ['[0.2, 0.4, 0.7, 1.0]', '[0.0, 0.25, 0.625, 1.0]', '[0, 0.25, 0.625, 1]', '[0.25, 0.5, 0.875, 1.25]'],
      compute: () => {
        const data = [10, 20, 35, 50];
        const lo = Math.min(...data);
        const hi = Math.max(...data);
        const pyFloat = (v: number) => (Number.isInteger(v) ? v.toFixed(1) : String(v));
        return `[${data.map((x) => pyFloat((x - lo) / (hi - lo))).join(', ')}]`;
      },
    },
  },

  // ---------------------------------------------------------------- challenge
  {
    id: 'training-generalisation-017',
    subtopic: 'training-generalisation',
    difficulty: 'challenge',
    stem: 'The training values of a feature are $4, 8, 10, 12, 16$. A standardiser is fitted on these values using their mean and **population** standard deviation (divide by $n$). A test example has the value $19$. What is its standardised value?',
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
  {
    id: 'training-generalisation-018',
    subtopic: 'training-generalisation',
    difficulty: 'challenge',
    stem: 'A team compares $4$ values of the regularisation strength $\\lambda$ using **10-fold cross-validation** on $600$ examples. After picking the best $\\lambda$, they retrain one final model on all $600$ examples. In total, how many times is a model trained?',
    options: ['$40$', '$14$', '$11$', '$41$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: one value of $\\lambda$.** 10-fold cross-validation trains one model per fold, so $10$ models.\n\n' +
        '**Step 2: all four values.** Each value of $\\lambda$ needs its own full cross-validation: $4 \\times 10 = 40$ models.\n\n' +
        '**Step 3: the final model.** One more model trained on all $600$ examples with the best $\\lambda$: $40 + 1 = 41$.\n\n' +
        'The number of examples ($600$) does not affect the count; it only decides how big each fold is ($60$ examples).',
      whyWrong: [
        'This is $4 \\times 10$, which forgets the final model retrained on all the data.',
        'This adds instead of multiplies: $4 + 10 = 14$. Every value of $\\lambda$ needs all $10$ folds, so it is $4 \\times 10$.',
        'This is $10 + 1$: it runs cross-validation for only one value of $\\lambda$, forgetting that all $4$ values must be cross-validated.',
        null,
      ],
      keyIdea: 'Tuning $h$ settings with $k$-fold cross-validation trains $h \\times k$ models, plus one final model on all the data.',
    },
    check: {
      optionValues: [40, 14, 11, 41],
      compute: () => {
        let trained = 0;
        for (let setting = 0; setting < 4; setting++) for (let fold = 0; fold < 10; fold++) trained++;
        return trained + 1;
      },
    },
  },
  {
    id: 'training-generalisation-019',
    subtopic: 'training-generalisation',
    difficulty: 'challenge',
    stem: 'Four models were trained on the same training set. The team must **pick one model** and then report an **honest estimate** of its error on future data. Which error should they report?',
    table: {
      headers: ['Model', 'Training error (%)', 'Validation error (%)', 'Test error (%)'],
      rows: [
        ['W', 2, 15, 16],
        ['X', 8, 9, 10],
        ['Y', 20, 21, 22],
        ['Z', 6, 10, 8],
      ],
    },
    options: ['$8\\%$', '$10\\%$', '$9\\%$', '$2\\%$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'There are two separate decisions, and each uses a different column.\n\n' +
        '**Step 1: choose the model with the validation set.** Validation errors: W $15\\%$, X $9\\%$, Y $21\\%$, Z $10\\%$. The lowest is **model X** ($9\\%$).\n\n' +
        '**Step 2: report the chosen model\'s test error.** The test set was not used for training or for choosing, so its score is the honest estimate. Model X\'s test error is $10\\%$.\n\n' +
        'The validation error ($9\\%$) is slightly optimistic, because we picked X *because* it had the lowest validation error.',
      whyWrong: [
        'This picks model Z because it has the lowest **test** error. Using the test set to choose the model turns it into a second validation set, so its score is no longer an honest estimate.',
        null,
        'This is model X\'s **validation** error. It was used to choose the model, so it is optimistically biased; the untouched test error should be reported.',
        'This is model W\'s **training** error. Model W is overfitting (training $2\\%$ but validation $15\\%$), and training error is never an honest estimate of performance on new data.',
      ],
      keyIdea: 'Choose the model by validation error, then report the chosen model\'s test error as the honest estimate.',
    },
    check: {
      optionValues: [8, 10, 9, 2],
      compute: () => {
        const models = [
          { val: 15, test: 16 },
          { val: 9, test: 10 },
          { val: 21, test: 22 },
          { val: 10, test: 8 },
        ];
        const best = models.reduce((a, b) => (b.val < a.val ? b : a));
        return best.test;
      },
    },
  },
  {
    id: 'training-generalisation-020',
    subtopic: 'training-generalisation',
    difficulty: 'challenge',
    stem: 'Two trained models are compared using an L2-regularised loss $J = \\text{MSE} + \\lambda \\sum w_i^2$ with $\\lambda = 0.1$.\n\n- Model 1: MSE $= 2.0$, weights $w_1 = 4$, $w_2 = -2$\n- Model 2: MSE $= 3.0$, weights $w_1 = 1$, $w_2 = 1$\n\nWhich model has the **lower** regularised loss, and what is that loss?',
    options: [
      'Model 1, with regularised loss $2.0$',
      'Model 1, with regularised loss $2.6$',
      'Model 2, with regularised loss $3.2$',
      'Model 1, with regularised loss $2.4$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Work out $J$ for each model.\n\n' +
        '**Model 1.** $\\sum w_i^2 = 4^2 + (-2)^2 = 16 + 4 = 20$. Penalty $= 0.1 \\times 20 = 2$. $J = 2.0 + 2 = 4.0$.\n\n' +
        '**Model 2.** $\\sum w_i^2 = 1^2 + 1^2 = 2$. Penalty $= 0.1 \\times 2 = 0.2$. $J = 3.0 + 0.2 = 3.2$.\n\n' +
        'Since $3.2 < 4.0$, **Model 2** has the lower regularised loss, $3.2$.\n\n' +
        'This is the point of regularisation: Model 1 fits the training data a little better, but it needs large weights to do so, and the penalty prefers the simpler Model 2.',
      whyWrong: [
        'This compares the plain MSE values and ignores the penalty term $\\lambda \\sum w_i^2$ completely.',
        'This uses absolute values (the L1 penalty): $2.0 + 0.1 \\times (4 + 2) = 2.6$. The question uses squared weights.',
        null,
        'This squares the **sum** of the weights instead of summing the squares: $2.0 + 0.1 \\times (4 - 2)^2 = 2.4$.',
      ],
      keyIdea: 'Regularisation can make a model with slightly worse training error win, because large weights are penalised.',
    },
    check: {
      optionValues: [2.0, 2.6, 3.2, 2.4],
      compute: () => {
        const J = (mse: number, w: number[]) => mse + 0.1 * sumOf(w.map((x) => x * x));
        return Math.min(J(2.0, [4, -2]), J(3.0, [1, 1]));
      },
    },
  },
  {
    id: 'training-generalisation-021',
    subtopic: 'training-generalisation',
    difficulty: 'challenge',
    stem: 'The **learning curve** shows the training and validation error of a model as the training set grows. The team needs an error below $5\\%$. Which action is most likely to help?',
    chart: {
      kind: 'line',
      title: 'Learning curve',
      xLabel: 'Number of training examples',
      yLabel: 'Error (%)',
      categories: ['100', '200', '400', '800', '1600', '3200'],
      series: [
        { name: 'Training error', values: [18, 22, 25, 26, 27, 27] },
        { name: 'Validation error', values: [40, 33, 30, 29, 28, 28] },
      ],
    },
    options: [
      'Use a more flexible model, or add more informative features',
      'Collect ten times more training data',
      'Increase the regularisation strength $\\lambda$',
      'Remove some of the input features to make the model simpler',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'Read the curve at the right-hand end.\n\n' +
        '- The two curves have **met**: training error $27\\%$, validation error $28\\%$. A gap of only $1$ point, so there is no overfitting.\n' +
        '- Both have **flattened out** at about $27$ to $28\\%$, far above the $5\\%$ target.\n\n' +
        'High error on both sets with a tiny gap means **high bias (underfitting)**: the model is too simple to capture the pattern. Even the training error is $27\\%$, so the model cannot fit the data it already has.\n\n' +
        'The fix for high bias is to make the model **more** expressive: a more flexible model (for example a higher-degree polynomial or a bigger network) or more informative features.',
      whyWrong: [
        null,
        'The curves are already flat: going from $1600$ to $3200$ examples changed nothing. More data helps high **variance** (a big gap), but here the training error itself is too high, so extra data will not reach $5\\%$.',
        'Stronger regularisation shrinks the weights and makes the model **simpler**, which increases bias. The model is already underfitting, so this makes things worse.',
        'Removing features makes the model simpler, increasing bias even further. An underfitting model needs more expressive power, not less.',
      ],
      keyIdea: 'If training and validation error converge at a high value, the model has high bias: make it more flexible rather than adding data or regularisation.',
    },
  },
];
