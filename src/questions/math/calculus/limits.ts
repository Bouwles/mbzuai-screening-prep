import type { StaticQuestion } from '../../../types';

// Numeric helpers for the answer checks (independent of the worked solutions).
/** Two-sided numerical limit at a: average of the values just left and just right of a. */
const near = (f: (x: number) => number, a: number, h = 1e-6): number => (f(a + h) + f(a - h)) / 2;
/** Value just to the right of a. */
const rightOf = (f: (x: number) => number, a: number): number => f(a + 1e-9);
/** Value just to the left of a. */
const leftOf = (f: (x: number) => number, a: number): number => f(a - 1e-9);
/** Central-difference derivative. */
const deriv = (f: (x: number) => number, a: number, h = 1e-5): number => (f(a + h) - f(a - h)) / (2 * h);

export const questions: StaticQuestion[] = [
  {
    id: 'limits-001',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'Find $\\lim_{x \\to 3} (x^2 + 2x - 1)$.',
    options: ['$11$', '$15$', '$14$', '$16$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What value does this expression get close to when $x$ gets close to 3?',
      solution:
        'A **limit** asks what value an expression approaches as $x$ approaches a number. Here, $\\lim_{x \\to 3}$ means $x$ is getting closer and closer to 3.\n\n' +
        'This expression is a **polynomial**: just powers of $x$ added and subtracted. There is no fraction that could break, so its value near 3 is the same as its value at 3. That means we can put $x = 3$ straight in.\n\n' +
        'Work out each term. $x^2$ becomes $3^2 = 9$. $2x$ becomes $2 \\times 3 = 6$. The $-1$ stays as it is.\n\n' +
        'Add them up: $9 + 6 - 1 = 14$.',
      conclusion: 'Putting in $x = 3$ causes no problems and gives 14, so the limit is $14$.',
      whyWrong: [
        '$11$ comes from working out $3^2$ as $3 \\times 2 = 6$ instead of $3 \\times 3 = 9$: $6 + 6 - 1 = 11$.',
        '$15$ is $9 + 6$ with the $-1$ forgotten. Every term must be substituted.',
        null,
        '$16$ comes from a sign slip: adding the last term instead of subtracting it ($9 + 6 + 1$).',
      ],
      keyIdea: 'Always try substituting the value first. If you get an ordinary number, with no division by 0, that number is the limit. For a polynomial this always works.',
    },
    check: {
      optionValues: [11, 15, 14, 16],
      compute: () => near((x) => x * x + 2 * x - 1, 3),
    },
  },
  {
    id: 'limits-002',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'Find $\\lim_{x \\to 3} \\dfrac{x^2 - 9}{x - 3}$.',
    options: ['$6$', '$0$', '$1$', 'The limit does not exist'],
    correctIndex: 0,
    markScheme: {
      asking: 'What value does this fraction get close to when $x$ gets close to 3?',
      solution:
        'Try putting in $x = 3$ first. The top is $3^2 - 9 = 0$ and the bottom is $3 - 3 = 0$. That gives $\\frac{0}{0}$, which is not a number, so we need another way.\n\n' +
        'A limit only uses values of $x$ **near** 3, never 3 itself. So $x - 3$ is never exactly 0, which means we are allowed to cancel it if it appears on both top and bottom.\n\n' +
        'Factorise the top. $x^2 - 9$ is a **difference of two squares**, which follows the pattern $a^2 - b^2 = (a - b)(a + b)$. With $a = x$ and $b = 3$, we get $x^2 - 9 = (x - 3)(x + 3)$.\n\n' +
        'Cancel the matching bracket:\n\n$$\\frac{(x - 3)(x + 3)}{x - 3} = x + 3$$\n\n' +
        'The zero on the bottom has gone, so now we can substitute $x = 3$: $3 + 3 = 6$.',
      conclusion: 'Near $x = 3$ the fraction behaves exactly like $x + 3$, and that approaches $6$.',
      whyWrong: [
        null,
        'This uses only the top: $3^2 - 9 = 0$, then calls the answer 0. But the bottom is also 0, and $\\frac{0}{0}$ is not 0.',
        'This treats $\\frac{0}{0}$ as 1 (as if $\\frac{a}{a} = 1$ worked for $a = 0$). $\\frac{0}{0}$ is indeterminate: factorise and cancel first.',
        'Getting $\\frac{0}{0}$ does not mean the limit fails to exist. It means the expression needs simplifying; after cancelling $(x - 3)$ the limit is an ordinary number.',
      ],
      keyIdea: 'If substituting $x = a$ gives $\\frac{0}{0}$, then $(x - a)$ is a factor of both top and bottom. Factorise, cancel it, and substitute again.',
    },
    check: {
      optionValues: [6, 0, 1, null],
      compute: () => near((x) => (x * x - 9) / (x - 3), 3),
    },
  },
  {
    id: 'limits-003',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'Find $\\lim_{x \\to \\infty} \\dfrac{3x^2 + 5}{6x^2 - x}$.',
    options: ['$2$', '$0$', '$\\infty$', '$\\frac{1}{2}$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What value does this fraction settle on as $x$ grows without end?',
      solution:
        '$x \\to \\infty$ means $x$ keeps getting bigger with no end. Top and bottom both grow huge, so we can\'t just put a number in.\n\n' +
        'The trick is to divide every term, top and bottom, by the highest power on the bottom, which is $x^2$. Doing the same to top and bottom leaves the fraction\'s value unchanged:\n\n$$\\frac{3x^2 + 5}{6x^2 - x} = \\frac{3 + \\frac{5}{x^2}}{6 - \\frac{1}{x}}$$\n\n' +
        'When $x$ is huge, a number divided by $x$ or $x^2$ is tiny. So $\\frac{5}{x^2}$ and $\\frac{1}{x}$ both shrink towards 0 and can be ignored.\n\n' +
        'That leaves just $\\frac{3}{6}$, which simplifies to $\\frac{1}{2}$.',
      conclusion: 'Top and bottom both have $x^2$ as their highest power, so only the numbers in front of $x^2$ count, giving $\\frac{1}{2}$.',
      whyWrong: [
        '$2$ is the ratio upside down: $\\frac{6}{3}$. Divide the top coefficient by the bottom coefficient: $\\frac{3}{6}$.',
        '$0$ comes from thinking every term "disappears" as $x$ gets huge. Only terms like $\\frac{5}{x^2}$ and $\\frac{1}{x}$ go to 0 after dividing by $x^2$; the leading terms leave $\\frac{3}{6}$.',
        'Top and bottom both grow without bound, but at the same rate (both are $x^2$ terms), so their ratio settles to a finite number, not $\\infty$.',
        null,
      ],
      keyIdea: 'For $x \\to \\infty$ with powers on top and bottom, compare the highest powers. Same power: the limit is the ratio of the numbers in front. Bottom higher: 0. Top higher: it grows without end.',
    },
    check: {
      optionValues: [2, 0, null, 0.5],
      compute: () => ((x: number) => (3 * x * x + 5) / (6 * x * x - x))(1e7),
    },
  },
  {
    id: 'limits-004',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'With $x$ measured in **radians**, what is $\\lim_{x \\to 0} \\dfrac{\\sin x}{x}$?',
    options: ['$0$', '$1$', 'The limit does not exist', '$\\frac{\\pi}{180}$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What value does $\\sin x$ divided by $x$ get close to as $x$ shrinks to 0?',
      solution:
        'Putting in $x = 0$ gives $\\frac{\\sin 0}{0} = \\frac{0}{0}$, which is not a number. So we have to look at values of $x$ close to 0 instead.\n\n' +
        'Try some small values, with a calculator set to radians:\n\n| $x$ | $\\sin x$ | $\\frac{\\sin x}{x}$ |\n|---|---|---|\n| 0.5 | 0.47943 | 0.95885 |\n| 0.1 | 0.09983 | 0.99833 |\n| 0.01 | 0.0099998 | 0.99998 |\n\n' +
        'Negative values of $x$ give the same results, because top and bottom both change sign. So from both sides the fraction closes in on 1. This is a standard result worth knowing: $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$.',
      conclusion: 'For very small angles in radians, $\\sin x$ is almost exactly $x$, so the fraction is almost exactly $1$.',
      whyWrong: [
        '$0$ comes from looking only at the top ($\\sin 0 = 0$). The bottom is also heading to 0, so the fraction is $\\frac{0}{0}$, which needs more thought.',
        null,
        'A $\\frac{0}{0}$ form does not mean the limit fails to exist. The values of $\\frac{\\sin x}{x}$ clearly settle on one number as $x \\to 0$ from either side.',
        '$\\frac{\\pi}{180}$ is the limit if $x$ is measured in **degrees** (a calculator left in degree mode). The standard result $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$ is for radians.',
      ],
      keyIdea: 'Spot $\\sin$ of something small divided by that same something, in radians: the limit is 1. It comes from $\\sin x \\approx x$ for small $x$. In degrees the result changes, so it needs radians.',
    },
    check: {
      optionValues: [0, 1, null, Math.PI / 180],
      compute: () => near((x) => Math.sin(x) / x, 0),
    },
  },
  {
    id: 'limits-005',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'Let $f(x) = \\dfrac{|x|}{x}$ for $x \\ne 0$. What is the **right-hand limit** $\\lim_{x \\to 0^{+}} f(x)$?',
    options: ['$1$', '$-1$', '$0$', 'The limit does not exist'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does $\\frac{|x|}{x}$ get close to when $x$ comes towards 0 from the positive side?',
      solution:
        '$x \\to 0^{+}$ means $x$ approaches 0 from the **right**. So we only use positive values, such as 0.1 and 0.01.\n\n' +
        '$|x|$ is the **absolute value** of $x$: its size, ignoring any minus sign. So $|0.1| = 0.1$ and $|-0.1| = 0.1$. For a positive $x$, $|x|$ is just $x$.\n\n' +
        'So for positive $x$, the function is $\\frac{x}{x}$. The top and bottom are the same non-zero number, so the value is 1 every time. For example, $\\frac{0.01}{0.01} = 1$.',
      conclusion: 'Every value just to the right of 0 gives exactly 1, so the right-hand limit is $1$.',
      whyWrong: [
        null,
        '$-1$ is the **left**-hand limit (values like $x = -0.01$, where $|x| = -x$). The $0^{+}$ means approaching from the right, through positive $x$.',
        '$0$ comes from substituting $x = 0$ as if $\\frac{|0|}{0}$ were 0. The function is not even defined at 0; a limit looks at values **near** 0, which are all 1 on the right.',
        'The **two-sided** limit does not exist because the left and right limits differ, but the question asks only for the right-hand limit, which is 1.',
      ],
      keyIdea: 'With $|x|$ in a limit, treat each side separately. For $x > 0$ replace $|x|$ with $x$, and for $x < 0$ replace it with $-x$. Then simplify. The label $0^{+}$ means the right side and $0^{-}$ the left.',
    },
    check: {
      optionValues: [1, -1, 0, null],
      compute: () => rightOf((x) => Math.abs(x) / x, 0),
    },
  },
  {
    id: 'limits-006',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Find $\\lim_{x \\to 1} \\dfrac{x^2 + 3x - 4}{x^2 - 1}$.',
    options: ['$1$', '$5$', '$\\frac{5}{2}$', '$0$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What value does this fraction get close to when $x$ gets close to 1?',
      solution:
        'Try $x = 1$ first. The top is $1 + 3 - 4 = 0$ and the bottom is $1 - 1 = 0$. We get $\\frac{0}{0}$, so we must simplify. Both being 0 at $x = 1$ tells us $(x - 1)$ is a factor of each.\n\n' +
        'Factorise the top. We need two numbers that multiply to $-4$ and add to $3$. Those are $4$ and $-1$, so $x^2 + 3x - 4 = (x + 4)(x - 1)$.\n\n' +
        'Factorise the bottom. It is a difference of two squares, $a^2 - b^2 = (a - b)(a + b)$, so $x^2 - 1 = (x - 1)(x + 1)$.\n\n' +
        'A limit only uses $x$ near 1, never 1 itself, so $x - 1$ is not 0 and we can cancel it:\n\n$$\\frac{(x + 4)(x - 1)}{(x - 1)(x + 1)} = \\frac{x + 4}{x + 1}$$\n\n' +
        'Now the bottom is not 0, so substitute $x = 1$: $\\frac{1 + 4}{1 + 1} = \\frac{5}{2}$.',
      conclusion: 'After cancelling, nothing goes wrong at $x = 1$, and the fraction equals $\\frac{5}{2}$ there.',
      whyWrong: [
        '$1$ is the ratio of the $x^2$ coefficients. That shortcut is for limits as $x \\to \\infty$, not as $x \\to 1$.',
        '$5$ comes from factorising the top correctly but cancelling the whole denominator, as if $x^2 - 1$ were just $(x - 1)$. In fact $x^2 - 1 = (x - 1)(x + 1)$, so a factor $(x + 1) \\to 2$ is left on the bottom.',
        null,
        '$0$ looks only at the numerator, which is 0 at $x = 1$. The denominator is also 0, so $\\frac{0}{0}$ needs factorising, not a quick answer.',
      ],
      keyIdea: 'A fraction giving $\\frac{0}{0}$ at $x = a$: factorise top and bottom, cancel $(x - a)$, then substitute $x = a$ again. If you still get $\\frac{0}{0}$, there is another factor to cancel.',
    },
    check: {
      optionValues: [1, 5, 2.5, 0],
      compute: () => near((x) => (x * x + 3 * x - 4) / (x * x - 1), 1),
    },
  },
  {
    id: 'limits-007',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Find $\\lim_{x \\to 4} \\dfrac{\\sqrt{x} - 2}{x - 4}$.',
    options: ['$\\frac{1}{6}$', '$\\frac{1}{4}$', '$\\frac{1}{2}$', '$0$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What value does this fraction with a square root get close to when $x$ gets close to 4?',
      solution:
        'Try $x = 4$ first. The top is $\\sqrt{4} - 2 = 0$ and the bottom is $4 - 4 = 0$. We get $\\frac{0}{0}$, so we must simplify.\n\n' +
        'Any positive $x$ can be written as $(\\sqrt{x})^2$. That makes the bottom a difference of two squares, the pattern $a^2 - b^2 = (a - b)(a + b)$: $x - 4 = (\\sqrt{x})^2 - 2^2 = (\\sqrt{x} - 2)(\\sqrt{x} + 2)$.\n\n' +
        'Now the same bracket is on top and bottom. It isn\'t 0 near $x = 4$, so we can cancel it. A 1 stays on top, because the top was only that bracket:\n\n$$\\frac{\\sqrt{x} - 2}{(\\sqrt{x} - 2)(\\sqrt{x} + 2)} = \\frac{1}{\\sqrt{x} + 2}$$\n\n' +
        'Now substitute $x = 4$: $\\frac{1}{\\sqrt{4} + 2} = \\frac{1}{2 + 2} = \\frac{1}{4}$.',
      conclusion: 'With the zero bracket cancelled, the fraction becomes $\\frac{1}{\\sqrt{x} + 2}$, which equals $\\frac{1}{4}$ at $x = 4$.',
      whyWrong: [
        '$\\frac{1}{6}$ comes from simplifying correctly to $\\frac{1}{\\sqrt{x} + 2}$ but then substituting $4$ instead of $\\sqrt{4} = 2$: $\\frac{1}{4 + 2}$.',
        null,
        '$\\frac{1}{2}$ comes from cancelling to $\\frac{1}{\\sqrt{x}}$ (forgetting the $+2$ in the factor $\\sqrt{x} + 2$) and substituting: $\\frac{1}{\\sqrt{4}} = \\frac{1}{2}$.',
        '$0$ uses only the numerator, $\\sqrt{4} - 2 = 0$. The denominator is also 0, so the form $\\frac{0}{0}$ must be simplified first.',
      ],
      keyIdea: 'A square root giving $\\frac{0}{0}$: write $x - a^2$ as $(\\sqrt{x} - a)(\\sqrt{x} + a)$ and cancel. If that factor isn\'t visible, multiply top and bottom by the root with the opposite sign, such as $\\sqrt{x} + a$.',
    },
    check: {
      optionValues: [1 / 6, 1 / 4, 1 / 2, 0],
      compute: () => near((x) => (Math.sqrt(x) - 2) / (x - 4), 4),
    },
  },
  {
    id: 'limits-008',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Find $\\lim_{x \\to \\infty} \\dfrac{4x^2 + 7x}{2x^3 - 1}$.',
    options: ['$2$', '$\\frac{1}{2}$', '$\\infty$', '$0$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What does this fraction head towards as $x$ grows without end?',
      solution:
        '$x \\to \\infty$ means $x$ grows without end. To compare how fast top and bottom grow, divide every term by the highest power on the bottom, which is $x^3$.\n\n' +
        'Each term simplifies: $\\frac{4x^2}{x^3} = \\frac{4}{x}$, then $\\frac{7x}{x^3} = \\frac{7}{x^2}$, then $\\frac{2x^3}{x^3} = 2$. So the fraction becomes:\n\n$$\\frac{\\frac{4}{x} + \\frac{7}{x^2}}{2 - \\frac{1}{x^3}}$$\n\n' +
        'When $x$ is huge, a number divided by a power of $x$ is tiny. So $\\frac{4}{x}$, $\\frac{7}{x^2}$ and $\\frac{1}{x^3}$ all shrink towards 0.\n\n' +
        'The whole top shrinks towards 0, while the bottom settles on 2. And 0 divided by 2 is 0.',
      conclusion: 'The bottom has the higher power, $x^3$ against $x^2$, so it outgrows the top and the fraction shrinks to $0$.',
      whyWrong: [
        '$2$ is $\\frac{4}{2}$, the ratio of the leading coefficients. That shortcut only works when the top and bottom have the **same** degree; here the bottom has $x^3$ and the top only $x^2$.',
        '$\\frac{1}{2}$ is $\\frac{2}{4}$: the coefficients divided the wrong way round, and it also ignores that the degrees are different.',
        'The top does grow without bound, but the bottom grows faster ($x^3$ beats $x^2$), so the fraction shrinks towards 0 instead of blowing up.',
        null,
      ],
      keyIdea: 'For $x \\to \\infty$, compare the highest powers. Bottom higher: the limit is 0. Same: the ratio of the numbers in front. Top higher: it grows without end. To confirm, divide every term by the bottom\'s highest power.',
    },
    check: {
      optionValues: [2, 0.5, null, 0],
      compute: () => ((x: number) => (4 * x * x + 7 * x) / (2 * x ** 3 - 1))(1e8),
    },
  },
  {
    id: 'limits-009',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'With $x$ in radians, find $\\lim_{x \\to 0} \\dfrac{\\sin(3x)}{5x}$.',
    options: ['$\\frac{3}{5}$', '$1$', '$\\frac{5}{3}$', '$0$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does $\\sin(3x)$ divided by $5x$ get close to as $x$ shrinks to 0?',
      solution:
        'Try $x = 0$ first. The top is $\\sin 0 = 0$ and the bottom is $5 \\times 0 = 0$. We get $\\frac{0}{0}$, so we need a known result.\n\n' +
        'The standard result is $\\frac{\\sin u}{u} \\to 1$ as $u \\to 0$, with $u$ in radians. It needs the bottom to match exactly what is inside the sine.\n\n' +
        'Inside the sine is $3x$, but the bottom is $5x$. To make a match, split the fraction into two. Multiplying these back together cancels the $3x$, so the value is unchanged:\n\n$$\\frac{\\sin(3x)}{5x} = \\frac{\\sin(3x)}{3x} \\times \\frac{3x}{5x}$$\n\n' +
        'As $x \\to 0$, $3x \\to 0$ too, so the first fraction tends to 1 (with $u = 3x$). In the second, the $x$ cancels and leaves a plain number. The limit is $1 \\times \\frac{3}{5} = \\frac{3}{5}$.',
      conclusion: 'For small $x$, $\\sin(3x)$ is almost $3x$, so the fraction is almost $\\frac{3x}{5x}$, which is $\\frac{3}{5}$.',
      whyWrong: [
        null,
        '$1$ applies $\\frac{\\sin u}{u} \\to 1$ without matching the bottom to the inside of the sine. The bottom is $5x$, not $3x$, so a factor $\\frac{3}{5}$ is left over.',
        '$\\frac{5}{3}$ has the correction factor upside down. Since $\\sin(3x) \\approx 3x$ for small $x$, the fraction is close to $\\frac{3x}{5x}$, not $\\frac{5x}{3x}$.',
        '$0$ looks only at the top, $\\sin 0 = 0$. The bottom is also 0, so this is a $\\frac{0}{0}$ form that needs the standard limit.',
      ],
      keyIdea: 'For $\\frac{\\sin(ax)}{bx}$ as $x \\to 0$ in radians, the limit is $\\frac{a}{b}$. Replace $\\sin(ax)$ by $ax$, because the two are almost equal for small $x$, then cancel the $x$.',
    },
    check: {
      optionValues: [3 / 5, 1, 5 / 3, 0],
      compute: () => near((x) => Math.sin(3 * x) / (5 * x), 0),
    },
  },
  {
    id: 'limits-010',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Find $\\lim_{n \\to \\infty} \\left(1 + \\frac{2}{n}\\right)^{n}$.',
    options: ['$1$', '$e$', '$e^2$', '$2e$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What number does this expression settle on as $n$ grows without end?',
      solution:
        'As $n$ grows, the bracket gets closer to 1, but the power gets bigger. These pull in opposite ways: a number just above 1, raised to a huge power. So we can\'t simply say the answer is 1.\n\n' +
        'A standard result defines the number $e$, which is about 2.718:\n\n$$\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^{n} = e$$\n\n' +
        'Ours has $\\frac{2}{n}$ instead of $\\frac{1}{n}$. To make it match, let $m = \\frac{n}{2}$. Then $n = 2m$ and $\\frac{2}{n} = \\frac{1}{m}$. As $n$ grows without end, so does $m$.\n\n' +
        'Rewrite the expression using $m$. The power rule $a^{2m} = (a^{m})^{2}$ then pulls out the part we recognise:\n\n$$\\left(1 + \\frac{2}{n}\\right)^{n} = \\left(1 + \\frac{1}{m}\\right)^{2m} = \\left[\\left(1 + \\frac{1}{m}\\right)^{m}\\right]^{2}$$\n\n' +
        'The inside of the square bracket tends to $e$ by the standard result. So the whole expression tends to $e$ squared, which is $e^2$.',
      conclusion: 'Replacing $\\frac{2}{n}$ with $\\frac{1}{m}$ turned the expression into the square of the limit for $e$, so the answer is $e^2$.',
      whyWrong: [
        '$1$ comes from saying $\\frac{2}{n} \\to 0$, so the bracket is 1 and $1^{n} = 1$. But the power $n$ grows at the same time as the bracket shrinks to 1; this "$1^{\\infty}$" form is indeterminate, and the true value is $e^2$.',
        '$e$ is the limit of $\\left(1 + \\frac{1}{n}\\right)^{n}$. With $\\frac{2}{n}$ inside, the limit becomes $e^{2}$, not $e$.',
        null,
        '$2e$ multiplies by 2 instead of raising to the power 2. The rule is $\\left(1 + \\frac{k}{n}\\right)^{n} \\to e^{k}$, and $e^2 \\approx 7.39$ while $2e \\approx 5.44$.',
      ],
      keyIdea: 'Spot a bracket $1 + \\frac{k}{n}$ raised to the power $n$, with $n \\to \\infty$. The limit is $e^{k}$. The reason: substitute $m = \\frac{n}{k}$ and the expression becomes $\\left[\\left(1 + \\frac{1}{m}\\right)^{m}\\right]^{k}$.',
    },
    check: {
      optionValues: [1, Math.E, Math.E ** 2, 2 * Math.E],
      compute: () => {
        const n = 1e9;
        return Math.exp(n * Math.log1p(2 / n));
      },
    },
  },
  {
    id: 'limits-011',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Evaluate $\\lim_{h \\to 0} \\dfrac{(3 + h)^2 - 9}{h}$.',
    options: ['$9$', '$6$', '$0$', '$3$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What value does this fraction get close to as $h$ shrinks to 0?',
      solution:
        'Try $h = 0$ first. The top is $3^2 - 9 = 0$ and the bottom is 0. We get $\\frac{0}{0}$, so we must simplify.\n\n' +
        'Expand the bracket. $(3 + h)^2$ means $(3 + h)(3 + h)$, which multiplies out to $9 + 3h + 3h + h^2$. Collecting the middle terms gives $9 + 6h + h^2$.\n\n' +
        'Subtract the 9. The top becomes $9 + 6h + h^2 - 9 = 6h + h^2$.\n\n' +
        'Both terms on top contain $h$, so take it out as a factor. Since $h$ is near 0 but not 0, we can cancel it with the bottom:\n\n$$\\frac{6h + h^2}{h} = \\frac{h(6 + h)}{h} = 6 + h$$\n\n' +
        'As $h \\to 0$, the $h$ shrinks away, and $6 + h$ settles on 6.',
      conclusion: 'The fraction simplifies to $6 + h$, which approaches $6$ as $h$ shrinks to 0.',
      whyWrong: [
        '$9$ is $f(3) = 3^2$, the value of the function, not the limit of the difference quotient (which measures the gradient).',
        null,
        '$0$ comes from expanding $(3 + h)^2$ as $9 + h^2$ (forgetting the middle term $6h$): then the quotient is $\\frac{h^2}{h} = h \\to 0$.',
        '$3$ comes from expanding $(3 + h)^2$ as $9 + 3h + h^2$, missing the doubling of the middle term. Correctly, $(3 + h)^2 = 9 + 2(3)(h) + h^2 = 9 + 6h + h^2$.',
      ],
      keyIdea: '$\\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}$ is the gradient of $f$ at $x = a$. Either expand the top, cancel $h$ and let $h \\to 0$, or differentiate $f$ and substitute $a$.',
    },
    check: {
      optionValues: [9, 6, 0, 3],
      compute: () => near((h) => ((3 + h) ** 2 - 9) / h, 0),
    },
  },
  {
    id: 'limits-012',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'With angles in radians, what is the value of $\\lim_{h \\to 0} \\dfrac{\\sin\\left(\\frac{\\pi}{3} + h\\right) - \\sin\\left(\\frac{\\pi}{3}\\right)}{h}$?',
    options: ['$\\frac{\\sqrt{3}}{2}$', '$0$', '$-\\frac{1}{2}$', '$\\frac{1}{2}$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What value does this fraction get close to as $h$ shrinks to 0?',
      solution:
        'Putting in $h = 0$ makes the top $\\sin\\frac{\\pi}{3} - \\sin\\frac{\\pi}{3} = 0$ and the bottom 0. So we get $\\frac{0}{0}$, and we can\'t read off the value directly.\n\n' +
        'Look at the shape instead. The **derivative** of $f$ at a point $a$, meaning its gradient there, is defined by exactly this kind of limit:\n\n$$f\'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}$$\n\n' +
        'Match the two. Our limit has $f(x) = \\sin x$ and $a = \\frac{\\pi}{3}$. So it is the derivative of $\\sin x$ at $x = \\frac{\\pi}{3}$.\n\n' +
        'The derivative of $\\sin x$ is $\\cos x$, when $x$ is in radians. So we need $\\cos\\left(\\frac{\\pi}{3}\\right)$.\n\n' +
        'An angle of $\\frac{\\pi}{3}$ radians is $60^{\\circ}$, and $\\cos 60^{\\circ} = \\frac{1}{2}$.',
      conclusion: 'The limit is the gradient of $\\sin x$ at $\\frac{\\pi}{3}$, which is $\\cos\\left(\\frac{\\pi}{3}\\right) = \\frac{1}{2}$.',
      whyWrong: [
        '$\\frac{\\sqrt{3}}{2}$ is $\\sin\\left(\\frac{\\pi}{3}\\right)$, the value of the function at the point. The limit asks for the **rate of change** (derivative), which is $\\cos\\left(\\frac{\\pi}{3}\\right)$.',
        '$0$ comes from putting $h = 0$ in the numerator only. The denominator is also 0, so this is a $\\frac{0}{0}$ form; it is the derivative in disguise.',
        '$-\\frac{1}{2}$ uses the wrong derivative, $\\frac{d}{dx} \\sin x = -\\cos x$. The minus sign belongs to the derivative of $\\cos x$, not $\\sin x$.',
        null,
      ],
      keyIdea: 'If a limit looks like $\\frac{f(a + h) - f(a)}{h}$ as $h \\to 0$, it is the derivative $f\'(a)$. Name $f$ and $a$, differentiate $f$, then substitute $a$. There is no need to expand anything.',
    },
    check: {
      optionValues: [Math.sqrt(3) / 2, 0, -0.5, 0.5],
      compute: () => deriv(Math.sin, Math.PI / 3),
    },
  },
  {
    id: 'limits-013',
    subtopic: 'limits',
    difficulty: 'exam',
    stem:
      'A function is defined by\n\n' +
      '$$f(x) = \\begin{cases} x^2 + 1, & x < 2 \\\\ 3x - k, & x \\ge 2 \\end{cases}$$\n\n' +
      'For which value of $k$ does $\\lim_{x \\to 2} f(x)$ exist?',
    options: ['$k = 1$', '$k = -1$', '$k = 5$', '$k = 11$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What must $k$ be so that the two pieces of $f$ head to the same value at $x = 2$?',
      solution:
        'A two-sided limit exists only when the left side and the right side approach the same value. So we find what each piece approaches at $x = 2$.\n\n' +
        '**From the left**, $x$ is just below 2, so we use the piece for $x < 2$, which is $x^2 + 1$. Substituting gives $2^2 + 1 = 5$.\n\n' +
        '**From the right**, $x$ is just above 2, so we use the piece for $x \\ge 2$, which is $3x - k$. Substituting gives $3 \\times 2 - k = 6 - k$.\n\n' +
        'The two sides must match, so set them equal: $6 - k = 5$.\n\n' +
        'Solve for $k$. Add $k$ to both sides: $6 = 5 + k$. Then take 5 from both sides: $k = 1$.',
      conclusion: 'With $k = 1$ the right side gives $6 - 1 = 5$, the same as the left side, so the limit exists.',
      whyWrong: [
        null,
        '$k = -1$ comes from reaching $-k = -1$ and forgetting to divide both sides by $-1$. Check: $6 - (-1) = 7$, which is not 5.',
        '$k = 5$ sets $k$ equal to the left-hand limit itself, instead of making the right-hand limit $6 - k$ equal to 5.',
        '$k = 11$ comes from rearranging $6 - k = 5$ as $k = 6 + 5$ (treating the piece as $k - 6$). The correct rearrangement is $k = 6 - 5 = 1$.',
      ],
      keyIdea: 'For a function made of pieces, substitute the meeting point into each piece to get the left and right limits. Set them equal, then solve for the unknown.',
    },
    check: {
      optionValues: [1, -1, 5, 11],
      compute: () => {
        const left = leftOf((x) => x * x + 1, 2);
        for (let k = -20; k <= 20; k++) if (Math.abs(rightOf((x) => 3 * x - k, 2) - left) < 1e-6) return k;
        return NaN;
      },
    },
  },
  // ------------------------------------------------------------------ recall and short calculations
  {
    id: 'limits-019',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'What is $\\lim_{x \\to \\infty} \\frac{1}{x}$?',
    options: ['$0$', '$1$', '$\\infty$', 'The limit does not exist'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does $\\frac{1}{x}$ get close to as $x$ grows without end?',
      solution:
        '$x \\to \\infty$ means $x$ keeps growing with no end. Watch what happens to $\\frac{1}{x}$ as it grows:\n\n| $x$ | $\\frac{1}{x}$ |\n|---|---|\n| 10 | 0.1 |\n| 1000 | 0.001 |\n| 1000000 | 0.000001 |\n\n' +
        'The value keeps shrinking, and a big enough $x$ gets it as close to 0 as you like. It never actually reaches 0, but a limit only asks what value is being approached. So the limit is 0.',
      conclusion: 'One divided by a bigger and bigger number shrinks towards nothing, so the limit is $0$.',
      whyWrong: [
        null,
        'This looks only at the top of the fraction. The bottom keeps growing, so the fraction shrinks well below $1$.',
        'This looks only at the bottom, which grows without bound. The fraction itself shrinks towards $0$.',
        'The values settle towards one number, so the limit exists, even though $\\frac{1}{x}$ never actually equals $0$.',
      ],
      keyIdea: 'As $x \\to \\infty$, any fixed number divided by a growing power of $x$ tends to 0. So $\\frac{5}{x}$ and $\\frac{3}{x^2}$ both tend to 0. Use this to remove terms in harder limits.',
    },
    check: {
      optionValues: [0, 1, null, null],
      compute: () => 1 / 1e9,
    },
  },
  {
    id: 'limits-020',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'Substituting into a limit gives $\\frac{0}{0}$. What does this tell you?',
    options: ['The form is indeterminate, so simplify first', 'The limit is $0$', 'The limit is $1$', 'The limit does not exist'],
    correctIndex: 0,
    markScheme: {
      asking: 'What should you conclude, and do next, when substituting into a limit gives $\\frac{0}{0}$?',
      solution:
        'Getting $\\frac{0}{0}$ means the top and bottom are both shrinking to 0. What the fraction approaches depends on how fast each one shrinks, so $\\frac{0}{0}$ can\'t tell us the value.\n\n' +
        'Here are two examples at the point where they give $\\frac{0}{0}$. $\\frac{x^2 - 9}{x - 3}$ at $x = 3$ simplifies to $x + 3$, with limit 6. $\\frac{2x}{x}$ at $x = 0$ simplifies to 2, with limit 2. Same form, different limits.\n\n' +
        'A form like this, which doesn\'t decide the limit, is called **indeterminate**. The way forward is to simplify the expression, then substitute again.',
      conclusion: '$\\frac{0}{0}$ could turn out to be almost any value, so the right response is: the form is indeterminate, so simplify first.',
      whyWrong: [
        null,
        'This looks only at the top. The bottom is also $0$, so the fraction is not simply $0$.',
        'This uses $\\frac{a}{a} = 1$, which only works when $a$ is not $0$.',
        'A limit of this form often does exist. Giving up here misses that the expression can be simplified.',
      ],
      keyIdea: 'Substitute first. An ordinary number is the limit. For $\\frac{0}{0}$, try factorising and cancelling, using a standard limit, or spotting a derivative, then substitute again.',
    },
  },
  {
    id: 'limits-021',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'When does the two-sided limit $\\lim_{x \\to a} f(x)$ exist?',
    options: ['When both one-sided limits exist and are equal', 'When $f(a) = 0$', 'When $f(a)$ is defined', 'When at least one one-sided limit exists'],
    correctIndex: 0,
    markScheme: {
      asking: 'What has to be true for a limit from both sides to exist at a point?',
      solution:
        'A **one-sided limit** looks from one direction only. $\\lim_{x \\to a^{-}} f(x)$ uses $x$ values just below $a$, and $\\lim_{x \\to a^{+}} f(x)$ uses $x$ values just above $a$.\n\n' +
        'The **two-sided limit** $\\lim_{x \\to a} f(x)$ asks for one single value that $f(x)$ approaches from both directions. The value of $f$ at $a$ itself plays no part.\n\n' +
        'So each direction must have a limit, and those two limits must agree. For example, $\\frac{|x|}{x}$ approaches $-1$ on the left of 0 and $1$ on the right, so it has no two-sided limit at 0.',
      conclusion: 'One single value is only possible if the two directions match, so the limit exists when both one-sided limits exist and are equal.',
      whyWrong: [
        null,
        'The value of the function at $a$ does not decide the limit, and the limit need not be $0$.',
        'A limit depends on values **near** $a$, not at $a$. For example, $\\frac{x^2 - 9}{x - 3}$ is not defined at $x = 3$, yet its limit there is $6$.',
        'One side is not enough. For $\\frac{|x|}{x}$ at $0$ the one-sided limits are $-1$ and $1$, so there is no two-sided limit.',
      ],
      keyIdea: 'To test a two-sided limit at a point, find the left-hand and right-hand limits separately and compare them. Equal means the limit exists with that value. Different means no limit. Ignore $f(a)$.',
    },
  },
  {
    id: 'limits-022',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Find $\\lim_{x \\to 2} \\dfrac{x^2 - 5x + 6}{x - 2}$.',
    options: ['$-1$', '$5$', '$0$', '$-3$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What value does this fraction get close to when $x$ gets close to 2?',
      solution:
        'Try $x = 2$ first. The top is $4 - 10 + 6 = 0$ and the bottom is $2 - 2 = 0$. We get $\\frac{0}{0}$, so we must simplify. The top being 0 at $x = 2$ tells us $(x - 2)$ is a factor of it.\n\n' +
        'Factorise the top. We need two numbers that multiply to $6$ and add to $-5$. Those are $-2$ and $-3$, so $x^2 - 5x + 6 = (x - 2)(x - 3)$.\n\n' +
        'A limit only uses $x$ near 2, never 2 itself, so $x - 2$ is not 0 and we can cancel it:\n\n$$\\frac{(x - 2)(x - 3)}{x - 2} = x - 3$$\n\n' +
        'Now substitute $x = 2$: $2 - 3 = -1$.',
      conclusion: 'Near $x = 2$ the fraction behaves exactly like $x - 3$, which approaches $-1$.',
      whyWrong: [
        null,
        'This factorises with a sign slip, as $(x - 2)(x + 3)$, and gets $2 + 3$. But $(x - 2)(x + 3)$ expands to $x^2 + x - 6$.',
        'This looks only at the top, which is $0$ at $x = 2$. The bottom is also $0$, so simplify first.',
        'This cancels correctly to $x - 3$ but then keeps only the $-3$. You still have to substitute $x = 2$.',
      ],
      keyIdea: 'Quadratic over a bracket, giving $\\frac{0}{0}$: that bracket is a factor of the top. Find two numbers that multiply to the constant and add to the $x$ coefficient, cancel the bracket, then substitute.',
    },
    check: {
      optionValues: [-1, 5, 0, -3],
      compute: () => near((x) => (x * x - 5 * x + 6) / (x - 2), 2),
    },
  },
  {
    id: 'limits-023',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Find $\\lim_{x \\to \\infty} \\dfrac{5x - 3x^2}{6x^2 + 1}$.',
    options: ['$-\\frac{1}{2}$', '$\\frac{5}{6}$', '$\\frac{1}{2}$', '$-2$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What value does this fraction settle on as $x$ grows without end?',
      solution:
        '$x \\to \\infty$ means $x$ grows without end. When $x$ is huge, the term with the highest power is far bigger than the rest. On top that term is $-3x^2$, even though it is written second.\n\n' +
        'Divide every term, top and bottom, by $x^2$, the highest power on the bottom. Each $x^2$ term loses its $x^2$, and the others keep some $x$ on their bottom:\n\n$$\\frac{5x - 3x^2}{6x^2 + 1} = \\frac{\\frac{5}{x} - 3}{6 + \\frac{1}{x^2}}$$\n\n' +
        'When $x$ is huge, $\\frac{5}{x}$ and $\\frac{1}{x^2}$ both shrink towards 0, so they can be ignored.\n\n' +
        'That leaves $\\frac{-3}{6}$, which simplifies to $-\\frac{1}{2}$.',
      conclusion: 'Top and bottom have the same highest power, so the limit is the ratio of the numbers in front, $-\\frac{1}{2}$.',
      whyWrong: [
        null,
        'This uses the first number written on top, $5$. The leading coefficient belongs to the highest power, which is $-3x^2$.',
        'This drops the minus sign on $-3x^2$.',
        'This divides the coefficients the wrong way round, $\\frac{6}{-3}$. It is top over bottom.',
      ],
      keyIdea: 'Find the highest-power term on top and on the bottom, wherever it is written, and keep its sign. With equal powers, the limit is the number in front on top divided by the number in front on the bottom.',
    },
    check: {
      optionValues: [-1 / 2, 5 / 6, 1 / 2, -2],
      compute: () => ((x: number) => (5 * x - 3 * x * x) / (6 * x * x + 1))(1e8),
    },
  },
];
