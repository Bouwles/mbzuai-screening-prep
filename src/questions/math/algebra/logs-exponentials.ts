import type { StaticQuestion } from '../../../types';

// ---- helpers used only by the answer checks (re-derive answers numerically) ----

/** Bisection: root of f in [lo, hi], assuming f(lo) and f(hi) have opposite signs. */
function bisect(f: (x: number) => number, lo: number, hi: number): number {
  let flo = f(lo);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (fm === 0) return mid;
    if (fm < 0 === flo < 0) {
      lo = mid;
      flo = fm;
    } else hi = mid;
  }
  return (lo + hi) / 2;
}

/** All roots of f on [lo, hi] found by scanning `steps` sub-intervals for sign changes, then bisecting. */
function scanRoots(f: (x: number) => number, lo: number, hi: number, steps: number): number[] {
  const out: number[] = [];
  const h = (hi - lo) / steps;
  for (let i = 0; i < steps; i++) {
    const a = lo + i * h;
    const b = a + h;
    if (f(a) === 0) out.push(a);
    else if (f(a) < 0 !== f(b) < 0) out.push(bisect(f, a, b));
  }
  // a root sitting exactly on a grid point can be found twice
  return out.filter((r, i) => i === 0 || Math.abs(r - out[i - 1]) > 1e-7);
}

const r6 = (x: number) => String(Math.round(x * 1e6) / 1e6);
const sf3 = (x: number) => Number(x.toPrecision(3));
const dp1 = (x: number) => Math.round(x * 10) / 10;

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'logs-exponentials-001',
    subtopic: 'logs-exponentials',
    difficulty: 'foundation',
    stem: 'What is the value of $\\log_2 32$?',
    options: ['$16$', '$4$', '$5$', '$64$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A logarithm answers the question "what power?". $\\log_2 32$ asks: **2 to what power gives 32?**\n\n' +
        'Keep multiplying by 2 and count the twos: $2 \\times 2 = 4$, then 8, then 16, then 32. That is five 2s multiplied together: $2 \\times 2 \\times 2 \\times 2 \\times 2 = 2^5$.\n\n' +
        'So $2^5 = 32$, which means $\\log_2 32 = 5$.',
      whyWrong: [
        'This divides 32 by 2. A logarithm is an exponent (a power), not a quotient.',
        'This stops one doubling too early: $2^4 = 16$, not 32.',
        null,
        'This multiplies 2 by 32. The question asks which power of 2 equals 32, not for a product.',
      ],
      keyIdea: '$\\log_b x = y$ means exactly the same as $b^y = x$: the log is the missing power.',
    },
    check: {
      optionValues: [16, 4, 5, 64],
      compute: () => {
        let n = 0;
        let v = 1;
        while (v < 32) {
          v *= 2;
          n++;
        }
        return n;
      },
    },
  },
  {
    id: 'logs-exponentials-002',
    subtopic: 'logs-exponentials',
    difficulty: 'foundation',
    stem: 'Which of the following is the exact solution of $5^x = 40$? (Here $\\log$ means $\\log_{10}$.)',
    options: ['$x = \\frac{40}{5}$', '$x = \\log_{40} 5$', '$x = \\log 40 - \\log 5$', '$x = \\log_5 40$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Rewrite the exponential statement as a logarithm using $b^y = x \\iff y = \\log_b x$.\n\n' +
        'Here the base is $b = 5$, the power is $y = x$ and the result is $40$, so $x = \\log_5 40$.\n\n' +
        'Check with a calculator: $\\log_5 40 = \\frac{\\log 40}{\\log 5} \\approx 2.29$ and $5^{2.29} \\approx 40$. Sensible, because $5^2 = 25$ and $5^3 = 125$, so $x$ must lie between 2 and 3.',
      whyWrong: [
        'This treats the power as a multiplier, solving $5x = 40$ instead of $5^x = 40$.',
        'This swaps the base and the number: $\\log_{40} 5$ solves $40^x = 5$.',
        'This equals $\\log 8$ (a difference of logs is the log of a quotient). The change-of-base rule gives a **quotient** of logs, $\\frac{\\log 40}{\\log 5}$, not a difference.',
        null,
      ],
      keyIdea: 'To free a variable from a power, convert $b^x = c$ into $x = \\log_b c$.',
    },
    check: {
      optionValues: [8, Math.log(5) / Math.log(40), Math.log10(40) - Math.log10(5), Math.log(40) / Math.log(5)],
      compute: () => bisect((x) => 5 ** x - 40, 0, 10),
    },
  },
  {
    id: 'logs-exponentials-003',
    subtopic: 'logs-exponentials',
    difficulty: 'foundation',
    stem: 'Here $\\log$ means $\\log_{10}$. What is $\\log 2 + \\log 5$ equal to?',
    options: ['$\\log 7$', '$1$', '$10$', '$(\\log 2)(\\log 5)$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Use the product law: $\\log a + \\log b = \\log(ab)$.\n\n' +
        '$\\log 2 + \\log 5 = \\log(2 \\times 5) = \\log 10$.\n\n' +
        'Since 10 to the power 1 is just 10, $\\log 10 = 1$.',
      whyWrong: [
        'This adds the numbers inside the logs. Adding logs means **multiplying** the numbers: $\\log 2 + \\log 5 = \\log 10$.',
        null,
        'This correctly multiplies to get 10 but forgets the log: $\\log 10 = 1$, not 10.',
        'This multiplies the two logs. The product law says a **sum** of logs is the log of a product, not a product of logs.',
      ],
      keyIdea: 'Adding logs (same base) multiplies the numbers inside: $\\log a + \\log b = \\log(ab)$.',
    },
    check: {
      optionValues: [Math.log10(7), 1, 10, Math.log10(2) * Math.log10(5)],
      compute: () => Math.log10(2) + Math.log10(5),
    },
  },
  {
    id: 'logs-exponentials-004',
    subtopic: 'logs-exponentials',
    difficulty: 'foundation',
    stem: 'Solve $e^x = 5$, giving your answer to 3 significant figures.',
    options: ['$1.61$', '$0.699$', '$148$', '$1.84$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The natural logarithm $\\ln$ is the inverse of $e^x$, so take $\\ln$ of both sides:\n\n' +
        '$\\ln(e^x) = \\ln 5$, so $x = \\ln 5$.\n\n' +
        'Calculator: $\\ln 5 = 1.6094\\ldots$, which is $1.61$ to 3 significant figures.\n\n' +
        'Sense check: $e \\approx 2.7$ and $e^2 \\approx 7.4$, and 5 lies between them, so $x$ must be between 1 and 2.',
      whyWrong: [
        null,
        'This uses the $\\log$ button ($\\log_{10} 5 = 0.699$). The inverse of $e^x$ is $\\ln$, the log to base $e$.',
        'This works out $e^5$ instead of undoing $e^x$.',
        'This divides 5 by $e$, treating $e^x$ as $e \\times x$.',
      ],
      keyIdea: '$\\ln$ undoes $e^x$: if $e^x = c$ then $x = \\ln c$.',
    },
    check: {
      optionValues: [1.61, 0.699, 148, 1.84],
      compute: () => sf3(bisect((x) => Math.exp(x) - 5, 0, 5)),
    },
  },
  {
    id: 'logs-exponentials-005',
    subtopic: 'logs-exponentials',
    difficulty: 'foundation',
    stem: 'What is the value of $\\log_9 3$?',
    options: ['$2$', '$\\frac{1}{2}$', '$3$', '$\\frac{1}{3}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '$\\log_9 3$ asks: **9 to what power gives 3?**\n\n' +
        'Since $3 = \\sqrt{9} = 9^{\\frac{1}{2}}$, the power is $\\frac{1}{2}$.\n\n' +
        'So $\\log_9 3 = \\frac{1}{2}$. (Check: $\\frac{\\ln 3}{\\ln 9} = 0.5$ on a calculator.)',
      whyWrong: [
        'This is $\\log_3 9$ (3 to what power gives 9). The base and the number have been swapped.',
        null,
        'This divides 9 by 3 instead of asking which power of 9 gives 3.',
        'This divides 3 by 9. The answer is a power: $9^{\\frac{1}{3}} \\approx 2.08$, not 3.',
      ],
      keyIdea: 'A square root is the power $\\frac{1}{2}$, so $\\log_{b^2} b = \\frac{1}{2}$.',
    },
    check: {
      optionValues: [2, 0.5, 3, 1 / 3],
      compute: () => Math.log(3) / Math.log(9),
    },
  },
  {
    id: 'logs-exponentials-021',
    subtopic: 'logs-exponentials',
    difficulty: 'foundation',
    stem: 'Which statement means the same as $\\log_b x = y$?',
    options: ['$b^{y} = x$', '$x^{y} = b$', '$y^{b} = x$', '$b^{x} = y$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A logarithm is a power: $\\log_b x$ is the power of $b$ that gives $x$.\n\n' +
        'So $\\log_b x = y$ means $b^{y} = x$. For example, $\\log_2 8 = 3$ means $2^{3} = 8$.',
      whyWrong: [
        null,
        'This uses $x$ as the base. The base of the logarithm is $b$, so the power must be on $b$.',
        'This uses $y$ as the base and $b$ as the power. $y$ is the power, and $b$ is the base.',
        'This swaps $x$ and $y$. The log $y$ is the power, and $x$ is the result.',
      ],
      keyIdea: '$\\log_b x = y$ means exactly the same as $b^{y} = x$.',
    },
  },
  {
    id: 'logs-exponentials-022',
    subtopic: 'logs-exponentials',
    difficulty: 'foundation',
    stem: 'For any valid base $b$, what is the value of $\\log_b 1$?',
    options: ['$0$', '$1$', '$b$', 'Undefined'],
    correctIndex: 0,
    markScheme: {
      solution:
        '$\\log_b 1$ asks: **$b$ to what power gives 1?** Any non-zero number to the power 0 is 1, so $\\log_b 1 = 0$.\n\n' +
        'A valid base is a positive number other than 1.',
      whyWrong: [
        null,
        '$1$ is the value of $\\log_b b$, the power that turns $b$ into itself.',
        'This takes the base as the answer. The log is the missing power, and $b^{b}$ is not 1.',
        'A logarithm does not exist for 0 or negative numbers, but 1 is positive.',
      ],
      keyIdea: '$\\log_b 1 = 0$, because $b^{0} = 1$.',
    },
    check: {
      // each option evaluated at b = 7
      optionValues: [0, 1, 7, null],
      compute: () => Math.log(1) / Math.log(7),
    },
  },
  {
    id: 'logs-exponentials-023',
    subtopic: 'logs-exponentials',
    difficulty: 'foundation',
    stem: 'What is the value of $\\ln e$?',
    options: ['$1$', '$0$', '$e$', '$\\frac{1}{e}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '$\\ln$ is the **natural logarithm**, the logarithm to base $e$, where $e \\approx 2.718$.\n\n' +
        '$\\ln e$ asks: **$e$ to what power gives $e$?** The power is 1.',
      whyWrong: [
        null,
        '$0$ is the value of $\\ln 1$, because $e^{0} = 1$.',
        'This treats $\\ln$ as if it did nothing. The log is the power, not the number you started with.',
        '$\\frac{1}{e}$ is $e^{-1}$, a power of $e$. The question asks for a logarithm.',
      ],
      keyIdea: '$\\ln$ means the logarithm to base $e$, so $\\ln e = 1$.',
    },
    check: {
      optionValues: [1, 0, Math.E, 1 / Math.E],
      compute: () => Math.log(Math.E),
    },
  },
  {
    id: 'logs-exponentials-024',
    subtopic: 'logs-exponentials',
    difficulty: 'foundation',
    stem: 'For positive $a$ and $b$, which expression is equal to $\\log(ab)$?',
    options: ['$\\log a + \\log b$', '$(\\log a)(\\log b)$', '$\\log a - \\log b$', '$a\\log b$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'This is the **product law**: the log of a product is the sum of the logs, $\\log(ab) = \\log a + \\log b$.\n\n' +
        'It works because multiplying powers of the same base adds the indices.',
      whyWrong: [
        null,
        'This multiplies the logs. A product inside the log becomes a **sum** of logs.',
        'A difference of logs is the log of a quotient: $\\log a - \\log b = \\log \\frac{a}{b}$.',
        'This confuses it with the power law, $\\log(b^{a}) = a\\log b$, which is for a power and not a product.',
      ],
      keyIdea: 'Product law: $\\log(ab) = \\log a + \\log b$.',
    },
    check: {
      // each option evaluated at a = 2, b = 5 with base 10
      optionValues: [
        Math.log10(2) + Math.log10(5),
        Math.log10(2) * Math.log10(5),
        Math.log10(2) - Math.log10(5),
        2 * Math.log10(5),
      ],
      compute: () => Math.log10(2 * 5),
    },
  },
  {
    id: 'logs-exponentials-025',
    subtopic: 'logs-exponentials',
    difficulty: 'foundation',
    stem: 'For $x > 0$, which expression is equal to $\\log(x^{n})$?',
    options: ['$n\\log x$', '$(\\log x)^{n}$', '$\\log x + n$', '$\\log(nx)$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'This is the **power law**: the index comes down in front as a multiplier, $\\log(x^{n}) = n\\log x$.\n\n' +
        'For example, with base 10, $\\log(100^{3}) = 3\\log 100 = 3 \\times 2 = 6$.',
      whyWrong: [
        null,
        'This raises the whole log to the power $n$. The index comes down as a multiplier instead.',
        'This adds the index. The power law multiplies by it.',
        'This moves the index down inside the log, which changes it to a multiplier of $x$. It has to come outside the log.',
      ],
      keyIdea: 'Power law: $\\log(x^{n}) = n\\log x$.',
    },
    check: {
      // each option evaluated at x = 100, n = 3 with base 10
      optionValues: [3 * 2, 2 ** 3, 2 + 3, Math.log10(300)],
      compute: () => Math.log10(100 ** 3),
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'logs-exponentials-006',
    subtopic: 'logs-exponentials',
    difficulty: 'exam',
    stem: 'Solve $3^{2x - 1} = 27^{x - 2}$.',
    options: ['$x = 1$', '$x = -1$', '$x = 5$', '$x = -5$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Write both sides as powers of the same base, 3.\n\n' +
        '$27 = 3^3$, so $27^{x-2} = (3^3)^{x-2} = 3^{3(x-2)} = 3^{3x - 6}$.\n\n' +
        'Now $3^{2x-1} = 3^{3x-6}$. Same base, so the powers are equal:\n\n' +
        '$2x - 1 = 3x - 6$\n\n' +
        '$-1 + 6 = 3x - 2x$\n\n' +
        '$x = 5$.\n\n' +
        'Check: left $3^{9}$, right $27^{3} = 3^{9}$. Equal.',
      whyWrong: [
        'This multiplies only the $x$ by 3, writing $27^{x-2} = 3^{3x-2}$. The whole power $x - 2$ must be multiplied by 3.',
        'This sets $2x - 1 = x - 2$, comparing powers before making the bases the same (the bases are 3 and 27).',
        null,
        'This sets up $2x - 1 = 3x - 6$ correctly but slips a sign when collecting terms, writing $-x = 5$ instead of $-x = -5$.',
      ],
      keyIdea: 'If both sides can be written with the same base, set the powers equal: $(a^m)^n = a^{mn}$.',
    },
    check: {
      optionValues: [1, -1, 5, -5],
      compute: () => {
        // f is linear in x, so its root is -f(0) / (f(1) - f(0))
        const f = (x: number) => (2 * x - 1) * Math.log(3) - (x - 2) * Math.log(27);
        return -f(0) / (f(1) - f(0));
      },
    },
  },
  {
    id: 'logs-exponentials-007',
    subtopic: 'logs-exponentials',
    difficulty: 'exam',
    stem: 'For $x > 0$, which expression is equal to $\\log_8 x$?',
    options: ['$\\frac{1}{3}\\log_2 x$', '$3\\log_2 x$', '$\\log_2 x - 3$', '$\\frac{\\log_2 x}{8}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Change of base: $\\log_a x = \\frac{\\log_b x}{\\log_b a}$. Use $b = 2$:\n\n' +
        '$\\log_8 x = \\frac{\\log_2 x}{\\log_2 8}$.\n\n' +
        'Since $2^3 = 8$, $\\log_2 8 = 3$, so $\\log_8 x = \\frac{\\log_2 x}{3} = \\frac{1}{3}\\log_2 x$.\n\n' +
        'Test with $x = 64$: $\\log_8 64 = 2$ (as $8^2 = 64$) and $\\frac{1}{3}\\log_2 64 = \\frac{6}{3} = 2$. They agree.',
      whyWrong: [
        null,
        'This multiplies by $\\log_2 8 = 3$ instead of dividing by it. A bigger base needs a smaller power, so $\\log_8 x$ is smaller than $\\log_2 x$.',
        'This is $\\log_2 \\frac{x}{8}$. Changing base divides by $\\log_2 8$; it does not subtract it.',
        'This divides by 8 instead of by $\\log_2 8 = 3$.',
      ],
      keyIdea: 'Change of base: $\\log_a x = \\frac{\\log_b x}{\\log_b a}$.',
    },
    check: {
      // evaluate every option at x = 64
      optionValues: [Math.log2(64) / 3, 3 * Math.log2(64), Math.log2(64) - 3, Math.log2(64) / 8],
      compute: () => Math.log(64) / Math.log(8),
    },
  },
  {
    id: 'logs-exponentials-008',
    subtopic: 'logs-exponentials',
    difficulty: 'exam',
    stem: 'Simplify $2\\log_3 6 - \\log_3 4$.',
    options: ['$1$', '$\\log_3 32$', '$\\log_3 8$', '$2$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Step 1 (power law, $k\\log a = \\log a^k$): $2\\log_3 6 = \\log_3 6^2 = \\log_3 36$.\n\n' +
        'Step 2 (quotient law, $\\log a - \\log b = \\log \\frac{a}{b}$): $\\log_3 36 - \\log_3 4 = \\log_3 \\frac{36}{4} = \\log_3 9$.\n\n' +
        'Step 3: $3^2 = 9$, so $\\log_3 9 = 2$.',
      whyWrong: [
        'This doubles inside the log ($2\\log_3 6 \\to \\log_3 12$) instead of squaring, then gets $\\log_3 \\frac{12}{4} = \\log_3 3 = 1$.',
        'This squares correctly to get 36 but then subtracts inside the log: $36 - 4 = 32$. Subtracting logs means **dividing** the numbers.',
        'This makes both mistakes: $2 \\times 6 = 12$ instead of $6^2$, then $12 - 4 = 8$ instead of dividing.',
        null,
      ],
      keyIdea: 'Use the power law first ($k\\log a = \\log a^k$), then combine with the product/quotient laws.',
    },
    check: {
      optionValues: [1, Math.log(32) / Math.log(3), Math.log(8) / Math.log(3), 2],
      compute: () => (2 * Math.log(6) - Math.log(4)) / Math.log(3),
    },
  },
  {
    id: 'logs-exponentials-009',
    subtopic: 'logs-exponentials',
    difficulty: 'exam',
    stem: 'Solve $\\log_2 x + \\log_2(x - 2) = 3$.',
    options: ['$x = 4$ or $x = -2$', '$x = 5$', '$x = 4$', '$x = -2$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Step 1 (product law): $\\log_2 x + \\log_2(x-2) = \\log_2\\big(x(x-2)\\big)$, so $\\log_2\\big(x(x-2)\\big) = 3$.\n\n' +
        'Step 2 (undo the log): $x(x - 2) = 2^3 = 8$.\n\n' +
        'Step 3: $x^2 - 2x - 8 = 0$, which factorises as $(x - 4)(x + 2) = 0$, so $x = 4$ or $x = -2$.\n\n' +
        'Step 4 (check the domain): you can only take the log of a positive number, so we need $x > 0$ and $x - 2 > 0$, i.e. $x > 2$. Reject $x = -2$.\n\n' +
        'Check $x = 4$: $\\log_2 4 + \\log_2 2 = 2 + 1 = 3$. Correct, so $x = 4$ only.',
      whyWrong: [
        'These are both roots of the quadratic, but $x = -2$ must be rejected: $\\log_2(-2)$ does not exist.',
        'This adds inside the log, $\\log_2(x + x - 2) = 3$, giving $2x - 2 = 8$. The product law needs $x(x-2)$.',
        null,
        'This keeps the invalid root and throws away the valid one. $\\log_2 x$ needs $x > 0$.',
      ],
      keyIdea: 'After solving a log equation, reject any root that makes the argument of a log zero or negative.',
    },
    check: {
      optionValues: ['4,-2', '5', '4', '-2'],
      compute: () => {
        // domain is x > 2; f is increasing there, so scan the domain for sign changes
        const f = (x: number) => Math.log2(x) + Math.log2(x - 2) - 3;
        return scanRoots(f, 2 + 1e-9, 100, 2000).map(r6).join(',');
      },
    },
  },
  {
    id: 'logs-exponentials-010',
    subtopic: 'logs-exponentials',
    difficulty: 'exam',
    stem: 'Given $C = 200e^{-0.25t}$, find $t$ when $C = 50$, to 1 decimal place.',
    options: ['$2.4$', '$5.5$', '$3.0$', '$0.3$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Set $C = 50$: $200e^{-0.25t} = 50$.\n\n' +
        'Divide by 200: $e^{-0.25t} = \\frac{50}{200} = 0.25$.\n\n' +
        'Take $\\ln$ of both sides: $-0.25t = \\ln 0.25 = -1.3863\\ldots$\n\n' +
        'Divide by $-0.25$: $t = \\frac{1.3863}{0.25} = 5.545\\ldots$\n\n' +
        'So $t = 5.5$ (1 d.p.).\n\n' +
        'Sense check: 50 is a quarter of 200, which is two half-lives. One half-life is $\\frac{\\ln 2}{0.25} \\approx 2.77$, and two of them make about 5.5.',
      whyWrong: [
        'This uses $\\log_{10}$ instead of $\\ln$: $\\frac{\\log 4}{0.25} = 2.4$. Only $\\ln$ undoes $e$.',
        null,
        'This treats the decay as linear, losing 25% of the original 200 (which is 50) for each unit of $t$: $200 - 50t = 50$ gives $t = 3$. An exponential model loses a proportion of what is **left**, not a fixed amount.',
        'This multiplies by 0.25 at the end instead of dividing: $1.386 \\times 0.25 = 0.3$.',
      ],
      keyIdea: 'Isolate the exponential first, then take $\\ln$ of both sides to bring the power down.',
    },
    check: {
      optionValues: [2.4, 5.5, 3.0, 0.3],
      compute: () => dp1(bisect((t) => 200 * Math.exp(-0.25 * t) - 50, 0, 100)),
    },
  },
  {
    id: 'logs-exponentials-011',
    subtopic: 'logs-exponentials',
    difficulty: 'exam',
    stem: 'Given $P = P_0e^{kt}$ with $P = 500$ at $t = 0$ and $P = 2000$ at $t = 6$, find $k$ to 3 significant figures.',
    options: ['$0.100$', '$1.39$', '$0.667$', '$0.231$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'At $t = 0$: $P_0e^{0} = P_0 = 500$.\n\n' +
        'At $t = 6$: $500e^{6k} = 2000$.\n\n' +
        'Divide by 500: $e^{6k} = 4$.\n\n' +
        'Take $\\ln$: $6k = \\ln 4 = 1.3863\\ldots$\n\n' +
        'Divide by 6: $k = 0.23105\\ldots = 0.231$ (3 s.f.).',
      whyWrong: [
        'This uses $\\log_{10}$: $\\frac{\\log 4}{6} = 0.100$. To undo $e$ you need $\\ln$.',
        'This is $\\ln 4$; it forgets to divide by $t = 6$.',
        'This skips the logarithm: $\\frac{4}{6} = 0.667$. The 6 is inside the power, so you must take $\\ln$ first.',
        null,
      ],
      keyIdea: 'Use $t = 0$ to find $P_0$, then divide and take $\\ln$ to find the rate constant $k$.',
    },
    check: {
      optionValues: [0.1, 1.39, 0.667, 0.231],
      compute: () => sf3(bisect((k) => 500 * Math.exp(6 * k) - 2000, 0, 5)),
    },
  },
  {
    id: 'logs-exponentials-012',
    subtopic: 'logs-exponentials',
    difficulty: 'exam',
    stem: 'Find the exact value of $e^{3\\ln 2} + \\ln\\left(e^{4}\\right)$.',
    options: ['$12$', '$10$', '$13$', '$9$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'First term: by the power law $3\\ln 2 = \\ln 2^3 = \\ln 8$, so $e^{3\\ln 2} = e^{\\ln 8} = 8$ (because $e^x$ and $\\ln x$ undo each other).\n\n' +
        'Second term: $\\ln\\left(e^{4}\\right) = 4$ (again they undo each other).\n\n' +
        'Total: $8 + 4 = 12$.',
      whyWrong: [
        null,
        'This turns $e^{3\\ln 2}$ into $3 \\times 2 = 6$, multiplying instead of using the power law ($2^3 = 8$).',
        'This computes $3^2 = 9$ instead of $2^3 = 8$: $3\\ln 2 = \\ln\\left(2^3\\right)$, so 2 is the base and 3 is the power.',
        'This gets 8 for the first term but uses $\\ln\\left(e^{4}\\right) = 1$, forgetting that the power 4 comes down: $\\ln\\left(e^{4}\\right) = 4\\ln e = 4$.',
      ],
      keyIdea: '$e^{\\ln a} = a$ and $\\ln(e^a) = a$: the exponential and the natural log cancel each other.',
    },
    check: {
      optionValues: [12, 10, 13, 9],
      compute: () => Math.exp(3 * Math.log(2)) + Math.log(Math.exp(4)),
    },
  },
  {
    id: 'logs-exponentials-013',
    subtopic: 'logs-exponentials',
    difficulty: 'exam',
    stem: 'Solve $5^x = 3^{x + 1}$, giving $x$ to 3 significant figures.',
    options: ['$2.15$', '$1.96$', '$1.50$', '$0.406$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The bases are different and cannot be matched, so take $\\ln$ of both sides:\n\n' +
        '$x\\ln 5 = (x + 1)\\ln 3$\n\n' +
        'Expand: $x\\ln 5 = x\\ln 3 + \\ln 3$\n\n' +
        'Collect the $x$ terms: $x\\ln 5 - x\\ln 3 = \\ln 3$, so $x(\\ln 5 - \\ln 3) = \\ln 3$.\n\n' +
        'Divide: $x = \\frac{\\ln 3}{\\ln 5 - \\ln 3} = \\frac{1.0986}{0.5108} = 2.1506\\ldots$\n\n' +
        'So $x = 2.15$ (3 s.f.). Check: $5^{2.1507} \\approx 31.86$ and $3^{3.1507} \\approx 31.86$.',
      whyWrong: [
        null,
        'This expands $(x + 1)\\ln 3$ as $x\\ln 3 + 1$, forgetting to multiply the 1 by $\\ln 3$; that gives $x = \\frac{1}{\\ln 5 - \\ln 3} = 1.96$.',
        'This drops the powers and compares the bases as if they were multipliers, $5x = 3(x + 1)$. Different bases need logs.',
        'This moves $x\\ln 3$ to the left without changing its sign, getting $x(\\ln 5 + \\ln 3) = \\ln 3$, so $x = \\frac{1.0986}{2.7081} = 0.406$.',
      ],
      keyIdea: 'When the bases cannot be matched, take logs of both sides, expand, and collect the $x$ terms.',
    },
    check: {
      optionValues: [2.15, 1.96, 1.5, 0.406],
      compute: () => sf3(bisect((x) => x * Math.log(5) - (x + 1) * Math.log(3), 0, 10)),
    },
  },
  {
    id: 'logs-exponentials-014',
    subtopic: 'logs-exponentials',
    difficulty: 'exam',
    stem: 'Solve $\\log_3(x + 5) - \\log_3(x - 1) = 1$.',
    options: ['$x = 3$', '$x = \\frac{5}{3}$', '$x = -8$', '$x = 4$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Step 1 (quotient law): $\\log_3 \\frac{x + 5}{x - 1} = 1$.\n\n' +
        'Step 2 (undo the log): $\\log_3 A = 1$ means $A$ is 3 to the power 1, so $\\frac{x + 5}{x - 1} = 3$.\n\n' +
        'Step 3: multiply by $(x - 1)$: $x + 5 = 3(x - 1) = 3x - 3$.\n\n' +
        'Step 4: $5 + 3 = 3x - x$, so $2x = 8$ and $x = 4$.\n\n' +
        'Domain check: $x + 5 = 9 > 0$ and $x - 1 = 3 > 0$. Valid. Check: $\\log_3 9 - \\log_3 3 = 2 - 1 = 1$.',
      whyWrong: [
        'This does not expand the bracket properly: $x + 5 = 3x - 1$ instead of $3(x - 1) = 3x - 3$.',
        'This undoes the log with base 10: $\\frac{x + 5}{x - 1} = 10$. The base here is 3, so the right-hand side is 3 (3 to the power 1).',
        'This flips the fraction, $\\frac{x - 1}{x + 5} = 3$. It is also invalid: $x - 1 = -9$ is negative, so $\\log_3(x - 1)$ does not exist.',
        null,
      ],
      keyIdea: 'Combine into a single log, convert $\\log_b A = c$ into $A = b^c$, solve, then check the domain.',
    },
    check: {
      optionValues: [3, 5 / 3, -8, 4],
      compute: () => bisect((x) => Math.log((x + 5) / (x - 1)) / Math.log(3) - 1, 1 + 1e-9, 1000),
    },
  },
  {
    id: 'logs-exponentials-015',
    subtopic: 'logs-exponentials',
    difficulty: 'exam',
    stem: 'Given that $\\log_a 2 = p$ and $\\log_a 3 = q$, which expression is equal to $\\log_a 18$?',
    options: ['$2p + q$', '$p + 2q$', '$pq^2$', '$p + q^2$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Write 18 using only 2s and 3s: $18 = 2 \\times 9 = 2 \\times 3^2$.\n\n' +
        'Product law: $\\log_a 18 = \\log_a 2 + \\log_a 3^2$.\n\n' +
        'Power law: $\\log_a 3^2 = 2\\log_a 3$.\n\n' +
        'So $\\log_a 18 = p + 2q$.',
      whyWrong: [
        'This uses $18 = 2^2 \\times 3$, but $2^2 \\times 3 = 12$. The squared factor is 3, not 2.',
        null,
        'This multiplies the logs. The log of a product is the **sum** of the logs.',
        'This writes $\\log_a 3^2 = (\\log_a 3)^2$. The power law brings the 2 to the front as a multiplier: $2\\log_a 3$.',
      ],
      keyIdea: 'Split the number into prime factors, then use the product law and the power law.',
    },
    check: {
      // test with base a = 5
      optionValues: (() => {
        const p = Math.log(2) / Math.log(5);
        const q = Math.log(3) / Math.log(5);
        return [2 * p + q, p + 2 * q, p * q * q, p + q * q];
      })(),
      compute: () => Math.log(18) / Math.log(5),
    },
  },
];
