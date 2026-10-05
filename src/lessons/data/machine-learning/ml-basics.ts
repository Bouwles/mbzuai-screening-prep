import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'ml-basics',
  know:
    '### What machine learning is\n\n' +
    'In **traditional programming**, a person writes every rule: "if the email contains *win a prize*, mark it as spam". In **machine learning (ML)**, we give the computer lots of **examples (data)** and it **works out the rules itself**. It then uses those learned patterns on **new** data it has never seen.\n\n' +
    'A **model** is the thing that is learned. **Training** is the process of learning from data. **Prediction** (or inference) is using the trained model on new examples.\n\n' +
    '### Features and labels\n\n' +
    'Think of a dataset as a table: **one row per example**, one column per piece of information.\n\n' +
    '- **Features** (inputs, often called $x$) are the columns the model is given: age, hours studied, pixel brightness, and so on.\n' +
    '- The **label** (target, output, often called $y$) is the column the model must predict: "passed", "price", "spam or not".\n' +
    '- Pure **ID columns** (customer number, record number) are not useful features: they carry no real information about the outcome.\n\n' +
    'For an image, every stored pixel value is one feature. A grayscale pixel has **1** value; a colour pixel has **3** (red, green, blue). So a $28 \\times 28$ grayscale image gives $784$ features.\n\n' +
    '### The three types of learning\n\n' +
    '| Type | What the data looks like | Example |\n' +
    '|---|---|---|\n' +
    '| **Supervised** | examples **with** labels (correct answers) | emails marked spam / not spam |\n' +
    '| **Unsupervised** | examples **without** labels | customers with no groups given |\n' +
    '| **Reinforcement** | an **agent** acts and gets **rewards** or penalties | a program learning a game by trial and error |\n\n' +
    'Memory hook: in supervised learning a "teacher" has written the answers on the examples. In reinforcement learning nobody gives the answers; the agent only finds out afterwards whether an action was good (reward) or bad (penalty).\n\n' +
    '### The three main tasks\n\n' +
    '- **Regression** (supervised): predict a **number on a continuous scale**: a price in AED, a temperature, a time in minutes.\n' +
    '- **Classification** (supervised): predict a **category** from a fixed list: spam / not spam, cat / dog / rabbit, digit 0 to 9. Categories written as numbers (like handwritten digits) are still categories.\n' +
    '- **Clustering** (unsupervised): split unlabelled data into **groups it discovers itself**, with no groups chosen in advance.\n\n' +
    'Quick decision path for any task:\n\n' +
    '1. Is an agent taking actions and receiving rewards? Then it is **reinforcement learning**.\n' +
    '2. Otherwise, are there labels? No labels and "find groups": **clustering** (unsupervised).\n' +
    '3. Labels and the output is a number: **regression**. Labels and the output is a category: **classification**.\n\n' +
    'Watch the word "groups": if the groups (folders, classes) are **fixed in advance** and examples are already sorted into them, it is classification, not clustering.\n\n' +
    '### Data bias and fairness\n\n' +
    'A model can only learn what is in its data. **Bias** creeps in when the data is unbalanced or reflects unfair past decisions:\n\n' +
    '- **Sampling (representation) bias**: some groups are under-represented, so the model performs worse on them (for example a face model trained mostly on lighter-skinned faces).\n' +
    '- **Historical (label) bias**: the labels are past human decisions that were unfair, so the model learns to copy the unfairness.\n' +
    '- **Proxy features**: deleting a sensitive column (such as gender) is not enough, because other columns can be strongly linked to it (a career break, a club on a CV).\n\n' +
    'To **check** fairness, compare **rates**, never raw counts, because the groups usually have different sizes. For each group, divide the number with the outcome by **that group\'s own** total, then subtract the percentages. The gap is measured in **percentage points**. Comparing overall approval rates is called **demographic parity**; comparing rates among qualified people only is called **equal opportunity**. A model can pass one test and fail the other.\n\n' +
    'To **fix** a biased dataset, you can rebalance it. If the target share is a percentage of the **new** total, set up an equation such as $\\frac{u}{u + 600} = 0.4$ and solve it.\n\n' +
    '### Ethics and privacy\n\n' +
    '- **Consent**: people should agree to their data being used (or a proper ethics process must approve it).\n' +
    '- **Data minimisation**: collect and keep only what the model needs.\n' +
    '- **Remove identifiers** and **store data securely**.\n' +
    '- Removing names is **not** full anonymisation: postcode + date of birth + gender together can often identify one person (these are **quasi-identifiers**).\n' +
    '- A good purpose or a high accuracy **never** cancels these duties.',
  formulas: [
    {
      label: 'Supervised learning: learn a mapping from features to a label',
      tex: '\\text{features } x \\;\\longrightarrow\\; \\text{model} \\;\\longrightarrow\\; \\text{predicted label } \\hat{y}',
      note: 'Regression: the label is a continuous number. Classification: the label is a category.',
    },
    {
      label: 'Number of features in a table',
      tex: '\\text{features} = \\text{all columns} - \\text{label column} - \\text{ID columns}',
      note: 'Rows are examples, not features.',
    },
    {
      label: 'Number of features in an image',
      tex: '\\text{features} = \\text{width} \\times \\text{height} \\times \\text{values per pixel}',
      note: 'Values per pixel: 1 for grayscale, 3 for colour (red, green, blue). The label is never a feature.',
    },
    {
      label: 'Rate for one group (fairness check)',
      tex: '\\text{rate} = \\frac{\\text{number in the group with the outcome}}{\\text{total number in that group}} \\times 100\\%',
      note: 'Always divide by the group\'s own total, never by everyone.',
    },
    {
      label: 'Gap between two groups',
      tex: '\\text{gap} = \\text{rate}_A - \\text{rate}_B \\quad (\\text{in percentage points})',
      note: 'A difference of percentages is in percentage points; a ratio of rates is a different measure.',
    },
    {
      label: 'Equal opportunity rate',
      tex: '\\text{rate} = \\frac{\\text{qualified and accepted}}{\\text{qualified applicants}} \\times 100\\%',
      note: 'Uses qualified applicants only. Demographic parity uses all applicants.',
    },
    {
      label: 'Rebalancing: keep $u$ records of one group and all $n$ records of the rest',
      tex: '\\frac{u}{u + n} = p \\quad\\Longrightarrow\\quad u = \\frac{p\\,n}{1 - p}',
      note: '$p$ is the target share as a decimal (40% is $p = 0.4$). It applies to the **new** total $u + n$. Example: $n = 600$, $p = 0.4$ gives $u = \\frac{0.4 \\times 600}{0.6} = 400$.',
    },
  ],
  examples: [
    {
      title: 'Name the type of learning and task',
      problem: 'A taxi company uses thousands of past journeys, each with its actual journey time, to train a model that estimates how many minutes a new journey will take. Which type of learning and which task is this?',
      steps: [
        'Is an agent taking actions and receiving rewards? No, the model learns from a fixed set of past journeys, so it is not reinforcement learning.',
        'Does the data have labels? Yes: every past journey comes with its actual time, which is the correct answer. So this is **supervised** learning.',
        'Is the output a category or a number? A time in minutes is a number on a continuous scale, so the task is **regression**.',
      ],
      answer: 'Supervised learning, regression.',
    },
    {
      title: 'Count the features',
      problem: 'A model reads **colour** images that are 32 pixels wide and 32 pixels tall. Every stored pixel value is one input feature, and each image also has a label saying which object it shows. How many input features does each image give?',
      steps: [
        'Number of pixels: $32 \\times 32 = 1024$.',
        'A colour pixel stores 3 values (red, green, blue), so multiply by 3: $1024 \\times 3 = 3072$.',
        'The label is what the model predicts, so it is **not** an input feature. Do not add 1.',
      ],
      answer: '$3072$ features.',
    },
    {
      title: 'Fairness check with groups of different sizes',
      problem: 'A loan model is tested on 200 applicants from Group A (it approves 90 of them) and 300 applicants from Group B (it approves 105). By how many percentage points do the approval rates differ?',
      steps: [
        'The groups are different sizes, so compare **rates**, not counts.',
        'Group A: $\\frac{90}{200} = 0.45 = 45\\%$.',
        'Group B: $\\frac{105}{300} = 0.35 = 35\\%$.',
        'Gap: $45\\% - 35\\% = 10$ percentage points (in favour of Group A).',
        'Check a tempting wrong answer: $105 - 90 = 15$ compares counts, and Group B is bigger, so that number is meaningless here.',
      ],
      answer: '$10$ percentage points.',
    },
    {
      title: 'Rebalance a biased dataset (exam level)',
      problem: 'A dataset has 1500 records from people living in cities and 500 from people living in villages. In the real population 50% of people live in cities. The team keeps **all 500** village records and randomly removes city records. How many city records should they keep?',
      steps: [
        'Let $u$ be the number of city records kept. The new total is $u + 500$.',
        'The city share of the **new** total must be 50%: $\\frac{u}{u + 500} = 0.5$.',
        'Multiply both sides by $u + 500$: $u = 0.5u + 250$.',
        'Subtract $0.5u$: $0.5u = 250$, so $u = 500$.',
        'Check: $\\frac{500}{500 + 500} = \\frac{500}{1000} = 50\\%$. Correct.',
        'Common wrong answer: 50% of the original 2000 is 1000, but then cities would be $\\frac{1000}{1500} \\approx 67\\%$ of the new dataset.',
      ],
      answer: 'Keep $500$ city records.',
    },
  ],
  traps: [
    'Calling a "grouping" task clustering when the groups are **fixed in advance** and examples are already labelled (for example sorting emails into the folders Work / Personal / Promotions). That is classification.',
    'Treating categories written as numbers (handwritten digits 0 to 9, star ratings used as classes) as regression. If the output is one of a fixed set of classes, it is classification.',
    'Counting the label (or an ID column, or the number of rows) as a feature. Features are the input **columns** only.',
    'Comparing raw counts between groups of different sizes in a fairness question, or dividing by the total of **both** groups. Each rate uses its own group\'s total.',
    'Confusing a difference in percentage points with a ratio of rates (60% versus 30% is a gap of 30 percentage points, but a ratio of one half).',
    'Thinking that deleting a sensitive column, or removing names, solves bias or privacy. Proxy features and quasi-identifiers can bring the problem straight back.',
  ],
  examTip:
    'These questions are mostly **quick concept questions**, so aim to answer them in well under the 67 seconds and bank time for harder maths.\n\n' +
    '- For "which type of learning / task" questions, run the three-question check: rewards? labels? number or category? Underline the words that give it away: "labelled", "marked by", "known prices" (supervised); "no groups given in advance" (clustering); "reward", "points", "trial and error" (reinforcement).\n' +
    '- Remember that **regression and classification are both supervised**. If one option says "Both A and B" and A and B are a regression and a classification example with labels, it is very likely correct.\n' +
    '- In fairness tables, the distractors are usually the **count difference**, the rate using the **combined total**, the **ratio** of rates, and the **overall** rate when the question asks about qualified people only. Compute each group\'s own rate on your calculator and subtract.\n' +
    '- For rebalancing questions, **plug each option back in**: does $\\frac{u}{u + n}$ really give the target percentage? Only one option will.\n' +
    '- For ethics and privacy, eliminate any option claiming that a good purpose, a high accuracy or removing names alone makes something acceptable.',
};
