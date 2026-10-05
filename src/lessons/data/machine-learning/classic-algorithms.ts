import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'classic-algorithms',
  know:
    '### Three classic algorithms\n\n' +
    'Three simple, classic algorithms are the starting point of machine learning. They are still widely used, and they appear in every exam:\n\n' +
    '| Algorithm | Type | What it does | What $k$ means |\n' +
    '|---|---|---|---|\n' +
    '| k-nearest neighbours (k-NN) | supervised, classification | labels a new point by a vote of its closest training points | number of neighbours that vote |\n' +
    '| k-means | unsupervised, clustering | splits unlabelled points into groups | number of clusters |\n' +
    '| decision tree | supervised, classification | asks a chain of yes/no questions | (no $k$) |\n\n' +
    'All three rest on two simple ideas: **distance** (how far apart two points are) and **impurity** (how mixed a group of labels is).\n\n' +
    '### Measuring distance\n\n' +
    'Each data point is a list of numbers (features), so it can be drawn as a point on a graph. The **Euclidean** distance is the straight-line distance from Pythagoras: subtract the coordinates, square, add, then square root. For $(1, 2)$ and $(4, 6)$ the differences are 3 and 4, so $d = \\sqrt{9 + 16} = 5$.\n\n' +
    'The **Manhattan** distance just adds the absolute differences, like walking along city blocks: $3 + 4 = 7$. The two measures can rank neighbours differently, so always use the one the question names.\n\n' +
    'Shortcut: when you only need to know **which** point is nearer, compare **squared** distances. The order is the same and you skip the square roots.\n\n' +
    '### k-nearest neighbours\n\n' +
    'k-NN has no real training step: it simply stores the labelled data. To classify a new point:\n\n' +
    '1. Compute its distance to **every** training point.\n' +
    '2. Sort by distance and keep the $k$ nearest.\n' +
    '3. Take a **majority vote** of their labels.\n\n' +
    'The value of $k$ matters. With $k = 1$ one noisy point decides everything, so the decision boundary is jagged and the model **overfits**. A larger $k$ outvotes noise and gives a **smoother** boundary, but if $k$ is too large (say, all the data) every point gets the overall majority class and the model **underfits**. $k$ is a **hyperparameter**: you choose it, usually with a validation set. For two classes an odd $k$ avoids tied votes. Because features are compared by distance, they should be on similar scales (a feature measured in thousands would swamp one measured in units).\n\n' +
    '### k-means clustering\n\n' +
    'k-means gets points **without labels** and finds $k$ groups. It keeps $k$ centre points called **centroids** and repeats two steps:\n\n' +
    '1. **Assign:** each point joins the cluster of its nearest centroid.\n' +
    '2. **Update:** each centroid moves to the **mean** of its points (average the $x$-values, average the $y$-values).\n\n' +
    'It stops when the assignments no longer change (it has **converged**). Every step lowers (or keeps) the **within-cluster sum of squares** (WCSS): the total squared distance from each point to its own centroid. The result depends on where the centroids start, so k-means is often run several times.\n\n' +
    '### Decision trees and impurity\n\n' +
    'A decision tree asks questions such as "income $\\ge 3000$?" and follows a branch for each answer until it reaches a leaf with a prediction. To **build** the tree, the algorithm tries every possible question and picks the one that makes the child groups as **pure** (unmixed) as possible.\n\n' +
    'Purity is measured with an **impurity** score, where $p_i$ is the fraction of the node in class $i$:\n\n' +
    '- **Gini impurity** $G = 1 - \\sum p_i^2$. Pure node: $0$. Worst for two classes (50/50): $0.5$.\n' +
    '- **Entropy** $H = -\\sum p_i \\log_2 p_i$ (take $0 \\log_2 0 = 0$). Pure node: $0$. Worst for two classes: $1$ bit.\n\n' +
    '### Choosing the best split\n\n' +
    'For each candidate split, work out the impurity of each child, then take the **weighted average**, weighting each child by its share of the examples. The best split has the **lowest** weighted impurity. With entropy, the drop from the parent is called the **information gain**:\n\n' +
    '$$\\text{IG} = H(\\text{parent}) - \\sum \\frac{n_{\\text{child}}}{n} H(\\text{child})$$\n\n' +
    'The best split has the **highest** gain. Weighting is essential: a split that creates a tiny pure child but leaves a big mixed child is usually a poor split.',
  formulas: [
    { label: 'Euclidean distance (2 features)', tex: 'd = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}', note: 'Compare squared distances to rank neighbours without square roots.' },
    { label: 'Manhattan distance', tex: 'd = |x_1 - x_2| + |y_1 - y_2|', note: 'Always use absolute values.' },
    { label: 'k-NN prediction', tex: '\\hat{y} = \\text{majority label among the } k \\text{ nearest training points}' },
    { label: 'k-means centroid update', tex: '\\mu = \\left(\\frac{\\sum x_i}{n}, \\frac{\\sum y_i}{n}\\right)', note: 'The mean of the $n$ points assigned to that cluster.' },
    { label: 'Within-cluster sum of squares', tex: '\\text{WCSS} = \\sum_{\\text{clusters}} \\sum_{\\text{points}} d(\\text{point}, \\mu)^2', note: 'k-means tries to make this small; each iteration never increases it.' },
    { label: 'Gini impurity', tex: 'G = 1 - \\sum_i p_i^2', note: 'Two classes: $G = 2p(1 - p)$; maximum $0.5$ at a 50/50 split.' },
    { label: 'Entropy (bits)', tex: 'H = -\\sum_i p_i \\log_2 p_i', note: 'Two classes: $0$ when pure, $1$ at 50/50. On a calculator, $\\log_2 x = \\frac{\\ln x}{\\ln 2}$.' },
    { label: 'Weighted impurity of a split', tex: 'I_{\\text{split}} = \\frac{n_L}{n} I_L + \\frac{n_R}{n} I_R', note: 'Lower is better.' },
    { label: 'Information gain', tex: '\\text{IG} = H(\\text{parent}) - \\left(\\frac{n_L}{n} H_L + \\frac{n_R}{n} H_R\\right)', note: 'Higher is better.' },
  ],
  examples: [
    {
      title: 'Gini impurity of one node',
      problem: 'A node has 6 "Yes" and 2 "No" examples. Find its Gini impurity.',
      steps: [
        'Proportions: $p_{\\text{Yes}} = \\frac{6}{8} = 0.75$ and $p_{\\text{No}} = \\frac{2}{8} = 0.25$.',
        'Square them: $0.75^2 = 0.5625$ and $0.25^2 = 0.0625$. Their sum is $0.625$.',
        'Subtract from 1: $G = 1 - 0.625 = 0.375$.',
        'Check with the two-class shortcut: $2 \\times 0.75 \\times 0.25 = 0.375$.',
      ],
      answer: '$G = 0.375$',
    },
    {
      title: 'k-NN with k = 3',
      problem:
        'Training points: $A(3, 5)$ Cat, $B(4, 5)$ Dog, $C(1, 3)$ Dog, $D(6, 5)$ Rabbit, $E(6, 7)$ Rabbit. Classify $Q = (3, 4)$ with $k = 3$ and Euclidean distance.',
      steps: [
        'Squared distances from $Q$: $A$: $0^2 + 1^2 = 1$; $B$: $1^2 + 1^2 = 2$; $C$: $2^2 + 1^2 = 5$; $D$: $3^2 + 1^2 = 10$; $E$: $3^2 + 3^2 = 18$.',
        'Sort: $A$ (1), $B$ (2), $C$ (5), $D$ (10), $E$ (18). The 3 nearest are $A$, $B$, $C$.',
        'Vote: Cat 1, Dog 2.',
        'Note that $k = 1$ would have said Cat, and Rabbit is the most common class overall but is far away.',
      ],
      answer: 'Dog',
    },
    {
      title: 'One k-means iteration',
      problem:
        'Points $A(0, 1)$, $B(2, 0)$, $C(4, 2)$, $D(4, 4)$, $E(7, 5)$, $F(7, 6)$. Centroids $\\mu_1 = (1, 2)$ and $\\mu_2 = (6, 6)$. Do one assignment step and one update step.',
      steps: [
        'Squared distances to $\\mu_1$ and $\\mu_2$: $A$: 2 and 61; $B$: 5 and 52; $C$: 9 and 20; $D$: 13 and 8; $E$: 45 and 2; $F$: 52 and 1.',
        'Assign to the smaller one: cluster 1 $= \\{A, B, C\\}$, cluster 2 $= \\{D, E, F\\}$. Notice $D$ goes to $\\mu_2$ ($8 < 13$).',
        'Update $\\mu_1$: $\\left(\\frac{0 + 2 + 4}{3}, \\frac{0 + 1 + 2}{3}\\right) = (2, 1)$.',
        'Update $\\mu_2$: $\\left(\\frac{4 + 7 + 7}{3}, \\frac{4 + 5 + 6}{3}\\right) = (6, 5)$.',
      ],
      answer: '$\\mu_1 = (2, 1)$ and $\\mu_2 = (6, 5)$',
    },
    {
      title: 'Choosing the better of two splits',
      problem:
        'A node has 6 "Yes" and 4 "No". Split X gives children (3 Yes, 0 No) and (3 Yes, 4 No). Split Y gives children (5 Yes, 1 No) and (1 Yes, 3 No). Which split is better by weighted Gini impurity?',
      steps: [
        'Split X: the left child is pure, so $G = 0$. Right child: $G = 1 - \\left(\\frac{3}{7}\\right)^2 - \\left(\\frac{4}{7}\\right)^2 = 1 - \\frac{25}{49} = \\frac{24}{49} \\approx 0.490$.',
        'Weighted for X (children of 3 and 7 out of 10): $\\frac{3}{10} \\times 0 + \\frac{7}{10} \\times \\frac{24}{49} = \\frac{12}{35} \\approx 0.343$.',
        'Split Y: left $G = 1 - \\left(\\frac{5}{6}\\right)^2 - \\left(\\frac{1}{6}\\right)^2 = \\frac{10}{36} \\approx 0.278$. Right $G = 1 - \\left(\\frac{1}{4}\\right)^2 - \\left(\\frac{3}{4}\\right)^2 = \\frac{6}{16} = 0.375$.',
        'Weighted for Y (children of 6 and 4 out of 10): $\\frac{6}{10} \\times \\frac{10}{36} + \\frac{4}{10} \\times \\frac{6}{16} = \\frac{1}{6} + \\frac{3}{20} = \\frac{19}{60} \\approx 0.317$.',
        'Lower is better: $0.317 < 0.343$, so Y is the better split. Notice that the **unweighted** averages ($0.245$ for X, $0.326$ for Y) would wrongly pick X, because its pure child is small.',
      ],
      answer: 'Split Y (weighted Gini $\\approx 0.317$, against $0.343$ for X)',
    },
    {
      title: 'Information gain of a split (exam level)',
      problem:
        'A node has 5 "Yes" and 5 "No". A split gives a left child with 4 Yes, 0 No and a right child with 1 Yes, 5 No. Find the information gain to 3 decimal places.',
      steps: [
        'Parent is 50/50, so $H_{\\text{parent}} = 1$.',
        'Left child is pure, so $H_L = 0$.',
        'Right child: $H_R = -\\frac{1}{6}\\log_2 \\frac{1}{6} - \\frac{5}{6}\\log_2 \\frac{5}{6} \\approx 0.4308 + 0.2192 = 0.6500$.',
        'Weighted child entropy: $\\frac{4}{10} \\times 0 + \\frac{6}{10} \\times 0.6500 = 0.3900$.',
        'Information gain: $1 - 0.3900 = 0.6100$.',
      ],
      answer: '$\\text{IG} \\approx 0.610$',
    },
  ],
  traps: [
    'Forgetting to **weight** the children by size. The plain average of the child impurities makes a split with a tiny pure child look far better than it is.',
    'Mixing up the two "k"s: in k-NN $k$ is the number of neighbours that vote; in k-means $k$ is the number of clusters. Also, k-NN is supervised and k-means is unsupervised.',
    'Getting the effect of $k$ backwards: $k = 1$ overfits (jagged boundary), while a very large $k$ underfits (everything gets the majority class).',
    'Taking the first $k$ rows of a table instead of the $k$ **nearest**: always sort by distance first, and use the distance measure the question names (Euclidean or Manhattan).',
    'In entropy, using $\\ln$ or the calculator\'s "log" ($\\log_{10}$) instead of $\\log_2$, or forgetting that a pure node has entropy 0 (not 1).',
    'In the k-means update, using the median or including the old centroid in the average. The new centroid is the **mean of the assigned points only**.',
  ],
  examTip:
    'Expect one calculation per question: a distance, a vote, a centroid, a Gini value or an information gain. To save time:\n\n' +
    '- **Distances:** compare squared distances; you only need square roots if the question asks for the distance itself.\n' +
    '- **Sanity-check impurities:** Gini is between 0 and 0.5 for two classes and entropy is between 0 and 1. A weighted impurity must lie between the two child values, and it must be below the parent for a useful split. Any option outside these ranges is a distractor.\n' +
    '- **Spot the trap options:** the wrong answers are usually the parent impurity, the unweighted average, the result with $\\ln$ instead of $\\log_2$, the $k = 1$ class, or the most common class overall. If your answer matches one of these, recheck the step.\n' +
    '- **Centroids:** the centroid lies inside the cloud of its points; an option outside the range of the $x$- or $y$-values (like a sum) cannot be a mean.\n' +
    '- **Entropy on a calculator:** $\\log_2 x = \\frac{\\ln x}{\\ln 2}$. Memorise $\\log_2 0.5 = -1$, $\\log_2 0.25 = -2$ and $H = 1$ for a 50/50 node.',
};
