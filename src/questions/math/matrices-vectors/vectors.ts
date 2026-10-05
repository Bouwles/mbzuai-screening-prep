import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';
import { det, det3, dot, norm, rank, round } from '../../../lib/mathx';

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
      solution:
        'Work component by component.\n\n' +
        `First double $\\mathbf{a}$: $2\\mathbf{a} = ${col('2 \\times 3', '2 \\times (-1)', '2 \\times 2')} = ${col(6, -2, 4)}$.\n\n` +
        `Then subtract $\\mathbf{b}$: $2\\mathbf{a} - \\mathbf{b} = ${col('6 - 1', '-2 - 4', '4 - (-2)')} = ${col(5, -6, 6)}$.\n\n` +
        'Careful with the last component: subtracting $-2$ is the same as adding $2$, so $4 - (-2) = 6$.',
      whyWrong: [
        'This is $2\\mathbf{a} + \\mathbf{b}$: the vectors were added instead of subtracted.',
        'This is $2(\\mathbf{a} - \\mathbf{b}) = 2\\mathbf{a} - 2\\mathbf{b}$: the 2 was applied to $\\mathbf{b}$ as well, but only $\\mathbf{a}$ is doubled.',
        null,
        'This treats $4 - (-2)$ as $4 - 2 = 2$ in the last component. Subtracting a negative number means adding it.',
      ],
      keyIdea: 'Scalar multiplication and subtraction of vectors are done one component at a time.',
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
      solution:
        'The magnitude (length) of a vector is found with Pythagoras: square each component, add, then take the square root.\n\n' +
        '$$|\\mathbf{v}| = \\sqrt{4^2 + (-4)^2 + 7^2} = \\sqrt{16 + 16 + 49} = \\sqrt{81} = 9$$\n\n' +
        'Note that $(-4)^2 = 16$, a positive number: squaring always removes the minus sign.',
      whyWrong: [
        'This is $|\\mathbf{v}|^2 = 81$: the square root at the end was forgotten.',
        null,
        'This adds the sizes of the components, $4 + 4 + 7 = 15$. Lengths in different directions combine by Pythagoras, not by simple addition.',
        'This treats $(-4)^2$ as $-16$, giving $\\sqrt{16 - 16 + 49} = \\sqrt{49} = 7$ (it is also what you get by just adding the components, $4 - 4 + 7$). A square is never negative.',
      ],
      keyIdea: 'Magnitude = square root of the sum of the squares of the components.',
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
      solution:
        'A unit vector has length 1. To get one in the direction of $\\mathbf{v}$, divide $\\mathbf{v}$ by its own magnitude.\n\n' +
        '1. Magnitude: $|\\mathbf{v}| = \\sqrt{3^2 + (-4)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.\n' +
        `2. Divide each component by 5: $\\hat{\\mathbf{v}} = \\frac{1}{5}${col(3, -4)} = ${col('\\frac{3}{5}', '-\\frac{4}{5}')}$.\n\n` +
        'Check: $\\left(\\frac{3}{5}\\right)^2 + \\left(-\\frac{4}{5}\\right)^2 = \\frac{9}{25} + \\frac{16}{25} = 1$.',
      whyWrong: [
        'This vector has length 1 but points the **opposite** way: it is $-\\frac{\\mathbf{v}}{|\\mathbf{v}|}$. The signs must match those of $\\mathbf{v}$.',
        'This divides by $3 + 4 = 7$, the sum of the component sizes, instead of the magnitude 5. Its length is not 1.',
        'This divides by $|\\mathbf{v}|^2 = 25$ instead of $|\\mathbf{v}| = 5$. Its length is $\\frac{1}{5}$, not 1.',
        null,
      ],
      keyIdea: 'Unit vector = vector divided by its magnitude; the direction (and the signs) stay the same.',
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
      solution:
        'Multiply matching components, then **add** the results:\n\n' +
        '$$\\mathbf{a} \\cdot \\mathbf{b} = (2)(4) + (-3)(1) + (5)(-2) = 8 - 3 - 10 = -5$$\n\n' +
        'The dot product is a single number (a scalar), and it can be negative.',
      whyWrong: [
        'This adds the sizes of the products, $8 + 3 + 10 = 21$, ignoring their signs.',
        'This treats $(-3)(1)$ as $+3$, giving $8 + 3 - 10 = 1$. A negative times a positive is negative.',
        'This multiplies the components but never adds them up. The dot product is a number, not a vector.',
        null,
      ],
      keyIdea: 'The dot product multiplies matching components and adds them, giving a scalar.',
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
      solution:
        'Two (non-zero) vectors are perpendicular exactly when their dot product is $0$. Test each option against $' +
        col(2, 3) +
        '$:\n\n' +
        '| Option | Dot product |\n' +
        '|---|---|\n' +
        '| $(3, 2)$ | $6 + 6 = 12$ |\n' +
        '| $(-2, -3)$ | $-4 - 9 = -13$ |\n' +
        '| $(6, -4)$ | $12 - 12 = 0$ |\n' +
        '| $(2, -3)$ | $4 - 9 = -5$ |\n\n' +
        `Only $${col(6, -4)}$ gives $0$, so it is perpendicular. (Shortcut: $(x, y)$ is always perpendicular to $(y, -x)$, here $(3, -2)$, and $(6, -4)$ is just $2 \\times (3, -2)$.)`,
      whyWrong: [
        'This swaps the two components but forgets to change a sign; its dot product with the vector is $12$, not $0$.',
        'This is $-1$ times the original vector, so it is **parallel** (pointing the opposite way), not perpendicular.',
        null,
        'This only changes the sign of one component without swapping them; the dot product is $4 - 9 = -5$, not $0$.',
      ],
      keyIdea: 'Perpendicular (orthogonal) vectors have a dot product of zero.',
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
      solution:
        'Two vectors are parallel when one is a **scalar multiple** of the other, i.e. every component is multiplied by the same number $k$.\n\n' +
        `Try $k = -\\frac{1}{2}$: $-\\frac{1}{2}${col(2, -6, 4)} = ${col(-1, 3, -2)}$. That matches.\n\n` +
        'Check the others by looking at the ratios of components:\n\n' +
        '- $(1, 3, 2)$: ratios $\\frac{1}{2}, -\\frac{1}{2}, \\frac{1}{2}$, not all equal.\n' +
        '- $(3, -5, 5)$: ratios $\\frac{3}{2}, \\frac{5}{6}, \\frac{5}{4}$, not all equal.\n' +
        '- $(1, -3, -2)$: ratios $\\frac{1}{2}, \\frac{1}{2}, -\\frac{1}{2}$, not all equal.\n\n' +
        `So only $${col(-1, 3, -2)}$ is parallel (it points in the opposite direction, which still counts as parallel).`,
      whyWrong: [
        'This halves the sizes of the components but drops the minus sign on the middle one. All three components must be multiplied by the same number, sign included.',
        null,
        'This adds 1 to every component. Adding the same number does not keep the direction; only multiplying by the same number does.',
        'The first two components are half of the original, but the last one has the wrong sign ($-2$ instead of $2$), so the ratios are not all equal.',
      ],
      keyIdea: 'Parallel vectors are scalar multiples of each other: every component has the same ratio (a negative ratio still means parallel).',
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
      solution:
        'The midpoint is the average of the two position vectors:\n\n' +
        `$$\\overrightarrow{OM} = \\frac{1}{2}(\\mathbf{a} + \\mathbf{b}) = \\frac{1}{2}${col('2 + 6', '-1 + 7', '5 + (-3)')} = \\frac{1}{2}${col(8, 6, 2)} = ${col(4, 3, 1)}$$\n\n` +
        'Sense check: each coordinate of $M$ lies halfway between the coordinates of $A$ and $B$ (4 is halfway between 2 and 6, and so on).',
      whyWrong: [
        null,
        'This is $\\frac{1}{2}(\\mathbf{b} - \\mathbf{a})$, half of the vector $\\overrightarrow{AB}$. That is the step from $A$ to $M$, not the position of $M$. Add it to $\\mathbf{a}$ to get $M$.',
        'This is $\\mathbf{a} + \\mathbf{b}$: the sum was not halved.',
        'This is $\\overrightarrow{AB} = \\mathbf{b} - \\mathbf{a}$, the vector from $A$ to $B$, not a position vector of a point.',
      ],
      keyIdea: 'The midpoint of $AB$ has position vector $\\frac{1}{2}(\\mathbf{a} + \\mathbf{b})$.',
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
      solution:
        'Use $\\cos\\theta = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{a}|\\,|\\mathbf{b}|}$.\n\n' +
        '1. Dot product: $\\mathbf{a} \\cdot \\mathbf{b} = (1)(0) + (-1)(1) + (0)(-1) = -1$.\n' +
        '2. Magnitudes: $|\\mathbf{a}| = \\sqrt{1^2 + (-1)^2} = \\sqrt{2}$ and $|\\mathbf{b}| = \\sqrt{1^2 + (-1)^2} = \\sqrt{2}$ (the zero components add nothing).\n' +
        '3. $\\cos\\theta = \\frac{-1}{\\sqrt{2} \\times \\sqrt{2}} = -\\frac{1}{2}$.\n' +
        '4. The angle between $0$ and $\\pi$ with cosine $-\\frac{1}{2}$ is $\\theta = \\frac{2\\pi}{3}$ (that is, $120^\\circ$).\n\n' +
        'The negative dot product already tells you the angle is obtuse.',
      whyWrong: [
        'This uses $\\cos\\theta = +\\frac{1}{2}$: the minus sign of the dot product was dropped. A negative dot product means an obtuse angle.',
        'This divides by only one magnitude, $\\sqrt{2}$, giving $\\cos\\theta = -\\frac{1}{\\sqrt{2}}$. You must divide by the **product** $|\\mathbf{a}|\\,|\\mathbf{b}| = 2$.',
        'This forgets to divide by the magnitudes, using $\\cos\\theta = -1$. That would mean the vectors point in exactly opposite directions, which they clearly do not.',
        null,
      ],
      keyIdea: 'Use $\\cos\\theta = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{a}|\\,|\\mathbf{b}|}$; a negative dot product means an obtuse angle.',
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
      solution:
        '1. Dot product: $\\mathbf{a} \\cdot \\mathbf{b} = (1)(2) + (2)(-1) + (-2)(2) = 2 - 2 - 4 = -4$.\n' +
        '2. Magnitudes: $|\\mathbf{a}| = \\sqrt{1 + 4 + 4} = 3$ and $|\\mathbf{b}| = \\sqrt{4 + 1 + 4} = 3$.\n' +
        '3. $\\cos\\theta = \\frac{-4}{3 \\times 3} = -\\frac{4}{9} \\approx -0.4444$.\n' +
        '4. $\\theta = \\cos^{-1}\\left(-\\frac{4}{9}\\right) \\approx 116.4^\\circ$ (calculator in **degree** mode).\n\n' +
        'The dot product is negative, so the angle must be obtuse (between $90^\\circ$ and $180^\\circ$).',
      whyWrong: [
        'This is $\\cos^{-1}\\left(\\frac{4}{9}\\right)$: the minus sign of the dot product was lost. It is the supplement of the right answer ($180^\\circ - 116.4^\\circ$).',
        null,
        'This divides by $|\\mathbf{a}| + |\\mathbf{b}| = 6$ instead of $|\\mathbf{a}| \\times |\\mathbf{b}| = 9$, giving $\\cos^{-1}\\left(-\\frac{2}{3}\\right)$.',
        'This uses $\\sin^{-1}$ instead of $\\cos^{-1}$. The angle between two vectors is always between $0^\\circ$ and $180^\\circ$, so a negative angle is impossible.',
      ],
      keyIdea: 'The angle between vectors is $\\theta = \\cos^{-1}\\left(\\frac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{a}|\\,|\\mathbf{b}|}\\right)$, always between $0^\\circ$ and $180^\\circ$.',
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
      solution:
        'Perpendicular means the dot product is zero.\n\n' +
        '$$k(3) + 2(k) + (-1)(4) = 0$$\n\n' +
        '$$3k + 2k - 4 = 0$$\n\n' +
        '$$5k = 4 \\quad\\Rightarrow\\quad k = \\frac{4}{5}$$\n\n' +
        'Check: with $k = \\frac{4}{5}$ the dot product is $\\frac{12}{5} + \\frac{8}{5} - 4 = \\frac{20}{5} - 4 = 0$.',
      whyWrong: [
        'This treats $(-1)(4)$ as $+4$, giving $5k + 4 = 0$. A negative times a positive is negative.',
        'This misses the middle term $2 \\times k$ (the $k$ appears in **both** vectors), solving $3k - 4 = 0$.',
        null,
        'This sets the dot product equal to 1 instead of 0 ($5k - 4 = 1$). Perpendicular vectors have dot product **zero**.',
      ],
      keyIdea: 'To force two vectors to be perpendicular, set their dot product equal to zero and solve.',
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
      solution:
        '$AP : PB = 2 : 1$ means $P$ is $\\frac{2}{3}$ of the way from $A$ to $B$.\n\n' +
        `1. $\\overrightarrow{AB} = \\overrightarrow{OB} - \\overrightarrow{OA} = ${col('7 - 1', '-1 - 2')} = ${col(6, -3)}$.\n` +
        `2. $\\overrightarrow{OP} = \\overrightarrow{OA} + \\frac{2}{3}\\overrightarrow{AB} = ${col(1, 2)} + ${col(4, -2)} = ${col(5, 0)}$.\n\n` +
        `Check with the section formula: $\\frac{1 \\cdot \\overrightarrow{OA} + 2 \\cdot \\overrightarrow{OB}}{3} = \\frac{1}{3}${col(15, 0)} = ${col(5, 0)}$.`,
      whyWrong: [
        'This goes only $\\frac{1}{3}$ of the way from $A$: it gives the point with $AP : PB = 1 : 2$, which is closer to $A$, not to $B$.',
        null,
        'This is the midpoint of $AB$, which would be the answer for a ratio of $1 : 1$.',
        'This adds $2\\overrightarrow{AB}$ instead of $\\frac{2}{3}\\overrightarrow{AB}$, landing beyond $B$ instead of on the segment. The 2 in the ratio is 2 parts out of $2 + 1 = 3$.',
      ],
      keyIdea: 'If $AP : PB = m : n$ then $\\overrightarrow{OP} = \\overrightarrow{OA} + \\frac{m}{m + n}\\overrightarrow{AB}$.',
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
      solution:
        'Write one equation per component:\n\n' +
        '$$p + 3q = 0 \\qquad (1)$$\n\n' +
        '$$2p - q = 7 \\qquad (2)$$\n\n' +
        'From (1): $p = -3q$. Substitute into (2): $2(-3q) - q = 7$, so $-7q = 7$ and $q = -1$.\n\n' +
        'Then $p = -3(-1) = 3$.\n\n' +
        `Check: $3${col(1, 2)} - ${col(3, -1)} = ${col('3 - 3', '6 + 1')} = ${col(0, 7)}$.`,
      whyWrong: [
        'This swaps the values of $p$ and $q$. Check: $-1 \\times (1, 2) + 3 \\times (3, -1) = (8, -5)$, not $(0, 7)$.',
        'This has the sign of $q$ wrong. Check: $3 \\times (1, 2) + 1 \\times (3, -1) = (6, 5)$, not $(0, 7)$.',
        'This just copies the components of the target vector as the scalars. Check: $0 \\times (1, 2) + 7 \\times (3, -1) = (21, -7)$.',
        null,
      ],
      keyIdea: 'Finding a linear combination means solving simultaneous equations, one for each component.',
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
      solution:
        `1. "End minus start": $\\overrightarrow{AB} = \\mathbf{b} - \\mathbf{a} = ${col('3 - 1', '-1 - (-2)', '1 - 3')} = ${col(2, 1, -2)}$.\n` +
        '2. Magnitude: $|\\overrightarrow{AB}| = \\sqrt{2^2 + 1^2 + (-2)^2} = \\sqrt{9} = 3$.\n' +
        `3. Unit vector: $\\frac{1}{3}${col(2, 1, -2)} = ${col('\\frac{2}{3}', '\\frac{1}{3}', '-\\frac{2}{3}')}$.`,
      whyWrong: [
        'This divides by $|\\overrightarrow{AB}|^2 = 9$ instead of $|\\overrightarrow{AB}| = 3$, so its length is $\\frac{1}{3}$, not 1.',
        'This is the unit vector in the direction of $\\overrightarrow{BA} = \\mathbf{a} - \\mathbf{b}$. The vector from $A$ to $B$ is "end minus start", $\\mathbf{b} - \\mathbf{a}$.',
        null,
        'This is the unit vector in the direction of the position vector of $B$, $(3, -1, 1)$, rather than of $\\overrightarrow{AB}$.',
      ],
      keyIdea: 'Find $\\overrightarrow{AB} = \\mathbf{b} - \\mathbf{a}$ ("end minus start"), then divide by its magnitude.',
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
      solution:
        'Square both sides and expand using $|\\mathbf{v}|^2 = \\mathbf{v} \\cdot \\mathbf{v}$:\n\n' +
        '$$|\\mathbf{a} + \\mathbf{b}|^2 = |\\mathbf{a}|^2 + 2\\,\\mathbf{a} \\cdot \\mathbf{b} + |\\mathbf{b}|^2$$\n\n' +
        '$$|\\mathbf{a} - \\mathbf{b}|^2 = |\\mathbf{a}|^2 - 2\\,\\mathbf{a} \\cdot \\mathbf{b} + |\\mathbf{b}|^2$$\n\n' +
        'Setting them equal: $2\\,\\mathbf{a} \\cdot \\mathbf{b} = -2\\,\\mathbf{a} \\cdot \\mathbf{b}$, so $4\\,\\mathbf{a} \\cdot \\mathbf{b} = 0$ and $\\mathbf{a} \\cdot \\mathbf{b} = 0$.\n\n' +
        'A zero dot product between non-zero vectors means they are **perpendicular**.\n\n' +
        'Picture: $\\mathbf{a} + \\mathbf{b}$ and $\\mathbf{a} - \\mathbf{b}$ are the two diagonals of the parallelogram with sides $\\mathbf{a}$ and $\\mathbf{b}$. Equal diagonals means the parallelogram is a rectangle.',
      whyWrong: [
        null,
        'If $\\mathbf{a} = \\mathbf{b}$ then $|\\mathbf{a} - \\mathbf{b}| = 0$ while $|\\mathbf{a} + \\mathbf{b}| = 2|\\mathbf{a}| \\neq 0$, so the condition would fail.',
        'For parallel vectors $\\mathbf{a} \\cdot \\mathbf{b} = \\pm|\\mathbf{a}||\\mathbf{b}| \\neq 0$, so one diagonal is longer than the other. The condition forces $\\mathbf{a} \\cdot \\mathbf{b} = 0$, the opposite of parallel.',
        'Equal lengths is the condition for $(\\mathbf{a} + \\mathbf{b}) \\cdot (\\mathbf{a} - \\mathbf{b}) = 0$ (diagonals perpendicular, a rhombus). Here it is the **lengths** of the diagonals that are equal, which gives $\\mathbf{a} \\cdot \\mathbf{b} = 0$ instead.',
      ],
      keyIdea: 'Expanding $|\\mathbf{a} + \\mathbf{b}|^2$ and $|\\mathbf{a} - \\mathbf{b}|^2$ shows they differ by $4\\,\\mathbf{a} \\cdot \\mathbf{b}$, so equal lengths means $\\mathbf{a} \\cdot \\mathbf{b} = 0$.',
    },
  },
  {
    id: 'vectors-015',
    subtopic: 'vectors',
    difficulty: 'exam',
    stem: 'What does this Python code print? (The two values are printed on one line, separated by a space.)',
    code: {
      lang: 'python',
      source:
        'def dot(u, v):\n    return sum(a * b for a, b in zip(u, v))\n\nu = [2, -1, 3]\nv = [4, 5, -2]\nw = [1, 2, 0]\nprint(dot(u, v), dot(u, w))',
    },
    options: ['`[8, -5, -6] [2, -2, 0]`', '`19 4`', '`-3 0`', '`11 7`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '`zip(u, v)` pairs up matching components; the generator multiplies each pair and `sum` adds the products. That is exactly the dot product.\n\n' +
        '| pair from `zip(u, v)` | `a * b` |\n' +
        '|---|---|\n' +
        '| `(2, 4)` | 8 |\n' +
        '| `(-1, 5)` | -5 |\n' +
        '| `(3, -2)` | -6 |\n\n' +
        'So `dot(u, v)` $= 8 - 5 - 6 = -3$.\n\n' +
        '| pair from `zip(u, w)` | `a * b` |\n' +
        '|---|---|\n' +
        '| `(2, 1)` | 2 |\n' +
        '| `(-1, 2)` | -2 |\n' +
        '| `(3, 0)` | 0 |\n\n' +
        'The three products are $2$, $-2$ and $0$, so `dot(u, w)` $= 2 - 2 = 0$ (a dot product of zero means `u` and `w` are perpendicular).\n\n' +
        '`print` separates its two arguments with a space, so the output is `-3 0`.',
      whyWrong: [
        'This is the list of products before adding. `sum(...)` adds them up, so the function returns a single number.',
        'This adds the sizes of the products ($8 + 5 + 6 = 19$ for the first call and $2 + 2 = 4$ for the second), ignoring the negative signs.',
        null,
        'This adds each pair instead of multiplying it ($6 + 4 + 1$ and $3 + 1 + 3$). The code uses `a * b`.',
      ],
      keyIdea: '`sum(a * b for a, b in zip(u, v))` is the dot product written in Python.',
    },
    python: { stdout: '-3 0\n' },
  },
  // ------------------------------------------------------------------ challenge
  {
    id: 'vectors-016',
    subtopic: 'vectors',
    difficulty: 'challenge',
    stem: `For which value of $k$ are the vectors $${col(1, 2, 'k')}$, $${col(2, 1, 1)}$ and $${col(1, -1, 0)}$ **linearly dependent**?`,
    options: ['$k = -\\frac{1}{3}$', '$k = 1$', '$k = 3$', 'No value of $k$: three vectors in 3D are always linearly independent'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Three vectors in 3D are linearly dependent exactly when the determinant of the matrix they form is $0$.\n\n' +
        '$$\\det\\begin{pmatrix} 1 & 2 & k \\\\ 2 & 1 & 1 \\\\ 1 & -1 & 0 \\end{pmatrix} = 1\\begin{vmatrix} 1 & 1 \\\\ -1 & 0 \\end{vmatrix} - 2\\begin{vmatrix} 2 & 1 \\\\ 1 & 0 \\end{vmatrix} + k\\begin{vmatrix} 2 & 1 \\\\ 1 & -1 \\end{vmatrix}$$\n\n' +
        '- First minor: $(1)(0) - (1)(-1) = 1$\n' +
        '- Second minor: $(2)(0) - (1)(1) = -1$\n' +
        '- Third minor: $(2)(-1) - (1)(1) = -3$\n\n' +
        'So the determinant is $1(1) - 2(-1) + k(-3) = 3 - 3k$.\n\n' +
        'Setting $3 - 3k = 0$ gives $k = 1$.\n\n' +
        `Check: with $k = 1$, $${col(2, 1, 1)} - ${col(1, -1, 0)} = ${col(1, 2, 1)}$, so the first vector is a combination of the other two.`,
      whyWrong: [
        'This forgets the minus sign on the middle term of the cofactor expansion (the signs go plus, minus, plus), getting $1 + 2(-1) - 3k = -1 - 3k = 0$.',
        null,
        'This makes a sign slip in the last minor, computing $(2)(-1) - (1)(1)$ as $-2 + 1 = -1$, which gives $3 - k = 0$.',
        'Three vectors in 3D can be dependent: it happens whenever one is a combination of the others (determinant $0$). Only **four or more** vectors in 3D are always dependent.',
      ],
      keyIdea: '$n$ vectors in $n$ dimensions are linearly dependent exactly when the determinant of the matrix they form is zero.',
    },
    check: {
      optionValues: [-1 / 3, 1, 3, null],
      compute: () => {
        // det is linear in k: d(k) = d(0) + (d(1) - d(0)) k
        const d = (k: number) =>
          det3([
            [1, 2, k],
            [2, 1, 1],
            [1, -1, 0],
          ]);
        return -d(0) / (d(1) - d(0));
      },
    },
  },
  {
    id: 'vectors-017',
    subtopic: 'vectors',
    difficulty: 'challenge',
    stem: `Let $\\mathbf{a} = ${col(1, 2, -1)}$, $\\mathbf{b} = ${col(2, 0, 1)}$ and $\\mathbf{c} = ${col(0, 1, 3)}$. Find the scalars $(x, y, z)$ such that $x\\mathbf{a} + y\\mathbf{b} + z\\mathbf{c} = ${col(5, 3, 4)}$.`,
    options: ['$(2, 1, 1)$', '$(3, 1, 0)$', '$(5, 3, 4)$', '$(1, 2, 1)$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'One equation per component:\n\n' +
        '$$x + 2y = 5 \\qquad (1)$$\n\n' +
        '$$2x + z = 3 \\qquad (2)$$\n\n' +
        '$$-x + y + 3z = 4 \\qquad (3)$$\n\n' +
        'From (1): $x = 5 - 2y$. From (2): $z = 3 - 2x = 3 - 2(5 - 2y) = 4y - 7$.\n\n' +
        'Substitute into (3): $-(5 - 2y) + y + 3(4y - 7) = 4$, so $-5 + 2y + y + 12y - 21 = 4$, giving $15y = 30$ and $y = 2$.\n\n' +
        'Then $x = 5 - 4 = 1$ and $z = 8 - 7 = 1$.\n\n' +
        `Check: $\\mathbf{a} + 2\\mathbf{b} + \\mathbf{c} = ${col('1 + 4', '2 + 1', '-1 + 2 + 3')} = ${col(5, 3, 4)}$.\n\n` +
        'Exam speed-up: with options given, just test each one by plugging it into $x\\mathbf{a} + y\\mathbf{b} + z\\mathbf{c}$.',
      whyWrong: [
        'This swaps $x$ and $y$. Check: $2\\mathbf{a} + \\mathbf{b} + \\mathbf{c} = (4, 5, 2)$, not $(5, 3, 4)$.',
        'This only satisfies the first component ($3 + 2 = 5$). The full combination is $3\\mathbf{a} + \\mathbf{b} = (5, 6, -2)$, so all three components must be checked.',
        'This copies the target vector as the scalars. Check: $5\\mathbf{a} + 3\\mathbf{b} + 4\\mathbf{c} = (11, 14, 10)$.',
        null,
      ],
      keyIdea: 'Writing a vector as a linear combination means solving a system of linear equations, one equation per component.',
    },
    check: {
      optionValues: [vs([2, 1, 1]), vs([3, 1, 0]), vs([5, 3, 4]), vs([1, 2, 1])],
      compute: () => {
        const a = [1, 2, -1];
        const b = [2, 0, 1];
        const c = [0, 1, 3];
        const t = [5, 3, 4];
        // Cramer's rule with the vectors as columns
        const M = (u: number[], v: number[], w: number[]) => [0, 1, 2].map((i) => [u[i], v[i], w[i]]);
        const D = det3(M(a, b, c));
        return vs([det3(M(t, b, c)) / D, det3(M(a, t, c)) / D, det3(M(a, b, t)) / D]);
      },
    },
  },
  {
    id: 'vectors-018',
    subtopic: 'vectors',
    difficulty: 'challenge',
    stem: 'The vectors $\\mathbf{a}$ and $\\mathbf{b}$ have $|\\mathbf{a}| = 2$, $|\\mathbf{b}| = 3$, and the angle between them is $60^\\circ$. Find $|2\\mathbf{a} - \\mathbf{b}|$.',
    options: ['$5$', '$1$', '$\\sqrt{13}$', '$\\sqrt{37}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Work with the square of the length, using $|\\mathbf{v}|^2 = \\mathbf{v} \\cdot \\mathbf{v}$.\n\n' +
        '1. $\\mathbf{a} \\cdot \\mathbf{b} = |\\mathbf{a}||\\mathbf{b}|\\cos 60^\\circ = 2 \\times 3 \\times \\frac{1}{2} = 3$.\n' +
        '2. Expand: $|2\\mathbf{a} - \\mathbf{b}|^2 = (2\\mathbf{a} - \\mathbf{b}) \\cdot (2\\mathbf{a} - \\mathbf{b}) = 4|\\mathbf{a}|^2 - 4\\,\\mathbf{a} \\cdot \\mathbf{b} + |\\mathbf{b}|^2$.\n' +
        '3. Substitute: $4(4) - 4(3) + 9 = 16 - 12 + 9 = 13$.\n' +
        '4. Take the square root: $|2\\mathbf{a} - \\mathbf{b}| = \\sqrt{13}$.',
      whyWrong: [
        'This ignores the cross term: $\\sqrt{16 + 9} = 5$ would only be right if $\\mathbf{a}$ and $\\mathbf{b}$ were perpendicular.',
        'This assumes lengths subtract like numbers: $2|\\mathbf{a}| - |\\mathbf{b}| = 4 - 3 = 1$. That only works when the vectors point the same way.',
        null,
        'This has the wrong sign on the cross term, using $16 + 12 + 9 = 37$, which is $|2\\mathbf{a} + \\mathbf{b}|^2$.',
      ],
      keyIdea: 'To find the length of a combination of vectors, expand $|\\mathbf{v}|^2 = \\mathbf{v} \\cdot \\mathbf{v}$ and use $\\mathbf{a} \\cdot \\mathbf{b} = |\\mathbf{a}||\\mathbf{b}|\\cos\\theta$.',
    },
    check: {
      optionValues: [5, 1, Math.sqrt(13), Math.sqrt(37)],
      compute: () => {
        // place the vectors in the plane with the required lengths and angle
        const t = Math.PI / 3;
        const a = [2, 0];
        const b = [3 * Math.cos(t), 3 * Math.sin(t)];
        return norm([2 * a[0] - b[0], 2 * a[1] - b[1]]);
      },
    },
  },
  {
    id: 'vectors-019',
    subtopic: 'vectors',
    difficulty: 'challenge',
    stem: '$ABCD$ is a parallelogram (vertices in that order) with $A(1, 2, 0)$, $B(4, 3, 1)$ and $C(6, 0, 2)$. Find the coordinates of $D$.',
    options: ['$(-1, 5, -1)$', '$(3, -1, 1)$', '$(9, 1, 3)$', '$(3.5, 1, 1)$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'In parallelogram $ABCD$ the opposite sides are equal vectors: $\\overrightarrow{AD} = \\overrightarrow{BC}$.\n\n' +
        `1. $\\overrightarrow{BC} = \\mathbf{c} - \\mathbf{b} = ${col('6 - 4', '0 - 3', '2 - 1')} = ${col(2, -3, 1)}$.\n` +
        `2. $\\mathbf{d} = \\mathbf{a} + \\overrightarrow{BC} = ${col(1, 2, 0)} + ${col(2, -3, 1)} = ${col(3, -1, 1)}$.\n\n` +
        'So $D = (3, -1, 1)$. (Equivalently $\\mathbf{d} = \\mathbf{a} + \\mathbf{c} - \\mathbf{b}$, because the diagonals $AC$ and $BD$ share a midpoint.)\n\n' +
        'Check: $\\overrightarrow{AB} = (3, 1, 1)$ and $\\overrightarrow{DC} = (6 - 3, 0 + 1, 2 - 1) = (3, 1, 1)$. Equal, as they should be.',
      whyWrong: [
        'This is $\\mathbf{a} + \\mathbf{b} - \\mathbf{c}$, the fourth vertex when $AB$ is a **diagonal**. With vertices in the order $ABCD$, $AB$ is a side and $AC$ is the diagonal.',
        null,
        'This is $\\mathbf{b} + \\mathbf{c} - \\mathbf{a}$, the fourth vertex when $BC$ is a diagonal, i.e. it gives parallelogram $ABDC$, not $ABCD$.',
        'This is the midpoint of the diagonal $AC$ (the centre of the parallelogram), not the fourth vertex.',
      ],
      keyIdea: 'In parallelogram $ABCD$, $\\overrightarrow{AD} = \\overrightarrow{BC}$, so $\\mathbf{d} = \\mathbf{a} + \\mathbf{c} - \\mathbf{b}$.',
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
  {
    id: 'vectors-020',
    subtopic: 'vectors',
    difficulty: 'challenge',
    stem: 'Which of the following sets of vectors in $\\mathbb{R}^3$ is **linearly independent**?',
    options: [
      '$(1, 0, 0),\\ (0, 1, 0),\\ (1, 1, 0)$',
      '$(1, 2, 3),\\ (2, 4, 6),\\ (0, 0, 1)$',
      '$(1, 0, 0),\\ (1, 1, 0),\\ (1, 1, 1)$',
      '$(1, 0, 1),\\ (0, 1, 0),\\ (1, 1, 1),\\ (2, 0, 1)$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'A set is linearly independent when no vector in it can be built from the others (the only way to get $\\mathbf{0}$ is with all coefficients $0$).\n\n' +
        '- $(1, 0, 0), (0, 1, 0), (1, 1, 0)$: the third is the sum of the first two, so **dependent**.\n' +
        '- $(1, 2, 3), (2, 4, 6), (0, 0, 1)$: $(2, 4, 6) = 2(1, 2, 3)$, so **dependent**.\n' +
        '- $(1, 0, 0), (1, 1, 0), (1, 1, 1)$: as rows of a matrix this is triangular with determinant $1 \\times 1 \\times 1 = 1 \\neq 0$, so **independent**.\n' +
        '- Four vectors in $\\mathbb{R}^3$: any 4 vectors in 3 dimensions are always **dependent**.\n\n' +
        'Direct check of the independent set: $a(1, 0, 0) + b(1, 1, 0) + c(1, 1, 1) = (0, 0, 0)$. The third component gives $c = 0$, then the second gives $b = 0$, then the first gives $a = 0$.',
      whyWrong: [
        'The third vector is $(1, 0, 0) + (0, 1, 0)$, so the set is dependent. All three also lie in the flat $xy$-plane.',
        'The second vector is exactly twice the first (they are parallel), so the set is dependent. Any set containing two parallel vectors is dependent.',
        null,
        'Four vectors in 3D space can never be independent: at most 3 vectors in $\\mathbb{R}^3$ can be independent. Here, for example, $(1, 1, 1) = (1, 0, 1) + (0, 1, 0)$.',
      ],
      keyIdea: 'Vectors are independent when none is a combination of the others; more than $n$ vectors in $n$ dimensions are always dependent.',
    },
    check: {
      optionValues: ['set 0', 'set 1', 'set 2', 'set 3'],
      compute: () => {
        const sets = [
          [
            [1, 0, 0],
            [0, 1, 0],
            [1, 1, 0],
          ],
          [
            [1, 2, 3],
            [2, 4, 6],
            [0, 0, 1],
          ],
          [
            [1, 0, 0],
            [1, 1, 0],
            [1, 1, 1],
          ],
          [
            [1, 0, 1],
            [0, 1, 0],
            [1, 1, 1],
            [2, 0, 1],
          ],
        ];
        const hits = sets.map((s, i) => ({ s, i })).filter(({ s }) => rank(s) === s.length);
        return hits.length === 1 ? `set ${hits[0].i}` : 'none or several';
      },
    },
  },
];
