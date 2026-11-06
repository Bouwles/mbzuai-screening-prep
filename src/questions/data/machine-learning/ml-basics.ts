import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';

const F = (n: number, d = 1) => new Frac(n, d);

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'ml-basics-001',
    subtopic: 'ml-basics',
    difficulty: 'foundation',
    stem: 'Which of the following best describes **machine learning**?',
    options: [
      'Following a fixed list of rules written by a programmer',
      'Learning patterns from data instead of being given every rule',
      'Storing and searching large amounts of data quickly',
      'A robot that can move around on its own',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Machine learning (ML) is the part of AI where a computer **learns from examples (data)**.\n\n' +
        '- In **traditional programming**, a person writes the rules: data + rules in, answers out.\n' +
        '- In **machine learning**, we give the computer data (often with the correct answers) and it **works out the rules (patterns) itself**. It can then use those patterns on new data it has never seen.\n\n' +
        'For example, instead of writing hundreds of "if the email contains ... then spam" rules, we show a model thousands of emails already marked spam or not spam, and it learns which patterns go with spam.\n\n' +
        'So the best description is: a system that improves at a task by learning patterns from data, rather than being given every rule explicitly.',
      whyWrong: [
        'This describes **traditional, rule-based programming**. The whole point of machine learning is that the rules are *learned* from examples, not all written by hand.',
        null,
        'This describes a **database** or search engine. Storing and searching data is not the same as learning patterns from it to make predictions.',
        'This describes **robotics** (hardware). A robot may *use* machine learning, but having sensors and moving around is not what machine learning means.',
      ],
      keyIdea: 'Machine learning means the computer learns the rules (patterns) from data instead of a programmer writing every rule.',
    },
  },
  {
    id: 'ml-basics-002',
    subtopic: 'ml-basics',
    difficulty: 'foundation',
    stem: 'A model is trained on old emails, each marked "spam" or "not spam" by a person, so that it can mark **new** emails. Which type of machine learning is this?',
    options: ['Unsupervised learning', 'Reinforcement learning', 'Supervised learning', 'Rule-based programming (no learning)'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Ask: **does the training data come with the correct answers?**\n\n' +
        '- Every email has been marked "spam" or "not spam" by a person. That mark is the **label** (the correct answer).\n' +
        '- The model learns from (email, label) pairs and then predicts the label for new emails.\n\n' +
        'Learning from examples that come **with labels** is **supervised learning** (a "teacher" has supplied the answers). Because the output is one of two categories, this particular task is **classification**.',
      whyWrong: [
        'Unsupervised learning uses data **without labels** and looks for structure on its own. Here every email has a spam / not spam label, so it is supervised.',
        'Reinforcement learning means an agent learning by **trial and error from rewards**. Here the model learns from a fixed set of labelled emails, not from rewards.',
        null,
        'The model is trained on examples and learns the patterns itself, so this **is** machine learning, not a set of hand-written rules.',
      ],
      keyIdea: 'Training data with labels (correct answers) means supervised learning.',
    },
  },
  {
    id: 'ml-basics-003',
    subtopic: 'ml-basics',
    difficulty: 'foundation',
    stem: 'A model predicts an apartment\'s selling price from its floor area and number of bedrooms, trained on past sales with known prices. What kind of task is this?',
    options: ['Regression', 'Classification', 'Clustering', 'Reinforcement learning'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Step 1: the past sales come with their real prices, so the data is **labelled**: this is supervised learning.\n\n' +
        'Step 2: look at the **type of output**. A price such as AED 1,250,000 is a **number on a continuous scale** (it could be any value in a range), not one of a few fixed categories.\n\n' +
        'Supervised learning that predicts a continuous number is **regression**.',
      whyWrong: [
        null,
        'Classification predicts a **category** from a fixed list (for example "cheap / medium / expensive"). A price in AED is a continuous number, so this is regression.',
        'Clustering groups **unlabelled** data into groups it discovers itself. Here the past prices (labels) are known and we predict a number.',
        'Reinforcement learning is about an agent taking actions and learning from **rewards**. There are no actions or rewards here, just labelled examples.',
      ],
      keyIdea: 'Predicting a continuous number (price, temperature, time) is regression.',
    },
  },
  {
    id: 'ml-basics-004',
    subtopic: 'ml-basics',
    difficulty: 'foundation',
    stem: 'A model predicts whether a student will **pass** the final exam. Which column of the training data is the **label** (the target to predict)?',
    table: {
      caption: 'Training data (one row per past student)',
      headers: ['Hours studied per week', 'Hours of sleep per night', 'Attendance (%)', 'Passed'],
      rows: [
        [6, 8, 95, 'Yes'],
        [2, 5, 70, 'No'],
        [4, 7, 88, 'Yes'],
      ],
    },
    options: ['Hours studied per week', 'Hours of sleep per night', 'Attendance (%)', 'Passed'],
    correctIndex: 3,
    markScheme: {
      solution:
        '- **Features** are the inputs: the information we know *before* the outcome and give to the model.\n' +
        '- The **label** (target) is the output: the thing we want the model to predict.\n\n' +
        'The aim is to predict **whether a student passes**, so the label is the "Passed" column (Yes / No).\n\n' +
        'Hours studied, hours of sleep and attendance are the three **features**. Because the label is a category (Yes / No), this is a classification task.',
      whyWrong: [
        'Hours studied is an **input** the model uses to make its prediction, so it is a feature, not the label.',
        'Hours of sleep is an **input** (feature). The model uses it to predict the outcome; it is not the thing being predicted.',
        'Attendance is known before the exam and is used as an **input** (feature), not the outcome to be predicted.',
        null,
      ],
      keyIdea: 'Features are the inputs; the label is the answer the model is trained to predict.',
    },
  },
  {
    id: 'ml-basics-005',
    subtopic: 'ml-basics',
    difficulty: 'foundation',
    stem: 'A program learns a racing game without being shown correct moves: it tries actions, gains points for fast laps and loses points for crashes. Which type of machine learning is this?',
    options: ['Supervised learning', 'Reinforcement learning', 'Unsupervised learning', 'Rule-based programming (no learning)'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Look at **how** the program gets feedback:\n\n' +
        '- It is not given labelled correct answers (so it is not supervised).\n' +
        '- It is not just looking for groups or structure in a dataset (so it is not unsupervised).\n' +
        '- It is an **agent** that takes **actions** in an **environment** (the game) and receives **rewards** (points gained) and **penalties** (points lost). By trial and error it learns which actions lead to the most reward.\n\n' +
        'That is exactly **reinforcement learning**.',
      whyWrong: [
        'Supervised learning needs examples **labelled with the correct answer** (the right move for each situation). The program is never shown correct moves.',
        null,
        'Unsupervised learning finds patterns in a fixed set of unlabelled data and gets **no feedback**. Here the program acts and receives points as feedback.',
        'Nobody writes the driving rules; the program improves from its own experience, so this is machine learning.',
      ],
      keyIdea: 'An agent learning by trial and error from rewards and penalties is reinforcement learning.',
    },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'ml-basics-006',
    subtopic: 'ml-basics',
    difficulty: 'exam',
    stem: 'A model predicts whether a customer will churn (the last column). The Customer ID is not given to it, and every other column except the label is an input. How many **features** does it use?',
    table: {
      headers: ['Customer ID', 'Age', 'Monthly spend (AED)', 'Visits per month', 'Has loyalty card', 'Churned'],
      rows: [
        ['C001', 34, 420, 6, 'Yes', 'No'],
        ['C002', 22, 150, 2, 'No', 'Yes'],
        ['C003', 51, 610, 9, 'Yes', 'No'],
      ],
    },
    options: ['$5$', '$3$', '$4$', '$6$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The table has 6 columns. Sort them out:\n\n' +
        '| Column | Role |\n' +
        '|---|---|\n' +
        '| Customer ID | reference only, not used |\n' +
        '| Age | feature |\n' +
        '| Monthly spend (AED) | feature |\n' +
        '| Visits per month | feature |\n' +
        '| Has loyalty card | feature |\n' +
        '| Churned | **label** (what we predict) |\n\n' +
        'Number of features $= 6 - 1 - 1 = 4$ (all columns, minus the ID, minus the label).',
      whyWrong: [
        'This counts one column too many: either the ID column or the label "Churned" has been counted as a feature. The label is the output, never an input.',
        'This counts the number of **rows** (customers) shown. Features are the input **columns**, not the examples.',
        null,
        'This counts every column. The Customer ID is not used, and "Churned" is the label (the answer to predict), so neither is a feature.',
      ],
      keyIdea: 'Features are the input columns: leave out the label and any pure ID columns.',
    },
    check: {
      optionValues: [5, 3, 4, 6],
      compute: () => {
        const headers = ['Customer ID', 'Age', 'Monthly spend (AED)', 'Visits per month', 'Has loyalty card', 'Churned'];
        return headers.filter((h) => h !== 'Customer ID' && h !== 'Churned').length;
      },
    },
  },
  {
    id: 'ml-basics-007',
    subtopic: 'ml-basics',
    difficulty: 'exam',
    stem: 'Which of the following is a **clustering** task?',
    options: [
      'Predicting tomorrow\'s maximum temperature from today\'s readings',
      'Detecting broken bones from X-rays labelled by doctors',
      'Sorting emails into three fixed folders, using emails already filed',
      'Grouping customers by shopping habits, with no groups decided in advance',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Clustering** is unsupervised: the data has **no labels**, and the algorithm discovers groups of similar items by itself.\n\n' +
        'Check each task:\n\n' +
        '- Maximum temperature: the output is a continuous number learned from past records, so this is **regression**.\n' +
        '- Broken bone or not, from X-rays labelled by doctors: labels are given and there are two categories, so this is **classification**.\n' +
        '- Email folders: the three folders are **fixed in advance** and the user\'s filed emails are labelled examples, so this is **classification** (with three classes).\n' +
        '- Customer groups with no groups decided in advance: no labels, the groups are discovered from the data, so this is **clustering**.',
      whyWrong: [
        'The output is a temperature, a continuous number, and past temperatures are known: this is **regression**, not clustering.',
        'The X-rays are already labelled (broken / not broken), so the model learns from correct answers: this is **classification**.',
        'This sounds like "grouping", but the folders are **chosen in advance** and the user\'s filed emails act as labels, so it is **classification**. Clustering only applies when the groups are not known beforehand.',
        null,
      ],
      keyIdea: 'Clustering = grouping unlabelled data into groups that are discovered, not given in advance.',
    },
  },
  {
    id: 'ml-basics-008',
    subtopic: 'ml-basics',
    difficulty: 'exam',
    stem: 'How many of the six tasks in the table are **classification** tasks?',
    table: {
      headers: ['Task', 'Description'],
      rows: [
        [1, 'Predict tomorrow\'s maximum temperature in degrees Celsius'],
        [2, 'Decide whether a tumour is benign or malignant from a scan'],
        [3, 'Recognise which digit (0 to 9) has been handwritten'],
        [4, 'Estimate the resale price of a used car in AED'],
        [5, 'Group news articles by topic when no topics are given in advance'],
        [6, 'Predict whether a customer will cancel their contract next month'],
      ],
    },
    options: ['$2$', '$3$', '$4$', '$5$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'For each task ask: are there labels? Is the output a **category** or a **continuous number**?\n\n' +
        '| Task | Output | Type |\n' +
        '|---|---|---|\n' +
        '| 1. Max temperature | a number on a scale | regression |\n' +
        '| 2. Benign or malignant | one of 2 categories | **classification** |\n' +
        '| 3. Handwritten digit | one of 10 categories | **classification** |\n' +
        '| 4. Car price | a number on a scale | regression |\n' +
        '| 5. Group articles, no topics given | groups found from data | clustering |\n' +
        '| 6. Cancel or not | one of 2 categories (yes / no) | **classification** |\n\n' +
        'Tasks 2, 3 and 6 are classification, so the answer is $3$.\n\n' +
        'Note task 3: the digits are written with numbers, but they are really **10 separate categories** (a "7" is not "more" than a "3" in any useful sense), so it is classification, not regression.',
      whyWrong: [
        'This misses task 3. Digit recognition outputs a digit, but each digit is a **category** (one of 10 classes), not a quantity on a scale, so it is classification.',
        null,
        'This also counts task 5. Grouping articles when **no topics are given** is clustering (unsupervised), not classification, because there are no labels.',
        'This counts everything except clustering, treating the temperature and car price as classification. Those outputs are continuous numbers, so they are regression.',
      ],
      keyIdea: 'Classification outputs a category from a fixed set (even if the categories are written as numbers); regression outputs a quantity.',
    },
    check: {
      optionValues: [2, 3, 4, 5],
      compute: () => {
        const tasks: { task: number; type: 'regression' | 'classification' | 'clustering' }[] = [
          { task: 1, type: 'regression' },
          { task: 2, type: 'classification' },
          { task: 3, type: 'classification' },
          { task: 4, type: 'regression' },
          { task: 5, type: 'clustering' },
          { task: 6, type: 'classification' },
        ];
        return tasks.filter((t) => t.type === 'classification').length;
      },
    },
  },
  {
    id: 'ml-basics-009',
    subtopic: 'ml-basics',
    difficulty: 'exam',
    stem: 'A face-analysis model was trained on photos in which about 80% of faces were lighter-skinned. The chart shows its test error rates. What is the **most likely main cause** of this pattern?',
    chart: {
      kind: 'bar',
      title: 'Error rate of the face-analysis model by group',
      xLabel: 'Group',
      yLabel: 'Error rate (%)',
      categories: ['Lighter-skinned men', 'Lighter-skinned women', 'Darker-skinned men', 'Darker-skinned women'],
      series: [{ name: 'Error rate (%)', values: [1, 7, 12, 35] }],
    },
    options: [
      'Darker-skinned faces are under-represented in training (sampling bias)',
      'Computers cannot analyse darker-skinned faces accurately',
      'Overfitting equally on every group',
      'A test set that was too large',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'A model can only learn well from what it sees. Here about 80% of the training faces were lighter-skinned, so the model saw **far fewer examples** of darker-skinned faces (and probably even fewer of darker-skinned women).\n\n' +
        'The chart fits this: each darker-skinned group has a much higher error rate than the lighter-skinned group of the same sex (12% against 1% for men, 35% against 7% for women).\n\n' +
        'This is **sampling (representation) bias**: the training data does not represent all the people the model will be used on. The usual fixes are to collect more balanced data and to **test the model separately on each group** before using it.',
      whyWrong: [
        null,
        'There is nothing about darker skin that makes accurate analysis impossible; models trained on **balanced** data perform far better on the groups that were under-represented. The gap comes from the data, not from the people.',
        'Overfitting from too much training would not explain why the errors line up with **how well each group was represented** in the data. The pattern points to the training data, not the training time.',
        'A larger test set gives **more reliable** error estimates; it does not make the model itself worse for any group.',
      ],
      keyIdea: 'If some groups are under-represented in the training data, the model usually performs worse on them (sampling bias).',
    },
  },
  {
    id: 'ml-basics-010',
    subtopic: 'ml-basics',
    difficulty: 'exam',
    stem: 'The table shows how a loan-approval model treated two groups. By how many percentage points is Group A\'s approval rate **higher** than Group B\'s?',
    table: {
      headers: ['Group', 'Applicants', 'Approved by the model'],
      rows: [
        ['Group A', 160, 96],
        ['Group B', 240, 72],
      ],
    },
    options: ['$24$ percentage points', '$6$ percentage points', '$30$ percentage points', '$50$ percentage points'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The groups have different sizes, so compare **rates**, not counts.\n\n' +
        '- Group A: $\\frac{96}{160} = 0.6 = 60\\%$\n' +
        '- Group B: $\\frac{72}{240} = 0.3 = 30\\%$\n\n' +
        'Difference: $60\\% - 30\\% = 30$ percentage points.\n\n' +
        'A gap this large is a warning sign of possible **bias**: the model approves Group A applicants twice as often. (Comparing approval rates between groups is called checking **demographic parity**.)',
      whyWrong: [
        'This is $96 - 72 = 24$, the difference in the **number** of approvals. The groups are different sizes (160 and 240), so you must compare rates.',
        'This divides both groups\' approvals by all $400$ applicants: $\\frac{96}{400} - \\frac{72}{400} = 24\\% - 18\\% = 6\\%$. Each group\'s rate must use **its own** number of applicants.',
        null,
        'This is $\\frac{30\\%}{60\\%} = 0.5 = 50\\%$, a **ratio** of the two rates (Group B is approved half as often), not the difference in percentage points.',
      ],
      keyIdea: 'For fairness between groups of different sizes, compare each group\'s rate (approved divided by that group\'s applicants), not raw counts.',
    },
    check: {
      optionValues: [24, 6, 30, 50],
      compute: () => {
        const rateA = F(96, 160);
        const rateB = F(72, 240);
        return rateA.sub(rateB).mul(100).value();
      },
    },
  },
  {
    id: 'ml-basics-011',
    subtopic: 'ml-basics',
    difficulty: 'exam',
    fixedOrder: true,
    stem: 'Statement 1: predicting house prices from past sales with known prices is supervised learning.\n\nStatement 2: recognising cats and dogs from photos tagged "cat" or "dog" is supervised learning.\n\nWhich is true?',
    options: [
      'Statement 1 only',
      'Statement 2 only',
      'Both statements',
      'Neither statement',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Supervised learning means learning from examples that come **with the correct answer (label)**.\n\n' +
        '- Statement 1: every past sale has its real price, so each example is labelled. It predicts a number, so it is supervised **regression**.\n' +
        '- Statement 2: every photo is tagged "cat" or "dog", so each example is labelled. It predicts a category, so it is supervised **classification**.\n\n' +
        'Both statements are true. Regression and classification are **both** kinds of supervised learning; clustering is the classic unsupervised task.',
      whyWrong: [
        'Statement 1 is true, but so is Statement 2: the "cat" and "dog" tags are labels, and classification is supervised learning too.',
        'Statement 2 is true, but so is Statement 1: the known selling prices are labels, and regression is supervised learning too.',
        null,
        'Both statements describe training on labelled data (known prices, known tags), which is exactly what supervised learning means.',
      ],
      keyIdea: 'Regression and classification are both supervised: the training data includes the correct answers.',
    },
  },
  {
    id: 'ml-basics-012',
    subtopic: 'ml-basics',
    difficulty: 'foundation',
    stem: 'A model reads **grayscale** images 28 pixels wide and 28 pixels tall, using each pixel\'s brightness as one input feature. How many features does each image have?',
    options: ['$56$', '$28$', '$2352$', '$784$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The image is a grid of pixels, 28 across and 28 down.\n\n' +
        'Number of pixels $= 28 \\times 28 = 784$.\n\n' +
        'A grayscale pixel has **one** brightness value, so each pixel gives 1 feature:\n\n' +
        '$$784 \\times 1 = 784 \\text{ features}$$\n\n' +
        '(For a **colour** image, each pixel has 3 values, red, green and blue, so there would be 3 times as many.)',
      whyWrong: [
        'This is $28 + 28$: the side lengths have been **added**. A grid has $28 \\times 28$ pixels, so multiply.',
        'This is the pixels in just **one row** (or one column). The image has 28 rows of 28 pixels.',
        'This is $28 \\times 28 \\times 3$, treating the image as **colour** (red, green, blue). A grayscale pixel has only one value.',
        null,
      ],
      keyIdea: 'Image features = width times height times the number of values per pixel (1 for grayscale, 3 for colour).',
    },
    check: {
      optionValues: [56, 28, 2352, 784],
      compute: () => {
        const width = 28;
        const height = 28;
        const channels = 1;
        let count = 0;
        for (let r = 0; r < height; r++) for (let c = 0; c < width; c++) count += channels;
        return count;
      },
    },
  },
  {
    id: 'ml-basics-013',
    subtopic: 'ml-basics',
    difficulty: 'exam',
    stem: 'A hospital trains a diabetes-risk model on patient records. Which approach **best** protects patients\' privacy?',
    options: [
      'Consent, remove identifiers, keep only needed fields, store securely',
      'Use every record with names, because the purpose is good',
      'Publish the records so that others can check the results',
      'Skip privacy steps if the model is accurate enough',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'Health data is some of the most **sensitive personal data** there is. Good practice when using it for ML includes:\n\n' +
        '- **Consent / approval**: people should agree to (or a proper ethics process should approve) their data being used.\n' +
        '- **Remove direct identifiers** such as names and ID numbers.\n' +
        '- **Data minimisation**: collect and keep only the fields that the model actually needs.\n' +
        '- **Security**: store the data safely and limit who can access it.\n\n' +
        'Only the approach built on consent and removing identifiers does all of this. A good purpose or a high accuracy does not remove the duty to protect people\'s privacy.',
      whyWrong: [
        null,
        'A good purpose does not cancel the need for **consent** and protection. Keeping names attached is unnecessary for predicting risk and exposes patients if the data leaks.',
        'Publishing full medical records would expose **sensitive personal information** about every patient. Results can be checked without releasing identifiable data.',
        'Accuracy measures how good the predictions are; it has **nothing to do with privacy**. A very accurate model built on mishandled data is still a privacy breach.',
      ],
      keyIdea: 'Privacy in ML: get consent, remove identifiers, keep only what you need and store it securely, regardless of purpose or accuracy.',
    },
  },
  {
    id: 'ml-basics-018',
    subtopic: 'ml-basics',
    difficulty: 'exam',
    stem: '**Equal opportunity** requires qualified applicants to be accepted at the same rate in every group. From the table, by how many percentage points do the two groups\' rates differ?',
    table: {
      headers: ['Group', 'Qualified applicants', 'Qualified and accepted', 'Unqualified applicants', 'Unqualified and accepted'],
      rows: [
        ['Group X', 80, 60, 120, 30],
        ['Group Y', 40, 24, 60, 21],
      ],
    },
    options: ['$0$ percentage points', '$36$ percentage points', '$15$ percentage points', '$6$ percentage points'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Equal opportunity only looks at **qualified** applicants, so use only the first two number columns.\n\n' +
        '- Group X: $\\frac{60}{80} = 0.75 = 75\\%$ of qualified applicants accepted.\n' +
        '- Group Y: $\\frac{24}{40} = 0.6 = 60\\%$ of qualified applicants accepted.\n\n' +
        'Difference: $75\\% - 60\\% = 15$ percentage points.\n\n' +
        'Notice the trap: the **overall** acceptance rates are equal. Group X: $\\frac{60 + 30}{200} = 45\\%$. Group Y: $\\frac{24 + 21}{100} = 45\\%$. The model *looks* fair overall, but qualified people in Group Y are accepted less often. Different fairness measures can give different verdicts.',
      whyWrong: [
        'This compares the **overall** acceptance rates ($\\frac{90}{200} = 45\\%$ and $\\frac{45}{100} = 45\\%$). Equal opportunity is about **qualified** applicants only.',
        'This is $60 - 24 = 36$, the difference in the **number** of qualified applicants accepted. The groups have different numbers of qualified applicants, so compare rates.',
        null,
        'This divides the qualified-and-accepted counts by **all** applicants in each group ($\\frac{60}{200} = 30\\%$ and $\\frac{24}{100} = 24\\%$). The rate should be out of the qualified applicants only.',
      ],
      keyIdea: 'Equal opportunity compares acceptance rates among qualified people only; a model can look fair overall and still fail this test.',
    },
    check: {
      optionValues: [0, 36, 15, 6],
      compute: () => {
        const x = { qualified: 80, qualifiedAccepted: 60 };
        const y = { qualified: 40, qualifiedAccepted: 24 };
        const rx = F(x.qualifiedAccepted, x.qualified);
        const ry = F(y.qualifiedAccepted, y.qualified);
        return Math.abs(rx.sub(ry).mul(100).value());
      },
    },
  },

  // ---------------------------------------------------------------- recall and approach
  {
    id: 'ml-basics-019',
    subtopic: 'ml-basics',
    difficulty: 'foundation',
    stem: 'In supervised learning, what is a **label**?',
    options: ['The correct output for a training example', 'An input column of the data', 'A weight inside the model', 'A group found by clustering'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Supervised learning trains on pairs of inputs and correct outputs.\n\n' +
        'The correct output is the **label** (or target): for example "spam" for an email, or the selling price of a house. The inputs are the **features**.',
      whyWrong: [
        null,
        'An input column is a **feature**. The label is the output that the model learns to predict.',
        'Weights are numbers the model learns during training. Labels are part of the data and are given in advance.',
        'Clustering finds groups in data that has **no** labels, so a discovered group is not a label.',
      ],
      keyIdea: 'A label is the correct answer attached to a training example.',
    },
  },
  {
    id: 'ml-basics-020',
    subtopic: 'ml-basics',
    difficulty: 'foundation',
    stem: 'In machine learning, what is a **feature**?',
    options: ['An input variable used to make a prediction', 'The answer the model must predict', 'One row of the dataset', 'The error of the model'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A **feature** is one input variable: one column of the data table, such as age or monthly spend.\n\n' +
        'Each row is an **example**, and the column being predicted is the **label**.',
      whyWrong: [
        null,
        'The answer to be predicted is the **label** (or target).',
        'One row is an **example**. Features are the columns.',
        'The error is measured by the **loss**. It is computed from the predictions, not given as an input.',
      ],
      keyIdea: 'Features are the input columns; examples are the rows; the label is the column being predicted.',
    },
  },
  {
    id: 'ml-basics-021',
    subtopic: 'ml-basics',
    difficulty: 'foundation',
    stem: 'Which type of machine learning uses data with **no** labels?',
    options: ['Unsupervised learning', 'Supervised learning', 'Reinforcement learning', 'Classification'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Unsupervised learning** looks for structure, such as groups of similar items, in data that has no labels. Clustering is the classic example.',
      whyWrong: [
        null,
        'Supervised learning is defined by having labels: the correct answers are supplied with the training data.',
        'Reinforcement learning has no labelled dataset, but it does get feedback, from rewards and penalties. It is not the type defined by learning from unlabelled data.',
        'Classification is a kind of supervised learning, so it needs labelled examples of each class.',
      ],
      keyIdea: 'No labels means unsupervised learning.',
    },
  },
  {
    id: 'ml-basics-022',
    subtopic: 'ml-basics',
    difficulty: 'foundation',
    stem: 'A dataset of $n$ examples, each with $d$ features, is stored as a matrix with one row per example. What is the order of this matrix?',
    options: ['$n \\times d$', '$d \\times n$', '$n \\times n$', '$(n + d) \\times 1$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **order** of a matrix means its size, written rows $\\times$ columns.\n\n' +
        'There is one row per example, so $n$ rows, and one column per feature, so $d$ columns. The order is $n \\times d$.',
      whyWrong: [
        null,
        'This swaps rows and columns. The order lists rows first, and the rows here are the $n$ examples.',
        'This would be a square matrix, which needs as many features as examples. The number of columns is $d$.',
        'This adds the two counts and uses a single column. A table of $n$ rows and $d$ columns has $n \\times d$ entries.',
      ],
      keyIdea: 'A data matrix has one row per example and one column per feature, so its order is $n \\times d$.',
    },
  },
  {
    id: 'ml-basics-023',
    subtopic: 'ml-basics',
    difficulty: 'exam',
    stem: 'A hospital wants to predict how many days a patient will stay, using past records that include the actual stays. Which approach fits best?',
    options: ['Regression', 'Classification', 'Clustering', 'Reinforcement learning'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: are there labels?** Yes: the past records include the actual stays, so this is supervised learning.\n\n' +
        '**Step 2: what kind of output?** A number of days is a quantity on a scale, not one of a few fixed categories.\n\n' +
        'Supervised learning that predicts a quantity is **regression**.',
      whyWrong: [
        null,
        'Classification picks one of a fixed set of categories. A length of stay is a quantity, where 6 days is more than 5 days.',
        'Clustering is for data with **no** labels. Here the actual stays are known.',
        'Reinforcement learning needs an agent that takes actions and receives rewards. Here there is a fixed set of past records.',
      ],
      keyIdea: 'Labels plus a numeric output means regression.',
    },
  },
];
