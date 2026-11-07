import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';
import { det, dot, norm, rank, round } from '../../../lib/mathx';

/** Column vector in LaTeX (pmatrix, the IB style). Entries are numbers or ready-made LaTeX. */
const col = (...xs: (number | string)[]) => `\\begin{pmatrix} ${xs.join(' \\\\ ')} \\end{pmatrix}`;
/** Inline maths column vector. */
const cv = (...xs: (number | string)[]) => `$${col(...xs)}$`;
/** Comparable string value of a numeric vector. */
const vs = (xs: number[]) => xs.join(',');
/** Comparable string value of a vector of exact fractions. */
const fs = (xs: Frac[]) => xs.map((f) => f.toString()).join(',');
const deg = (rad: number) => (rad * 180) / Math.PI;

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'vectors-001',
    subtopic: 'vectors',
    difficulty: 'foundation',
    stem: `Given $\\mathbf{a} = ${col(3, -1, 2)}$ and $\\mathbf{b} = ${col(1, 4, -2)}$, find $2\\mathbf{a} - \\mathbf{b}$.`,
    options: [cv(7, 2, 2), cv(4, -10, 8), cv(5, -6, 6), cv(5, -6, 2)],
    correctIndex: 2,
    markScheme: {
      asking: 'What vector do you get when you double $\\mathbf{a}$ and then take away $\\mathbf{b}$?',
      solution:
        'A **vector** here is a column of numbers, called **components**. To multiply a vector by a number, multiply every component: $2\\mathbf{a} = \\begin{pmatrix} 2 \\times 3 \\\\ 2 \\times (-1) \\\\ 2 \\times 2 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ -2 \\\\ 4 \\end{pmatrix}$.\n\n' +
        'Only $\\mathbf{a}$ is doubled, so $\\mathbf{b}$ stays as it is.\n\n' +
        'To subtract vectors, subtract matching components, top from top and so on. In the bottom row, taking away a negative means adding, so $4 - (-2) = 4 + 2$.\n\n' +
        'Work through the three components:\n\n| Component | $2\\mathbf{a}$ minus $\\mathbf{b}$ | Result |\n|---|---|---|\n| Top | $6 - 1$ | $5$ |\n| Middle | $-2 - 4$ | $-6$ |\n| Bottom | $4 - (-2)$ | $6$ |',
      conclusion: 'Stacking the three results gives $\\begin{pmatrix} 5 \\\\ -6 \\\\ 6 \\end{pmatrix}$.',
      whyWrong: [
        'This is $2\\mathbf{a} + \\mathbf{b}$: the vectors were added instead of subtracted.',
        'This is $2(\\mathbf{a} - \\mathbf{b}) = 2\\mathbf{a} - 2\\mathbf{b}$: the 2 was applied to $\\mathbf{b}$ as well, but only $\\mathbf{a}$ is doubled.',
        null,
        'This treats $4 - (-2)$ as $4 - 2 = 2$ in the last component. Subtracting a negative number means adding it.',
      ],
      keyIdea: 'For a combination such as $p\\mathbf{a} - q\\mathbf{b}$, work one row at a time: $p$ times the entry of $\\mathbf{a}$, minus $q$ times the entry of $\\mathbf{b}$. Bracket negative components to keep their signs.',
    },
    check: {
      optionValues: [vs([7, 2, 2]), vs([4, -10, 8]), vs([5, -6, 6]), vs([5, -6, 2])],
      compute: () => {
        const a = [3, -1, 2];
        const b = [1, 4, -2];
        return vs(a.map((x, i) => 2 * x - b[i]));
      },
    },
  },
  {
    id: 'vectors-002',
    subtopic: 'vectors',
    difficulty: 'foundation',
    stem: `What is the magnitude of the vector $\\mathbf{v} = ${col(4, -4, 7)}$?`,
    options: ['$81$', '$9$', '$15$', '$7$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How long is the vector $\\mathbf{v}$?',
      solution:
        'The **magnitude** $|\\mathbf{v}|$ of a vector is its length. For components $x$, $y$ and $z$, Pythagoras\' theorem gives $|\\mathbf{v}| = \\sqrt{x^{2} + y^{2} + z^{2}}$.\n\n' +
        'Substitute $x = 4$, $y = -4$ and $z = 7$. Squares are never negative, so $(-4)^{2} = 16$. That gives $\\sqrt{4^{2} + (-4)^{2} + 7^{2}} = \\sqrt{16 + 16 + 49}$.\n\n' +
        'Add under the root: $16 + 16 + 49 = 81$. Then take the square root: $\\sqrt{81} = 9$.',
      conclusion: 'The squares add to 81, so the magnitude is $9$.',
      whyWrong: [
        'This is $|\\mathbf{v}|^2 = 81$: the square root at the end was forgotten.',
        null,
        'This adds the sizes of the components, $4 + 4 + 7 = 15$. Lengths in different directions combine by Pythagoras, not by simple addition.',
        'This treats $(-4)^2$ as $-16$, giving $\\sqrt{16 - 16 + 49} = \\sqrt{49} = 7$ (it is also what you get by just adding the components, $4 - 4 + 7$). A square is never negative.',
      ],
      keyIdea: 'To find a magnitude: square each component, add the squares, then take the square root. Do the three stages in that order, and never add the components themselves.',
    },
    check: {
      optionValues: [81, 9, 15, 7],
      compute: () => norm([4, -4, 7]),
    },
  },
  {
    id: 'vectors-003',
    subtopic: 'vectors',
    difficulty: 'foundation',
    stem: `Which of the following is the unit vector in the **same direction** as $\\mathbf{v} = ${col(3, -4)}$?`,
    options: [
      cv('-\\frac{3}{5}', '\\frac{4}{5}'),
      cv('\\frac{3}{7}', '-\\frac{4}{7}'),
      cv('\\frac{3}{25}', '-\\frac{4}{25}'),
      cv('\\frac{3}{5}', '-\\frac{4}{5}'),
    ],
    correctIndex: 3,
    markScheme: {
      asking: 'Which vector of length 1 points the same way as $\\mathbf{v}$?',
      solution:
        'A **unit vector** has length (magnitude) exactly 1. To get one pointing the same way as $\\mathbf{v}$, shrink $\\mathbf{v}$ by dividing it by its own length.\n\n' +
        'Find the length with Pythagoras\' theorem: $|\\mathbf{v}| = \\sqrt{3^{2} + (-4)^{2}} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.\n\n' +
        'Divide each component by 5, keeping the signs: $\\frac{\\mathbf{v}}{|\\mathbf{v}|} = \\begin{pmatrix} \\frac{3}{5} \\\\ -\\frac{4}{5} \\end{pmatrix}$.',
      conclusion: 'Its squares add to $\\frac{9}{25} + \\frac{16}{25} = 1$ and its signs match $\\mathbf{v}$, so the answer is $\\begin{pmatrix} \\frac{3}{5} \\\\ -\\frac{4}{5} \\end{pmatrix}$.',
      whyWrong: [
        'This vector has length 1 but points the **opposite** way: it is $-\\frac{\\mathbf{v}}{|\\mathbf{v}|}$. The signs must match those of $\\mathbf{v}$.',
        'This divides by $3 + 4 = 7$, the sum of the component sizes, instead of the magnitude 5. Its length is not 1.',
        'This divides by $|\\mathbf{v}|^2 = 25$ instead of $|\\mathbf{v}| = 5$. Its length is $\\frac{1}{5}$, not 1.',
        null,
      ],
      keyIdea: 'Unit vector = vector divided by its magnitude. The signs stay the same. To test your result, square its components and add them: the total must be 1.',
    },
    check: {
      optionValues: [
        fs([new Frac(-3, 5), new Frac(4, 5)]),
        fs([new Frac(3, 7), new Frac(-4, 7)]),
        fs([new Frac(3, 25), new Frac(-4, 25)]),
        fs([new Frac(3, 5), new Frac(-4, 5)]),
      ],
      compute: () => {
        const v = [3, -4];
        const n = norm(v); // exactly 5
        return fs(v.map((x) => new Frac(x, n)));
      },
    },
  },
  {
    id: 'vectors-004',
    subtopic: 'vectors',
    difficulty: 'foundation',
    stem: `Find the dot product $\\mathbf{a} \\cdot \\mathbf{b}$ where $\\mathbf{a} = ${col(2, -3, 5)}$ and $\\mathbf{b} = ${col(4, 1, -2)}$.`,
    options: ['$21$', '$1$', cv(8, -3, -10), '$-5$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What single number is the dot product of these two vectors?',
      solution:
        'The **dot product** $\\mathbf{a} \\cdot \\mathbf{b}$ multiplies matching components and adds the results. The answer is one number, not a vector.\n\n' +
        'Multiply each matching pair: $2 \\times 4 = 8$, then $(-3) \\times 1 = -3$, then $5 \\times (-2) = -10$.\n\n' +
        'Add the three results, keeping their signs: $8 - 3 - 10 = -5$.',
      conclusion: 'The three products add up to a dot product of $-5$.',
      whyWrong: [
        'This adds the sizes of the products, $8 + 3 + 10 = 21$, ignoring their signs.',
        'This treats $(-3)(1)$ as $+3$, giving $8 + 3 - 10 = 1$. A negative times a positive is negative.',
        'This multiplies the components but never adds them up. The dot product is a number, not a vector.',
        null,
      ],
      keyIdea: 'Dot product: top times top, plus middle times middle, plus bottom times bottom. Bracket negatives and add with their signs. If you end with a vector, you forgot to add.',
    },
    check: {
      optionValues: [21, 1, null, -5],
      compute: () => dot([2, -3, 5], [4, 1, -2]),
    },
  },
  {
    id: 'vectors-005',
    subtopic: 'vectors',
    difficulty: 'foundation',
    stem: `Which of these vectors is **perpendicular** to $${col(2, 3)}$?`,
    options: [cv(3, 2), cv(-2, -3), cv(6, -4), cv(2, -3)],
    correctIndex: 2,
    markScheme: {
      asking: 'Which vector makes a right angle with $\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$?',
      solution:
        '**Perpendicular** means at right angles. Two vectors are perpendicular exactly when their **dot product** is 0. The dot product multiplies matching components and adds the results.\n\n' +
        'Find the dot product of $\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$ with each vector:\n\n| Vector | Working | Dot product |\n|---|---|---|\n| $\\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix}$ | $2 \\times 3 + 3 \\times 2$ | $12$ |\n| $\\begin{pmatrix} -2 \\\\ -3 \\end{pmatrix}$ | $2 \\times (-2) + 3 \\times (-3)$ | $-13$ |\n| $\\begin{pmatrix} 2 \\\\ -3 \\end{pmatrix}$ | $2 \\times 2 + 3 \\times (-3)$ | $-5$ |\n| $\\begin{pmatrix} 6 \\\\ -4 \\end{pmatrix}$ | $2 \\times 6 + 3 \\times (-4)$ | $0$ |',
      conclusion: 'Only one dot product is 0, so the perpendicular vector is $\\begin{pmatrix} 6 \\\\ -4 \\end{pmatrix}$.',
      whyWrong: [
        'This swaps the two components but forgets to change a sign; its dot product with the vector is $12$, not $0$.',
        'This is $-1$ times the original vector, so it is **parallel** (pointing the opposite way), not perpendicular.',
        null,
        'This only changes the sign of one component without swapping them; the dot product is $4 - 9 = -5$, not $0$.',
      ],
      keyIdea: 'To test for perpendicular, find the dot product and look for 0. To build one with two components, swap them and change one sign: $(2, 3)$ gives $(3, -2)$, and any multiple works too.',
    },
    check: {
      optionValues: [vs([3, 2]), vs([-2, -3]), vs([6, -4]), vs([2, -3])],
      compute: () => {
        const v = [2, 3];
        const candidates = [
          [3, 2],
          [-2, -3],
          [6, -4],
          [2, -3],
        ];
        const hits = candidates.filter((c) => dot(c, v) === 0);
        return hits.length === 1 ? vs(hits[0]) : 'none or several';
      },
    },
  },
  {
    id: 'vectors-006',
    subtopic: 'vectors',
    difficulty: 'foundation',
    stem: `Which of the following vectors is **parallel** to $${col(2, -6, 4)}$?`,
    options: [cv(1, 3, 2), cv(-1, 3, -2), cv(3, -5, 5), cv(1, -3, -2)],
    correctIndex: 1,
    markScheme: {
      asking: 'Which vector lies along the same line as $\\begin{pmatrix} 2 \\\\ -6 \\\\ 4 \\end{pmatrix}$?',
      solution:
        'Two vectors are **parallel** when one is a number times the other. That number can be negative, which just means pointing the opposite way along the same line.\n\n' +
        'To test this, divide each component by the matching component of the given vector. If all three divisions give the same number, the vectors are parallel.\n\n' +
        'Do this for each vector:\n\n| Vector | Top $\\div 2$ | Middle $\\div (-6)$ | Bottom $\\div 4$ | All equal? |\n|---|---|---|---|---|\n| $\\begin{pmatrix} 1 \\\\ 3 \\\\ 2 \\end{pmatrix}$ | $\\frac{1}{2}$ | $-\\frac{1}{2}$ | $\\frac{1}{2}$ | No |\n| $\\begin{pmatrix} 3 \\\\ -5 \\\\ 5 \\end{pmatrix}$ | $\\frac{3}{2}$ | $\\frac{5}{6}$ | $\\frac{5}{4}$ | No |\n| $\\begin{pmatrix} 1 \\\\ -3 \\\\ -2 \\end{pmatrix}$ | $\\frac{1}{2}$ | $\\frac{1}{2}$ | $-\\frac{1}{2}$ | No |\n| $\\begin{pmatrix} -1 \\\\ 3 \\\\ -2 \\end{pmatrix}$ | $-\\frac{1}{2}$ | $-\\frac{1}{2}$ | $-\\frac{1}{2}$ | Yes |',
      conclusion: 'Only one vector gives the same number, $-\\frac{1}{2}$, in all three places. So the parallel vector is $\\begin{pmatrix} -1 \\\\ 3 \\\\ -2 \\end{pmatrix}$.',
      whyWrong: [
        'This halves the sizes of the components but drops the minus sign on the middle one. All three components must be multiplied by the same number, sign included.',
        null,
        'This adds 1 to every component. Adding the same number does not keep the direction; only multiplying by the same number does.',
        'The first two components are half of the original, but the last one has the wrong sign ($-2$ instead of $2$), so the ratios are not all equal.',
      ],
      keyIdea: 'To test for parallel, divide matching components. All the results must be equal, signs included. Multiplying keeps a direction, but adding the same number to each component doesn\'t.',
    },
    check: {
      optionValues: [vs([1, 3, 2]), vs([-1, 3, -2]), vs([3, -5, 5]), vs([1, -3, -2])],
      compute: () => {
        const v = [2, -6, 4];
        const candidates = [
          [1, 3, 2],
          [-1, 3, -2],
          [3, -5, 5],
          [1, -3, -2],
        ];
        // parallel <=> the 2 x 3 matrix [v; c] has rank 1
        const hits = candidates.filter((c) => rank([v, c]) === 1);
        return hits.length === 1 ? vs(hits[0]) : 'none or several';
      },
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'vectors-007',
    subtopic: 'vectors',
    difficulty: 'exam',
    stem: `Points $A$ and $B$ have position vectors $\\mathbf{a} = ${col(2, -1, 5)}$ and $\\mathbf{b} = ${col(6, 7, -3)}$. What is the position vector of the midpoint $M$ of $AB$?`,
    options: [cv(4, 3, 1), cv(2, 4, -4), cv(8, 6, 2), cv(4, 8, -8)],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the position vector of the point halfway between $A$ and $B$?',
      solution:
        'A **position vector** gives a point\'s location, measured from the origin (the point where all coordinates are 0). The **midpoint** $M$ is the point exactly halfway between $A$ and $B$.\n\n' +
        'Halfway means the average, so the formula is $\\mathbf{m} = \\frac{1}{2}(\\mathbf{a} + \\mathbf{b})$: add the two position vectors, then halve.\n\n' +
        'Add matching components: $\\mathbf{a} + \\mathbf{b} = \\begin{pmatrix} 2 + 6 \\\\ -1 + 7 \\\\ 5 + (-3) \\end{pmatrix} = \\begin{pmatrix} 8 \\\\ 6 \\\\ 2 \\end{pmatrix}$.\n\n' +
        'Halve each component: $\\frac{1}{2}\\begin{pmatrix} 8 \\\\ 6 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 3 \\\\ 1 \\end{pmatrix}$.',
      conclusion: 'Each component is the average of the two points, so $M$ has position vector $\\begin{pmatrix} 4 \\\\ 3 \\\\ 1 \\end{pmatrix}$.',
      whyWrong: [
        null,
        'This is $\\frac{1}{2}(\\mathbf{b} - \\mathbf{a})$, half of the vector $\\overrightarrow{AB}$. That is the step from $A$ to $M$, not the position of $M$. Add it to $\\mathbf{a}$ to get $M$.',
        'This is $\\mathbf{a} + \\mathbf{b}$: the sum was not halved.',
        'This is $\\overrightarrow{AB} = \\mathbf{b} - \\mathbf{a}$, the vector from $A$ to $B$, not a position vector of a point.',
      ],
      keyIdea: 'Midpoint = average of the two points: add the position vectors and halve. Don\'t subtract: $\\mathbf{b} - \\mathbf{a}$ is the journey from $A$ to $B$, not a place.',
    },
    check: {
      optionValues: [vs([4, 3, 1]), vs([2, 4, -4]), vs([8, 6, 2]), vs([4, 8, -8])],
      compute: () => {
        const a = [2, -1, 5];
        const b = [6, 7, -3];
        return vs(a.map((x, i) => (x + b[i]) / 2));
      },
    },
  },
  {
    id: 'vectors-008',
    subtopic: 'vectors',
    difficulty: 'exam',
    stem: `Find the angle between $\\mathbf{a} = ${col(1, -1, 0)}$ and $\\mathbf{b} = ${col(0, 1, -1)}$.`,
    options: ['$\\frac{\\pi}{3}$', '$\\frac{3\\pi}{4}$', '$\\pi$', '$\\frac{2\\pi}{3}$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What size is the angle between these two vectors?',
      solution:
        'The **dot product** links two vectors to the angle $\\theta$ between them: $\\cos\\theta = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{a}|\\,|\\mathbf{b}|}$. Here $\\mathbf{a} \\cdot \\mathbf{b}$ means multiply matching components and add, and $|\\mathbf{a}|$ means the length of $\\mathbf{a}$.\n\n' +
        'Find the dot product. Matching components give $1 \\times 0 = 0$, then $(-1) \\times 1 = -1$, then $0 \\times (-1) = 0$. Adding them gives $\\mathbf{a} \\cdot \\mathbf{b} = -1$.\n\n' +
        'Find each length by squaring the components, adding and taking the square root. $|\\mathbf{a}| = \\sqrt{1 + 1} = \\sqrt{2}$ and $|\\mathbf{b}| = \\sqrt{1 + 1} = \\sqrt{2}$, since the zero components add nothing.\n\n' +
        'Substitute. Because $\\sqrt{2} \\times \\sqrt{2} = 2$, we get $\\cos\\theta = \\frac{-1}{2} = -\\frac{1}{2}$.\n\n' +
        'Find the angle. We know $\\cos\\frac{\\pi}{3} = \\frac{1}{2}$. A negative cosine means the angle is obtuse (more than a right angle), so take it away from $\\pi$: $\\theta = \\pi - \\frac{\\pi}{3} = \\frac{2\\pi}{3}$.',
      conclusion: '$\\cos\\theta = -\\frac{1}{2}$, and the obtuse angle with that cosine is $\\frac{2\\pi}{3}$.',
      whyWrong: [
        'This uses $\\cos\\theta = +\\frac{1}{2}$: the minus sign of the dot product was dropped. A negative dot product means an obtuse angle.',
        'This divides by only one magnitude, $\\sqrt{2}$, giving $\\cos\\theta = -\\frac{1}{\\sqrt{2}}$. You must divide by the **product** $|\\mathbf{a}|\\,|\\mathbf{b}| = 2$.',
        'This forgets to divide by the magnitudes, using $\\cos\\theta = -1$. That would mean the vectors point in exactly opposite directions, and these two don\'t.',
        null,
      ],
      keyIdea: 'Angle between vectors: find the dot product, find both lengths, then $\\cos\\theta$ = dot product $\\div$ (length $\\times$ length). If that is negative, the angle is obtuse: take the matching acute angle away from $\\pi$.',
    },
    check: {
      optionValues: [Math.PI / 3, (3 * Math.PI) / 4, Math.PI, (2 * Math.PI) / 3],
      compute: () => {
        const a = [1, -1, 0];
        const b = [0, 1, -1];
        return Math.acos(dot(a, b) / (norm(a) * norm(b)));
      },
    },
  },
  {
    id: 'vectors-009',
    subtopic: 'vectors',
    difficulty: 'exam',
    stem: `Find the angle between $\\mathbf{a} = ${col(1, 2, -2)}$ and $\\mathbf{b} = ${col(2, -1, 2)}$, in degrees to 1 decimal place.`,
    options: ['$63.6^\\circ$', '$116.4^\\circ$', '$131.8^\\circ$', '$-26.4^\\circ$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What is the angle between these two vectors, in degrees?',
      solution:
        'The **dot product** links two vectors to the angle $\\theta$ between them: $\\cos\\theta = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{a}|\\,|\\mathbf{b}|}$. Here $\\mathbf{a} \\cdot \\mathbf{b}$ means multiply matching components and add, and $|\\mathbf{a}|$ means the length of $\\mathbf{a}$.\n\n' +
        'Find the dot product: $1 \\times 2 + 2 \\times (-1) + (-2) \\times 2 = 2 - 2 - 4 = -4$.\n\n' +
        'Find each length by squaring the components, adding and taking the square root: $|\\mathbf{a}| = \\sqrt{1 + 4 + 4} = \\sqrt{9} = 3$ and $|\\mathbf{b}| = \\sqrt{4 + 1 + 4} = \\sqrt{9} = 3$.\n\n' +
        'Substitute into the formula: $\\cos\\theta = \\frac{-4}{3 \\times 3} = -\\frac{4}{9}$.\n\n' +
        'Undo the cosine with $\\cos^{-1}$ on a calculator in degree mode: $\\theta = \\cos^{-1}\\left(-\\frac{4}{9}\\right) \\approx 116.4^\\circ$.',
      conclusion: 'The dot product is negative, which fits an angle above $90^\\circ$, and the calculator gives $116.4^\\circ$.',
      whyWrong: [
        'This is $\\cos^{-1}\\left(\\frac{4}{9}\\right)$: the minus sign of the dot product was lost. It is the supplement of the right answer ($180^\\circ - 116.4^\\circ$).',
        null,
        'This divides by $|\\mathbf{a}| + |\\mathbf{b}| = 6$ instead of $|\\mathbf{a}| \\times |\\mathbf{b}| = 9$, giving $\\cos^{-1}\\left(-\\frac{2}{3}\\right)$.',
        'This uses $\\sin^{-1}$ instead of $\\cos^{-1}$. The angle between two vectors is always between $0^\\circ$ and $180^\\circ$, so a negative angle is impossible.',
      ],
      keyIdea: 'Angle between vectors: find the dot product and both lengths, then $\\cos\\theta$ = dot product $\\div$ (length $\\times$ length), then $\\cos^{-1}$. A negative dot product means an angle above $90^\\circ$.',
    },
    check: {
      optionValues: [63.6, 116.4, 131.8, -26.4],
      compute: () => {
        const a = [1, 2, -2];
        const b = [2, -1, 2];
        return round(deg(Math.acos(dot(a, b) / (norm(a) * norm(b)))), 1);
      },
    },
  },
  {
    id: 'vectors-010',
    subtopic: 'vectors',
    difficulty: 'exam',
    stem: `For what value of $k$ are the vectors $${col('k', 2, -1)}$ and $${col(3, 'k', 4)}$ perpendicular?`,
    options: ['$k = -\\frac{4}{5}$', '$k = \\frac{4}{3}$', '$k = \\frac{4}{5}$', '$k = 1$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What value of $k$ puts these two vectors at right angles?',
      solution:
        '**Perpendicular** means at right angles. Two vectors are perpendicular exactly when their **dot product** is 0. The dot product multiplies matching components and adds the results.\n\n' +
        'Multiply each matching pair: $k \\times 3 = 3k$, then $2 \\times k = 2k$, then $(-1) \\times 4 = -4$. Notice that $k$ appears in both vectors, so there are two $k$ terms.\n\n' +
        'Add them and set the total to 0: $3k + 2k - 4 = 0$. Collect the $k$ terms to get $5k - 4 = 0$.\n\n' +
        'Add 4 to both sides to get $5k = 4$. Divide both sides by 5 to get $k = \\frac{4}{5}$.',
      conclusion: 'With $k = \\frac{4}{5}$ the dot product is $4 - 4 = 0$, so the vectors are perpendicular.',
      whyWrong: [
        'This treats $(-1)(4)$ as $+4$, giving $5k + 4 = 0$. A negative times a positive is negative.',
        'This misses the middle term $2 \\times k$ (the $k$ appears in **both** vectors), solving $3k - 4 = 0$.',
        null,
        'This sets the dot product equal to 1 instead of 0 ($5k - 4 = 1$). Perpendicular vectors have dot product **zero**.',
      ],
      keyIdea: 'When you see perpendicular with an unknown: write the dot product with the unknown in it, set it to 0 and solve. Look out for the unknown appearing in both vectors.',
    },
    check: {
      optionValues: [-4 / 5, 4 / 3, 4 / 5, 1],
      compute: () => {
        // the dot product is linear in k: f(k) = f(0) + (f(1) - f(0)) k
        const f = (k: number) => dot([k, 2, -1], [3, k, 4]);
        return -f(0) / (f(1) - f(0));
      },
    },
  },
  {
    id: 'vectors-011',
    subtopic: 'vectors',
    difficulty: 'exam',
    stem: `Points $A$ and $B$ have position vectors $\\overrightarrow{OA} = ${col(1, 2)}$ and $\\overrightarrow{OB} = ${col(7, -1)}$. The point $P$ lies on the line segment $AB$ with $AP : PB = 2 : 1$. Find $\\overrightarrow{OP}$.`,
    options: [cv(3, 1), cv(5, 0), cv(4, '\\frac{1}{2}'), cv(13, -4)],
    correctIndex: 1,
    markScheme: {
      asking: 'Where is the point $P$ that splits the line from $A$ to $B$ in the ratio $2 : 1$?',
      solution:
        'The ratio $AP : PB = 2 : 1$ means cut $AB$ into $2 + 1 = 3$ equal parts. $P$ is 2 parts from $A$, so it is $\\frac{2}{3}$ of the way from $A$ to $B$.\n\n' +
        'Find the journey from $A$ to $B$, which is end minus start: $\\overrightarrow{AB} = \\begin{pmatrix} 7 - 1 \\\\ -1 - 2 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ -3 \\end{pmatrix}$.\n\n' +
        'Take $\\frac{2}{3}$ of that journey: $\\frac{2}{3}\\begin{pmatrix} 6 \\\\ -3 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ -2 \\end{pmatrix}$.\n\n' +
        'Start at $A$ and make that journey: $\\overrightarrow{OP} = \\begin{pmatrix} 1 + 4 \\\\ 2 + (-2) \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 0 \\end{pmatrix}$.',
      conclusion: 'Going $\\frac{2}{3}$ of the way from $A$ to $B$ lands on $\\begin{pmatrix} 5 \\\\ 0 \\end{pmatrix}$.',
      whyWrong: [
        'This goes only $\\frac{1}{3}$ of the way from $A$: it gives the point with $AP : PB = 1 : 2$, which is closer to $A$, not to $B$.',
        null,
        'This is the midpoint of $AB$, which would be the answer for a ratio of $1 : 1$.',
        'This adds $2\\overrightarrow{AB}$ instead of $\\frac{2}{3}\\overrightarrow{AB}$, landing beyond $B$ instead of on the segment. The 2 in the ratio is 2 parts out of $2 + 1 = 3$.',
      ],
      keyIdea: 'For a point dividing $AB$ in the ratio $m : n$, go $\\frac{m}{m + n}$ of the way along: $\\overrightarrow{OP} = \\overrightarrow{OA} + \\frac{m}{m + n}\\overrightarrow{AB}$. Add the ratio parts first.',
    },
    check: {
      optionValues: [vs([3, 1]), vs([5, 0]), vs([4, 0.5]), vs([13, -4])],
      compute: () => {
        const a = [1, 2];
        const b = [7, -1];
        const [m, n] = [2, 1];
        return vs(a.map((x, i) => (n * x + m * b[i]) / (m + n)));
      },
    },
  },
  {
    id: 'vectors-012',
    subtopic: 'vectors',
    difficulty: 'exam',
    stem: `Find the scalars $p$ and $q$ such that $p${col(1, 2)} + q${col(3, -1)} = ${col(0, 7)}$.`,
    options: ['$p = -1,\\ q = 3$', '$p = 3,\\ q = 1$', '$p = 0,\\ q = 7$', '$p = 3,\\ q = -1$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What numbers $p$ and $q$ make the two vectors combine to give $\\begin{pmatrix} 0 \\\\ 7 \\end{pmatrix}$?',
      solution:
        '$p$ and $q$ are **scalars**, which means ordinary numbers. Each one multiplies a whole vector. So the top row of the left side is $p + 3q$, and the bottom row is $2p - q$.\n\n' +
        'Two vectors are equal only when every component matches. That gives two equations: $p + 3q = 0$ and $2p - q = 7$.\n\n' +
        'Rearrange the first equation to get $p$ on its own. Take $3q$ from both sides: $p = -3q$.\n\n' +
        'Replace $p$ in the second equation: $2(-3q) - q = 7$, so $-6q - q = 7$, so $-7q = 7$. Divide both sides by $-7$ to get $q = -1$.\n\n' +
        'Put $q = -1$ back into $p = -3q$: $p = -3 \\times (-1) = 3$.',
      conclusion: 'With these values the top row is $3 - 3 = 0$ and the bottom row is $6 + 1 = 7$, so the answer is $p = 3,\\ q = -1$.',
      whyWrong: [
        'This swaps the values of $p$ and $q$. Check: $-1 \\times (1, 2) + 3 \\times (3, -1) = (8, -5)$, not $(0, 7)$.',
        'This has the sign of $q$ wrong. Check: $3 \\times (1, 2) + 1 \\times (3, -1) = (6, 5)$, not $(0, 7)$.',
        'This just copies the components of the target vector as the scalars. Check: $0 \\times (1, 2) + 7 \\times (3, -1) = (21, -7)$.',
        null,
      ],
      keyIdea: 'When a vector equation has unknown scalars, write one ordinary equation per component, then solve by substitution. Test the values in the original vectors.',
    },
    check: {
      optionValues: [vs([-1, 3]), vs([3, 1]), vs([0, 7]), vs([3, -1])],
      compute: () => {
        // columns u = (1,2), v = (3,-1), target t = (0,7); Cramer's rule
        const u = [1, 2];
        const v = [3, -1];
        const t = [0, 7];
        const d = det([
          [u[0], v[0]],
          [u[1], v[1]],
        ]);
        const p = det([
          [t[0], v[0]],
          [t[1], v[1]],
        ]) / d;
        const q = det([
          [u[0], t[0]],
          [u[1], t[1]],
        ]) / d;
        return vs([p, q]);
      },
    },
  },
  {
    id: 'vectors-013',
    subtopic: 'vectors',
    difficulty: 'exam',
    stem: 'Points $A(1, -2, 3)$ and $B(3, -1, 1)$ are given. Which is the unit vector in the direction of $\\overrightarrow{AB}$?',
    options: [
      cv('\\frac{2}{9}', '\\frac{1}{9}', '-\\frac{2}{9}'),
      cv('-\\frac{2}{3}', '-\\frac{1}{3}', '\\frac{2}{3}'),
      cv('\\frac{2}{3}', '\\frac{1}{3}', '-\\frac{2}{3}'),
      cv('\\frac{3}{\\sqrt{11}}', '-\\frac{1}{\\sqrt{11}}', '\\frac{1}{\\sqrt{11}}'),
    ],
    correctIndex: 2,
    markScheme: {
      asking: 'What vector of length 1 points in the direction from $A$ to $B$?',
      solution:
        '$\\overrightarrow{AB}$ is the journey from $A$ to $B$. Find it by taking the start away from the end: $\\begin{pmatrix} 3 - 1 \\\\ -1 - (-2) \\\\ 1 - 3 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 1 \\\\ -2 \\end{pmatrix}$.\n\n' +
        'A **unit vector** has length 1. To turn any vector into one, divide it by its own length, so we need the length of $\\overrightarrow{AB}$.\n\n' +
        'Find the length with Pythagoras\' theorem: $|\\overrightarrow{AB}| = \\sqrt{2^{2} + 1^{2} + (-2)^{2}} = \\sqrt{4 + 1 + 4} = \\sqrt{9} = 3$.\n\n' +
        'Divide each component by 3: $\\frac{1}{3}\\begin{pmatrix} 2 \\\\ 1 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} \\frac{2}{3} \\\\ \\frac{1}{3} \\\\ -\\frac{2}{3} \\end{pmatrix}$.',
      conclusion: 'Its squares add to $\\frac{4}{9} + \\frac{1}{9} + \\frac{4}{9} = 1$, so its length is 1. The unit vector is $\\begin{pmatrix} \\frac{2}{3} \\\\ \\frac{1}{3} \\\\ -\\frac{2}{3} \\end{pmatrix}$.',
      whyWrong: [
        'This divides by $|\\overrightarrow{AB}|^2 = 9$ instead of $|\\overrightarrow{AB}| = 3$, so its length is $\\frac{1}{3}$, not 1.',
        'This is the unit vector in the direction of $\\overrightarrow{BA} = \\mathbf{a} - \\mathbf{b}$. The vector from $A$ to $B$ is "end minus start", $\\mathbf{b} - \\mathbf{a}$.',
        null,
        'This is the unit vector in the direction of the position vector of $B$, $(3, -1, 1)$, rather than of $\\overrightarrow{AB}$.',
      ],
      keyIdea: 'For the direction from $A$ to $B$, take end minus start, then divide by the magnitude. Swapping the start and end flips every sign, so write the end point first.',
    },
    check: {
      optionValues: [
        fs([new Frac(2, 9), new Frac(1, 9), new Frac(-2, 9)]),
        fs([new Frac(-2, 3), new Frac(-1, 3), new Frac(2, 3)]),
        fs([new Frac(2, 3), new Frac(1, 3), new Frac(-2, 3)]),
        null,
      ],
      compute: () => {
        const A = [1, -2, 3];
        const B = [3, -1, 1];
        const ab = B.map((x, i) => x - A[i]);
        const n = norm(ab); // exactly 3
        return fs(ab.map((x) => new Frac(x, n)));
      },
    },
  },
  {
    id: 'vectors-014',
    subtopic: 'vectors',
    difficulty: 'exam',
    stem: 'The non-zero vectors $\\mathbf{a}$ and $\\mathbf{b}$ satisfy $|\\mathbf{a} + \\mathbf{b}| = |\\mathbf{a} - \\mathbf{b}|$. Which statement **must** be true?',
    options: [
      '$\\mathbf{a}$ and $\\mathbf{b}$ are perpendicular',
      '$\\mathbf{a} = \\mathbf{b}$',
      '$\\mathbf{a}$ and $\\mathbf{b}$ are parallel',
      '$|\\mathbf{a}| = |\\mathbf{b}|$',
    ],
    correctIndex: 0,
    markScheme: {
      asking: 'If $\\mathbf{a} + \\mathbf{b}$ and $\\mathbf{a} - \\mathbf{b}$ have the same length, what must be true of $\\mathbf{a}$ and $\\mathbf{b}$?',
      solution:
        'Lengths are hard to work with directly, so square both sides: $|\\mathbf{a} + \\mathbf{b}|^{2} = |\\mathbf{a} - \\mathbf{b}|^{2}$. A length squared is the vector\'s **dot product** with itself (multiply matching components, then add): $|\\mathbf{v}|^{2} = \\mathbf{v} \\cdot \\mathbf{v}$.\n\n' +
        'Expand the left side the way you would $(x + y)^{2}$: $(\\mathbf{a} + \\mathbf{b}) \\cdot (\\mathbf{a} + \\mathbf{b}) = |\\mathbf{a}|^{2} + 2\\mathbf{a} \\cdot \\mathbf{b} + |\\mathbf{b}|^{2}$.\n\n' +
        'Expand the right side the same way: $(\\mathbf{a} - \\mathbf{b}) \\cdot (\\mathbf{a} - \\mathbf{b}) = |\\mathbf{a}|^{2} - 2\\mathbf{a} \\cdot \\mathbf{b} + |\\mathbf{b}|^{2}$.\n\n' +
        'Set the two equal. $|\\mathbf{a}|^{2}$ and $|\\mathbf{b}|^{2}$ appear on both sides, so cancel them: $2\\mathbf{a} \\cdot \\mathbf{b} = -2\\mathbf{a} \\cdot \\mathbf{b}$. Add $2\\mathbf{a} \\cdot \\mathbf{b}$ to both sides: $4\\mathbf{a} \\cdot \\mathbf{b} = 0$, so $\\mathbf{a} \\cdot \\mathbf{b} = 0$.\n\n' +
        'A dot product of 0 between two non-zero vectors means they meet at a right angle.',
      conclusion: 'The condition forces $\\mathbf{a} \\cdot \\mathbf{b} = 0$, so $\\mathbf{a}$ and $\\mathbf{b}$ are perpendicular.',
      whyWrong: [
        null,
        'If $\\mathbf{a} = \\mathbf{b}$ then $|\\mathbf{a} - \\mathbf{b}| = 0$ while $|\\mathbf{a} + \\mathbf{b}| = 2|\\mathbf{a}| \\neq 0$, so the condition would fail.',
        'For parallel vectors $\\mathbf{a} \\cdot \\mathbf{b} = \\pm|\\mathbf{a}||\\mathbf{b}| \\neq 0$, so one diagonal is longer than the other. The condition forces $\\mathbf{a} \\cdot \\mathbf{b} = 0$, the opposite of parallel.',
        'Equal lengths is the condition for $(\\mathbf{a} + \\mathbf{b}) \\cdot (\\mathbf{a} - \\mathbf{b}) = 0$ (diagonals perpendicular, a rhombus). Here it is the **lengths** of the diagonals that are equal, which gives $\\mathbf{a} \\cdot \\mathbf{b} = 0$ instead.',
      ],
      keyIdea: 'When a question has lengths of sums or differences, square them and use $|\\mathbf{v}|^{2} = \\mathbf{v} \\cdot \\mathbf{v}$. Picture: $\\mathbf{a} + \\mathbf{b}$ and $\\mathbf{a} - \\mathbf{b}$ are the diagonals of a parallelogram, and equal diagonals mean a rectangle.',
    },
  },
  {
    id: 'vectors-015',
    subtopic: 'vectors',
    difficulty: 'exam',
    stem: 'Arrays are indexed from 1. What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source:
        'u = [2, -1, 3]\n' +
        'v = [4, 5, -2]\n' +
        's = 0\n' +
        'for i = 1 to 3\n' +
        '   s = s + u[i] * v[i]\n' +
        'end for\n' +
        'print(s)',
    },
    options: ['`8`', '`19`', '`-3`', '`11`'],
    correctIndex: 2,
    markScheme: {
      asking: 'What number is in `s` when the loop ends and it gets printed?',
      solution:
        'Lines 1 and 2 create two arrays. `u[i]` means the value at position `i` in `u`, and positions start at 1. So `u[1]` is 2 and `v[1]` is 4.\n\n' +
        'Line 3 starts `s` at 0. Line 4 makes `i` take the values 1, 2 and 3. Line 5 multiplies the two matching values and adds the product to `s`.\n\n' +
        'Here is every pass. After the loop, line 7 prints `s`.\n\n| `i` | `u[i]` | `v[i]` | `u[i] * v[i]` | `s` becomes |\n|---|---|---|---|---|\n| 1 | 2 | 4 | 8 | 8 |\n| 2 | $-1$ | 5 | $-5$ | 3 |\n| 3 | 3 | $-2$ | $-6$ | $-3$ |',
      conclusion: 'After 3 passes `s` holds $-3$, so the output is `-3`.',
      whyWrong: [
        'This stops after the first pass, when `s` is 8. The loop `for i = 1 to 3` runs for all three components.',
        'This adds the sizes of the products ($8 + 5 + 6$), ignoring the negative signs.',
        null,
        'This adds each pair instead of multiplying it ($6 + 4 + 1$). The code multiplies `u[i] * v[i]`.',
      ],
      keyIdea: 'This loop computes a dot product: matching values multiplied, then added. For a loop that builds a total, draw one table row per pass and add each product with its sign.',
    },
    check: {
      optionValues: [8, 19, -3, 11],
      compute: () => {
        const u = [2, -1, 3];
        const v = [4, 5, -2];
        let s = 0;
        for (let i = 1; i <= 3; i++) s += u[i - 1] * v[i - 1];
        return s;
      },
    },
  },
  {
    id: 'vectors-019',
    subtopic: 'vectors',
    difficulty: 'exam',
    stem: '$ABCD$ is a parallelogram (vertices in that order) with $A(1, 2, 0)$, $B(4, 3, 1)$ and $C(6, 0, 2)$. Find the coordinates of $D$.',
    options: ['$(-1, 5, -1)$', '$(3, -1, 1)$', '$(9, 1, 3)$', '$(3.5, 1, 1)$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What are the coordinates of the fourth corner $D$ of the parallelogram?',
      solution:
        'In a **parallelogram** $ABCD$, opposite sides are equal and parallel. Going round the corners in order, side $AD$ is opposite side $BC$. So the journey from $A$ to $D$ is the same as the journey from $B$ to $C$.\n\n' +
        'Find the journey from $B$ to $C$, which is end minus start: $\\overrightarrow{BC} = (6 - 4,\\ 0 - 3,\\ 2 - 1) = (2, -3, 1)$.\n\n' +
        'Start at $A$ and make that same journey: $D = (1 + 2,\\ 2 + (-3),\\ 0 + 1) = (3, -1, 1)$.',
      conclusion: 'The diagonals $AC$ and $BD$ both have midpoint $(3.5, 1, 1)$, as a parallelogram\'s diagonals must. So $D$ is $(3, -1, 1)$.',
      whyWrong: [
        'This is $\\mathbf{a} + \\mathbf{b} - \\mathbf{c}$, the fourth vertex when $AB$ is a **diagonal**. With vertices in the order $ABCD$, $AB$ is a side and $AC$ is the diagonal.',
        null,
        'This is $\\mathbf{b} + \\mathbf{c} - \\mathbf{a}$, the fourth vertex when $BC$ is a diagonal, i.e. it gives parallelogram $ABDC$, not $ABCD$.',
        'This is the midpoint of the diagonal $AC$ (the centre of the parallelogram), not the fourth vertex.',
      ],
      keyIdea: 'For parallelogram $ABCD$ with corners in order, $\\overrightarrow{AD} = \\overrightarrow{BC}$, so $\\mathbf{d} = \\mathbf{a} + \\mathbf{c} - \\mathbf{b}$, where each bold letter holds that corner\'s coordinates. The middle letter $B$ is the one subtracted, because it is opposite $D$. Test: diagonals $AC$ and $BD$ share a midpoint.',
    },
    check: {
      optionValues: [vs([-1, 5, -1]), vs([3, -1, 1]), vs([9, 1, 3]), vs([3.5, 1, 1])],
      compute: () => {
        const A = [1, 2, 0];
        const B = [4, 3, 1];
        const C = [6, 0, 2];
        const D = A.map((x, i) => x + C[i] - B[i]);
        // confirm AB = DC
        const ok = A.every((x, i) => B[i] - x === C[i] - D[i]);
        return ok ? vs(D) : 'not a parallelogram';
      },
    },
  },
  // ------------------------------------------------------------------ recall and short calculations
  {
    id: 'vectors-021',
    subtopic: 'vectors',
    difficulty: 'foundation',
    stem: 'What does the dot product of two vectors produce?',
    options: ['A single number (a scalar)', 'A vector', 'A matrix', 'An angle'],
    correctIndex: 0,
    markScheme: {
      asking: 'Is the result of a dot product a number, a vector or something else?',
      solution:
        'The **dot product** $\\mathbf{a} \\cdot \\mathbf{b}$ multiplies matching components, then adds the results.\n\n' +
        'For example, $\\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix} \\cdot \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix} = 1 \\times 3 + 2 \\times 4 = 3 + 8 = 11$. The result is one number. A single number like this is called a **scalar**.',
      conclusion: 'Adding the products always ends in one value, so the dot product produces a single number (a scalar).',
      whyWrong: [
        null,
        'This stops after multiplying the components. Adding the products gives a single number, not a vector.',
        'A matrix comes from arranging numbers in rows and columns. The dot product ends with one number.',
        'The dot product is linked to the angle by $\\mathbf{a} \\cdot \\mathbf{b} = |\\mathbf{a}|\\,|\\mathbf{b}|\\cos\\theta$, but it is not the angle itself.',
      ],
      keyIdea: 'Scalar means a single number. A vector dotted with a vector gives a scalar. If you end up with a vector, you stopped before adding.',
    },
  },
  {
    id: 'vectors-022',
    subtopic: 'vectors',
    difficulty: 'foundation',
    stem: 'When are two non-zero vectors perpendicular?',
    options: ['When their dot product is $0$', 'When their dot product is $1$', 'When one is a multiple of the other', 'When they have the same magnitude'],
    correctIndex: 0,
    markScheme: {
      asking: 'What test tells you that two vectors are at right angles?',
      solution:
        'The **dot product** (multiply matching components, then add) is linked to the angle $\\theta$ between two vectors: $\\mathbf{a} \\cdot \\mathbf{b} = |\\mathbf{a}|\\,|\\mathbf{b}|\\cos\\theta$. Here $|\\mathbf{a}|$ means the length of $\\mathbf{a}$.\n\n' +
        '**Perpendicular** means $\\theta = 90^\\circ$, and $\\cos 90^\\circ = 0$. So the right side becomes 0. For example, $(2, 1)$ and $(1, -2)$ are perpendicular: $2 \\times 1 + 1 \\times (-2) = 2 - 2 = 0$.',
      conclusion: 'Two non-zero vectors are perpendicular when their dot product is $0$.',
      whyWrong: [
        null,
        'A dot product of $1$ has no special meaning for the angle. Perpendicular means the dot product is exactly $0$.',
        'A scalar multiple points along the same line, so that is the test for **parallel** vectors.',
        'Equal lengths say nothing about the angle between two vectors.',
      ],
      keyIdea: 'Perpendicular means the dot product is 0. Parallel means one vector is a multiple of the other. Pick the test that matches the word in the question.',
    },
  },
  {
    id: 'vectors-023',
    subtopic: 'vectors',
    difficulty: 'foundation',
    stem: 'What is a **unit vector**?',
    options: ['A vector of magnitude $1$', 'A vector with every component equal to $1$', 'A vector with one component', 'The zero vector'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does the word unit mean for a vector?',
      solution:
        'The **magnitude** of a vector is its length, found with Pythagoras\' theorem. **Unit** means one, so a **unit vector** has magnitude exactly 1.\n\n' +
        'It can point in any direction. For example, $\\begin{pmatrix} 0.6 \\\\ 0.8 \\end{pmatrix}$ is a unit vector, because $\\sqrt{0.6^{2} + 0.8^{2}} = \\sqrt{0.36 + 0.64} = \\sqrt{1} = 1$.',
      conclusion: '"Unit" describes the length, so a unit vector is a vector of magnitude $1$.',
      whyWrong: [
        null,
        'The vector $(1, 1)$ has magnitude $\\sqrt{2}$, not $1$. "Unit" refers to the length, not to the components.',
        '"Unit" refers to the length of the vector, not to how many components it has.',
        'The zero vector has magnitude $0$, so it is not a unit vector.',
      ],
      keyIdea: 'To test for a unit vector, square the components and add: the total must be 1. All components being 1 isn\'t enough, because $(1, 1)$ has magnitude $\\sqrt{2}$.',
    },
  },
  {
    id: 'vectors-024',
    subtopic: 'vectors',
    difficulty: 'foundation',
    stem: 'For any vector $\\mathbf{a}$, what is $\\mathbf{a} \\cdot \\mathbf{a}$?',
    options: ['$|\\mathbf{a}|^{2}$', '$|\\mathbf{a}|$', '$2|\\mathbf{a}|$', '$0$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What do you get when you take the dot product of a vector with itself?',
      solution:
        'Call the components of $\\mathbf{a}$ $x$, $y$ and $z$. The **dot product** multiplies matching components and adds, so $\\mathbf{a} \\cdot \\mathbf{a} = x \\times x + y \\times y + z \\times z = x^{2} + y^{2} + z^{2}$.\n\n' +
        'The **magnitude** (length) of $\\mathbf{a}$ is $|\\mathbf{a}| = \\sqrt{x^{2} + y^{2} + z^{2}}$. Squaring both sides removes the root, so the same sum $x^{2} + y^{2} + z^{2}$ equals the magnitude squared.',
      conclusion: 'Both come to $x^{2} + y^{2} + z^{2}$, so $\\mathbf{a} \\cdot \\mathbf{a}$ equals $|\\mathbf{a}|^{2}$.',
      whyWrong: [
        null,
        'This forgets that the magnitude takes a square root at the end. The dot product is the sum of squares, before any root.',
        'This doubles the magnitude. The dot product multiplies matching components; it does not add the vector to itself.',
        'A dot product of $0$ means perpendicular. A non-zero vector is never perpendicular to itself.',
      ],
      keyIdea: 'Whenever you see $\\mathbf{v} \\cdot \\mathbf{v}$, replace it with $|\\mathbf{v}|^{2}$, and the other way round. This is how you expand lengths such as $|\\mathbf{a} + \\mathbf{b}|^{2}$.',
    },
    check: {
      // the options for a = (3, 4)
      optionValues: [25, 5, 10, 0],
      compute: () => dot([3, 4], [3, 4]),
    },
  },
  {
    id: 'vectors-025',
    subtopic: 'vectors',
    difficulty: 'exam',
    stem: 'Find the distance between the points $A(1, 2, 3)$ and $B(3, -1, 9)$.',
    options: ['$7$', '$49$', '$11$', '$5$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How far apart are the points $A$ and $B$?',
      solution:
        'The distance between two points is the length of the vector joining them. So find $\\overrightarrow{AB}$, then find its length.\n\n' +
        '$\\overrightarrow{AB}$ is end minus start, one coordinate at a time: $(3 - 1,\\ -1 - 2,\\ 9 - 3) = (2, -3, 6)$.\n\n' +
        'Find the length with Pythagoras\' theorem. Square each number, add, then take the square root: $\\sqrt{2^{2} + (-3)^{2} + 6^{2}} = \\sqrt{4 + 9 + 36} = \\sqrt{49} = 7$.',
      conclusion: 'The differences are 2, $-3$ and 6, and their squares add to 49, so the distance is $7$.',
      whyWrong: [
        null,
        'This is $|\\overrightarrow{AB}|^{2}$: the square root at the end was forgotten.',
        'This adds the sizes of the components, $2 + 3 + 6$. Lengths in different directions combine by Pythagoras.',
        'This adds the components with their signs, $2 - 3 + 6$, instead of squaring them first.',
      ],
      keyIdea: 'Distance between two points: subtract the coordinates, square each difference, add, then take the square root. This is Pythagoras\' theorem in three dimensions.',
    },
    check: {
      optionValues: [7, 49, 11, 5],
      compute: () => norm([3 - 1, -1 - 2, 9 - 3]),
    },
  },
];
