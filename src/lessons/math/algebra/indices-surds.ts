import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'indices-surds',
  know:
    '### What an index means\n\n' +
    'An **index** (or power, or exponent) is shorthand for repeated multiplication. $2^{5}$ means $2 \\times 2 \\times 2 \\times 2 \\times 2 = 32$. The 2 is the **base** and the 5 is the **index**. Almost every rule below comes from just counting how many copies of the base are being multiplied.\n\n' +
    '### The three main laws (same base only)\n\n' +
    '- **Multiply: add the indices.** $x^{3} \\times x^{4}$ is three $x$s times four $x$s, which is seven $x$s: $x^{7}$.\n' +
    '- **Divide: subtract the indices.** $\\frac{x^{9}}{x^{4}} = x^{5}$, because four $x$s cancel from top and bottom.\n' +
    '- **Power of a power: multiply the indices.** $(x^{3})^{4} = x^{12}$, because it is $x^{3}$ written out four times.\n\n' +
    'A power outside a bracket hits **everything** inside: $(2x^{3})^{4} = 2^{4}x^{12} = 16x^{12}$. A very common slip is to leave the 2 alone, or to work out $2^{4}$ as $2 \\times 4$.\n\n' +
    'These laws only work when the bases are the same. To combine $4^{y}$ with $2^{x}$, first rewrite $4 = 2^{2}$, so $4^{y} = 2^{2y}$.\n\n' +
    '### Zero and negative indices\n\n' +
    '- $a^{0} = 1$ for any $a \\ne 0$. (Think $\\frac{a^{3}}{a^{3}} = a^{0}$, and anything divided by itself is 1.)\n' +
    '- $a^{-n} = \\frac{1}{a^{n}}$. A minus sign in the index means **"one over"**. It never makes the answer negative: $2^{-3} = \\frac{1}{8}$, not $-8$.\n' +
    '- For a fraction, a negative index just flips it: $\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^{2} = \\frac{9}{4}$.\n\n' +
    '### Fractional indices\n\n' +
    'A fraction in the index means a **root**. $a^{\\frac{1}{2}} = \\sqrt{a}$ and $a^{\\frac{1}{3}} = \\sqrt[3]{a}$. In general, for $a^{\\frac{m}{n}}$:\n\n' +
    '| Part of the index | What it does |\n' +
    '| --- | --- |\n' +
    '| minus sign | flip (reciprocal) |\n' +
    '| denominator $n$ | take the $n$th root |\n' +
    '| numerator $m$ | raise to the power $m$ |\n\n' +
    'Do the root first to keep numbers small: $8^{\\frac{2}{3}} = (\\sqrt[3]{8})^{2} = 2^{2} = 4$.\n\n' +
    '### Surds\n\n' +
    'A **surd** is a root that is not a whole number, such as $\\sqrt{2}$ or $\\sqrt{12}$. We keep it exact instead of writing a rounded decimal. Two rules do almost all the work:\n\n' +
    '- $\\sqrt{ab} = \\sqrt{a} \\times \\sqrt{b}$ and $\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$\n' +
    '- $\\sqrt{a} \\times \\sqrt{a} = a$\n\n' +
    '**Simplifying:** pull out the largest square factor. $\\sqrt{48} = \\sqrt{16 \\times 3} = 4\\sqrt{3}$. Learn the squares $4, 9, 16, 25, 36, 49, 64, 81, 100$ so you can spot them.\n\n' +
    '**Adding and subtracting:** only **like surds** combine, exactly like algebra: $5\\sqrt{2} + 3\\sqrt{2} = 8\\sqrt{2}$ (like $5y + 3y = 8y$). But $\\sqrt{2} + \\sqrt{3}$ cannot be simplified, and $\\sqrt{9 + 16} = 5$ is **not** $\\sqrt{9} + \\sqrt{16} = 7$. Simplify every surd first and like terms often appear.\n\n' +
    '**Multiplying:** multiply the numbers outside together and the numbers inside together: $2\\sqrt{3} \\times 5\\sqrt{2} = 10\\sqrt{6}$. Expand brackets exactly as in algebra.\n\n' +
    '### Rationalising the denominator\n\n' +
    'Maths convention says no surd on the bottom of a fraction.\n\n' +
    '- **Single surd:** multiply top and bottom by that surd. $\\frac{6}{\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$.\n' +
    '- **Bracket like $a + \\sqrt{b}$:** multiply top and bottom by the **conjugate** $a - \\sqrt{b}$ (same terms, opposite sign). The bottom becomes a difference of two squares, $a^{2} - b$, which is a whole number.\n\n' +
    'Example: $\\frac{2}{3 + \\sqrt{7}} \\times \\frac{3 - \\sqrt{7}}{3 - \\sqrt{7}} = \\frac{2(3 - \\sqrt{7})}{9 - 7} = 3 - \\sqrt{7}$.\n\n' +
    '### Standard form\n\n' +
    'Standard form writes a number as $a \\times 10^{n}$ where $1 \\le a < 10$ and $n$ is a whole number. Big numbers have positive $n$ ($45000 = 4.5 \\times 10^{4}$), numbers smaller than 1 have negative $n$ ($0.0072 = 7.2 \\times 10^{-3}$). The power is just how many places the decimal point moves.\n\n' +
    'To multiply, multiply the front numbers and **add** the powers; to divide, divide the front numbers and **subtract** the powers. Then fix the front number so it is between 1 and 10: $24 \\times 10^{5} = 2.4 \\times 10^{6}$ (front number down, power up) and $0.5 \\times 10^{3} = 5 \\times 10^{2}$ (front number up, power down).',
  formulas: [
    { label: 'Multiplying powers', tex: 'a^{m} \\times a^{n} = a^{m+n}', note: 'Same base only.' },
    { label: 'Dividing powers', tex: '\\frac{a^{m}}{a^{n}} = a^{m-n}' },
    { label: 'Power of a power', tex: '(a^{m})^{n} = a^{mn}' },
    { label: 'Power of a product or quotient', tex: '(ab)^{n} = a^{n}b^{n} \\qquad \\left(\\frac{a}{b}\\right)^{n} = \\frac{a^{n}}{b^{n}}', note: 'The outside power applies to every factor inside the bracket.' },
    { label: 'Zero index', tex: 'a^{0} = 1 \\quad (a \\ne 0)' },
    { label: 'Negative index', tex: 'a^{-n} = \\frac{1}{a^{n}} \\qquad \\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^{n}', note: 'A negative index gives a reciprocal, never a negative number.' },
    { label: 'Fractional index', tex: 'a^{\\frac{1}{n}} = \\sqrt[n]{a} \\qquad a^{\\frac{m}{n}} = \\left(\\sqrt[n]{a}\\right)^{m}', note: 'Denominator = root, numerator = power. Take the root first.' },
    { label: 'Multiplying and dividing surds', tex: '\\sqrt{ab} = \\sqrt{a}\\sqrt{b} \\qquad \\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}' },
    { label: 'Surd times itself', tex: '\\sqrt{a} \\times \\sqrt{a} = a \\qquad (k\\sqrt{a})^{2} = k^{2}a' },
    { label: 'Like surds', tex: 'p\\sqrt{a} + q\\sqrt{a} = (p + q)\\sqrt{a}', note: 'But the square root of a sum is not the sum of the square roots.' },
    { label: 'Rationalising a single surd', tex: '\\frac{k}{\\sqrt{a}} = \\frac{k\\sqrt{a}}{a}' },
    { label: 'Conjugate (difference of two squares)', tex: '(a + \\sqrt{b})(a - \\sqrt{b}) = a^{2} - b', note: 'Multiply top and bottom by the conjugate to rationalise a denominator.' },
    { label: 'Standard form', tex: 'a \\times 10^{n}, \\quad 1 \\le a < 10, \\quad n \\in \\mathbb{Z}' },
  ],
  examples: [
    {
      title: 'Using the index laws together',
      problem: 'Simplify $\\frac{(3x^{2})^{3} \\times x^{4}}{9x^{5}}$.',
      steps: [
        'Expand the bracket; the power 3 applies to the 3 and to $x^{2}$: $(3x^{2})^{3} = 3^{3}x^{2 \\times 3} = 27x^{6}$.',
        'Multiply by $x^{4}$ (add indices): $27x^{6} \\times x^{4} = 27x^{10}$.',
        'Divide the numbers: $27 \\div 9 = 3$.',
        'Divide the powers (subtract indices): $x^{10} \\div x^{5} = x^{5}$.',
      ],
      answer: '$3x^{5}$',
    },
    {
      title: 'A negative fractional index',
      problem: 'Evaluate $8^{-\\frac{2}{3}}$.',
      steps: [
        'Minus sign: flip. $8^{-\\frac{2}{3}} = \\frac{1}{8^{\\frac{2}{3}}}$.',
        'Denominator 3: cube root. $\\sqrt[3]{8} = 2$.',
        'Numerator 2: square. $2^{2} = 4$, so $8^{\\frac{2}{3}} = 4$.',
        'Put it back under the 1: $\\frac{1}{4}$.',
      ],
      answer: '$\\frac{1}{4}$',
    },
    {
      title: 'Adding surds',
      problem: 'Simplify $\\sqrt{48} + \\sqrt{27} - \\sqrt{12}$.',
      steps: [
        '$\\sqrt{48} = \\sqrt{16 \\times 3} = 4\\sqrt{3}$.',
        '$\\sqrt{27} = \\sqrt{9 \\times 3} = 3\\sqrt{3}$.',
        '$\\sqrt{12} = \\sqrt{4 \\times 3} = 2\\sqrt{3}$.',
        'All are like surds now: $4\\sqrt{3} + 3\\sqrt{3} - 2\\sqrt{3} = (4 + 3 - 2)\\sqrt{3} = 5\\sqrt{3}$.',
      ],
      answer: '$5\\sqrt{3}$',
    },
    {
      title: 'Rationalising with a conjugate (exam level)',
      problem: 'Write $\\frac{6}{2 + \\sqrt{3}}$ in the form $p + q\\sqrt{3}$, where $p$ and $q$ are integers.',
      steps: [
        'The conjugate of $2 + \\sqrt{3}$ is $2 - \\sqrt{3}$. Multiply top and bottom by it: $\\frac{6}{2 + \\sqrt{3}} \\times \\frac{2 - \\sqrt{3}}{2 - \\sqrt{3}}$.',
        'Denominator: $(2 + \\sqrt{3})(2 - \\sqrt{3}) = 2^{2} - (\\sqrt{3})^{2} = 4 - 3 = 1$.',
        'Numerator: $6(2 - \\sqrt{3}) = 12 - 6\\sqrt{3}$.',
        'Divide by 1 (no change): $12 - 6\\sqrt{3}$, so $p = 12$ and $q = -6$.',
        'Calculator check: $\\frac{6}{2 + \\sqrt{3}} \\approx 1.608$ and $12 - 6\\sqrt{3} \\approx 1.608$.',
      ],
      answer: '$12 - 6\\sqrt{3}$',
    },
  ],
  traps: [
    'Thinking a negative index makes the number negative. $5^{-2} = \\frac{1}{25}$, not $-25$.',
    'Forgetting that the outside power applies to the number too: $(2x^{3})^{4} = 16x^{12}$, not $2x^{12}$ or $8x^{12}$.',
    'Mixing up the parts of a fractional index: in $27^{\\frac{2}{3}}$ the 3 is the root and the 2 is the power (answer 9), and the index is never a multiplier ($27^{\\frac{2}{3}}$ is not 18).',
    'Adding or subtracting inside roots: $\\sqrt{50} - \\sqrt{18}$ is not $\\sqrt{32}$. Simplify each surd first: $5\\sqrt{2} - 3\\sqrt{2} = 2\\sqrt{2}$.',
    'Getting the conjugate denominator wrong: $(a + \\sqrt{b})(a - \\sqrt{b}) = a^{2} - b$, not $a^{2} + b$ and not $a^{2} - b^{2}$. Also remember to divide **every** term on top by it.',
    'Leaving the front number outside 1 to 10 in standard form, or moving the power the wrong way: $24 \\times 10^{-3} = 2.4 \\times 10^{-2}$ (front number smaller, power bigger).',
  ],
  examTip:
    'Most questions on this topic have an exact answer, and the wrong options are built from the slips above (ignoring a minus sign, forgetting to square-root a factor, using $a^{2} + b$ instead of $a^{2} - b$). The fastest check is your calculator: type in the original expression, then each option, and pick the one with the same decimal. For example $\\frac{4}{3 - \\sqrt{5}} \\approx 5.236$ and $3 + \\sqrt{5} \\approx 5.236$. For algebraic answers, choose a value such as $x = 2$ and compare the question with each option. Quick eliminations: a negative index never gives a negative answer; for a base bigger than 1, an index between 0 and 1 gives a smaller answer (for example $8^{\\frac{1}{3}} = 2$); in standard form the front number must be at least 1 and less than 10.',
};
