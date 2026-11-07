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
      asking: 'What is the test set for?',
      solution:
        'The data is split into three parts with different jobs. The **training** set teaches the model: it learns its weights (the numbers inside the model) from these examples.\n\n' +
        'The **validation** set helps us choose. We compare settings or models on it and pick the best.\n\n' +
        'The **test** set is kept locked away until the end. The model has never seen it, so its score shows how the finished model does on new data.',
      conclusion: 'The test set gives one honest final score. Its purpose is this: To estimate how the final model performs on unseen data.',
      whyWrong: [
        'Learning the weights is the job of the **training** set, not the test set.',
        'Comparing settings and choosing a model is the job of the **validation** set. If you used the test set for this, its score would no longer be an honest estimate.',
        null,
        'The test set must never be used for training at all; training on it would make its score meaningless as a measure of performance on unseen data.',
      ],
      keyIdea: 'Give each set its job. Training learns the weights, validation chooses settings and models, and test gives one final score on data never seen. If the test set is used for anything else, its score can\'t be trusted.',
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
      asking: 'Where does 40 sit between the minimum and maximum, on a scale from 0 to 1?',
      solution:
        '**Min-max scaling** puts values on a 0 to 1 scale, so the minimum becomes 0 and the maximum becomes 1. The formula is $x\' = \\frac{x - \\text{min}}{\\text{max} - \\text{min}}$, where $x$ is the value and $x\'$ is its scaled value.\n\n' +
        'The top of the fraction asks how far the value is above the minimum: $40 - 10 = 30$.\n\n' +
        'The bottom is the **range**, the distance from minimum to maximum: $60 - 10 = 50$.\n\n' +
        'Divide: $\\frac{30}{50} = 0.6$.',
      conclusion: '40 is 30 of the way along a range of 50, so its scaled value is $0.6$.',
      whyWrong: [
        'This is $\\frac{40}{60}$: it divides by the maximum and forgets to subtract the minimum at all.',
        'This is $\\frac{40 - 10}{60}$: it subtracts the minimum on top but divides by the maximum instead of the range $60 - 10 = 50$.',
        'This is $\\frac{60 - 40}{50}$: the subtraction is the wrong way round (distance from the maximum instead of from the minimum).',
        null,
      ],
      keyIdea: 'Min-max scaling: $\\frac{\\text{value} - \\text{min}}{\\text{max} - \\text{min}}$. Test it on the ends: the minimum must give 0 and the maximum must give 1. Always use the training minimum and maximum.',
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
      asking: 'Which model does much better on its training data than on data it hasn\'t seen?',
      solution:
        '**Overfitting** means a model has memorised its training data, including its random quirks, instead of learning the general pattern. It does very well on training data and much worse on new data.\n\n' +
        'So look for a big gap, with training accuracy far above validation accuracy. **Validation** data is data the model didn\'t train on.\n\n' +
        'Work out the gap for each model, which is training minus validation:\n\n| Model | Training | Validation | Gap |\n|---|---|---|---|\n| W | 62 | 60 | 2 |\n| X | 99 | 71 | 28 |\n| Y | 91 | 89 | 2 |\n| Z | 85 | 86 | $-1$ |\n\n' +
        'The biggest gap by far is 28 points, and it comes with a near-perfect training score. That is Model X.',
      conclusion: 'It scores 99 on training data but only 71 on new data, so the answer is Model X.',
      whyWrong: [
        'Model W has low accuracy on **both** sets with a tiny gap. That is underfitting (too simple), the opposite of overfitting.',
        null,
        'Model Y is high on both sets with only a 2-point gap; this is the best-generalising model, not an overfitting one.',
        'Model Z does about the same on both sets (validation is even 1 point higher, which is just random variation), so there is no sign of overfitting.',
      ],
      keyIdea: 'Compare training and validation scores. High training and much lower validation: overfitting. Both low: underfitting. Both high and close: a good fit. Make a column of training minus validation.',
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
      asking: 'How many of the 1500 examples go into the validation set?',
      solution:
        'The question says the validation set is $20\\%$ of the data, so we need $20\\%$ of 1500.\n\n' +
        'To find a percentage of a number, write it as a decimal by dividing by 100: $20 \\div 100 = 0.2$. Then multiply: $0.2 \\times 1500 = 300$.',
      conclusion: '$20\\%$ of 1500 gives $300$ examples in the validation set.',
      whyWrong: [
        'This is $70\\%$ of $1500$, the size of the **training** set.',
        'This is $10\\%$ of $1500$, the size of the **test** set.',
        null,
        'This is $30\\%$ of $1500$: the validation and test sets added together, not the validation set alone.',
      ],
      keyIdea: 'Size of a split $=$ its percentage as a decimal $\\times$ the total. Match each set to its percentage in the order stated. The three sizes must add back to the total.',
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
      asking: 'Is this model too simple, too tuned to its training data, or about right?',
      solution:
        'Start with the training error: how wrong is the model on data it has already seen? At $35\\%$, it does badly, because good models reach about $5\\%$.\n\n' +
        'Now look at the gap. Validation error is $37\\%$, only 2 points above training error. The model does about as well on new data, so this isn\'t overfitting.\n\n' +
        'High error on both sets means the model hasn\'t learned the pattern, even on its own training data. It is too simple. This is called **underfitting**, or **high bias**.',
      conclusion: 'Both errors are far above $5\\%$ and close together. That is Underfitting (high bias).',
      whyWrong: [
        'Overfitting needs a **low** training error and a much higher validation error. Here the training error is high and the gap is only 2 points.',
        'A small gap alone does not mean a good fit: both errors are about seven times worse than what good models achieve. Close but bad means underfitting.',
        'Leakage usually makes validation results look **suspiciously good**, not poor. Nothing here suggests leakage.',
        null,
      ],
      keyIdea: 'Compare three numbers: training error, validation error and what good models reach. Training error high and near validation: underfitting. Training low and validation much higher: overfitting. Both near the good level: a good fit.',
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
      asking: 'How many standard deviations above the mean is the value 9?',
      solution:
        'A **z-score** says how many standard deviations a value is from the mean. The formula is $z = \\frac{x - \\mu}{\\sigma}$, where $x$ is the value, $\\mu$ is the mean and $\\sigma$ is the standard deviation (the typical distance from the mean).\n\n' +
        'Find the mean by adding the values and dividing by how many there are: $\\frac{2 + 4 + 4 + 4 + 5 + 5 + 7 + 9}{8} = \\frac{40}{8} = 5$.\n\n' +
        'To find the standard deviation, take each value\'s distance from the mean and square it. Squaring stops the minus signs cancelling out:\n\n| Value | Value minus 5 | Squared |\n|---|---|---|\n| 2 | $-3$ | 9 |\n| 4 | $-1$ | 1 |\n| 4 | $-1$ | 1 |\n| 4 | $-1$ | 1 |\n| 5 | 0 | 0 |\n| 5 | 0 | 0 |\n| 7 | 2 | 4 |\n| 9 | 4 | 16 |\n\n' +
        'Add the squares: $9 + 1 + 1 + 1 + 4 + 16 = 32$. The zeros add nothing.\n\n' +
        '"Population" means we divide by $n$, the number of values: $\\frac{32}{8} = 4$. This average of the squares is called the **variance**.\n\n' +
        'The standard deviation is the square root of the variance: $\\sigma = \\sqrt{4} = 2$.\n\n' +
        'Put the numbers in the formula: $z = \\frac{9 - 5}{2} = \\frac{4}{2} = 2$.',
      conclusion: '9 is 4 above the mean of 5, and one standard deviation is 2, so the z-score is $2$.',
      whyWrong: [
        'This is $9 - 5 = 4$: it subtracts the mean but forgets to divide by the standard deviation.',
        null,
        'This is $\\frac{9}{2}$: it divides by the standard deviation but forgets to subtract the mean first.',
        'This is $\\frac{9 - 5}{4}$: it divides by the **variance** ($4$) instead of the standard deviation ($\\sqrt{4} = 2$).',
      ],
      keyIdea: 'To standardise: find the mean, square each distance from the mean, average the squares (divide by $n$ for population), take the square root, then use $z = \\frac{x - \\mu}{\\sigma}$. Subtract first, then divide.',
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
      asking: 'In each round, how many examples does the model train on?',
      solution:
        'In **5-fold cross-validation**, the data is cut into 5 equal parts called **folds**. Each round, one fold is kept aside to check the model, and the rest are used for training.\n\n' +
        'Find the size of one fold: $\\frac{1200}{5} = 240$ examples.\n\n' +
        'One fold is kept aside, which leaves $5 - 1 = 4$ folds for training.\n\n' +
        'Multiply to get the training examples: $4 \\times 240 = 960$.',
      conclusion: '4 folds of 240 examples each gives $960$ training examples per round.',
      whyWrong: [
        null,
        'This is the size of **one** fold, $\\frac{1200}{5}$, which is the part held out for **validation** in each round.',
        'This forgets that one fold is held out every round; training on all $1200$ would leave nothing to validate on.',
        'This is $960 \\times 5$, the total number of training examples summed over all $5$ rounds, not the number in one round.',
      ],
      keyIdea: 'In $k$-fold cross-validation, each round trains on $k - 1$ folds and checks on the other one. So one fold is the total divided by $k$, and training size is $k - 1$ times that.',
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
      asking: 'Which model has the higher average across its five folds, and what is that average?',
      solution:
        'A model\'s **cross-validation accuracy** is the mean of its fold accuracies. So use every fold, not just the best one.\n\n' +
        'Model P: add its five accuracies, $0.8 + 0.95 + 0.7 + 0.92 + 0.73 = 4.1$. Then divide by 5: $\\frac{4.1}{5} = 0.82$.\n\n' +
        'Model Q: add its five accuracies, $0.85 + 0.86 + 0.84 + 0.87 + 0.83 = 4.25$. Then divide by 5: $\\frac{4.25}{5} = 0.85$. That beats P\'s $0.82$, so Q is chosen.',
      conclusion: 'Model Q has the better mean, so the chosen accuracy is $0.85$, even though P has the highest single fold.',
      whyWrong: [
        'This is the single best fold of model P. One lucky fold says nothing about the average performance; you must average all $5$ folds.',
        'This is the mean accuracy of model P, which is the **lower** of the two means, so P would not be chosen.',
        'This is the best single fold of model Q, not its mean over all $5$ folds.',
        null,
      ],
      keyIdea: 'For cross-validation, average all the folds for each model and pick the highest average. Ignore single lucky folds. A model with steady fold scores can beat one with a high peak.',
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
      asking: 'Which of these lets information from the test data sneak into training?',
      solution:
        '**Data leakage** means information from data the model shouldn\'t see reaches it during training. Test scores then look better than they should, because the test is no longer fully unseen.\n\n' +
        'Test each option by asking whether test information reaches training. An 80/20 split keeps the test examples apart. Choosing $\\lambda$ (a setting for how heavily large weights are penalised) on the validation set doesn\'t touch the test set. Shuffling only changes the order of the examples.\n\n' +
        '**Scaling statistics** are numbers such as the mean, minimum and maximum, used to rescale a feature. Computed on the whole dataset, they include the test examples, so test information reaches training. Split first, then compute them from training data only.',
      conclusion: 'The other options are normal good practice. The leak comes from this: Computing the scaling statistics from the **whole** dataset, then splitting it.',
      whyWrong: [
        'An 80/20 train/test split is a standard, correct practice; the test examples are kept separate from training.',
        null,
        'Choosing hyperparameters such as $\\lambda$ is exactly what the validation set is for. This is correct practice, as long as the test set is not used.',
        'Shuffling before splitting is good practice (it avoids, for example, all of one class ending up in the test set). It does not leak test information into training.',
      ],
      keyIdea: 'To test for leakage, ask: did anything computed from test data reach the model during training? Compute all scaling statistics after splitting, using the training set only.',
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
      asking: 'What does the graph tell us about models that are too simple or too complex?',
      solution:
        '**Polynomial degree** measures complexity: a higher degree means a more flexible model. Training error is measured on data the model learned from, and validation error on data it hasn\'t seen.\n\n' +
        'Read three key points from the graph:\n\n| Degree | Training error | Validation error |\n|---|---|---|\n| 1 | 40 | 42 |\n| 4 | 12 | 17 |\n| 8 | 4 | 38 |\n\n' +
        'Degree 1: both errors are high and close together. That is **underfitting**, because the model is too simple. Degree 4: the validation error is the lowest of all, so this is the best balance.\n\n' +
        'Degree 8: training error is very low at 4, but validation error is high at 38. The model has memorised its training data and does badly on new data, which is **overfitting**.',
      conclusion: 'A low training error with a high validation error marks overfitting. Degree $8$ overfits: low training error, high validation error.',
      whyWrong: [
        null,
        'Errors that are close **and both high** mean underfitting, not overfitting. Overfitting needs a low training error with a much higher validation error.',
        'Training error always keeps falling as the model gets more complex, so choosing by training error always picks the most complex model. You must choose by **validation** error, which is lowest at degree $4$.',
        'Validation error is almost always a bit higher than training error. At degree $4$ the validation error is the lowest of all, so this is the best balance between bias and variance, not high bias.',
      ],
      keyIdea: 'On an error graph, choose the model with the lowest validation error, never the lowest training error. Left of that point, both errors are high: underfitting. Right of it, the gap grows: overfitting.',
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
      asking: 'What is the total loss once the penalty for large weights is added?',
      solution:
        '**Loss** measures how wrong a model is, and **weights** are the numbers it learns. **Regularisation** adds a penalty when weights get large, to discourage an over-complicated model. So regularised loss $=$ mean squared error $+$ penalty.\n\n' +
        'Square each weight: $w_1^2 = 3^2 = 9$ and $w_2^2 = (-1)^2 = 1$. A negative number times itself is positive.\n\n' +
        'Add the squares: $9 + 1 = 10$.\n\n' +
        'Multiply by $\\lambda$ (lambda), the number that sets how strong the penalty is: $0.1 \\times 10 = 1$. This is the penalty.\n\n' +
        'Add the penalty to the training mean squared error: $2.5 + 1 = 3.5$.',
      conclusion: 'The training error of $2.5$ plus the penalty of $1$ gives a regularised loss of $3.5$.',
      whyWrong: [
        'This uses absolute values instead of squares, $0.1 \\times (3 + 1) = 0.4$, which is the **L1** penalty, not L2.',
        'This forgets to multiply the penalty by $\\lambda$: $2.5 + (9 + 1) = 12.5$.',
        null,
        'This treats $(-1)^2$ as $-1$, giving a penalty of $0.1 \\times (9 - 1) = 0.8$. A squared number is never negative.',
      ],
      keyIdea: 'Regularised loss $=$ MSE $+$ penalty. For L2: square each weight, add, then multiply by $\\lambda$. For L1: use absolute values instead of squares. Work out the penalty first, then add the MSE.',
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
      asking: 'Would more data and would regularisation each help this model?',
      solution:
        'First diagnose it. Training accuracy is $98\\%$ but validation accuracy is $75\\%$. A big gap like that means **overfitting**: the model has learned details of its training data that don\'t apply to new data.\n\n' +
        'Statement 1: with more training data, accidental details are harder to memorise and real patterns stand out. So more data is likely to help, and this statement is true.\n\n' +
        'Statement 2: **regularisation** penalises large weights, which pushes the model towards something simpler that can\'t fit every detail. So it is likely to help too, and this statement is true.',
      conclusion: 'Each is a standard fix for overfitting, so the answer is Both statements.',
      whyWrong: [
        'More data does help, but regularisation also reduces overfitting, so Statement 2 is true as well.',
        'Regularisation does help, but collecting more data also reduces overfitting, so Statement 1 is true as well.',
        null,
        'Both are standard fixes for overfitting (high variance), so neither statement is false.',
      ],
      keyIdea: 'First diagnose from the two scores. For overfitting (a big gap), the fixes are more data, regularisation or a simpler model. For underfitting (both poor), use a more complex model or better features.',
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
      asking: 'Why can\'t she trust $94\\%$ as the accuracy on new data?',
      solution:
        'A test set only gives an honest score if it played no part in building the model.\n\n' +
        'Here she used it to choose. Out of 50 settings, some will score well partly by luck on these exact test examples, and she kept the highest.\n\n' +
        'So the $94\\%$ includes some of that luck, and new data is likely to score lower. She should choose on a validation set (separate data kept just for choosing), then use the test set once at the end.',
      conclusion: 'Choosing by test score builds luck into the figure. The $94\\%$ is too optimistic: the test set chose the model.',
      whyWrong: [
        'Trying more settings and still choosing by test score makes the problem worse: the more settings you try, the more likely the best one is just lucky on this test set.',
        null,
        'Training accuracy is the **most** optimistic number of all, because the model has already seen those examples. It is not a fair estimate of performance on new data.',
        'Tuning hyperparameters is the job of the validation set. Once the test set is used for choosing, it cannot give an honest final estimate.',
      ],
      keyIdea: 'Ask what each set was used for. Choosing anything with the test set makes its score too optimistic. The safe pattern is to train on training data, choose on validation data, then test once.',
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
      asking: 'What does the value 110 become when scaled with the training minimum and maximum?',
      solution:
        '**Min-max scaling** uses $x\' = \\frac{x - \\text{min}}{\\text{max} - \\text{min}}$, where $x$ is the value and $x\'$ is the scaled value. A scaler **fitted on training data** keeps that data\'s minimum and maximum, here 20 and 100.\n\n' +
        'The test value doesn\'t change those numbers, even though 110 is above the maximum. Changing them would let test data affect the scaler, which is data leakage.\n\n' +
        'The top of the fraction: $110 - 20 = 90$.\n\n' +
        'The bottom of the fraction: $100 - 20 = 80$.\n\n' +
        'Divide: $\\frac{90}{80} = 1.125$. Being above 1 is fine, because only training values are sure to lie between 0 and 1.',
      conclusion: 'Using the training minimum and maximum, 110 scales to $1.125$.',
      whyWrong: [
        'This is $\\frac{110}{100}$: it divides by the maximum and forgets to subtract the minimum.',
        'This is $\\frac{110}{80}$: it divides by the correct range but forgets to subtract the minimum from the value first.',
        null,
        'This assumes scaled values can never go above $1$ (or refits the scaler with $110$ as the new maximum, which would leak test information). With the training minimum and maximum, a value outside the training range scales to outside $[0, 1]$.',
      ],
      keyIdea: 'Always scale test values with the training minimum and maximum, using $\\frac{x - \\text{min}}{\\text{max} - \\text{min}}$. A result below 0 or above 1 is normal for test values outside the training range. Never refit the scaler.',
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
      asking: 'Why is this diabetes model\'s score suspiciously high?',
      solution:
        'A score of $99.8\\%$ is unusually high for a medical prediction, so look for a shortcut. Is any input giving away the answer?\n\n' +
        'Think about when a patient is prescribed insulin. Doctors usually prescribe it after diabetes has been diagnosed. So this input already reveals the outcome the model is meant to predict.\n\n' +
        'When an input gives away the answer in a way that won\'t be available for real predictions, it is called **data leakage**. A new undiagnosed patient isn\'t on insulin yet, so the model would fail on the people it is meant to help.',
      conclusion: 'The high score comes from an input that gives the answer away. Data leakage: insulin is usually prescribed **because** of a diabetes diagnosis.',
      whyWrong: [
        'Underfitting gives **poor** accuracy on training and test data, not $99.8\\%$.',
        'The score is high only because the feature reveals the label. New undiagnosed patients will not yet be on insulin, so the model would perform badly on exactly the people it is meant for.',
        'Feature scaling can change how fast or how well some models train, but missing scaling does not create a suspiciously perfect score.',
        null,
      ],
      keyIdea: 'When a score looks too good, test each feature: would it be known before the outcome happens? A feature caused by the outcome is leakage. Remove it and measure the score again.',
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
      asking: 'What does each of the four values become on a 0 to 1 scale?',
      solution:
        '**Min-max scaling** uses $x\' = \\frac{x - \\text{min}}{\\text{max} - \\text{min}}$, where $x$ is a value and $x\'$ is its scaled value. Here the minimum is 10 and the maximum is 50.\n\n' +
        'The bottom of the fraction is the **range**, and it stays the same for every value: $50 - 10 = 40$.\n\n' +
        'Subtract the minimum from each value, then divide by 40:\n\n| Value | Value minus 10 | Divide by 40 |\n|---|---|---|\n| 10 | 0 | $\\frac{0}{40} = 0$ |\n| 20 | 10 | $\\frac{10}{40} = 0.25$ |\n| 35 | 25 | $\\frac{25}{40} = 0.625$ |\n| 50 | 40 | $\\frac{40}{40} = 1$ |',
      conclusion: 'The smallest value goes to 0 and the largest to 1, as they should. The scaled values are $0, 0.25, 0.625, 1$.',
      whyWrong: [
        'This is $\\frac{x}{50}$: it forgets to subtract the minimum and divides by the maximum instead of the range.',
        null,
        'This is $\\frac{x - 10}{50}$: it subtracts the minimum but divides by the maximum. The largest value must map to $1$, so divide by the range, $40$.',
        'This is $\\frac{x}{40}$: it divides by the range but forgets to subtract the minimum, so the smallest value does not map to $0$.',
      ],
      keyIdea: 'To min-max scale a list, find the minimum and the range once, then work out (value minus minimum) divided by range for each value. The smallest must become 0 and the largest must become 1.',
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
      asking: 'How many standard deviations above the training mean is the test value 19?',
      solution:
        'A **standardiser** turns a value into a z-score: $z = \\frac{x - \\mu}{\\sigma}$. Here $x$ is the value, $\\mu$ is the mean and $\\sigma$ is the standard deviation (the typical distance from the mean). Find $\\mu$ and $\\sigma$ from the training values only.\n\n' +
        'Find the mean: $\\frac{4 + 8 + 10 + 12 + 16}{5} = \\frac{50}{5} = 10$.\n\n' +
        'Subtract the mean from each value and square the result. Squaring stops the minus signs cancelling out:\n\n| Value | Value minus 10 | Squared |\n|---|---|---|\n| 4 | $-6$ | 36 |\n| 8 | $-2$ | 4 |\n| 10 | 0 | 0 |\n| 12 | 2 | 4 |\n| 16 | 6 | 36 |\n\n' +
        'Add the squares (the zero adds nothing) and divide by $n$, the number of values, because the question says population: $\\frac{36 + 4 + 4 + 36}{5} = \\frac{80}{5} = 16$. This is the **variance**.\n\n' +
        'The standard deviation is the square root of the variance: $\\sigma = \\sqrt{16} = 4$.\n\n' +
        'Put the test value in the formula: $z = \\frac{19 - 10}{4} = \\frac{9}{4} = 2.25$.',
      conclusion: '19 is 9 above the training mean of 10, and one standard deviation is 4, so its standardised value is $2.25$.',
      whyWrong: [
        null,
        'This is $\\frac{19 - 4}{16 - 4} = \\frac{15}{12}$: it uses the **min-max** formula, not standardisation.',
        'This is $\\frac{19 - 10}{16}$: it divides by the **variance** instead of the standard deviation $\\sqrt{16} = 4$.',
        'This is $\\frac{19}{4}$: it divides by the standard deviation but forgets to subtract the mean.',
      ],
      keyIdea: 'To standardise a test value, work out the mean and standard deviation from training data only, then use $z = \\frac{x - \\mu}{\\sigma}$. Population means divide by $n$ when averaging the squares.',
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
      asking: 'What does the word hyperparameter mean?',
      solution:
        'A model has two kinds of number. **Weights**, also called parameters, are learned from the data during training.\n\n' +
        'A **hyperparameter** is decided by a person before training starts, and training doesn\'t change it. Examples are the polynomial degree (how curved the model can be) and the regularisation strength $\\lambda$ (how heavily large weights are penalised).',
      conclusion: 'It is decided by a person, not learned, so the answer is A setting chosen before training.',
      whyWrong: [
        null,
        'Weights are **parameters**: training finds their values from the data. Hyperparameters are set from outside.',
        'A feature is an input variable in the data, not a setting of the training process.',
        'A test score measures the final model. It is a result, not a setting.',
      ],
      keyIdea: 'Ask who sets the number. If training finds it, it is a parameter, such as a weight. If you choose it beforehand and compare choices on a validation set, it is a hyperparameter.',
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
      asking: 'What does it mean when a model does well on training data but much worse on validation data?',
      solution:
        '**Training error** is how wrong the model is on data it learned from. **Validation error** is how wrong it is on data it hasn\'t seen.\n\n' +
        'Low training error with much higher validation error means the model has memorised its training examples instead of learning a pattern that works on new ones. It is like memorising the answers to one set of practice questions, then struggling when the questions change. This is called **overfitting**.',
      conclusion: 'The model fits its training data too closely, so the answer is Overfitting.',
      whyWrong: [
        null,
        'Underfitting means the error is high on **both** sets, because the model is too simple. Here the training error is low.',
        'Feature scaling is a preprocessing step that changes the range of an input. It is not a pattern of errors.',
        'Regularisation is a **remedy** for this situation: it penalises large weights to reduce overfitting.',
      ],
      keyIdea: 'Read the two errors together. Low training and high validation: overfitting. Both high: underfitting. Both low and close: a good fit. Fixes for overfitting include regularisation and more data.',
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
      asking: 'Which part of the data do we use to compare models and pick one?',
      solution:
        'The training set can\'t choose. Training error keeps falling as models get more complex, so it would always pick the most complex model.\n\n' +
        'The test set can\'t choose either. It must stay unseen, so that it can give an honest final score at the end.\n\n' +
        'So we hold out a separate part just for choosing, called the **validation set**. It wasn\'t used for training, so the scores models get on it are fair.',
      conclusion: 'It is unseen by training and kept apart from the final test, so the answer is The validation set.',
      whyWrong: [
        null,
        'Training error keeps falling as a model gets more complex, so choosing on the training set always favours the most complex model, which may be overfitting.',
        'If the test set is used to choose, it is no longer unseen data and its score becomes too optimistic.',
        'Using all the data includes the test set, so no honest estimate of performance on new data remains.',
      ],
      keyIdea: 'Match each job to one set. Training set: learn the weights. Validation set: compare models and settings. Test set: one final score at the very end.',
    },
  },
];
