// The syllabus tree: area -> topic -> subtopic.
// Areas and topics mirror MBZUAI's published list for the BSc screening exam exactly.
// Subtopics are this app's own breakdown; each has one lesson, a static question file and generators.
import type { AreaId } from './types';

export interface Subtopic {
  id: string;
  name: string;
  /** What the subtopic covers (used for lesson scope and question writing). */
  covers: string;
}
export interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
}
export interface Area {
  id: AreaId;
  name: string;
  short: string;
  topics: Topic[];
}

export const SYLLABUS: Area[] = [
  {
    id: 'math',
    name: 'Math',
    short: 'Math',
    topics: [
      {
        id: 'algebra',
        name: 'Algebra',
        subtopics: [
          { id: 'linear-equations', name: 'Linear equations, inequalities & formulas', covers: 'Solving linear equations (incl. fractions and brackets), linear inequalities (flipping the sign when multiplying/dividing by a negative), rearranging formulas to change the subject, absolute value equations and inequalities.' },
          { id: 'quadratics', name: 'Quadratics & polynomials', covers: 'Factorising, the quadratic formula, completing the square, the discriminant and number of roots, sum and product of roots, quadratic inequalities, polynomial expansion, factor and remainder theorem, polynomial division basics.' },
          { id: 'simultaneous-equations', name: 'Simultaneous equations', covers: 'Two linear equations in two unknowns (elimination and substitution), linear + quadratic systems, three equations in three unknowns, word problems leading to systems, systems with no or infinitely many solutions.' },
          { id: 'indices-surds', name: 'Indices & surds', covers: 'Laws of indices, zero, negative and fractional indices, simplifying surds, multiplying and adding surds, rationalising denominators (incl. conjugates), standard form.' },
          { id: 'logs-exponentials', name: 'Logarithms & exponential equations', covers: 'Definition of a logarithm, log laws, change of base, natural log and e, solving exponential equations with logs, solving log equations (and rejecting invalid roots), exponential growth/decay models.' },
          { id: 'percentages-ratio', name: 'Percentages & ratio', covers: 'Percentage of an amount, percentage increase/decrease and multipliers, reverse percentages, successive percentage changes, compound interest, simple interest, sharing in a ratio, direct and inverse proportion, unit rates.' },
          { id: 'sequences-series', name: 'Sequences & series', covers: 'Arithmetic sequences (nth term, sum), geometric sequences (nth term, sum), sum to infinity of a geometric series and when it exists, sigma notation, finding terms from given information.' },
        ],
      },
      {
        id: 'functions',
        name: 'Functions',
        subtopics: [
          { id: 'domain-range', name: 'Domain, range & function notation', covers: 'Function notation f(x), evaluating functions, domain restrictions (division by zero, square roots, logs), range of common functions, piecewise functions, one-to-one functions.' },
          { id: 'composite-inverse', name: 'Composite & inverse functions', covers: 'Composite functions f(g(x)) and order of composition, finding inverse functions, domain/range swap, f(f^{-1}(x)) = x, graphs of inverses as reflections in y = x, self-inverse functions.' },
          { id: 'transformations', name: 'Transformations of graphs', covers: 'Translations f(x)+a and f(x+a), stretches af(x) and f(ax), reflections -f(x) and f(-x), combined transformations, effect on key points, vertex and asymptotes.' },
          { id: 'function-families', name: 'Linear, quadratic, exponential & log functions', covers: 'Gradient and intercepts of lines, parallel and perpendicular lines, vertex/axis of symmetry/roots of quadratics, exponential growth and decay graphs, asymptotes, logarithmic graphs, matching graphs to equations.' },
          { id: 'trig-functions', name: 'Trigonometry: radians, exact values & graphs', covers: 'Right-angled triangle trig (SOH CAH TOA), degrees and radians, arc length and sector area, the unit circle, exact values for 0, 30, 45, 60, 90 degrees, signs in quadrants, graphs of sin, cos and tan, amplitude and period, sine and cosine rules.' },
          { id: 'trig-equations', name: 'Trig identities & equations', covers: 'sin^2 + cos^2 = 1, tan = sin/cos, double-angle formulas, solving trig equations in a given interval (all solutions), equations reducible to quadratics, simultaneous systems in sin/cos/tan of unknown angles (like the official sample question).' },
        ],
      },
      {
        id: 'probability',
        name: 'Probability',
        subtopics: [
          { id: 'counting', name: 'Counting: factorials, permutations & combinations', covers: 'Factorials, the multiplication principle, permutations nPr, combinations nCr, arrangements with repeated letters, arrangements with restrictions (together/apart), choosing committees, using counting to find probabilities.' },
          { id: 'probability-basics', name: 'Probability basics', covers: 'Sample spaces, equally likely outcomes, complement rule, two dice / coins / cards, mutually exclusive events, independent events, the addition rule P(A or B), Venn diagram probabilities, "at least one" problems.' },
          { id: 'conditional-probability', name: 'Conditional probability, trees & Bayes', covers: 'Conditional probability P(A|B), drawing with and without replacement, tree diagrams, two-way tables, the law of total probability, Bayes theorem (e.g. medical tests, false positives).' },
          { id: 'expected-binomial', name: 'Expected value & binomial distribution', covers: 'Discrete random variables and probability tables, expected value E(X), fair games, variance of a discrete variable, binomial distribution conditions, binomial probabilities, mean np and variance np(1-p).' },
        ],
      },
      {
        id: 'statistics',
        name: 'Statistics',
        subtopics: [
          { id: 'descriptive-stats', name: 'Averages, quartiles & spread', covers: 'Mean, median, mode, range, quartiles and IQR, outliers via the 1.5 x IQR rule, box plots, which average to use, effect of adding/removing a value on the mean, finding a missing value from a given mean, mean from frequency tables.' },
          { id: 'variance-sd', name: 'Variance, standard deviation & transformations', covers: 'Population variance and standard deviation, the computational formula, sample vs population (n vs n-1) idea, effect of adding a constant or multiplying by a constant on mean, SD and variance, comparing spread.' },
          { id: 'correlation-normal', name: 'Correlation, z-scores & the normal distribution', covers: 'Scatter plots, positive/negative/no correlation, correlation coefficient r range and meaning, correlation is not causation, line of best fit, z-scores, the normal distribution and the 68-95-99.7 rule, comparing scores using z-scores.' },
        ],
      },
      {
        id: 'matrices-vectors',
        name: 'Matrix and Vectors',
        subtopics: [
          { id: 'matrix-operations', name: 'Matrix operations', covers: 'Matrix dimensions, addition and scalar multiplication, matrix multiplication and when it is defined, dimensions of products, non-commutativity, transpose and (AB)^T = B^T A^T, identity matrix, symmetric matrices, diagonal matrices.' },
          { id: 'determinants-inverses', name: 'Determinants, inverses & linear systems', covers: 'Determinant of 2x2 and 3x3 matrices, inverse of a 2x2 matrix, invertible vs singular matrices, det(AB) = det(A)det(B), det(kA), solving linear systems with matrices (AX = B), number of solutions.' },
          { id: 'rank-eigen', name: 'Rank, eigenvalues & eigenvectors', covers: 'Rank as number of linearly independent rows/columns, rank of simple matrices, eigenvalues of 2x2 matrices via the characteristic equation, eigenvectors, eigenvalues of triangular/diagonal matrices, trace = sum and determinant = product of eigenvalues.' },
          { id: 'vectors', name: 'Vectors', covers: 'Vector addition and scalar multiples, magnitude, unit vectors, the dot product, angle between vectors, orthogonality, position vectors and midpoints, linear combinations, linear independence of vectors.' },
        ],
      },
      {
        id: 'calculus',
        name: 'Calculus',
        subtopics: [
          { id: 'limits', name: 'Limits', covers: 'Evaluating limits by substitution, factorising to remove 0/0, limits at infinity of rational functions, standard limits like sin(x)/x and (1+1/n)^n, one-sided limits idea, the definition of the derivative as a limit (first principles).' },
          { id: 'differentiation', name: 'Differentiation rules', covers: 'Power rule, derivatives of e^x, ln x, sin x, cos x, product rule, quotient rule, chain rule, derivatives of combinations, evaluating a derivative at a point, the second derivative.' },
          { id: 'derivative-applications', name: 'Tangents, stationary points & optimisation', covers: 'Equation of a tangent (and normal) line, increasing and decreasing functions, stationary points and their nature (second derivative test), maximum and minimum values, optimisation word problems, rates of change.' },
          { id: 'partial-derivatives', name: 'Partial derivatives & gradients', covers: 'Functions of two variables, partial derivatives, mixed partial derivatives, the gradient vector, evaluating a gradient at a point, gradient descent update step w := w - (learning rate) * gradient, direction of steepest ascent/descent.' },
          { id: 'integration', name: 'Integration & area', covers: 'Indefinite integrals and +C, reverse power rule, integrals of e^x, 1/x, sin, cos, definite integrals, area under a curve, area below the x-axis is negative, simple substitution of the form f(ax+b).' },
        ],
      },
      {
        id: 'discrete',
        name: 'Discrete Mathematics',
        subtopics: [
          { id: 'sets-venn', name: 'Sets & Venn diagrams', covers: 'Set notation, union, intersection, complement, difference, subsets and the number of subsets 2^n, cardinality, inclusion-exclusion for two and three sets, Venn diagram word problems.' },
          { id: 'propositional-logic', name: 'Propositional logic & truth tables', covers: 'Propositions, negation, conjunction, disjunction, implication, biconditional, truth tables, converse, inverse, contrapositive, tautologies and contradictions, De Morgan laws, logical equivalence.' },
          { id: 'number-bases', name: 'Number bases', covers: 'Binary, octal, decimal and hexadecimal conversions, place value, binary addition, bits and bytes, number of values representable with n bits, two\'s complement basics, bit shifts as multiply/divide by 2.' },
          { id: 'modular-arithmetic', name: 'Modular arithmetic, divisibility & primes', covers: 'Remainders and the mod operation, congruences, last digits and cyclic patterns of powers, divisibility rules, primes and prime factorisation, HCF/GCD and LCM, Euclidean algorithm, counting divisors.' },
          { id: 'recurrence-relations', name: 'Recurrence relations', covers: 'Defining sequences recursively, computing terms from a recurrence, Fibonacci-type recurrences, converting simple recurrences to closed form (arithmetic, geometric, a_n = r*a_{n-1} + d), recurrences arising from counting problems, recursive algorithm step counts.' },
          { id: 'graph-theory', name: 'Graph theory basics', covers: 'Vertices, edges, degree, handshake lemma (sum of degrees = 2E), paths and cycles, connected graphs, trees (E = V - 1), complete graphs and K_n edge count, directed graphs, adjacency matrices, Euler paths idea, shortest path by inspection.' },
          { id: 'pigeonhole-counting', name: 'Pigeonhole & counting principles', covers: 'Sum and product rules, counting passwords/codes/license plates, inclusion-exclusion counting, complementary counting, pigeonhole principle (basic and generalised), handshakes and pairs, counting paths on a grid.' },
        ],
      },
    ],
  },
  {
    id: 'ctl',
    name: 'Computational Thinking & Logic',
    short: 'CT & Logic',
    topics: [
      {
        id: 'logic',
        name: 'Logic',
        subtopics: [
          { id: 'deductive-reasoning', name: 'Deductive reasoning & syllogisms', covers: 'Syllogisms (all/some/no), valid vs invalid conclusions, necessary vs sufficient conditions, if-then reasoning (modus ponens/tollens, affirming the consequent fallacy), deducing facts from a set of clues.' },
          { id: 'knights-knaves', name: 'Truth-tellers & liars', covers: 'Knights (always tell the truth) and knaves (always lie) puzzles, case analysis, self-referential statements, "exactly one is lying" puzzles, finding who did it from statements.' },
          { id: 'ordering-puzzles', name: 'Ordering & arrangement puzzles', covers: 'Ranking and ordering from clues (taller than, finished before), seating arrangements in a row or circle, matching people to attributes with grids, counting valid arrangements under constraints.' },
          { id: 'boolean-logic', name: 'Boolean logic & equivalence', covers: 'AND, OR, NOT, XOR, NAND, NOR, evaluating Boolean expressions, logic gate circuits, truth tables for expressions, De Morgan laws, simplifying expressions, logical equivalence, Python boolean operators and short-circuiting idea.' },
        ],
      },
      {
        id: 'patterns',
        name: 'Pattern Recognition',
        subtopics: [
          { id: 'number-sequences', name: 'Number sequences', covers: 'Linear, quadratic (second differences), geometric, Fibonacci-like, alternating and interleaved sequences, squares/cubes/primes/triangular numbers, finding the nth term or next term, missing terms.' },
          { id: 'letter-symbol-patterns', name: 'Letter, symbol & grid patterns', covers: 'Letter sequences using alphabet positions, coding/decoding (shift ciphers, letter-to-number codes), symbol patterns, 3x3 grid/matrix patterns where rows or columns follow a rule.' },
          { id: 'odd-one-out', name: 'Rules from examples & odd one out', covers: 'Inferring a rule from input-output examples (function machines), applying an inferred rule, finding the odd one out in numbers, words or shapes described in text, analogies (A is to B as C is to ?).' },
          { id: 'rates-clocks', name: 'Rates, work & clock problems', covers: 'Speed-distance-time, relative speed and catch-up problems, work-rate problems (people/pipes working together), clock-angle problems, time and calendar puzzles, unit rates and proportional reasoning.' },
        ],
      },
    ],
  },
  {
    id: 'prog',
    name: 'Programming Fundamentals',
    short: 'Programming',
    topics: [
      {
        id: 'syntax',
        name: 'Basic Syntax Concepts',
        subtopics: [
          { id: 'variables-operators', name: 'Variables, types & operators', covers: 'Variables and assignment, int/float/str/bool types, type conversion, integer vs float division, // and % (incl. negative numbers), ** and operator precedence, augmented assignment, multiple assignment and swapping, predicting output.' },
          { id: 'strings', name: 'Strings', covers: 'Indexing (incl. negative), slicing with steps and reversing, len, concatenation and repetition, string methods (upper, lower, strip, split, join, replace, find, count), immutability, f-strings, iterating over strings.' },
          { id: 'conditionals', name: 'Booleans & conditionals', covers: 'Comparison operators, and/or/not, truthiness of values (0, empty string, empty list, None), if/elif/else order of checking, nested conditions, chained comparisons, short-circuit evaluation, predicting output of branching code.' },
          { id: 'loops', name: 'Loops', covers: 'for loops over ranges and collections, range(start, stop, step), while loops, counting iterations, accumulators, nested loops, break and continue, loop else idea, off-by-one errors, predicting output of loops.' },
        ],
      },
      {
        id: 'py-functions',
        name: 'Functions',
        subtopics: [
          { id: 'functions-scope', name: 'Functions, parameters & scope', covers: 'Defining and calling functions, return vs print, returning None, positional and keyword arguments, default arguments (incl. the mutable default trap), local vs global scope, functions as values, lambda, map/filter/sorted with key.' },
          { id: 'recursion', name: 'Recursion', covers: 'Base case and recursive case, factorial, Fibonacci, sum of digits, power, tracing recursive calls and the call stack, counting calls, missing base case and infinite recursion, recursion vs iteration.' },
        ],
      },
      {
        id: 'data-structures',
        name: 'Basic Data Structures',
        subtopics: [
          { id: 'lists-tuples', name: 'Lists, tuples & copying', covers: 'List indexing and slicing, append/extend/insert/pop/remove, list comprehensions, nested lists, tuples and immutability, unpacking, mutability and aliasing (y = x), shallow vs deep copy, sorting (sort vs sorted).' },
          { id: 'dicts-sets', name: 'Dictionaries, sets & hashing', covers: 'Dictionary creation, access, get with default, updating, iterating keys/values/items, counting with dictionaries, sets and set operations (union, intersection, difference), removing duplicates, hash tables and average O(1) lookup, hashable keys.' },
          { id: 'stacks-queues', name: 'Stacks, queues & linked lists', covers: 'Stack (LIFO) push/pop, queue (FIFO) enqueue/dequeue, tracing sequences of operations, using a stack for bracket matching and reversing, postfix evaluation, linked lists (nodes and pointers), insertion/deletion costs, circular queues idea.' },
          { id: 'trees', name: 'Binary trees & traversals', covers: 'Tree terminology (root, leaf, height, depth), binary trees, max nodes at a level and in a tree of height h, binary search trees (insertion, search), in-order/pre-order/post-order and level-order traversals, heaps basic idea.' },
        ],
      },
      {
        id: 'algorithms',
        name: 'Algorithmic Problem Solving',
        subtopics: [
          { id: 'searching-sorting', name: 'Searching & sorting', covers: 'Linear search, binary search (and its precondition), number of comparisons, bubble sort passes, selection sort, insertion sort, merge sort, the state of a list after k passes, stability idea, best/worst cases.' },
          { id: 'complexity', name: 'Big-O complexity & choosing data structures', covers: 'Big-O notation, ranking growth rates, complexity of loops and nested loops, loops that halve, complexity of common operations on lists/dicts/sets, complexity of searches and sorts, choosing the right data structure for a task.' },
          { id: 'tracing-pseudocode', name: 'Tracing, pseudocode & debugging', covers: 'Reading language-neutral pseudocode, tracing variables through a trace table, converting between for and while loops (like the official sample), counting loop iterations, finding and fixing bugs (off-by-one, wrong condition, missing update), what an algorithm computes.' },
        ],
      },
    ],
  },
  {
    id: 'data',
    name: 'Data & AI Reasoning',
    short: 'Data & AI',
    topics: [
      {
        id: 'data-interpretation',
        name: 'Data Interpretation',
        subtopics: [
          { id: 'reading-charts', name: 'Reading tables & charts', covers: 'Reading values from tables, bar charts, line graphs, scatter plots, pie charts and histograms, comparing categories, finding the largest increase, reading trends.' },
          { id: 'data-calculations', name: 'Percentage change & averages from data', covers: 'Percentage change between values, percentage share, averages from frequency tables and charts, weighted averages, estimating means from grouped data, ratios and rates from data.' },
          { id: 'valid-conclusions', name: 'Misleading graphs & valid conclusions', covers: 'Truncated axes, distorted scales, cherry-picked ranges, correlation vs causation, sample size and sampling bias, which conclusion is supported by the data, Simpson-style aggregation surprises.' },
        ],
      },
      {
        id: 'machine-learning',
        name: 'Basic Machine Learning Concepts',
        subtopics: [
          { id: 'ml-basics', name: 'What ML is: learning types & tasks', covers: 'What machine learning is, supervised vs unsupervised vs reinforcement learning, regression vs classification vs clustering, features and labels, examples of tasks, data bias and fairness, ethics and privacy.' },
          { id: 'training-generalisation', name: 'Training, overfitting & validation', covers: 'Training/validation/test sets and their purposes, overfitting and underfitting, the bias-variance trade-off, cross-validation (k-fold), data leakage, regularisation idea, feature scaling (min-max, standardisation).' },
          { id: 'regression-gradient-descent', name: 'Regression, loss & gradient descent', covers: 'Linear regression predictions y = wx + b, logistic regression and the sigmoid for classification, MSE and cross-entropy loss, computing MSE, gradient descent (derivative of the loss with respect to the weights), update rule, learning rate too big/too small.' },
          { id: 'evaluation-metrics', name: 'Confusion matrix & evaluation metrics', covers: 'Confusion matrix (TP, FP, FN, TN), accuracy, precision, recall, F1 score, why accuracy misleads on imbalanced data, choosing precision vs recall for a task, threshold effects.' },
          { id: 'classic-algorithms', name: 'k-NN, k-means & decision trees', covers: 'k-nearest neighbours classification with distances, effect of k, k-means clustering steps and centroid updates, decision tree splits, Gini impurity and entropy calculations, choosing the best split.' },
          { id: 'neural-networks', name: 'Neural networks basics', covers: 'Artificial neurons (weighted sum + bias + activation), computing a neuron output, activation functions (step, sigmoid, ReLU, tanh), layers, counting parameters (weights and biases), forward pass, why non-linearity is needed, training by backpropagation idea.' },
        ],
      },
    ],
  },
];

export interface SubtopicInfo extends Subtopic {
  area: Area;
  topic: Topic;
}

export const SUBTOPICS: SubtopicInfo[] = SYLLABUS.flatMap((area) =>
  area.topics.flatMap((topic) => topic.subtopics.map((s) => ({ ...s, area, topic }))),
);

const byId = new Map(SUBTOPICS.map((s) => [s.id, s]));

export function subtopicInfo(id: string): SubtopicInfo {
  const s = byId.get(id);
  if (!s) throw new Error(`Unknown subtopic: ${id}`);
  return s;
}

export function hasSubtopic(id: string): boolean {
  return byId.has(id);
}

export const AREA_BY_ID = new Map(SYLLABUS.map((a) => [a.id, a]));
