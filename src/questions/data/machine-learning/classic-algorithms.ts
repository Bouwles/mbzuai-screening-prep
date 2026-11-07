import type { StaticQuestion } from '../../../types';
import { round } from '../../../lib/mathx';

/** Join source lines into one code string. */
const src = (...lines: string[]) => lines.join('\n');

type Pt = [number, number];

/** Gini impurity of a node from its class counts. */
const gini = (counts: number[]): number => {
  const n = counts.reduce((a, b) => a + b, 0);
  return 1 - counts.reduce((acc, c) => acc + (c / n) ** 2, 0);
};

/** Entropy (base 2) of a node from its class counts; 0 log 0 counts as 0. */
const entropy = (counts: number[], log: (x: number) => number = Math.log2): number => {
  const n = counts.reduce((a, b) => a + b, 0);
  return -counts.reduce((acc, c) => (c === 0 ? acc : acc + (c / n) * log(c / n)), 0);
};

/** Weighted impurity of a split into children (each child = class counts). */
const weighted = (children: number[][], f: (c: number[]) => number): number => {
  const N = children.flat().reduce((a, b) => a + b, 0);
  return children.reduce((acc, ch) => acc + (ch.reduce((a, b) => a + b, 0) / N) * f(ch), 0);
};

const sqDist = (a: Pt, b: Pt): number => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

/** Majority label (assumes a unique winner). */
const majority = (labels: string[]): string => {
  const c = new Map<string, number>();
  labels.forEach((l) => c.set(l, (c.get(l) ?? 0) + 1));
  const top = Math.max(...c.values());
  const winners = [...c.entries()].filter(([, v]) => v === top).map(([k]) => k);
  return winners.length === 1 ? winners[0] : 'tie';
};

const meanPt = (pts: Pt[]): Pt => [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'classic-algorithms-001',
    subtopic: 'classic-algorithms',
    difficulty: 'foundation',
    stem: 'Statement 1: k-NN needs labelled training data to classify a new point.\n\nStatement 2: k-means groups unlabelled data into $k$ clusters.\n\nWhich is true?',
    options: [
      'Statement 1 only',
      'Statement 2 only',
      'Both statements',
      'Neither statement',
    ],
    correctIndex: 2,
    fixedOrder: true,
    markScheme: {
      asking: 'Are these two descriptions of k-NN and k-means correct?',
      solution:
        '**Labelled** data means each example comes with the right answer attached, such as "cat" or "dog". Unlabelled data has no answers attached.\n\n' +
        '**k-NN** (k nearest neighbours) classifies a new point by finding the $k$ closest training points and taking a vote of their labels. With no labels there would be nothing to vote with. So Statement 1 is true.\n\n' +
        '**k-means** takes points with no labels and splits them into $k$ groups, called clusters, by how close they are. It never looks at a label. So Statement 2 is true as well.',
      conclusion: 'k-NN needs labels to vote and k-means works without them, so the answer is Both statements.',
      whyWrong: [
        'Statement 1 is true, but so is Statement 2: k-means uses no labels at all.',
        'Statement 2 is true, but so is Statement 1: k-NN votes using the labels of the training points.',
        null,
        'Both statements are correct descriptions. This choice usually comes from mixing up the two algorithms because both names start with "k".',
      ],
      keyIdea: 'Separate the two by what $k$ counts. In k-NN, $k$ neighbours vote, so labels are needed and it is supervised. In k-means, $k$ clusters are formed, so no labels are needed and it is unsupervised.',
    },
  },
  {
    id: 'classic-algorithms-002',
    subtopic: 'classic-algorithms',
    difficulty: 'foundation',
    stem: 'What is the **Euclidean** distance between the points $(1, 2)$ and $(4, 6)$?',
    options: ['$7$', '$5$', '$25$', '$\\sqrt{7}$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How long is the straight line from $(1, 2)$ to $(4, 6)$?',
      solution:
        '**Euclidean distance** is the straight-line distance between two points, as if you measured it with a ruler. It comes from Pythagoras\' theorem.\n\n' +
        'Find how far apart the points are in each direction. Across: $4 - 1 = 3$. Up: $6 - 2 = 4$.\n\n' +
        'These are the two short sides of a right-angled triangle, and the distance is the long side. Square each one and add: $3^2 + 4^2 = 9 + 16 = 25$.\n\n' +
        'Take the square root to undo the squaring: $\\sqrt{25} = 5$.',
      conclusion: 'The squared differences add up to 25, and its square root is the answer, $5$.',
      whyWrong: [
        'This is $3 + 4 = 7$, the **Manhattan** distance (adding the differences without squaring). The question asks for Euclidean distance.',
        null,
        'This is $3^2 + 4^2 = 25$, the **squared** distance: the final square root was forgotten.',
        'This adds the differences, $3 + 4 = 7$, and then takes the square root. You must square each difference first, then add, then take the root.',
      ],
      keyIdea: 'For Euclidean distance use $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$: subtract, square, add, then take the root. Manhattan distance, by contrast, adds the sizes of the differences with no squaring.',
    },
    check: { optionValues: [7, 5, 25, Math.sqrt(7)], compute: () => Math.sqrt(sqDist([1, 2], [4, 6])) },
  },
  {
    id: 'classic-algorithms-003',
    subtopic: 'classic-algorithms',
    difficulty: 'foundation',
    stem: 'A decision-tree node contains 6 examples of class "Yes" and 2 of class "No". What is its **Gini impurity**?',
    options: ['$0.625$', '$0.25$', '$0.1875$', '$0.375$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How mixed is a group of 6 "Yes" and 2 "No" examples?',
      solution:
        'A **node** in a decision tree is a group of examples at one point in the tree. **Gini impurity** measures how mixed that group is: 0 means all one class, and bigger values mean more mixed.\n\n' +
        'The formula is $\\text{Gini} = 1 - \\sum p_i^2$. Each $p_i$ is the proportion of one class, and $\\sum$ means add up over all the classes.\n\n' +
        'Find the proportions. There are $6 + 2 = 8$ examples. Yes: $\\frac{6}{8} = 0.75$. No: $\\frac{2}{8} = 0.25$.\n\n' +
        'Square each one and add: $0.75^2 + 0.25^2 = 0.5625 + 0.0625 = 0.625$.\n\n' +
        'Subtract from 1: $1 - 0.625 = 0.375$.',
      conclusion: 'The squared proportions add up to 0.625, and 1 minus that gives a Gini impurity of $0.375$.',
      whyWrong: [
        'This is $0.75^2 + 0.25^2 = 0.625$: the squares were added but never subtracted from 1.',
        'This is $1 - 0.75 = 0.25$, the misclassification rate (1 minus the biggest proportion), not the Gini impurity.',
        'This is $0.75 \\times 0.25 = 0.1875$, which is only half of the two-class shortcut $2p(1 - p)$: the factor 2 was forgotten.',
        null,
      ],
      keyIdea: 'For Gini: turn counts into proportions, square each, add them, then subtract from 1. For two classes, the shortcut $2p(1 - p)$, where $p$ is either class\'s proportion, gives the same value.',
    },
    check: { optionValues: [0.625, 0.25, 0.1875, 0.375], compute: () => gini([6, 2]) },
  },
  {
    id: 'classic-algorithms-004',
    subtopic: 'classic-algorithms',
    difficulty: 'foundation',
    stem: 'In k-means, every point has just been assigned to its nearest centroid. What is the **next** step?',
    options: [
      'Move each centroid to the mean of its assigned points',
      'Relabel each point by a vote of its $k$ nearest neighbours',
      'Merge the two clusters with the closest centroids',
      'Move each centroid onto its nearest data point',
    ],
    correctIndex: 0,
    markScheme: {
      asking: 'What does k-means do straight after assigning points to centroids?',
      solution:
        '**k-means** splits data into $k$ groups. Each group has a **centroid**, a point that marks its centre. The algorithm repeats two stages over and over.\n\n' +
        'The first stage is **assign**: each point joins the group of its nearest centroid. The question says this has just happened.\n\n' +
        'Now the centroids may not sit at the centre of their new groups. So the second stage is **update**: work out the average position of each group\'s points, and move the centroid there.',
      conclusion: 'Update always follows assign, so the next step is to Move each centroid to the mean of its assigned points.',
      whyWrong: [
        null,
        'This is how **k-NN** classifies a point. k-means never takes votes; it only uses distances to centroids.',
        'Merging the two closest clusters is **hierarchical** clustering. In k-means the number of clusters stays fixed at $k$.',
        'Moving the centroid onto an actual data point is a different method (k-medoids). In k-means the centroid is the mean, which is usually not one of the data points.',
      ],
      keyIdea: 'Think of the k-means loop as two words: assign, update. Assign uses the nearest distance, and update uses the mean. Votes belong to k-NN, and merging belongs to hierarchical clustering.',
    },
  },
  {
    id: 'classic-algorithms-005',
    subtopic: 'classic-algorithms',
    difficulty: 'foundation',
    stem: 'A node contains 5 examples of "Spam" and 5 of "Not spam". What is its **entropy** $H = -\\sum p_i \\log_2 p_i$, in bits?',
    options: ['$0$', '$0.5$', '$1$', '$2$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How uncertain is a group with 5 of each class, measured in bits?',
      solution:
        '**Entropy** $H$ measures how uncertain a group is. It is 0 when everything is one class, and biggest when the classes are evenly mixed.\n\n' +
        'In the formula, each $p_i$ is the proportion of one class. $\\log_2 p$ asks: 2 to what power gives $p$? The $\\sum$ means add one term per class.\n\n' +
        'Find the proportions. There are 10 examples, so Spam is $\\frac{5}{10} = 0.5$ and Not spam is $\\frac{5}{10} = 0.5$.\n\n' +
        'Find the log. $2^{-1} = \\frac{1}{2} = 0.5$, so $\\log_2 0.5 = -1$.\n\n' +
        'Substitute: $H = -[0.5 \\times (-1) + 0.5 \\times (-1)] = -[-0.5 + (-0.5)] = -[-1] = 1$.',
      conclusion: 'A 50/50 split is as uncertain as two classes can be, and the formula gives $1$ bit.',
      whyWrong: [
        'Entropy is 0 for a **pure** node (all one class). A 50/50 node is the opposite: maximum uncertainty.',
        'This is $1 - 0.5^2 - 0.5^2 = 0.5$, the **Gini** impurity of a 50/50 node, not the entropy.',
        null,
        'This is $-(\\log_2 0.5 + \\log_2 0.5) = 2$: each logarithm must be multiplied by its proportion $p_i = 0.5$ before adding.',
      ],
      keyIdea: 'For entropy, turn counts into proportions, then add up $-p \\log_2 p$ for each class. Two values worth knowing: a pure node gives 0, and a 50/50 split of two classes gives 1.',
    },
    check: { optionValues: [0, 0.5, 1, 2], compute: () => entropy([5, 5]) },
  },
  {
    id: 'classic-algorithms-006',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    stem: 'The decision tree below is applied to each applicant in the table. Which applicants are **approved**?',
    code: {
      lang: 'pseudocode',
      source: src(
        'if income >= 3000',
        '   if debt > 1000',
        '      print("Reject")',
        '   else',
        '      print("Approve")',
        '   end if',
        'else',
        '   if years_employed >= 5',
        '      print("Approve")',
        '   else',
        '      print("Reject")',
        '   end if',
        'end if',
      ),
    },
    table: {
      headers: ['Applicant', 'income', 'debt', 'years_employed'],
      rows: [
        ['Amal', 4000, 500, 1],
        ['Bilal', 3000, 1200, 10],
        ['Chen', 2500, 0, 5],
        ['Dana', 2800, 200, 3],
        ['Eli', 3500, 1000, 2],
      ],
    },
    options: ['Amal and Chen only', 'Amal, Chen and Eli', 'Amal, Bilal, Chen and Eli', 'Amal and Eli only'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which of the five applicants end up at an "Approve" line?',
      solution:
        'A decision tree is a set of nested `if` questions. Line 1 splits applicants by income. Those with at least 3000 go to lines 2 to 6, and the rest go to lines 8 to 12.\n\n' +
        'In the first branch, line 2 rejects a debt **above** 1000. A debt of exactly 1000 isn\'t above 1000, so it goes to the `else` on line 4 and is approved.\n\n' +
        'In the second branch, line 8 approves at least 5 years employed. Exactly 5 counts, because `>=` means greater than or equal to.\n\n' +
        'Now follow each applicant through:\n\n| Applicant | `income >= 3000`? | Next test | Result |\n|---|---|---|---|\n| Amal | 4000: yes | `debt > 1000`? 500: no | Approve |\n| Bilal | 3000: yes | `debt > 1000`? 1200: yes | Reject |\n| Chen | 2500: no | `years_employed >= 5`? 5: yes | Approve |\n| Dana | 2800: no | `years_employed >= 5`? 3: no | Reject |\n| Eli | 3500: yes | `debt > 1000`? 1000: no | Approve |',
      conclusion: 'Only three applicants reach an Approve line, so the answer is Amal, Chen and Eli.',
      whyWrong: [
        'This rejects Eli, which happens if you read "debt > 1000" as $\\ge 1000$. Eli\'s debt is exactly 1000, which is **not** greater than 1000.',
        null,
        'This approves Bilal, which happens if you read "income >= 3000" as $> 3000$. But $3000 \\ge 3000$ is true, so Bilal takes the first branch and is rejected for his debt of 1200.',
        'This rejects Chen, which happens if you read "years_employed >= 5" as $> 5$. Chen has exactly 5 years, and $5 \\ge 5$ is true.',
      ],
      keyIdea: 'Trace each row of data through the tree in a table, one condition at a time. Test any value equal to a limit by its symbol: `>=` includes that value and `>` doesn\'t.',
    },
    check: {
      optionValues: ['Amal,Chen', 'Amal,Chen,Eli', 'Amal,Bilal,Chen,Eli', 'Amal,Eli'],
      compute: () => {
        const rows: [string, number, number, number][] = [
          ['Amal', 4000, 500, 1],
          ['Bilal', 3000, 1200, 10],
          ['Chen', 2500, 0, 5],
          ['Dana', 2800, 200, 3],
          ['Eli', 3500, 1000, 2],
        ];
        const tree = (inc: number, debt: number, yrs: number) => (inc >= 3000 ? debt <= 1000 : yrs >= 5);
        return rows.filter((r) => tree(r[1], r[2], r[3])).map((r) => r[0]).join(',');
      },
    },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'classic-algorithms-007',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    stem: 'The table shows six labelled training points. The point $Q = (3, 4)$ is classified by **k-NN with $k = 3$** using Euclidean distance. What class is predicted?',
    table: {
      headers: ['Point', '$x_1$', '$x_2$', 'Class'],
      rows: [
        ['A', 3, 5, 'Cat'],
        ['B', 4, 5, 'Dog'],
        ['C', 1, 3, 'Dog'],
        ['D', 6, 5, 'Rabbit'],
        ['E', 6, 7, 'Rabbit'],
        ['F', 0, 8, 'Rabbit'],
      ],
    },
    options: ['Cat', 'Dog', 'Rabbit', 'No prediction: the vote is tied'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which class wins a vote among the 3 training points closest to $Q$?',
      solution:
        '**k-NN** (k nearest neighbours) classifies a new point by looking at the $k$ closest training points and taking a majority vote of their classes. Here $k = 3$.\n\n' +
        'We need the distance from $Q = (3, 4)$ to every point. **Euclidean distance** is the straight-line distance: $d = \\sqrt{(x_1 - 3)^2 + (x_2 - 4)^2}$.\n\n' +
        'To compare distances we can skip the square root, because a bigger $d^2$ always means a bigger $d$. So we compare the squared distances:\n\n| Point | Working | $d^2$ | Class |\n|---|---|---|---|\n| A $(3, 5)$ | $0^2 + 1^2$ | 1 | Cat |\n| B $(4, 5)$ | $1^2 + 1^2$ | 2 | Dog |\n| C $(1, 3)$ | $2^2 + 1^2$ | 5 | Dog |\n| D $(6, 5)$ | $3^2 + 1^2$ | 10 | Rabbit |\n| E $(6, 7)$ | $3^2 + 3^2$ | 18 | Rabbit |\n| F $(0, 8)$ | $3^2 + 4^2$ | 25 | Rabbit |\n\n' +
        'The three smallest values are 1, 2 and 5, which belong to points A, B and C. So only A, B and C get a vote.\n\n' +
        'Their classes are Cat, Dog and Dog. That is 2 votes for Dog and 1 for Cat, so Dog wins.',
      conclusion: 'Two of the three nearest points are Dogs, so k-NN predicts Dog.',
      whyWrong: [
        'Cat is the class of the **single** nearest point A. That is the $k = 1$ prediction; with $k = 3$, B and C (both Dog) outvote it.',
        null,
        'Rabbit is the most common class in the **whole** table (3 of 6), but all the Rabbits are far from $Q$. k-NN only lets the $k$ nearest points vote.',
        'A tie (one Cat, one Dog) happens with $k = 2$. With $k = 3$ the third neighbour C is a Dog, which breaks the tie.',
      ],
      keyIdea: 'For k-NN: list the squared distance to every point, sort, keep the $k$ smallest, then count classes among only those. How common a class is across the whole table doesn\'t matter.',
    },
    check: {
      optionValues: ['Cat', 'Dog', 'Rabbit', 'tie'],
      compute: () => {
        const q: Pt = [3, 4];
        const train: [Pt, string][] = [
          [[3, 5], 'Cat'],
          [[4, 5], 'Dog'],
          [[1, 3], 'Dog'],
          [[6, 5], 'Rabbit'],
          [[6, 7], 'Rabbit'],
          [[0, 8], 'Rabbit'],
        ];
        const sorted = [...train].sort((a, b) => sqDist(a[0], q) - sqDist(b[0], q));
        return majority(sorted.slice(0, 3).map((t) => t[1]));
      },
    },
  },
  {
    id: 'classic-algorithms-008',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    stem: 'The table gives the distance from a point $Q$ to seven labelled training points. For which of $k = 1, 3, 5, 7$ does k-NN (majority vote) predict **Blue**?',
    table: {
      headers: ['Point', 'Distance to Q', 'Class'],
      rows: [
        ['P1', '3.0', 'Blue'],
        ['P2', '1.2', 'Blue'],
        ['P3', '2.1', 'Red'],
        ['P4', '0.5', 'Red'],
        ['P5', '3.5', 'Blue'],
        ['P6', '1.4', 'Blue'],
        ['P7', '2.0', 'Red'],
      ],
    },
    options: ['$k = 3$ only', '$k = 1$, $3$, $5$ and $7$', '$k = 7$ only', '$k = 3$ and $k = 7$ only'],
    correctIndex: 3,
    markScheme: {
      asking: 'For which values of $k$ do the Blues win the vote?',
      solution:
        'In **k-NN** (k nearest neighbours), the $k$ closest points vote and the majority class wins. So we need the points in order of distance, not the order they are listed in.\n\n' +
        'Sort from nearest to farthest, and keep a running count of the votes:\n\n| Rank | Point | Distance | Class | Red so far | Blue so far |\n|---|---|---|---|---|---|\n| 1 | P4 | 0.5 | Red | 1 | 0 |\n| 2 | P2 | 1.2 | Blue | 1 | 1 |\n| 3 | P6 | 1.4 | Blue | 1 | 2 |\n| 4 | P7 | 2.0 | Red | 2 | 2 |\n| 5 | P3 | 2.1 | Red | 3 | 2 |\n| 6 | P1 | 3.0 | Blue | 3 | 3 |\n| 7 | P5 | 3.5 | Blue | 3 | 4 |\n\n' +
        'Each value of $k$ reads off its own row. $k = 1$ has Red 1, Blue 0, so Red wins. $k = 5$ has Red 3, Blue 2, so Red wins again.\n\n' +
        '$k = 3$ has Red 1, Blue 2, so Blue wins. $k = 7$ has Red 3, Blue 4, so Blue wins there too.',
      conclusion: 'Blue has the majority only in rows 3 and 7, so the answer is $k = 3$ and $k = 7$ only.',
      whyWrong: [
        'This misses $k = 7$: with $k = 7$ every training point votes, and there are 4 Blues against 3 Reds.',
        'This takes the first $k$ rows of the table **as listed** instead of the $k$ nearest. The rows must be sorted by distance first.',
        'This assumes that small $k$ always follows the nearest point (Red), missing $k = 3$, where the two Blues at 1.2 and 1.4 outvote the single Red at 0.5.',
        null,
      ],
      keyIdea: 'When $k$ varies, sort the points by distance once, then keep a running vote count row by row. The row numbered $k$ gives the result for that $k$, so one table answers every value.',
    },
    check: {
      optionValues: ['3', '1,3,5,7', '7', '3,7'],
      compute: () => {
        const rows: [number, string][] = [
          [3.0, 'Blue'],
          [1.2, 'Blue'],
          [2.1, 'Red'],
          [0.5, 'Red'],
          [3.5, 'Blue'],
          [1.4, 'Blue'],
          [2.0, 'Red'],
        ];
        const sorted = [...rows].sort((a, b) => a[0] - b[0]);
        return [1, 3, 5, 7].filter((k) => majority(sorted.slice(0, k).map((r) => r[1])) === 'Blue').join(',');
      },
    },
  },
  {
    id: 'classic-algorithms-009',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    stem: 'In k-nearest neighbours, which statement about the effect of $k$ is correct?',
    options: [
      'A larger $k$ gives a smoother boundary; too large underfits',
      'A larger $k$ makes the model more likely to overfit',
      'With $k = 1$ the model is least likely to overfit',
      '$k$ is learned by gradient descent during training',
    ],
    correctIndex: 0,
    markScheme: {
      asking: 'How does changing $k$ change the way k-NN behaves?',
      solution:
        '**k-NN** predicts using a vote of the $k$ nearest training points. The **decision boundary** is the line on a chart separating the areas given to each class.\n\n' +
        'With $k = 1$, one neighbour decides everything. A single mislabelled point gets its own little island around it, so the boundary is jagged. Fitting noise like this is called **overfitting**.\n\n' +
        'With a larger $k$, many neighbours vote, so one odd point gets outvoted. The boundary becomes smoother.\n\n' +
        'Take it too far and the vote covers most of the data, so the model just predicts the most common class almost everywhere. Missing real patterns like this is called **underfitting**.',
      conclusion: 'Growing $k$ moves from jagged to over-simple, so the answer is A larger $k$ gives a smoother boundary; too large underfits.',
      whyWrong: [
        null,
        'This is backwards. A larger $k$ makes the model **less** flexible (smoother); it is small $k$, especially $k = 1$, that overfits.',
        'This is backwards. $k = 1$ is the **most** likely to overfit, because a single noisy neighbour decides every prediction.',
        'k-NN has no weights and no training by gradient descent; $k$ is a hyperparameter chosen by hand or with a validation set.',
      ],
      keyIdea: 'Think of $k$ as how many opinions count. Few opinions means noise matters, which is overfitting. Too many means local detail is lost, which is underfitting. $k$ is a setting you choose, usually with a validation set, and training doesn\'t learn it.',
    },
  },
  {
    id: 'classic-algorithms-010',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    stem: 'A k-means cluster contains the points $(1, 2)$, $(3, 8)$ and $(8, 5)$. Where does the update step move its centroid?',
    chart: {
      kind: 'scatter',
      title: 'Points in the cluster',
      xLabel: 'x',
      yLabel: 'y',
      points: [
        { x: 1, y: 2 },
        { x: 3, y: 8 },
        { x: 8, y: 5 },
      ],
    },
    options: ['$(3, 5)$', '$(12, 15)$', '$(4, 5)$', '$(4.5, 5)$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the average position of these three points?',
      solution:
        'In k-means, a **centroid** is the centre of a cluster (a group of points). The **update step** moves it to the mean (average) of all the points in the cluster.\n\n' +
        'We average each coordinate separately. For $x$, add all three values and divide by how many there are: $\\frac{1 + 3 + 8}{3} = \\frac{12}{3} = 4$.\n\n' +
        'Do the same for $y$: $\\frac{2 + 8 + 5}{3} = \\frac{15}{3} = 5$.\n\n' +
        'Put the two averages together to make the new centroid, with $x = 4$ and $y = 5$.',
      conclusion: 'The mean of the $x$ values is 4 and the mean of the $y$ values is 5, so the centroid moves to $(4, 5)$.',
      whyWrong: [
        'This is the **median** of each coordinate ($x$: 1, 3, 8 gives 3; $y$: 2, 5, 8 gives 5). k-means uses the mean.',
        'This is the **sum** of the coordinates, $(1 + 3 + 8, 2 + 8 + 5)$; you must divide by the number of points, 3.',
        null,
        'This is the midpoint of the extremes, $\\left(\\frac{1 + 8}{2}, \\frac{2 + 8}{2}\\right)$, which ignores the middle values. The centroid averages **all** the points.',
      ],
      keyIdea: 'For a centroid update, find the mean of the $x$ values and the mean of the $y$ values separately, using every point in the cluster. The result is usually not one of the data points.',
    },
    check: {
      optionValues: ['3,5', '12,15', '4,5', '4.5,5'],
      compute: () => meanPt([[1, 2], [3, 8], [8, 5]]).join(','),
    },
  },
  {
    id: 'classic-algorithms-011',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    stem: 'k-means with $k = 2$ has centroids $C_1 = (1, 1)$ and $C_2 = (4, 9)$. Using Euclidean distance, which points in the table are assigned to $C_2$?',
    table: {
      headers: ['Point', '$x$', '$y$'],
      rows: [
        ['$P_1$', 2, 3],
        ['$P_2$', 4, 4],
        ['$P_3$', 3, 8],
        ['$P_4$', 0, 6],
      ],
    },
    options: [
      '$P_2$ and $P_3$',
      '$P_3$ and $P_4$',
      '$P_1$ and $P_2$',
      '$P_3$ only',
    ],
    correctIndex: 1,
    markScheme: {
      asking: 'Which of the points are closer to $C_2$ than to $C_1$?',
      solution:
        'In k-means, each point joins its nearest **centroid** (the centre of a group). So each point needs two distances: one to $C_1$ and one to $C_2$.\n\n' +
        '**Euclidean distance** is straight-line distance: square the gap in $x$, square the gap in $y$, add them, then take the square root. To compare, we can skip the root, because a bigger $d^2$ always means a bigger $d$.\n\n' +
        'Work out the squared distances:\n\n| Point | $d^2$ to $C_1 = (1, 1)$ | $d^2$ to $C_2 = (4, 9)$ | Nearer |\n|---|---|---|---|\n| $P_1 = (2, 3)$ | $1^2 + 2^2 = 5$ | $2^2 + 6^2 = 40$ | $C_1$ |\n| $P_2 = (4, 4)$ | $3^2 + 3^2 = 18$ | $0^2 + 5^2 = 25$ | $C_1$ |\n| $P_3 = (3, 8)$ | $2^2 + 7^2 = 53$ | $1^2 + 1^2 = 2$ | $C_2$ |\n| $P_4 = (0, 6)$ | $1^2 + 5^2 = 26$ | $4^2 + 3^2 = 25$ | $C_2$ |\n\n' +
        'Read the last column. $P_4$ is a close call, but 25 is less than 26, so it goes to $C_2$ along with $P_3$.',
      conclusion: 'Only these two points have a smaller squared distance to $C_2$, so the answer is $P_3$ and $P_4$.',
      whyWrong: [
        'This uses **Manhattan** distance ($|\\Delta x| + |\\Delta y|$). For $P_2$ that gives 6 to $C_1$ and 5 to $C_2$, and for $P_4$ it gives 6 and 7, which flips both points. The question says Euclidean.',
        null,
        'These are the points assigned to $C_1$, not $C_2$: the two clusters have been swapped.',
        'This sends $P_4$ to $C_1$. Its squared distances are 26 to $C_1$ and 25 to $C_2$, so it is close, but $C_2$ is nearer.',
      ],
      keyIdea: 'For k-means assignment, draw a table with one column of $d^2$ for each centroid, and give each point to the smaller value. Use squared Euclidean distance: adding the plain gaps (Manhattan distance) can flip close calls.',
    },
    check: {
      optionValues: ['P2,P3', 'P3,P4', 'P1,P2', 'P3'],
      compute: () => {
        const c1: Pt = [1, 1];
        const c2: Pt = [4, 9];
        const pts: Pt[] = [[2, 3], [4, 4], [3, 8], [0, 6]];
        return pts
          .map((p, i) => ({ i, toC2: sqDist(p, c2) < sqDist(p, c1) }))
          .filter((r) => r.toC2)
          .map((r) => `P${r.i + 1}`)
          .join(',');
      },
    },
  },
  {
    id: 'classic-algorithms-012',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    stem: 'A node with 4 "Yes" and 6 "No" examples is split as shown in the table. What is the **weighted Gini impurity** of the split?',
    table: {
      headers: ['Child node', 'Yes', 'No', 'Total'],
      rows: [
        ['Left', 2, 0, 2],
        ['Right', 2, 6, 8],
      ],
    },
    options: ['$0.3$', '$0.1875$', '$0.375$', '$0.48$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the impurity of the split, once each child is weighted by its size?',
      solution:
        '**Gini impurity** measures how mixed a group is: $\\text{Gini} = 1 - \\sum p_i^2$, where $p_i$ is the proportion of each class. A split makes two child groups, so we find each one\'s Gini, then combine them.\n\n' +
        'Left child: 2 Yes and 0 No. It is all one class, so the proportion of Yes is 1, and $\\text{Gini} = 1 - 1^2 = 0$.\n\n' +
        'Right child: 2 Yes and 6 No, total 8. The proportions are $\\frac{2}{8} = 0.25$ and $\\frac{6}{8} = 0.75$. So $\\text{Gini} = 1 - (0.25^2 + 0.75^2) = 1 - (0.0625 + 0.5625) = 1 - 0.625 = 0.375$.\n\n' +
        'The right child holds many more examples, so it should count for more. Each child\'s weight is its share of the 10 examples: Left is $\\frac{2}{10}$ and Right is $\\frac{8}{10}$.\n\n' +
        'Multiply each Gini by its weight and add: $\\frac{2}{10} \\times 0 + \\frac{8}{10} \\times 0.375 = 0.8 \\times 0.375 = 0.3$.',
      conclusion: 'The pure left child adds nothing and the right child contributes $0.8 \\times 0.375$, so the weighted Gini impurity is $0.3$.',
      whyWrong: [
        null,
        'This is the plain average $\\frac{0 + 0.375}{2} = 0.1875$. The children must be weighted by their sizes (2 and 8 out of 10), not counted equally.',
        'This is $0 + 0.375$, the two child impurities added without weights (equivalently, just the right child\'s Gini).',
        'This is the Gini of the **parent** node, $1 - (0.4^2 + 0.6^2) = 0.48$, before the split is made.',
      ],
      keyIdea: 'For weighted Gini: find each child\'s Gini, multiply it by the child\'s size divided by the parent\'s size, then add the results. A lower result means a better split.',
    },
    check: { optionValues: [0.3, 0.1875, 0.375, 0.48], compute: () => weighted([[2, 0], [2, 6]], gini) },
  },
  {
    id: 'classic-algorithms-013',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    stem: 'A node has 3 examples of class "Yes" and 1 of class "No". What is its entropy $H = -\\sum p_i \\log_2 p_i$, to 3 decimal places?',
    options: ['$0.562$', '$0.244$', '$0.375$', '$0.811$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How uncertain is a group of 3 "Yes" and 1 "No", measured by entropy?',
      solution:
        '**Entropy** $H$ measures how uncertain a group is. Each $p_i$ is the proportion of one class, the $\\sum$ means add one term per class, and $\\log_2$ is the logarithm in base 2.\n\n' +
        'Find the proportions. There are $3 + 1 = 4$ examples, so Yes is $\\frac{3}{4} = 0.75$ and No is $\\frac{1}{4} = 0.25$.\n\n' +
        'Find the logs. $\\log_2 0.25 = -2$, because $2^{-2} = \\frac{1}{4}$. For $\\log_2 0.75$ use a calculator, which gives about $-0.415$. With no $\\log_2$ key, use the $\\ln$ key (the natural logarithm) and work out $\\frac{\\ln 0.75}{\\ln 2}$.\n\n' +
        'Work out $-p \\log_2 p$ for each class. Yes: $-0.75 \\times (-0.415) \\approx 0.311$. No: $-0.25 \\times (-2) = 0.5$.\n\n' +
        'Add the two terms: $0.311 + 0.5 = 0.811$.',
      conclusion: 'The two terms add up to an entropy of $0.811$, which sits between 0 for a pure node and 1 for an even split.',
      whyWrong: [
        'This uses the natural log $\\ln$ instead of $\\log_2$: $-(0.75 \\ln 0.75 + 0.25 \\ln 0.25) \\approx 0.562$. Entropy in bits needs base 2.',
        'This uses $\\log_{10}$ (the "log" button) instead of $\\log_2$: $-(0.75 \\log_{10} 0.75 + 0.25 \\log_{10} 0.25) \\approx 0.244$.',
        'This is the **Gini** impurity, $1 - (0.75^2 + 0.25^2) = 0.375$, not the entropy.',
        null,
      ],
      keyIdea: 'For entropy: turn counts into proportions, then add $-p \\log_2 p$ for each class. Use base 2; $\\frac{\\ln p}{\\ln 2}$ works on any calculator. With two classes the answer must lie between 0 and 1.',
    },
    check: { optionValues: [0.562, 0.244, 0.375, 0.811], compute: () => round(entropy([3, 1]), 3) },
  },
  {
    id: 'classic-algorithms-014',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    stem: 'A 1-NN classifier uses **Manhattan** distance $d = |x_1 - x_2| + |y_1 - y_2|$. Which training point in the table is nearest to $(2, 1)$?',
    table: {
      headers: ['Training point', '$x$', '$y$'],
      rows: [
        ['P', 5, 4],
        ['R', 0, 5],
        ['T', 7, 1],
        ['S', 3, 6],
      ],
    },
    options: ['$P = (5, 4)$', '$R = (0, 5)$', '$T = (7, 1)$', '$S = (3, 6)$'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which point is closest to $(2, 1)$ when distance means across plus up?',
      solution:
        '**1-NN** just means we find the single nearest training point. The distance used here is **Manhattan distance**: how far across plus how far up, like walking along city blocks.\n\n' +
        'The bars in the formula mean absolute value: take the size of the number and ignore any minus sign. So the gap from 2 to 0 is 2, even though $0 - 2$ is $-2$.\n\n' +
        'Find the distance from $(2, 1)$ to each point:\n\n| Point | Gap across | Gap up | Total |\n|---|---|---|---|\n| P $(5, 4)$ | 3 | 3 | 6 |\n| R $(0, 5)$ | 2 | 4 | 6 |\n| T $(7, 1)$ | 5 | 0 | 5 |\n| S $(3, 6)$ | 1 | 5 | 6 |\n\n' +
        'The smallest total is 5, and it belongs to T. T looks far away across, but it has no gap at all going up.',
      conclusion: 'T is 5 away and the others are all 6 away, so the nearest is $T = (7, 1)$.',
      whyWrong: [
        'P is the nearest by **Euclidean** distance ($\\sqrt{3^2 + 3^2} \\approx 4.24$). With Manhattan distance P is at $3 + 3 = 6$, further than T at 5.',
        'This forgets the absolute values: $(0 - 2) + (5 - 1) = 2$ looks small only because a negative difference cancelled a positive one. The true Manhattan distance is $2 + 4 = 6$.',
        null,
        'This compares only the $x$-coordinates (S is only 1 away in $x$) and ignores the $y$-difference of 5, giving a total of $1 + 5 = 6$.',
      ],
      keyIdea: 'For Manhattan distance, add the size of the $x$ gap and the size of the $y$ gap, with no squaring or roots. Use a table with one row per point. The nearest point can differ from the Euclidean one, so use the distance named.',
    },
    check: {
      optionValues: ['P', 'R', 'T', 'S'],
      compute: () => {
        const q: Pt = [2, 1];
        const pts: [string, Pt][] = [['P', [5, 4]], ['R', [0, 5]], ['T', [7, 1]], ['S', [3, 6]]];
        const man = (p: Pt) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]);
        return [...pts].sort((a, b) => man(a[1]) - man(b[1]))[0][0];
      },
    },
  },
  {
    id: 'classic-algorithms-015',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    stem: 'Arrays are indexed from 1. `C` holds the class counts of a decision-tree node. What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: src(
        'C = [2, 1, 1]',
        'n = 4',
        'total = 0',
        'for i = 1 to 3',
        '   p = C[i] / n',
        '   total = total + p * p',
        'end for',
        'print(1 - total)',
      ),
    },
    options: [
      '$0.625$',
      '$0.375$',
      '$0.5$',
      '$0.6667$',
    ],
    correctIndex: 0,
    markScheme: {
      asking: 'What number does the code print after going through the class counts?',
      solution:
        '`C` holds how many examples of each class the node has: 2, 1 and 1. `n` on line 2 is the total, 4. `total` on line 3 starts at 0.\n\n' +
        'The loop on lines 4 to 7 runs with `i` as 1, 2 and 3, visiting each class once. Arrays start at 1, so `C[1]` is 2, `C[2]` is 1 and `C[3]` is 1.\n\n' +
        'Line 5 works out `p`, the proportion of that class. Line 6 adds `p` squared to `total`:\n\n| `i` | `C[i]` | `p` | `p * p` | `total` after line 6 |\n|---|---|---|---|---|\n| 1 | 2 | $\\frac{2}{4} = 0.5$ | 0.25 | 0.25 |\n| 2 | 1 | $\\frac{1}{4} = 0.25$ | 0.0625 | 0.3125 |\n| 3 | 1 | $\\frac{1}{4} = 0.25$ | 0.0625 | 0.375 |\n\n' +
        'Line 8 prints `1 - total`, not `total` itself: $1 - 0.375 = 0.625$. This calculation is the Gini impurity of the node, a measure of how mixed it is.',
      conclusion: 'The squared proportions add up to 0.375, and line 8 subtracts that from 1, so the code prints $0.625$.',
      whyWrong: [
        null,
        'This is `total`, the sum of the squared proportions. The last line prints `1 - total`.',
        'This is one minus the **largest** proportion, $1 - 0.5$ (the misclassification rate), which is not what the code computes.',
        'This is $1 - 3 \\times \\left(\\frac{1}{3}\\right)^2$, which treats the three classes as equally common. The code uses the real counts 2, 1 and 1.',
      ],
      keyIdea: 'Spot the formula in the code. A loop adding `p * p`, followed by `1 - total`, is Gini impurity, $1 - \\sum p_i^2$. Trace `total` in a table, then look at exactly what the last line prints.',
    },
    check: {
      optionValues: [0.625, 0.375, 0.5, 0.6667],
      compute: () => round(gini([2, 1, 1]), 4),
    },
  },

  // ---------------------------------------------------------------- recall
  {
    id: 'classic-algorithms-021',
    subtopic: 'classic-algorithms',
    difficulty: 'foundation',
    stem: 'In k-means, what does $k$ stand for?',
    options: ['The number of clusters', 'The number of neighbours', 'The number of features', 'The number of iterations'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does the $k$ in k-means count?',
      solution:
        '**k-means** is a method that sorts unlabelled data into groups. Each group is called a **cluster**.\n\n' +
        'You choose $k$ before it starts, and it decides how many groups get made. If $k = 3$, the method makes 3 clusters.',
      conclusion: 'You set $k$ to how many groups you want, so it is The number of clusters.',
      whyWrong: [
        null,
        'The number of neighbours is what $k$ means in **k-NN**, a different algorithm.',
        'The number of features is fixed by the data, whatever value of $k$ is chosen.',
        'The number of iterations is not fixed in advance: the algorithm repeats until the assignments stop changing.',
      ],
      keyIdea: 'Don\'t mix up the two k\'s. In k-means, $k$ is the number of clusters (groups). In k-NN, $k$ is the number of neighbours that vote.',
    },
  },
  {
    id: 'classic-algorithms-022',
    subtopic: 'classic-algorithms',
    difficulty: 'foundation',
    stem: 'What is the Gini impurity of a **pure** node (all examples in one class)?',
    options: ['$0$', '$1$', '$0.5$', '$-1$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the Gini impurity when every example is in the same class?',
      solution:
        '**Gini impurity** measures how mixed a group is, using $\\text{Gini} = 1 - \\sum p_i^2$. Each $p_i$ is the proportion of one class, and $\\sum$ means add up over all the classes.\n\n' +
        'In a **pure** node all the examples are in one class, so that class has a proportion of 1. Any other class would have a proportion of 0 and add nothing.\n\n' +
        'Substitute: $\\text{Gini} = 1 - 1^2 = 1 - 1 = 0$.',
      conclusion: 'No mixing at all means zero impurity, so the answer is $0$.',
      whyWrong: [
        null,
        'This is $\\sum p_i^2 = 1$, the sum of the squared proportions, which still has to be subtracted from 1.',
        'This is the Gini impurity of a 50/50 node of two classes, the **most** mixed case, not the pure one.',
        'Gini impurity is never negative, because $\\sum p_i^2$ is never more than 1.',
      ],
      keyIdea: 'Learn the two ends of the scale. A pure node has a Gini of 0. An even split of two classes has a Gini of 0.5, the largest possible with two classes. Impurity can\'t be negative.',
    },
    check: { optionValues: [0, 1, 0.5, -1], compute: () => gini([8, 0]) },
  },
  {
    id: 'classic-algorithms-023',
    subtopic: 'classic-algorithms',
    difficulty: 'foundation',
    stem: 'Which of these is an **unsupervised** method?',
    options: ['k-means', 'k-nearest neighbours', 'Decision tree', 'Logistic regression'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which of these methods learns without being given labels?',
      solution:
        '**Unsupervised** means the data has no labels, so no right answers are attached. The method has to find structure on its own.\n\n' +
        'Three of these all learn from labels. k-NN votes using its neighbours\' labels. A decision tree picks splits that separate the labels. Logistic regression is fitted to labelled examples.\n\n' +
        'k-means only uses the positions of the points, grouping nearby ones into clusters. It never sees a label.',
      conclusion: 'It is the only one that needs no labels, so the answer is k-means.',
      whyWrong: [
        null,
        'k-NN classifies by a vote of the **labels** of nearby training points, so it is supervised.',
        'A decision tree is built by choosing splits that separate the **labels**, so it is supervised.',
        'Logistic regression is fitted to labelled examples of each class, so it is supervised.',
      ],
      keyIdea: 'Ask whether the method needs the right answers during training. If yes, it is supervised: k-NN, decision trees, linear and logistic regression. If no, it is unsupervised: k-means and other clustering.',
    },
  },
];
