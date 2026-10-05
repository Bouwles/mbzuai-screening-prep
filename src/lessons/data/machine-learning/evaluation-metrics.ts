import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'evaluation-metrics',
  know:
    '### Why we need more than "how many did it get right?"\n\n' +
    'A **binary classifier** sorts each example into one of two classes, for example spam / not spam, or ill / healthy. We call the class we are trying to detect the **positive** class (spam, ill, fraud) and the other one the **negative** class. "Positive" does not mean "good"; it just means "the thing we are looking for".\n\n' +
    '### The four outcomes\n\n' +
    'Every prediction lands in exactly one of four boxes. Read the name in two halves: the **second word** is what the model *predicted*; the **first word** says whether it was *right*.\n\n' +
    '| | Predicted positive | Predicted negative |\n' +
    '|---|---|---|\n' +
    '| **Actually positive** | TP (true positive): a hit | FN (false negative): a miss |\n' +
    '| **Actually negative** | FP (false positive): a false alarm | TN (true negative): correctly ignored |\n\n' +
    'This table of counts is the **confusion matrix**. The correct predictions sit on the diagonal (TP and TN). Exam tables are not always drawn this way round: sometimes the rows are the *predicted* class. **Always read the labels first**, then write down TP, FP, FN, TN before calculating anything.\n\n' +
    '### Accuracy\n\n' +
    '$$\\text{Accuracy} = \\frac{\\text{TP} + \\text{TN}}{\\text{total}}$$\n\n' +
    'It is the fraction of all predictions that are correct. Easy to understand, but it can be badly misleading (see below).\n\n' +
    '### Precision: "when it says positive, can I trust it?"\n\n' +
    '$$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$$\n\n' +
    'The bottom is everything the model **predicted** positive. Precision is hurt by **false alarms** (FP).\n\n' +
    '### Recall: "of the real positives, how many did it find?"\n\n' +
    '$$\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$$\n\n' +
    'The bottom is everything that is **actually** positive. Recall is hurt by **misses** (FN). Recall is also called *sensitivity* or the *true positive rate*.\n\n' +
    'Memory trick: **P**recision divides by the **P**redicted positives; **R**ecall divides by the **R**eal positives.\n\n' +
    '### F1 score: one number that balances both\n\n' +
    '$$F_1 = \\frac{2PR}{P + R} = \\frac{2\\text{TP}}{2\\text{TP} + \\text{FP} + \\text{FN}}$$\n\n' +
    'F1 is the **harmonic mean** of precision $P$ and recall $R$. It is always between them and pulled towards the **smaller** one, so a model cannot get a good F1 by being great at one and terrible at the other. For example $P = 1$, $R = 0.2$ gives $F_1 = \\frac{0.4}{1.2} = \\frac{1}{3}$, not the ordinary average $0.6$. Notice that F1 never uses TN.\n\n' +
    '### Why accuracy misleads on imbalanced data\n\n' +
    'Suppose 10 out of 1000 transactions are fraud. A "lazy" model that always says **not fraud** gets $\\frac{990}{1000} = 99\\%$ accuracy, yet it catches **zero** frauds (recall $= 0$). When one class is rare, accuracy is dominated by the big class, so look at precision, recall and F1 instead.\n\n' +
    '### Precision or recall? Ask "which mistake is worse?"\n\n' +
    '| Situation | Worse mistake | Prioritise |\n' +
    '|---|---|---|\n' +
    '| Cancer screening, airport security, fraud alerts that get a quick check | missing a real case (FN) | **recall** |\n' +
    '| Spam filter that deletes emails, recommending a risky treatment, convicting someone | a false alarm (FP) | **precision** |\n\n' +
    '### Thresholds and the trade-off\n\n' +
    'Many models (such as logistic regression) output a **score or probability**, and we predict positive when the score is **at least a threshold** (often $0.5$).\n\n' +
    '- **Raise** the threshold: the model says "positive" less often. Fewer false alarms, so precision usually **rises**; more real positives are missed, so recall **falls** (it can never rise).\n' +
    '- **Lower** the threshold: more positives predicted. Recall **rises** (it can never fall), precision usually **falls**.\n\n' +
    'This is the **precision-recall trade-off**. To get the counts at a given threshold, go down the list, mark each example as predicted positive (score $\\ge$ threshold) or negative, then label it TP, FP, FN or TN. Careful with a score exactly equal to the threshold: "at least" means it counts as positive.\n\n' +
    '### Working backwards\n\n' +
    'Harder questions give you some metrics and ask for a count. Recall links TP to the actual positives: $\\text{TP} = R \\times (\\text{TP} + \\text{FN})$. Precision links TP to the predicted positives: $\\text{TP} + \\text{FP} = \\frac{\\text{TP}}{P}$. Chain these, and use the total to find TN.',
  formulas: [
    { label: 'Accuracy', tex: '\\text{Accuracy} = \\frac{\\text{TP} + \\text{TN}}{\\text{TP} + \\text{FP} + \\text{FN} + \\text{TN}}', note: 'Correct predictions (the diagonal) over all predictions.' },
    { label: 'Precision', tex: '\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}', note: 'Divide by everything PREDICTED positive. Hurt by false alarms.' },
    { label: 'Recall (sensitivity, true positive rate)', tex: '\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}', note: 'Divide by everything ACTUALLY positive. Hurt by misses.' },
    { label: 'F1 score (harmonic mean)', tex: 'F_1 = \\frac{2PR}{P + R}', note: 'Always between $P$ and $R$, pulled towards the smaller one.' },
    { label: 'F1 straight from the counts', tex: 'F_1 = \\frac{2\\text{TP}}{2\\text{TP} + \\text{FP} + \\text{FN}}', note: 'Fastest on a calculator; TN is not used.' },
    { label: 'F1 in reciprocal form', tex: '\\frac{2}{F_1} = \\frac{1}{P} + \\frac{1}{R}', note: 'Use this to find $P$ or $R$ when F1 is given.' },
    { label: 'Specificity (true negative rate)', tex: '\\text{Specificity} = \\frac{\\text{TN}}{\\text{TN} + \\text{FP}}', note: 'The fraction of actual negatives correctly cleared.' },
    { label: 'Working backwards', tex: '\\text{TP} = R \\times (\\text{TP} + \\text{FN}), \\quad \\text{TP} + \\text{FP} = \\frac{\\text{TP}}{P}' },
  ],
  examples: [
    {
      title: 'Reading a confusion matrix',
      problem:
        'A cat detector is tested on 100 photos. Of the 60 cat photos, it labels 45 as "cat". Of the 40 non-cat photos, it labels 5 as "cat". Find the accuracy, precision and recall.',
      steps: [
        'Positive class = cat. $\\text{TP} = 45$, $\\text{FN} = 60 - 45 = 15$, $\\text{FP} = 5$, $\\text{TN} = 40 - 5 = 35$.',
        'Accuracy $= \\frac{45 + 35}{100} = 0.8$.',
        'Precision $= \\frac{45}{45 + 5} = \\frac{45}{50} = 0.9$.',
        'Recall $= \\frac{45}{45 + 15} = \\frac{45}{60} = 0.75$.',
      ],
      answer: 'Accuracy $0.8$, precision $0.9$, recall $0.75$',
    },
    {
      title: 'F1 score from precision and recall',
      problem: 'A model has precision $0.6$ and recall $0.9$. Find its F1 score.',
      steps: [
        'Use $F_1 = \\frac{2PR}{P + R}$.',
        'Top: $2 \\times 0.6 \\times 0.9 = 1.08$.',
        'Bottom: $0.6 + 0.9 = 1.5$.',
        '$F_1 = \\frac{1.08}{1.5} = 0.72$. Check: it is below the ordinary average $0.75$, as a harmonic mean should be.',
      ],
      answer: '$F_1 = 0.72$',
    },
    {
      title: 'Applying a threshold',
      problem:
        'Six emails have spam scores $0.9$ (spam), $0.8$ (not spam), $0.6$ (spam), $0.5$ (spam), $0.3$ (not spam), $0.2$ (spam). The filter predicts spam when the score is at least $0.5$. Find the precision and recall.',
      steps: [
        'Predicted spam (score $\\ge 0.5$): the emails scoring $0.9$, $0.8$, $0.6$ and $0.5$. The $0.5$ email counts because "at least" includes equality.',
        'Of these, $0.9$, $0.6$ and $0.5$ are really spam, so $\\text{TP} = 3$; $0.8$ is not, so $\\text{FP} = 1$.',
        'Predicted not spam: $0.3$ (not spam, TN) and $0.2$ (spam, so a miss): $\\text{FN} = 1$, $\\text{TN} = 1$.',
        'Precision $= \\frac{3}{3 + 1} = 0.75$ and recall $= \\frac{3}{3 + 1} = 0.75$.',
      ],
      answer: 'Precision $0.75$, recall $0.75$',
    },
    {
      title: 'Working backwards from the metrics',
      problem:
        'A model is tested on 200 examples, 60 of which are actually positive. Its recall is $0.75$ and its precision is $0.9$. How many true negatives are there?',
      steps: [
        'Recall: $\\text{TP} = 0.75 \\times 60 = 45$, so $\\text{FN} = 60 - 45 = 15$.',
        'Precision: $\\text{TP} + \\text{FP} = \\frac{45}{0.9} = 50$, so $\\text{FP} = 50 - 45 = 5$.',
        '$\\text{TN} = 200 - 45 - 5 - 15 = 135$.',
        'Check: precision $= \\frac{45}{50} = 0.9$ and recall $= \\frac{45}{60} = 0.75$.',
      ],
      answer: '$\\text{TN} = 135$',
    },
  ],
  traps: [
    'Swapping FP and FN because the table is drawn the other way round (rows = predicted instead of rows = actual). Read the row and column labels and write down all four counts before you calculate.',
    'Mixing up precision and recall. Precision divides by the **predicted** positives (TP + FP); recall divides by the **actual** positives (TP + FN).',
    'Taking the ordinary average of precision and recall instead of F1. F1 is the harmonic mean $\\frac{2PR}{P + R}$, which is always at or below the ordinary average.',
    'Trusting a high accuracy on imbalanced data. A model that always predicts the majority class can score 99% while finding none of the cases you care about.',
    'Treating a score exactly equal to the threshold as negative. "Predict positive if the score is at least $t$" means a score of exactly $t$ is predicted positive.',
    'Thinking a higher threshold improves recall. Raising the threshold removes positive predictions, so TP (and recall) can only stay the same or fall.',
  ],
  examTip:
    'In the 4-option MCQ, the wrong options are almost always the **other metrics** computed from the same table (precision when recall was asked, accuracy, TP divided by the total, or the ordinary average instead of F1). So write TP, FP, FN, TN first, then compute only the metric asked for, and expect to see the others as distractors. Fast checks: precision, recall, accuracy and F1 are all between $0$ and $1$; F1 must lie between precision and recall and be at or below their ordinary average (equal only when precision equals recall); on rare-positive data the accuracy option is usually the suspiciously high one. Use the counts form $F_1 = \\frac{2\\text{TP}}{2\\text{TP} + \\text{FP} + \\text{FN}}$ to save a step, and your calculator\'s fraction key to match options given as fractions. For "which metric matters?" questions, ask which mistake (false alarm or miss) is more costly: false alarms costly means precision, misses costly means recall. For threshold questions, remember: raise the threshold, precision up and recall down; lower it, recall up.',
};
