import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'vectors',
  know:
    '### What is a vector?\n\n' +
    'A **vector** is a quantity with a size *and* a direction, like "3 steps right and 1 step down". We write it as a column of numbers called **components**: $\\begin{pmatrix} 3 \\\\ -1 \\end{pmatrix}$ in 2D, or $\\begin{pmatrix} 2 \\\\ 5 \\\\ -4 \\end{pmatrix}$ in 3D. The same vectors can be written with unit vectors as $3\\mathbf{i} - \\mathbf{j}$ and $2\\mathbf{i} + 5\\mathbf{j} - 4\\mathbf{k}$. Vectors are written in bold ($\\mathbf{a}$) or underlined by hand. A plain number (no direction) is called a **scalar**.\n\n' +
    'In AI, almost everything is a vector: a data point with 3 features is a vector with 3 components, and a model\'s weights form a vector too.\n\n' +
    '### Adding, subtracting and scaling\n\n' +
    'Everything is done **one component at a time**.\n\n' +
    '- Add: $\\begin{pmatrix} 1 \\\\ 4 \\end{pmatrix} + \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 2 \\end{pmatrix}$\n' +
    '- Scale: $3\\begin{pmatrix} 2 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ -3 \\end{pmatrix}$ (three times as long, same direction)\n' +
    '- A negative scalar flips the direction: $-\\mathbf{a}$ points the opposite way to $\\mathbf{a}$.\n\n' +
    'Two vectors are **parallel** when one is a scalar multiple of the other, for example $\\begin{pmatrix} 2 \\\\ -6 \\end{pmatrix} = -2\\begin{pmatrix} -1 \\\\ 3 \\end{pmatrix}$. Every component must use the **same** multiplier.\n\n' +
    '### Magnitude and unit vectors\n\n' +
    'The **magnitude** (length) $|\\mathbf{v}|$ comes from Pythagoras: square every component, add, then square root. For $\\mathbf{v} = \\begin{pmatrix} 2 \\\\ -3 \\\\ 6 \\end{pmatrix}$, $|\\mathbf{v}| = \\sqrt{4 + 9 + 36} = \\sqrt{49} = 7$. Squares are never negative, so the signs of the components do not matter here.\n\n' +
    'A **unit vector** has length 1. To turn any vector into a unit vector pointing the same way, divide it by its magnitude: $\\hat{\\mathbf{v}} = \\frac{\\mathbf{v}}{|\\mathbf{v}|}$. To get a vector of length $L$ in that direction, multiply the unit vector by $L$.\n\n' +
    '### Position vectors, midpoints and points on a line\n\n' +
    'The **position vector** of a point $A$ is the vector from the origin $O$ to $A$, written $\\mathbf{a}$ or $\\overrightarrow{OA}$. Its components are just the coordinates of $A$.\n\n' +
    '- The vector from $A$ to $B$ is "**end minus start**": $\\overrightarrow{AB} = \\mathbf{b} - \\mathbf{a}$.\n' +
    '- The distance $AB$ is the magnitude $|\\overrightarrow{AB}|$.\n' +
    '- The midpoint $M$ of $AB$ is the average: $\\overrightarrow{OM} = \\frac{1}{2}(\\mathbf{a} + \\mathbf{b})$.\n' +
    '- If $P$ divides $AB$ so that $AP : PB = m : n$, then $P$ is $\\frac{m}{m + n}$ of the way along: $\\overrightarrow{OP} = \\mathbf{a} + \\frac{m}{m + n}(\\mathbf{b} - \\mathbf{a})$.\n\n' +
    '### The dot product\n\n' +
    'The **dot product** multiplies matching components and **adds** the results. The answer is a single number (a scalar), not a vector:\n\n' +
    '$$\\begin{pmatrix} 2 \\\\ -3 \\\\ 5 \\end{pmatrix} \\cdot \\begin{pmatrix} 4 \\\\ 1 \\\\ -2 \\end{pmatrix} = 8 - 3 - 10 = -5$$\n\n' +
    'It is also linked to the angle $\\theta$ between the vectors: $\\mathbf{a} \\cdot \\mathbf{b} = |\\mathbf{a}|\\,|\\mathbf{b}|\\cos\\theta$. Two useful facts: $\\mathbf{a} \\cdot \\mathbf{a} = |\\mathbf{a}|^2$, and the dot product expands like ordinary brackets, so $|\\mathbf{a} + \\mathbf{b}|^2 = |\\mathbf{a}|^2 + 2\\,\\mathbf{a} \\cdot \\mathbf{b} + |\\mathbf{b}|^2$.\n\n' +
    '### Angles and orthogonality\n\n' +
    'Rearranging gives the angle formula $\\cos\\theta = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{a}|\\,|\\mathbf{b}|}$. The angle is always between $0^\\circ$ and $180^\\circ$, and the **sign** of the dot product tells you its type before you even use a calculator:\n\n' +
    '| Dot product | Angle | Meaning |\n' +
    '|---|---|---|\n' +
    '| positive | between $0^\\circ$ and $90^\\circ$ | acute, roughly the same direction |\n' +
    '| zero | exactly $90^\\circ$ | perpendicular (orthogonal) |\n' +
    '| negative | between $90^\\circ$ and $180^\\circ$ | obtuse, roughly opposite directions |\n\n' +
    'So two non-zero vectors are **orthogonal** (perpendicular) exactly when their dot product is $0$. In 2D, a quick perpendicular to $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$ is $\\begin{pmatrix} -y \\\\ x \\end{pmatrix}$: swap the components and change one sign.\n\n' +
    '### Linear combinations\n\n' +
    'A **linear combination** of vectors is any sum of scalar multiples, like $2\\mathbf{u} - 3\\mathbf{v}$. To find the scalars that make a target vector, write one equation per component and solve the simultaneous equations. In a multiple-choice question it is often faster to plug each option in.\n\n' +
    '### Linear independence\n\n' +
    'Vectors are **linearly independent** if none of them can be built as a combination of the others. Equivalently, the only way to make $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2 + \\dots = \\mathbf{0}$ is with every $c$ equal to $0$. Otherwise they are **dependent**. Quick tests:\n\n' +
    '- Two vectors are dependent exactly when they are parallel.\n' +
    '- Any set containing the zero vector is dependent.\n' +
    '- $n$ vectors in $n$ dimensions (e.g. 3 vectors in 3D) are dependent exactly when the determinant of the matrix they form is $0$.\n' +
    '- More than $n$ vectors in $n$ dimensions are **always** dependent (4 vectors in 3D can never be independent).',
  formulas: [
    { label: 'Addition (component by component)', tex: '\\begin{pmatrix} a_1 \\\\ a_2 \\\\ a_3 \\end{pmatrix} + \\begin{pmatrix} b_1 \\\\ b_2 \\\\ b_3 \\end{pmatrix} = \\begin{pmatrix} a_1 + b_1 \\\\ a_2 + b_2 \\\\ a_3 + b_3 \\end{pmatrix}' },
    { label: 'Scalar multiple', tex: 'k\\begin{pmatrix} a_1 \\\\ a_2 \\\\ a_3 \\end{pmatrix} = \\begin{pmatrix} ka_1 \\\\ ka_2 \\\\ ka_3 \\end{pmatrix}', note: 'A negative $k$ reverses the direction.' },
    { label: 'Parallel vectors', tex: '\\mathbf{b} = k\\,\\mathbf{a} \\text{ for some scalar } k', note: 'Every component has the same ratio.' },
    { label: 'Magnitude', tex: '|\\mathbf{a}| = \\sqrt{a_1^2 + a_2^2 + a_3^2}' },
    { label: 'Unit vector', tex: '\\hat{\\mathbf{a}} = \\frac{\\mathbf{a}}{|\\mathbf{a}|}', note: 'Same direction, length 1.' },
    { label: 'Vector from A to B', tex: '\\overrightarrow{AB} = \\mathbf{b} - \\mathbf{a}', note: 'End minus start.' },
    { label: 'Midpoint of AB', tex: '\\overrightarrow{OM} = \\frac{1}{2}(\\mathbf{a} + \\mathbf{b})' },
    { label: 'Point dividing AB in the ratio m : n', tex: '\\overrightarrow{OP} = \\mathbf{a} + \\frac{m}{m + n}(\\mathbf{b} - \\mathbf{a}) = \\frac{n\\mathbf{a} + m\\mathbf{b}}{m + n}' },
    { label: 'Dot product (components)', tex: '\\mathbf{a} \\cdot \\mathbf{b} = a_1b_1 + a_2b_2 + a_3b_3', note: 'The result is a scalar.' },
    { label: 'Dot product (geometric)', tex: '\\mathbf{a} \\cdot \\mathbf{b} = |\\mathbf{a}|\\,|\\mathbf{b}|\\cos\\theta' },
    { label: 'Angle between two vectors', tex: '\\cos\\theta = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{a}|\\,|\\mathbf{b}|}', note: 'The angle is always between $0^\\circ$ and $180^\\circ$.' },
    { label: 'Perpendicular (orthogonal) vectors', tex: '\\mathbf{a} \\cdot \\mathbf{b} = 0' },
    { label: 'Dot product with itself', tex: '\\mathbf{a} \\cdot \\mathbf{a} = |\\mathbf{a}|^2' },
    { label: 'Length of a sum', tex: '|\\mathbf{a} + \\mathbf{b}|^2 = |\\mathbf{a}|^2 + 2\\,\\mathbf{a} \\cdot \\mathbf{b} + |\\mathbf{b}|^2' },
    { label: 'Linear independence of 3 vectors in 3D', tex: '\\det\\begin{pmatrix} \\mathbf{u} & \\mathbf{v} & \\mathbf{w} \\end{pmatrix} \\neq 0', note: 'Determinant zero means the vectors are linearly dependent.' },
  ],
  examples: [
    {
      title: 'Combine two vectors and find a magnitude',
      problem: 'Given $\\mathbf{a} = \\begin{pmatrix} 2 \\\\ -1 \\\\ 3 \\end{pmatrix}$ and $\\mathbf{b} = \\begin{pmatrix} 1 \\\\ 4 \\\\ -2 \\end{pmatrix}$, find $3\\mathbf{a} - 2\\mathbf{b}$ and $|\\mathbf{a}|$.',
      steps: [
        '$3\\mathbf{a} = \\begin{pmatrix} 6 \\\\ -3 \\\\ 9 \\end{pmatrix}$ and $2\\mathbf{b} = \\begin{pmatrix} 2 \\\\ 8 \\\\ -4 \\end{pmatrix}$.',
        'Subtract component by component: $3\\mathbf{a} - 2\\mathbf{b} = \\begin{pmatrix} 6 - 2 \\\\ -3 - 8 \\\\ 9 - (-4) \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ -11 \\\\ 13 \\end{pmatrix}$.',
        'Magnitude: $|\\mathbf{a}| = \\sqrt{2^2 + (-1)^2 + 3^2} = \\sqrt{4 + 1 + 9} = \\sqrt{14}$.',
      ],
      answer: '$3\\mathbf{a} - 2\\mathbf{b} = \\begin{pmatrix} 4 \\\\ -11 \\\\ 13 \\end{pmatrix}$ and $|\\mathbf{a}| = \\sqrt{14}$',
    },
    {
      title: 'Vector between two points, unit vector and midpoint',
      problem: 'Points $A(1, 3, -2)$ and $B(5, -1, 0)$ are given. Find the unit vector in the direction of $\\overrightarrow{AB}$ and the midpoint of $AB$.',
      steps: [
        'End minus start: $\\overrightarrow{AB} = \\begin{pmatrix} 5 - 1 \\\\ -1 - 3 \\\\ 0 - (-2) \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ -4 \\\\ 2 \\end{pmatrix}$.',
        'Magnitude: $|\\overrightarrow{AB}| = \\sqrt{16 + 16 + 4} = \\sqrt{36} = 6$.',
        'Unit vector: $\\frac{1}{6}\\begin{pmatrix} 4 \\\\ -4 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} \\frac{2}{3} \\\\ -\\frac{2}{3} \\\\ \\frac{1}{3} \\end{pmatrix}$.',
        'Midpoint: add the position vectors and halve. $\\mathbf{a} + \\mathbf{b} = \\begin{pmatrix} 1 + 5 \\\\ 3 - 1 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ 2 \\\\ -2 \\end{pmatrix}$, and half of that is $\\begin{pmatrix} 3 \\\\ 1 \\\\ -1 \\end{pmatrix}$, so $M = (3, 1, -1)$.',
      ],
      answer: 'Unit vector $\\begin{pmatrix} \\frac{2}{3} \\\\ -\\frac{2}{3} \\\\ \\frac{1}{3} \\end{pmatrix}$, midpoint $(3, 1, -1)$',
    },
    {
      title: 'Angle between two vectors',
      problem: 'Find the angle between $\\mathbf{a} = \\begin{pmatrix} 2 \\\\ 1 \\\\ -2 \\end{pmatrix}$ and $\\mathbf{b} = \\begin{pmatrix} 1 \\\\ -1 \\\\ 1 \\end{pmatrix}$, to 1 decimal place.',
      steps: [
        'Dot product: $\\mathbf{a} \\cdot \\mathbf{b} = (2)(1) + (1)(-1) + (-2)(1) = 2 - 1 - 2 = -1$. It is negative, so expect an obtuse angle.',
        'Magnitudes: $|\\mathbf{a}| = \\sqrt{4 + 1 + 4} = 3$ and $|\\mathbf{b}| = \\sqrt{1 + 1 + 1} = \\sqrt{3}$.',
        '$\\cos\\theta = \\frac{-1}{3\\sqrt{3}} \\approx -0.1925$.',
        '$\\theta = \\cos^{-1}(-0.1925) \\approx 101.1^\\circ$ (calculator in degree mode). It is obtuse, as predicted.',
      ],
      answer: '$\\theta \\approx 101.1^\\circ$',
    },
    {
      title: 'When are three vectors linearly dependent?',
      problem: 'For which value of $k$ are $\\begin{pmatrix} 1 \\\\ 0 \\\\ 2 \\end{pmatrix}$, $\\begin{pmatrix} 0 \\\\ 1 \\\\ k \\end{pmatrix}$ and $\\begin{pmatrix} 1 \\\\ 2 \\\\ 6 \\end{pmatrix}$ linearly dependent?',
      steps: [
        'Three vectors in 3D are dependent exactly when the determinant of the matrix they form is $0$. Use them as rows: $\\det\\begin{pmatrix} 1 & 0 & 2 \\\\ 0 & 1 & k \\\\ 1 & 2 & 6 \\end{pmatrix}$.',
        'Expand along the first row (signs plus, minus, plus). The middle entry is $0$, so its term vanishes, leaving $1 \\times (1 \\times 6 - k \\times 2) + 2 \\times (0 \\times 2 - 1 \\times 1)$.',
        'Simplify: $(6 - 2k) + 2(-1) = 4 - 2k$.',
        'Set it to zero: $4 - 2k = 0$, so $k = 2$.',
        'Check: $\\begin{pmatrix} 1 \\\\ 0 \\\\ 2 \\end{pmatrix} + 2\\begin{pmatrix} 0 \\\\ 1 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 2 \\\\ 6 \\end{pmatrix}$, so the third vector is a combination of the other two.',
      ],
      answer: '$k = 2$',
    },
  ],
  traps: [
    'Getting $\\overrightarrow{AB}$ backwards. It is "end minus start", $\\mathbf{b} - \\mathbf{a}$; using $\\mathbf{a} - \\mathbf{b}$ gives the vector pointing the opposite way.',
    'Treating the dot product as a vector. After multiplying the matching components you must **add** them: the answer is one number.',
    'Magnitude slips: forgetting the final square root, or writing $(-4)^2 = -16$. A square is never negative: $(-4)^2 = 16$.',
    'In the angle formula, dividing by $|\\mathbf{a}| + |\\mathbf{b}|$ instead of $|\\mathbf{a}| \\times |\\mathbf{b}|$, dropping the minus sign of a negative dot product (which turns an obtuse angle into an acute one), or leaving the calculator in radian mode.',
    'Assuming $|\\mathbf{a} + \\mathbf{b}| = |\\mathbf{a}| + |\\mathbf{b}|$. Lengths only add like that when the vectors point the same way; in general expand $|\\mathbf{a} + \\mathbf{b}|^2 = |\\mathbf{a}|^2 + 2\\,\\mathbf{a} \\cdot \\mathbf{b} + |\\mathbf{b}|^2$.',
    'For the midpoint, halving $\\mathbf{b} - \\mathbf{a}$ instead of $\\mathbf{a} + \\mathbf{b}$. Half of $\\overrightarrow{AB}$ is the **step** from $A$ to $M$, not the position of $M$.',
  ],
  examTip:
    'Vector questions on the exam are usually one or two quick calculations, so speed comes from checks rather than long working.\n\n' +
    '- **Plug the options back in.** For "find $k$ so the vectors are perpendicular" or "find the scalars in a linear combination", substituting each option and checking the dot product is $0$ (or that the combination matches) is often faster than solving.\n' +
    '- **Use the sign of the dot product.** Negative means obtuse, so any acute option is wrong; zero means exactly $90^\\circ$. An angle between vectors is never negative or above $180^\\circ$.\n' +
    '- **Unit vector check:** square the components and add; the total must be exactly 1. This kills options divided by the wrong number, and the signs must match the original vector.\n' +
    '- **Midpoint sense check:** each coordinate must lie between the two end coordinates.\n' +
    '- **Independence shortcuts:** parallel vectors, a zero vector, or more vectors than dimensions mean dependent, with no calculation needed. Otherwise use the determinant (most calculators do $3 \\times 3$ determinants in the matrix menu).\n' +
    '- Set your calculator to **degrees** when the options are in degrees, and keep full accuracy until the final rounding.',
};
