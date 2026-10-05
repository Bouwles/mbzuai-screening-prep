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

const TUMOUR_SCORES: [number, boolean][] = [
  [0.92, true],
  [0.81, true],
  [0.74, false],
  [0.66, true],
  [0.58, true],
  [0.47, false],
  [0.39, true],
  [0.33, false],
  [0.21, false],
  [0.12, false],
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
    stem: 'An image classifier decides whether each photo shows a cat. Its results on 100 test photos are shown in the confusion matrix. What is the **accuracy** of the classifier?',
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
    stem: 'A model screens 200 patients for a disease. 20 of the patients actually have the disease. The model correctly flags 15 of these 20, and it also wrongly flags 10 healthy patients. What is the model\'s **recall**?',
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
    stem: 'In a dataset of 500 bank transactions, 10 are fraudulent. A lazy model predicts **not fraud** for every single transaction. What is its accuracy?',
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
    stem: 'A factory uses a model to spot **defective** parts (defective = positive class). Its results on 200 parts are shown. What is the model\'s **precision**?',
    table: {
      caption: 'Rows: actual class. Columns: predicted class.',
      headers: ['Actual class', 'Predicted: defective', 'Predicted: not defective'],
      rows: [
        ['Defective', 30, 20],
        ['Not defective', 10, 140],
      ],
    },
    options: ['$0.6$', '$0.85$', '$0.75$', '$0.25$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Read the cells carefully (rows are the **actual** class):\n\n' +
        '- TP (defective, predicted defective) $= 30$\n' +
        '- FN (defective, predicted not defective) $= 20$\n' +
        '- FP (not defective, predicted defective) $= 10$\n' +
        '- TN (not defective, predicted not defective) $= 140$\n\n' +
        'Precision uses the **predicted defective** column: $\\text{TP} + \\text{FP} = 30 + 10 = 40$ parts were flagged.\n\n' +
        '$$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}} = \\frac{30}{40} = 0.75$$',
      whyWrong: [
        'This is $\\frac{30}{50}$, the **recall**: it divides by the "Defective" row total (all actual defective parts) instead of the "Predicted: defective" column total.',
        'This is the **accuracy**, $\\frac{30 + 140}{200}$, the fraction of all parts classified correctly.',
        null,
        'This is $\\frac{10}{40}$: the right denominator, but the false positives are on top instead of the true positives. It is the fraction of flagged parts that were false alarms.',
      ],
      keyIdea: 'Precision divides TP by the total of the PREDICTED-positive column; always check which way round the table is labelled.',
    },
    check: {
      optionValues: [0.6, 0.85, 0.75, 0.25],
      compute: () => precisionOf(30, 10),
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
    stem: 'A streaming company predicts which customers will **churn** (cancel their subscription); churn is the positive class. The results for 200 customers are shown. **Note that the rows are the predicted class.** What is the F1 score of the model?',
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
        const fp = 10;
        const fn = 30;
        return f1Of(tp, fp, fn);
      },
    },
  },
  {
    id: 'evaluation-metrics-009',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    stem: 'A hospital uses a model as the **first screening step** for a serious but treatable cancer. Anyone the model flags gets a cheap, safe follow-up test. Missing a patient who really has cancer could be fatal. Which metric should the hospital make as high as possible?',
    options: ['Precision', 'Recall', 'Accuracy', 'Specificity (the fraction of healthy patients correctly cleared)'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Ask: **which mistake is worse?**\n\n' +
        '- A **false negative** (a patient with cancer who is not flagged) could be fatal.\n' +
        '- A **false positive** (a healthy patient flagged) only costs a cheap, safe follow-up test.\n\n' +
        'The metric that punishes false negatives is **recall**:\n\n' +
        '$$\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$$\n\n' +
        'Recall is $1$ only when there are no false negatives, i.e. every patient with cancer is caught. So the hospital should maximise recall (even if that means more false alarms).',
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
      'An airport scanner that flags bags for a quick manual check, where missing a weapon would be a disaster',
      'A first-stage screening test for a serious disease, where flagged patients get a cheap second test',
      'A system that flags possibly faulty aircraft engine parts for an engineer to inspect',
      'A spam filter that **permanently deletes** every email it flags as spam',
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
    stem: 'A logistic regression model outputs a probability for each example and predicts **positive** when that probability is at least a chosen threshold. The threshold is raised from $0.5$ to $0.8$. What typically happens?',
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
    stem: 'A spam filter gives each of 10 emails a score. It predicts **spam** when the score is at least $0.5$. The scores and the true labels are shown. What is the **precision** of the filter at this threshold?',
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
    stem: 'A bank has 1000 transactions, of which 10 are fraudulent. **Model A** predicts "not fraud" for every transaction. **Model B** flags 50 transactions as fraud, and 8 of those 50 really are fraud. Which statement is correct?',
    options: [
      'Model B has the higher accuracy, because it catches 8 of the 10 frauds',
      'Model A has the higher accuracy, but Model B has far higher recall, so B is more useful for catching fraud',
      'Model A is the better fraud detector, because its accuracy of 99% is higher',
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
    stem: 'A model is tested on a dataset that contains 60 actual positives. Its recall is $0.75$ and its precision is $0.9$. How many **false positives** does it make?',
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
    stem: 'What does this Python program print?',
    code: {
      lang: 'python',
      source: `y_true = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0]
y_pred = [1, 0, 0, 1, 1, 1, 0, 0, 0, 0]

tp = fp = fn = 0
for t, p in zip(y_true, y_pred):
    if t == 1 and p == 1:
        tp += 1
    elif t == 0 and p == 1:
        fp += 1
    elif t == 1 and p == 0:
        fn += 1

precision = tp / (tp + fp)
recall = tp / (tp + fn)
print(precision, recall)`,
    },
    options: ['`0.75 0.6`', '`0.6 0.75`', '`0.7 0.6`', '`0.3 0.6`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`zip` pairs each true label `t` with its prediction `p`:\n\n' +
        '| Index | `t` | `p` | Branch taken | tp | fp | fn |\n' +
        '|---|---|---|---|---|---|---|\n' +
        '| 0 | 1 | 1 | TP | 1 | 0 | 0 |\n' +
        '| 1 | 0 | 0 | none (TN) | 1 | 0 | 0 |\n' +
        '| 2 | 1 | 0 | FN | 1 | 0 | 1 |\n' +
        '| 3 | 1 | 1 | TP | 2 | 0 | 1 |\n' +
        '| 4 | 0 | 1 | FP | 2 | 1 | 1 |\n' +
        '| 5 | 1 | 1 | TP | 3 | 1 | 1 |\n' +
        '| 6 | 0 | 0 | none (TN) | 3 | 1 | 1 |\n' +
        '| 7 | 0 | 0 | none (TN) | 3 | 1 | 1 |\n' +
        '| 8 | 1 | 0 | FN | 3 | 1 | 2 |\n' +
        '| 9 | 0 | 0 | none (TN) | 3 | 1 | 2 |\n\n' +
        'Final counts: `tp = 3`, `fp = 1`, `fn = 2`.\n\n' +
        '- `precision = 3 / (3 + 1) = 0.75`\n' +
        '- `recall = 3 / (3 + 2) = 0.6`\n\n' +
        '`print(precision, recall)` prints the two values separated by a space: `0.75 0.6`.',
      whyWrong: [
        null,
        'This swaps the two metrics (or swaps FP and FN): $\\frac{3}{3 + 2} = 0.6$ is the recall and $\\frac{3}{3 + 1} = 0.75$ is the precision, and they are printed precision first.',
        'The first number here is the **accuracy**, $\\frac{3 + 4}{10} = 0.7$, but the code divides `tp` by `tp + fp`, which is the precision $0.75$.',
        'The first number here is $\\frac{3}{10}$, the true positives divided by all 10 examples. The code divides by `tp + fp = 4`.',
      ],
      keyIdea: 'Count TP, FP and FN pair by pair, then precision = tp / (tp + fp) and recall = tp / (tp + fn).',
    },
    python: { stdout: '0.75 0.6\n' },
  },

  // ---------------------------------------------------------------- challenge
  {
    id: 'evaluation-metrics-016',
    subtopic: 'evaluation-metrics',
    difficulty: 'challenge',
    stem: 'A classifier is tested on 200 examples. Its accuracy is $0.85$, its precision is $0.8$ and its recall is $0.8$. How many **true negatives** are there?',
    options: ['$60$', '$125$', '$110$', '$170$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Let $\\text{TP} = x$.\n\n' +
        '**Precision** $= \\frac{x}{x + \\text{FP}} = 0.8$, so $x + \\text{FP} = \\frac{x}{0.8} = 1.25x$, giving $\\text{FP} = 0.25x$.\n\n' +
        '**Recall** $= \\frac{x}{x + \\text{FN}} = 0.8$, so in the same way $\\text{FN} = 0.25x$.\n\n' +
        '**Accuracy**: correct predictions $= 0.85 \\times 200 = 170$, so the wrong ones are $\\text{FP} + \\text{FN} = 200 - 170 = 30$.\n\n' +
        'So $0.25x + 0.25x = 30$, i.e. $0.5x = 30$ and $x = 60$. Then $\\text{FP} = 15$ and $\\text{FN} = 15$.\n\n' +
        '$$\\text{TN} = 200 - 60 - 15 - 15 = 110$$\n\n' +
        'Check: accuracy $= \\frac{60 + 110}{200} = 0.85$, precision $= \\frac{60}{75} = 0.8$, recall $= \\frac{60}{75} = 0.8$.',
      whyWrong: [
        'This is the number of **true positives** ($x = 60$), not true negatives.',
        'This is $200 - 75 = 125$, the number of **actual negatives** ($\\text{TN} + \\text{FP}$). The 15 false positives still need to be removed.',
        null,
        'This is $0.85 \\times 200$, the number of **correct** predictions, which is $\\text{TP} + \\text{TN}$, not TN alone.',
      ],
      keyIdea: 'Write FP and FN in terms of TP using precision and recall, then use accuracy (or the total) to find TP and the remaining cells.',
    },
    check: {
      optionValues: [60, 125, 110, 170],
      compute: () => {
        // brute force every confusion matrix with 200 examples
        const N = 200;
        const found: number[] = [];
        for (let tp = 1; tp <= N; tp++)
          for (let fp = 0; tp + fp <= N; fp++)
            for (let fn = 0; tp + fp + fn <= N; fn++) {
              const tn = N - tp - fp - fn;
              if (20 * (tp + tn) === 17 * N && 5 * tp === 4 * (tp + fp) && 5 * tp === 4 * (tp + fn)) found.push(tn);
            }
        if (found.length !== 1) throw new Error('not unique');
        return found[0];
      },
    },
  },
  {
    id: 'evaluation-metrics-017',
    subtopic: 'evaluation-metrics',
    difficulty: 'challenge',
    stem: 'A model gives each of 10 scans a score for "tumour present" and predicts **tumour** when the score is at least the threshold $t$. The scores and true labels are shown. Which threshold gives the **highest F1 score**?',
    table: {
      headers: ['Scan', 'Score', 'Tumour present?'],
      rows: TUMOUR_SCORES.map(([s, pos], i) => [i + 1, s.toFixed(2), yesNo(pos)]),
    },
    options: ['$t = 0.7$', '$t = 0.3$', '$t = 0.9$', '$t = 0.5$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'There are 5 scans with a tumour (scans 1, 2, 4, 5, 7). For each threshold, count TP and FP among the scans predicted "tumour", then $\\text{FN} = 5 - \\text{TP}$ and $F_1 = \\frac{2\\text{TP}}{2\\text{TP} + \\text{FP} + \\text{FN}}$.\n\n' +
        '| $t$ | Predicted tumour | TP | FP | FN | Precision | Recall | $F_1$ |\n' +
        '|---|---|---|---|---|---|---|---|\n' +
        '| $0.3$ | scans 1 to 8 | 5 | 3 | 0 | $\\frac{5}{8}$ | $1$ | $\\frac{10}{13} \\approx 0.769$ |\n' +
        '| $0.5$ | scans 1 to 5 | 4 | 1 | 1 | $\\frac{4}{5}$ | $\\frac{4}{5}$ | $\\frac{8}{10} = 0.8$ |\n' +
        '| $0.7$ | scans 1 to 3 | 2 | 1 | 3 | $\\frac{2}{3}$ | $\\frac{2}{5}$ | $\\frac{4}{8} = 0.5$ |\n' +
        '| $0.9$ | scan 1 only | 1 | 0 | 4 | $1$ | $\\frac{1}{5}$ | $\\frac{2}{6} \\approx 0.333$ |\n\n' +
        'The largest F1 is $0.8$, at $t = 0.5$.',
      whyWrong: [
        'At $t = 0.7$ only 2 of the 5 tumours are caught (recall $\\frac{2}{5}$), so $F_1 = 0.5$. Moving the threshold up from $0.5$ loses two true positives (scans 4 and 5) without removing the false positive at $0.74$.',
        'At $t = 0.3$ recall is perfect, but precision is only $\\frac{5}{8}$, so $F_1 = \\frac{10}{13} \\approx 0.769 < 0.8$. Averaging precision and recall the ordinary way gives $0.8125$ and wrongly makes this look best; F1 uses the harmonic mean.',
        'At $t = 0.9$ precision is perfect ($1$), but only 1 tumour of 5 is found, so $F_1 = \\frac{2}{6} \\approx 0.333$. Choosing the threshold with the best precision ignores recall.',
        null,
      ],
      keyIdea: 'F1 rewards a balance of precision and recall: the extreme thresholds make one of them high but the other low.',
    },
    check: {
      optionValues: [0.7, 0.3, 0.9, 0.5],
      compute: () => {
        let best = -1;
        let bestT = 0;
        for (const t of [0.7, 0.3, 0.9, 0.5]) {
          const c = countAt(TUMOUR_SCORES, t);
          const f = f1Of(c.tp, c.fp, c.fn);
          if (f > best) {
            best = f;
            bestT = t;
          }
        }
        return bestT;
      },
    },
  },
  {
    id: 'evaluation-metrics-018',
    subtopic: 'evaluation-metrics',
    difficulty: 'challenge',
    stem: 'A classifier predicts positive when its output score is at least a threshold. The threshold is **lowered** (and nothing else changes). Which of these metrics can **never decrease** as a result?',
    options: ['Precision', 'Accuracy', 'Recall', 'F1 score'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Lowering the threshold means every example that was predicted positive **stays** positive, and some extra examples may become positive.\n\n' +
        '- The true positives can only stay the same or increase.\n' +
        '- The number of actual positives, $\\text{TP} + \\text{FN}$, does not depend on the model at all; it is fixed by the data.\n\n' +
        'So $\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$ has a growing (or unchanged) top and a fixed bottom: **it can never decrease**.\n\n' +
        'The others can all go down. Example: 2 positives and 8 negatives; at the old threshold the model flags just the 2 positives (precision $1$, recall $1$, accuracy $1$, $F_1 = 1$). Lower the threshold so that it also flags 3 negatives: precision $= \\frac{2}{5}$, accuracy $= \\frac{7}{10}$, $F_1 = \\frac{4}{4 + 3} = \\frac{4}{7}$, all lower, while recall stays $1$.',
      whyWrong: [
        'Precision can fall: the extra examples now predicted positive may be mostly negatives, adding false positives to the bottom of $\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$.',
        'Accuracy can fall: if the newly flagged examples are actually negative, correct true negatives turn into false positives.',
        null,
        'F1 depends on precision as well as recall, so if precision drops sharply F1 drops too (from $1$ to $\\frac{4}{7}$ in the example in the solution).',
      ],
      keyIdea: 'Lowering the threshold can only add positive predictions, so TP cannot fall while the number of actual positives is fixed: recall never decreases.',
    },
  },
  {
    id: 'evaluation-metrics-019',
    subtopic: 'evaluation-metrics',
    difficulty: 'challenge',
    stem: 'A disease affects 1% of a population of 10,000 people. A diagnostic model has a recall of 90%, and it wrongly flags 5% of healthy people. What is the model\'s **precision** (the fraction of flagged people who really have the disease)?',
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
  {
    id: 'evaluation-metrics-020',
    subtopic: 'evaluation-metrics',
    difficulty: 'challenge',
    stem: 'A classifier has precision $0.5$ and an F1 score of $0.6$. What is its **recall**?',
    options: ['$0.7$', '$0.3$', '$0.55$', '$0.75$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'F1 is the harmonic mean, which is easiest to rearrange in "reciprocal" form:\n\n' +
        '$$\\frac{2}{F_1} = \\frac{1}{P} + \\frac{1}{R}$$\n\n' +
        'Substitute $F_1 = 0.6$ and $P = 0.5$:\n\n' +
        '$$\\frac{2}{0.6} = \\frac{1}{0.5} + \\frac{1}{R}$$\n\n' +
        '$$\\frac{10}{3} = 2 + \\frac{1}{R}$$\n\n' +
        '$$\\frac{1}{R} = \\frac{10}{3} - 2 = \\frac{4}{3}$$\n\n' +
        'So $R = \\frac{3}{4} = 0.75$.\n\n' +
        'Check: $\\frac{2 \\times 0.5 \\times 0.75}{0.5 + 0.75} = \\frac{0.75}{1.25} = 0.6$.',
      whyWrong: [
        'This treats F1 as the ordinary average, $\\frac{0.5 + R}{2} = 0.6$, giving $R = 0.7$. F1 is the harmonic mean.',
        'This is $0.5 \\times 0.6$: it multiplies the two given numbers, which is not a rearrangement of the F1 formula.',
        'This is the ordinary average of the two given numbers, $\\frac{0.5 + 0.6}{2}$, which has nothing to do with the F1 formula.',
        null,
      ],
      keyIdea: 'Rearrange F1 using reciprocals: 2/F1 = 1/P + 1/R.',
    },
    check: {
      optionValues: [0.7, 0.3, 0.55, 0.75],
      compute: () => {
        const f1 = new Frac(6, 10);
        const p = new Frac(1, 2);
        const invR = new Frac(2).div(f1).sub(new Frac(1).div(p));
        return new Frac(1).div(invR).value();
      },
    },
  },
];
