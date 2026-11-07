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
      asking: 'What power of 2 gives 32?',
      solution:
        'A **logarithm** answers one question: what power do I raise the base to, to get this number? So $\\log_2 32$ means: 2 to what power gives 32? The small 2 is called the **base**.\n\n' +
        'Keep multiplying by 2 and count the 2s:\n\n| How many 2s | Working | Value |\n|---|---|---|\n| 1 | $2$ | 2 |\n| 2 | $2 \\times 2$ | 4 |\n| 3 | $2 \\times 2 \\times 2$ | 8 |\n| 4 | $2 \\times 2 \\times 2 \\times 2$ | 16 |\n| 5 | $2 \\times 2 \\times 2 \\times 2 \\times 2$ | 32 |\n\n' +
        'We reach 32 with five 2s, so the power is 5.',
      conclusion: 'Since $2^5 = 32$, the answer is $5$.',
      whyWrong: [
        'This divides 32 by 2. A logarithm is an exponent (a power), not a quotient.',
        'This stops one doubling too early: $2^4 = 16$, not 32.',
        null,
        'This multiplies 2 by 32. The question asks which power of 2 equals 32, not for a product.',
      ],
      keyIdea: 'Read $\\log_b x$ as: "$b$ to what power gives $x$?" Then multiply $b$ by itself, counting, until you reach $x$. The count is the answer.',
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
      asking: 'How do you write the exact value of $x$ using a logarithm?',
      solution:
        'We need the power that turns 5 into 40. Since $5^2 = 25$ and $5^3 = 125$, it lies between 2 and 3. No whole number works, so we need a logarithm to write it exactly.\n\n' +
        'A **logarithm** is a way of writing a missing power. The rule is that $b^x = y$ means the same thing as $x = \\log_b y$. The base $b$ stays the base.\n\n' +
        'Here the base is $b = 5$ and the result is $y = 40$. So $5^x = 40$ becomes $x = \\log_5 40$.',
      conclusion: 'A log is the power itself, so the power that turns 5 into 40 is the answer, $x = \\log_5 40$.',
      whyWrong: [
        'This treats the power as a multiplier, solving $5x = 40$ instead of $5^x = 40$.',
        'This swaps the base and the number: $\\log_{40} 5$ solves $40^x = 5$.',
        'This equals $\\log 8$ (a difference of logs is the log of a quotient). The change-of-base rule gives a **quotient** of logs, $\\frac{\\log 40}{\\log 5}$, not a difference.',
        null,
      ],
      keyIdea: 'To solve $b^x = y$ exactly, swap to log form: $x = \\log_b y$. The base of the power is the base of the log. On a calculator, work it out as $\\frac{\\log y}{\\log b}$.',
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
      asking: 'What single number do these two logs add up to?',
      solution:
        'Here $\\log$ with no small number means base 10, so $\\log y$ asks: 10 to what power gives $y$?\n\n' +
        'Adding logs corresponds to multiplying the numbers inside. This is the **product law**: $\\log a + \\log b = \\log(ab)$. It works because logs are powers, and multiplying numbers adds their powers.\n\n' +
        'Use it: $\\log 2 + \\log 5 = \\log(2 \\times 5) = \\log 10$.\n\n' +
        '$\\log 10$ asks: 10 to what power gives 10? Any number to the power 1 is itself, so the value is 1.',
      conclusion: 'The product of 2 and 5 is 10, and the log of 10 in base 10 is 1. So the answer is $1$.',
      whyWrong: [
        'This adds the numbers inside the logs. Adding logs means **multiplying** the numbers: $\\log 2 + \\log 5 = \\log 10$.',
        null,
        'This correctly multiplies to get 10 but forgets the log: $\\log 10 = 1$, not 10.',
        'This multiplies the two logs. The product law says a **sum** of logs is the log of a product, not a product of logs.',
      ],
      keyIdea: 'When logs are added, multiply the numbers inside. When they are subtracted, divide them. Then ask what power of the base gives the result.',
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
      asking: 'What power of $e$ gives 5?',
      solution:
        '$e$ is a fixed number, about 2.718, often used as a base. We need the power that turns $e$ into 5.\n\n' +
        'The **natural logarithm**, written $\\ln$, is the log with base $e$. It undoes $e$ to a power: $\\ln(e^x) = x$.\n\n' +
        'Take $\\ln$ of both sides to bring $x$ out: $\\ln(e^x) = \\ln 5$, so $x = \\ln 5$.\n\n' +
        'Use a calculator: $\\ln 5 \\approx 1.6094$. For 3 significant figures, keep the first three digits, 1.60. The next digit is 9, so round up to 1.61.',
      conclusion: 'The power that turns $e$ into 5 is $\\ln 5$, so the answer is $1.61$.',
      whyWrong: [
        null,
        'This uses the $\\log$ button ($\\log_{10} 5 = 0.699$). The inverse of $e^x$ is $\\ln$, the log to base $e$.',
        'This works out $e^5$ instead of undoing $e^x$.',
        'This divides 5 by $e$, treating $e^x$ as $e \\times x$.',
      ],
      keyIdea: 'To solve $e^x = k$, use $x = \\ln k$, with the $\\ln$ button and not the $\\log$ button. If a number multiplies $e^x$, divide by it first.',
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
      asking: 'What power of 9 gives 3?',
      solution:
        '$\\log_9 3$ asks: 9 to what power gives 3? Since 3 lies between $9^0 = 1$ and 9 itself, the power lies between 0 and 1, so it is not a whole number.\n\n' +
        'Notice that 3 is the square root of 9, since $3 \\times 3 = 9$. So $\\sqrt{9} = 3$.\n\n' +
        'A square root is the same as a power of one half: $\\sqrt{9} = 9^{\\frac{1}{2}}$. So the power we want is $\\frac{1}{2}$.',
      conclusion: 'Since $9^{\\frac{1}{2}} = 3$, the answer is $\\frac{1}{2}$.',
      whyWrong: [
        'This is $\\log_3 9$ (3 to what power gives 9). The base and the number have been swapped.',
        null,
        'This divides 9 by 3 instead of asking which power of 9 gives 3.',
        'This divides 3 by 9. The answer is a power: $9^{\\frac{1}{3}} \\approx 2.08$, not 3.',
      ],
      keyIdea: 'If the number inside a log is a root of the base, the answer is a fraction. Write the number as a power of the base, such as $3 = 9^{\\frac{1}{2}}$, then read off the power.',
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
      asking: 'How do you write this log statement as a power statement?',
      solution:
        'A log is a power. $\\log_b x = y$ says: the power you raise $b$ to, to get $x$, is $y$.\n\n' +
        'In that sentence, $b$ is the base (the number being raised), $y$ is the power, and $x$ is the result. Written as a power, that is $b^y = x$.',
      conclusion: 'Base $b$, power $y$ and result $x$ give the answer, $b^{y} = x$.',
      whyWrong: [
        null,
        'This uses $x$ as the base. The base of the logarithm is $b$, so the power must be on $b$.',
        'This uses $y$ as the base and $b$ as the power. $y$ is the power, and $b$ is the base.',
        'This swaps $x$ and $y$. The log $y$ is the power, and $x$ is the result.',
      ],
      keyIdea: 'To switch between forms, the base stays the base: $\\log_b x = y$ becomes $b^y = x$. Test with real numbers: $\\log_2 8 = 3$ becomes $2^3 = 8$.',
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
      asking: 'What power of any base gives 1?',
      solution:
        '$\\log_b 1$ asks: $b$ to what power gives 1?\n\n' +
        'Any non-zero number to the power 0 equals 1. For example, $2^0 = 1$ and $10^0 = 1$. So the power is 0.',
      conclusion: 'Because $b^0 = 1$ for every valid base, the answer is $0$.',
      whyWrong: [
        null,
        '$1$ is the value of $\\log_b b$, the power that turns $b$ into itself.',
        'This takes the base as the answer. The log is the missing power, and $b^{b}$ is not 1.',
        'A logarithm does not exist for 0 or negative numbers, but 1 is positive.',
      ],
      keyIdea: 'Two logs to know: $\\log_b 1 = 0$ because $b^0 = 1$, and $\\log_b b = 1$ because $b$ to the power 1 is $b$. Turn any log into the question "what power?" to rebuild these.',
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
      asking: 'What power of $e$ gives $e$?',
      solution:
        '$\\ln$ is the **natural logarithm**, the log with base $e$, a fixed number of about 2.718. So $\\ln e$ asks: $e$ to what power gives $e$?\n\n' +
        'Any number to the power 1 is itself. So $e$ to the power 1 is $e$, and the power is 1.',
      conclusion: 'Raising $e$ to the power 1 leaves $e$, so the answer is $1$.',
      whyWrong: [
        null,
        '$0$ is the value of $\\ln 1$, because $e^{0} = 1$.',
        'This treats $\\ln$ as if it did nothing. The log is the power, not the number you started with.',
        '$\\frac{1}{e}$ is $e^{-1}$, a power of $e$. The question asks for a logarithm.',
      ],
      keyIdea: '$\\ln y$ means the power of $e$ that gives $y$. So $\\ln e = 1$, $\\ln 1 = 0$ and $\\ln(e^k) = k$.',
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
      asking: 'How can the log of a product be split into simpler logs?',
      solution:
        'Logs are powers, so log rules come from power rules. Take base 10, which is what $\\log$ with no small number means (other bases work the same way). Write $a = 10^p$ and $b = 10^q$, so that $\\log a = p$ and $\\log b = q$.\n\n' +
        'Multiply: $ab = 10^p \\times 10^q = 10^{p + q}$, because multiplying powers adds the indices. So $\\log(ab) = p + q$, which is $\\log a + \\log b$.',
      conclusion: 'Multiplying inside the log becomes adding outside, so the answer is $\\log a + \\log b$.',
      whyWrong: [
        null,
        'This multiplies the logs. A product inside the log becomes a **sum** of logs.',
        'A difference of logs is the log of a quotient: $\\log a - \\log b = \\log \\frac{a}{b}$.',
        'This confuses it with the power law, $\\log(b^{a}) = a\\log b$, which is for a power and not a product.',
      ],
      keyIdea: 'The log laws: product, $\\log(ab) = \\log a + \\log b$. Quotient, $\\log\\frac{a}{b} = \\log a - \\log b$. Power, $\\log(x^n) = n\\log x$. Test a doubtful rule with numbers, such as $\\log 100 = \\log 10 + \\log 10$.',
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
      asking: 'How can the log of a power be written without the power?',
      solution:
        'A power is repeated multiplication. For example, $x^3 = x \\times x \\times x$.\n\n' +
        'Multiplying inside a log becomes adding outside: $\\log(x \\times x \\times x) = \\log x + \\log x + \\log x = 3\\log x$.\n\n' +
        'The same works for any power $n$: you get $n$ lots of $\\log x$, so $\\log(x^n) = n\\log x$.',
      conclusion: 'The index comes down to the front as a multiplier, so the answer is $n\\log x$.',
      whyWrong: [
        null,
        'This raises the whole log to the power $n$. The index comes down as a multiplier instead.',
        'This adds the index. The power law multiplies by it.',
        'This moves the index down inside the log, which changes it to a multiplier of $x$. It has to come outside the log.',
      ],
      keyIdea: 'Power law: bring the index to the front, so $\\log(x^n) = n\\log x$. Use it to solve equations where the unknown is in the power, because it moves the unknown out of the index.',
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
      asking: 'What value of $x$ makes these two powers equal?',
      solution:
        'The bases are different, 3 and 27, but 27 is a power of 3: $27 = 3^3$. So rewrite the right side with base 3.\n\n' +
        'Replace 27: $27^{x - 2} = (3^3)^{x - 2}$. A power of a power multiplies the indices, and the 3 multiplies the whole of $x - 2$: $3^{3(x - 2)} = 3^{3x - 6}$.\n\n' +
        'The equation is now $3^{2x - 1} = 3^{3x - 6}$. If two powers of the same base are equal, their indices must be equal: $2x - 1 = 3x - 6$.\n\n' +
        'Solve it. Subtract $2x$ from both sides: $-1 = x - 6$. Add 6 to both sides: $x = 5$.',
      conclusion: 'Both sides then equal 19683, since $3^{9} = 19683$ and $27^{3} = 19683$. So the answer is $x = 5$.',
      whyWrong: [
        'This multiplies only the $x$ by 3, writing $27^{x-2} = 3^{3x-2}$. The whole power $x - 2$ must be multiplied by 3.',
        'This sets $2x - 1 = x - 2$, comparing powers before making the bases the same (the bases are 3 and 27).',
        null,
        'This sets up $2x - 1 = 3x - 6$ correctly but slips a sign when collecting terms, writing $-x = 5$ instead of $-x = -5$.',
      ],
      keyIdea: 'When the bases are powers of the same number, rewrite both sides with that base. Then set the indices equal and solve. Put brackets round the index when you multiply it.',
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
      asking: 'How can $\\log_8 x$ be written as a log with base 2?',
      solution:
        'Let $y = \\log_8 x$. In power form, that says $8^y = x$.\n\n' +
        '8 is a power of 2: $8 = 2^3$. So $x = (2^3)^y = 2^{3y}$.\n\n' +
        'Now read this as a log with base 2: $x = 2^{3y}$ means $\\log_2 x = 3y$.\n\n' +
        'Divide both sides by 3: $y = \\frac{1}{3}\\log_2 x$. Since $y$ was $\\log_8 x$, we have $\\log_8 x = \\frac{1}{3}\\log_2 x$.',
      conclusion: 'Test with $x = 64$: $\\log_8 64 = 2$, and a third of $\\log_2 64 = 6$ is also 2. So the answer is $\\frac{1}{3}\\log_2 x$.',
      whyWrong: [
        null,
        'This multiplies by $\\log_2 8 = 3$ instead of dividing by it. A bigger base needs a smaller power, so $\\log_8 x$ is smaller than $\\log_2 x$.',
        'This is $\\log_2 \\frac{x}{8}$. Changing base divides by $\\log_2 8$; it does not subtract it.',
        'This divides by 8 instead of by $\\log_2 8 = 3$.',
      ],
      keyIdea: 'To change base, use $\\log_a x = \\frac{\\log_c x}{\\log_c a}$, where $a$ is the old base and $c$ is the new one. When the old base is a power of the new one, this gives a simple fraction.',
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
      asking: 'What single number do these two logs combine to?',
      solution:
        'We can combine logs only when neither has a number in front. Use the **power law** on the first term, where a number in front goes up as an index: $2\\log_3 6 = \\log_3 6^2 = \\log_3 36$.\n\n' +
        'The expression is now $\\log_3 36 - \\log_3 4$. Subtracting logs means dividing the numbers inside: $\\log_3 \\frac{36}{4} = \\log_3 9$.\n\n' +
        '$\\log_3 9$ asks: 3 to what power gives 9? Since $3^2 = 9$, the value is 2.',
      conclusion: 'Everything combines to $\\log_3 9$, and $3^2 = 9$, so the answer is $2$.',
      whyWrong: [
        'This doubles inside the log ($2\\log_3 6 \\to \\log_3 12$) instead of squaring, then gets $\\log_3 \\frac{12}{4} = \\log_3 3 = 1$.',
        'This squares correctly to get 36 but then subtracts inside the log: $36 - 4 = 32$. Subtracting logs means **dividing** the numbers.',
        'This makes both mistakes: $2 \\times 6 = 12$ instead of $6^2$, then $12 - 4 = 8$ instead of dividing.',
        null,
      ],
      keyIdea: 'To simplify logs with the same base: move any number in front up as an index, then combine (add means multiply, subtract means divide). Finally ask what power of the base gives the number inside.',
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
      asking: 'Which value of $x$ makes this log equation true?',
      solution:
        'Combine the logs into one. Adding logs means multiplying the numbers inside: $\\log_2(x(x - 2)) = 3$.\n\n' +
        'Turn it into a power statement. $\\log_2 y = 3$ means $2^3 = y$. So $x(x - 2) = 2^3 = 8$.\n\n' +
        'Expand and get 0 on one side: $x^2 - 2x = 8$, so $x^2 - 2x - 8 = 0$.\n\n' +
        'Factorise. We need two numbers that multiply to $-8$ and add to $-2$. They are $-4$ and $2$, so $(x - 4)(x + 2) = 0$. This gives two candidates: 4 and $-2$.\n\n' +
        'Test them in the original equation. You cannot take the log of a negative number or zero, because no power of 2 gives one. $x = -2$ would need $\\log_2(-2)$, so we reject it. $x = 4$ gives $\\log_2 4 + \\log_2 2 = 2 + 1 = 3$, which works.',
      conclusion: 'Only one candidate keeps both logs valid, so the answer is $x = 4$.',
      whyWrong: [
        'These are both roots of the quadratic, but $x = -2$ must be rejected: $\\log_2(-2)$ does not exist.',
        'This adds inside the log, $\\log_2(x + x - 2) = 3$, giving $2x - 2 = 8$. The product law needs $x(x-2)$.',
        null,
        'This keeps the invalid root and throws away the valid one. $\\log_2 x$ needs $x > 0$.',
      ],
      keyIdea: 'To solve a log equation: combine into one log, change to power form, and solve. Always test each result in the original, because a log needs a positive number inside.',
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
      asking: 'At what time $t$ does $C$ fall to 50?',
      solution:
        'Put $C = 50$ into the formula: $50 = 200e^{-0.25t}$.\n\n' +
        'We want the $e$ part alone, so divide both sides by 200: $\\frac{50}{200} = e^{-0.25t}$, which gives $0.25 = e^{-0.25t}$.\n\n' +
        '$t$ is stuck in the power. $e$ is a fixed number, about 2.718, and $\\ln$ is the log with base $e$. Taking $\\ln$ of both sides brings the power down: $\\ln 0.25 = -0.25t$.\n\n' +
        'A calculator gives $\\ln 0.25 \\approx -1.3863$. So $-1.3863 = -0.25t$.\n\n' +
        'Divide both sides by $-0.25$. The two minus signs cancel: $t = \\frac{1.3863}{0.25} \\approx 5.545$. To 1 decimal place, that is 5.5.',
      conclusion: 'Rounding 5.545 to 1 decimal place gives the answer, $5.5$.',
      whyWrong: [
        'This uses $\\log_{10}$ instead of $\\ln$: $\\frac{\\log 4}{0.25} = 2.4$. Only $\\ln$ undoes $e$.',
        null,
        'This treats the decay as linear, losing 25% of the original 200 (which is 50) for each unit of $t$: $200 - 50t = 50$ gives $t = 3$. An exponential model loses a proportion of what is **left**, not a fixed amount.',
        'This multiplies by 0.25 at the end instead of dividing: $1.386 \\times 0.25 = 0.3$.',
      ],
      keyIdea: 'For a model like $Q = Ae^{kt}$: put in the value, divide by $A$ to isolate the $e$ part, take $\\ln$ of both sides, then divide by $k$.',
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
      asking: 'What growth rate $k$ makes 500 grow to 2000 in 6 time units?',
      solution:
        '$P_0$ is the starting value. At $t = 0$, $e^0 = 1$, so $P = P_0$. We are told $P = 500$ at $t = 0$, so $P_0 = 500$ and the formula is $P = 500e^{kt}$.\n\n' +
        'Use the second fact, $P = 2000$ at $t = 6$: $2000 = 500e^{6k}$.\n\n' +
        'Divide both sides by 500 to isolate the $e$ part: $4 = e^{6k}$.\n\n' +
        '$k$ is stuck in the power. $e$ is a fixed number, about 2.718, and $\\ln$ is the log with base $e$. Take $\\ln$ of both sides, which brings the power down: $\\ln 4 = 6k$.\n\n' +
        'Divide both sides by 6: $k = \\frac{\\ln 4}{6} = \\frac{1.3863}{6} \\approx 0.23105$. To 3 significant figures, that is 0.231.',
      conclusion: 'Rounding 0.23105 to 3 significant figures gives the answer, $0.231$.',
      whyWrong: [
        'This uses $\\log_{10}$: $\\frac{\\log 4}{6} = 0.100$. To undo $e$ you need $\\ln$.',
        'This is $\\ln 4$; it forgets to divide by $t = 6$.',
        'This skips the logarithm: $\\frac{4}{6} = 0.667$. The 6 is inside the power, so you must take $\\ln$ first.',
        null,
      ],
      keyIdea: 'Find the starting value from $t = 0$. Put the other pair of values in, divide by the starting value, take $\\ln$ of both sides, and divide by $t$.',
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
      asking: 'What is the exact value when each part is simplified and added?',
      solution:
        '$\\ln$ is the log with base $e$, a fixed number about 2.718. It is the opposite of $e$ to a power, so each undoes the other: $e^{\\ln y} = y$ and $\\ln(e^y) = y$.\n\n' +
        'First part, $e^{3\\ln 2}$. We need the power to be a single $\\ln$. The power law moves the 3 inside the log as an index: $3\\ln 2 = \\ln(2^3) = \\ln 8$.\n\n' +
        'So $e^{3\\ln 2} = e^{\\ln 8} = 8$, because $e$ and $\\ln$ undo each other.\n\n' +
        'Second part, $\\ln(e^4)$. $\\ln$ undoes $e$, so this equals the power, 4.\n\n' +
        'Add the parts: $8 + 4 = 12$.',
      conclusion: 'The first part is 8 and the second is 4, so the answer is $12$.',
      whyWrong: [
        null,
        'This turns $e^{3\\ln 2}$ into $3 \\times 2 = 6$, multiplying instead of using the power law ($2^3 = 8$).',
        'This computes $3^2 = 9$ instead of $2^3 = 8$: $3\\ln 2 = \\ln\\left(2^3\\right)$, so 2 is the base and 3 is the power.',
        'This gets 8 for the first term but uses $\\ln\\left(e^{4}\\right) = 1$, forgetting that the power 4 comes down: $\\ln\\left(e^{4}\\right) = 4\\ln e = 4$.',
      ],
      keyIdea: 'Use $e^{\\ln y} = y$ and $\\ln(e^y) = y$. If there is a number in front of $\\ln$, move it inside as an index first: $k\\ln y = \\ln(y^k)$.',
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
      asking: 'What value of $x$ makes these two powers equal?',
      solution:
        'The bases 5 and 3 are not powers of the same number, and $x$ is in both powers. So take $\\ln$, the log with base $e$ (a fixed number, about 2.718), of both sides: $\\ln(5^x) = \\ln(3^{x + 1})$.\n\n' +
        'The power law brings each power down to the front: $x\\ln 5 = (x + 1)\\ln 3$. Now $x$ is no longer in a power.\n\n' +
        'Expand the bracket. $\\ln 3$ is just a number multiplying both terms: $x\\ln 5 = x\\ln 3 + \\ln 3$.\n\n' +
        'Collect the $x$ terms on the left by subtracting $x\\ln 3$ from both sides: $x\\ln 5 - x\\ln 3 = \\ln 3$.\n\n' +
        'Take out $x$ as a common factor: $x(\\ln 5 - \\ln 3) = \\ln 3$. Divide both sides by the bracket: $x = \\frac{\\ln 3}{\\ln 5 - \\ln 3}$.\n\n' +
        'Use a calculator: $\\ln 3 \\approx 1.0986$ and $\\ln 5 \\approx 1.6094$. So $x = \\frac{1.0986}{1.6094 - 1.0986} = \\frac{1.0986}{0.5108} \\approx 2.15$.',
      conclusion: 'Dividing 1.0986 by 0.5108 and rounding to 3 significant figures gives the answer, $2.15$.',
      whyWrong: [
        null,
        'This expands $(x + 1)\\ln 3$ as $x\\ln 3 + 1$, forgetting to multiply the 1 by $\\ln 3$; that gives $x = \\frac{1}{\\ln 5 - \\ln 3} = 1.96$.',
        'This drops the powers and compares the bases as if they were multipliers, $5x = 3(x + 1)$. Different bases need logs.',
        'This moves $x\\ln 3$ to the left without changing its sign, getting $x(\\ln 5 + \\ln 3) = \\ln 3$, so $x = \\frac{1.0986}{2.7081} = 0.406$.',
      ],
      keyIdea: 'When $x$ appears in powers with different bases, take logs of both sides, bring the powers down, expand, collect the $x$ terms, factorise $x$ out and divide.',
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
      asking: 'Which value of $x$ makes this log equation true?',
      solution:
        'Combine the logs. Subtracting logs means dividing the numbers inside: $\\log_3 \\frac{x + 5}{x - 1} = 1$.\n\n' +
        'Change to power form. $\\log_3 y = 1$ means $y$ is 3 to the power 1, which is 3. So $\\frac{x + 5}{x - 1} = 3$.\n\n' +
        'Multiply both sides by $x - 1$ to clear the fraction: $x + 5 = 3(x - 1)$.\n\n' +
        'Expand: $x + 5 = 3x - 3$. Subtract $x$ from both sides and add 3 to both sides: $8 = 2x$.\n\n' +
        'Divide both sides by 2: $x = 4$.',
      conclusion: 'This gives $\\log_3 9 - \\log_3 3 = 2 - 1 = 1$, and both numbers inside the logs are positive. So the answer is $x = 4$.',
      whyWrong: [
        'This does not expand the bracket properly: $x + 5 = 3x - 1$ instead of $3(x - 1) = 3x - 3$.',
        'This undoes the log with base 10: $\\frac{x + 5}{x - 1} = 10$. The base here is 3, so the right-hand side is 3 (3 to the power 1).',
        'This flips the fraction, $\\frac{x - 1}{x + 5} = 3$. It is also invalid: $x - 1 = -9$ is negative, so $\\log_3(x - 1)$ does not exist.',
        null,
      ],
      keyIdea: 'To solve a difference of logs: combine into one log of a fraction, change to power form, clear the fraction and solve. Test that every number inside a log is positive.',
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
      asking: 'How can $\\log_a 18$ be written using only $p$ and $q$?',
      solution:
        'We only know the logs of 2 and 3. So write 18 using only 2s and 3s: $18 = 2 \\times 9 = 2 \\times 3^2$.\n\n' +
        'Multiplying inside a log becomes adding outside: $\\log_a 18 = \\log_a 2 + \\log_a 3^2$.\n\n' +
        'The power law brings the index to the front: $\\log_a 3^2 = 2\\log_a 3$. So $\\log_a 18 = \\log_a 2 + 2\\log_a 3$.\n\n' +
        'Replace each log with its letter, using $\\log_a 2 = p$ and $\\log_a 3 = q$. That gives $p + 2q$.',
      conclusion: 'One factor of 2 and two factors of 3 give the answer, $p + 2q$.',
      whyWrong: [
        'This uses $18 = 2^2 \\times 3$, but $2^2 \\times 3 = 12$. The squared factor is 3, not 2.',
        null,
        'This multiplies the logs. The log of a product is the **sum** of the logs.',
        'This writes $\\log_a 3^2 = (\\log_a 3)^2$. The power law brings the 2 to the front as a multiplier: $2\\log_a 3$.',
      ],
      keyIdea: 'To write a log using known logs, break the number into factors matching the ones you are given. Split with the product law, bring powers down with the power law, then substitute.',
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
