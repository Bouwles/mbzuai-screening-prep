import type { StaticQuestion } from '../../../types';

const S = Math.sqrt;

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'indices-surds-001',
    subtopic: 'indices-surds',
    difficulty: 'foundation',
    stem: 'Simplify $\\frac{x^{7} \\times x^{3}}{x^{4}}$.',
    options: ['$x^{\\frac{21}{4}}$', '$x^{17}$', '$x^{6}$', '$x^{14}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Work on the top first, then divide.\n\n' +
        '1. Multiplying powers of the same base: **add** the indices. $x^{7} \\times x^{3} = x^{7+3} = x^{10}$.\n' +
        '2. Dividing powers of the same base: **subtract** the indices. $\\frac{x^{10}}{x^{4}} = x^{10-4} = x^{6}$.\n\n' +
        'Check with $x = 2$: $\\frac{128 \\times 8}{16} = 64 = 2^{6}$.',
      whyWrong: [
        'This multiplies the indices $7 \\times 3 = 21$ and then divides by 4. When you multiply powers you add the indices, and when you divide you subtract them.',
        'This multiplies the indices on top ($7 \\times 3 = 21$) and then subtracts 4. Multiplying $x^{7}$ by $x^{3}$ means adding the indices: $7 + 3 = 10$.',
        null,
        'This adds all three indices ($7 + 3 + 4 = 14$). The $x^{4}$ is on the bottom, so its index must be subtracted, not added.',
      ],
      keyIdea: 'Same base: multiply means add the indices, divide means subtract them.',
    },
    check: {
      optionValues: [2 ** (21 / 4), 2 ** 17, 2 ** 6, 2 ** 14],
      compute: () => {
        const x = 2;
        return (x ** 7 * x ** 3) / x ** 4;
      },
    },
  },
  {
    id: 'indices-surds-002',
    subtopic: 'indices-surds',
    difficulty: 'foundation',
    stem: 'Evaluate $3^{0} + 4^{-2}$.',
    options: ['$\\frac{17}{16}$', '$\\frac{1}{16}$', '$-15$', '$\\frac{9}{8}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Zero index: any non-zero number to the power 0 is 1, so $3^{0} = 1$.\n' +
        '2. Negative index means "one over": $4^{-2} = \\frac{1}{4^{2}} = \\frac{1}{16}$.\n' +
        '3. Add: $1 + \\frac{1}{16} = \\frac{16}{16} + \\frac{1}{16} = \\frac{17}{16}$.',
      whyWrong: [
        null,
        'This takes $3^{0} = 0$. Any non-zero number to the power 0 equals 1, not 0.',
        'This treats $4^{-2}$ as $-16$. A negative index means "one over" (a reciprocal), not a negative number, so $4^{-2} = \\frac{1}{16}$.',
        'This works out $4^{-2}$ as $\\frac{1}{4 \\times 2} = \\frac{1}{8}$, multiplying by the index instead of squaring. $4^{2}$ is $4 \\times 4 = 16$.',
      ],
      keyIdea: '$a^{0} = 1$ and $a^{-n} = \\frac{1}{a^{n}}$: a negative index gives a reciprocal, never a negative number.',
    },
    check: {
      optionValues: [17 / 16, 1 / 16, -15, 9 / 8],
      compute: () => 3 ** 0 + 4 ** -2,
    },
  },
  {
    id: 'indices-surds-003',
    subtopic: 'indices-surds',
    difficulty: 'foundation',
    stem: 'Write $\\sqrt{72}$ in the form $a\\sqrt{b}$, where $a$ and $b$ are integers and $b$ is as small as possible.',
    options: ['$36\\sqrt{2}$', '$6\\sqrt{2}$', '$36$', '$18\\sqrt{2}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. Find the **largest square number** that divides 72. The squares are $4, 9, 16, 25, 36, 49, \\ldots$ and $72 = 36 \\times 2$.\n' +
        '2. Split the root: $\\sqrt{72} = \\sqrt{36} \\times \\sqrt{2}$.\n' +
        '3. Take the square root of the square: $\\sqrt{36} = 6$, so $\\sqrt{72} = 6\\sqrt{2}$.\n\n' +
        'Check on a calculator: $\\sqrt{72} \\approx 8.485$ and $6\\sqrt{2} \\approx 8.485$.',
      whyWrong: [
        'This splits $72 = 36 \\times 2$ correctly but forgets to square-root the 36. The number that comes out in front is $\\sqrt{36} = 6$.',
        null,
        'This halves 72 instead of square-rooting it. A square root is not "divide by 2": $\\sqrt{72} \\approx 8.49$.',
        'This splits $72 = 36 \\times 2$ correctly but then halves the 36 instead of square-rooting it. $\\sqrt{36} = 6$, not 18 (check: $18\\sqrt{2} \\approx 25.46$, far bigger than $\\sqrt{72} \\approx 8.49$).',
      ],
      keyIdea: 'To simplify a surd, pull out the largest square factor: $\\sqrt{ab} = \\sqrt{a}\\sqrt{b}$.',
    },
    check: {
      optionValues: [36 * S(2), 6 * S(2), 36, 18 * S(2)],
      compute: () => {
        const n = 72;
        let k = Math.floor(S(n));
        while (n % (k * k) !== 0) k--;
        return k * S(n / (k * k));
      },
    },
  },
  {
    id: 'indices-surds-004',
    subtopic: 'indices-surds',
    difficulty: 'foundation',
    stem: 'Write $0.00038$ in standard form.',
    options: ['$3.8 \\times 10^{-3}$', '$3.8 \\times 10^{4}$', '$3.8 \\times 10^{-5}$', '$3.8 \\times 10^{-4}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Standard form is $a \\times 10^{n}$ with $1 \\le a < 10$.\n\n' +
        '1. The first non-zero digits are 3 and 8, so $a = 3.8$.\n' +
        '2. Count how many places the decimal point moves to get from $0.00038$ to $3.8$: $0.00038 \\to 0.0038 \\to 0.038 \\to 0.38 \\to 3.8$, which is **4** places to the right.\n' +
        '3. The original number is smaller than 1, so the power is negative: $0.00038 = 3.8 \\times 10^{-4}$.\n\n' +
        'Check: $3.8 \\div 10^{4} = 3.8 \\div 10000 = 0.00038$.',
      whyWrong: [
        'This counts only the three zeros after the decimal point. The point has to move one more place, past the 3, to give $3.8$, so the power is $-4$.',
        'This has the right number of places but the wrong sign. Numbers between 0 and 1 have a **negative** power of 10.',
        'This counts all five digits after the decimal point. The point stops as soon as there is one non-zero digit in front of it ($3.8$), which is 4 places.',
        null,
      ],
      keyIdea: 'Move the decimal point until the number is between 1 and 10; the number of moves is the power, negative for numbers smaller than 1.',
    },
    check: {
      // all options share the number 3.8, so compare the power of 10
      optionValues: [-3, 4, -5, -4],
      compute: () => {
        let x = 0.00038;
        let e = 0;
        while (x < 1) {
          x *= 10;
          e--;
        }
        return e;
      },
    },
  },
  {
    id: 'indices-surds-005',
    subtopic: 'indices-surds',
    difficulty: 'foundation',
    stem: 'Simplify $\\sqrt{3} \\times \\sqrt{12}$.',
    options: ['$6$', '$\\sqrt{15}$', '$36$', '$6\\sqrt{3}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Multiply under one root: $\\sqrt{3} \\times \\sqrt{12} = \\sqrt{3 \\times 12} = \\sqrt{36}$.\n' +
        '2. $\\sqrt{36} = 6$.\n\n' +
        'Another route: $\\sqrt{12} = 2\\sqrt{3}$, so $\\sqrt{3} \\times 2\\sqrt{3} = 2 \\times 3 = 6$.',
      whyWrong: [
        null,
        'This adds the numbers under the roots ($3 + 12 = 15$). The rule is $\\sqrt{a} \\times \\sqrt{b} = \\sqrt{ab}$: multiply them.',
        'This multiplies correctly to get $\\sqrt{36}$ but forgets to take the square root at the end.',
        'This writes $\\sqrt{12} = 2\\sqrt{3}$ and then keeps an extra $\\sqrt{3}$. But $\\sqrt{3} \\times \\sqrt{3} = 3$ uses up both roots, so $\\sqrt{3} \\times 2\\sqrt{3} = 6$ with no root left.',
      ],
      keyIdea: '$\\sqrt{a} \\times \\sqrt{b} = \\sqrt{ab}$, and in particular $\\sqrt{a} \\times \\sqrt{a} = a$.',
    },
    check: {
      optionValues: [6, S(15), 36, 6 * S(3)],
      compute: () => S(3) * S(12),
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'indices-surds-006',
    subtopic: 'indices-surds',
    difficulty: 'exam',
    stem: 'Evaluate $27^{\\frac{2}{3}}$.',
    options: ['$18$', '$9$', '$81\\sqrt{3}$', '$\\frac{1}{9}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'In $a^{\\frac{m}{n}}$ the **bottom** number is the root and the **top** number is the power. Do the root first (it keeps the numbers small).\n\n' +
        '1. Cube root: $\\sqrt[3]{27} = 3$, because $3 \\times 3 \\times 3 = 27$.\n' +
        '2. Square: $3^{2} = 9$.\n\n' +
        'So $27^{\\frac{2}{3}} = 9$.',
      whyWrong: [
        'This multiplies 27 by $\\frac{2}{3}$. An index is not a multiplier: $27^{\\frac{2}{3}}$ means "cube root, then square".',
        null,
        'This flips the fraction in the index and works out $27^{\\frac{3}{2}} = \\left(\\sqrt{27}\\right)^{3} = 81\\sqrt{3}$. The denominator 3 is the root, the numerator 2 is the power.',
        'This takes a reciprocal as if the index were negative. Only a minus sign in the index means "one over"; here the index is positive.',
      ],
      keyIdea: '$a^{\\frac{m}{n}} = \\left(\\sqrt[n]{a}\\right)^{m}$: the denominator is the root, the numerator is the power.',
    },
    check: {
      optionValues: [18, 9, 81 * S(3), 1 / 9],
      compute: () => Math.cbrt(27) ** 2,
    },
  },
  {
    id: 'indices-surds-007',
    subtopic: 'indices-surds',
    difficulty: 'exam',
    stem: 'Evaluate $\\left(\\frac{16}{81}\\right)^{-\\frac{3}{4}}$.',
    options: ['$\\frac{8}{27}$', '$-\\frac{27}{8}$', '$\\frac{27}{8}$', '$\\frac{729}{64}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Deal with the three parts of the index one at a time: minus sign, root, power.\n\n' +
        '1. The minus sign means "flip the fraction": $\\left(\\frac{16}{81}\\right)^{-\\frac{3}{4}} = \\left(\\frac{81}{16}\\right)^{\\frac{3}{4}}$.\n' +
        '2. The 4 on the bottom means fourth root: $\\sqrt[4]{81} = 3$ (since $3^{4} = 81$) and $\\sqrt[4]{16} = 2$ (since $2^{4} = 16$), giving $\\frac{3}{2}$.\n' +
        '3. The 3 on top means cube: $\\left(\\frac{3}{2}\\right)^{3} = \\frac{27}{8}$.',
      whyWrong: [
        'This ignores the minus sign in the index. A negative index means take the reciprocal, so the fraction must be flipped to $\\frac{81}{16}$ first.',
        'This flips the fraction correctly but also makes the answer negative. A negative index never makes the value negative; it only means "one over".',
        null,
        'This takes square roots ($\\sqrt{81} = 9$, $\\sqrt{16} = 4$) instead of fourth roots, then cubes $\\frac{9}{4}$. The 4 in the denominator of the index means the fourth root.',
      ],
      keyIdea: 'For $a^{-\\frac{m}{n}}$: flip (minus sign), take the $n$th root, then raise to the power $m$.',
    },
    check: {
      optionValues: [8 / 27, -27 / 8, 27 / 8, 729 / 64],
      compute: () => (16 / 81) ** (-3 / 4),
    },
  },
  {
    id: 'indices-surds-008',
    subtopic: 'indices-surds',
    difficulty: 'exam',
    stem: 'Simplify $\\frac{(2x^{3})^{4}}{4x^{5}}$.',
    options: ['$4x^{7}$', '$2x^{7}$', '$4x^{2}$', '$\\frac{x^{7}}{2}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Expand the bracket: the power 4 applies to **both** the 2 and the $x^{3}$. $(2x^{3})^{4} = 2^{4} \\times (x^{3})^{4} = 16x^{12}$ (power of a power: multiply, $3 \\times 4 = 12$).\n' +
        '2. Divide the numbers: $16 \\div 4 = 4$.\n' +
        '3. Divide the powers of $x$: $x^{12} \\div x^{5} = x^{12-5} = x^{7}$.\n\n' +
        'So the answer is $4x^{7}$. Check with $x = 2$: $\\frac{16^{4}}{4 \\times 32} = \\frac{65536}{128} = 512$ and $4 \\times 2^{7} = 512$.',
      whyWrong: [
        null,
        'This works out $2^{4}$ as $2 \\times 4 = 8$, giving $\\frac{8x^{12}}{4x^{5}} = 2x^{7}$. But $2^{4} = 2 \\times 2 \\times 2 \\times 2 = 16$.',
        'This adds the indices in $(x^{3})^{4}$ to get $x^{7}$. A power of a power means multiply: $(x^{3})^{4} = x^{12}$.',
        'This forgets to raise the 2 to the power 4, using $2x^{12}$ on top. Everything inside the bracket gets the power.',
      ],
      keyIdea: '$(ab)^{n} = a^{n}b^{n}$ and $(a^{m})^{n} = a^{mn}$: the outside power hits every factor inside the bracket.',
    },
    check: {
      optionValues: [4 * 2 ** 7, 2 * 2 ** 7, 4 * 2 ** 2, 2 ** 7 / 2],
      compute: () => {
        const x = 2;
        return (2 * x ** 3) ** 4 / (4 * x ** 5);
      },
    },
  },
  {
    id: 'indices-surds-009',
    subtopic: 'indices-surds',
    difficulty: 'exam',
    stem: 'Simplify $\\frac{10}{\\sqrt{5}} + \\sqrt{20}$.',
    options: ['$6\\sqrt{5}$', '$4\\sqrt{10}$', '$12\\sqrt{5}$', '$4\\sqrt{5}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Turn both terms into multiples of $\\sqrt{5}$, then add like surds.\n\n' +
        '1. Rationalise: $\\frac{10}{\\sqrt{5}} \\times \\frac{\\sqrt{5}}{\\sqrt{5}} = \\frac{10\\sqrt{5}}{5} = 2\\sqrt{5}$.\n' +
        '2. Simplify: $\\sqrt{20} = \\sqrt{4 \\times 5} = \\sqrt{4} \\times \\sqrt{5} = 2\\sqrt{5}$.\n' +
        '3. Add like surds (just like $2y + 2y = 4y$): $2\\sqrt{5} + 2\\sqrt{5} = 4\\sqrt{5}$.\n\n' +
        'Calculator check: $\\frac{10}{\\sqrt{5}} + \\sqrt{20} \\approx 8.944$ and $4\\sqrt{5} \\approx 8.944$.',
      whyWrong: [
        'This writes $\\sqrt{20} = 4\\sqrt{5}$, forgetting to square-root the 4. $\\sqrt{20} = \\sqrt{4}\\sqrt{5} = 2\\sqrt{5}$.',
        'This gets $2\\sqrt{5} + 2\\sqrt{5}$ but then adds the numbers under the roots too. Like surds add like algebra: $2\\sqrt{5} + 2\\sqrt{5} = 4\\sqrt{5}$, the $\\sqrt{5}$ stays the same.',
        'This multiplies only the top by $\\sqrt{5}$, turning $\\frac{10}{\\sqrt{5}}$ into $10\\sqrt{5}$. You must multiply top **and** bottom, giving $\\frac{10\\sqrt{5}}{5} = 2\\sqrt{5}$.',
        null,
      ],
      keyIdea: 'Write every term as a multiple of the same surd, then add the numbers in front.',
    },
    check: {
      optionValues: [6 * S(5), 4 * S(10), 12 * S(5), 4 * S(5)],
      compute: () => 10 / S(5) + S(20),
    },
  },
  {
    id: 'indices-surds-010',
    subtopic: 'indices-surds',
    difficulty: 'exam',
    stem: 'Rationalise the denominator and simplify $\\frac{4}{3 - \\sqrt{5}}$.',
    options: ['$3 - \\sqrt{5}$', '$3 + \\sqrt{5}$', '$\\frac{6 + 2\\sqrt{5}}{7}$', '$-\\frac{3 + \\sqrt{5}}{4}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Multiply top and bottom by the **conjugate** $3 + \\sqrt{5}$ (same terms, opposite sign).\n\n' +
        '1. Denominator (difference of two squares): $(3 - \\sqrt{5})(3 + \\sqrt{5}) = 3^{2} - (\\sqrt{5})^{2} = 9 - 5 = 4$.\n' +
        '2. Numerator: $4(3 + \\sqrt{5})$.\n' +
        '3. Divide: $\\frac{4(3 + \\sqrt{5})}{4} = 3 + \\sqrt{5}$.\n\n' +
        'Calculator check: $\\frac{4}{3 - \\sqrt{5}} \\approx 5.236$ and $3 + \\sqrt{5} \\approx 5.236$.',
      whyWrong: [
        'This keeps the minus sign from the original denominator in the numerator. You multiply top and bottom by the conjugate $3 + \\sqrt{5}$, so the top becomes $4(3 + \\sqrt{5})$.',
        null,
        'This uses $9 + 5 = 14$ for the denominator. $(a - b)(a + b) = a^{2} - b^{2}$, so the denominator is $9 - 5 = 4$.',
        'This squares $\\sqrt{5}$ to get 25, giving the denominator $9 - 25 = -16$. But $(\\sqrt{5})^{2} = 5$.',
      ],
      keyIdea: 'To rationalise $\\frac{k}{a - \\sqrt{b}}$, multiply top and bottom by $a + \\sqrt{b}$; the bottom becomes $a^{2} - b$.',
    },
    check: {
      optionValues: [3 - S(5), 3 + S(5), (6 + 2 * S(5)) / 7, -(3 + S(5)) / 4],
      compute: () => 4 / (3 - S(5)),
    },
  },
  {
    id: 'indices-surds-011',
    subtopic: 'indices-surds',
    difficulty: 'exam',
    stem: 'Calculate $(6 \\times 10^{5}) \\times (4 \\times 10^{-8})$, giving your answer in standard form.',
    options: ['$2.4 \\times 10^{-3}$', '$2.4 \\times 10^{14}$', '$2.4 \\times 10^{-2}$', '$2.4 \\times 10^{-4}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. Multiply the numbers: $6 \\times 4 = 24$.\n' +
        '2. Multiply the powers of 10 by adding indices: $10^{5} \\times 10^{-8} = 10^{5 + (-8)} = 10^{-3}$.\n' +
        '3. So the product is $24 \\times 10^{-3}$, but this is **not** standard form because 24 is not between 1 and 10.\n' +
        '4. Write $24 = 2.4 \\times 10$, so $24 \\times 10^{-3} = 2.4 \\times 10 \\times 10^{-3} = 2.4 \\times 10^{-2}$.\n\n' +
        'Check: $2.4 \\times 10^{-2} = 0.024$, and $600000 \\times 0.00000004 = 0.024$.',
      whyWrong: [
        'This changes 24 to 2.4 but forgets to adjust the power. Dividing the front number by 10 means the power of 10 must go **up** by 1, from $-3$ to $-2$.',
        'This subtracts the indices, $5 - (-8) = 13$, giving $24 \\times 10^{13} = 2.4 \\times 10^{14}$. Subtracting indices is for division; for multiplication you add them: $5 + (-8) = -3$.',
        null,
        'This adjusts the power in the wrong direction (from $-3$ down to $-4$). Making the front number smaller (24 to 2.4) must make the power bigger.',
      ],
      keyIdea: 'Multiply the numbers, add the powers of 10, then re-adjust so the front number is between 1 and 10.',
    },
    check: {
      optionValues: [2.4e-3, 2.4e14, 2.4e-2, 2.4e-4],
      compute: () => 6e5 * 4e-8,
    },
  },
  {
    id: 'indices-surds-012',
    subtopic: 'indices-surds',
    difficulty: 'exam',
    stem: 'Simplify $\\sqrt{50} - \\sqrt{18} + \\sqrt{8}$.',
    options: ['$4\\sqrt{2}$', '$2\\sqrt{10}$', '$10\\sqrt{2}$', '$6\\sqrt{2}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Simplify each surd by pulling out a square factor; they all turn into multiples of $\\sqrt{2}$.\n\n' +
        '1. $\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2}$\n' +
        '2. $\\sqrt{18} = \\sqrt{9 \\times 2} = 3\\sqrt{2}$\n' +
        '3. $\\sqrt{8} = \\sqrt{4 \\times 2} = 2\\sqrt{2}$\n' +
        '4. Combine like surds: $5\\sqrt{2} - 3\\sqrt{2} + 2\\sqrt{2} = (5 - 3 + 2)\\sqrt{2} = 4\\sqrt{2}$.',
      whyWrong: [
        null,
        'This combines the numbers under the roots: $50 - 18 + 8 = 40$ and $\\sqrt{40} = 2\\sqrt{10}$. You cannot add or subtract inside separate roots; simplify each one first.',
        'This adds all three terms ($5 + 3 + 2 = 10$), ignoring the minus sign in front of $\\sqrt{18}$.',
        'This writes $\\sqrt{8} = 4\\sqrt{2}$, forgetting to square-root the 4. $\\sqrt{8} = \\sqrt{4}\\sqrt{2} = 2\\sqrt{2}$.',
      ],
      keyIdea: 'Only like surds can be added or subtracted, so simplify each surd to the same root first.',
    },
    check: {
      optionValues: [4 * S(2), 2 * S(10), 10 * S(2), 6 * S(2)],
      compute: () => S(50) - S(18) + S(8),
    },
  },
  {
    id: 'indices-surds-013',
    subtopic: 'indices-surds',
    difficulty: 'exam',
    stem: 'Expand and simplify $(2\\sqrt{3} - 1)^{2}$.',
    options: ['$11$', '$7 - 4\\sqrt{3}$', '$13 - 2\\sqrt{3}$', '$13 - 4\\sqrt{3}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Use $(a - b)^{2} = a^{2} - 2ab + b^{2}$ with $a = 2\\sqrt{3}$ and $b = 1$.\n\n' +
        '1. $a^{2} = (2\\sqrt{3})^{2} = 2^{2} \\times (\\sqrt{3})^{2} = 4 \\times 3 = 12$.\n' +
        '2. $2ab = 2 \\times 2\\sqrt{3} \\times 1 = 4\\sqrt{3}$.\n' +
        '3. $b^{2} = 1$.\n' +
        '4. Put together: $12 - 4\\sqrt{3} + 1 = 13 - 4\\sqrt{3}$.\n\n' +
        'Calculator check: $(2\\sqrt{3} - 1)^{2} \\approx 6.072$ and $13 - 4\\sqrt{3} \\approx 6.072$.',
      whyWrong: [
        'This squares each term separately and subtracts: $12 - 1 = 11$. But $(a - b)^{2} \\ne a^{2} - b^{2}$; there is a middle term $-2ab$ and the last term is $+1$.',
        'This works out $(2\\sqrt{3})^{2}$ as $2 \\times 3 = 6$, forgetting to square the 2. $(2\\sqrt{3})^{2} = 4 \\times 3 = 12$.',
        'This forgets to double the middle term. The cross terms are $-2\\sqrt{3}$ twice, giving $-4\\sqrt{3}$.',
        null,
      ],
      keyIdea: 'Expand surd brackets exactly like algebra, remembering $(k\\sqrt{a})^{2} = k^{2}a$.',
    },
    check: {
      optionValues: [11, 7 - 4 * S(3), 13 - 2 * S(3), 13 - 4 * S(3)],
      compute: () => (2 * S(3) - 1) ** 2,
    },
  },
  {
    id: 'indices-surds-014',
    subtopic: 'indices-surds',
    difficulty: 'exam',
    stem:
      'Light travels at $3 \\times 10^{8}$ metres per second. Take the distance from the Sun to the Earth to be $1.5 \\times 10^{11}$ metres. Using these values, how long does light take to travel from the Sun to the Earth?',
    options: ['$4.5 \\times 10^{19}$ seconds', '$5 \\times 10^{2}$ seconds', '$5 \\times 10^{3}$ seconds', '$2 \\times 10^{-3}$ seconds'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Time = distance $\\div$ speed.\n\n' +
        '1. $\\frac{1.5 \\times 10^{11}}{3 \\times 10^{8}} = \\frac{1.5}{3} \\times 10^{11 - 8}$ (divide the numbers, subtract the indices).\n' +
        '2. $\\frac{1.5}{3} = 0.5$ and $10^{11-8} = 10^{3}$, giving $0.5 \\times 10^{3}$.\n' +
        '3. $0.5$ is not between 1 and 10, so write $0.5 = 5 \\times 10^{-1}$: $0.5 \\times 10^{3} = 5 \\times 10^{2}$ seconds.\n\n' +
        'That is 500 seconds, a little over 8 minutes.',
      whyWrong: [
        'This multiplies distance by speed. Time is distance divided by speed.',
        null,
        'This gets $0.5 \\times 10^{3}$ and then changes 0.5 into 5 without lowering the power. Multiplying the front number by 10 means the power must go down by 1.',
        'This divides the wrong way round (speed $\\div$ distance). That gives one over the time, not the time itself.',
      ],
      keyIdea: 'Dividing in standard form: divide the numbers, subtract the powers of 10, then fix the front number so it is between 1 and 10.',
    },
    check: {
      optionValues: [4.5e19, 5e2, 5e3, 2e-3],
      compute: () => 1.5e11 / 3e8,
    },
  },

  // ------------------------------------------------------------------ challenge
  {
    id: 'indices-surds-015',
    subtopic: 'indices-surds',
    difficulty: 'challenge',
    stem: 'Rationalise the denominator and simplify $\\frac{\\sqrt{5} + \\sqrt{3}}{\\sqrt{5} - \\sqrt{3}}$.',
    options: ['$8 + 2\\sqrt{15}$', '$4 + 2\\sqrt{15}$', '$4 + \\sqrt{15}$', '$1 + \\frac{\\sqrt{15}}{4}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Multiply top and bottom by the conjugate of the denominator, $\\sqrt{5} + \\sqrt{3}$.\n\n' +
        '1. Denominator: $(\\sqrt{5} - \\sqrt{3})(\\sqrt{5} + \\sqrt{3}) = 5 - 3 = 2$.\n' +
        '2. Numerator: $(\\sqrt{5} + \\sqrt{3})^{2} = 5 + 2\\sqrt{5}\\sqrt{3} + 3 = 8 + 2\\sqrt{15}$.\n' +
        '3. Divide **every** term by 2: $\\frac{8 + 2\\sqrt{15}}{2} = 4 + \\sqrt{15}$.\n\n' +
        'Calculator check: the original is about $\\frac{3.968}{0.504} \\approx 7.873$ and $4 + \\sqrt{15} \\approx 7.873$.',
      whyWrong: [
        'This finds the numerator $8 + 2\\sqrt{15}$ but forgets to divide by the denominator, which is 2.',
        'This divides only the 8 by 2. Both terms on top must be divided: $\\frac{2\\sqrt{15}}{2} = \\sqrt{15}$.',
        null,
        'This uses $5 + 3 = 8$ for the denominator. The conjugate product is a difference of two squares: $5 - 3 = 2$.',
      ],
      keyIdea: 'Multiplying by the conjugate turns the denominator into a whole number via $(a - b)(a + b) = a^{2} - b^{2}$; then divide every term on top.',
    },
    check: {
      optionValues: [8 + 2 * S(15), 4 + 2 * S(15), 4 + S(15), 1 + S(15) / 4],
      compute: () => (S(5) + S(3)) / (S(5) - S(3)),
    },
  },
  {
    id: 'indices-surds-016',
    subtopic: 'indices-surds',
    difficulty: 'challenge',
    stem: 'For every positive integer $n$, the expression $\\frac{2^{n+3} - 2^{n+1}}{2^{n}}$ is equal to which of the following?',
    options: ['$6$', '$2^{2-n}$', '$8 - 2^{n+1}$', '$6 \\times 2^{n}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Split each power using $a^{m+n} = a^{m} \\times a^{n}$.\n\n' +
        '1. $2^{n+3} = 2^{n} \\times 2^{3} = 8 \\times 2^{n}$ and $2^{n+1} = 2^{n} \\times 2 = 2 \\times 2^{n}$.\n' +
        '2. Numerator: $8 \\times 2^{n} - 2 \\times 2^{n} = 6 \\times 2^{n}$ (just like $8y - 2y = 6y$).\n' +
        '3. Divide by $2^{n}$: $\\frac{6 \\times 2^{n}}{2^{n}} = 6$.\n\n' +
        'Check with $n = 1$: $\\frac{16 - 4}{2} = 6$. With $n = 3$: $\\frac{64 - 16}{8} = 6$.',
      whyWrong: [
        null,
        'This treats $2^{n+3} - 2^{n+1}$ as $2^{(n+3)-(n+1)} = 2^{2}$. Subtracting indices is a rule for **dividing** powers, not for subtracting them. Then dividing by $2^{n}$ gives $2^{2-n}$.',
        'This divides only the first term by $2^{n}$. Every term on top must be divided: $\\frac{2^{n+1}}{2^{n}} = 2$ as well.',
        'This factorises the top correctly as $6 \\times 2^{n}$ but forgets to divide by the $2^{n}$ on the bottom.',
      ],
      keyIdea: 'Factor out the common power: $2^{n+3} - 2^{n+1} = 2^{n}(2^{3} - 2)$.',
    },
    check: {
      // evaluate every option at n = 3
      optionValues: [6, 2 ** (2 - 3), 8 - 2 ** (3 + 1), 6 * 2 ** 3],
      compute: () => {
        const n = 3;
        return (2 ** (n + 3) - 2 ** (n + 1)) / 2 ** n;
      },
    },
  },
  {
    id: 'indices-surds-017',
    subtopic: 'indices-surds',
    difficulty: 'challenge',
    stem: 'Given that $\\frac{5 + \\sqrt{3}}{2 - \\sqrt{3}} = a + b\\sqrt{3}$, where $a$ and $b$ are integers, find $a + b$.',
    options: ['$17$', '$\\frac{20}{7}$', '$-4$', '$20$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Multiply top and bottom by the conjugate $2 + \\sqrt{3}$.\n\n' +
        '1. Denominator: $(2 - \\sqrt{3})(2 + \\sqrt{3}) = 4 - 3 = 1$.\n' +
        '2. Numerator, expanded term by term: $(5 + \\sqrt{3})(2 + \\sqrt{3}) = 10 + 5\\sqrt{3} + 2\\sqrt{3} + 3$.\n' +
        '3. Collect: $10 + 3 = 13$ and $5\\sqrt{3} + 2\\sqrt{3} = 7\\sqrt{3}$, so the numerator is $13 + 7\\sqrt{3}$.\n' +
        '4. Dividing by 1 changes nothing: $a = 13$, $b = 7$, so $a + b = 20$.\n\n' +
        'Calculator check: $\\frac{5 + \\sqrt{3}}{2 - \\sqrt{3}} \\approx 25.12$ and $13 + 7\\sqrt{3} \\approx 25.12$.',
      whyWrong: [
        'This forgets the last term of the expansion, $\\sqrt{3} \\times \\sqrt{3} = 3$, giving $10 + 7\\sqrt{3}$.',
        'This uses $4 + 3 = 7$ for the denominator, giving $\\frac{13 + 7\\sqrt{3}}{7}$. The conjugate product is $4 - 3 = 1$ (and $a$, $b$ must be integers anyway).',
        'This takes $(\\sqrt{3})^{2}$ as 9, so the denominator becomes $4 - 9 = -5$ and $a + b = \\frac{13 + 7}{-5} = -4$. But $(\\sqrt{3})^{2} = 3$.',
        null,
      ],
      keyIdea: 'Rationalise with the conjugate, expand carefully (four terms), then match the whole-number part and the $\\sqrt{3}$ part.',
    },
    check: {
      optionValues: [17, 20 / 7, -4, 20],
      compute: () => {
        const v = (5 + S(3)) / (2 - S(3));
        for (let b = -50; b <= 50; b++) {
          const a = v - b * S(3);
          if (Math.abs(a - Math.round(a)) < 1e-9) return Math.round(a) + b;
        }
        return NaN;
      },
    },
  },
  {
    id: 'indices-surds-018',
    subtopic: 'indices-surds',
    difficulty: 'challenge',
    stem: 'Solve the simultaneous equations $2^{x} \\times 4^{y} = 32$ and $\\frac{3^{x}}{9^{y}} = \\frac{1}{3}$.',
    options: ['$x = 3$, $y = 1$', '$x = 2$, $y = \\frac{3}{2}$', '$x = 2$, $y = 3$', '$x = 2$, $y = 1$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Write everything as a power of the same base, then compare indices.\n\n' +
        '1. First equation: $4^{y} = (2^{2})^{y} = 2^{2y}$ and $32 = 2^{5}$, so $2^{x} \\times 2^{2y} = 2^{5}$, i.e. $x + 2y = 5$.\n' +
        '2. Second equation: $9^{y} = (3^{2})^{y} = 3^{2y}$ and $\\frac{1}{3} = 3^{-1}$, so $3^{x - 2y} = 3^{-1}$, i.e. $x - 2y = -1$.\n' +
        '3. Add the two equations: $2x = 4$, so $x = 2$.\n' +
        '4. Substitute: $2 + 2y = 5$, so $2y = 3$ and $y = \\frac{3}{2}$.\n\n' +
        'Check: $2^{2} \\times 4^{\\frac{3}{2}} = 4 \\times 8 = 32$ and $\\frac{3^{2}}{9^{\\frac{3}{2}}} = \\frac{9}{27} = \\frac{1}{3}$.',
      whyWrong: [
        'This drops the minus sign, treating $\\frac{1}{3}$ as $3$ instead of $3^{-1}$, so the second equation becomes $x - 2y = 1$. Check: $\\frac{3^{3}}{9} = 3$, not $\\frac{1}{3}$.',
        null,
        'This treats $4^{y}$ as $2^{y}$ and $9^{y}$ as $3^{y}$, solving $x + y = 5$ and $x - y = -1$. But $4^{y} = 2^{2y}$ and $9^{y} = 3^{2y}$.',
        'This writes $4^{y}$ as $2^{y+2}$ (adding instead of multiplying the indices), giving $x + y = 3$ and $x - y = 1$. The correct rule is $(2^{2})^{y} = 2^{2y}$.',
      ],
      keyIdea: 'Rewrite each side as a power of one base; equal powers of the same base have equal indices.',
    },
    check: {
      optionValues: ['3,1', '2,1.5', '2,3', '2,1'],
      compute: () => {
        for (let x = -6; x <= 6; x += 0.5)
          for (let y = -6; y <= 6; y += 0.5)
            if (Math.abs(2 ** x * 4 ** y - 32) < 1e-9 && Math.abs(3 ** x / 9 ** y - 1 / 3) < 1e-9) return `${x},${y}`;
        return 'none';
      },
    },
  },
  {
    id: 'indices-surds-019',
    subtopic: 'indices-surds',
    difficulty: 'challenge',
    stem: 'Given $x > 0$ and $y > 0$, simplify $\\left(\\frac{8x^{6}}{27y^{-3}}\\right)^{-\\frac{2}{3}}$.',
    options: ['$\\frac{4x^{4}y^{2}}{9}$', '$\\frac{9y^{2}}{4x^{4}}$', '$\\frac{9}{4x^{4}y^{2}}$', '$\\frac{3}{2x^{2}y}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. Tidy the inside first: $\\frac{1}{y^{-3}} = y^{3}$, so $\\frac{8x^{6}}{27y^{-3}} = \\frac{8x^{6}y^{3}}{27}$.\n' +
        '2. The minus sign in the index flips the fraction: $\\left(\\frac{8x^{6}y^{3}}{27}\\right)^{-\\frac{2}{3}} = \\left(\\frac{27}{8x^{6}y^{3}}\\right)^{\\frac{2}{3}}$.\n' +
        '3. Cube root of each part: $\\sqrt[3]{27} = 3$, $\\sqrt[3]{8} = 2$, $(x^{6})^{\\frac{1}{3}} = x^{2}$, $(y^{3})^{\\frac{1}{3}} = y$. This gives $\\frac{3}{2x^{2}y}$.\n' +
        '4. Square: $\\left(\\frac{3}{2x^{2}y}\\right)^{2} = \\frac{9}{4x^{4}y^{2}}$.\n\n' +
        'Check with $x = 2$, $y = 3$: inside is $\\frac{8 \\times 64}{27 \\times \\frac{1}{27}} = 512$, and $512^{-\\frac{2}{3}} = \\frac{1}{64}$; also $\\frac{9}{4 \\times 16 \\times 9} = \\frac{1}{64}$.',
      whyWrong: [
        'This ignores the minus sign in the index, so the fraction is never flipped.',
        'This moves $y^{-3}$ from the bottom to the top without changing the sign of its index. In fact $\\frac{1}{y^{-3}} = y^{3}$, so after the flip $y$ belongs on the bottom.',
        null,
        'This takes the cube root but forgets to square, which is the power $-\\frac{1}{3}$ instead of $-\\frac{2}{3}$.',
      ],
      keyIdea: 'Handle a fractional negative index in order: flip, take the root, then the power, applying it to every factor.',
    },
    check: {
      // evaluate every option at x = 2, y = 3
      optionValues: [(4 * 16 * 9) / 9, (9 * 9) / (4 * 16), 9 / (4 * 16 * 9), 3 / (2 * 4 * 3)],
      compute: () => {
        const x = 2;
        const y = 3;
        return ((8 * x ** 6) / (27 * y ** -3)) ** (-2 / 3);
      },
    },
  },
];
