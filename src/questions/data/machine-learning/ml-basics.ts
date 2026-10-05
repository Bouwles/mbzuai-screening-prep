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
      'A computer program that follows a fixed list of rules written by hand by a programmer',
      'A computer system that gets better at a task by learning patterns from data, instead of being given every rule explicitly',
      'Any computer system that can store and search very large amounts of data quickly',
      'A robot with sensors and motors that can move around on its own',
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
    stem: 'A company has 50,000 old emails, and a person has marked each one as "spam" or "not spam". The company uses these emails to train a model that marks **new** emails as spam or not spam. Which type of machine learning is this?',
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
    stem: 'A model predicts the selling price (in AED) of an apartment from its floor area, number of bedrooms and distance to the nearest metro station. It is trained on past sales whose prices are known. What kind of task is this?',
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
    stem: 'A teacher wants to train a model to predict whether a student will **pass** the final exam. Part of the training data is shown. Which column is the **label** (the target the model learns to predict)?',
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
        'The teacher wants to predict **whether a student passes**, so the label is the "Passed" column (Yes / No).\n\n' +
        'Hours studied, hours of sleep and attendance are the three **features**. Because the label is a category (Yes / No), this is a classification task.',
      whyWrong: [
        'Hours studied is an **input** the model uses to make its prediction, so it is a feature, not the label.',
        'Hours of sleep is an **input** (feature). The model uses it to predict the outcome; it is not the thing being predicted.',
        'Attendance is known before the exam and is used as an **input** (feature), not the outcome the teacher wants to predict.',
        null,
      ],
      keyIdea: 'Features are the inputs; the label is the answer the model is trained to predict.',
    },
  },
  {
    id: 'ml-basics-005',
    subtopic: 'ml-basics',
    difficulty: 'foundation',
    stem: 'A computer program learns to play a racing video game. It is **never shown** the correct moves. Instead it tries actions, gains points for finishing laps quickly, loses points when it crashes, and gradually learns to drive better. Which type of machine learning is this?',
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
    stem: 'A shop wants to predict whether a customer will stop shopping there ("churn"). Part of its dataset is shown. The Customer ID column is just a reference number and is **not** given to the model. Every other column except the label is used as an input. How many **features** does the model use?',
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
      'Predicting tomorrow\'s maximum temperature in Abu Dhabi from today\'s weather readings',
      'Deciding whether an X-ray shows a broken bone, using thousands of X-rays already labelled by doctors',
      'Sorting new emails into the folders "Work", "Personal" and "Promotions", using emails the user has already filed',
      'Splitting a supermarket\'s customers into groups with similar shopping habits, with no groups decided in advance',
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
    stem:
      'How many of these six tasks are **classification** tasks?\n\n' +
      '1. Predicting tomorrow\'s maximum temperature in degrees Celsius\n' +
      '2. Deciding whether a tumour is benign or malignant from a scan\n' +
      '3. Recognising which digit (0 to 9) has been handwritten\n' +
      '4. Estimating the resale price of a used car in AED\n' +
      '5. Grouping news articles by topic when no topics are given in advance\n' +
      '6. Predicting whether a customer will cancel their phone contract next month',
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
    stem: 'A face-analysis model was trained on a photo dataset in which about 80% of the faces were lighter-skinned. When tested, its error rates for four groups of people were as shown in the chart. What is the **most likely main cause** of this pattern?',
    chart: {
      kind: 'bar',
      title: 'Error rate of the face-analysis model by group',
      xLabel: 'Group',
      yLabel: 'Error rate (%)',
      categories: ['Lighter-skinned men', 'Lighter-skinned women', 'Darker-skinned men', 'Darker-skinned women'],
      series: [{ name: 'Error rate (%)', values: [1, 7, 12, 35] }],
    },
    options: [
      'The training data under-represents darker-skinned faces, so the model learned much less about them (sampling bias)',
      'Darker-skinned faces are naturally impossible for computers to analyse accurately, so nothing can be done',
      'The model was trained for too long, so it is overfitting equally on every group',
      'The test set was too large, which made the error rates for some groups go up',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'A model can only learn well from what it sees. Here about 80% of the training faces were lighter-skinned, so the model saw **far fewer examples** of darker-skinned faces (and probably even fewer of darker-skinned women).\n\n' +
        'The chart matches this exactly: the error rate is lowest (1%) for the best-represented group and highest (35%) for the least-represented group.\n\n' +
        'This is **sampling (representation) bias**: the training data does not represent all the people the model will be used on. The usual fixes are to collect more balanced data and to **test the model separately on each group** before using it.',
      whyWrong: [
        null,
        'There is nothing about darker skin that makes accurate analysis impossible; models trained on **balanced** data perform far better on every group. The gap comes from the data, not from the people.',
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
    stem: 'A bank tests a loan-approval model on applicants from two groups. The results are in the table. A fairness check compares the **approval rates** of the two groups. By how many percentage points is Group A\'s approval rate **higher** than Group B\'s?',
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
    stem: 'Which of the following are examples of **supervised** learning?',
    options: [
      'Training a model to predict house prices from past sales, where the selling price of every house is known',
      'Training a model to recognise cats and dogs from photos that have each been tagged "cat" or "dog"',
      'Both A and B',
      'None of the above',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Supervised learning = learning from examples that come **with the correct answer (label)**.\n\n' +
        '- A: every past sale has its real price, so each example is labelled. It predicts a number, so it is supervised **regression**.\n' +
        '- B: every photo is tagged "cat" or "dog", so each example is labelled. It predicts a category, so it is supervised **classification**.\n\n' +
        'Both are supervised, so the answer is C (Both A and B).\n\n' +
        'Remember: regression and classification are **both** kinds of supervised learning; clustering is the classic unsupervised task.',
      whyWrong: [
        'A is supervised, but so is B: the "cat" / "dog" tags are labels. Classification is supervised learning too.',
        'B is supervised, but so is A: the known selling prices are labels. Regression is supervised learning too.',
        null,
        'Both A and B train on labelled data (known prices, known tags), which is exactly what supervised learning means.',
      ],
      keyIdea: 'Regression and classification are both supervised: the training data includes the correct answers.',
    },
  },
  {
    id: 'ml-basics-012',
    subtopic: 'ml-basics',
    difficulty: 'exam',
    stem: 'A model reads small **grayscale** (black-and-white) images that are 28 pixels wide and 28 pixels tall. Each pixel\'s brightness is fed into the model as one input feature. How many features does each image have?',
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
    stem: 'A hospital wants to use its patient records to train a model that predicts the risk of developing diabetes. Which approach is the **most appropriate** for protecting patients\' privacy?',
    options: [
      'Use the data only with patient consent or proper ethical approval, remove names and ID numbers, keep only the fields the model needs, and store the data securely',
      'Use every record with names attached, because the model is for a good medical purpose',
      'Publish the full patient records online so that other researchers can check the results',
      'Skip privacy steps as long as the final model reaches a high accuracy',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'Health data is some of the most **sensitive personal data** there is. Good practice when using it for ML includes:\n\n' +
        '- **Consent / approval**: people should agree to (or a proper ethics process should approve) their data being used.\n' +
        '- **Remove direct identifiers** such as names and ID numbers.\n' +
        '- **Data minimisation**: collect and keep only the fields that the model actually needs.\n' +
        '- **Security**: store the data safely and limit who can access it.\n\n' +
        'Only the first approach does all of this. A good purpose or a high accuracy does not remove the duty to protect people\'s privacy.',
      whyWrong: [
        null,
        'A good purpose does not cancel the need for **consent** and protection. Keeping names attached is unnecessary for predicting risk and exposes patients if the data leaks.',
        'Publishing full medical records would expose **sensitive personal information** about every patient. Results can be checked without releasing identifiable data.',
        'Accuracy measures how good the predictions are; it has **nothing to do with privacy**. A very accurate model built on mishandled data is still a privacy breach.',
      ],
      keyIdea: 'Privacy in ML: get consent, remove identifiers, keep only what you need and store it securely, regardless of purpose or accuracy.',
    },
  },

  // ---------------------------------------------------------------- challenge
  {
    id: 'ml-basics-014',
    subtopic: 'ml-basics',
    difficulty: 'challenge',
    stem:
      'Three projects are described below.\n\n' +
      '- **P**: Divide 10,000 online shoppers into groups with similar buying behaviour. No groups are given in advance.\n' +
      '- **Q**: Predict how many minutes a food delivery will take, using past deliveries whose actual times were recorded.\n' +
      '- **R**: Learn when to switch a junction\'s traffic lights by trying different timings in a simulator, and being rewarded whenever cars wait less.\n\n' +
      'Which line matches every project to the correct type of machine learning?',
    options: [
      'P: classification (supervised); Q: regression (supervised); R: reinforcement learning',
      'P: clustering (unsupervised); Q: classification (supervised); R: reinforcement learning',
      'P: clustering (unsupervised); Q: regression (supervised); R: supervised learning',
      'P: clustering (unsupervised); Q: regression (supervised); R: reinforcement learning',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Work through each project with three questions: Is there an agent acting and getting rewards? Are there labels? Is the output a category or a number?\n\n' +
        '1. **P**: no labels, and the groups are discovered from the data. That is **clustering**, which is **unsupervised**.\n' +
        '2. **Q**: past deliveries have their real times recorded (labels), so it is supervised. The output, a number of minutes, is continuous, so it is **regression**.\n' +
        '3. **R**: an agent (the light controller) takes actions (timings) in an environment (the simulator) and gets rewards (less waiting). That is **reinforcement learning**.\n\n' +
        'So: P clustering, Q regression, R reinforcement learning.',
      whyWrong: [
        'P has **no labels** and no groups decided in advance, so it cannot be classification; discovering groups yourself is clustering.',
        'Q predicts a **number of minutes**, a continuous quantity, so it is regression, not classification.',
        'R is never shown labelled "correct" timings; it learns by trial and error from a **reward** signal, which is reinforcement learning, not supervised learning.',
        null,
      ],
      keyIdea: 'No labels and discovered groups: clustering; labels and a number: regression; actions and rewards: reinforcement learning.',
    },
  },
  {
    id: 'ml-basics-015',
    subtopic: 'ml-basics',
    difficulty: 'challenge',
    stem: 'A team is training a model to predict the opinions of a city\'s adult residents. Its training dataset has 2000 records, split by age as shown in the chart. In the city itself, only **40%** of adults are aged under 30. To make the dataset match the city, the team keeps **all 600** records of people aged 30 and over and randomly removes some of the under-30 records. How many under-30 records should they **keep**?',
    chart: {
      kind: 'pie',
      title: 'Training dataset by age (2000 records)',
      slices: [
        { label: 'Aged under 30', value: 1400 },
        { label: 'Aged 30 and over', value: 600 },
      ],
    },
    options: ['$800$', '$400$', '$560$', '$240$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The dataset is 70% under-30 ($\\frac{1400}{2000}$), but the city is only 40% under-30, so the data is **biased** towards young people.\n\n' +
        'Keep all 600 older records and keep $u$ under-30 records. The **new** total is $u + 600$, and the under-30s must be 40% of that new total:\n\n' +
        '$$\\frac{u}{u + 600} = 0.4$$\n\n' +
        'Multiply both sides by $u + 600$:\n\n' +
        '$$u = 0.4u + 240$$\n\n' +
        '$$0.6u = 240 \\quad\\Rightarrow\\quad u = 400$$\n\n' +
        'Check: the new dataset has $400 + 600 = 1000$ records, and $\\frac{400}{1000} = 40\\%$. Correct.\n\n' +
        'Shortcut: the 600 older records must make up the other 60%, so the new total is $\\frac{600}{0.6} = 1000$, and 40% of 1000 is 400.',
      whyWrong: [
        'This is 40% of the **original** 2000 records. After removing records the total is smaller, so 40% must be taken of the new total, $u + 600$. (Check: $\\frac{800}{1400} \\approx 57\\%$, not 40%.)',
        null,
        'This is 40% of the 1400 under-30 records. The 40% refers to the share of the **whole** new dataset, not of the under-30 group.',
        'This is 40% of the 600 older records. That would make under-30s $\\frac{240}{840} \\approx 29\\%$ of the data; the 600 older records must be the **60%** share.',
      ],
      keyIdea: 'When rebalancing a biased dataset, the target percentage applies to the NEW total, so set up and solve an equation.',
    },
    check: {
      optionValues: [800, 400, 560, 240],
      compute: () => {
        const older = 600;
        const under30Available = 1400;
        const target = F(40, 100);
        for (let u = 0; u <= under30Available; u++) {
          if (F(u, u + older).equals(target)) return u;
        }
        return -1;
      },
    },
  },
  {
    id: 'ml-basics-016',
    subtopic: 'ml-basics',
    difficulty: 'challenge',
    stem: 'A company releases a dataset for machine learning research. It has removed every person\'s name and phone number, but each record still contains the person\'s **full postcode, date of birth and gender**, together with their medical diagnosis. Which statement is correct?',
    options: [
      'The data is now fully anonymous, because no names or phone numbers remain',
      'Many people could still be re-identified by matching postcode, date of birth and gender with other available data, so the data is not truly anonymous',
      'Re-identification is impossible, because thousands of people share each postcode, each date of birth and each gender',
      'The privacy risk would disappear if a more accurate model were trained on the data',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Names and phone numbers are **direct identifiers**. Postcode, date of birth and gender are **quasi-identifiers**: each one alone is shared by many people, but **together** they often single out one person.\n\n' +
        'For example, in one postcode area there may be thousands of people, but how many were born on 14 March 2005 **and** are female? Very often just one. Matching these three fields against another dataset that does include names (such as a public register or a social-media profile) can reveal who each record belongs to, and therefore their diagnosis.\n\n' +
        'Studies of real populations have found that a large majority of people are unique on the combination of postcode, full date of birth and gender. So removing names alone does **not** make data anonymous. Safer releases coarsen or remove these fields (for example, only the year of birth and the first part of the postcode).',
      whyWrong: [
        'Removing direct identifiers is not enough: the **combination** of postcode, date of birth and gender can still point to a single person.',
        null,
        'Each field on its own is common, but the **combination** of all three is usually rare or unique, which is exactly what makes re-identification possible.',
        'The accuracy of a model trained on the data has **no effect** on whether people in the released dataset can be identified.',
      ],
      keyIdea: 'Removing names is not anonymisation: combinations of quasi-identifiers (postcode, birth date, gender) can re-identify people.',
    },
  },
  {
    id: 'ml-basics-017',
    subtopic: 'ml-basics',
    difficulty: 'challenge',
    stem: 'A company trains a hiring model on its last 10 years of hiring decisions, a period in which mostly men were hired. To make the model fair, the company **deletes the "gender" column** before training. The new model still recommends far fewer women than men with similar qualifications. What is the **most likely** explanation?',
    options: [
      'Other features act as proxies for gender (for example, a women\'s sports club on the CV or a career break), so the model can still learn the old biased pattern from the historical decisions',
      'Deleting a column has no effect on what a model learns, so the model is still secretly reading the gender column',
      'The model must be underfitting; training it for longer would remove the bias',
      'The training data contained too many women, so the model learned to reject them',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'Two things combine here:\n\n' +
        '1. **Biased labels**: the "correct answers" the model learns from are past human decisions, which favoured men. The model is rewarded for copying those decisions.\n' +
        '2. **Proxy features**: even without a gender column, other features are **correlated** with gender (for example, membership of a women\'s club, a gap in employment for childcare, or certain schools). The model can use these to reproduce the same pattern.\n\n' +
        'So simply deleting the sensitive column ("fairness through unawareness") often does not work. Real fixes include checking outcomes by group, removing or adjusting proxy features, and correcting the biased training labels.',
      whyWrong: [
        null,
        'A deleted column really is gone; the model cannot read it. The problem is that **other columns carry similar information** (proxies).',
        'Training longer makes the model copy the training labels **more** closely, and those labels are the biased past decisions, so the bias would not disappear.',
        'The data came from a period when **mostly men** were hired, so the historical pattern favours men; too many women is the opposite of what the stem describes.',
      ],
      keyIdea: 'Removing a sensitive column does not remove bias: proxy features and biased historical labels can reproduce it.',
    },
  },
  {
    id: 'ml-basics-018',
    subtopic: 'ml-basics',
    difficulty: 'challenge',
    stem: 'A university admissions model is tested on two groups of applicants. A fairness rule called **equal opportunity** says that **qualified** applicants should be accepted at the same rate in every group. Using the table, by how many percentage points do the acceptance rates of **qualified** applicants differ between the two groups?',
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
];
