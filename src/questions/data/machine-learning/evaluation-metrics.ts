import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';

// Helpers used only by the answer checks (recompute every metric from raw counts).
const precisionOf = (tp: number, fp: number) => new Frac(tp, tp + fp).value();
const recallOf = (tp: number, fn: number) => new Frac(tp, tp + fn).value();
const accuracyOf = (tp: number, fp: number, fn: number, tn: number) => new Frac(tp + tn, tp + fp + fn + tn).value();
const f1Of = (tp: number, fp: number, fn: number) => new Frac(2 * tp, 2 * tp + fp + fn).value();

/** Count TP, FP, FN, TN when "predict positive if score >= t". */
function countAt(rows: [number, boolean][], t: number) {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;
  for (const [s, pos] of rows) {
    const pred = s >= t;
    if (pred && pos) tp++;
    else if (pred && !pos) fp++;
    else if (!pred && pos) fn++;
    else tn++;
  }
  return { tp, fp, fn, tn };
}

// Scored examples used by two threshold questions: [score, actually positive?]
const SPAM_SCORES: [number, boolean][] = [
  [0.95, true],
  [0.85, true],
  [0.8, false],
  [0.7, true],
  [0.65, false],
  [0.55, true],
  [0.4, false],
  [0.3, true],
  [0.2, false],
  [0.1, false],
];

const yesNo = (b: boolean) => (b ? 'Yes' : 'No');

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'evaluation-metrics-001',
    subtopic: 'evaluation-metrics',
    difficulty: 'foundation',
    stem: 'A spam filter treats **spam** as the positive class. It marks a genuine (not spam) email as spam. What type of outcome is this?',
    options: ['True positive (TP)', 'False negative (FN)', 'False positive (FP)', 'True negative (TN)'],
    correctIndex: 2,
    markScheme: {
      asking: 'What do we call it when a genuine email gets marked as spam?',
      solution:
        'Each outcome has a two-word name. The second word is what the model predicted: **positive** means it said "spam", and **negative** means it said "not spam".\n\n' +
        'The first word says whether that prediction was right: **true** if it was right, **false** if it was wrong.\n\n' +
        'Here the filter said "spam", so the second word is positive. The email was genuine, so the prediction was wrong, and the first word is false.',
      conclusion: 'A wrong prediction of spam is a false alarm, so this is a False positive (FP).',
      whyWrong: [
        'A true positive would need the email to really be spam. Here the prediction "spam" was wrong, so the first word must be "false", not "true".',
        'A false negative is the other kind of error: a spam email that the filter lets through (it predicted "not spam"). Here the filter predicted "spam", so the outcome is a positive, not a negative.',
        null,
        'A true negative is a genuine email that the filter correctly leaves alone. Here the filter predicted "spam", so it is not a negative at all.',
      ],
      keyIdea: 'Name an outcome in two moves. What did the model predict? That gives positive or negative. Was it right? That gives true or false. Then put the two words together.',
    },
  },
  {
    id: 'evaluation-metrics-002',
    subtopic: 'evaluation-metrics',
    difficulty: 'foundation',
    stem: 'The confusion matrix shows a cat classifier\'s results on 100 test photos. What is its **accuracy**?',
    table: {
      caption: 'Rows: actual class. Columns: predicted class.',
      headers: ['Actual class', 'Predicted: cat', 'Predicted: not cat'],
      rows: [
        ['Cat', 45, 15],
        ['Not cat', 5, 35],
      ],
    },
    options: ['$0.9$', '$0.8$', '$0.75$', '$0.45$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What fraction of all 100 photos did the model get right?',
      solution:
        '**Accuracy** is the fraction of predictions that are correct: correct predictions divided by all predictions.\n\n' +
        'A **confusion matrix** is a table of right and wrong predictions. A prediction is correct when the actual class and the predicted class match.\n\n' +
        'Two cells match. Actual cat, predicted cat has 45. Actual not cat, predicted not cat has 35. The other two cells, 15 and 5, are mistakes.\n\n' +
        'Correct predictions: $45 + 35 = 80$. The total is 100 photos, so the accuracy is $\\frac{80}{100} = 0.8$.',
      conclusion: 'The model is right on 80 of the 100 photos, so the accuracy is $0.8$.',
      whyWrong: [
        'This is $\\frac{45}{50}$, the **precision** (correct cats out of everything predicted "cat"). Accuracy counts every correct prediction, cats and non-cats.',
        null,
        'This is $\\frac{45}{60}$, the **recall** (cats found out of all actual cats). Accuracy also gives credit for the 35 non-cats correctly rejected.',
        'This is $\\frac{45}{100}$: it only counts the true positives as correct and forgets the 35 true negatives, which are also correct predictions.',
      ],
      keyIdea: 'For accuracy, add the cells where actual and predicted match, then divide by the total of all four cells. In a confusion matrix those matching cells usually run along the diagonal.',
    },
    check: {
      optionValues: [0.9, 0.8, 0.75, 0.45],
      compute: () => accuracyOf(45, 5, 15, 35),
    },
  },
  {
    id: 'evaluation-metrics-003',
    subtopic: 'evaluation-metrics',
    difficulty: 'foundation',
    stem: 'Which formula gives the **precision** of a binary classifier?',
    options: [
      '$\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$',
      '$\\frac{\\text{TP} + \\text{TN}}{\\text{TP} + \\text{TN} + \\text{FP} + \\text{FN}}$',
      '$\\frac{\\text{TN}}{\\text{TN} + \\text{FP}}$',
      '$\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$',
    ],
    correctIndex: 3,
    markScheme: {
      asking: 'Which of these formulas is the one for precision?',
      solution:
        'First, the four counts. **TP** (true positive): predicted positive, really positive. **FP** (false positive): predicted positive, really negative. **FN** (false negative): predicted negative, really positive. **TN** (true negative): predicted negative, really negative.\n\n' +
        '**Precision** answers one question: when the model says positive, how often is it right? So we look only at the times it said positive.\n\n' +
        'The times it said positive are TP and FP, so $\\text{TP} + \\text{FP}$ goes on the bottom. The ones it got right are TP, so TP goes on top.',
      conclusion: 'Right positive predictions over all positive predictions gives $\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$.',
      whyWrong: [
        'This is **recall**: it divides by all *actual* positives ($\\text{TP} + \\text{FN}$), so it measures how many real positives were found, not how trustworthy a positive prediction is.',
        'This is **accuracy**: the fraction of all predictions (positive and negative) that are correct.',
        'This is **specificity** (the true negative rate): the fraction of actual negatives correctly predicted negative. It does not involve the true positives at all.',
        null,
      ],
      keyIdea: 'Build the formula from its question. Precision: of everything **predicted** positive, how much was right? Recall: of everything **actually** positive, how much was found? Both have TP on top, and the bottom is the group you count from.',
    },
  },
  {
    id: 'evaluation-metrics-004',
    subtopic: 'evaluation-metrics',
    difficulty: 'foundation',
    stem: 'A model screens 200 patients, 20 of whom have a disease. It flags 15 of those 20 and also 10 healthy patients. What is its **recall**?',
    options: ['$0.75$', '$0.6$', '$0.075$', '$0.925$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Out of the patients who really have the disease, what fraction did the model catch?',
      solution:
        '**Recall** answers: of all the real positive cases, what fraction did the model find? Here a positive case is a patient with the disease.\n\n' +
        'The formula is $\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$. TP (true positives) are ill patients who got flagged. FN (false negatives) are ill patients who were missed.\n\n' +
        'Pick out the numbers. TP is 15, the ill patients flagged. There are 20 ill patients altogether, so FN is $20 - 15 = 5$. The 10 healthy patients flagged don\'t count, because recall looks only at ill patients.\n\n' +
        'Substitute: $\\text{Recall} = \\frac{15}{15 + 5} = \\frac{15}{20} = 0.75$.',
      conclusion: 'The model catches 15 of the 20 ill patients, so its recall is $0.75$.',
      whyWrong: [
        null,
        'This is $\\frac{15}{25}$, the **precision**: it divides by all 25 flagged patients (including the 10 healthy ones). Recall divides by the 20 patients who are actually ill.',
        'This is $\\frac{15}{200}$: it divides by every patient screened, not just the 20 who have the disease.',
        'This is the **accuracy**, $\\frac{15 + 170}{200}$, which also counts the 170 healthy patients correctly cleared. Recall only looks at the ill patients.',
      ],
      keyIdea: 'For recall, ignore the healthy people entirely. Count only the real positives: recall is how many were caught divided by how many there are. Numbers like the total screened are there to distract you.',
    },
    check: {
      optionValues: [0.75, 0.6, 0.075, 0.925],
      compute: () => {
        const ill = 20;
        const tp = 15;
        return recallOf(tp, ill - tp);
      },
    },
  },
  {
    id: 'evaluation-metrics-005',
    subtopic: 'evaluation-metrics',
    difficulty: 'foundation',
    stem: 'In a dataset of 500 transactions, 10 are fraudulent. A model predicts **not fraud** for every transaction. What is its accuracy?',
    options: ['$2\\%$', '$0\\%$', '$50\\%$', '$98\\%$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What percentage of transactions does a model that always says "not fraud" get right?',
      solution:
        '**Accuracy** is correct predictions divided by all predictions.\n\n' +
        'The model says "not fraud" every time. That is correct for every genuine transaction and wrong for every fraud.\n\n' +
        'Genuine transactions: $500 - 10 = 490$. So the model gets 490 right.\n\n' +
        'Accuracy is $\\frac{490}{500} = 0.98$. To turn that into a percentage, multiply by 100, which gives 98 per cent.',
      conclusion: 'It is right on 490 of 500 without catching any fraud, so the accuracy is $98\\%$.',
      whyWrong: [
        'This is $\\frac{10}{500}$, the fraction of transactions that are fraud. Accuracy counts correct predictions, and the model is correct on the 490 genuine ones.',
        'This is the model\'s **recall** (it catches none of the 10 frauds). Accuracy also counts the 490 genuine transactions it labelled correctly.',
        'This assumes that with two classes a model must score about 50%. The classes here are very unbalanced, so always guessing the majority class scores far higher.',
        null,
      ],
      keyIdea: 'When a model always gives the same prediction, its accuracy is the share of examples in that class. This is why accuracy misleads on imbalanced data, where one class is far more common than the other.',
    },
    check: {
      optionValues: [2, 0, 50, 98],
      compute: () => {
        const total = 500;
        const fraud = 10;
        return accuracyOf(0, 0, fraud, total - fraud) * 100;
      },
    },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'evaluation-metrics-006',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    stem: 'A model flags **defective** parts (the positive class). Its results on 200 parts are in the confusion matrix. Which statement is **true**?',
    table: {
      caption: 'Rows: actual class. Columns: predicted class.',
      headers: ['Actual class', 'Predicted: defective', 'Predicted: not defective'],
      rows: [
        ['Defective', 30, 20],
        ['Not defective', 10, 140],
      ],
    },
    options: [
      'The recall is $75\\%$',
      'The model makes $20$ false positives',
      'The precision is $75\\%$',
      'The accuracy is $15\\%$',
    ],
    correctIndex: 2,
    markScheme: {
      asking: 'Which of the four claims about this table is correct?',
      solution:
        'Defective is the positive class. Rows tell you the actual class and columns tell you the prediction, so label each cell:\n\n| Actual | Predicted | Name | Count |\n|---|---|---|---|\n| Defective | Defective | TP (true positive) | 30 |\n| Defective | Not defective | FN (false negative) | 20 |\n| Not defective | Defective | FP (false positive) | 10 |\n| Not defective | Not defective | TN (true negative) | 140 |\n\n' +
        'Test the recall claim. **Recall** is the share of actual positives found: $\\frac{\\text{TP}}{\\text{TP} + \\text{FN}} = \\frac{30}{30 + 20} = \\frac{30}{50} = 60\\%$. That isn\'t 75%, so this claim is false.\n\n' +
        'Test the false positives claim. The table shows FP is 10. The 20 are false negatives, so this claim is false.\n\n' +
        'Test the accuracy claim. **Accuracy** is the share of all predictions that are correct: $\\frac{30 + 140}{200} = \\frac{170}{200} = 85\\%$. That isn\'t 15%, so this claim is false.\n\n' +
        'Test the precision claim. **Precision** is the share of positive predictions that are right: $\\frac{\\text{TP}}{\\text{TP} + \\text{FP}} = \\frac{30}{30 + 10} = \\frac{30}{40} = 75\\%$. This claim is true.',
      conclusion: 'The other three claims all fail, and 30 of the 40 flagged parts really are defective, so the answer is The precision is $75\\%$.',
      whyWrong: [
        '$75\\%$ is the **precision** ($\\frac{30}{40}$, dividing by the "Predicted: defective" column). Recall divides by the "Defective" row, all actual defective parts: $\\frac{30}{50} = 60\\%$.',
        'The $20$ is in the "Actual: defective, predicted not defective" cell, so those are **false negatives** (missed defective parts). There are only $10$ false positives.',
        null,
        '$15\\%$ is the **error rate**, $\\frac{20 + 10}{200}$: the fraction classified wrongly. Accuracy counts the correct ones on the diagonal: $\\frac{30 + 140}{200} = 85\\%$.',
      ],
      keyIdea: 'For "which statement is true", label the four cells first, then calculate each claim in turn. Precision uses the cells predicted positive. Recall uses the cells that are actually positive.',
    },
    check: {
      optionValues: ['recall75', 'fp20', 'precision75', 'accuracy15'],
      compute: () => {
        const tp = 30;
        const fn = 20;
        const fp: number = 10;
        const tn = 140;
        const claims: [string, boolean][] = [
          ['recall75', recallOf(tp, fn) === 0.75],
          ['fp20', fp === 20],
          ['precision75', precisionOf(tp, fp) === 0.75],
          ['accuracy15', accuracyOf(tp, fp, fn, tn) === 0.15],
        ];
        const trueOnes = claims.filter(([, ok]) => ok).map(([k]) => k);
        return trueOnes.length === 1 ? trueOnes[0] : 'not unique';
      },
    },
  },
  {
    id: 'evaluation-metrics-007',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    stem: 'A classifier has precision $0.6$ and recall $0.9$. What is its **F1 score**?',
    options: ['$0.72$', '$0.75$', '$0.54$', '$0.36$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How do precision 0.6 and recall 0.9 combine into one F1 score?',
      solution:
        'The **F1 score** combines precision $P$ and recall $R$ into one number. It uses a special average called the **harmonic mean**: $F_1 = \\frac{2PR}{P + R}$.\n\n' +
        'It uses this average because a low value drags it down, so a model can\'t hide poor recall behind good precision, or the other way round.\n\n' +
        'Work out the top: $2 \\times 0.6 \\times 0.9 = 2 \\times 0.54 = 1.08$.\n\n' +
        'Work out the bottom: $0.6 + 0.9 = 1.5$.\n\n' +
        'Divide: $\\frac{1.08}{1.5} = 0.72$.',
      conclusion: 'Twice the product over the sum is $\\frac{1.08}{1.5}$, so the F1 score is $0.72$.',
      whyWrong: [
        null,
        'This is the ordinary (arithmetic) mean $\\frac{0.6 + 0.9}{2}$. F1 uses the harmonic mean, which is pulled towards the lower of the two values.',
        'This is just $0.6 \\times 0.9$: the product on top without the factor 2 and without dividing by $P + R$.',
        'This is $\\frac{0.6 \\times 0.9}{1.5}$: the factor 2 on top of the formula has been forgotten.',
      ],
      keyIdea: 'When you\'re given precision and recall and asked for F1, use $F_1 = \\frac{2PR}{P + R}$. The result always lies between the two values and is never above their ordinary average, which helps to rule out options.',
    },
    check: {
      optionValues: [0.72, 0.75, 0.54, 0.36],
      compute: () => {
        const p = new Frac(6, 10);
        const r = new Frac(9, 10);
        // harmonic mean = 2 / (1/P + 1/R)
        return new Frac(2).div(new Frac(1).div(p).add(new Frac(1).div(r))).value();
      },
    },
  },
  {
    id: 'evaluation-metrics-008',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    stem: 'The table shows a churn model\'s results on 200 customers, with churn as the positive class. **The rows are the predicted class.** What is the F1 score?',
    table: {
      caption: 'Rows: predicted class. Columns: actual class.',
      headers: ['Predicted class', 'Actually churned', 'Actually stayed'],
      rows: [
        ['Predicted churn', 30, 10],
        ['Predicted stay', 30, 130],
      ],
    },
    options: ['$0.625$', '$0.6$', '$0.8$', '$0.375$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What is the F1 score, given a table whose rows are the predictions?',
      solution:
        'The rows here are the **predicted** class and the columns are the **actual** class, the opposite of the usual layout. So read each cell by its labels, not its position.\n\n' +
        'Churn is the positive class. Label the cells we need:\n\n| Predicted | Actual | Name | Count |\n|---|---|---|---|\n| Churn | Churned | TP (true positive) | 30 |\n| Churn | Stayed | FP (false positive) | 10 |\n| Stay | Churned | FN (false negative) | 30 |\n\n' +
        '**Precision** $P$ is the share of churn predictions that were right: $P = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}} = \\frac{30}{30 + 10} = \\frac{30}{40} = 0.75$.\n\n' +
        '**Recall** $R$ is the share of real churners the model found: $R = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}} = \\frac{30}{30 + 30} = \\frac{30}{60} = 0.5$.\n\n' +
        'The **F1 score** combines them with $F_1 = \\frac{2PR}{P + R}$. The top is $2 \\times 0.75 \\times 0.5 = 0.75$. The bottom is $0.75 + 0.5 = 1.25$. So $F_1 = \\frac{0.75}{1.25} = 0.6$.',
      conclusion: 'With precision 0.75 and recall 0.5, the formula gives an F1 score of $0.6$.',
      whyWrong: [
        'This is the ordinary average $\\frac{0.75 + 0.5}{2}$. F1 is the harmonic mean, $\\frac{2PR}{P + R}$, which is lower.',
        null,
        'This is the **accuracy**, $\\frac{30 + 130}{200}$. It is inflated by the 130 customers correctly predicted to stay.',
        'This is $P \\times R = 0.75 \\times 0.5$: the multiplication is right but the factor 2 and the division by $P + R$ are missing.',
      ],
      keyIdea: 'Read a table\'s labels before using any cell, because rows and columns can be swapped. Find TP, FP and FN, then use $P$ and $R$ in $\\frac{2PR}{P + R}$, or go straight to $\\frac{2\\text{TP}}{2\\text{TP} + \\text{FP} + \\text{FN}}$.',
    },
    check: {
      optionValues: [0.625, 0.6, 0.8, 0.375],
      compute: () => {
        // rows = predicted, columns = actual
        const tp = 30;
        const fp: number = 10;
        const fn = 30;
        return f1Of(tp, fp, fn);
      },
    },
  },
  {
    id: 'evaluation-metrics-009',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    stem: 'A model is the first screening step for a serious but treatable cancer. Flagged patients get a cheap, safe follow-up test. Which metric should be made as high as possible?',
    options: [
      'Precision',
      'Recall',
      'Accuracy',
      'Specificity',
    ],
    correctIndex: 1,
    markScheme: {
      asking: 'In cancer screening with cheap follow-up tests, which measure matters most?',
      solution:
        'Think about the two possible mistakes. A **false positive** flags a healthy person: they take a cheap, safe extra test and are fine. A **false negative** misses someone with cancer: they get no follow-up, and a treatable cancer goes untreated.\n\n' +
        'So false negatives are by far the worse mistake, and we want as few of them as possible.\n\n' +
        'The metric built around false negatives is **recall**: $\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$, the share of real cases the model catches. TP is true positives and FN is false negatives. Fewer false negatives means a higher value.',
      conclusion: 'Missing a cancer is the costly mistake and this metric counts exactly those misses, so the answer is Recall.',
      whyWrong: [
        'Precision, $\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$, punishes **false positives**. Here false positives are cheap; the dangerous mistake is the false negative.',
        null,
        'Cancer is rare, so accuracy is dominated by the many healthy patients. A model could have high accuracy while still missing many cancers.',
        'Specificity measures how well **healthy** patients are cleared, which is again about false positives, the cheap kind of mistake in this situation.',
      ],
      keyIdea: 'Ask which mistake costs more. If missing a real case is worse, maximise recall. If a false alarm is worse, maximise precision. Don\'t trust accuracy when the thing you\'re looking for is rare.',
    },
  },
  {
    id: 'evaluation-metrics-010',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    stem: 'For which task is high **precision** more important than high recall?',
    options: [
      'An airport scanner flagging bags for a quick manual check',
      'A first-stage disease screen followed by a cheap second test',
      'A system flagging engine parts for an engineer to inspect',
      'A spam filter that **permanently deletes** flagged emails',
    ],
    correctIndex: 3,
    markScheme: {
      asking: 'In which task are false alarms worse than missed cases?',
      solution:
        'High **precision** means few **false positives**: false alarms, items flagged that shouldn\'t have been. High **recall** means few **false negatives**: real cases that get missed.\n\n' +
        'So precision matters more only when a false alarm does more damage than a miss. Compare the costs in each task:\n\n| Task | A false alarm costs | A miss costs |\n|---|---|---|\n| Airport scanner | A quick check | A weapon gets through |\n| Disease screen | A cheap second test | An illness goes untreated |\n| Engine parts | An inspection | A possible crash |\n| Spam filter that deletes | A real email lost for ever | One spam email in the inbox |\n\n' +
        'Only in the last row is the false alarm the disaster. A deleted email can\'t be recovered, while a missed spam email is a small annoyance.',
      conclusion: 'False alarms do the most damage when flagged items are destroyed, so the answer is A spam filter that **permanently deletes** flagged emails.',
      whyWrong: [
        'Here a false negative (a missed weapon) is the disaster and a false positive only costs a quick check, so recall is the priority, not precision.',
        'Missing an ill patient (false negative) is far worse than a cheap second test (false positive), so this task needs high recall.',
        'A faulty part that is missed could cause a crash, while a wrongly flagged part only costs an inspection, so recall matters more here.',
        null,
      ],
      keyIdea: 'For each task, write down what a false alarm costs and what a miss costs. If a false alarm is worse, precision matters most. If a miss is worse, recall matters most. A cheap follow-up check makes false alarms harmless.',
    },
  },
  {
    id: 'evaluation-metrics-011',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    stem: 'A classifier predicts **positive** when its probability is at least a threshold. The threshold is raised from $0.5$ to $0.8$. What typically happens?',
    options: [
      'Precision falls and recall rises',
      'Both precision and recall rise',
      'Precision rises and recall falls',
      'Precision and recall stay the same; only accuracy changes',
    ],
    correctIndex: 2,
    markScheme: {
      asking: 'What happens to precision and recall when the model must be more sure before saying positive?',
      solution:
        'The model gives each example a probability. If that reaches the **threshold**, it predicts positive. Raising the threshold from 0.5 to 0.8 means it says positive less often, and only when it is more sure.\n\n' +
        'Here is a tiny example. Suppose there are 10 real positives. At 0.5 the model flags 10 examples: 8 real and 2 false alarms. At 0.8 it flags 5 examples: all 5 real.\n\n' +
        '**Precision** is the share of positive predictions that are right. In the example it goes from $\\frac{8}{10}$ to $\\frac{5}{5}$. The predictions dropped are the least certain ones, and those include most false alarms, so precision usually goes up.\n\n' +
        '**Recall** is the share of real positives that are found. In the example it goes from $\\frac{8}{10}$ to $\\frac{5}{10}$. Saying positive less often can only lose real positives, so recall goes down.',
      conclusion: 'Saying positive less often makes those calls more reliable but misses more real cases, so the answer is Precision rises and recall falls.',
      whyWrong: [
        'This is what happens when the threshold is **lowered**: more examples are called positive, catching more real positives but also more false alarms.',
        'Raising the threshold can only remove positive predictions, so true positives cannot increase; recall cannot rise.',
        null,
        'Changing the threshold changes which examples are predicted positive, so TP, FP and FN all change, and therefore precision and recall change too.',
      ],
      keyIdea: 'Use the trade-off. Higher threshold: fewer positive predictions, so higher precision and lower recall. Lower threshold: more positive predictions, so lower precision and higher recall. If unsure, invent small numbers and work out both.',
    },
  },
  {
    id: 'evaluation-metrics-012',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    stem: 'A spam filter predicts **spam** when an email\'s score is at least $0.5$. Using the scores and true labels in the table, what is the **precision**?',
    table: {
      headers: ['Email', 'Score', 'Actually spam?'],
      rows: SPAM_SCORES.map(([s, pos], i) => [i + 1, s.toFixed(2), yesNo(pos)]),
    },
    options: ['$\\frac{2}{3}$', '$\\frac{4}{5}$', '$\\frac{7}{10}$', '$\\frac{2}{5}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Of the emails the filter calls spam, what fraction really are spam?',
      solution:
        '**Precision** is the share of spam predictions that are right: $\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$. TP (true positive) is predicted spam and really spam. FP (false positive) is predicted spam but not really spam.\n\n' +
        'The filter predicts spam when the score is at least 0.5. That means emails 1 to 6, because email 6 scores 0.55 and email 7 only 0.40.\n\n' +
        'Compare those six with the last column of the table:\n\n| Email | Score | Actually spam? | Outcome |\n|---|---|---|---|\n| 1 | 0.95 | Yes | TP |\n| 2 | 0.85 | Yes | TP |\n| 3 | 0.80 | No | FP |\n| 4 | 0.70 | Yes | TP |\n| 5 | 0.65 | No | FP |\n| 6 | 0.55 | Yes | TP |\n\n' +
        'Count them: TP is 4 and FP is 2. Emails 7 to 10 were not predicted spam, so they play no part in precision.\n\n' +
        'Substitute: $\\frac{4}{4 + 2} = \\frac{4}{6}$. Divide top and bottom by 2 to simplify, which gives $\\frac{2}{3}$.',
      conclusion: '4 of the 6 emails flagged really are spam, so the precision is $\\frac{2}{3}$.',
      whyWrong: [
        null,
        'This is the **recall**: 4 of the 5 actual spam emails were caught (email 8, score $0.30$, was missed). Precision divides by the 6 emails predicted spam.',
        'This is the **accuracy**: 4 true positives plus 3 true negatives (emails 7, 9, 10) out of 10.',
        'This is $\\frac{4}{10}$: it divides the true positives by all 10 emails instead of only the 6 that were predicted spam.',
      ],
      keyIdea: 'With scores and a threshold, first mark which examples are predicted positive. For precision, use only those rows: how many are really positive, out of how many were flagged.',
    },
    check: {
      optionValues: [2 / 3, 4 / 5, 7 / 10, 2 / 5],
      compute: () => {
        const c = countAt(SPAM_SCORES, 0.5);
        return precisionOf(c.tp, c.fp);
      },
    },
  },
  {
    id: 'evaluation-metrics-013',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    stem: 'Of 1000 transactions, 10 are fraudulent. **Model A** predicts "not fraud" every time. **Model B** flags 50 as fraud, and 8 of those really are. Which statement is correct?',
    options: [
      'Model B has the higher accuracy',
      'Model A has higher accuracy, but Model B has higher recall',
      'Model A is the better fraud detector, with 99% accuracy',
      'Model B has a precision of 80%',
    ],
    correctIndex: 1,
    markScheme: {
      asking: 'Which model wins on accuracy, and which wins on catching fraud?',
      solution:
        '**Accuracy** is the share of all predictions that are correct. **Recall** is the share of real frauds caught. **Precision** is the share of fraud flags that are right.\n\n' +
        'Model A says "not fraud" every time. It is right on the $1000 - 10 = 990$ genuine transactions, so its accuracy is $\\frac{990}{1000} = 99\\%$. It catches none of the 10 frauds, so its recall is 0.\n\n' +
        'Model B flags 50, and 8 of those are real. So it has 8 caught frauds and $50 - 8 = 42$ false alarms.\n\n' +
        'Model B\'s correct predictions are the 8 caught frauds plus the genuine transactions it left alone, $990 - 42 = 948$. So its accuracy is $\\frac{8 + 948}{1000} = \\frac{956}{1000} = 95.6\\%$.\n\n' +
        'Model B\'s recall is $\\frac{8}{10} = 80\\%$, and its precision is $\\frac{8}{50} = 16\\%$. Comparing the two models, accuracy is 99% against 95.6%, and recall is 0 against 80%.',
      conclusion: 'Model A\'s high score only comes from fraud being rare, so the correct statement is Model A has higher accuracy, but Model B has higher recall.',
      whyWrong: [
        'Model B\'s 42 false alarms count as errors too: its accuracy is $\\frac{956}{1000} = 95.6\\%$, which is lower than Model A\'s 99%.',
        null,
        'This trusts accuracy on imbalanced data. Model A gets 99% just by always saying "not fraud", but its recall is 0: it never catches a single fraud.',
        '80% is Model B\'s **recall** ($\\frac{8}{10}$). Its precision is $\\frac{8}{50} = 16\\%$, because 42 of its 50 flags are false alarms.',
      ],
      keyIdea: 'On imbalanced data, where one class is much rarer, work out accuracy and recall for each model in a small table. A model that always says the common class scores high accuracy but has a recall of 0.',
    },
  },
  {
    id: 'evaluation-metrics-014',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    stem: 'A model is tested on data with 60 actual positives. Its recall is $0.75$ and its precision is $0.9$. How many **false positives** does it make?',
    options: ['$15$', '$5$', '$6$', '$50$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many items does the model wrongly call positive?',
      solution:
        'We need the **false positives** (FP): items that are really negative but predicted positive. We are given recall and precision, and each one unlocks a number. TP means true positives.\n\n' +
        '**Recall** is $\\frac{\\text{TP}}{\\text{actual positives}}$. There are 60 actual positives and recall is 0.75, so $\\frac{\\text{TP}}{60} = 0.75$.\n\n' +
        'Multiply both sides by 60 to get TP on its own: $\\text{TP} = 0.75 \\times 60 = 45$.\n\n' +
        '**Precision** is $\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$, where the bottom is everything predicted positive. So $\\frac{45}{\\text{TP} + \\text{FP}} = 0.9$.\n\n' +
        'Multiply both sides by the bottom, then divide by 0.9, to get the bottom on its own: $\\text{TP} + \\text{FP} = \\frac{45}{0.9} = 50$. So the model made 50 positive predictions.\n\n' +
        'Of those 50, 45 were right. The rest are false positives: $\\text{FP} = 50 - 45 = 5$.',
      conclusion: 'It predicts positive 50 times and is right 45 times, so it makes $5$ false positives.',
      whyWrong: [
        'This is the number of **false negatives**, $60 - 45 = 15$: the actual positives that were missed. False positives come from the precision, not the recall.',
        null,
        'This is $0.1 \\times 60$: it applies "10% of positive predictions are wrong" to the 60 **actual** positives. Precision is about the 50 **predicted** positives.',
        'This is $\\text{TP} + \\text{FP} = 50$, the total number of positive predictions; the 45 true positives still need to be subtracted.',
      ],
      keyIdea: 'To go backwards from metrics to counts: recall and the actual positives give TP. Then TP and precision give the predicted positives. Subtract TP from the predicted positives for FP, or from the actual positives for FN.',
    },
    check: {
      optionValues: [15, 5, 6, 50],
      compute: () => {
        const actualPos = 60;
        const tp = new Frac(3, 4).mul(actualPos);
        const predictedPos = tp.div(new Frac(9, 10));
        return predictedPos.sub(tp).value();
      },
    },
  },
  {
    id: 'evaluation-metrics-015',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    stem: 'Arrays are indexed from 1. `T` holds true labels and `P` holds predictions, with 1 meaning positive. What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: `T = [1, 0, 1, 1, 0, 1, 0, 0]
P = [1, 0, 0, 1, 1, 1, 0, 1]
tp = 0
fp = 0
for i = 1 to 8
   if T[i] == 1 and P[i] == 1
      tp = tp + 1
   end if
   if T[i] == 0 and P[i] == 1
      fp = fp + 1
   end if
end for
print(tp / (tp + fp))`,
    },
    options: [
      '$0.6$',
      '$0.75$',
      '$0.625$',
      '$0.375$',
    ],
    correctIndex: 0,
    markScheme: {
      asking: 'What number does the code print after comparing the two arrays?',
      solution:
        '`T` holds the true labels and `P` the predictions, where 1 means positive and 0 means negative. The loop on line 5 looks at one position `i` at a time, from 1 to 8.\n\n' +
        'Line 6 is true when `T[i]` and `P[i]` are both 1, so `tp` counts true positives: really positive and predicted positive.\n\n' +
        'Line 9 is true when `T[i]` is 0 and `P[i]` is 1, so `fp` counts false positives: really negative but predicted positive. When `P[i]` is 0, neither condition is true and nothing changes.\n\n' +
        'Trace it, one row per position:\n\n| `i` | `T[i]` | `P[i]` | What happens | `tp` | `fp` |\n|---|---|---|---|---|---|\n| 1 | 1 | 1 | `tp` goes up | 1 | 0 |\n| 2 | 0 | 0 | nothing | 1 | 0 |\n| 3 | 1 | 0 | nothing | 1 | 0 |\n| 4 | 1 | 1 | `tp` goes up | 2 | 0 |\n| 5 | 0 | 1 | `fp` goes up | 2 | 1 |\n| 6 | 1 | 1 | `tp` goes up | 3 | 1 |\n| 7 | 0 | 0 | nothing | 3 | 1 |\n| 8 | 0 | 1 | `fp` goes up | 3 | 2 |\n\n' +
        'Line 13 prints `tp / (tp + fp)`, which is the formula for precision. With `tp` at 3 and `fp` at 2, that is $\\frac{3}{3 + 2} = \\frac{3}{5} = 0.6$.',
      conclusion: 'The loop finds 3 true positives and 2 false positives, so the code prints $0.6$.',
      whyWrong: [
        null,
        'This is the **recall**, $\\frac{3}{4}$, dividing by the 4 actual positives. The code divides by `tp + fp`, the predicted positives.',
        'This is the **accuracy**, $\\frac{5}{8}$, counting the 5 positions where the two arrays agree. The code only counts positive predictions.',
        'This is $\\frac{3}{8}$: the true positives divided by all 8 examples. The code divides by `tp + fp` $= 5$.',
      ],
      keyIdea: 'Spot the metric from the last line: `tp / (tp + fp)` is precision and `tp / (tp + fn)` is recall. Then go through the arrays position by position, marking each as TP, FP, FN or TN, and count.',
    },
    check: {
      optionValues: [0.6, 0.75, 0.625, 0.375],
      compute: () => {
        const T = [1, 0, 1, 1, 0, 1, 0, 0];
        const P = [1, 0, 0, 1, 1, 1, 0, 1];
        let tp = 0;
        let fp = 0;
        T.forEach((t, i) => {
          if (t === 1 && P[i] === 1) tp++;
          if (t === 0 && P[i] === 1) fp++;
        });
        return precisionOf(tp, fp);
      },
    },
  },
  {
    id: 'evaluation-metrics-019',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    stem: 'A disease affects 1% of 10,000 people. A model has recall 90% and wrongly flags 5% of healthy people. What is its **precision** (the fraction of flagged people who really have the disease)?',
    options: ['$\\frac{2}{13}$', '$\\frac{9}{10}$', '$\\frac{9}{1000}$', '$\\frac{19}{20}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Of the people flagged, what fraction really have the disease?',
      solution:
        '**Precision** is $\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$. TP (true positives) are ill people who get flagged. FP (false positives) are healthy people who get flagged. We need both counts, so we turn the percentages into people.\n\n' +
        'Split the population. Ill: 1% of 10,000 is $0.01 \\times 10{,}000 = 100$ people. Healthy: $10{,}000 - 100 = 9{,}900$ people.\n\n' +
        '**Recall** is the share of ill people who get flagged. It is 90%, so $\\text{TP} = 0.9 \\times 100 = 90$.\n\n' +
        'The model wrongly flags 5% of healthy people, so $\\text{FP} = 0.05 \\times 9{,}900 = 495$.\n\n' +
        'Substitute into the formula: $\\text{Precision} = \\frac{90}{90 + 495} = \\frac{90}{585}$.\n\n' +
        'Simplify by dividing top and bottom by 45. $90 \\div 45 = 2$ and $585 \\div 45 = 13$, which gives $\\frac{2}{13}$.',
      conclusion: 'Healthy people are so common that false alarms outnumber real cases, 495 to 90, so the precision is only $\\frac{2}{13}$.',
      whyWrong: [
        null,
        'This is the **recall** given in the question. Precision divides by everyone flagged, which includes the 495 false positives.',
        'This is $\\frac{90}{10000}$: the true positives divided by the whole population instead of by the 585 people flagged.',
        'This is $1 - 0.05$, the fraction of healthy people correctly cleared (the specificity). It says nothing about how many flagged people are ill.',
      ],
      keyIdea: 'For a rare condition, turn percentages into a table of people: ill and healthy, flagged and not flagged. A round population such as 10,000 avoids fractions. Then precision is ill and flagged, divided by everyone flagged.',
    },
    check: {
      optionValues: [2 / 13, 9 / 10, 9 / 1000, 19 / 20],
      compute: () => {
        const N = 10000;
        const ill = new Frac(1, 100).mul(N);
        const tp = new Frac(9, 10).mul(ill);
        const fp = new Frac(5, 100).mul(new Frac(N).sub(ill));
        return tp.div(tp.add(fp)).value();
      },
    },
  },

  // ---------------------------------------------------------------- recall
  {
    id: 'evaluation-metrics-021',
    subtopic: 'evaluation-metrics',
    difficulty: 'foundation',
    stem: 'What is a **false negative**?',
    options: ['An actual positive predicted as negative', 'An actual negative predicted as positive', 'An actual negative predicted as negative', 'An actual positive predicted as positive'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does the term false negative mean?',
      solution:
        'Read the two words backwards. The second word is what the model predicted, so "negative" means the model said no.\n\n' +
        'The first word says whether that prediction was right. "False" means it was wrong, so the real answer was yes.\n\n' +
        'For example, a medical test says a patient is healthy when they really have the disease. The model said negative, and the truth is positive.',
      conclusion: 'The model said negative but the truth was positive, so a false negative is An actual positive predicted as negative.',
      whyWrong: [
        null,
        'This is a **false positive**: the model predicted positive and was wrong, a false alarm.',
        'This is a **true negative**: the prediction of negative was correct.',
        'This is a **true positive**: the prediction of positive was correct.',
      ],
      keyIdea: 'Decode any of the four outcome names from its two words: the second word is the prediction, and the first word says if that prediction was right. So a false prediction of negative means the truth was positive.',
    },
  },
  {
    id: 'evaluation-metrics-022',
    subtopic: 'evaluation-metrics',
    difficulty: 'foundation',
    stem: 'Which formula gives the **recall** of a binary classifier?',
    options: [
      '$\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$',
      '$\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$',
      '$\\frac{\\text{TP} + \\text{TN}}{\\text{TP} + \\text{TN} + \\text{FP} + \\text{FN}}$',
      '$\\frac{\\text{TN}}{\\text{TN} + \\text{FP}}$',
    ],
    correctIndex: 0,
    markScheme: {
      asking: 'Which of these formulas is the one for recall?',
      solution:
        '**TP** (true positives) are positive cases the model found. **FN** (false negatives) are positive cases the model missed. **FP** (false positives) are negative cases wrongly called positive.\n\n' +
        '**Recall** asks: of all the cases that are really positive, what share did the model find? If 20 people are ill and the model finds 15, recall is $\\frac{15}{20}$.\n\n' +
        'Every real positive is either found (TP) or missed (FN), so the bottom is the sum of those two. The top is the ones found, which is TP.',
      conclusion: 'Found positives over all real positives gives $\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$.',
      whyWrong: [
        null,
        'This is **precision**, which divides by everything **predicted** positive. Recall divides by everything **actually** positive.',
        'This is **accuracy**: the fraction of all predictions that are correct.',
        'This is **specificity**: the fraction of actual negatives correctly predicted negative.',
      ],
      keyIdea: 'Precision and recall both have TP on top. For the bottom, ask what you\'re counting from. Recall counts from real positives, $\\text{TP} + \\text{FN}$. Precision counts from predicted positives, $\\text{TP} + \\text{FP}$.',
    },
  },
  {
    id: 'evaluation-metrics-023',
    subtopic: 'evaluation-metrics',
    difficulty: 'foundation',
    stem: 'The F1 score is which type of mean of precision and recall?',
    options: ['Harmonic mean', 'Arithmetic mean', 'Geometric mean', 'Quadratic mean'],
    correctIndex: 0,
    markScheme: {
      asking: 'What kind of average is the F1 score?',
      solution:
        'The F1 score combines precision $P$ and recall $R$ with the formula $F_1 = \\frac{2PR}{P + R}$.\n\n' +
        'This average is pulled towards the lower value. Try $P = 1$ and $R = 0.2$. The formula gives $\\frac{2 \\times 1 \\times 0.2}{1 + 0.2} = \\frac{0.4}{1.2} \\approx 0.33$, while the ordinary average is 0.6.\n\n' +
        'The average with exactly this formula, twice the product over the sum, is called the **harmonic mean**.',
      conclusion: 'F1 uses twice the product over the sum, so it is the Harmonic mean of precision and recall.',
      whyWrong: [
        null,
        'The arithmetic mean is $\\frac{P + R}{2}$, the ordinary average. It would let a high value hide a very low one.',
        'The geometric mean is $\\sqrt{PR}$, which is a different average and is not what F1 uses.',
        'The quadratic mean is $\\sqrt{\\frac{P^2 + R^2}{2}}$, which is pulled towards the **larger** value, the opposite of what F1 wants.',
      ],
      keyIdea: 'Recognise a mean of two numbers $a$ and $b$ by its formula. Arithmetic: $\\frac{a + b}{2}$. Geometric: $\\sqrt{ab}$. Harmonic: $\\frac{2ab}{a + b}$. The harmonic mean suits F1 because the lower value drags it down, so a model can only score well when precision and recall are both good.',
    },
  },
];
