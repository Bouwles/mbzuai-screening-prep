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
      asking: 'Write this as a single power of $x$.',
      solution:
        'The small raised number is called the **index** (or power). $x^7$ means seven $x$s multiplied together.\n\n' +
        'Start with the top. $x^7 \\times x^3$ means seven $x$s times three more, so $7 + 3 = 10$ in total. When you multiply powers of the same letter, you add the indices: $x^{10}$.\n\n' +
        'Now divide by $x^4$. Four of the $x$s on top cancel with the four on the bottom, so subtract the indices: $10 - 4 = 6$. That leaves $x^6$.',
      conclusion: 'Adding for the multiply and subtracting for the divide leaves six $x$s, so the answer is $x^{6}$.',
      whyWrong: [
        'This multiplies the indices $7 \\times 3 = 21$ and then divides by 4. When you multiply powers you add the indices, and when you divide you subtract them.',
        'This multiplies the indices on top ($7 \\times 3 = 21$) and then subtracts 4. Multiplying $x^{7}$ by $x^{3}$ means adding the indices: $7 + 3 = 10$.',
        null,
        'This adds all three indices ($7 + 3 + 4 = 14$). The $x^{4}$ is on the bottom, so its index must be subtracted, not added.',
      ],
      keyIdea: 'With the same base (the number or letter being raised), multiply means add the indices and divide means subtract them. So $x^a \\times x^b = x^{a+b}$ and $\\frac{x^a}{x^b} = x^{a-b}$.',
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
      asking: 'What do you get when you work out each power and add the results?',
      solution:
        'Any non-zero number to the power 0 equals 1. See the pattern: $3^3 = 27$ and $3^2 = 9$, so each step down divides by 3. The next value is 3, and the one after that is $3^0 = 3 \\div 3 = 1$.\n\n' +
        'A negative index means "one over". It does not make the number negative: $4^{-2} = \\frac{1}{4^2}$.\n\n' +
        'Work out the bottom: $4^2 = 4 \\times 4 = 16$. So $4^{-2} = \\frac{1}{16}$.\n\n' +
        'Add the two results. Write 1 as $\\frac{16}{16}$ so the bottoms match: $\\frac{16}{16} + \\frac{1}{16} = \\frac{17}{16}$.',
      conclusion: 'One plus one sixteenth makes seventeen sixteenths, so the answer is $\\frac{17}{16}$.',
      whyWrong: [
        null,
        'This takes $3^{0} = 0$. Any non-zero number to the power 0 equals 1, not 0.',
        'This treats $4^{-2}$ as $-16$. A negative index means "one over" (a reciprocal), not a negative number, so $4^{-2} = \\frac{1}{16}$.',
        'This works out $4^{-2}$ as $\\frac{1}{4 \\times 2} = \\frac{1}{8}$, multiplying by the index instead of squaring. $4^{2}$ is $4 \\times 4 = 16$.',
      ],
      keyIdea: 'Know the two special indices: $a^0 = 1$ for any non-zero $a$, and $a^{-n} = \\frac{1}{a^n}$. For a negative index, work out the positive power first, then put it under 1.',
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
      asking: 'Rewrite $\\sqrt{72}$ with a whole number in front and the smallest possible number under the root.',
      solution:
        'We can split a root across a multiplication: $\\sqrt{a \\times b} = \\sqrt{a} \\times \\sqrt{b}$. So if part of 72 is a square number, its root comes out whole.\n\n' +
        'Find the biggest square number that divides 72. Square numbers are 4, 9, 16, 25, 36 and so on, and $72 = 36 \\times 2$.\n\n' +
        'Split the root: $\\sqrt{72} = \\sqrt{36} \\times \\sqrt{2}$.\n\n' +
        '$\\sqrt{36} = 6$, so this is $6 \\times \\sqrt{2}$, which we write as $6\\sqrt{2}$.',
      conclusion: 'The 2 left under the root has no square factor to take out, so the answer is $6\\sqrt{2}$.',
      whyWrong: [
        'This splits $72 = 36 \\times 2$ correctly but forgets to square-root the 36. The number that comes out in front is $\\sqrt{36} = 6$.',
        null,
        'This halves 72 instead of square-rooting it. A square root is not "divide by 2": $\\sqrt{72} \\approx 8.49$.',
        'This splits $72 = 36 \\times 2$ correctly but then halves the 36 instead of square-rooting it. $\\sqrt{36} = 6$, not 18 (check: $18\\sqrt{2} \\approx 25.46$, far bigger than $\\sqrt{72} \\approx 8.49$).',
      ],
      keyIdea: 'To simplify a square root, find the largest square number that divides the number inside. Split it off, write its root in front, and leave the rest inside.',
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
      asking: 'Write $0.00038$ as a number from 1 to 10 times a power of 10.',
      solution:
        '**Standard form** is $A \\times 10^n$. $A$ is a number from 1 up to, but not including, 10, and $n$ is a whole number.\n\n' +
        'Move the decimal point to the right until one non-zero digit is in front of it. That gives $3.8$, so $A = 3.8$.\n\n' +
        'Count how many places the point moved. Starting from $0.00038$, it passes 0, 0, 0 and 3, which is 4 places.\n\n' +
        'We made the number bigger to get 3.8, so we must divide by 10 four times to keep its value. Dividing by $10^4$ is the same as multiplying by $10^{-4}$. So $0.00038 = 3.8 \\times 10^{-4}$.',
      conclusion: 'Dividing 3.8 by 10000 returns $0.00038$, so the answer is $3.8 \\times 10^{-4}$.',
      whyWrong: [
        'This counts only the three zeros after the decimal point. The point has to move one more place, past the 3, to give $3.8$, so the power is $-4$.',
        'This has the right number of places but the wrong sign. Numbers between 0 and 1 have a **negative** power of 10.',
        'This counts all five digits after the decimal point. The point stops as soon as there is one non-zero digit in front of it ($3.8$), which is 4 places.',
        null,
      ],
      keyIdea: 'To write a small number in standard form: move the point right until there is one non-zero digit before it. Count the places moved. That count, with a minus sign, is the power of 10.',
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
      asking: 'What simple number is $\\sqrt{3}$ times $\\sqrt{12}$?',
      solution:
        'Two square roots can be multiplied into one: $\\sqrt{a} \\times \\sqrt{b} = \\sqrt{a \\times b}$.\n\n' +
        'Use this here: $\\sqrt{3} \\times \\sqrt{12} = \\sqrt{3 \\times 12} = \\sqrt{36}$.\n\n' +
        '36 is a square number, because $6 \\times 6 = 36$. So $\\sqrt{36} = 6$.',
      conclusion: 'The two roots combine into $\\sqrt{36}$, which is a whole number, so the answer is $6$.',
      whyWrong: [
        null,
        'This adds the numbers under the roots ($3 + 12 = 15$). The rule is $\\sqrt{a} \\times \\sqrt{b} = \\sqrt{ab}$: multiply them.',
        'This multiplies correctly to get $\\sqrt{36}$ but forgets to take the square root at the end.',
        'This writes $\\sqrt{12} = 2\\sqrt{3}$ and then keeps an extra $\\sqrt{3}$. But $\\sqrt{3} \\times \\sqrt{3} = 3$ uses up both roots, so $\\sqrt{3} \\times 2\\sqrt{3} = 6$ with no root left.',
      ],
      keyIdea: 'To multiply square roots, multiply the numbers inside and put them under one root. Then look for a square number inside, so you can simplify it.',
    },
    check: {
      optionValues: [6, S(15), 36, 6 * S(3)],
      compute: () => S(3) * S(12),
    },
  },
  {
    id: 'indices-surds-020',
    subtopic: 'indices-surds',
    difficulty: 'foundation',
    stem: 'For any non-zero number $a$, what is $a^{0}$?',
    options: ['$1$', '$0$', '$a$', 'Undefined'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does any non-zero number to the power 0 equal?',
      solution:
        'Look at the powers of 2: $2^3 = 8$ and $2^2 = 4$. Each time the index drops by 1, the value is divided by 2. So 2 to the power 1 is 2.\n\n' +
        'Carry on one more step: $2^0 = 2 \\div 2 = 1$. The same happens for any non-zero number, because the last step is that number divided by itself.',
      conclusion: 'Dividing $a$ by itself always gives 1, so the answer is $1$.',
      whyWrong: [
        null,
        'This treats the power 0 as multiplying by 0. An index is not a multiplier.',
        '$a$ is what you get from the power 1, not the power 0.',
        'Only $0^{0}$ causes difficulty, and the question says $a$ is not zero.',
      ],
      keyIdea: 'Rule: $a^0 = 1$ whenever $a$ is not zero. To rebuild it, use $\\frac{a^n}{a^n}$, which equals 1 and also equals $a^{n-n}$, which is $a^0$.',
    },
    check: {
      // each option evaluated at a = 5
      optionValues: [1, 0, 5, null],
      compute: () => 5 ** 3 / 5 ** 3,
    },
  },
  {
    id: 'indices-surds-021',
    subtopic: 'indices-surds',
    difficulty: 'foundation',
    stem: 'Which expression is equal to $x^{-3}$?',
    options: ['$\\frac{1}{x^{3}}$', '$-x^{3}$', '$-3x$', '$x^{\\frac{1}{3}}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does a power of $-3$ mean, written another way?',
      solution:
        'A negative index means "one over the positive power". It does not make the value negative.\n\n' +
        'See why with a pattern. Each time the index drops by 1, we divide by $x$. Start from $x^0 = 1$ and keep dividing: $x^{-1} = \\frac{1}{x}$, then $x^{-2} = \\frac{1}{x^2}$.\n\n' +
        'One more step gives $x^{-3} = \\frac{1}{x^{3}}$.',
      conclusion: 'The minus sign in the index puts the power underneath 1, so the answer is $\\frac{1}{x^{3}}$.',
      whyWrong: [
        null,
        'A negative index gives a reciprocal, not a negative number.',
        'This multiplies $x$ by the index. An index is not a multiplier.',
        'The index $\\frac{1}{3}$ means a cube root. A root comes from a fractional index, not a negative one.',
      ],
      keyIdea: 'To rewrite a negative index, put the positive power under 1: $a^{-n} = \\frac{1}{a^n}$. A fraction in the index means a root. A minus in the index means "one over".',
    },
    check: {
      // each option evaluated at x = 2
      optionValues: [1 / 8, -8, -6, 2 ** (1 / 3)],
      compute: () => 2 ** -3,
    },
  },
  {
    id: 'indices-surds-022',
    subtopic: 'indices-surds',
    difficulty: 'foundation',
    stem: 'For $x > 0$, which expression is equal to $x^{\\frac{1}{2}}$?',
    options: ['$\\sqrt{x}$', '$\\frac{x}{2}$', '$\\frac{1}{x^{2}}$', '$x^{2}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does a power of one half mean?',
      solution:
        'To find out, multiply $x^{\\frac{1}{2}}$ by itself. When you multiply powers, you add the indices, and $\\frac{1}{2} + \\frac{1}{2}$ makes 1. So the result is just $x$.\n\n' +
        'So $x^{\\frac{1}{2}}$ is a number that gives $x$ when multiplied by itself. That is exactly what a square root is, so $x^{\\frac{1}{2}} = \\sqrt{x}$.',
      conclusion: 'Multiplying it by itself gives $x$, which makes it the square root, so the answer is $\\sqrt{x}$.',
      whyWrong: [
        null,
        'This multiplies $x$ by the index. An index is not a multiplier.',
        'This is $x^{-2}$. A fraction in the index means a root; only a minus sign means "one over".',
        'This flips the index from $\\frac{1}{2}$ to 2, which squares $x$ instead of square-rooting it.',
      ],
      keyIdea: 'A fraction in the index means a root: $x^{\\frac{1}{n}} = \\sqrt[n]{x}$. For $x^{\\frac{m}{n}}$, the bottom number is the root and the top number is the power.',
    },
    check: {
      // each option evaluated at x = 9
      optionValues: [3, 4.5, 1 / 81, 81],
      compute: () => 9 ** (1 / 2),
    },
  },
  {
    id: 'indices-surds-023',
    subtopic: 'indices-surds',
    difficulty: 'foundation',
    stem: 'Which of the following is a surd?',
    options: ['$\\sqrt{7}$', '$\\sqrt{9}$', '$\\sqrt{\\frac{1}{4}}$', '$\\sqrt[3]{8}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which of these roots cannot be written as an exact whole number or fraction?',
      solution:
        'A **surd** is a root that does not come out exact. As a decimal it goes on forever without repeating, so we leave it as a root.\n\n' +
        'Try to work out each one:\n\n| Root | Exact value |\n|---|---|\n| $\\sqrt{9}$ | 3 |\n| $\\sqrt{\\frac{1}{4}}$ | $\\frac{1}{2}$ |\n| $\\sqrt[3]{8}$ | 2 |\n| $\\sqrt{7}$ | none, because 7 is not a square number |',
      conclusion: 'The other three come out exact, and the root of 7 does not. So the answer is $\\sqrt{7}$.',
      whyWrong: [
        null,
        '$\\sqrt{9} = 3$ exactly, so it is a whole number written as a root.',
        '$\\sqrt{\\frac{1}{4}} = \\frac{1}{2}$ exactly, so it is a fraction written as a root.',
        '$\\sqrt[3]{8} = 2$ exactly, because $2^{3} = 8$. A root is not a surd if it comes out exact.',
      ],
      keyIdea: 'To test for a surd, try to work out the root exactly. If the number inside is a perfect square (or a perfect cube for a cube root), it is not a surd. If it stays a root, it is.',
    },
  },
  {
    id: 'indices-surds-024',
    subtopic: 'indices-surds',
    difficulty: 'foundation',
    stem: 'What is the conjugate of $3 - \\sqrt{5}$?',
    options: ['$3 + \\sqrt{5}$', '$-3 + \\sqrt{5}$', '$\\frac{1}{3 - \\sqrt{5}}$', '$-3 - \\sqrt{5}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What partner of $3 - \\sqrt{5}$ do you get by changing only the sign in the middle?',
      solution:
        'The **conjugate** of a two-term surd expression keeps both terms and changes the sign between them. In $3 - \\sqrt{5}$ the middle sign is $-$, so it becomes $+$.\n\n' +
        'That gives $3 + \\sqrt{5}$. It is useful because multiplying the pair removes the root: $(3 - \\sqrt{5})(3 + \\sqrt{5}) = 9 - 5 = 4$.',
      conclusion: 'Only the middle sign changes, so the answer is $3 + \\sqrt{5}$.',
      whyWrong: [
        null,
        'This changes both signs, which gives the negative of the number, not its conjugate.',
        'This is the reciprocal of the number. The conjugate is what you multiply by to clear the surd.',
        'This changes the sign of the first term and keeps the sign of the surd. Only the sign between the terms changes.',
      ],
      keyIdea: 'To find a conjugate, keep the same two terms and flip the sign between them: $a - \\sqrt{b}$ becomes $a + \\sqrt{b}$. Multiply by it to remove a surd from a denominator.',
    },
  },
  {
    id: 'indices-surds-025',
    subtopic: 'indices-surds',
    difficulty: 'foundation',
    stem: 'Which expression is equal to $(a^{m})^{n}$?',
    options: ['$a^{mn}$', '$a^{m + n}$', '$na^{m}$', '$a^{m^{n}}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What single power do you get when a power is raised to another power?',
      solution:
        'Try numbers first: $(a^2)^3$ means $a^2 \\times a^2 \\times a^2$, three lots of $a^2$.\n\n' +
        'Multiplying powers adds the indices: $2 + 2 + 2 = 6$, so we get $a^6$. That 6 is the same as $2 \\times 3$.\n\n' +
        'In general, $(a^m)^n$ is $n$ lots of $a^m$, which gives $n$ lots of $m$ in the index. So the index is $m \\times n$, written $mn$, and $(a^m)^n = a^{mn}$.',
      conclusion: 'A power of a power multiplies the indices, so the answer is $a^{mn}$.',
      whyWrong: [
        null,
        'Adding the indices is the rule for $a^{m} \\times a^{n}$. A power of a power multiplies them.',
        'This multiplies by $n$ instead of raising to the power $n$.',
        'This raises $m$ to the power $n$. The indices should be multiplied: for $(2^{3})^{2}$ the index is $3 \\times 2 = 6$, not $3^{2} = 9$.',
      ],
      keyIdea: 'Three index rules: multiply powers, add indices; divide powers, subtract indices; power of a power, multiply indices. If unsure, test with small numbers, such as $(2^3)^2 = 8^2 = 64 = 2^6$.',
    },
    check: {
      // each option evaluated at a = 2, m = 3, n = 2
      optionValues: [2 ** 6, 2 ** 5, 2 * 2 ** 3, 2 ** 9],
      compute: () => (2 ** 3) ** 2,
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
      asking: 'What number does 27 to the power $\\frac{2}{3}$ equal?',
      solution:
        'A fraction in the index has two jobs: the bottom number is a **root** and the top number is a **power**. So $27^{\\frac{2}{3}}$ means take the cube root of 27, then square it.\n\n' +
        'The **cube root** of 27 is the number that, multiplied by itself three times, gives 27. Since $3 \\times 3 \\times 3 = 27$, we have $\\sqrt[3]{27} = 3$.\n\n' +
        'Now apply the power 2: $3^2 = 9$.',
      conclusion: 'The root is 3 and squaring it gives 9, so the answer is $9$.',
      whyWrong: [
        'This multiplies 27 by $\\frac{2}{3}$. An index is not a multiplier: $27^{\\frac{2}{3}}$ means "cube root, then square".',
        null,
        'This flips the fraction in the index and works out $27^{\\frac{3}{2}} = \\left(\\sqrt{27}\\right)^{3} = 81\\sqrt{3}$. The denominator 3 is the root, the numerator 2 is the power.',
        'This takes a reciprocal as if the index were negative. Only a minus sign in the index means "one over"; here the index is positive.',
      ],
      keyIdea: 'For a fractional index $a^{\\frac{m}{n}}$, take the $n$th root first, because it makes the number smaller, then raise to the power $m$. Bottom is the root, top is the power.',
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
      asking: 'What is the value of this fraction once each part of the index is applied?',
      solution:
        'The index $-\\frac{3}{4}$ has three parts, and each does one job: the minus sign means flip the fraction, the 4 means fourth root, and the 3 means cube.\n\n' +
        'Deal with the minus sign first. Flip the fraction upside down and make the index positive: $\\left(\\frac{16}{81}\\right)^{-\\frac{3}{4}} = \\left(\\frac{81}{16}\\right)^{\\frac{3}{4}}$.\n\n' +
        'Take the fourth root of the top and of the bottom. A fourth root is the number that, multiplied by itself four times, gives the number. $3^4 = 81$, so the top is 3. $2^4 = 16$, so the bottom is 2. That gives $\\frac{3}{2}$.\n\n' +
        'Now cube it. Cube the top and the bottom: $\\left(\\frac{3}{2}\\right)^3 = \\frac{3^3}{2^3} = \\frac{27}{8}$.',
      conclusion: 'Flipping, taking the fourth root, then cubing leads to the answer, $\\frac{27}{8}$.',
      whyWrong: [
        'This ignores the minus sign in the index. A negative index means take the reciprocal, so the fraction must be flipped to $\\frac{81}{16}$ first.',
        'This flips the fraction correctly but also makes the answer negative. A negative index never makes the value negative; it only means "one over".',
        null,
        'This takes square roots ($\\sqrt{81} = 9$, $\\sqrt{16} = 4$) instead of fourth roots, then cubes $\\frac{9}{4}$. The 4 in the denominator of the index means the fourth root.',
      ],
      keyIdea: 'For a negative fractional index: flip the fraction to remove the minus, take the root from the bottom of the index, then apply the power from the top. Work on the top and bottom of the fraction separately.',
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
      asking: 'Write this as one number times one power of $x$.',
      solution:
        'Start with the bracket. The power 4 applies to everything inside, both the 2 and the $x^3$: $(2x^3)^4 = 2^4 \\times (x^3)^4$.\n\n' +
        'Work out the number: $2^4 = 2 \\times 2 \\times 2 \\times 2 = 16$.\n\n' +
        'A power of a power multiplies the indices: $(x^3)^4 = x^{3 \\times 4} = x^{12}$. So the top is $16x^{12}$.\n\n' +
        'Now we have $\\frac{16x^{12}}{4x^5}$. Deal with the numbers and the letters separately. Numbers: $16 \\div 4 = 4$.\n\n' +
        'Letters: dividing powers subtracts the indices, so $x^{12} \\div x^5 = x^{12 - 5} = x^7$. Together, these give $4x^7$.',
      conclusion: 'The numbers give 4 and the powers give $x^7$, so the answer is $4x^{7}$.',
      whyWrong: [
        null,
        'This works out $2^{4}$ as $2 \\times 4 = 8$, giving $\\frac{8x^{12}}{4x^{5}} = 2x^{7}$. But $2^{4} = 2 \\times 2 \\times 2 \\times 2 = 16$.',
        'This adds the indices in $(x^{3})^{4}$ to get $x^{7}$. A power of a power means multiply: $(x^{3})^{4} = x^{12}$.',
        'This forgets to raise the 2 to the power 4, using $2x^{12}$ on top. Everything inside the bracket gets the power.',
      ],
      keyIdea: 'With brackets and powers: apply the outside power to every factor inside, then divide numbers as numbers and powers by subtracting their indices.',
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
      asking: 'What single surd do you get when you add these two terms?',
      solution:
        'We can only add surds with the same number under the root, like counting apples with apples. So rewrite both terms using $\\sqrt{5}$.\n\n' +
        'First term: there is a root on the bottom. Multiply top and bottom by $\\sqrt{5}$, which does not change its value: $\\frac{10}{\\sqrt{5}} \\times \\frac{\\sqrt{5}}{\\sqrt{5}} = \\frac{10\\sqrt{5}}{5}$, since $\\sqrt{5} \\times \\sqrt{5} = 5$.\n\n' +
        'Divide: $10 \\div 5 = 2$, so the first term is $2\\sqrt{5}$.\n\n' +
        'Second term: $20 = 4 \\times 5$, and 4 is a square number. So $\\sqrt{20} = \\sqrt{4} \\times \\sqrt{5} = 2\\sqrt{5}$.\n\n' +
        'Add them as if $\\sqrt{5}$ were a letter: $2\\sqrt{5} + 2\\sqrt{5} = 4\\sqrt{5}$.',
      conclusion: 'Two lots of $\\sqrt{5}$ plus two more lots make four lots, so the answer is $4\\sqrt{5}$.',
      whyWrong: [
        'This writes $\\sqrt{20} = 4\\sqrt{5}$, forgetting to square-root the 4. $\\sqrt{20} = \\sqrt{4}\\sqrt{5} = 2\\sqrt{5}$.',
        'This gets $2\\sqrt{5} + 2\\sqrt{5}$ but then adds the numbers under the roots too. Like surds add like algebra: $2\\sqrt{5} + 2\\sqrt{5} = 4\\sqrt{5}$, the $\\sqrt{5}$ stays the same.',
        'This multiplies only the top by $\\sqrt{5}$, turning $\\frac{10}{\\sqrt{5}}$ into $10\\sqrt{5}$. You must multiply top **and** bottom, giving $\\frac{10\\sqrt{5}}{5} = 2\\sqrt{5}$.',
        null,
      ],
      keyIdea: 'To add surds, rewrite them with the same root. Clear any root on the bottom by multiplying top and bottom by it, and simplify any root by taking out a square factor. Then add the numbers in front.',
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
      asking: 'Rewrite this fraction so that there is no square root on the bottom.',
      solution:
        '**Rationalise the denominator** means remove the root from the bottom of the fraction. The trick is to multiply by the **conjugate**, which is the bottom with its middle sign changed: $3 + \\sqrt{5}$.\n\n' +
        'Multiply top and bottom by it. That equals multiplying by 1, so the value stays the same: $\\frac{4}{3 - \\sqrt{5}} \\times \\frac{3 + \\sqrt{5}}{3 + \\sqrt{5}}$.\n\n' +
        'The bottom: use $(a - b)(a + b) = a^2 - b^2$, where the middle terms cancel. $(3 - \\sqrt{5})(3 + \\sqrt{5}) = 3^2 - (\\sqrt{5})^2 = 9 - 5 = 4$. The root has gone.\n\n' +
        'The top stays as $4(3 + \\sqrt{5})$. So the fraction is $\\frac{4(3 + \\sqrt{5})}{4}$.\n\n' +
        'The 4 on top and the 4 on the bottom cancel, leaving $3 + \\sqrt{5}$.',
      conclusion: 'Multiplying by the conjugate makes the bottom 4, which cancels with the top, so the answer is $3 + \\sqrt{5}$.',
      whyWrong: [
        'This keeps the minus sign from the original denominator in the numerator. You multiply top and bottom by the conjugate $3 + \\sqrt{5}$, so the top becomes $4(3 + \\sqrt{5})$.',
        null,
        'This uses $9 + 5 = 14$ for the denominator. $(a - b)(a + b) = a^{2} - b^{2}$, so the denominator is $9 - 5 = 4$.',
        'This squares $\\sqrt{5}$ to get 25, giving the denominator $9 - 25 = -16$. But $(\\sqrt{5})^{2} = 5$.',
      ],
      keyIdea: 'If the bottom is $a \\pm \\sqrt{b}$, multiply top and bottom by the same thing with the opposite sign. The bottom becomes $a^2 - b$, a plain number. Then simplify.',
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
      asking: 'What is this product, written as a number from 1 to 10 times a power of 10?',
      solution:
        'Group the plain numbers and the powers of 10, because multiplying can be done in any order: $(6 \\times 4) \\times (10^5 \\times 10^{-8})$.\n\n' +
        'Multiply the plain numbers: $6 \\times 4 = 24$.\n\n' +
        'Multiply the powers of 10 by adding their indices: $10^5 \\times 10^{-8} = 10^{5 + (-8)} = 10^{-3}$. So the result so far is $24 \\times 10^{-3}$.\n\n' +
        'In standard form, the front number must be from 1 up to, but not including, 10. 24 is too big. Write it as 2.4 times 10, which adds 1 to the power of 10.\n\n' +
        'Add 1 to the index: $-3 + 1 = -2$. This gives $2.4 \\times 10^{-2}$.',
      conclusion: 'Making the front number 10 times smaller raises the power by one, so the answer is $2.4 \\times 10^{-2}$.',
      whyWrong: [
        'This changes 24 to 2.4 but forgets to adjust the power. Dividing the front number by 10 means the power of 10 must go **up** by 1, from $-3$ to $-2$.',
        'This subtracts the indices, $5 - (-8) = 13$, giving $24 \\times 10^{13} = 2.4 \\times 10^{14}$. Subtracting indices is for division; for multiplication you add them: $5 + (-8) = -3$.',
        null,
        'This adjusts the power in the wrong direction (from $-3$ down to $-4$). Making the front number smaller (24 to 2.4) must make the power bigger.',
      ],
      keyIdea: 'To multiply in standard form, multiply the front numbers and add the powers of 10. If the front number is 10 or more, divide it by 10 and add 1 to the power.',
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
      asking: 'What single surd do these three roots simplify to?',
      solution:
        'We can only add or subtract roots with the same number underneath. These look different, so simplify each one by taking out a square factor.\n\n' +
        'Each one is a square number times 2:\n\n| Root | Split | Simplified |\n|---|---|---|\n| $\\sqrt{50}$ | $\\sqrt{25} \\times \\sqrt{2}$ | $5\\sqrt{2}$ |\n| $\\sqrt{18}$ | $\\sqrt{9} \\times \\sqrt{2}$ | $3\\sqrt{2}$ |\n| $\\sqrt{8}$ | $\\sqrt{4} \\times \\sqrt{2}$ | $2\\sqrt{2}$ |\n\n' +
        'The expression is now $5\\sqrt{2} - 3\\sqrt{2} + 2\\sqrt{2}$. Treat $\\sqrt{2}$ like a letter and work with the numbers in front: $5 - 3 + 2 = 4$. That gives $4\\sqrt{2}$.',
      conclusion: 'All three share $\\sqrt{2}$, and the numbers in front combine to 4. So the answer is $4\\sqrt{2}$.',
      whyWrong: [
        null,
        'This combines the numbers under the roots: $50 - 18 + 8 = 40$ and $\\sqrt{40} = 2\\sqrt{10}$. You cannot add or subtract inside separate roots; simplify each one first.',
        'This adds all three terms ($5 + 3 + 2 = 10$), ignoring the minus sign in front of $\\sqrt{18}$.',
        'This writes $\\sqrt{8} = 4\\sqrt{2}$, forgetting to square-root the 4. $\\sqrt{8} = \\sqrt{4}\\sqrt{2} = 2\\sqrt{2}$.',
      ],
      keyIdea: 'To add or subtract surds, first simplify each root by taking out its largest square factor. Once they share the same root, combine the numbers in front. Never add the numbers under the roots.',
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
      asking: 'What do you get when you multiply $2\\sqrt{3} - 1$ by itself and tidy up?',
      solution:
        'Squaring means multiplying by itself, which also creates a middle term. Use $(a - b)^2 = a^2 - 2ab + b^2$, with $a = 2\\sqrt{3}$ and $b = 1$.\n\n' +
        'First term: $a^2 = (2\\sqrt{3})^2 = 2^2 \\times (\\sqrt{3})^2 = 4 \\times 3 = 12$.\n\n' +
        'Middle term: $2ab = 2 \\times 2\\sqrt{3} \\times 1 = 4\\sqrt{3}$, and it is subtracted.\n\n' +
        'Last term: $b^2 = 1 \\times 1 = 1$.\n\n' +
        'Put them together: $12 - 4\\sqrt{3} + 1$. Combine the plain numbers, $12 + 1 = 13$, to get $13 - 4\\sqrt{3}$.',
      conclusion: 'The plain numbers make 13 and the middle term stays as it is, so the answer is $13 - 4\\sqrt{3}$.',
      whyWrong: [
        'This squares each term separately and subtracts: $12 - 1 = 11$. But $(a - b)^{2} \\ne a^{2} - b^{2}$; there is a middle term $-2ab$ and the last term is $+1$.',
        'This works out $(2\\sqrt{3})^{2}$ as $2 \\times 3 = 6$, forgetting to square the 2. $(2\\sqrt{3})^{2} = 4 \\times 3 = 12$.',
        'This forgets to double the middle term. The cross terms are $-2\\sqrt{3}$ twice, giving $-4\\sqrt{3}$.',
        null,
      ],
      keyIdea: 'To square a bracket with a surd, use $(a - b)^2 = a^2 - 2ab + b^2$. Square both the number and the root in each term, and use $(\\sqrt{n})^2 = n$.',
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
    stem: 'Calculate $(1.5 \\times 10^{11}) \\div (3 \\times 10^{8})$, giving your answer in standard form.',
    options: ['$4.5 \\times 10^{19}$', '$5 \\times 10^{2}$', '$5 \\times 10^{3}$', '$2 \\times 10^{-3}$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What is this division, written as a number from 1 to 10 times a power of 10?',
      solution:
        'Split it into the plain numbers and the powers of 10: $\\frac{1.5}{3} \\times \\frac{10^{11}}{10^{8}}$.\n\n' +
        'Divide the plain numbers: $1.5 \\div 3 = 0.5$.\n\n' +
        'Divide the powers of 10 by subtracting their indices: $10^{11} \\div 10^{8} = 10^{11 - 8} = 10^{3}$. So far we have $0.5 \\times 10^{3}$.\n\n' +
        'In standard form, the front number must be from 1 up to, but not including, 10. 0.5 is too small. Multiply it by 10 to get 5, and take 1 off the power of 10 to keep the value the same.\n\n' +
        'Take 1 off the index: $3 - 1 = 2$. This gives $5 \\times 10^{2}$.',
      conclusion: 'Making the front number 10 times bigger lowers the power by one, so the answer is $5 \\times 10^{2}$.',
      whyWrong: [
        'This multiplies the two numbers instead of dividing them, adding the indices as well.',
        null,
        'This gets $0.5 \\times 10^{3}$ and then changes 0.5 into 5 without lowering the power. Multiplying the front number by 10 means the power must go down by 1.',
        'This divides the wrong way round, giving one over the correct answer.',
      ],
      keyIdea: 'To divide in standard form, divide the front numbers and subtract the powers of 10. If the front number is below 1, multiply it by 10 and take 1 off the power.',
    },
    check: {
      optionValues: [4.5e19, 5e2, 5e3, 2e-3],
      compute: () => 1.5e11 / 3e8,
    },
  },
];
