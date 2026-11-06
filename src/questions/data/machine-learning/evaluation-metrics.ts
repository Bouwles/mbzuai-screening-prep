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
      solution:
        'Read the two words of the name separately.\n\n' +
        '1. The **second** word is what the model *predicted*. The filter said "spam", which is the positive class, so the second word is **positive**.\n' +
        '2. The **first** word says whether that prediction was right. The email was actually genuine, so the prediction was wrong: **false**.\n\n' +
        'Putting them together: a **false positive (FP)**. In plain English, it is a false alarm.',
      whyWrong: [
        'A true positive would need the email to really be spam. Here the prediction "spam" was wrong, so the first word must be "false", not "true".',
        'A false negative is the other kind of error: a spam email that the filter lets through (it predicted "not spam"). Here the filter predicted "spam", so the outcome is a positive, not a negative.',
        null,
        'A true negative is a genuine email that the filter correctly leaves alone. Here the filter predicted "spam", so it is not a negative at all.',
      ],
      keyIdea: 'The second word (positive/negative) is what the model predicted; the first word (true/false) says whether it was right.',
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
      solution:
        'Treat "cat" as the positive class and read the four cells:\n\n' +
        '- TP (actual cat, predicted cat) $= 45$\n' +
        '- FN (actual cat, predicted not cat) $= 15$\n' +
        '- FP (actual not cat, predicted cat) $= 5$\n' +
        '- TN (actual not cat, predicted not cat) $= 35$\n\n' +
        'Total photos: $45 + 15 + 5 + 35 = 100$.\n\n' +
        'Correct predictions are on the diagonal: $\\text{TP} + \\text{TN} = 45 + 35 = 80$.\n\n' +
        '$$\\text{Accuracy} = \\frac{\\text{TP} + \\text{TN}}{\\text{total}} = \\frac{80}{100} = 0.8$$',
      whyWrong: [
        'This is $\\frac{45}{50}$, the **precision** (correct cats out of everything predicted "cat"). Accuracy counts every correct prediction, cats and non-cats.',
        null,
        'This is $\\frac{45}{60}$, the **recall** (cats found out of all actual cats). Accuracy also gives credit for the 35 non-cats correctly rejected.',
        'This is $\\frac{45}{100}$: it only counts the true positives as correct and forgets the 35 true negatives, which are also correct predictions.',
      ],
      keyIdea: 'Accuracy is the fraction of ALL predictions that are correct: the diagonal of the confusion matrix divided by the total.',
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
      solution:
        'Precision answers the question: **"Of everything the model predicted positive, how many really were positive?"**\n\n' +
        '- Everything predicted positive = the correct positives plus the false alarms $= \\text{TP} + \\text{FP}$.\n' +
        '- The ones that really were positive $= \\text{TP}$.\n\n' +
        'So\n\n' +
        '$$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$$\n\n' +
        'Memory trick: **P**recision is about the **P**redicted positives; **R**ecall is about the **R**eal (actual) positives.',
      whyWrong: [
        'This is **recall**: it divides by all *actual* positives ($\\text{TP} + \\text{FN}$), so it measures how many real positives were found, not how trustworthy a positive prediction is.',
        'This is **accuracy**: the fraction of all predictions (positive and negative) that are correct.',
        'This is **specificity** (the true negative rate): the fraction of actual negatives correctly predicted negative. It does not involve the true positives at all.',
        null,
      ],
      keyIdea: 'Precision = TP divided by everything the model PREDICTED positive (TP + FP).',
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
      solution:
        'Positive class = "has the disease". Turn the words into counts:\n\n' +
        '- TP (ill and flagged) $= 15$\n' +
        '- FN (ill but not flagged) $= 20 - 15 = 5$\n' +
        '- FP (healthy but flagged) $= 10$\n\n' +
        'Recall asks: of the patients who **really** have the disease, what fraction did the model find?\n\n' +
        '$$\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}} = \\frac{15}{15 + 5} = \\frac{15}{20} = 0.75$$\n\n' +
        'The 10 false positives do not affect recall at all.',
      whyWrong: [
        null,
        'This is $\\frac{15}{25}$, the **precision**: it divides by all 25 flagged patients (including the 10 healthy ones). Recall divides by the 20 patients who are actually ill.',
        'This is $\\frac{15}{200}$: it divides by every patient screened, not just the 20 who have the disease.',
        'This is the **accuracy**, $\\frac{15 + 170}{200}$, which also counts the 170 healthy patients correctly cleared. Recall only looks at the ill patients.',
      ],
      keyIdea: 'Recall = TP divided by all ACTUAL positives (TP + FN): what fraction of the real cases did the model catch?',
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
      solution:
        'The model says "not fraud" every time.\n\n' +
        '- It is right for every genuine transaction: $500 - 10 = 490$ correct (true negatives).\n' +
        '- It is wrong for the 10 frauds (false negatives).\n\n' +
        '$$\\text{Accuracy} = \\frac{490}{500} = 0.98 = 98\\%$$\n\n' +
        'This looks excellent, but the model is useless: it never catches a single fraud (its recall is $0$). This is why **accuracy is misleading on imbalanced data**.',
      whyWrong: [
        'This is $\\frac{10}{500}$, the fraction of transactions that are fraud. Accuracy counts correct predictions, and the model is correct on the 490 genuine ones.',
        'This is the model\'s **recall** (it catches none of the 10 frauds). Accuracy also counts the 490 genuine transactions it labelled correctly.',
        'This assumes that with two classes a model must score about 50%. The classes here are very unbalanced, so always guessing the majority class scores far higher.',
        null,
      ],
      keyIdea: 'On imbalanced data, always predicting the majority class gives a high accuracy even though the model finds none of the cases you care about.',
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
      solution:
        'First read the four cells carefully (rows are the **actual** class):\n\n' +
        '- TP (defective, predicted defective) $= 30$\n' +
        '- FN (defective, predicted not defective) $= 20$\n' +
        '- FP (not defective, predicted defective) $= 10$\n' +
        '- TN (not defective, predicted not defective) $= 140$\n\n' +
        'Now work out each metric:\n\n' +
        '- Recall $= \\frac{\\text{TP}}{\\text{TP} + \\text{FN}} = \\frac{30}{50} = 60\\%$\n' +
        '- Accuracy $= \\frac{\\text{TP} + \\text{TN}}{200} = \\frac{170}{200} = 85\\%$\n' +
        '- Precision $= \\frac{\\text{TP}}{\\text{TP} + \\text{FP}} = \\frac{30}{40} = 75\\%$\n\n' +
        'So the true statement is that the **precision is $75\\%$**: of the 40 parts flagged as defective, 30 really were.',
      whyWrong: [
        '$75\\%$ is the **precision** ($\\frac{30}{40}$, dividing by the "Predicted: defective" column). Recall divides by the "Defective" row, all actual defective parts: $\\frac{30}{50} = 60\\%$.',
        'The $20$ is in the "Actual: defective, predicted not defective" cell, so those are **false negatives** (missed defective parts). There are only $10$ false positives.',
        null,
        '$15\\%$ is the **error rate**, $\\frac{20 + 10}{200}$: the fraction classified wrongly. Accuracy counts the correct ones on the diagonal: $\\frac{30 + 140}{200} = 85\\%$.',
      ],
      keyIdea: 'For "which statement is true" on a confusion matrix, write down TP, FP, FN and TN from the labels first, then compute each metric the options mention.',
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
      solution:
        'The F1 score is the **harmonic mean** of precision $P$ and recall $R$:\n\n' +
        '$$F_1 = \\frac{2PR}{P + R}$$\n\n' +
        'Top: $2 \\times 0.6 \\times 0.9 = 1.08$\n\n' +
        'Bottom: $0.6 + 0.9 = 1.5$\n\n' +
        '$$F_1 = \\frac{1.08}{1.5} = 0.72$$\n\n' +
        'Check: the harmonic mean is always pulled towards the **smaller** value, so it should be below the ordinary average $0.75$. It is.',
      whyWrong: [
        null,
        'This is the ordinary (arithmetic) mean $\\frac{0.6 + 0.9}{2}$. F1 uses the harmonic mean, which is pulled towards the lower of the two values.',
        'This is just $0.6 \\times 0.9$: the product on top without the factor 2 and without dividing by $P + R$.',
        'This is $\\frac{0.6 \\times 0.9}{1.5}$: the factor 2 on top of the formula has been forgotten.',
      ],
      keyIdea: 'F1 = 2PR / (P + R), the harmonic mean of precision and recall, which is always at or below their ordinary average.',
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
      solution:
        'Here the rows are the **predicted** class, so:\n\n' +
        '- TP (predicted churn, actually churned) $= 30$\n' +
        '- FP (predicted churn, actually stayed) $= 10$\n' +
        '- FN (predicted stay, actually churned) $= 30$\n' +
        '- TN (predicted stay, actually stayed) $= 130$\n\n' +
        'Precision: $P = \\frac{30}{30 + 10} = \\frac{30}{40} = 0.75$\n\n' +
        'Recall: $R = \\frac{30}{30 + 30} = \\frac{30}{60} = 0.5$\n\n' +
        '$$F_1 = \\frac{2PR}{P + R} = \\frac{2 \\times 0.75 \\times 0.5}{0.75 + 0.5} = \\frac{0.75}{1.25} = 0.6$$\n\n' +
        'Shortcut straight from the counts: $F_1 = \\frac{2\\text{TP}}{2\\text{TP} + \\text{FP} + \\text{FN}} = \\frac{60}{60 + 10 + 30} = \\frac{60}{100} = 0.6$.\n\n' +
        'Notice that F1 treats FP and FN in exactly the same way, so here misreading the table would not change F1. It **would** swap precision and recall, so always read the labels first.',
      whyWrong: [
        'This is the ordinary average $\\frac{0.75 + 0.5}{2}$. F1 is the harmonic mean, $\\frac{2PR}{P + R}$, which is lower.',
        null,
        'This is the **accuracy**, $\\frac{30 + 130}{200}$. It is inflated by the 130 customers correctly predicted to stay.',
        'This is $P \\times R = 0.75 \\times 0.5$: the multiplication is right but the factor 2 and the division by $P + R$ are missing.',
      ],
      keyIdea: 'F1 = 2TP / (2TP + FP + FN); read the table labels first so you do not mix up FP and FN.',
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
      solution:
        'Ask: **which mistake is worse?**\n\n' +
        '- A **false negative** (a patient with cancer who is not flagged) could be fatal.\n' +
        '- A **false positive** (a healthy patient flagged) only costs a cheap, safe follow-up test.\n\n' +
        'The metric that punishes false negatives is **recall**:\n\n' +
        '$$\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$$\n\n' +
        'Recall is $1$ only when there are no false negatives, i.e. every patient with cancer is caught. So recall should be maximised (even if that means more false alarms).',
      whyWrong: [
        'Precision, $\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$, punishes **false positives**. Here false positives are cheap; the dangerous mistake is the false negative.',
        null,
        'Cancer is rare, so accuracy is dominated by the many healthy patients. A model could have high accuracy while still missing many cancers.',
        'Specificity measures how well **healthy** patients are cleared, which is again about false positives, the cheap kind of mistake in this situation.',
      ],
      keyIdea: 'When missing a real case (false negative) is the costly mistake, maximise recall.',
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
      solution:
        'Precision is hurt by **false positives**; recall is hurt by **false negatives**. For each task, decide which mistake is more costly.\n\n' +
        '| Task | False positive costs | False negative costs | Prioritise |\n' +
        '|---|---|---|---|\n' +
        '| Airport scanner | a quick manual check | a weapon gets through | recall |\n' +
        '| Disease screening | a cheap second test | an ill patient missed | recall |\n' +
        '| Engine parts | an engineer inspects a good part | a faulty part flies | recall |\n' +
        '| Deleting spam filter | an important real email is **lost forever** | one spam email in the inbox | **precision** |\n\n' +
        'Only for the deleting spam filter is the false positive the expensive mistake, so precision matters most there.',
      whyWrong: [
        'Here a false negative (a missed weapon) is the disaster and a false positive only costs a quick check, so recall is the priority, not precision.',
        'Missing an ill patient (false negative) is far worse than a cheap second test (false positive), so this task needs high recall.',
        'A faulty part that is missed could cause a crash, while a wrongly flagged part only costs an inspection, so recall matters more here.',
        null,
      ],
      keyIdea: 'Choose precision when false alarms (false positives) are the expensive mistake, and recall when misses (false negatives) are.',
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
      solution:
        'A higher threshold means the model needs to be **more confident** before it says "positive", so it predicts positive **less often**.\n\n' +
        '- The predictions that stay positive are the ones with very high probabilities, which are usually correct, so there are fewer false positives. **Precision typically rises.**\n' +
        '- Some real positives with probabilities between $0.5$ and $0.8$ are now predicted negative, so TP can only go down (or stay the same) while the number of actual positives is fixed. **Recall falls** (or at best stays the same).\n\n' +
        'This is the **precision-recall trade-off**.',
      whyWrong: [
        'This is what happens when the threshold is **lowered**: more examples are called positive, catching more real positives but also more false alarms.',
        'Raising the threshold can only remove positive predictions, so true positives cannot increase; recall cannot rise.',
        null,
        'Changing the threshold changes which examples are predicted positive, so TP, FP and FN all change, and therefore precision and recall change too.',
      ],
      keyIdea: 'Raising the threshold makes the model more cautious: precision usually goes up and recall goes down.',
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
      solution:
        'Emails with score $\\ge 0.5$ are predicted spam: emails 1 to 6 (scores $0.95, 0.85, 0.80, 0.70, 0.65, 0.55$).\n\n' +
        '| Email | Score | Predicted | Actual | Outcome |\n' +
        '|---|---|---|---|---|\n' +
        '| 1 | 0.95 | spam | spam | TP |\n' +
        '| 2 | 0.85 | spam | spam | TP |\n' +
        '| 3 | 0.80 | spam | not spam | FP |\n' +
        '| 4 | 0.70 | spam | spam | TP |\n' +
        '| 5 | 0.65 | spam | not spam | FP |\n' +
        '| 6 | 0.55 | spam | spam | TP |\n\n' +
        'So $\\text{TP} = 4$ and $\\text{FP} = 2$.\n\n' +
        '$$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}} = \\frac{4}{6} = \\frac{2}{3}$$',
      whyWrong: [
        null,
        'This is the **recall**: 4 of the 5 actual spam emails were caught (email 8, score $0.30$, was missed). Precision divides by the 6 emails predicted spam.',
        'This is the **accuracy**: 4 true positives plus 3 true negatives (emails 7, 9, 10) out of 10.',
        'This is $\\frac{4}{10}$: it divides the true positives by all 10 emails instead of only the 6 that were predicted spam.',
      ],
      keyIdea: 'Apply the threshold to turn scores into predictions, label each as TP/FP/FN/TN, then use the metric formula.',
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
      solution:
        '**Model A** (always "not fraud"): TN $= 990$, FN $= 10$, TP $= 0$, FP $= 0$.\n\n' +
        '- Accuracy $= \\frac{990}{1000} = 99\\%$\n' +
        '- Recall $= \\frac{0}{10} = 0\\%$ (it never catches fraud)\n\n' +
        '**Model B**: TP $= 8$, FP $= 50 - 8 = 42$, FN $= 10 - 8 = 2$, TN $= 1000 - 8 - 42 - 2 = 948$.\n\n' +
        '- Accuracy $= \\frac{8 + 948}{1000} = \\frac{956}{1000} = 95.6\\%$\n' +
        '- Recall $= \\frac{8}{10} = 80\\%$\n' +
        '- Precision $= \\frac{8}{50} = 16\\%$\n\n' +
        'So A has the higher accuracy (99% against 95.6%), but B catches 80% of frauds while A catches none. On imbalanced data, accuracy hides this; B is far more useful.',
      whyWrong: [
        'Model B\'s 42 false alarms count as errors too: its accuracy is $\\frac{956}{1000} = 95.6\\%$, which is lower than Model A\'s 99%.',
        null,
        'This trusts accuracy on imbalanced data. Model A gets 99% just by always saying "not fraud", but its recall is 0: it never catches a single fraud.',
        '80% is Model B\'s **recall** ($\\frac{8}{10}$). Its precision is $\\frac{8}{50} = 16\\%$, because 42 of its 50 flags are false alarms.',
      ],
      keyIdea: 'With imbalanced classes, a useless majority-class model can beat a useful model on accuracy; compare recall and precision instead.',
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
      solution:
        '**Step 1 (recall gives TP).** Recall $= \\frac{\\text{TP}}{\\text{actual positives}}$, so\n\n' +
        '$$\\text{TP} = 0.75 \\times 60 = 45$$\n\n' +
        '**Step 2 (precision gives the number of predicted positives).** Precision $= \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$, so\n\n' +
        '$$\\text{TP} + \\text{FP} = \\frac{45}{0.9} = 50$$\n\n' +
        '**Step 3.** $\\text{FP} = 50 - 45 = 5$.\n\n' +
        'Check: precision $= \\frac{45}{50} = 0.9$ and recall $= \\frac{45}{60} = 0.75$.',
      whyWrong: [
        'This is the number of **false negatives**, $60 - 45 = 15$: the actual positives that were missed. False positives come from the precision, not the recall.',
        null,
        'This is $0.1 \\times 60$: it applies "10% of positive predictions are wrong" to the 60 **actual** positives. Precision is about the 50 **predicted** positives.',
        'This is $\\text{TP} + \\text{FP} = 50$, the total number of positive predictions; the 45 true positives still need to be subtracted.',
      ],
      keyIdea: 'Recall turns the number of actual positives into TP; precision turns TP into the number of predicted positives (TP + FP).',
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
      solution:
        'The loop counts true positives and false positives, pair by pair:\n\n' +
        '| $i$ | `T[i]` | `P[i]` | Outcome | `tp` | `fp` |\n' +
        '|---|---|---|---|---|---|\n' +
        '| 1 | 1 | 1 | TP | 1 | 0 |\n' +
        '| 2 | 0 | 0 | TN | 1 | 0 |\n' +
        '| 3 | 1 | 0 | FN | 1 | 0 |\n' +
        '| 4 | 1 | 1 | TP | 2 | 0 |\n' +
        '| 5 | 0 | 1 | FP | 2 | 1 |\n' +
        '| 6 | 1 | 1 | TP | 3 | 1 |\n' +
        '| 7 | 0 | 0 | TN | 3 | 1 |\n' +
        '| 8 | 0 | 1 | FP | 3 | 2 |\n\n' +
        'It prints `tp / (tp + fp)` $= \\frac{3}{3 + 2} = 0.6$, which is the **precision**.',
      whyWrong: [
        null,
        'This is the **recall**, $\\frac{3}{4}$, dividing by the 4 actual positives. The code divides by `tp + fp`, the predicted positives.',
        'This is the **accuracy**, $\\frac{5}{8}$, counting the 5 positions where the two arrays agree. The code only counts positive predictions.',
        'This is $\\frac{3}{8}$: the true positives divided by all 8 examples. The code divides by `tp + fp` $= 5$.',
      ],
      keyIdea: 'Count TP and FP pair by pair; precision is tp divided by tp + fp.',
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
      solution:
        'Turn every percentage into a count.\n\n' +
        '- Ill: $1\\%$ of $10000 = 100$ people. Recall 90%, so $\\text{TP} = 0.9 \\times 100 = 90$ and $\\text{FN} = 10$.\n' +
        '- Healthy: $10000 - 100 = 9900$ people. 5% are wrongly flagged, so $\\text{FP} = 0.05 \\times 9900 = 495$.\n\n' +
        'Everyone flagged: $\\text{TP} + \\text{FP} = 90 + 495 = 585$.\n\n' +
        '$$\\text{Precision} = \\frac{90}{585} = \\frac{2}{13} \\approx 0.154$$\n\n' +
        'So only about 15% of flagged people are actually ill, even though the model catches 90% of ill people. Because the disease is rare, the healthy group is huge, and 5% of it swamps the true positives.',
      whyWrong: [
        null,
        'This is the **recall** given in the question. Precision divides by everyone flagged, which includes the 495 false positives.',
        'This is $\\frac{90}{10000}$: the true positives divided by the whole population instead of by the 585 people flagged.',
        'This is $1 - 0.05$, the fraction of healthy people correctly cleared (the specificity). It says nothing about how many flagged people are ill.',
      ],
      keyIdea: 'When positives are rare, even a small false-positive rate produces many false positives, so precision can be low despite high recall.',
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
      solution:
        'Read the name in two parts. "Negative" is what the model **predicted**, and "false" says that prediction was wrong.\n\n' +
        'A wrong negative prediction means the example was really positive. It is a case the model **missed**.',
      whyWrong: [
        null,
        'This is a **false positive**: the model predicted positive and was wrong, a false alarm.',
        'This is a **true negative**: the prediction of negative was correct.',
        'This is a **true positive**: the prediction of positive was correct.',
      ],
      keyIdea: 'The second word is the prediction and the first says if it was right, so a false negative is a missed positive.',
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
      solution:
        'Recall answers: **"Of all the real positives, how many did the model find?"**\n\n' +
        '- All the real positives are the ones found plus the ones missed: $\\text{TP} + \\text{FN}$.\n' +
        '- The ones found: $\\text{TP}$.\n\n' +
        'So recall is $\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$.',
      whyWrong: [
        null,
        'This is **precision**, which divides by everything **predicted** positive. Recall divides by everything **actually** positive.',
        'This is **accuracy**: the fraction of all predictions that are correct.',
        'This is **specificity**: the fraction of actual negatives correctly predicted negative.',
      ],
      keyIdea: 'Recall = TP divided by all actual positives (TP + FN).',
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
      solution:
        'The F1 score is the **harmonic mean** of precision $P$ and recall $R$:\n\n' +
        '$$F_1 = \\frac{2PR}{P + R}$$\n\n' +
        'The harmonic mean is pulled towards the smaller value, so a model only scores well if **both** $P$ and $R$ are good.',
      whyWrong: [
        null,
        'The arithmetic mean is $\\frac{P + R}{2}$, the ordinary average. It would let a high value hide a very low one.',
        'The geometric mean is $\\sqrt{PR}$, which is a different average and is not what F1 uses.',
        'The quadratic mean is $\\sqrt{\\frac{P^2 + R^2}{2}}$, which is pulled towards the **larger** value, the opposite of what F1 wants.',
      ],
      keyIdea: 'F1 is the harmonic mean of precision and recall, $\\frac{2PR}{P + R}$.',
    },
  },
];
