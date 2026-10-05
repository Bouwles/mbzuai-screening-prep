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
    stem: 'The amount of a drug in a patient\'s blood is modelled by $C = 200e^{-0.25t}$ mg, where $t$ is the time in hours after the dose. How long does it take for the amount to fall to 50 mg? Give your answer in hours to 1 decimal place.',
    options: ['$2.4$', '$5.5$', '$3.0$', '$0.3$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Set $C = 50$: $200e^{-0.25t} = 50$.\n\n' +
        'Divide by 200: $e^{-0.25t} = \\frac{50}{200} = 0.25$.\n\n' +
        'Take $\\ln$ of both sides: $-0.25t = \\ln 0.25 = -1.3863\\ldots$\n\n' +
        'Divide by $-0.25$: $t = \\frac{1.3863}{0.25} = 5.545\\ldots$\n\n' +
        'So $t = 5.5$ hours (1 d.p.).\n\n' +
        'Sense check: 50 mg is a quarter of 200 mg, which is two half-lives. One half-life is $\\frac{\\ln 2}{0.25} \\approx 2.77$ h, and two of them make about 5.5 h.',
      whyWrong: [
        'This uses $\\log_{10}$ instead of $\\ln$: $\\frac{\\log 4}{0.25} = 2.4$. Only $\\ln$ undoes $e$.',
        null,
        'This treats the decay as linear, losing 25% of the original 200 mg (50 mg) every hour: $200 - 50t = 50$ gives $t = 3$. An exponential model loses a proportion of what is **left**, not a fixed amount.',
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
    stem: 'A colony of bacteria is modelled by $P = P_0e^{kt}$, where $t$ is in hours. At $t = 0$ there are 500 bacteria and at $t = 6$ there are 2000. Find $k$, correct to 3 significant figures.',
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
  // ------------------------------------------------------------------ challenge
  {
    id: 'logs-exponentials-016',
    subtopic: 'logs-exponentials',
    difficulty: 'challenge',
    stem: 'Solve $e^{2x} - 5e^{x} + 6 = 0$.',
    options: ['$x = 2$ or $x = 3$', 'There are no real solutions', '$x = \\ln 2$ or $x = \\ln 3$', '$x = \\log_{10} 2$ or $x = \\log_{10} 3$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Notice that $e^{2x} = (e^x)^2$. Substitute $u = e^x$:\n\n' +
        '$u^2 - 5u + 6 = 0$\n\n' +
        'Factorise: $(u - 2)(u - 3) = 0$, so $u = 2$ or $u = 3$.\n\n' +
        'Go back to $x$: $e^x = 2$ gives $x = \\ln 2$; $e^x = 3$ gives $x = \\ln 3$.\n\n' +
        'Both are valid because 2 and 3 are positive ($e^x$ is always positive). So $x = \\ln 2$ or $x = \\ln 3$ (about 0.693 and 1.10).',
      whyWrong: [
        'This finds $u = 2$ or $u = 3$ but forgets that $u = e^x$, not $x$. You still need to take $\\ln$.',
        'This factorises as $(u + 2)(u + 3)$, giving $e^x = -2$ or $-3$, which are impossible. The correct factors are $(u - 2)(u - 3)$ because the middle term is $-5u$.',
        null,
        'This undoes $e^x$ with base-10 logs. The inverse of $e^x$ is $\\ln x$.',
      ],
      keyIdea: 'An equation in $e^{2x}$ and $e^x$ is a hidden quadratic: substitute $u = e^x$, solve, then take $\\ln$.',
    },
    check: {
      optionValues: ['2.0000,3.0000', 'none', '0.6931,1.0986', '0.3010,0.4771'],
      compute: () => {
        const rs = scanRoots((x) => Math.exp(2 * x) - 5 * Math.exp(x) + 6, -5, 5, 1000);
        return rs.length ? rs.map((r) => r.toFixed(4)).join(',') : 'none';
      },
    },
  },
  {
    id: 'logs-exponentials-017',
    subtopic: 'logs-exponentials',
    difficulty: 'challenge',
    stem: 'Find $x$ and $y$ such that\n\n$$\\log_2 x + \\log_3 y = 5$$\n\n$$2\\log_2 x - \\log_3 y = 4$$',
    options: ['$x = 3,\\ y = 2$', '$x = 9,\\ y = 8$', '$x = 8,\\ y = 9$', '$x = 6,\\ y = 6$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Treat the logs as the unknowns. Let $a = \\log_2 x$ and $b = \\log_3 y$:\n\n' +
        '$a + b = 5$ and $2a - b = 4$.\n\n' +
        'Add the two equations: $3a = 9$, so $a = 3$. Then $b = 5 - 3 = 2$.\n\n' +
        'Undo the logs: $\\log_2 x = 3$ gives $x = 2^3 = 8$; $\\log_3 y = 2$ gives $y = 3^2 = 9$.\n\n' +
        'Check: $\\log_2 8 + \\log_3 9 = 3 + 2 = 5$ and $2(3) - 2 = 4$. Correct.',
      whyWrong: [
        'These are the values of $\\log_2 x$ and $\\log_3 y$. You still have to undo the logs: $x = 2^3$, $y = 3^2$.',
        'This raises the log value to the base instead of the base to the log value: $x = 3^2$ and $y = 2^3$. From $\\log_2 x = 3$, $x = 2^3$.',
        null,
        'This multiplies the base by the log value ($2 \\times 3$ and $3 \\times 2$). Undoing a log means raising the base to a power.',
      ],
      keyIdea: 'Substitute $a = \\log_2 x$, $b = \\log_3 y$ to get a linear system, solve it, then undo each log.',
    },
    check: {
      optionValues: ['3,2', '9,8', '8,9', '6,6'],
      compute: () => {
        // Cramer's rule for a + b = 5, 2a - b = 4
        const [a1, b1, c1, a2, b2, c2] = [1, 1, 5, 2, -1, 4];
        const d = a1 * b2 - b1 * a2;
        const a = (c1 * b2 - b1 * c2) / d;
        const b = (a1 * c2 - c1 * a2) / d;
        return `${Math.round(2 ** a)},${Math.round(3 ** b)}`;
      },
    },
  },
  {
    id: 'logs-exponentials-018',
    subtopic: 'logs-exponentials',
    difficulty: 'challenge',
    stem: 'Solve $(\\log_2 x)^2 - 3\\log_2 x + 2 = 0$.',
    options: ['$x = 4$ only', '$x = 1$ or $x = 2$', '$x = \\frac{1}{4}$ or $x = \\frac{1}{2}$', '$x = 2$ or $x = 4$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Let $u = \\log_2 x$. The equation becomes $u^2 - 3u + 2 = 0$.\n\n' +
        'Factorise: $(u - 1)(u - 2) = 0$, so $u = 1$ or $u = 2$.\n\n' +
        'Undo the log: $\\log_2 x = 1$ gives $x = 2$; $\\log_2 x = 2$ gives $x = 2^2 = 4$.\n\n' +
        'Both are positive, so both are valid. Check $x = 2$: $1 - 3 + 2 = 0$. Check $x = 4$: $4 - 6 + 2 = 0$.',
      whyWrong: [
        'This treats $(\\log_2 x)^2$ as $\\log_2(x^2) = 2\\log_2 x$, which turns the equation into $-\\log_2 x + 2 = 0$. Squaring the log is not the same as squaring $x$.',
        'These are the values of $u = \\log_2 x$. You still have to undo the log: $x = 2^u$.',
        'This factorises as $(u + 1)(u + 2)$, getting $u = -1$ or $-2$. With a middle term of $-3u$ the factors are $(u - 1)(u - 2)$.',
        null,
      ],
      keyIdea: 'A quadratic in $\\log_2 x$: substitute $u = \\log_2 x$, solve for $u$, then use $x = 2^u$.',
    },
    check: {
      optionValues: ['4', '1,2', '0.25,0.5', '2,4'],
      compute: () => {
        const f = (x: number) => Math.log2(x) ** 2 - 3 * Math.log2(x) + 2;
        return scanRoots(f, 0.01, 100, 9999).map(r6).join(',');
      },
    },
  },
  {
    id: 'logs-exponentials-019',
    subtopic: 'logs-exponentials',
    difficulty: 'challenge',
    stem: 'Investment A is worth $A = 1000e^{0.05t}$ dirhams and investment B is worth $B = 1500e^{0.02t}$ dirhams, where $t$ is the time in years. After how many years are the two investments worth the same? Give your answer to 1 decimal place.',
    options: ['$5.8$', '$8.1$', '$13.5$', '$207.2$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Set them equal: $1000e^{0.05t} = 1500e^{0.02t}$.\n\n' +
        'Divide both sides by $1000e^{0.02t}$: $\\frac{e^{0.05t}}{e^{0.02t}} = 1.5$, and $\\frac{e^{0.05t}}{e^{0.02t}} = e^{0.05t - 0.02t} = e^{0.03t}$.\n\n' +
        'So $e^{0.03t} = 1.5$.\n\n' +
        'Take $\\ln$: $0.03t = \\ln 1.5 = 0.405465\\ldots$\n\n' +
        'Divide: $t = \\frac{0.405465}{0.03} = 13.515\\ldots$, so $t = 13.5$ years (1 d.p.).',
      whyWrong: [
        'This adds the rates instead of subtracting: $e^{0.07t} = 1.5$. Dividing powers of $e$ subtracts the exponents.',
        'This ignores the growth of B, solving $1000e^{0.05t} = 1500$.',
        null,
        'This subtracts the starting values ($1500 - 1000 = 500$) instead of dividing them, solving $e^{0.03t} = 500$.',
      ],
      keyIdea: 'Collect the exponentials on one side using $\\frac{e^a}{e^b} = e^{a - b}$, then take $\\ln$.',
    },
    check: {
      optionValues: [5.8, 8.1, 13.5, 207.2],
      compute: () => dp1(bisect((t) => 1000 * Math.exp(0.05 * t) - 1500 * Math.exp(0.02 * t), 0, 100)),
    },
  },
  {
    id: 'logs-exponentials-020',
    subtopic: 'logs-exponentials',
    difficulty: 'challenge',
    stem: 'Find the exact value of the product\n\n$$\\log_2 3 \\times \\log_3 4 \\times \\log_4 5 \\times \\cdots \\times \\log_{31} 32$$',
    options: ['$5$', '$1$', '$16$', '$30$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Change every log to natural logs using $\\log_a b = \\frac{\\ln b}{\\ln a}$:\n\n' +
        '$$\\frac{\\ln 3}{\\ln 2} \\times \\frac{\\ln 4}{\\ln 3} \\times \\frac{\\ln 5}{\\ln 4} \\times \\cdots \\times \\frac{\\ln 32}{\\ln 31}$$\n\n' +
        'Each numerator cancels with the next denominator (the product "telescopes"). Only the first denominator and the last numerator survive:\n\n' +
        '$$\\frac{\\ln 32}{\\ln 2} = \\log_2 32$$\n\n' +
        'Since $2^5 = 32$, the product equals 5.',
      whyWrong: [
        null,
        'This assumes everything cancels. The first denominator $\\ln 2$ and the last numerator $\\ln 32$ are left over.',
        'This divides the last number by the first ($\\frac{32}{2}$) instead of taking $\\log_2 32$.',
        'This counts the factors (there are 30 of them) as if each one equalled 1 and they were added. The factors are multiplied, and they are not equal to 1.',
      ],
      keyIdea: 'Converting to a common base turns a chain of logs into a telescoping product: $\\log_a b \\times \\log_b c = \\log_a c$.',
    },
    check: {
      optionValues: [5, 1, 16, 30],
      compute: () => {
        let p = 1;
        for (let k = 2; k <= 31; k++) p *= Math.log(k + 1) / Math.log(k);
        return p;
      },
    },
  },
];
