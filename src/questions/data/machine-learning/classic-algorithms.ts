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
    stem:
      'Which of the following is TRUE about k-nearest neighbours (k-NN) and k-means?\n\n' +
      'A. k-NN is a **supervised** method: it needs labelled training data to classify a new point.\n\n' +
      'B. k-means is an **unsupervised** method: it groups unlabelled data into $k$ clusters.',
    options: ['A only', 'B only', 'Both A and B', 'None of the above'],
    correctIndex: 2,
    fixedOrder: true,
    markScheme: {
      solution:
        '**Statement A is true.** k-NN classifies a new point by looking at the $k$ closest training points and taking a majority vote of **their labels**. Without labels there would be nothing to vote on, so k-NN is supervised.\n\n' +
        '**Statement B is true.** k-means is given points with **no labels** and invents $k$ groups (clusters) by repeatedly assigning each point to its nearest centroid and moving each centroid to the mean of its points. Finding structure without labels is unsupervised learning.\n\n' +
        'Both statements are true. Watch out: the two "k"s mean different things. In k-NN, $k$ is the number of neighbours that vote; in k-means, $k$ is the number of clusters.',
      whyWrong: [
        'A is true, but B is also true: k-means uses no labels at all, which is exactly what unsupervised means.',
        'B is true, but A is also true: k-NN votes using the labels of the training points, so it is supervised.',
        null,
        'Both statements are correct descriptions. This choice usually comes from mixing up the two algorithms because both names start with "k".',
      ],
      keyIdea: 'k-NN is supervised classification (k = number of neighbours); k-means is unsupervised clustering (k = number of clusters).',
    },
  },
  {
    id: 'classic-algorithms-002',
    subtopic: 'classic-algorithms',
    difficulty: 'foundation',
    stem: 'A k-NN classifier uses **Euclidean** distance. What is the distance between the points $(1, 2)$ and $(4, 6)$?',
    options: ['$7$', '$5$', '$25$', '$\\sqrt{7}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Euclidean distance is the straight-line distance (Pythagoras):\n\n' +
        '$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$\n\n' +
        'Differences: $4 - 1 = 3$ and $6 - 2 = 4$.\n\n' +
        'Square and add: $3^2 + 4^2 = 9 + 16 = 25$.\n\n' +
        'Square root: $d = \\sqrt{25} = 5$.',
      whyWrong: [
        'This is $3 + 4 = 7$, the **Manhattan** distance (adding the differences without squaring). The question asks for Euclidean distance.',
        null,
        'This is $3^2 + 4^2 = 25$, the **squared** distance: the final square root was forgotten.',
        'This adds the differences, $3 + 4 = 7$, and then takes the square root. You must square each difference first, then add, then take the root.',
      ],
      keyIdea: 'Euclidean distance: subtract, square, add, then square root.',
    },
    check: { optionValues: [7, 5, 25, Math.sqrt(7)], compute: () => Math.sqrt(sqDist([1, 2], [4, 6])) },
  },
  {
    id: 'classic-algorithms-003',
    subtopic: 'classic-algorithms',
    difficulty: 'foundation',
    stem: 'A node in a decision tree contains 8 training examples: 6 of class "Yes" and 2 of class "No". What is the **Gini impurity** of this node?',
    options: ['$0.625$', '$0.25$', '$0.1875$', '$0.375$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Gini impurity is $G = 1 - \\sum p_i^2$, where $p_i$ is the proportion of each class in the node.\n\n' +
        'Proportions: $p_{\\text{Yes}} = \\frac{6}{8} = 0.75$ and $p_{\\text{No}} = \\frac{2}{8} = 0.25$.\n\n' +
        'Squares: $0.75^2 = 0.5625$ and $0.25^2 = 0.0625$, which add to $0.625$.\n\n' +
        '$$G = 1 - 0.625 = 0.375$$\n\n' +
        'Check with the two-class shortcut $G = 2p(1 - p) = 2 \\times 0.75 \\times 0.25 = 0.375$.',
      whyWrong: [
        'This is $0.75^2 + 0.25^2 = 0.625$: the squares were added but never subtracted from 1.',
        'This is $1 - 0.75 = 0.25$, the misclassification rate (1 minus the biggest proportion), not the Gini impurity.',
        'This is $0.75 \\times 0.25 = 0.1875$, which is only half of the two-class shortcut $2p(1 - p)$: the factor 2 was forgotten.',
        null,
      ],
      keyIdea: 'Gini impurity is 1 minus the sum of the squared class proportions; 0 means pure, 0.5 is the worst for two classes.',
    },
    check: { optionValues: [0.625, 0.25, 0.1875, 0.375], compute: () => gini([6, 2]) },
  },
  {
    id: 'classic-algorithms-004',
    subtopic: 'classic-algorithms',
    difficulty: 'foundation',
    stem: 'In the k-means clustering algorithm, every point has just been assigned to its nearest centroid. What is the **next** step?',
    options: [
      'Each centroid is moved to the mean (average position) of the points assigned to it',
      'Each point is relabelled by a majority vote of its $k$ nearest neighbours',
      'The two clusters whose centroids are closest are merged into one cluster',
      'Each centroid is moved onto the single data point that is nearest to it',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'k-means repeats two steps until nothing changes:\n\n' +
        '1. **Assignment step:** give each point to its nearest centroid.\n' +
        '2. **Update step:** move each centroid to the **mean** of the points assigned to it (average the $x$-coordinates and average the $y$-coordinates).\n\n' +
        'The question says step 1 has just finished, so the next step is the update step. The algorithm then goes back to step 1, and stops when the assignments no longer change (the algorithm has **converged**).',
      whyWrong: [
        null,
        'This is how **k-NN** classifies a point. k-means never takes votes; it only uses distances to centroids.',
        'Merging the two closest clusters is **hierarchical** clustering. In k-means the number of clusters stays fixed at $k$.',
        'Moving the centroid onto an actual data point is a different method (k-medoids). In k-means the centroid is the mean, which is usually not one of the data points.',
      ],
      keyIdea: 'k-means alternates: assign each point to its nearest centroid, then move each centroid to the mean of its points.',
    },
  },
  {
    id: 'classic-algorithms-005',
    subtopic: 'classic-algorithms',
    difficulty: 'foundation',
    stem: 'A node contains 5 examples of class "Spam" and 5 examples of class "Not spam". What is its **entropy** $H = -\\sum p_i \\log_2 p_i$ (in bits)?',
    options: ['$0$', '$0.5$', '$1$', '$2$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Proportions: $p_1 = \\frac{5}{10} = 0.5$ and $p_2 = 0.5$.\n\n' +
        'Each class contributes $-0.5 \\log_2 0.5$. Since $\\log_2 0.5 = -1$, each contribution is $-0.5 \\times (-1) = 0.5$.\n\n' +
        '$$H = 0.5 + 0.5 = 1$$\n\n' +
        'A 50/50 split of two classes is the **most** uncertain a two-class node can be, so its entropy is the maximum, 1 bit.',
      whyWrong: [
        'Entropy is 0 for a **pure** node (all one class). A 50/50 node is the opposite: maximum uncertainty.',
        'This is $1 - 0.5^2 - 0.5^2 = 0.5$, the **Gini** impurity of a 50/50 node, not the entropy.',
        null,
        'This is $-(\\log_2 0.5 + \\log_2 0.5) = 2$: each logarithm must be multiplied by its proportion $p_i = 0.5$ before adding.',
      ],
      keyIdea: 'Entropy is 0 for a pure node and 1 bit for a 50/50 two-class node.',
    },
    check: { optionValues: [0, 0.5, 1, 2], compute: () => entropy([5, 5]) },
  },
  {
    id: 'classic-algorithms-006',
    subtopic: 'classic-algorithms',
    difficulty: 'foundation',
    stem:
      'A bank uses the decision tree below to decide on loan applications. Five applicants are listed in the table (income and debt in AED). Which applicants are **approved**?',
    code: {
      lang: 'pseudocode',
      source: src(
        'IF income >= 3000 THEN',
        '    IF debt > 1000 THEN',
        '        predict "Reject"',
        '    ELSE',
        '        predict "Approve"',
        'ELSE',
        '    IF years_employed >= 5 THEN',
        '        predict "Approve"',
        '    ELSE',
        '        predict "Reject"',
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
      solution:
        'Follow the tree from the top for each applicant. Watch the boundary values carefully: $\\ge$ includes the boundary, $>$ does not.\n\n' +
        '| Applicant | income $\\ge 3000$? | next test | result |\n' +
        '|---|---|---|---|\n' +
        '| Amal | 4000: yes | debt 500 $> 1000$? no | Approve |\n' +
        '| Bilal | 3000: yes (equal counts) | debt 1200 $> 1000$? yes | Reject |\n' +
        '| Chen | 2500: no | years 5 $\\ge 5$? yes | Approve |\n' +
        '| Dana | 2800: no | years 3 $\\ge 5$? no | Reject |\n' +
        '| Eli | 3500: yes | debt 1000 $> 1000$? no (equal does not count) | Approve |\n\n' +
        'Approved: Amal, Chen and Eli.',
      whyWrong: [
        'This rejects Eli, which happens if you read "debt > 1000" as $\\ge 1000$. Eli\'s debt is exactly 1000, which is **not** greater than 1000.',
        null,
        'This approves Bilal, which happens if you read "income >= 3000" as $> 3000$: Bilal (income exactly 3000) is then sent to the ELSE branch, where his 10 years of employment approve him. But $3000 \\ge 3000$ is true, so Bilal goes into the first branch and is rejected because his debt of 1200 is over 1000.',
        'This rejects Chen, which happens if you read "years_employed >= 5" as $> 5$. Chen has exactly 5 years, and $5 \\ge 5$ is true.',
      ],
      keyIdea: 'A decision tree is a chain of if-tests: follow one branch per test, and treat boundary values exactly as the comparison sign says.',
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
    stem: 'The table shows six labelled training points. A new point $Q = (3, 4)$ is classified by **k-NN with $k = 3$**, using Euclidean distance. What class is predicted for $Q$?',
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
      solution:
        'Find the distance from $Q = (3, 4)$ to every training point. (Comparing **squared** distances gives the same order and avoids square roots.)\n\n' +
        '| Point | $d^2$ | $d$ | Class |\n' +
        '|---|---|---|---|\n' +
        '| A $(3, 5)$ | $0^2 + 1^2 = 1$ | $1$ | Cat |\n' +
        '| B $(4, 5)$ | $1^2 + 1^2 = 2$ | $\\approx 1.41$ | Dog |\n' +
        '| C $(1, 3)$ | $2^2 + 1^2 = 5$ | $\\approx 2.24$ | Dog |\n' +
        '| D $(6, 5)$ | $3^2 + 1^2 = 10$ | $\\approx 3.16$ | Rabbit |\n' +
        '| E $(6, 7)$ | $3^2 + 3^2 = 18$ | $\\approx 4.24$ | Rabbit |\n' +
        '| F $(0, 8)$ | $3^2 + 4^2 = 25$ | $5$ | Rabbit |\n\n' +
        'The 3 nearest are A (Cat), B (Dog) and C (Dog). The vote is Dog 2, Cat 1, so k-NN predicts **Dog**.',
      whyWrong: [
        'Cat is the class of the **single** nearest point A. That is the $k = 1$ prediction; with $k = 3$, B and C (both Dog) outvote it.',
        null,
        'Rabbit is the most common class in the **whole** table (3 of 6), but all the Rabbits are far from $Q$. k-NN only lets the $k$ nearest points vote.',
        'A tie (one Cat, one Dog) happens with $k = 2$. With $k = 3$ the third neighbour C is a Dog, which breaks the tie.',
      ],
      keyIdea: 'k-NN: compute the distance to every training point, keep the k smallest, and take a majority vote of their labels.',
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
    stem:
      'The table gives the distance from a new point $Q$ to each of seven labelled training points. Q is classified by k-NN (majority vote). For which of the values $k = 1, 3, 5, 7$ is the prediction **Blue**?',
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
      solution:
        'The table is **not** in distance order, so sort it first:\n\n' +
        '| Rank | Point | Distance | Class |\n' +
        '|---|---|---|---|\n' +
        '| 1 | P4 | 0.5 | Red |\n' +
        '| 2 | P2 | 1.2 | Blue |\n' +
        '| 3 | P6 | 1.4 | Blue |\n' +
        '| 4 | P7 | 2.0 | Red |\n' +
        '| 5 | P3 | 2.1 | Red |\n' +
        '| 6 | P1 | 3.0 | Blue |\n' +
        '| 7 | P5 | 3.5 | Blue |\n\n' +
        '- $k = 1$: Red. Prediction **Red**.\n' +
        '- $k = 3$: Red, Blue, Blue. Blue wins 2 to 1. Prediction **Blue**.\n' +
        '- $k = 5$: Red, Blue, Blue, Red, Red. Red wins 3 to 2. Prediction **Red**.\n' +
        '- $k = 7$: all seven points vote, Blue wins 4 to 3. Prediction **Blue**.\n\n' +
        'So the prediction is Blue for $k = 3$ and $k = 7$ only. Notice that the prediction can flip back and forth as $k$ grows.',
      whyWrong: [
        'This misses $k = 7$: with $k = 7$ every training point votes, and there are 4 Blues against 3 Reds.',
        'This takes the first $k$ rows of the table **as listed** instead of the $k$ nearest. The rows must be sorted by distance first.',
        'This assumes that small $k$ always follows the nearest point (Red), missing $k = 3$, where the two Blues at 1.2 and 1.4 outvote the single Red at 0.5.',
        null,
      ],
      keyIdea: 'Sort by distance before choosing the k nearest; the k-NN prediction can change (even flip back) as k changes.',
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
    stem: 'In k-nearest neighbours, which statement about the effect of the value of $k$ is correct?',
    options: [
      'A larger $k$ averages over more neighbours, so the decision boundary becomes smoother and less sensitive to noisy points; if $k$ is too large the model underfits',
      'A larger $k$ makes the model more flexible, so it becomes more likely to overfit the training data',
      'With $k = 1$ the model is least likely to overfit, because each prediction uses only one neighbour',
      'The value of $k$ is learned automatically by gradient descent during training',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        '- With **$k = 1$**, each prediction copies the label of one single neighbour. One mislabelled or unusual training point creates its own little island in the decision boundary, so the model follows noise: it **overfits** (low bias, high variance). It even scores 100% on its own training data, because every training point is its own nearest neighbour (unless identical points carry different labels).\n' +
        '- As **$k$ grows**, each prediction is a vote over more points, so single noisy points are outvoted and the boundary becomes **smoother**.\n' +
        '- If $k$ gets **too large** (in the extreme, $k$ = number of training points), every query gets the same answer, the overall majority class: the model **underfits**.\n\n' +
        '$k$ is a **hyperparameter**: it is chosen by the person building the model, usually by trying several values on a validation set (for two classes, an odd $k$ avoids tied votes).',
      whyWrong: [
        null,
        'This is backwards. A larger $k$ makes the model **less** flexible (smoother); it is small $k$, especially $k = 1$, that overfits.',
        'This is backwards. $k = 1$ is the **most** likely to overfit, because a single noisy neighbour decides every prediction.',
        'k-NN has no weights and no training by gradient descent; $k$ is a hyperparameter chosen by hand or with a validation set.',
      ],
      keyIdea: 'Small k: jagged boundary, overfitting; large k: smooth boundary, eventually underfitting; k is a hyperparameter tuned on validation data.',
    },
  },
  {
    id: 'classic-algorithms-010',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    stem: 'During k-means, one cluster contains the three points $(1, 2)$, $(3, 8)$ and $(8, 5)$ (shown in the scatter plot). Where is this cluster\'s centroid moved to in the update step?',
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
      solution:
        'The new centroid is the **mean** of the points in the cluster: average the $x$-coordinates and the $y$-coordinates separately.\n\n' +
        '$$\\bar{x} = \\frac{1 + 3 + 8}{3} = \\frac{12}{3} = 4$$\n\n' +
        '$$\\bar{y} = \\frac{2 + 8 + 5}{3} = \\frac{15}{3} = 5$$\n\n' +
        'New centroid: $(4, 5)$.',
      whyWrong: [
        'This is the **median** of each coordinate ($x$: 1, 3, 8 gives 3; $y$: 2, 5, 8 gives 5). k-means uses the mean.',
        'This is the **sum** of the coordinates, $(1 + 3 + 8, 2 + 8 + 5)$; you must divide by the number of points, 3.',
        null,
        'This is the midpoint of the extremes, $\\left(\\frac{1 + 8}{2}, \\frac{2 + 8}{2}\\right)$, which ignores the middle values. The centroid averages **all** the points.',
      ],
      keyIdea: 'A k-means centroid is the mean of its points: average each coordinate separately.',
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
    stem:
      'k-means with $k = 2$ currently has centroids $C_1 = (1, 1)$ and $C_2 = (4, 9)$. In the assignment step, each point in the table goes to its nearest centroid using **Euclidean** distance. Which points are assigned to $C_2$?',
    table: {
      headers: ['Point', '$x$', '$y$'],
      rows: [
        ['$P_1$', 2, 3],
        ['$P_2$', 4, 4],
        ['$P_3$', 3, 8],
        ['$P_4$', 6, 2],
        ['$P_5$', 5, 7],
        ['$P_6$', 0, 6],
      ],
    },
    options: [
      '$P_2$, $P_3$ and $P_5$',
      '$P_3$, $P_5$ and $P_6$',
      '$P_1$, $P_2$ and $P_4$',
      '$P_2$, $P_3$, $P_4$ and $P_5$',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Compare **squared** Euclidean distances (same order as the real distances, no square roots needed).\n\n' +
        '| Point | $d^2$ to $C_1 = (1, 1)$ | $d^2$ to $C_2 = (4, 9)$ | nearest |\n' +
        '|---|---|---|---|\n' +
        '| $P_1 = (2, 3)$ | $1 + 4 = 5$ | $4 + 36 = 40$ | $C_1$ |\n' +
        '| $P_2 = (4, 4)$ | $9 + 9 = 18$ | $0 + 25 = 25$ | $C_1$ |\n' +
        '| $P_3 = (3, 8)$ | $4 + 49 = 53$ | $1 + 1 = 2$ | $C_2$ |\n' +
        '| $P_4 = (6, 2)$ | $25 + 1 = 26$ | $4 + 49 = 53$ | $C_1$ |\n' +
        '| $P_5 = (5, 7)$ | $16 + 36 = 52$ | $1 + 4 = 5$ | $C_2$ |\n' +
        '| $P_6 = (0, 6)$ | $1 + 25 = 26$ | $16 + 9 = 25$ | $C_2$ |\n\n' +
        '$P_6$ is a close call ($25 < 26$), and $P_2$ goes to $C_1$ ($18 < 25$).\n\n' +
        'Assigned to $C_2$: $P_3$, $P_5$ and $P_6$.',
      whyWrong: [
        'This uses **Manhattan** distance ($|\\Delta x| + |\\Delta y|$). For $P_2$ that gives 6 to $C_1$ and 5 to $C_2$, and for $P_6$ it gives 6 and 7, which flips both points. The question says Euclidean: $P_2$ has $18 < 25$ (so $C_1$) and $P_6$ has $25 < 26$ (so $C_2$).',
        null,
        'These are the points assigned to $C_1$, not $C_2$: the two clusters have been swapped.',
        'This compares only the $x$-coordinates (each point goes to whichever of $x = 1$ and $x = 4$ is closer). Euclidean distance must use both coordinates.',
      ],
      keyIdea: 'In the k-means assignment step each point joins the centroid with the smallest distance; comparing squared distances is quicker and gives the same result.',
    },
    check: {
      optionValues: ['P2,P3,P5', 'P3,P5,P6', 'P1,P2,P4', 'P2,P3,P4,P5'],
      compute: () => {
        const c1: Pt = [1, 1];
        const c2: Pt = [4, 9];
        const pts: Pt[] = [[2, 3], [4, 4], [3, 8], [6, 2], [5, 7], [0, 6]];
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
    stem:
      'A decision-tree node has 4 "Yes" and 6 "No" examples. A split sends them into two child nodes as shown in the table. What is the **weighted Gini impurity** of the split?',
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
      solution:
        '**Step 1: Gini of each child**, using $G = 1 - \\sum p_i^2$.\n\n' +
        '- Left: 2 Yes, 0 No, so it is pure: $G_L = 1 - 1^2 = 0$.\n' +
        '- Right: $p_{\\text{Yes}} = \\frac{2}{8} = 0.25$, $p_{\\text{No}} = \\frac{6}{8} = 0.75$, so $G_R = 1 - (0.0625 + 0.5625) = 0.375$.\n\n' +
        '**Step 2: weight each child by its share of the 10 examples.**\n\n' +
        '$$G_{\\text{split}} = \\frac{2}{10} \\times 0 + \\frac{8}{10} \\times 0.375 = 0 + 0.3 = 0.3$$\n\n' +
        '(For comparison, the parent has $G = 1 - (0.4^2 + 0.6^2) = 0.48$, so the split lowers the impurity by $0.18$.)',
      whyWrong: [
        null,
        'This is the plain average $\\frac{0 + 0.375}{2} = 0.1875$. The children must be weighted by their sizes (2 and 8 out of 10), not counted equally.',
        'This is $0 + 0.375$, the two child impurities added without weights (equivalently, just the right child\'s Gini).',
        'This is the Gini of the **parent** node, $1 - (0.4^2 + 0.6^2) = 0.48$, before the split is made.',
      ],
      keyIdea: 'The impurity of a split is the size-weighted average of the child impurities.',
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
      solution:
        'Proportions: $p_{\\text{Yes}} = \\frac{3}{4} = 0.75$ and $p_{\\text{No}} = \\frac{1}{4} = 0.25$.\n\n' +
        'Logs (on a calculator, $\\log_2 x = \\frac{\\ln x}{\\ln 2}$):\n\n' +
        '- $\\log_2 0.75 \\approx -0.4150$\n' +
        '- $\\log_2 0.25 = -2$\n\n' +
        '$$H = -(0.75 \\times (-0.4150) + 0.25 \\times (-2)) = 0.3113 + 0.5 = 0.8113$$\n\n' +
        'To 3 decimal places, $H = 0.811$ bits. (It is below 1 because the node is not a 50/50 mix, and above 0 because it is not pure.)',
      whyWrong: [
        'This uses the natural log $\\ln$ instead of $\\log_2$: $-(0.75 \\ln 0.75 + 0.25 \\ln 0.25) \\approx 0.562$. Entropy in bits needs base 2.',
        'This uses $\\log_{10}$ (the "log" button) instead of $\\log_2$: $-(0.75 \\log_{10} 0.75 + 0.25 \\log_{10} 0.25) \\approx 0.244$.',
        'This is the **Gini** impurity, $1 - (0.75^2 + 0.25^2) = 0.375$, not the entropy.',
        null,
      ],
      keyIdea: 'Entropy uses base-2 logs: multiply each proportion by its log, add, and change the sign.',
    },
    check: { optionValues: [0.562, 0.244, 0.375, 0.811], compute: () => round(entropy([3, 1]), 3) },
  },
  {
    id: 'classic-algorithms-014',
    subtopic: 'classic-algorithms',
    difficulty: 'exam',
    stem:
      'A 1-NN classifier uses **Manhattan** distance $d = |x_1 - x_2| + |y_1 - y_2|$. Which training point in the table is the nearest neighbour of the query point $(2, 1)$?',
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
      solution:
        'Manhattan distance adds the absolute differences ("city-block" distance: how far you walk along a grid of streets).\n\n' +
        '| Point | $\\lvert \\Delta x \\rvert$ | $\\lvert \\Delta y \\rvert$ | Manhattan $d$ |\n' +
        '|---|---|---|---|\n' +
        '| P $(5, 4)$ | 3 | 3 | 6 |\n' +
        '| R $(0, 5)$ | 2 | 4 | 6 |\n' +
        '| T $(7, 1)$ | 5 | 0 | 5 |\n' +
        '| S $(3, 6)$ | 1 | 5 | 6 |\n\n' +
        'The smallest is T with $d = 5$, so T is the nearest neighbour.\n\n' +
        'Note: with Euclidean distance P would win ($\\sqrt{18} \\approx 4.24$ against $5$ for T). The choice of distance measure can change the k-NN answer.',
      whyWrong: [
        'P is the nearest by **Euclidean** distance ($\\sqrt{3^2 + 3^2} \\approx 4.24$). With Manhattan distance P is at $3 + 3 = 6$, further than T at 5.',
        'This forgets the absolute values: $(0 - 2) + (5 - 1) = 2$ looks small only because a negative difference cancelled a positive one. The true Manhattan distance is $2 + 4 = 6$.',
        null,
        'This compares only the $x$-coordinates (S is only 1 away in $x$) and ignores the $y$-difference of 5, giving a total of $1 + 5 = 6$.',
      ],
      keyIdea: 'Manhattan distance is the sum of the absolute coordinate differences, and it can rank neighbours differently from Euclidean distance.',
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
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: src(
        'def gini(labels):',
        '    n = len(labels)',
        '    total = 0',
        '    for c in set(labels):',
        '        p = labels.count(c) / n',
        '        total += p * p',
        '    return 1 - total',
        '',
        "print(round(gini(['a', 'a', 'b', 'b', 'b', 'c']), 4))",
      ),
    },
    options: ['`0.6111`', '`0.3889`', '`0.5`', '`0.6667`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The function computes the Gini impurity $1 - \\sum p_i^2$ of a list of labels. The list has $n = 6$ labels. `set(labels)` gives each distinct class once.\n\n' +
        '| class `c` | `labels.count(c)` | `p` | `p * p` |\n' +
        '|---|---|---|---|\n' +
        '| a | 2 | $\\frac{2}{6}$ | $\\frac{4}{36}$ |\n' +
        '| b | 3 | $\\frac{3}{6}$ | $\\frac{9}{36}$ |\n' +
        '| c | 1 | $\\frac{1}{6}$ | $\\frac{1}{36}$ |\n\n' +
        'So `total` $= \\frac{4 + 9 + 1}{36} = \\frac{14}{36} \\approx 0.3889$, and the function returns $1 - \\frac{14}{36} = \\frac{22}{36} \\approx 0.61111$.\n\n' +
        '`round(..., 4)` gives `0.6111`.',
      whyWrong: [
        null,
        'This is `total` $= \\frac{14}{36} \\approx 0.3889$, the sum of the squared proportions. The function returns `1 - total`.',
        'This is $1 - \\frac{3}{6} = 0.5$, one minus the **largest** proportion (the misclassification rate), not what the code computes.',
        'This is $1 - 3 \\times \\left(\\frac{1}{3}\\right)^2 = 0.6667$, which treats the three classes as equally common. The code uses the real counts 2, 3 and 1.',
      ],
      keyIdea: 'Gini impurity in code: for each distinct class add the squared proportion, then subtract the total from 1.',
    },
    check: {
      optionValues: [0.6111, 0.3889, 0.5, 0.6667],
      compute: () => round(gini([2, 3, 1]), 4),
    },
    python: { stdout: '0.6111\n' },
  },

  // ---------------------------------------------------------------- challenge
  {
    id: 'classic-algorithms-016',
    subtopic: 'classic-algorithms',
    difficulty: 'challenge',
    stem:
      'A decision tree is choosing the first split for 10 training examples (5 "Yes", 5 "No"). Four candidate features each split the data into a left and a right child, with the class counts in the table. Using **weighted Gini impurity**, which feature gives the best split?',
    table: {
      headers: ['Feature', 'Left: Yes', 'Left: No', 'Right: Yes', 'Right: No'],
      rows: [
        ['Student', 1, 0, 4, 5],
        ['Owns a house', 2, 0, 3, 5],
        ['Age over 40', 3, 3, 2, 2],
        ['Has a job', 4, 1, 1, 4],
      ],
    },
    options: ['Student', 'Owns a house', 'Age over 40', 'Has a job'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The best split has the **lowest** weighted Gini impurity (equivalently, the biggest drop from the parent\'s $0.5$). Use $G = 1 - \\sum p_i^2$ for each child and weight by child size out of 10.\n\n' +
        '- **Student:** left $(1, 0)$: $G = 0$. Right $(4, 5)$: $G = 1 - \\frac{16 + 25}{81} = \\frac{40}{81} \\approx 0.494$. Weighted: $\\frac{1}{10}(0) + \\frac{9}{10}(0.494) \\approx 0.444$.\n' +
        '- **Owns a house:** left $(2, 0)$: $G = 0$. Right $(3, 5)$: $G = 1 - \\frac{9 + 25}{64} = \\frac{30}{64} \\approx 0.469$. Weighted: $\\frac{8}{10}(0.469) = 0.375$.\n' +
        '- **Age over 40:** both children are 50/50, $G = 0.5$ each. Weighted: $0.5$ (no improvement at all).\n' +
        '- **Has a job:** left $(4, 1)$: $G = 1 - \\frac{16 + 1}{25} = 0.32$. Right $(1, 4)$: $G = 0.32$. Weighted: $\\frac{5}{10}(0.32) + \\frac{5}{10}(0.32) = 0.32$.\n\n' +
        'Lowest weighted Gini: **Has a job** ($0.32$).',
      whyWrong: [
        'Student isolates **one** example perfectly, which looks impressive, but the other 9 examples stay almost 50/50 ($G \\approx 0.494$), so its weighted Gini is about $0.444$, worse than $0.32$.',
        'This is what you get from the **unweighted** average of the child Ginis: $\\frac{0 + 0.469}{2} \\approx 0.234$ looks best. Weighted by size, the big impure child dominates and the score is $0.375$.',
        'This has the **highest** weighted Gini ($0.5$, no improvement). Picking it comes from thinking a higher impurity is better; for Gini and entropy, lower is better (it is information **gain** that should be high).',
        null,
      ],
      keyIdea: 'Choose the split with the lowest size-weighted child impurity; a tiny pure child does not make a good split if the large child stays mixed.',
    },
    check: {
      optionValues: ['Student', 'Owns a house', 'Age over 40', 'Has a job'],
      compute: () => {
        const splits: [string, number[][]][] = [
          ['Student', [[1, 0], [4, 5]]],
          ['Owns a house', [[2, 0], [3, 5]]],
          ['Age over 40', [[3, 3], [2, 2]]],
          ['Has a job', [[4, 1], [1, 4]]],
        ];
        return [...splits].sort((a, b) => weighted(a[1], gini) - weighted(b[1], gini))[0][0];
      },
    },
  },
  {
    id: 'classic-algorithms-017',
    subtopic: 'classic-algorithms',
    difficulty: 'challenge',
    stem:
      'A node has 5 "Yes" and 5 "No" examples. A split sends 4 examples (all "Yes") to the left child and 6 examples (1 "Yes", 5 "No") to the right child. What is the **information gain** of this split, using entropy with $\\log_2$, to 3 decimal places?',
    options: ['$0.390$', '$0.610$', '$0.675$', '$0.423$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Information gain = parent entropy $-$ weighted average of the child entropies.\n\n' +
        '**Parent** (5 Yes, 5 No) is 50/50, so $H_{\\text{parent}} = 1$.\n\n' +
        '**Left child** (4 Yes, 0 No) is pure, so $H_L = 0$ (we take $0 \\log_2 0 = 0$).\n\n' +
        '**Right child** (1 Yes, 5 No): $p = \\frac{1}{6}$ and $\\frac{5}{6}$.\n\n' +
        '$$H_R = -\\frac{1}{6}\\log_2 \\frac{1}{6} - \\frac{5}{6}\\log_2 \\frac{5}{6} \\approx \\frac{1}{6}(2.585) + \\frac{5}{6}(0.263) \\approx 0.4308 + 0.2192 = 0.6500$$\n\n' +
        '**Weighted child entropy:** $\\frac{4}{10}(0) + \\frac{6}{10}(0.6500) = 0.3900$.\n\n' +
        '**Information gain:** $1 - 0.3900 = 0.6100$, which is $0.610$ to 3 decimal places.',
      whyWrong: [
        'This is the weighted child entropy $0.390$. You still have to subtract it from the parent entropy of 1 to get the gain.',
        null,
        'This averages the children **without weights**: $1 - \\frac{0 + 0.650}{2} = 0.675$. The right child holds 6 of the 10 examples, so it must count for $\\frac{6}{10}$.',
        'This uses natural logs $\\ln$ throughout (parent $\\ln 2 \\approx 0.693$, right child $\\approx 0.451$), giving $0.693 - 0.6 \\times 0.451 \\approx 0.423$. Entropy in bits needs $\\log_2$.',
      ],
      keyIdea: 'Information gain = H(parent) minus the size-weighted average of H(children); a bigger gain means a better split.',
    },
    check: {
      optionValues: [0.39, 0.61, 0.675, 0.423],
      compute: () => round(entropy([5, 5]) - weighted([[4, 0], [1, 5]], (c) => entropy(c)), 3),
    },
  },
  {
    id: 'classic-algorithms-018',
    subtopic: 'classic-algorithms',
    difficulty: 'challenge',
    stem:
      'k-means with $k = 2$ is run on the six points $A(0, 1)$, $B(2, 0)$, $C(4, 2)$, $D(4, 4)$, $E(7, 5)$ and $F(7, 6)$ (shown in the plot). The initial centroids are $\\mu_1 = (1, 2)$ and $\\mu_2 = (6, 6)$. After **one full iteration** (assignment using Euclidean distance, then update), where are the centroids?',
    chart: {
      kind: 'scatter',
      title: 'Data points',
      xLabel: 'x',
      yLabel: 'y',
      points: [
        { x: 0, y: 1 },
        { x: 2, y: 0 },
        { x: 4, y: 2 },
        { x: 4, y: 4 },
        { x: 7, y: 5 },
        { x: 7, y: 6 },
      ],
    },
    options: [
      '$\\mu_1 = (2.5, 1.75)$, $\\mu_2 = (7, 5.5)$',
      '$\\mu_1 = (1.75, 1.25)$, $\\mu_2 = (6, 5.25)$',
      '$\\mu_1 = (2, 1)$, $\\mu_2 = (6, 5)$',
      '$\\mu_1 = (2, 1)$, $\\mu_2 = (7, 5)$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Assignment step** (squared distances to $\\mu_1 = (1, 2)$ and $\\mu_2 = (6, 6)$):\n\n' +
        '| Point | $d^2$ to $\\mu_1$ | $d^2$ to $\\mu_2$ | cluster |\n' +
        '|---|---|---|---|\n' +
        '| $A(0, 1)$ | $1 + 1 = 2$ | $36 + 25 = 61$ | 1 |\n' +
        '| $B(2, 0)$ | $1 + 4 = 5$ | $16 + 36 = 52$ | 1 |\n' +
        '| $C(4, 2)$ | $3^2 = 9$ | $4 + 16 = 20$ | 1 |\n' +
        '| $D(4, 4)$ | $9 + 4 = 13$ | $4 + 4 = 8$ | 2 |\n' +
        '| $E(7, 5)$ | $36 + 9 = 45$ | $1 + 1 = 2$ | 2 |\n' +
        '| $F(7, 6)$ | $36 + 16 = 52$ | $1^2 = 1$ | 2 |\n\n' +
        '**Update step** (mean of each cluster):\n\n' +
        '- Cluster 1 $= \\{A, B, C\\}$: $\\mu_1 = \\left(\\frac{0 + 2 + 4}{3}, \\frac{0 + 1 + 2}{3}\\right) = (2, 1)$\n' +
        '- Cluster 2 $= \\{D, E, F\\}$: $\\mu_2 = \\left(\\frac{4 + 7 + 7}{3}, \\frac{4 + 5 + 6}{3}\\right) = (6, 5)$\n\n' +
        'After one iteration: $\\mu_1 = (2, 1)$ and $\\mu_2 = (6, 5)$.',
      whyWrong: [
        'This puts $D(4, 4)$ into cluster 1 (it looks central on the plot). But $D$ is closer to $\\mu_2$: $8 < 13$. With $D$ in the wrong cluster the means become $(2.5, 1.75)$ and $(7, 5.5)$.',
        'This includes the **old centroid** in the average as if it were a data point, e.g. $\\frac{0 + 1 + 2 + 4}{4} = 1.75$. The new centroid is the mean of the assigned data points only.',
        null,
        'This uses the **median** of cluster 2 for $\\mu_2$ ($x$: 4, 7, 7 gives 7). k-means updates each centroid to the **mean**, $\\frac{4 + 7 + 7}{3} = 6$. (For cluster 1 the median happens to equal the mean.)',
      ],
      keyIdea: 'One k-means iteration = assign every point to its nearest centroid, then replace each centroid by the mean of its own points.',
    },
    check: {
      optionValues: ['2.5,1.75|7,5.5', '1.75,1.25|6,5.25', '2,1|6,5', '2,1|7,5'],
      compute: () => {
        const pts: Pt[] = [[0, 1], [2, 0], [4, 2], [4, 4], [7, 5], [7, 6]];
        const mu: Pt[] = [[1, 2], [6, 6]];
        const groups: Pt[][] = [[], []];
        pts.forEach((p) => groups[sqDist(p, mu[0]) <= sqDist(p, mu[1]) ? 0 : 1].push(p));
        return groups.map((g) => meanPt(g).join(',')).join('|');
      },
    },
  },
  {
    id: 'classic-algorithms-019',
    subtopic: 'classic-algorithms',
    difficulty: 'challenge',
    stem: 'This Python code runs a small k-NN classifier with Manhattan distance. What does it print?',
    code: {
      lang: 'python',
      source: src(
        "train = [((1, 1), 'A'), ((2, 3), 'B'), ((4, 4), 'B'),",
        "         ((5, 1), 'A'), ((3, 2), 'A')]",
        'q = (3, 3)',
        'dists = []',
        'for (x, y), label in train:',
        '    d = abs(x - q[0]) + abs(y - q[1])',
        '    dists.append((d, label))',
        'dists.sort()',
        'top = [label for d, label in dists[:3]]',
        'print(top, max(set(top), key=top.count))',
      ),
    },
    options: ["`['A', 'B', 'B'] B`", "`['B', 'A', 'B'] B`", "`['A', 'A', 'B'] A`", "`['A', 'B', 'B'] A`"],
    correctIndex: 0,
    markScheme: {
      solution:
        'Step 1: the loop builds `(distance, label)` pairs, with Manhattan distance to `q = (3, 3)`.\n\n' +
        '| point | `d` | pair |\n' +
        '|---|---|---|\n' +
        "| (1, 1) | $2 + 2 = 4$ | `(4, 'A')` |\n" +
        "| (2, 3) | $1$ (same $y$) | `(1, 'B')` |\n" +
        "| (4, 4) | $1 + 1 = 2$ | `(2, 'B')` |\n" +
        "| (5, 1) | $2 + 2 = 4$ | `(4, 'A')` |\n" +
        "| (3, 2) | $0 + 1 = 1$ | `(1, 'A')` |\n\n" +
        "Step 2: `dists.sort()` sorts tuples by the first item (distance) and, **when distances tie, by the second item** (the label, alphabetically). So the two pairs at distance 1 come out as `(1, 'A')` then `(1, 'B')`:\n\n" +
        "`[(1, 'A'), (1, 'B'), (2, 'B'), (4, 'A'), (4, 'A')]`\n\n" +
        "Step 3: `dists[:3]` takes the 3 smallest, so `top = ['A', 'B', 'B']`.\n\n" +
        "Step 4: `max(set(top), key=top.count)` returns the label with the highest count: 'A' appears once, 'B' twice, so it returns `B`.\n\n" +
        "Output: `['A', 'B', 'B'] B`",
      whyWrong: [
        null,
        "This keeps the two distance-1 points in their original list order ((2, 3) came before (3, 2)). But sorting tuples breaks ties using the second item, and 'A' < 'B'.",
        "This assumes `sort()` puts the **largest** distances first, so the top 3 would be the two 4s and the 2. Python's `sort()` is ascending by default.",
        "The list is right, but the vote is wrong: `max(..., key=top.count)` picks the label that occurs most often in `top` ('B', twice), not the most common label in the whole training set ('A').",
      ],
      keyIdea: 'Sorting (distance, label) tuples orders by distance, breaking ties by label; the k-NN vote is the most frequent label among the first k.',
    },
    python: { stdout: "['A', 'B', 'B'] B\n" },
  },
  {
    id: 'classic-algorithms-020',
    subtopic: 'classic-algorithms',
    difficulty: 'challenge',
    stem:
      'k-means tries to make the **within-cluster sum of squares** (WCSS) small: the sum, over all points, of the squared Euclidean distance from each point to its own cluster\'s centroid. After an assignment step, cluster 1 is $\\{(1, 2), (3, 2), (2, 5)\\}$ and cluster 2 is $\\{(7, 7), (9, 5)\\}$. The centroids are then updated to the cluster means. What is the WCSS using the **updated** centroids?',
    chart: {
      kind: 'scatter',
      title: 'Points after assignment',
      xLabel: 'x',
      yLabel: 'y',
      points: [
        { x: 1, y: 2 },
        { x: 3, y: 2 },
        { x: 2, y: 5 },
        { x: 7, y: 7 },
        { x: 9, y: 5 },
      ],
    },
    options: ['$10$', '$2.4$', '$2 + 4\\sqrt{2}$', '$12$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: updated centroids** (means).\n\n' +
        '- Cluster 1: $\\left(\\frac{1 + 3 + 2}{3}, \\frac{2 + 2 + 5}{3}\\right) = (2, 3)$\n' +
        '- Cluster 2: $\\left(\\frac{7 + 9}{2}, \\frac{7 + 5}{2}\\right) = (8, 6)$\n\n' +
        '**Step 2: squared distance from each point to its own centroid.**\n\n' +
        '| Point | centroid | $d^2$ |\n' +
        '|---|---|---|\n' +
        '| $(1, 2)$ | $(2, 3)$ | $1^2 + 1^2 = 2$ |\n' +
        '| $(3, 2)$ | $(2, 3)$ | $1^2 + 1^2 = 2$ |\n' +
        '| $(2, 5)$ | $(2, 3)$ | $0^2 + 2^2 = 4$ |\n' +
        '| $(7, 7)$ | $(8, 6)$ | $1^2 + 1^2 = 2$ |\n' +
        '| $(9, 5)$ | $(8, 6)$ | $1^2 + 1^2 = 2$ |\n\n' +
        '**Step 3: add them.** $\\text{WCSS} = 2 + 2 + 4 + 2 + 2 = 12$.',
      whyWrong: [
        'This uses Manhattan distances ($2 + 2 + 2 + 2 + 2 = 10$) instead of squared Euclidean distances. For $(2, 5)$ the squared distance is $0^2 + 2^2 = 4$, not $0 + 2 = 2$.',
        'This is the **mean** squared distance $\\frac{12}{5} = 2.4$. WCSS is the **sum**, not the average.',
        'This adds the plain (unsquared) distances $\\sqrt{2} + \\sqrt{2} + 2 + \\sqrt{2} + \\sqrt{2}$. WCSS uses **squared** distances, so no square roots are taken.',
        null,
      ],
      keyIdea: 'WCSS adds the squared distance from every point to its own centroid; no k-means step ever increases it.',
    },
    check: {
      optionValues: [10, 2.4, 2 + 4 * Math.SQRT2, 12],
      compute: () => {
        const clusters: Pt[][] = [
          [[1, 2], [3, 2], [2, 5]],
          [[7, 7], [9, 5]],
        ];
        return clusters.reduce((acc, cl) => {
          const c = meanPt(cl);
          return acc + cl.reduce((s, p) => s + sqDist(p, c), 0);
        }, 0);
      },
    },
  },
];
