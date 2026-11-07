import type { StaticQuestion } from '../../../types';

// ---- helpers used only by the answer checks (not shown to students) ----
// Sample points -10, -9.75, ..., 10 (all exact in binary floating point).
const GRID = Array.from({ length: 81 }, (_, i) => -10 + i * 0.25);
/** Which grid points the real function is defined at ("1" = defined). JS gives NaN/Infinity where maths is undefined. */
const domSig = (f: (x: number) => number): string => GRID.map((x) => (Number.isFinite(f(x)) ? '1' : '0')).join('');
/** Same signature for a set described by a predicate (an option's claimed domain). */
const setSig = (p: (x: number) => boolean): string => GRID.map((x) => (p(x) ? '1' : '0')).join('');

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'domain-range-001',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    stem: 'Given $f(x) = 3x^2 - 2x + 1$, find $f(-2)$.',
    options: ['$-7$', '$9$', '$17$', '$41$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What number comes out of the function when we put in $x = -2$?',
      solution:
        '$f(x)$ is a rule that takes a number $x$ and gives back an answer. $f(-2)$ means: use the rule with $x = -2$.\n\n' +
        'Replace every $x$ with $(-2)$. Keep the brackets so the minus sign stays attached:\n\n$$f(-2) = 3(-2)^2 - 2(-2) + 1$$\n\n' +
        'Do the power first, because powers come before multiplying. A negative times a negative is positive: $(-2)^2 = (-2) \\times (-2) = 4$. So $3(-2)^2 = 3 \\times 4 = 12$.\n\n' +
        'Next, the middle part: $-2 \\times (-2) = 4$. It is a plus, because two negatives multiply to a positive.\n\n' +
        'Add the three parts: $12 + 4 + 1 = 17$.',
      conclusion: 'Putting $x = -2$ into the rule gives $12 + 4 + 1$, so the answer is $17$.',
      whyWrong: [
        'This comes from writing $(-2)^2$ as $-4$, giving $-12 + 4 + 1$. A negative number squared is positive: $(-2)^2 = 4$.',
        'This comes from a sign slip on the middle term: $-2 \\times (-2)$ is $+4$, not $-4$ (that would give $12 - 4 + 1$).',
        null,
        'This squares $3 \\times (-2)$ instead of just $-2$, giving $36 + 4 + 1$. In $3x^2$ only the $x$ is squared.',
      ],
      keyIdea: 'To find $f(\\text{number})$, rewrite the rule with the number in brackets wherever $x$ appears. Then do powers first, then multiplying, then adding. Brackets stop sign slips with negative inputs.',
    },
    check: {
      optionValues: [-7, 9, 17, 41],
      compute: () => {
        const f = (x: number) => 3 * x ** 2 - 2 * x + 1;
        return f(-2);
      },
    },
  },
  {
    id: 'domain-range-002',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    stem: 'What is the largest possible domain of the real function $f(x) = \\frac{5}{x - 4}$?',
    options: ['$x \\ne 4$', '$x \\ne -4$', '$x > 4$', 'All real numbers $x$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which values of $x$ can we put into this function and get a real number?',
      solution:
        'The **domain** is the set of all $x$ values a function can accept as inputs. "Largest possible" means we keep every $x$ that works and remove only those that break it.\n\n' +
        'This function is a fraction. A fraction breaks only when its denominator (the bottom part) is 0, because we can\'t divide by 0.\n\n' +
        'So find where the bottom is 0: $x - 4 = 0$. Add 4 to both sides to get $x$ alone, which gives the one bad input: $x = 4$.\n\n' +
        'Every other $x$ works, including smaller numbers. For example, $x = 3$ gives $\\frac{5}{-1} = -5$, which is a perfectly good output. So we remove only 4: $x \\ne 4$.',
      conclusion: 'The only input that breaks the fraction is 4, so the domain is $x \\ne 4$.',
      whyWrong: [
        null,
        'This is a sign slip when solving $x - 4 = 0$. Check it: at $x = -4$ the denominator is $-8$, which is fine; the problem is at $x = 4$.',
        'This wrongly assumes the output must be positive. Values like $x = 3$ give $f(3) = -5$, which is a perfectly good real number, so $x < 4$ is allowed too.',
        'This forgets that a denominator can never be zero. At $x = 4$ you would have to calculate $\\frac{5}{0}$, which is not defined.',
      ],
      keyIdea: 'Spot a variable in a denominator: set the denominator equal to 0 and solve. Those solutions are the only values to exclude, and every other real number stays in the domain.',
    },
    check: {
      optionValues: [
        setSig((x) => x !== 4),
        setSig((x) => x !== -4),
        setSig((x) => x > 4),
        setSig(() => true),
      ],
      compute: () => domSig((x) => 5 / (x - 4)),
    },
  },
  {
    id: 'domain-range-003',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    stem: 'What is the largest possible domain of the real function $g(x) = \\sqrt{x - 5}$?',
    options: ['$x > 5$', '$x \\ge -5$', '$x \\ge 0$', '$x \\ge 5$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which values of $x$ give a real number when we take this square root?',
      solution:
        'The **domain** is the set of all $x$ values a function can accept as inputs.\n\n' +
        'The square root of a negative number isn\'t a real number, because no real number multiplied by itself gives a negative. But $\\sqrt{0} = 0$ is fine. So the inside of the root must be 0 or more.\n\n' +
        'Write that as an inequality, using $\\ge$ for "greater than or equal to": $x - 5 \\ge 0$.\n\n' +
        'Add 5 to both sides to get $x$ alone: $x \\ge 5$.',
      conclusion: 'The inside of the root is 0 or more exactly when $x$ is at least 5, so the domain is $x \\ge 5$.',
      whyWrong: [
        'This leaves out $x = 5$, but $g(5) = \\sqrt{0} = 0$ is perfectly defined. Square roots need the inside $\\ge 0$, not $> 0$.',
        'This is a sign slip when solving $x - 5 \\ge 0$. Try $x = 0$: $\\sqrt{0 - 5} = \\sqrt{-5}$ is not real.',
        'This applies the rule "$x \\ge 0$" to $x$ itself, but the rule is about the **whole inside** of the root, $x - 5$.',
        null,
      ],
      keyIdea: 'For any square root, write (inside) $\\ge 0$ and solve it. Use $\\ge$ rather than $>$, because the root of 0 is allowed. The rule applies to the whole inside, not to $x$ alone.',
    },
    check: {
      optionValues: [setSig((x) => x > 5), setSig((x) => x >= -5), setSig((x) => x >= 0), setSig((x) => x >= 5)],
      compute: () => domSig((x) => Math.sqrt(x - 5)),
    },
  },
  {
    id: 'domain-range-004',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    stem: 'What is the range of $f(x) = x^2 + 3$, where $x$ can be any real number?',
    options: ['All real numbers', '$f(x) \\ge 3$', '$f(x) \\ge 0$', '$f(x) > 3$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What output values can $x^2 + 3$ produce?',
      solution:
        'The **range** is the set of all possible outputs: every value that $f(x)$ can equal.\n\n' +
        'Look at $x^2$ first. A number multiplied by itself is never negative. The smallest $x^2$ can be is 0, when $x = 0$.\n\n' +
        'Adding 3 lifts every output by 3. So the smallest output is $0 + 3 = 3$, and it is reached at $x = 0$.\n\n' +
        'Other $x$ values make $x^2$ as large as we like, so there is no top limit. The outputs are 3 and everything above it: $f(x) \\ge 3$.',
      conclusion: 'The lowest output is 3 and it is actually reached, so the range is $f(x) \\ge 3$.',
      whyWrong: [
        'This confuses range with domain. Every $x$ is allowed as an input, but the outputs can never drop below 3 because $x^2$ is never negative.',
        null,
        'This is the range of $x^2$ alone. Adding 3 lifts every output up by 3.',
        'This leaves out 3, but $f(0) = 3$, so 3 is an output. Use $\\ge$ when the smallest value is actually reached.',
      ],
      keyIdea: 'For $x^2 + c$, start from the fact that $x^2 \\ge 0$, then add $c$ to both sides to get $f(x) \\ge c$. Use $\\ge$ when the lowest value is actually reached.',
    },
    check: {
      optionValues: ['all', 'ge:3', 'ge:0', 'gt:3'],
      compute: () => {
        // x^2 + 3 has its smallest output at x = 0 (a grid point), so the minimum is reached: "ge"
        const ys = GRID.map((x) => x ** 2 + 3);
        return `ge:${Math.min(...ys)}`;
      },
    },
  },
  {
    id: 'domain-range-005',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    stem: 'A piecewise function is defined by\n\n$$f(x) = \\begin{cases} 2x + 1 & \\text{if } x < 3 \\\\ x^2 - 4 & \\text{if } x \\ge 3 \\end{cases}$$\n\nFind $f(3)$.',
    options: ['$5$', '$7$', '$12$', '$2$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the output when the input is exactly 3?',
      solution:
        'A **piecewise** function has different rules for different inputs. Each line says which inputs it is for, after the word "if".\n\n' +
        'Test the input 3 against each condition. Is $3 < 3$? No, 3 is not less than itself, so the top rule isn\'t used. Is $3 \\ge 3$? Yes, because $\\ge$ includes being equal.\n\n' +
        'So use the second rule, $x^2 - 4$. Replace $x$ with 3: $3^2 - 4 = 9 - 4 = 5$.',
      conclusion: 'The input 3 belongs to the rule for $x \\ge 3$, which gives $3^2 - 4$, so the answer is $5$.',
      whyWrong: [
        null,
        'This uses the top piece: $2(3) + 1 = 7$. But that piece is only for $x < 3$, and 3 is not less than 3.',
        'This adds the results of both pieces ($7 + 5$). For each input exactly one piece applies.',
        'This treats $x^2$ as $2x$, giving $2(3) - 4 = 2$. Squaring means multiplying by itself: $3^2 = 9$.',
      ],
      keyIdea: 'For a piecewise function, first test the input against each "if" condition to find the one rule that applies, then substitute into only that rule. At a boundary value, look for the sign that includes equality ($\\le$ or $\\ge$).',
    },
    check: {
      optionValues: [5, 7, 12, 2],
      compute: () => {
        const f = (x: number) => (x < 3 ? 2 * x + 1 : x ** 2 - 4);
        return f(3);
      },
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'domain-range-006',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'Given $f(x) = x^2 - 3x$, which expression is equal to $f(x + 2)$?',
    options: ['$x^2 - 3x - 2$', '$x^2 + x + 6$', '$x^2 - 3x + 2$', '$x^2 + x - 2$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What do we get if we put $x + 2$ into $f$ in place of $x$?',
      solution:
        '$f(x) = x^2 - 3x$ is a rule: square the input, then subtract 3 times the input. In $f(x + 2)$, the input is now the whole of $x + 2$.\n\n' +
        'Replace every $x$ with $(x + 2)$, keeping the brackets: $f(x + 2) = (x + 2)^2 - 3(x + 2)$.\n\n' +
        'Expand the square by multiplying the bracket by itself: $(x + 2)(x + 2) = x^2 + 2x + 2x + 4 = x^2 + 4x + 4$.\n\n' +
        'Expand the second part. The $-3$ multiplies both terms in the bracket: $-3(x + 2) = -3x - 6$.\n\n' +
        'Put them together and collect like terms (terms with the same power of $x$): $x^2 + 4x - 3x + 4 - 6 = x^2 + x - 2$.',
      conclusion: 'Substituting and expanding gives $x^2 + 4x + 4 - 3x - 6$, so $f(x + 2)$ equals $x^2 + x - 2$.',
      whyWrong: [
        'This expands $(x + 2)^2$ as $x^2 + 4$, forgetting the middle term $4x$. Remember $(x + 2)^2 = (x + 2)(x + 2) = x^2 + 4x + 4$.',
        'This multiplies only the $x$ in $-3(x + 2)$ by $-3$ and writes $-3x + 2$. The $-3$ must multiply both terms: $-3x - 6$.',
        'This is $f(x) + 2$ (adding 2 to the output), not $f(x + 2)$ (adding 2 to the input).',
        null,
      ],
      keyIdea: 'To find $f(\\text{expression})$, put the whole expression in brackets wherever $x$ appears, expand each bracket, then collect like terms. To test it, try $x = 0$: here $f(2) = -2$, and the result also gives $-2$.',
    },
    check: {
      // evaluate every option at x = 3 and compare with f(3 + 2)
      optionValues: [
        (x: number) => x ** 2 - 3 * x - 2,
        (x: number) => x ** 2 + x + 6,
        (x: number) => x ** 2 - 3 * x + 2,
        (x: number) => x ** 2 + x - 2,
      ].map((g) => g(3)),
      compute: () => {
        const f = (x: number) => x ** 2 - 3 * x;
        return f(3 + 2);
      },
    },
  },
  {
    id: 'domain-range-007',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'What is the largest possible domain of $h(x) = \\sqrt{6 - 2x}$?',
    options: ['$x \\ge 3$', '$x \\le 3$', '$x < 3$', '$x \\le -3$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which values of $x$ keep the inside of this square root from going negative?',
      solution:
        'The **domain** is the set of allowed inputs. A square root needs its inside to be 0 or more, because a negative number has no real square root. So: $6 - 2x \\ge 0$.\n\n' +
        'Solve this like an equation. Subtract 6 from both sides to move the number away from the $x$ term: $-2x \\ge -6$.\n\n' +
        'To get $x$ alone we divide by $-2$. There is one extra rule: dividing an inequality by a negative number flips the sign. For example, $2 > 1$, but $-2 < -1$. So $\\ge$ becomes $\\le$.\n\n' +
        'That gives $x \\le \\frac{-6}{-2}$, which is $x \\le 3$.',
      conclusion: 'Testing confirms the direction: $x = 0$ gives $\\sqrt{6}$, but $x = 4$ gives $\\sqrt{-2}$, which is not real. So the domain is $x \\le 3$.',
      whyWrong: [
        'This forgets to flip the inequality when dividing by $-2$. Test $x = 4$: $\\sqrt{6 - 8} = \\sqrt{-2}$ is not real, so $x \\ge 3$ cannot be right.',
        null,
        'This leaves out $x = 3$, but $h(3) = \\sqrt{0} = 0$ is defined. Square roots need the inside $\\ge 0$, not $> 0$.',
        'This moves the 6 across without changing its sign ($-2x \\ge 6$). Test $x = 0$: $\\sqrt{6}$ is fine, yet $x = 0$ is not in $x \\le -3$.',
      ],
      keyIdea: 'For $\\sqrt{\\text{inside}}$, solve inside $\\ge 0$. If you divide by a negative number, flip the inequality sign. Then test one value on each side of the boundary to confirm the direction.',
    },
    check: {
      optionValues: [setSig((x) => x >= 3), setSig((x) => x <= 3), setSig((x) => x < 3), setSig((x) => x <= -3)],
      compute: () => domSig((x) => Math.sqrt(6 - 2 * x)),
    },
  },
  {
    id: 'domain-range-008',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'What is the largest possible domain of $f(x) = \\ln(5 - x) + \\sqrt{x + 2}$?',
    options: ['$-2 < x < 5$', '$-2 \\le x \\le 5$', '$-2 \\le x < 5$', '$2 \\le x < 5$'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which values of $x$ make both the logarithm and the square root work?',
      solution:
        'The function adds two parts, and **both** must work for the same $x$. So find the condition for each part, then keep the $x$ values that pass both.\n\n' +
        'First part: $\\ln$ is the natural logarithm, the log with base $e$ (a fixed number, about 2.718). It only accepts inputs above 0, because it asks "what power of $e$ gives this?" and powers of $e$ are always positive. So $5 - x > 0$.\n\n' +
        'Solve it. Add $x$ to both sides: $5 > x$, which is the same as $x < 5$.\n\n' +
        'Second part: a square root needs its inside to be 0 or more. So $x + 2 \\ge 0$. Subtract 2 from both sides: $x \\ge -2$.\n\n' +
        'Now combine them: $x$ must be at least $-2$ and less than 5. At $x = -2$ the root is $\\sqrt{0} = 0$, which is fine. At $x = 5$ we would need $\\ln 0$, which doesn\'t exist. So: $-2 \\le x < 5$.',
      conclusion: 'Both parts work only when $x \\ge -2$ and $x < 5$, so the domain is $-2 \\le x < 5$.',
      whyWrong: [
        'This excludes $x = -2$, but $\\sqrt{0} = 0$ is fine. Only the log end ($x = 5$) must be strict.',
        'This includes $x = 5$, but then you need $\\ln 0$, which is not defined. A log needs its input strictly greater than 0.',
        null,
        'This is a sign slip in $x + 2 \\ge 0$, giving $x \\ge 2$. The correct step is to subtract 2: $x \\ge -2$. For example $x = 0$ works: $\\ln 5 + \\sqrt{2}$.',
      ],
      keyIdea: 'When a function has several parts, write one condition per part: denominator $\\ne 0$, root inside $\\ge 0$, log inside $> 0$. Solve each one, then keep only the $x$ values that satisfy all of them. A number line helps.',
    },
    check: {
      optionValues: [
        setSig((x) => -2 < x && x < 5),
        setSig((x) => -2 <= x && x <= 5),
        setSig((x) => -2 <= x && x < 5),
        setSig((x) => 2 <= x && x < 5),
      ],
      compute: () => domSig((x) => Math.log(5 - x) + Math.sqrt(x + 2)),
    },
  },
  {
    id: 'domain-range-009',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'Which values must be excluded from the domain of $f(x) = \\frac{x + 1}{x^2 - 5x + 6}$?',
    options: ['$x = -2$ and $x = -3$ only', '$x = 2$ and $x = 3$ only', '$x = -1$ only', '$x = -1$, $x = 2$ and $x = 3$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which inputs would make this fraction impossible to work out?',
      solution:
        'A fraction breaks only when its denominator (the bottom) is 0, since we can\'t divide by 0. The top doesn\'t matter: a top of 0 just gives an output of 0.\n\n' +
        'So set the bottom equal to 0: $x^2 - 5x + 6 = 0$.\n\n' +
        'Factorise it, which means writing it as two brackets multiplied. We need two numbers that multiply to $6$ and add to $-5$. Those are $-2$ and $-3$, because $(-2) \\times (-3) = 6$ and $(-2) + (-3) = -5$. So $(x - 2)(x - 3) = 0$.\n\n' +
        'A product is 0 only when one of its factors is 0. So $x - 2 = 0$ or $x - 3 = 0$, which gives $x = 2$ or $x = 3$.',
      conclusion: 'Only these two inputs make the bottom 0, so the values to exclude are $x = 2$ and $x = 3$ only.',
      whyWrong: [
        'This is a sign error from the factors: $(x - 2)(x - 3) = 0$ gives $x = 2$ and $x = 3$, not $-2$ and $-3$. Check: $(-2)^2 - 5(-2) + 6 = 20 \\ne 0$.',
        null,
        'This sets the numerator to zero instead of the denominator. A zero on top is fine: $\\frac{0}{12} = 0$.',
        'This also excludes the zero of the numerator. Only the denominator matters; $f(-1) = 0$ is a valid output.',
      ],
      keyIdea: 'To find excluded values, ignore the top of the fraction. Set the bottom equal to 0 and solve it, factorising if it is a quadratic (an expression with $x^2$). Every solution is excluded.',
    },
    check: {
      optionValues: [
        setSig((x) => x !== -2 && x !== -3),
        setSig((x) => x !== 2 && x !== 3),
        setSig((x) => x !== -1),
        setSig((x) => x !== -1 && x !== 2 && x !== 3),
      ],
      compute: () => domSig((x) => (x + 1) / (x ** 2 - 5 * x + 6)),
    },
  },
  {
    id: 'domain-range-010',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'What is the range of $f(x) = x^2 - 6x + 11$, $x \\in \\mathbb{R}$?',
    options: ['$f(x) \\ge 11$', '$f(x) \\ge 3$', '$f(x) \\le 2$', '$f(x) \\ge 2$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What output values can $x^2 - 6x + 11$ produce?',
      solution:
        'The **range** is the set of all possible outputs. $x \\in \\mathbb{R}$ means $x$ can be any real number. The graph here is a parabola, a U-shaped curve. It opens upwards because the number in front of $x^2$ is positive. So it has a lowest point, and the outputs rise from there.\n\n' +
        'To find the lowest point, rewrite the expression by **completing the square**. Halve the number in front of $x$: $-6 \\div 2 = -3$. This gives the bracket $(x - 3)^2$.\n\n' +
        'Expand it to see what it gives: $(x - 3)^2 = x^2 - 6x + 9$. We need $+11$ rather than $+9$, so add 2: $x^2 - 6x + 11 = (x - 3)^2 + 2$.\n\n' +
        'A square is never negative, so $(x - 3)^2$ is 0 at its smallest, when $x = 3$. That makes the smallest output $0 + 2 = 2$.\n\n' +
        '$(x - 3)^2$ grows without limit as $x$ moves away from 3, so there is no top limit. The outputs are 2 and everything above it: $f(x) \\ge 2$.',
      conclusion: 'The lowest output is 2, reached at $x = 3$, so the range is $f(x) \\ge 2$.',
      whyWrong: [
        'This uses $f(0) = 11$, the $y$-intercept. The lowest point is at the vertex $x = 3$, not at $x = 0$; for example $f(3) = 2 < 11$.',
        'This uses the $x$-coordinate of the vertex (3) instead of the $y$-value there. The range is about outputs: $f(3) = 2$.',
        'This has the correct value but the wrong direction. With a positive $x^2$ coefficient the parabola opens upwards, so 2 is a minimum, not a maximum.',
        null,
      ],
      keyIdea: 'For the range of $ax^2 + bx + c$, find the height of the turning point (the lowest or highest point): complete the square, or put $x = -\\frac{b}{2a}$ into the function. If $a > 0$ the range is $\\ge$ that height. If $a < 0$ it is $\\le$ that height.',
    },
    check: {
      optionValues: ['ge:11', 'ge:3', 'le:2', 'ge:2'],
      compute: () => {
        const a = 1;
        const b = -6;
        const c = 11;
        const xv = -b / (2 * a);
        return `${a > 0 ? 'ge' : 'le'}:${a * xv * xv + b * xv + c}`;
      },
    },
  },
  {
    id: 'domain-range-011',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'What is the range of $g(x) = 2^x + 3$, $x \\in \\mathbb{R}$?',
    options: ['$g(x) > 0$', '$g(x) > 3$', '$g(x) \\ge 3$', '$g(x) \\ge 4$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What output values can $2^x + 3$ produce?',
      solution:
        'The **range** is the set of all possible outputs. $x \\in \\mathbb{R}$ means $x$ can be any real number.\n\n' +
        'Start with $2^x$ alone. It is always positive. Try some values: $2^3 = 8$, $2^0 = 1$, $2^{-1} = \\frac{1}{2}$, $2^{-5} = \\frac{1}{32}$. As $x$ gets more negative, $2^x$ gets closer to 0 but never reaches it.\n\n' +
        'Large values of $x$ make $2^x$ as big as we like. So $2^x$ takes every value above 0, which we write as $2^x > 0$.\n\n' +
        'Now add 3 to both sides: $2^x + 3 > 3$. The output gets close to 3 but never equals it, because that would need $2^x = 0$.',
      conclusion: 'The outputs take every value above 3 but never 3 itself, so the range is $g(x) > 3$.',
      whyWrong: [
        'This is the range of $2^x$ alone. Adding 3 shifts the whole graph (and its asymptote) up by 3.',
        null,
        'This includes 3, but $g(x) = 3$ would need $2^x = 0$, which never happens. An asymptote value is not reached.',
        'This assumes the smallest value is at $x = 0$ ($g(0) = 1 + 3 = 4$). Negative $x$ give smaller values, e.g. $g(-1) = 3.5$.',
      ],
      keyIdea: 'For $a^x + c$ with a positive base other than 1, $a^x$ is always above 0 and never equals 0, so the range is output $> c$. The line $y = c$ is a horizontal asymptote (never touched), so the sign is strict.',
    },
    check: {
      optionValues: ['gt:0', 'gt:3', 'ge:3', 'ge:4'],
      compute: () => {
        const g = (x: number) => 2 ** x + 3;
        // 2^x > 0 for every x, so every output is above the limit as x -> -infinity (2^-2000 underflows to 0)
        const bound = g(-2000);
        if (!GRID.every((x) => g(x) > bound)) throw new Error('bound not strict');
        return `gt:${bound}`;
      },
    },
  },
  {
    id: 'domain-range-012',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'Which of these functions is **one-to-one** on the given domain?',
    options: [
      '$f(x) = x^2$, $x \\in \\mathbb{R}$',
      '$f(x) = |x - 1|$, $x \\in \\mathbb{R}$',
      '$f(x) = x^2$, $x \\ge 0$',
      '$f(x) = \\sin x$, $0 \\le x \\le \\pi$',
    ],
    correctIndex: 2,
    markScheme: {
      asking: 'Which function never gives the same output for two different inputs?',
      solution:
        '**One-to-one** means each output comes from only one input. So no two different inputs may give the same output.\n\n' +
        'To rule a function out, we only need one pair of different inputs with the same output. Three of the functions have such a pair:\n\n| Function | Two inputs | Output of both |\n|---|---|---|\n| $x^2$, all real $x$ | $-2$ and $2$ | $4$ |\n| $\\lvert x - 1 \\rvert$, all real $x$ | $0$ and $2$ | $1$ |\n| $\\sin x$, $0 \\le x \\le \\pi$ | $\\frac{\\pi}{6}$ and $\\frac{5\\pi}{6}$ | $\\frac{1}{2}$ |\n\n' +
        'In the last row, $\\pi$ stands for $180^\\circ$, so the two inputs are $30^\\circ$ and $150^\\circ$. Both have a sine of $\\frac{1}{2}$.\n\n' +
        'The remaining function is $x^2$ with $x \\ge 0$. Negative inputs are not allowed, and for inputs of 0 or more, a bigger input always gives a bigger output: $0, 1, 4, 9, \\ldots$ So no output is ever repeated.',
      conclusion: 'Only one function never repeats an output: $f(x) = x^2$, $x \\ge 0$.',
      whyWrong: [
        'On all real numbers $x^2$ is not one-to-one: $(-2)^2 = 2^2 = 4$. A horizontal line crosses the parabola twice.',
        'The V-shaped graph of $|x - 1|$ fails the horizontal line test: $|0 - 1| = |2 - 1| = 1$.',
        null,
        'On $0 \\le x \\le \\pi$ the sine curve rises to 1 and falls back, so $\\sin\\frac{\\pi}{6} = \\sin\\frac{5\\pi}{6} = \\frac{1}{2}$.',
      ],
      keyIdea: 'Use the horizontal line test: picture a horizontal line moving up the graph. If it ever crosses the graph twice, the function isn\'t one-to-one. Curves that turn around fail unless the domain stops at the turning point.',
    },
  },
  {
    id: 'domain-range-013',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'A function is defined by\n\n$$f(x) = \\begin{cases} x^2 - 1 & \\text{if } x < 2 \\\\ 3x - 4 & \\text{if } x \\ge 2 \\end{cases}$$\n\nFind $f(f(-2))$.',
    options: ['$8$', '$3$', '$99$', '$5$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What do we get if we apply $f$ to $-2$, then apply $f$ again to the result?',
      solution:
        '$f(f(-2))$ means apply $f$ twice. Work from the inside: find $f(-2)$ first, then put that result back into $f$.\n\n' +
        'Find $f(-2)$. Choose the rule by checking the condition: $-2 < 2$ is true, so use the top rule, $x^2 - 1$. That gives $(-2)^2 - 1 = 4 - 1 = 3$.\n\n' +
        'Now we need $f(3)$. Check the conditions again, because the input has changed: $3 < 2$ is false and $3 \\ge 2$ is true. So use the bottom rule, $3x - 4$.\n\n' +
        '$f(3) = 3 \\times 3 - 4 = 9 - 4 = 5$.',
      conclusion: 'First $f(-2) = 3$, and then $f(3)$ uses the other rule, so the answer is $5$.',
      whyWrong: [
        'This uses the top piece again for $f(3)$: $3^2 - 1 = 8$. But $3 \\ge 2$, so the second piece $3x - 4$ applies.',
        'This stops after the first step: $f(-2) = 3$. The question asks for $f$ applied **twice**.',
        'This uses the wrong piece for $-2$: $3(-2) - 4 = -10$, then $f(-10) = 100 - 1 = 99$. Since $-2 < 2$, the top piece applies first.',
        null,
      ],
      keyIdea: 'For $f(f(a))$ on a piecewise function, work from the inside out. Check the conditions afresh for each new input, because the second input often falls under a different rule.',
    },
    check: {
      optionValues: [8, 3, 99, 5],
      compute: () => {
        const f = (x: number) => (x < 2 ? x ** 2 - 1 : 3 * x - 4);
        return f(f(-2));
      },
    },
  },
  {
    id: 'domain-range-014',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem:
      'A function is defined by\n\n' +
      '$$f(x) = \\begin{cases} -x & \\text{if } x < 0 \\\\ 2x & \\text{if } 0 \\le x < 10 \\\\ x - 3 & \\text{if } x \\ge 10 \\end{cases}$$\n\n' +
      'Find $f(-4) + f(5) + f(10)$.',
    options: ['$21$', '$34$', '$13$', '$9$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the total when we work out the function at $-4$, $5$ and $10$?',
      solution:
        'This function has three rules, and each input uses only one. For each input, find the condition it meets, then substitute:\n\n| Input | True condition | Rule | Output |\n|---|---|---|---|\n| $-4$ | $-4 < 0$ | $-x$ | $-(-4) = 4$ |\n| $5$ | $0 \\le 5 < 10$ | $2x$ | $2 \\times 5 = 10$ |\n| $10$ | $10 \\ge 10$ | $x - 3$ | $10 - 3 = 7$ |\n\n' +
        'Two rows are easy to get wrong. The rule $-x$ means "change the sign", so a negative input becomes positive. And 10 is not in the middle rule, because $10 < 10$ is false.\n\n' +
        'Add the three outputs: $4 + 10 + 7 = 21$.',
      conclusion: 'The three inputs give 4, 10 and 7, so the total is $21$.',
      whyWrong: [
        null,
        'This uses $2x$ at $x = 10$, giving $4 + 10 + 20$. But $10 < 10$ is false, so $x = 10$ belongs to the last rule.',
        'This reads $-x$ as "the number stays negative", giving $-4 + 10 + 7$. In fact $-(-4) = 4$.',
        'This applies $2x$ to $-4$, giving $-8 + 10 + 7$. Since $-4 < 0$, the first rule applies.',
      ],
      keyIdea: 'Make a table with columns for input, the condition it meets, the rule and the output. At a boundary like $x = 10$, check whether the sign includes equality: $<$ does not, $\\ge$ does.',
    },
    check: {
      optionValues: [21, 34, 13, 9],
      compute: () => {
        const f = (x: number) => (x < 0 ? -x : x < 10 ? 2 * x : x - 3);
        return f(-4) + f(5) + f(10);
      },
    },
  },
  {
    id: 'domain-range-016',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'The function $f(x) = \\frac{2x + 1}{x - 3}$ has domain $x \\ne 3$. Which value is **not** in its range?',
    options: ['$3$', '$-\\frac{1}{3}$', '$2$', 'None: every real number is in the range'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which output can this function never produce?',
      solution:
        'The **range** is the set of possible outputs. A value is in the range if some input gives that output. So call the output $y$ and try to solve for $x$.\n\n' +
        'Write $y = \\frac{2x + 1}{x - 3}$. Multiply both sides by $x - 3$ to clear the fraction: $y(x - 3) = 2x + 1$, so $xy - 3y = 2x + 1$.\n\n' +
        'Collect the $x$ terms on one side and the rest on the other: $xy - 2x = 3y + 1$.\n\n' +
        'Take out $x$ as a common factor: $x(y - 2) = 3y + 1$.\n\n' +
        'To get $x$ alone we must divide by $y - 2$, and that fails when $y = 2$. Put $y = 2$ into the line above: $x \\times 0 = 7$, which no $x$ can satisfy. So 2 is never an output.',
      conclusion: 'Every other output has a matching input, but no input gives 2, so the value not in the range is $2$.',
      whyWrong: [
        'This mixes up domain and range: 3 is the excluded **input** (vertical asymptote $x = 3$). As an output, 3 is reached: $f(10) = \\frac{21}{7} = 3$.',
        'This is $f(0)$, the $y$-intercept, so it is definitely **in** the range.',
        null,
        'A function like this has a horizontal asymptote, and its value is never reached: solving $f(x) = 2$ gives $1 = -6$, which is impossible.',
      ],
      keyIdea: 'To find what a fraction like $\\frac{ax + b}{cx + d}$ can\'t output, set $y$ equal to it and solve for $x$. The value of $y$ that breaks the solving is missing. It always equals $\\frac{a}{c}$, the ratio of the numbers multiplying $x$.',
    },
    check: {
      optionValues: [3, -1 / 3, 2, null],
      compute: () => {
        // y(cx + d) = ax + b  =>  x(cy - a) = b - dy : no solution when cy - a = 0 (and b - dy != 0)
        const a = 2;
        const b = 1;
        const c = 1;
        const d = -3;
        const y = a / c;
        if (b - d * y === 0) throw new Error('degenerate');
        return y;
      },
    },
  },
  {
    id: 'domain-range-017',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'The function $f(x) = x^2 - 4x + 1$ is defined only for $0 \\le x \\le 5$. What is its range?',
    options: ['$1 \\le f(x) \\le 6$', '$-3 \\le f(x) \\le 6$', '$f(x) \\ge -3$', '$-3 \\le f(x) \\le 1$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What are the lowest and highest outputs when $x$ only runs from 0 to 5?',
      solution:
        'The **range** is the set of outputs. Only inputs from 0 to 5 are allowed, so we need the lowest and highest outputs on that stretch of the graph.\n\n' +
        'The graph is a U-shaped parabola, since the number in front of $x^2$ is positive. Its lowest point, the **vertex**, is at $x = -\\frac{b}{2a}$. Here $a = 1$ is the number in front of $x^2$ and $b = -4$ is the number in front of $x$. So $x = -\\frac{-4}{2 \\times 1} = 2$.\n\n' +
        '2 is between 0 and 5, so the vertex is inside our stretch. Its output is the lowest: $f(2) = 2^2 - 4 \\times 2 + 1 = 4 - 8 + 1 = -3$.\n\n' +
        'The highest output must be at one of the two ends, since a U shape rises as you move away from the vertex. Work out both: at $x = 0$ only the $+1$ is left, so $f(0) = 1$. And $f(5) = 25 - 20 + 1 = 6$.\n\n' +
        'The larger end value is 6. So the outputs run from $-3$ up to 6: $-3 \\le f(x) \\le 6$.',
      conclusion: 'The vertex gives the lowest output and the end $x = 5$ gives the highest, so the range is $-3 \\le f(x) \\le 6$.',
      whyWrong: [
        'This only uses the endpoints $f(0) = 1$ and $f(5) = 6$, missing the dip down to the vertex: $f(2) = -3$.',
        null,
        'This is the range for all real $x$. With $x$ stopped at 5, the outputs cannot go above $f(5) = 6$.',
        'This takes $f(0) = 1$ as the maximum, but the right endpoint is further from the vertex: $f(5) = 6 > 1$.',
      ],
      keyIdea: 'For a quadratic on a limited interval, work out three outputs: one at each end, and one at the vertex if it is inside the interval. The smallest and largest of these give the range.',
    },
    check: {
      optionValues: ['1,6', '-3,6', null, '-3,1'],
      compute: () => {
        const f = (x: number) => x ** 2 - 4 * x + 1;
        const ys = Array.from({ length: 5001 }, (_, i) => f(i / 1000));
        return `${Math.min(...ys)},${Math.max(...ys)}`;
      },
    },
  },
  {
    id: 'domain-range-018',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'The function $f(x) = x^2 - 6x + 10$ is given the domain $x \\ge k$. What is the **smallest** value of $k$ for which $f$ is one-to-one?',
    options: ['$1$', '$-3$', '$0$', '$3$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Where must the domain start so that no output is repeated?',
      solution:
        '**One-to-one** means no two different inputs give the same output. A parabola (U-shaped curve) comes down to its lowest point, then goes back up. So over the whole curve, each height is reached twice.\n\n' +
        'So we must keep only one side of the lowest point, the **vertex**. The domain $x \\ge k$ keeps a right-hand part, and we want that part to only go up.\n\n' +
        'Find the vertex by completing the square. Halve the $-6$ to get $-3$, so the bracket is $(x - 3)^2 = x^2 - 6x + 9$. We need $+10$, so add 1: $f(x) = (x - 3)^2 + 1$.\n\n' +
        'A square is never negative, so $(x - 3)^2$ is smallest, at 0, when $x = 3$. So the vertex is at $x = 3$.\n\n' +
        'If $k$ were smaller than 3, the domain would include some of the falling side, and outputs would repeat. For example, $k = 2$ allows $f(2) = 2$ and $f(4) = 2$. So $k$ can\'t go below 3, and $k = 3$ works.',
      conclusion: 'The curve only rises from its vertex at $x = 3$, so the smallest value of $k$ is $3$.',
      whyWrong: [
        'This uses the $y$-coordinate of the vertex $(3, 1)$. The domain restriction is about $x$-values, so use $x = 3$.',
        'This reads the vertex from $(x - 3)^2$ with the wrong sign. $(x - 3)^2$ is smallest when $x = 3$, not $-3$.',
        'This assumes $x \\ge 0$ is always enough, but with $k = 0$: $f(2) = 2$ and $f(4) = 2$, two inputs with the same output.',
        null,
      ],
      keyIdea: 'To make a quadratic one-to-one, cut its domain at the vertex. Find the vertex\'s $x$-value with $-\\frac{b}{2a}$ or by completing the square, then use $x \\ge$ that value or $x \\le$ that value. Use the $x$-coordinate, not the height.',
    },
    check: {
      optionValues: [1, -3, 0, 3],
      compute: () => {
        const f = (x: number) => x ** 2 - 6 * x + 10;
        // smallest integer k in [-10, 10] such that f takes no repeated value on a grid over [k, k + 20]
        for (let k = -10; k <= 10; k++) {
          const ys = Array.from({ length: 81 }, (_, i) => f(k + i * 0.25));
          if (new Set(ys).size === ys.length) return k;
        }
        throw new Error('none');
      },
    },
  },
  {
    id: 'domain-range-020',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    stem: 'What does the **range** of a function describe?',
    options: ['The set of all possible outputs', 'The set of all allowed inputs', 'The largest output minus the smallest output', 'The slope of its graph'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does the word "range" mean for a function?',
      solution:
        'Think of a function as a machine: you put in a number and one number comes out. For example, $f(x) = x^2$ turns 3 into 9.\n\n' +
        'The numbers you may put in are called the **domain**. The numbers that can come out are called the **range**. For $f(x) = x^2$, any real number can go in, but only 0 and positive numbers can come out.',
      conclusion: 'The range is what comes out of the machine, so it is the set of all possible outputs.',
      whyWrong: [
        null,
        'This describes the **domain**. Domain means inputs; range means outputs.',
        'This is the meaning of "range" in statistics, a single number. The range of a function is a whole set of values.',
        'Slope says how steeply a graph rises. It does not say which output values occur.',
      ],
      keyIdea: 'Use this memory link: domain is what goes in (inputs), range is what comes out (outputs). On a graph, read the domain along the $x$-axis and the range up the $y$-axis.',
    },
  },
  {
    id: 'domain-range-021',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    stem: 'The real function $f(x) = \\ln x$ is defined exactly when:',
    options: ['$x > 0$', '$x \\ge 0$', '$x \\ne 0$', 'All real $x$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which values of $x$ can $\\ln$ accept?',
      solution:
        '$\\ln x$ is the natural logarithm. It answers the question "what power of $e$ gives $x$?" Here $e$ is a fixed number, about 2.718. For example, $\\ln 1 = 0$ because $e^0 = 1$.\n\n' +
        'A power of $e$ is always positive. For example, $e^{2} \\approx 7.39$ and $e^{-2} \\approx 0.14$. No power of $e$ reaches 0 or goes below it.\n\n' +
        'So $\\ln 0$ and $\\ln(-2)$ have no answer, and only inputs above 0 work: $x > 0$.',
      conclusion: 'A logarithm accepts only positive inputs, so $\\ln x$ is defined exactly when $x > 0$.',
      whyWrong: [
        null,
        'This includes $x = 0$, but no power of $e$ equals $0$, so $\\ln 0$ is not defined. The $\\ge$ rule belongs to square roots.',
        'This allows negative inputs, but no power of $e$ is negative, so $\\ln(-2)$ is not a real number. The $\\ne$ rule belongs to denominators.',
        'This forgets the restriction altogether. The graph of $y = \\ln x$ exists only to the right of the $y$-axis.',
      ],
      keyIdea: 'Whenever a logarithm appears in a domain question, write (inside of the log) $> 0$ and solve it. The sign is strict: 0 is not allowed, unlike a square root, where 0 is fine.',
    },
    check: {
      optionValues: [setSig((x) => x > 0), setSig((x) => x >= 0), setSig((x) => x !== 0), setSig(() => true)],
      compute: () => domSig((x) => Math.log(x)),
    },
  },
  {
    id: 'domain-range-022',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    stem: 'A curve is the graph of a function of $x$ only if every vertical line meets it:',
    options: ['At most once', 'At least once', 'Exactly twice', 'Never'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many times can a vertical line cross the graph of a function?',
      solution:
        'A **function** gives exactly one output for each input. So one $x$ value can never have two $y$ values.\n\n' +
        'A vertical line joins all the points with the same $x$. If it meets the curve twice, that one $x$ has two $y$ values, so the curve isn\'t a function. A circle fails this way.\n\n' +
        'It is fine for a vertical line to miss the curve: that $x$ just isn\'t in the domain. For example, $y = \\frac{1}{x}$ has no point at $x = 0$. So each vertical line may meet the curve once or not at all.',
      conclusion: 'A vertical line may meet the curve once or not at all, so the answer is at most once.',
      whyWrong: [
        null,
        'This would force every real $x$ into the domain. A function may leave values out: $y = \\frac{1}{x}$ has no point at $x = 0$.',
        'Two meeting points on one vertical line mean one input with two outputs, which is exactly what a function cannot have.',
        'If no vertical line met the curve, the curve would have no points at all.',
      ],
      keyIdea: 'Use the vertical line test: slide a vertical line across the graph. If it ever touches the curve twice or more, the curve isn\'t a function. Don\'t confuse it with the horizontal line test, which checks for one-to-one.',
    },
  },
  {
    id: 'domain-range-023',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'Let $f : \\mathbb{R} \\to \\mathbb{R}$ be the mapping $f(x) = 4 - x^2$. What is the image of $f$?',
    options: ['$f(x) \\le 4$', '$f(x) \\ge 4$', '$f(x) \\le 2$', 'All real numbers'],
    correctIndex: 0,
    markScheme: {
      asking: 'What output values can $4 - x^2$ produce?',
      solution:
        'The notation $f : \\mathbb{R} \\to \\mathbb{R}$ says that inputs and outputs are real numbers ($\\mathbb{R}$ means all the real numbers). The **image** of $f$ is the set of outputs that actually occur. It is another word for the range.\n\n' +
        '$x^2$ is never negative: it is 0 when $x = 0$, and positive for every other $x$.\n\n' +
        '$f(x) = 4 - x^2$ starts at 4 and takes away $x^2$. Taking away 0 gives the highest output: $f(0) = 4$.\n\n' +
        'For any other $x$ we subtract something positive, so the output is below 4. There is no lower limit, because $x^2$ can be huge: $f(10) = 4 - 100 = -96$. So the outputs are 4 and everything below it: $f(x) \\le 4$.',
      conclusion: 'The highest output is 4 and nothing above it is reached, so the image is $f(x) \\le 4$.',
      whyWrong: [
        null,
        'This flips the inequality. Subtracting $x^2$ can only lower the value below $4$: for example $f(3) = -5$.',
        'This mixes up an input with an output. $x = 2$ is the input where $f(x) = 0$; the largest output is $f(0) = 4$.',
        'The $\\mathbb{R}$ after the arrow only says that outputs are real numbers. Not every real number is reached: nothing above $4$ is an output.',
      ],
      keyIdea: 'For $c - x^2$, use $x^2 \\ge 0$: subtracting it can only lower the value from $c$, so the image is $f(x) \\le c$. The $\\mathbb{R}$ after the arrow doesn\'t mean every real number is reached.',
    },
    check: {
      optionValues: ['at most 4', 'at least 4', 'at most 2', 'all'],
      compute: () => {
        const ys = GRID.map((x) => 4 - x * x);
        const top = Math.max(...ys);
        return top === 4 && Math.min(...ys) < 4 ? 'at most 4' : 'other';
      },
    },
  },];
