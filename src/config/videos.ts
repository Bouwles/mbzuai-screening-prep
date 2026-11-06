// Recommended YouTube videos for each lesson, shortest and most beginner-friendly first.
// Every id was checked against YouTube's oEmbed endpoint (title + channel) on 2026-11-02.
// To add one: { id: '<the part after watch?v=>', title, channel, length }.

export interface Video {
  id: string;
  title: string;
  channel: string;
  /** As YouTube shows it, e.g. "6:22". */
  length: string;
}

const KA = 'Khan Academy';
const B3 = '3Blue1Brown';
const SQ = 'StatQuest';
const OCT = 'The Organic Chemistry Tutor';
const CS50 = 'CS50';
const CS = 'Corey Schafer';
const MS = 'Michael Sambol';
const TT = 'TrevTutor';

const v = (id: string, title: string, channel: string, length: string): Video => ({ id, title, channel, length });

export const VIDEOS: Record<string, Video[]> = {
  // ---------------------------------------------------------------- Math: algebra
  'linear-equations': [
    v('_y_Q3_B2Vh8', 'Solving two-step equations', KA, '5:12'),
    v('VgDe_D8ojxw', 'Solving inequalities', KA, '6:26'),
    v('u6zDpUL5RkU', 'Absolute value equations', KA, '10:41'),
  ],
  quadratics: [
    v('N30tN9158Kc', 'Solving a quadratic by factoring', KA, '9:12'),
    v('i7idZfS8t8w', 'How to use the quadratic formula', KA, '16:32'),
    v('VvuuRpJbbHE', 'Completing the square (example)', KA, '3:22'),
    v('1213qW5k55I', 'Discriminant for types of solutions', KA, '4:37'),
    v('MwG6QD352yc', 'Polynomial remainder theorem', KA, '6:42'),
  ],
  'simultaneous-equations': [
    v('V7H1oUHXPkg', 'Solving linear systems by substitution', KA, '9:21'),
    v('vA-55wZtLeE', 'Solving systems of equations by elimination', KA, '12:44'),
  ],
  'indices-surds': [
    v('kITJ6qH7jS0', 'Exponent rules part 1', KA, '9:43'),
    v('tOuCdKqO6-s', 'Zero, negative and fractional exponents', KA, '14:04'),
    v('cw3mp8oNASk', 'Simplifying square roots', KA, '3:09'),
    v('gY5TvlHg4Vk', 'How to rationalize a denominator', KA, '10:18'),
  ],
  'logs-exponentials': [
    v('zzu2POfYv0Y', 'Logarithms, explained', 'TED-Ed', '3:34'),
    v('Z5myJ8dg_rM', 'Logarithms', KA, '7:02'),
    v('PupNgv49_WY', 'Introduction to logarithm properties', KA, '9:15'),
    v('Kv2iHde7Xgw', 'Solving logarithmic equations', KA, '4:13'),
  ],
  'percentages-ratio': [
    v('5nZEUpZX_P0', 'Calculating percent change', 'Math Antics', '12:51'),
    v('T6-0MwmCpE8', 'Percent increase and decrease word problems', OCT, '11:23'),
    v('bIKmw0aTmYc', 'Introduction to ratios', KA, '3:58'),
    v('Rm6UdfRs3gw', 'Compound interest introduction', KA, '6:38'),
  ],
  'sequences-series': [
    v('_cooC3yG_p0', 'Introduction to arithmetic sequences', KA, '7:06'),
    v('Uy_L8tnihDM', 'Formula for arithmetic series', KA, '7:46'),
    v('pXo0bG4iAyg', 'Introduction to geometric sequences', KA, '10:45'),
    v('b-7kCymoUpg', 'Sum of an infinite geometric series', KA, '4:46'),
  ],
  // ---------------------------------------------------------------- Math: functions
  'domain-range': [
    v('-DTMakGDZAw', 'What is the domain of a function?', KA, '6:44'),
    v('za0QJRZ-yQ4', 'Domain and range of a function given a formula', KA, '8:07'),
    v('rpI-X9Gn5a4', 'Domain and range of a piecewise function', KA, '7:24'),
  ],
  'composite-inverse': [
    v('wUNWjd4bMmw', 'Introduction to function composition', KA, '6:15'),
    v('W84lObmOp8M', 'Introduction to function inverses', KA, '9:05'),
    v('YI30Ecfl4tc', 'Finding inverses of rational functions', KA, '4:17'),
  ],
  transformations: [
    v('RttvubuBhAE', 'Shifting functions introduction', KA, '5:38'),
    v('1lt6a77OmLU', 'Scaling functions introduction', KA, '6:03'),
    v('mR2y_kohZIw', 'Reflecting functions introduction', KA, '7:10'),
  ],
  'function-families': [
    v('IL3UCuXrUzE', 'Slope-intercept form', KA, '8:59'),
    v('V0xounKGEXs', 'Parallel and perpendicular lines intro', KA, '2:08'),
    v('RVv0Jgi3Pbw', 'Graphing exponential growth and decay', KA, '4:05'),
    v('LqyA96oYtwE', 'Graphs of logarithmic functions', KA, '6:28'),
  ],
  'trig-functions': [
    v('Jsiy4TxgIME', 'Basic trigonometry (SOH CAH TOA)', KA, '9:17'),
    v('EnwWxMZVBeg', 'Introduction to radians', KA, '10:51'),
    v('1m9p9iubMLU', 'Introduction to the unit circle', KA, '9:04'),
    v('s4cLM0l1gd4', 'Midline, amplitude and period of a function', KA, '4:58'),
    v('ZElOxG7_m3c', 'Law of cosines', KA, '4:38'),
  ],
  'trig-equations': [
    v('n0DLSIOYBsQ', 'Pythagorean trig identity from the unit circle', KA, '6:12'),
    v('kEcbxiLeGTc', 'Solving trigonometric equations by finding all solutions', OCT, '11:49'),
    v('SE5SBTgrwH8', 'Double angle identities and formulas', OCT, '18:16'),
  ],
  // ---------------------------------------------------------------- Math: probability
  counting: [
    v('XqQTXW7XfYA', 'Permutations', KA, '10:11'),
    v('iKy-d5_erhI', 'Introduction to combinations', KA, '6:17'),
    v('XJnIdRXUi7A', 'Permutations and combinations tutorial', OCT, '17:41'),
  ],
  'probability-basics': [
    v('uzkc-qNVoOk', 'Probability explained', KA, '8:18'),
    v('KzfWUEJjG18', 'Basic probability', 'Math Antics', '11:28'),
    v('QE2uR6Z-NcU', 'Addition rule for probability', KA, '10:43'),
    v('xSc4oLA9e8o', 'Compound probability of independent events', KA, '6:00'),
  ],
  'conditional-probability': [
    v('6xPkG2pA-TU', 'Calculating conditional probability', KA, '6:43'),
    v('HZGCoVF3YvM', "Bayes' theorem, the geometry of changing beliefs", B3, '15:11'),
    v('lG4VkPoG3ko', "The medical test paradox, and redesigning Bayes' rule", B3, '21:14'),
    v('OByl4RJxnKA', "Bayes' theorem with tree diagrams and Venn diagrams", OCT, '19:14'),
  ],
  'expected-binomial': [
    v('qafPcWNUiM8', 'Mean (expected value) of a discrete random variable', KA, '4:32'),
    v('b6VK2VPMXNI', 'How to calculate expected value', OCT, '7:00'),
    v('WWv0RUxDfbs', 'Binomial distribution', KA, '11:51'),
  ],
  // ---------------------------------------------------------------- Math: statistics
  'descriptive-stats': [
    v('h8EYEJ32oQ8', 'Statistics intro: mean, median and mode', KA, '8:54'),
    v('qLYYHWYr8xI', 'How to calculate the interquartile range (IQR)', KA, '6:12'),
    v('b2C9I8HuCe4', 'Box and whisker plot', KA, '3:18'),
    v('qBigTkBLU6g', 'Histograms, clearly explained', SQ, '3:42'),
  ],
  'variance-sd': [
    v('E4HAYd0QnRc', 'Range, variance and standard deviation as measures of dispersion', KA, '12:34'),
    v('SzZ6GpcfoQY', 'Calculating the mean, variance and standard deviation', SQ, '14:22'),
    v('Qf3RMGXR-h8', 'Sample variance', KA, '11:18'),
  ],
  'correlation-normal': [
    v('rzFX5NWojp0', 'The normal distribution, clearly explained', SQ, '5:13'),
    v('5S-Zfa-vOXs', 'Z-score introduction', KA, '5:05'),
    v('OhRr26AfFBU', 'Normal distribution problems: the empirical rule', KA, '10:25'),
    v('-Y-M9aD_ccQ', 'Correlation coefficient intuition', KA, '7:20'),
  ],
  // ---------------------------------------------------------------- Math: matrices and vectors
  'matrix-operations': [
    v('WR9qCSXJlyY', 'Matrix addition and subtraction', KA, '5:35'),
    v('kT4Mp9EdVqs', 'Matrix multiplication introduction', KA, '6:26'),
    v('kYB8IZa5AuE', 'Linear transformations and matrices', B3, '10:59'),
    v('XkY2DOUCWMU', 'Matrix multiplication as composition', B3, '10:04'),
  ],
  'determinants-inverses': [
    v('Ip3X9LOh2dk', 'The determinant', B3, '10:03'),
    v('01c12NaUQDw', 'Inverse of a 2x2 matrix', KA, '2:48'),
    v('v4MenooI1J0', 'Finding the determinant of a 3x3 matrix', KA, '2:39'),
    v('uQhTuRlWMxw', 'Inverse matrices, column space and null space', B3, '12:09'),
  ],
  'rank-eigen': [
    v('uQhTuRlWMxw', 'Inverse matrices, column space and null space (rank)', B3, '12:09'),
    v('PFDu9oVAE-g', 'Eigenvectors and eigenvalues', B3, '17:16'),
    v('pZ6mMVEE89g', 'Example: solving for the eigenvalues of a 2x2 matrix', KA, '5:39'),
    v('e50Bj7jn9IQ', 'A quick trick for computing eigenvalues', B3, '13:13'),
  ],
  vectors: [
    v('fNk_zzaMoSs', 'Vectors', B3, '9:52'),
    v('qMZnsj4ZO9g', 'Finding vector magnitude from components', KA, '3:05'),
    v('jCkhbKFZgLk', 'Unit vectors', KA, '5:02'),
    v('WNuIhXo39_k', 'Vector dot product and vector length', KA, '9:10'),
  ],
  // ---------------------------------------------------------------- Math: calculus
  limits: [
    v('riXcZT2ICjA', 'Introduction to limits', KA, '11:32'),
    v('nDXFgexOM5c', 'Limits at infinity using algebra', KA, '5:26'),
    v('kfF40MiS7zA', "Limits, L'Hôpital's rule and epsilon-delta definitions", B3, '18:27'),
  ],
  differentiation: [
    v('9vKqVkMQHKk', 'The paradox of the derivative', B3, '16:50'),
    v('bRZmfc1YFsQ', 'Power rule', KA, '3:54'),
    v('0T0QrHO56qg', 'Chain rule', KA, '5:07'),
    v('YG15m2VwSjA', 'Visualizing the chain rule and product rule', B3, '15:56'),
  ],
  'derivative-applications': [
    v('1KwW1v__T_0', 'Equation of a tangent line', KA, '8:07'),
    v('x09FpMmGB4A', 'Worked example: finding relative extrema', KA, '7:48'),
    v('-cW5hCsc9Yc', 'Second derivative test', KA, '6:12'),
    v('Ef22yTJDUZI', 'Optimization with calculus', KA, '9:50'),
  ],
  'partial-derivatives': [
    v('AXqhWeUEtQU', 'Partial derivatives, introduction', KA, '10:56'),
    v('tIpKfDc295M', 'Gradient', KA, '5:31'),
    v('IHZwWFHWa-w', 'Gradient descent, how neural networks learn', B3, '20:33'),
  ],
  integration: [
    v('QxbJsg-Vdms', 'Reverse power rule', KA, '5:48'),
    v('auOcNZFKfo0', 'Definite integrals: reverse power rule', KA, '4:14'),
    v('wQXYtsyfbqg', 'Area between curves', KA, '6:50'),
    v('rfG8ce4nNh0', 'Integration and the fundamental theorem of calculus', B3, '20:46'),
  ],
  // ---------------------------------------------------------------- Math: discrete
  'sets-venn': [
    v('jAfNg3ylZAI', 'Intersection and union of sets', KA, '7:44'),
    v('32iNIZJ2dI4', 'Venn diagrams', OCT, '14:05'),
    v('zoSpsLhO0qg', 'Venn diagram word problems with 3 categories', OCT, '19:09'),
  ],
  'propositional-logic': [
    v('itrXYg41-V0', 'Introduction to propositional logic', TT, '11:02'),
    v('YW0lm5axxcQ', 'Propositional logic truth tables', TT, '12:19'),
    v('TCBu8PD4Lls', 'Converse, inverse and contrapositive', OCT, '11:54'),
  ],
  'number-bases': [
    v('ku4KOFQ-bB4', 'Introduction to number systems and binary', KA, '10:00'),
    v('FFDMzbrEXaE', 'Number systems: decimal, binary, octal and hexadecimal', OCT, '10:57'),
    v('1GSjbWt0c9M', 'Representing numbers and letters with binary', 'CrashCourse', '10:46'),
  ],
  'modular-arithmetic': [
    v('6dZLq77gSGU', 'What does a ≡ b (mod n) mean?', 'blackpenredpen', '5:45'),
    v('M42uDLGRSpI', 'Modular arithmetic (part 1)', 'Neso Academy', '10:57'),
    v('ZKKDTfHcsG0', 'Prime factorization', KA, '4:09'),
    v('jFd-6EPfnec', 'Greatest common factor explained', KA, '6:20'),
  ],
  'recurrence-relations': [
    v('KRFiAlo7t1E', 'Explicit and recursive definitions of sequences', KA, '8:18'),
    v('eAaP4XaB8hM', 'Recurrence relations', TT, '15:25'),
  ],
  'graph-theory': [
    v('LFKZLXVO-Dg', 'Introduction to graph theory: a computer science perspective', 'Reducible', '16:26'),
    v('HkNdNpKUByM', 'Introduction to graph theory', TT, '33:23'),
    v('HZ5YTanv5QE', 'Breadth-first search in 4 minutes', MS, '3:59'),
  ],
  'pigeonhole-counting': [
    v('YKsHlxnWylc', 'Pigeonhole principle: establishing a pattern', 'Eddie Woo', '10:12'),
    v('2-mxYrCNX60', 'Pigeonhole principle', TT, '16:47'),
    v('GS7dIWA6Hpo', 'Inclusion-exclusion principle', TT, '18:03'),
  ],
  // ---------------------------------------------------------------- Computational thinking & logic
  'deductive-reasoning': [
    v('GEId0GonOZM', 'Difference between inductive and deductive reasoning', KA, '2:00'),
    v('Q5gk9ljVuTE', 'Conditional statements and deductive reasoning', KA, '4:09'),
    v('blmq6ms0_es', 'Law of detachment and syllogism', "Mario's Math Tutoring", '6:58'),
    v('NKEhdsnKKHs', 'How to argue: philosophical reasoning', 'CrashCourse', '9:43'),
  ],
  'knights-knaves': [
    v('scsLVM9i8fg', 'Propositional logic puzzle 1 (knights and knaves)', 'Neso Academy', '11:19'),
    v('otkCaqUhofc', 'Propositional logic puzzle 2', 'Neso Academy', '9:57'),
    v('LKvjIsyYng8', 'Can you solve the three gods riddle? (harder, optional)', 'TED-Ed', '4:54'),
  ],
  'ordering-puzzles': [v('1rDVz_Fb6HQ', 'Can you solve "Einstein\'s Riddle"?', 'TED-Ed', '5:13')],
  'boolean-logic': [
    v('gI-qXk7XojA', 'Boolean logic and logic gates', 'CrashCourse', '10:07'),
    v('pdR9hV8mRWE', "De Morgan's laws", 'MIT OpenCourseWare', '4:53'),
  ],
  'number-sequences': [
    v('vV7C7bXm4VI', 'Number patterns', 'Math Antics', '13:53'),
    v('r614AD021n0', 'Number series reasoning tricks', OCT, '14:44'),
  ],
  'letter-symbol-patterns': [v('r614AD021n0', 'Number series reasoning tricks (the same methods work on letter positions)', OCT, '14:44')],
  'odd-one-out': [
    v('MnQ7Lizkpqk', 'Inductive reasoning 1', KA, '2:07'),
    v('ZSsBh4Ybbj8', 'Inductive reasoning 2', KA, '2:21'),
  ],
  // ---------------------------------------------------------------- Programming fundamentals
  'variables-operators': [
    v('khKv-8q7YmY', 'Integers and floats: working with numeric data', CS, '11:55'),
    v('JP7ITIXGpHk', 'CS50P Lecture 0: functions, variables', CS50, '1:45:38'),
  ],
  strings: [
    v('k9TUPpGqYTo', 'Strings: working with textual data', CS, '21:12'),
    v('ajrtAuDg3yw', 'Slicing lists and strings', CS, '10:44'),
  ],
  conditionals: [
    v('vGr1tvjqWs0', 'Conditionals (CS50P short)', CS50, '11:35'),
    v('DZwmZ8Usvnk', 'Conditionals and booleans: if, else and elif', CS, '16:28'),
    v('_b6NgY_pMdw', 'CS50P Lecture 1: conditionals', CS50, '56:08'),
  ],
  loops: [
    v('6iF8Xb7Z3wQ', 'Loops and iterations: for and while loops', CS, '10:14'),
    v('-7xg8pGcP6w', 'CS50P Lecture 2: loops', CS50, '1:20:47'),
  ],
  'functions-scope': [
    v('lGS6O47debI', 'Functions (CS50P short)', CS50, '6:20'),
    v('9Os0o3wzS_I', 'Functions', CS, '21:48'),
    v('QVdf0LgmICw', 'Variable scope: the LEGB rule', CS, '20:59'),
  ],
  recursion: [
    v('Mv9NEXX1VHc', 'What on Earth is recursion?', 'Computerphile', '9:40'),
    v('mz6tAJMVmfM', 'Recursion (CS50 short)', CS50, '13:50'),
    v('ngCos392W4w', '5 simple steps for solving any recursive problem', 'Reducible', '21:03'),
  ],
  'lists-tuples': [
    v('xdpABsJZQYU', 'Lists (CS50P short)', CS50, '9:27'),
    v('FKp-6sojt9A', 'List aliasing and mutation', 'MIT OpenCourseWare', '1:55'),
    v('W8KRzm-HUcc', 'Lists, tuples and sets', CS, '29:05'),
  ],
  'dicts-sets': [
    v('daefaLgNkw0', 'Dictionaries: working with key-value pairs', CS, '9:59'),
    v('knV86FlSXJ8', 'Hash tables in 4 minutes', MS, '3:52'),
    v('nvzVHwrrub0', 'Hash tables (CS50 short)', CS50, '18:47'),
  ],
  'stacks-queues': [
    v('wjI1WNcIntg', 'Stacks and queues', 'HackerRank', '5:46'),
    v('F8AbOfQwl1c', 'Linked lists in 4 minutes', MS, '4:22'),
    v('_jQhALI4ujg', 'Linked lists', 'Computerphile', '10:11'),
  ],
  trees: [
    v('1WxLM2hwL-U', 'Pre-order tree traversal in 3 minutes', MS, '2:46'),
    v('5dySuyZf9Qg', 'In-order tree traversal in 3 minutes', MS, '2:55'),
    v('4zVdfkpcT6U', 'Post-order tree traversal in 2 minutes', MS, '2:19'),
  ],
  'searching-sorting': [
    v('fDKIpRe8GW4', 'Binary search in 4 minutes', MS, '4:00'),
    v('xli_FI7CuzA', 'Bubble sort in 2 minutes', MS, '2:10'),
    v('g-PGLbMth_g', 'Selection sort in 3 minutes', MS, '2:43'),
    v('JU767SDMDvA', 'Insertion sort in 2 minutes', MS, '2:19'),
    v('4VqmGXwpLqc', 'Merge sort in 3 minutes', MS, '3:03'),
  ],
  complexity: [
    v('__vX2sjlpXU', 'Big-O notation in 5 minutes', MS, '5:13'),
    v('BgLTDT03QtU', 'Big-O notation', 'NeetCode', '20:38'),
  ],
  'tracing-pseudocode': [
    v('-7_kyY88Y9Y', 'Trace tables', "Craig'n'Dave", '6:19'),
    v('kSpUGDYBnww', 'How to produce algorithms using pseudocode', "Craig'n'Dave", '5:06'),
    v('6Svu_ae5ebk', 'CS50x Lecture 3: algorithms', CS50, '1:59:36'),
  ],
  // ---------------------------------------------------------------- Data & AI reasoning
  'reading-charts': [
    v('kiQ6MUQZHSs', 'Reading bar graphs', KA, '2:59'),
    v('36v2EXZRzUE', 'Reading line graphs', KA, '2:21'),
    v('MarqSlyz-lU', 'Interpreting two-way tables', KA, '1:43'),
    v('c02vjunQsJM', 'How to interpret a histogram', KA, '4:28'),
  ],
  'data-calculations': [
    v('5nZEUpZX_P0', 'Calculating percent change', 'Math Antics', '12:51'),
    v('h8EYEJ32oQ8', 'Statistics intro: mean, median and mode', KA, '8:54'),
    v('LdrBNhWw9AM', 'How to find the weighted mean', OCT, '22:50'),
  ],
  'valid-conclusions': [
    v('E91bGT9BjYk', 'How to spot a misleading graph', 'TED-Ed', '4:10'),
    v('sxYrzzy3cq8', 'How statistics can be misleading', 'TED-Ed', '4:19'),
    v('ROpbdO-gRUo', 'Correlation and causality', KA, '10:45'),
  ],
  'ml-basics': [
    v('Gv9_4yMHFhI', 'A gentle introduction to machine learning', SQ, '12:45'),
    v('W01tIRP_Rqs', 'Supervised vs. unsupervised learning', 'IBM Technology', '7:08'),
    v('4qVRBYAdLAo', 'Supervised learning: Crash Course AI #2', 'CrashCourse', '15:23'),
  ],
  'training-generalisation': [
    v('EuBBz3bI-aA', 'Machine learning fundamentals: bias and variance', SQ, '6:36'),
    v('fSytzGwwBVw', 'Machine learning fundamentals: cross validation', SQ, '6:05'),
  ],
  'regression-gradient-descent': [
    v('qg4PchTECck', 'Gradient descent in 3 minutes', 'Visually Explained', '3:07'),
    v('nk2CQITm_eo', 'Linear regression, clearly explained', SQ, '27:27'),
    v('sDv4f4s2SB8', 'Gradient descent, step-by-step', SQ, '23:54'),
    v('yIYKR4sgzI8', 'Logistic regression', SQ, '8:48'),
  ],
  'evaluation-metrics': [
    v('Kdsp6soqA7o', 'Machine learning fundamentals: the confusion matrix', SQ, '7:13'),
    v('vP06aMoz4v8', 'Machine learning fundamentals: sensitivity and specificity', SQ, '11:47'),
  ],
  'classic-algorithms': [
    v('HVXime0nQeI', 'K-nearest neighbors, clearly explained', SQ, '5:30'),
    v('4b5d3muPQmA', 'K-means clustering', SQ, '8:30'),
    v('_L39rN6gz7Y', 'Decision and classification trees, clearly explained', SQ, '18:08'),
    v('u4IxOk2ijSs', 'The Gini impurity index explained in 8 minutes', 'Luis Serrano', '8:39'),
  ],
  'neural-networks': [
    v('aircAruvnKk', 'But what is a neural network?', B3, '18:40'),
    v('CqOfi41LfDw', 'The essential main ideas of neural networks', SQ, '18:54'),
    v('Ilg3gGewQ5U', 'Backpropagation, intuitively', B3, '12:47'),
  ],
};
