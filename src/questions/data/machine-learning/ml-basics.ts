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
      asking: 'What does the term machine learning mean?',
      solution:
        'In ordinary programming, a person writes every rule. For example: "if the email contains the word prize, mark it as spam".\n\n' +
        'In **machine learning**, the person gives the computer many examples instead. The computer finds the patterns in them by itself, then uses those patterns on new cases.',
      conclusion: 'The rules come from the examples, not from a programmer. Learning patterns from data instead of being given every rule is the best description.',
      whyWrong: [
        'This describes **traditional, rule-based programming**. The whole point of machine learning is that the rules are *learned* from examples, not all written by hand.',
        null,
        'This describes a **database** or search engine. Storing and searching data is not the same as learning patterns from it to make predictions.',
        'This describes **robotics** (hardware). A robot may *use* machine learning, but having sensors and moving around is not what machine learning means.',
      ],
      keyIdea: 'To test whether something is machine learning, ask: did the system work out its own rules from data? Fixed rules written by hand are ordinary programming. Storing data is a database. Moving around is robotics.',
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
      asking: 'What kind of machine learning learns from emails that a person has already marked?',
      solution:
        'Each old email comes with the right answer attached: "spam" or "not spam". That attached answer is called a **label**.\n\n' +
        'Learning from examples that have labels is called **supervised learning**. The labels act like a teacher marking the model\'s work.',
      conclusion: 'The model learns from labelled emails so it can mark new ones, which makes this Supervised learning.',
      whyWrong: [
        'Unsupervised learning uses data **without labels** and looks for structure on its own. Here every email has a spam / not spam label, so it is supervised.',
        'Reinforcement learning means an agent learning by **trial and error from rewards**. Here the model learns from a fixed set of labelled emails, not from rewards.',
        null,
        'The model is trained on examples and learns the patterns itself, so this **is** machine learning, not a set of hand-written rules.',
      ],
      keyIdea: 'Look at the training data first. Right answers attached means supervised. No answers, only finding groups, means unsupervised. Learning from rewards by trial and error means reinforcement.',
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
      asking: 'What kind of machine learning task is predicting a price?',
      solution:
        'Look at what the model outputs: a selling price. That is a number on a scale, where any value in a range is possible.\n\n' +
        'Predicting a number like this from past examples with known answers is called **regression**. Predicting a category, like "cheap" or "expensive", would be called **classification**.',
      conclusion: 'The output is a number, learned from past sales with known prices, so the answer is Regression.',
      whyWrong: [
        null,
        'Classification predicts a **category** from a fixed list (for example "cheap / medium / expensive"). A price in AED is a continuous number, so this is regression.',
        'Clustering groups **unlabelled** data into groups it discovers itself. Here the past prices (labels) are known and we predict a number.',
        'Reinforcement learning is about an agent taking actions and learning from **rewards**. There are no actions or rewards here, just labelled examples.',
      ],
      keyIdea: 'Look at the output. A number on a scale (price, temperature, time) means regression. A category from a fixed list means classification. Groups found with no labels means clustering. Rewards for actions means reinforcement learning.',
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
      asking: 'Which column holds the answer the model is trying to predict?',
      solution:
        'Every useful column in training data is one of two kinds. **Features** are the inputs the model looks at. The **label** is the correct answer it learns to predict.\n\n' +
        'Hours studied, hours of sleep and attendance are all known before the exam, so the model can use them as inputs. They are features.\n\n' +
        'The model is built to predict whether a student passes, so find the column recording that outcome. The Passed column holds Yes or No for each past student.',
      conclusion: 'The other three columns are inputs, so the label is the column Passed.',
      whyWrong: [
        'Hours studied is an **input** the model uses to make its prediction, so it is a feature, not the label.',
        'Hours of sleep is an **input** (feature). The model uses it to predict the outcome; it is not the thing being predicted.',
        'Attendance is known before the exam and is used as an **input** (feature), not the outcome to be predicted.',
        null,
      ],
      keyIdea: 'To find the label, finish the sentence "the model predicts ..." and match it to a column. It is often the last column. Every other useful column is a feature.',
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
      asking: 'What type of machine learning learns by trying actions and scoring points?',
      solution:
        'Look at how the program gets feedback. Nobody shows it correct moves, so there are no **labels** (correct answers attached to examples).\n\n' +
        'Instead, it tries an action, then gains or loses points. Over many laps, it repeats what earned points and avoids what lost them.\n\n' +
        'Learning by trial and error from rewards and penalties is called **reinforcement learning**.',
      conclusion: 'Points for fast laps and lost points for crashes are rewards and penalties, so the answer is Reinforcement learning.',
      whyWrong: [
        'Supervised learning needs examples **labelled with the correct answer** (the right move for each situation). The program is never shown correct moves.',
        null,
        'Unsupervised learning finds patterns in a fixed set of unlabelled data and gets **no feedback**. Here the program acts and receives points as feedback.',
        'Nobody writes the driving rules; the program improves from its own experience, so this is machine learning.',
      ],
      keyIdea: 'Look for something taking actions and getting rewards or points: that means reinforcement. Right answers attached means supervised. No answers, only finding groups, means unsupervised.',
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
      asking: 'How many columns does the model use as inputs?',
      solution:
        'A **feature** is an input the model uses to make its prediction. So count input columns, not rows, because each row is just one customer.\n\n' +
        'There are 6 columns, and two of them aren\'t features. The question says Customer ID is not given to the model. Churned (meaning the customer left) is the **label**, the answer it predicts.\n\n' +
        'That leaves Age, Monthly spend, Visits per month and Has loyalty card. Counting them gives $6 - 2 = 4$.',
      conclusion: 'Four input columns remain, so the model uses $4$ features.',
      whyWrong: [
        'This counts one column too many: either the ID column or the label "Churned" has been counted as a feature. The label is the output, never an input.',
        'This counts the number of **rows** (customers) shown. Features are the input **columns**, not the examples.',
        null,
        'This counts every column. The Customer ID is not used, and "Churned" is the label (the answer to predict), so neither is a feature.',
      ],
      keyIdea: 'To count features: count the columns, take off the label, then take off anything the model isn\'t given, such as an ID. Never count rows, because those are examples.',
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
      asking: 'Which of these tasks forms groups when nobody has decided the groups beforehand?',
      solution:
        '**Clustering** means finding groups of similar items when the data has no labels and no groups are chosen in advance. The computer decides the groups itself.\n\n' +
        'Test each task by looking at what it is given. **Regression** predicts a number on a scale, and **classification** picks from categories that are already fixed:\n\n| Task | What it is given | Type |\n|---|---|---|\n| Tomorrow\'s maximum temperature | Past temperatures | Regression |\n| Broken bones | X-rays labelled by doctors | Classification |\n| Three fixed folders | Emails already filed | Classification |\n| Customers by shopping habits | No groups decided in advance | Clustering |',
      conclusion: 'Only one task has no labels and no groups chosen in advance. Grouping customers by shopping habits, with no groups decided in advance is the clustering task.',
      whyWrong: [
        'The output is a temperature, a continuous number, and past temperatures are known: this is **regression**, not clustering.',
        'The X-rays are already labelled (broken / not broken), so the model learns from correct answers: this is **classification**.',
        'This sounds like "grouping", but the folders are **chosen in advance** and the user\'s filed emails act as labels, so it is **classification**. Clustering only applies when the groups are not known beforehand.',
        null,
      ],
      keyIdea: 'The word "grouping" alone doesn\'t make it clustering. Ask: were the groups chosen in advance, or are labels supplied? If so, it is classification. Clustering applies only when the computer discovers the groups itself.',
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
      asking: 'How many of the six tasks choose from a fixed list of categories?',
      solution:
        '**Classification** picks a category from a fixed list. **Regression** predicts a number on a scale. **Clustering** finds groups when no labels are given.\n\n' +
        'Go through the six tasks and look at each one\'s output:\n\n| Task | Output | Type |\n|---|---|---|\n| 1 | A temperature in degrees | Regression |\n| 2 | Benign or malignant | Classification |\n| 3 | One of the digits 0 to 9 | Classification |\n| 4 | A price in AED | Regression |\n| 5 | Topics found with no labels | Clustering |\n| 6 | Cancel or not | Classification |\n\n' +
        'Task 3\'s output looks like a number, but each digit is really a category. You can\'t have digit 3.5, and an 8 isn\'t "more" than a 3 in any useful way.\n\n' +
        'Count the rows marked Classification: tasks 2, 3 and 6. That makes 3.',
      conclusion: 'Tasks 2, 3 and 6 choose from fixed categories, so the answer is $3$.',
      whyWrong: [
        'This misses task 3. Digit recognition outputs a digit, but each digit is a **category** (one of 10 classes), not a quantity on a scale, so it is classification.',
        null,
        'This also counts task 5. Grouping articles when **no topics are given** is clustering (unsupervised), not classification, because there are no labels.',
        'This counts everything except clustering, treating the temperature and car price as classification. Those outputs are continuous numbers, so they are regression.',
      ],
      keyIdea: 'Label each task by its output: a number on a scale is regression, a category from a fixed list is classification, and groups with no labels is clustering. Digits can be categories even though they look numeric.',
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
      asking: 'Why does the model make far more mistakes on some groups of faces?',
      solution:
        'Read the chart. The error rates are 1 and 7 for lighter-skinned faces, but 12 and 35 for darker-skinned faces. The model is far worse on the darker-skinned groups.\n\n' +
        'Link this to the training data. About $80\\%$ of the training faces were lighter-skinned, which leaves only about $20\\%$ for everyone else.\n\n' +
        'A model is usually best at what it has seen most. Darker-skinned faces gave it far fewer examples to learn from. When training data doesn\'t fairly represent a group, this is called **sampling bias**.',
      conclusion: 'The errors follow how well each group was represented, so the likely cause is this. Darker-skinned faces are under-represented in training (sampling bias).',
      whyWrong: [
        null,
        'There is nothing about darker skin that makes accurate analysis impossible; models trained on **balanced** data perform far better on the groups that were under-represented. The gap comes from the data, not from the people.',
        'Overfitting from too much training would not explain why the errors line up with **how well each group was represented** in the data. The pattern points to the training data, not the training time.',
        'A larger test set gives **more reliable** error estimates; it does not make the model itself worse for any group.',
      ],
      keyIdea: 'When a model does badly on one group, compare that group\'s share of the training data with its error rate. Errors that rise as representation falls point to sampling bias. The fix is more balanced data.',
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
      asking: 'What is the gap between the two groups\' approval percentages?',
      solution:
        'The groups have different sizes, so comparing counts isn\'t fair. We compare **approval rates**: the number approved divided by that group\'s own applicants.\n\n' +
        'Group A: $\\frac{96}{160} = 0.6 = 60\\%$.\n\n' +
        'Group B: $\\frac{72}{240} = 0.3 = 30\\%$.\n\n' +
        '**Percentage points** are the plain gap between two percentages, so subtract: $60 - 30 = 30$.',
      conclusion: 'Group A\'s rate is $60\\%$ and Group B\'s is $30\\%$, a gap of $30$ percentage points.',
      whyWrong: [
        'This is $96 - 72 = 24$, the difference in the **number** of approvals. The groups are different sizes (160 and 240), so you must compare rates.',
        'This divides both groups\' approvals by all $400$ applicants: $\\frac{96}{400} - \\frac{72}{400} = 24\\% - 18\\% = 6\\%$. Each group\'s rate must use **its own** number of applicants.',
        null,
        'This is $\\frac{30\\%}{60\\%} = 0.5 = 50\\%$, a **ratio** of the two rates (Group B is approved half as often), not the difference in percentage points.',
      ],
      keyIdea: 'To compare groups of different sizes, turn each count into a rate using that group\'s own total, then subtract the rates. A percentage-point gap is a plain subtraction, not a ratio.',
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
      asking: 'Are these two tasks both examples of learning from labelled data?',
      solution:
        '**Supervised learning** means training on examples that come with the correct answer attached, which is called a **label**. So look for labels in each statement.\n\n' +
        'Statement 1: the past sales have known prices, and the model learns from them, so the prices are labels. It predicts a number, which is still supervised learning. This statement is true.\n\n' +
        'Statement 2: each photo is tagged "cat" or "dog", and those tags are labels too. It predicts a category, which is also supervised learning. This statement is true.',
      conclusion: 'Each task trains on examples with correct answers attached, so the answer is Both statements.',
      whyWrong: [
        'Statement 1 is true, but so is Statement 2: the "cat" and "dog" tags are labels, and classification is supervised learning too.',
        'Statement 2 is true, but so is Statement 1: the known selling prices are labels, and regression is supervised learning too.',
        null,
        'Both statements describe training on labelled data (known prices, known tags), which is exactly what supervised learning means.',
      ],
      keyIdea: 'For statement questions, judge each statement on its own. Supervised learning covers regression and classification: if the training data has known answers, it is supervised, whatever the output looks like.',
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
      asking: 'How many brightness values does one image give the model?',
      solution:
        'An image is a grid of tiny squares called **pixels**. **Grayscale** means each pixel stores just one number, its brightness.\n\n' +
        'The question says each brightness is one feature, so the number of features equals the number of pixels.\n\n' +
        'The grid has 28 rows with 28 pixels in each, so multiply: $28 \\times 28 = 784$.',
      conclusion: '28 rows of 28 pixels, at one value each, gives $784$ features.',
      whyWrong: [
        'This is $28 + 28$: the side lengths have been **added**. A grid has $28 \\times 28$ pixels, so multiply.',
        'This is the pixels in just **one row** (or one column). The image has 28 rows of 28 pixels.',
        'This is $28 \\times 28 \\times 3$, treating the image as **colour** (red, green, blue). A grayscale pixel has only one value.',
        null,
      ],
      keyIdea: 'Features in an image $=$ width $\\times$ height $\\times$ values per pixel. Grayscale has 1 value per pixel, and colour has 3 (red, green and blue). Multiply the sides, and never add them.',
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
      asking: 'What is the most responsible way to handle patient records when building this model?',
      solution:
        'Medical records are sensitive personal data. A good purpose or an accurate model doesn\'t remove the duty to protect them, and publishing the records would expose patients.\n\n' +
        'Good privacy practice has four parts. **Consent**: patients agree to their data being used. **Remove identifiers**: take away names and anything else saying who someone is. **Keep only needed fields**: don\'t hold data the model doesn\'t use. **Store securely**: protect it from leaks.',
      conclusion: 'Only one option protects patients at every stage: Consent, remove identifiers, keep only needed fields, store securely.',
      whyWrong: [
        null,
        'A good purpose does not cancel the need for **consent** and protection. Keeping names attached is unnecessary for predicting risk and exposes patients if the data leaks.',
        'Publishing full medical records would expose **sensitive personal information** about every patient. Results can be checked without releasing identifiable data.',
        'Accuracy measures how good the predictions are; it has **nothing to do with privacy**. A very accurate model built on mishandled data is still a privacy breach.',
      ],
      keyIdea: 'For data ethics questions, look for consent, removing identifiers, keeping only what is needed and secure storage. Reject options that excuse privacy because of a good purpose or high accuracy.',
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
      asking: 'Among qualified applicants only, how far apart are the two groups\' acceptance rates?',
      solution:
        '**Equal opportunity** looks only at people who are qualified. So ignore the two Unqualified columns.\n\n' +
        'The rate is qualified and accepted, divided by qualified applicants. Group X: $\\frac{60}{80} = 0.75 = 75\\%$.\n\n' +
        'Group Y: $\\frac{24}{40} = 0.6 = 60\\%$.\n\n' +
        '**Percentage points** are the plain gap between two percentages, so subtract: $75 - 60 = 15$.',
      conclusion: 'Qualified applicants are accepted at $75\\%$ and $60\\%$, a gap of $15$ percentage points.',
      whyWrong: [
        'This compares the **overall** acceptance rates ($\\frac{90}{200} = 45\\%$ and $\\frac{45}{100} = 45\\%$). Equal opportunity is about **qualified** applicants only.',
        'This is $60 - 24 = 36$, the difference in the **number** of qualified applicants accepted. The groups have different numbers of qualified applicants, so compare rates.',
        null,
        'This divides the qualified-and-accepted counts by **all** applicants in each group ($\\frac{60}{200} = 30\\%$ and $\\frac{24}{100} = 24\\%$). The rate should be out of the qualified applicants only.',
      ],
      keyIdea: 'In a fairness question, use only the columns the definition names. Equal opportunity uses qualified applicants only. Find each group\'s rate from its own total, then subtract the rates.',
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
      asking: 'What does the word label mean in supervised learning?',
      solution:
        'In supervised learning, each training example is shown to the model along with the right answer.\n\n' +
        'For example, an old email comes with "spam" or "not spam" attached. That attached right answer is the **label**. The model learns to give the same kind of answer for new emails.',
      conclusion: 'A label is the right answer attached to an example. The correct output for a training example is the best description.',
      whyWrong: [
        null,
        'An input column is a **feature**. The label is the output that the model learns to predict.',
        'Weights are numbers the model learns during training. Labels are part of the data and are given in advance.',
        'Clustering finds groups in data that has **no** labels, so a discovered group is not a label.',
      ],
      keyIdea: 'In a data table, each row is an example, the input columns are features, and the column the model must predict is the label. Weights are inside the model, not in the data.',
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
      asking: 'What does the word feature mean in machine learning?',
      solution:
        'Think of what a model looks at before it predicts. To predict a house price, it might use floor area and number of bedrooms.\n\n' +
        'Each of those inputs is a **feature**. In a table of data, the features are the input columns.',
      conclusion: 'A feature is something the model looks at to predict. An input variable used to make a prediction is the best description.',
      whyWrong: [
        null,
        'The answer to be predicted is the **label** (or target).',
        'One row is an **example**. Features are the columns.',
        'The error is measured by the **loss**. It is computed from the predictions, not given as an input.',
      ],
      keyIdea: 'In a data table, features are the input columns, the label is the column to predict, an example is one row, and the loss measures error. Work out which of these each option describes.',
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
      asking: 'Which type of machine learning works without correct answers attached to the data?',
      solution:
        'A **label** is a correct answer attached to a training example, such as "spam" on an email.\n\n' +
        'Supervised learning needs those labels, and classification is one kind of supervised learning. Reinforcement learning has no labels, but it does get rewards, so it isn\'t learning from the data alone.\n\n' +
        'The type that has only the data, and just looks for patterns such as groups, is **unsupervised learning**.',
      conclusion: 'It has no labels and finds patterns in the data itself, so the answer is Unsupervised learning.',
      whyWrong: [
        null,
        'Supervised learning is defined by having labels: the correct answers are supplied with the training data.',
        'Reinforcement learning has no labelled dataset, but it does get feedback, from rewards and penalties. It is not the type defined by learning from unlabelled data.',
        'Classification is a kind of supervised learning, so it needs labelled examples of each class.',
      ],
      keyIdea: 'Sort by feedback. Correct answers given: supervised (regression, classification). Only data, nothing else: unsupervised (clustering). Rewards for actions: reinforcement.',
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
      asking: 'How many rows and columns does the data matrix have?',
      solution:
        'A **matrix** is a grid of numbers. Its **order** gives its size as rows $\\times$ columns, with rows first.\n\n' +
        'The question says one row per example, and there are $n$ examples. So the matrix has $n$ rows.\n\n' +
        'Each row holds one number per feature, and each example has $d$ features. So the matrix has $d$ columns.\n\n' +
        'Write rows first, then columns: $n \\times d$.',
      conclusion: 'With $n$ rows and $d$ columns, the order is $n \\times d$.',
      whyWrong: [
        null,
        'This swaps rows and columns. The order lists rows first, and the rows here are the $n$ examples.',
        'This would be a square matrix, which needs as many features as examples. The number of columns is $d$.',
        'This adds the two counts and uses a single column. A table of $n$ rows and $d$ columns has $n \\times d$ entries.',
      ],
      keyIdea: 'The order of a matrix is rows $\\times$ columns. For a dataset, rows are usually examples and columns are features. For example, 100 examples with 5 features make a $100 \\times 5$ matrix.',
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
      asking: 'What method fits predicting a number of days from past records?',
      solution:
        'Look at the past records first. They include the actual stays, so the correct answers are known. That makes this supervised learning, which means either regression or classification.\n\n' +
        'Now look at the output: a number of days. It is a quantity on a scale, because 6 days is more than 5 days. It isn\'t a category from a fixed list.\n\n' +
        'Predicting a quantity from examples with known answers is called **regression**.',
      conclusion: 'The output is a quantity and the answers are known from past stays, so the answer is Regression.',
      whyWrong: [
        null,
        'Classification picks one of a fixed set of categories. A length of stay is a quantity, where 6 days is more than 5 days.',
        'Clustering is for data with **no** labels. Here the actual stays are known.',
        'Reinforcement learning needs an agent that takes actions and receives rewards. Here there is a fixed set of past records.',
      ],
      keyIdea: 'Ask two questions in order. Does the data have known answers? If so, it is supervised. Is the output a quantity or a category? A quantity means regression, and a category means classification.',
    },
  },
];
