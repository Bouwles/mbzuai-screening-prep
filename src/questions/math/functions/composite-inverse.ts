import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';

/**
 * Numerically solves f(y) = target for y on [lo, hi] by bisection.
 * Used by the answer checks to re-derive inverse-function values without using the algebra.
 * Requires f to be continuous on [lo, hi] with f(lo) - target and f(hi) - target of opposite signs.
 */
function solveFor(f: (x: number) => number, target: number, lo: number, hi: number): number {
  let a = lo;
  let b = hi;
  const sa = Math.sign(f(a) - target);
  if (sa === Math.sign(f(b) - target)) throw new Error('solveFor: no sign change');
  for (let i = 0; i < 200; i++) {
    const mid = (a + b) / 2;
    const sm = Math.sign(f(mid) - target);
    if (sm === 0) return mid;
    if (sm === sa) a = mid;
    else b = mid;
  }
  return (a + b) / 2;
}

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'composite-inverse-001',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'Let $f(x) = 2x + 3$ and $g(x) = x^2$. Find $f(g(3))$.',
    options: ['$21$', '$81$', '$18$', '$39$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What do we get if we apply $g$ to 3, then apply $f$ to the result?',
      solution:
        '$f(g(3))$ is a **composite**: one function feeding into another. Work from the inside out, so $g$ acts first and its output goes into $f$.\n\n' +
        'Find the inside part. $g(x) = x^2$ means "square the input", so $g(3) = 3^2 = 9$.\n\n' +
        'So $f(g(3))$ is the same as $f(9)$. Use $f(x) = 2x + 3$ with $x = 9$: $f(9) = 2 \\times 9 + 3 = 18 + 3 = 21$.',
      conclusion: '$g$ turns 3 into 9, and $f$ turns 9 into 21, so the answer is $21$.',
      whyWrong: [
        null,
        'This is $g(f(3))$, the composition in the wrong order: $f(3) = 9$ and then $g(9) = 81$. In $f(g(3))$ the inner function $g$ acts first.',
        'This adds the two outputs: $f(3) + g(3) = 9 + 9 = 18$. A composite feeds one output into the other function; it does not add them.',
        'This squares $2x$ instead of replacing $x$ by $x^2$: $(2 \\times 3)^2 + 3 = 39$. The correct composite is $f(g(x)) = 2x^2 + 3$.',
      ],
      keyIdea: 'In $f(g(a))$, work from the inside out: find $g(a)$, then put that number into $f$. The function nearest the number acts first.',
    },
    check: {
      optionValues: [21, 81, 18, 39],
      compute: () => {
        const f = (x: number) => 2 * x + 3;
        const g = (x: number) => x * x;
        return f(g(3));
      },
    },
  },
  {
    id: 'composite-inverse-002',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'The function $f$ is defined by $f(x) = 3x - 6$. Which of the following is $f^{-1}(x)$?',
    options: ['$f^{-1}(x) = \\frac{1}{3x-6}$', '$f^{-1}(x) = \\frac{x+6}{3}$', '$f^{-1}(x) = \\frac{x-6}{3}$', '$f^{-1}(x) = \\frac{x}{3} + 6$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What rule undoes $f(x) = 3x - 6$?',
      solution:
        'The **inverse** $f^{-1}$ undoes $f$: if $f$ turns an input into an output, $f^{-1}$ turns that output back into the input. The $-1$ does not mean "one over".\n\n' +
        'Write the function with $y$ for the output: $y = 3x - 6$. To reverse it, we solve for $x$, the input.\n\n' +
        'Add 6 to both sides to undo the $-6$: $y + 6 = 3x$.\n\n' +
        'Divide both sides by 3 to undo the multiplying: $x = \\frac{y + 6}{3}$.\n\n' +
        'This rule takes an output $y$ and returns the input. We usually call a function\'s input $x$, so swap the letter: $f^{-1}(x) = \\frac{x+6}{3}$.',
      conclusion: 'Testing with an input of 4: $f(4) = 6$, and the rule sends 6 back to $\\frac{6 + 6}{3} = 4$. So $f^{-1}(x) = \\frac{x+6}{3}$.',
      whyWrong: [
        'This is the reciprocal $\\frac{1}{f(x)}$. The $-1$ in $f^{-1}$ means "inverse function" (undo $f$), not "one over".',
        null,
        'This divides by $3$ correctly but keeps the $-6$. To undo "subtract $6$" you must **add** $6$.',
        'This undoes the steps in the wrong order: it divides by $3$ first and then adds $6$. Since $f$ multiplies by $3$ first and subtracts $6$ last, the inverse must add $6$ first and divide by $3$ last.',
      ],
      keyIdea: 'To invert a simple formula, write $y = $ the formula, rearrange to get $x$ alone, then replace $y$ with $x$. Undo the operations in reverse order: what $f$ did last, the inverse does first.',
    },
    check: {
      // value of each option at x = 6
      optionValues: [1 / 12, 4, 0, 8],
      compute: () => solveFor((x) => 3 * x - 6, 6, -100, 100),
    },
  },
  {
    id: 'composite-inverse-003',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'Given $f(x) = 2x + 1$, find $f^{-1}(7)$.',
    options: ['$15$', '$4$', '$3$', '$\\frac{1}{15}$'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which input makes $f$ give an output of 7?',
      solution:
        '$f^{-1}$ is the **inverse** of $f$: it undoes $f$. So $f^{-1}(7)$ asks: which input does $f$ turn into 7?\n\n' +
        'Write that as an equation. We don\'t need the full inverse formula: $2x + 1 = 7$.\n\n' +
        'Subtract 1 from both sides to undo the $+1$: $2x = 6$.\n\n' +
        'Divide both sides by 2 to get $x$ alone: $x = 3$.',
      conclusion: 'Testing: $f(3) = 2 \\times 3 + 1 = 7$, so $f$ sends the input to 7 and the answer is $3$.',
      whyWrong: [
        'This is $f(7) = 2 \\times 7 + 1 = 15$: it applies $f$ instead of undoing it.',
        'This undoes the $+1$ by adding $1$: $\\frac{7+1}{2} = 4$. To undo "add $1$" you subtract $1$.',
        null,
        'This is $\\frac{1}{f(7)}$. The notation $f^{-1}$ means the inverse function, not the reciprocal.',
      ],
      keyIdea: 'To find $f^{-1}(a)$ as a number, you don\'t need the inverse formula. Solve $f(x) = a$ for $x$. Then put your result back into $f$ to confirm that it gives $a$.',
    },
    check: {
      optionValues: [15, 4, 3, 1 / 15],
      compute: () => solveFor((x) => 2 * x + 1, 7, -100, 100),
    },
  },
  {
    id: 'composite-inverse-004',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'The graph of $y = f^{-1}(x)$ can always be obtained from the graph of $y = f(x)$ by a reflection in which line?',
    options: ['the $x$-axis', 'the $y$-axis', 'the line $y = -x$', 'the line $y = x$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which line reflects the graph of a function onto the graph of its inverse?',
      solution:
        'The inverse undoes the function. If $f$ turns $a$ into $b$, then $f^{-1}$ turns $b$ back into $a$. So if $(a, b)$ is on the graph of $f$, then $(b, a)$ is on the graph of $f^{-1}$.\n\n' +
        'So the inverse swaps the two coordinates of every point. For example, $(2, 5)$ becomes $(5, 2)$.\n\n' +
        'Swapping coordinates is a reflection in the diagonal line where both coordinates are equal, which is the line $y = x$. Points on that line, such as $(3, 3)$, stay where they are.',
      conclusion: 'Swapping $x$ and $y$ on every point is a reflection, so the answer is the line $y = x$.',
      whyWrong: [
        'Reflecting in the $x$-axis sends $(a, b)$ to $(a, -b)$, which gives the graph of $y = -f(x)$, not the inverse.',
        'Reflecting in the $y$-axis sends $(a, b)$ to $(-a, b)$, which gives the graph of $y = f(-x)$, not the inverse.',
        'Reflecting in $y = -x$ sends $(a, b)$ to $(-b, -a)$: the coordinates are swapped **and** made negative. The inverse only swaps them.',
        null,
      ],
      keyIdea: 'To reason about an inverse, swap the coordinates of key points: that is a reflection in $y = x$. Compare: the $x$-axis changes the sign of $y$, the $y$-axis changes the sign of $x$, and $y = -x$ swaps and changes both signs.',
    },
  },
  {
    id: 'composite-inverse-005',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'The point $(2, 5)$ lies on the graph of the one-to-one function $y = f(x)$. Which point **must** lie on the graph of $y = f^{-1}(x)$?',
    options: ['$(2, \\frac{1}{5})$', '$(5, 2)$', '$(-2, -5)$', '$(-5, -2)$'],
    correctIndex: 1,
    markScheme: {
      asking: 'If $f$ sends 2 to 5, which point must be on the graph of the function that undoes $f$?',
      solution:
        'The point $(2, 5)$ on the graph of $y = f(x)$ tells us that $f$ turns the input 2 into the output 5. So $f(2) = 5$.\n\n' +
        'The inverse $f^{-1}$ undoes $f$, so it turns 5 back into 2. So $f^{-1}(5) = 2$.\n\n' +
        'On the graph of $y = f^{-1}(x)$, an input of 5 with an output of 2 is the point with $x = 5$ and $y = 2$, which is $(5, 2)$.',
      conclusion: 'The inverse swaps the input and output, so the point that must lie on the new graph is $(5, 2)$.',
      whyWrong: [
        'This takes the reciprocal of the $y$-coordinate, mixing up $f^{-1}$ with $\\frac{1}{f}$. The inverse swaps the coordinates instead.',
        null,
        'This makes both coordinates negative, which is a rotation of $180^{\\circ}$ about the origin (the graph of $y = -f(-x)$), not the inverse.',
        'This is the reflection in the line $y = -x$ (swap **and** change both signs). The inverse is the reflection in $y = x$, which only swaps.',
      ],
      keyIdea: 'If $(a, b)$ is on the graph of $f$, then $(b, a)$ is on the graph of $f^{-1}$. Swap the coordinates and leave the signs alone.',
    },
    check: {
      optionValues: ['2,0.2', '5,2', '-2,-5', '-5,-2'],
      compute: () => {
        const p = [2, 5];
        return `${p[1]},${p[0]}`;
      },
    },
  },
  {
    id: 'composite-inverse-006',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'The function $f(x) = \\frac{3x-1}{x+4}$, $x \\ne -4$, has an inverse $f^{-1}$. What is the value of $f(f^{-1}(6))$?',
    options: ['$\\frac{17}{10}$', '$1$', '$6$', '$-\\frac{25}{3}$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What do we get if we apply $f^{-1}$ to 6, then apply $f$ to the result?',
      solution:
        '$f^{-1}$ is the **inverse** of $f$: the rule that undoes $f$. Work from the inside out.\n\n' +
        'Call the inside part $a$, so $a = f^{-1}(6)$. By the meaning of an inverse, $a$ is the input that $f$ turns into 6. So $f(a) = 6$.\n\n' +
        'The whole expression is $f(f^{-1}(6)) = f(a)$, and we just saw that $f(a) = 6$. The fraction formula is never needed.',
      conclusion: 'Doing something and then undoing it returns the starting number, so $f(f^{-1}(6))$ equals $6$.',
      whyWrong: [
        'This is $f(6) = \\frac{17}{10}$: it ignores the $f^{-1}$ completely.',
        'This treats $f$ and $f^{-1}$ like a number and its reciprocal that multiply to $1$. Composition is not multiplication: $f$ undoes $f^{-1}$ and returns the input $6$.',
        null,
        'This is only $f^{-1}(6) = -\\frac{25}{3}$; it stops halfway and forgets to apply $f$ to the result.',
      ],
      keyIdea: 'For any function with an inverse, $f(f^{-1}(x)) = x$ and $f^{-1}(f(x)) = x$, because the two cancel out. When a function sits right next to its inverse, skip the algebra.',
    },
    check: {
      optionValues: [17 / 10, 1, 6, -25 / 3],
      compute: () => {
        const f = (x: number) => (3 * x - 1) / (x + 4);
        const inv = solveFor(f, 6, -100, -4.0001);
        return Math.round(f(inv) * 1e6) / 1e6;
      },
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'composite-inverse-007',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'Let $f(x) = x^2 + 1$ and $g(x) = 2x - 3$. Find $(f \\circ g)(x)$.',
    options: ['$2x^2 - 1$', '$4x^2 + 10$', '$4x^2 - 12x + 10$', '$2x^3 - 3x^2 + 2x - 3$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What formula do we get when $g$ is put inside $f$?',
      solution:
        '$(f \\circ g)(x)$ means $f(g(x))$: apply $g$ first, then $f$. The small circle $\\circ$ means "composed with". It does not mean multiply.\n\n' +
        '$f$ squares its input, then adds 1. Its input is now all of $g(x)$, which is $2x - 3$. So replace the $x$ in $f$ with $(2x - 3)$: $f(g(x)) = (2x - 3)^2 + 1$.\n\n' +
        'Expand the square by multiplying the bracket by itself: $(2x - 3)(2x - 3) = 4x^2 - 6x - 6x + 9 = 4x^2 - 12x + 9$.\n\n' +
        'Add the 1: $4x^2 - 12x + 9 + 1 = 4x^2 - 12x + 10$.',
      conclusion: 'Putting $2x - 3$ into $f$ and expanding gives $4x^2 - 12x + 10$.',
      whyWrong: [
        'This is $(g \\circ f)(x) = 2(x^2+1) - 3 = 2x^2 - 1$, the composition in the wrong order.',
        'This expands $(2x-3)^2$ as $4x^2 + 9$, forgetting the middle term $2 \\times 2x \\times (-3) = -12x$.',
        null,
        'This multiplies the two functions: $(x^2+1)(2x-3)$. Composition substitutes one function into the other; it is not a product.',
      ],
      keyIdea: 'For $(f \\circ g)(x)$, take the formula for $f$ and replace every $x$ with the whole of $g(x)$ in brackets, then expand. The function written nearest the $x$ acts first, so $f \\circ g$ and $g \\circ f$ usually differ.',
    },
    check: {
      // value of each option at x = 2
      optionValues: [7, 26, 2, 5],
      compute: () => {
        const f = (x: number) => x * x + 1;
        const g = (x: number) => 2 * x - 3;
        return f(g(2));
      },
    },
  },
  {
    id: 'composite-inverse-008',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'The function $f$ is defined by $f(x) = \\frac{2x+1}{x-3}$, $x \\ne 3$. Find $f^{-1}(x)$.',
    options: ['$\\frac{3x+1}{2-x}$', '$\\frac{x-3}{2x+1}$', '$\\frac{3x-1}{x-2}$', '$\\frac{3x+1}{x-2}$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What rule undoes this fraction function?',
      solution:
        'The **inverse** $f^{-1}$ undoes $f$, so it swaps inputs and outputs. To find it, write $y = \\frac{2x+1}{x-3}$, then swap $x$ and $y$: $x = \\frac{2y+1}{y-3}$.\n\n' +
        'Now we need $y$ on its own. Multiply both sides by $y - 3$ to clear the fraction: $x(y - 3) = 2y + 1$.\n\n' +
        'Multiply out the bracket: $xy - 3x = 2y + 1$.\n\n' +
        'Gather all the $y$ terms on one side, because we want to take $y$ out as a factor. Subtract $2y$ from both sides and add $3x$ to both sides: $xy - 2y = 3x + 1$.\n\n' +
        'Take out $y$ as a common factor: $y(x - 2) = 3x + 1$.\n\n' +
        'Divide both sides by $x - 2$ to get $y$ alone: $y = \\frac{3x+1}{x-2}$. This $y$ is the output of the inverse, so it is $f^{-1}(x)$.',
      conclusion: 'Testing: $f(4) = 9 \\div 1 = 9$, and the rule sends 9 back to $\\frac{28}{7} = 4$. So the inverse is $\\frac{3x+1}{x-2}$.',
      whyWrong: [
        'This has a sign slip when collecting the $y$ terms (writing $y(2 - x)$ instead of $y(x - 2)$ while keeping $3x + 1$). The result is the negative of the true inverse.',
        'This is the reciprocal $\\frac{1}{f(x)}$, not the inverse function.',
        'This has a sign slip when moving the constant: from $xy - 3x = 2y + 1$ the $+1$ stays $+1$ on the right; it should not become $-1$.',
        null,
      ],
      keyIdea: 'For a fraction, swap $x$ and $y$, multiply by the denominator, gather the $y$ terms on one side, take out $y$ as a factor, then divide. To test it, put a number through $f$ and then the inverse: it must come back unchanged.',
    },
    check: {
      // value of each option at x = 4
      optionValues: [-6.5, 1 / 9, 5.5, 6.5],
      compute: () => solveFor((x) => (2 * x + 1) / (x - 3), 4, 3.0001, 1000),
    },
  },
  {
    id: 'composite-inverse-009',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'The function $f(x) = \\sqrt{x-2} + 3$ has domain $x \\ge 2$. What is the **domain** of the inverse function $f^{-1}$?',
    options: ['$x \\ge 2$', '$x \\ge 3$', '$x \\ge 0$', 'all real numbers $x$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which numbers can we put into the function that undoes $f$?',
      solution:
        'The inverse $f^{-1}$ undoes $f$, so its inputs are exactly the outputs of $f$. So the **domain** (allowed inputs) of $f^{-1}$ is the **range** (possible outputs) of $f$. We need the range of $f$.\n\n' +
        'Look at the root first. The square root symbol always gives a result of 0 or more, and it equals 0 when $x = 2$. So $\\sqrt{x - 2} \\ge 0$.\n\n' +
        'As $x$ gets bigger, the root keeps growing, with no upper limit.\n\n' +
        '$f$ then adds 3, so add 3 to both sides: $\\sqrt{x - 2} + 3 \\ge 3$. So the outputs of $f$ are all the numbers from 3 upwards.\n\n' +
        'These outputs are the inputs of $f^{-1}$. We write inputs with the letter $x$, so the domain of $f^{-1}$ is $x \\ge 3$.',
      conclusion: 'The smallest output of $f$ is 3, and an inverse swaps inputs and outputs, so the domain is $x \\ge 3$.',
      whyWrong: [
        'This is the domain of $f$ itself. For the inverse, domain and range swap roles.',
        null,
        'This is the range of $\\sqrt{x-2}$ on its own; it forgets the $+3$ that shifts every output up by $3$.',
        'The formula $(x-3)^2 + 2$ can be evaluated for any $x$, but the inverse can only accept the outputs of $f$, which are all at least $3$.',
      ],
      keyIdea: 'For the domain of an inverse, don\'t start from the inverse formula. Find the range of $f$ instead, since that set is the domain of $f^{-1}$. Likewise, the range of $f^{-1}$ is the domain of $f$.',
    },
    check: {
      optionValues: [2, 3, 0, null],
      compute: () => {
        const f = (x: number) => Math.sqrt(x - 2) + 3;
        const outs: number[] = [];
        for (let x = 2; x <= 200; x += 0.25) outs.push(f(x));
        return Math.min(...outs);
      },
    },
  },
  {
    id: 'composite-inverse-010',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'The function $f(x) = x^3 + 2x - 7$ is increasing for all $x$, so it has an inverse. Find $f^{-1}(5)$.',
    options: ['$2$', '$128$', '$\\frac{1}{128}$', '$6$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which input makes $f$ give an output of 5?',
      solution:
        '$f^{-1}(5)$ asks: which input does $f$ turn into 5? So we need to solve $x^3 + 2x - 7 = 5$.\n\n' +
        'Add 7 to both sides to tidy it up: $x^3 + 2x = 12$. An equation with $x^3$ is hard to rearrange, so we try simple whole numbers instead.\n\n' +
        'The question says $f$ is increasing, so bigger inputs always give bigger outputs. That means only one input can work, and we can stop at the first match.\n\n' +
        'Try the whole numbers in turn. The first match, with 12, comes at $x = 2$:\n\n| $x$ | $x^3 + 2x$ | Equal to 12? |\n|---|---|---|\n| 0 | $0$ | no |\n| 1 | $1 + 2 = 3$ | no |\n| 2 | $8 + 4 = 12$ | yes |',
      conclusion: 'Testing: $f(2) = 8 + 4 - 7 = 5$, and only one input can work, so the answer is $2$.',
      whyWrong: [
        null,
        'This is $f(5) = 125 + 10 - 7 = 128$: it applies $f$ instead of undoing it.',
        'This is $\\frac{1}{f(5)}$, treating $f^{-1}$ as a reciprocal.',
        'This "undoes" only the linear part, $\\frac{5+7}{2} = 6$, ignoring the $x^3$ term. Check: $f(6) = 221$, not $5$.',
      ],
      keyIdea: 'When $f$ is too hard to invert, turn $f^{-1}(a)$ into the equation $f(x) = a$ and try small whole numbers. If $f$ is increasing, only one input can work, so stop at the first match.',
    },
    check: {
      optionValues: [2, 128, 1 / 128, 6],
      compute: () => solveFor((x) => x ** 3 + 2 * x - 7, 5, -10, 10),
    },
  },
  {
    id: 'composite-inverse-011',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'Let $f(x) = 2x + 1$ and $g(x) = x^2 - 3$. Solve $g(f(x)) = 6$.',
    options: ['$x = 1$ or $x = -2$', '$x = 1$ only', '$x = 1$ or $x = -1$', '$x = 3$ or $x = -3$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which values of $x$ make $g(f(x))$ equal 6?',
      solution:
        '$g(f(x))$ means apply $f$ first, then $g$. So build the formula first. $g$ squares its input and subtracts 3, and its input is $f(x) = 2x + 1$. So $g(f(x)) = (2x + 1)^2 - 3$.\n\n' +
        'Set this equal to 6, as the question says: $(2x + 1)^2 - 3 = 6$.\n\n' +
        'Add 3 to both sides to get the square alone: $(2x + 1)^2 = 9$.\n\n' +
        'Take the square root of both sides. Two numbers square to 9: 3 and $-3$. So there are two cases: $2x + 1 = 3$ or $2x + 1 = -3$.\n\n' +
        'First case: subtract 1 to get $2x = 2$, then divide by 2 to get $x = 1$.\n\n' +
        'Second case: subtract 1 to get $2x = -4$, then divide by 2 to get $x = -2$.',
      conclusion: 'Both values work: $(2 + 1)^2 - 3 = 6$ and $(-4 + 1)^2 - 3 = 6$. So the answer is $x = 1$ or $x = -2$.',
      whyWrong: [
        null,
        'This keeps only the positive square root. $(2x+1)^2 = 9$ also allows $2x + 1 = -3$, which gives $x = -2$.',
        'This has an arithmetic slip in the negative case: $2x + 1 = -3$ gives $2x = -4$, not $-2$.',
        'These are the values of $2x + 1$, the inside of the bracket. You still have to solve $2x + 1 = 3$ and $2x + 1 = -3$ to get $x$.',
      ],
      keyIdea: 'To solve $g(f(x)) = c$, put $f(x)$ into $g$ to get one equation, then solve. When you take a square root, write both the positive and the negative case, or you lose a solution.',
    },
    check: {
      optionValues: ['-2,1', '1', '-1,1', '-3,3'],
      compute: () => {
        const f = (x: number) => 2 * x + 1;
        const g = (x: number) => x * x - 3;
        const sols: number[] = [];
        for (let x = -50; x <= 50; x += 0.5) if (g(f(x)) === 6) sols.push(x);
        return sols.join(',');
      },
    },
  },
  {
    id: 'composite-inverse-012',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'Given $g(x) = x^2 + 1$ and $(f \\circ g)(x) = 2x^2 + 5$, find $f(x)$.',
    options: ['$f(x) = 2x + 5$', '$f(x) = 2x + 3$', '$f(x) = 2x^2 + 3$', '$f(x) = \\frac{2x^2+5}{x^2+1}$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What must $f$ do to $x^2 + 1$ to produce $2x^2 + 5$?',
      solution:
        '$(f \\circ g)(x)$ means $f(g(x))$: first $g$ acts, then $f$ acts on the result. So $f$ receives $x^2 + 1$ as its input and gives back $2x^2 + 5$.\n\n' +
        'So we want to rewrite $2x^2 + 5$ using the block $x^2 + 1$, because that block is what $f$ sees.\n\n' +
        'Two blocks give $2(x^2 + 1) = 2x^2 + 2$. We need $+5$ rather than $+2$, so add 3: $2x^2 + 5 = 2(x^2 + 1) + 3$.\n\n' +
        'So $f$ takes its input (the block), doubles it and adds 3. Replace the block with the letter $x$: $f(x) = 2x + 3$.',
      conclusion: 'Testing: putting $x^2 + 1$ into the formula gives $2(x^2 + 1) + 3 = 2x^2 + 5$, which matches. So the answer is $f(x) = 2x + 3$.',
      whyWrong: [
        'This just replaces $x^2$ by $x$ and forgets that $g$ also adds $1$. Check: $2(x^2+1) + 5 = 2x^2 + 7$, not $2x^2 + 5$.',
        null,
        'This correctly writes $2x^2 + 5 = 2(x^2 + 1) + 3$, but then replaces the block $x^2 + 1$ by $x^2$ instead of by $x$. Check: $f(g(x)) = 2(x^2+1)^2 + 3$ contains an $x^4$ term, so it cannot equal $2x^2 + 5$.',
        'This divides $(f \\circ g)(x)$ by $g(x)$, treating composition as multiplication. Composition means substitution.',
      ],
      keyIdea: 'To find the outer function, write the composite in terms of the inner function\'s block, then replace the block with $x$. Or, if the outer function looks linear, write $f(x) = ax + b$, substitute and match the numbers multiplying each power of $x$.',
    },
    check: {
      // value of each option at x = 2
      optionValues: [9, 7, 11, 13 / 5],
      compute: () => {
        // f(2) = (f o g)(t) where g(t) = 2, i.e. t = 1
        const t = Math.sqrt(2 - 1);
        return 2 * t * t + 5;
      },
    },
  },

  {
    id: 'composite-inverse-014',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'Let $f(x) = 2x - 3$. At which point do the graphs of $y = f(x)$ and $y = f^{-1}(x)$ intersect?',
    options: ['$(1, -1)$', '$(0, -3)$', '$(\\frac{3}{2}, 0)$', '$(3, 3)$'],
    correctIndex: 3,
    markScheme: {
      asking: 'At which point do the line $y = 2x - 3$ and the graph of its inverse cross?',
      solution:
        'The graph of an inverse $f^{-1}$ is the reflection of the graph of $f$ in the line $y = x$. A reflection leaves any point on that mirror line where it is.\n\n' +
        'So a point where $f$ meets the line $y = x$ is also on the graph of $f^{-1}$. Here the inverse is $\\frac{x + 3}{2}$, from undoing $f$ (add 3, then divide by 2). Both graphs are straight lines with different gradients (steepness), 2 and $\\frac{1}{2}$, so they cross only once, and that must be the point.\n\n' +
        'To find where $y = 2x - 3$ meets $y = x$, set the two right-hand sides equal: $2x - 3 = x$.\n\n' +
        'Subtract $x$ from both sides: $x - 3 = 0$, so $x = 3$. On the line $y = x$, this means $y = 3$ too.',
      conclusion: 'Testing: $f(3) = 6 - 3 = 3$, and the inverse $\\frac{x + 3}{2}$ also gives 3 at $x = 3$, so the graphs meet at $(3, 3)$.',
      whyWrong: [
        'This comes from solving $f(x) = -x$ (using the line $y = -x$ instead of $y = x$), or from the wrong inverse $\\frac{x-3}{2}$.',
        'This is just the $y$-intercept of $y = f(x)$; the inverse graph does not pass through it ($f^{-1}(0) = \\frac{3}{2}$, not $-3$).',
        'This is just the $x$-intercept of $y = f(x)$; it is on the graph of $f$ but not on the graph of $f^{-1}$.',
        null,
      ],
      keyIdea: 'To find where an increasing function meets its inverse, solve $f(x) = x$. The graphs are mirror images in $y = x$, so they meet on that line. The point is then $(a, a)$, with both coordinates equal.',
    },
    check: {
      optionValues: ['1,-1', '0,-3', '1.5,0', '3,3'],
      compute: () => {
        const f = (x: number) => 2 * x - 3;
        const finv = (y: number) => solveFor(f, y, -1000, 1000);
        const hits: string[] = [];
        for (let x = -10; x <= 10; x += 0.5) if (Math.abs(f(x) - finv(x)) < 1e-9) hits.push(`${x},${f(x)}`);
        return hits.join('|');
      },
    },
  },
  {
    id: 'composite-inverse-015',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'The function $f(x) = \\ln(x-1) + 2$ has domain $x > 1$. Find $f^{-1}(x)$.',
    options: ['$f^{-1}(x) = e^{x-1} + 2$', '$f^{-1}(x) = e^{x+2} - 1$', '$f^{-1}(x) = \\frac{1}{\\ln(x-1) + 2}$', '$f^{-1}(x) = e^{x-2} + 1$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What rule undoes $f(x) = \\ln(x-1) + 2$?',
      solution:
        'The inverse undoes $f$. Write $y = \\ln(x - 1) + 2$, then solve for $x$, because the inverse takes the output $y$ back to the input $x$.\n\n' +
        '$\\ln$ is the natural logarithm, the log with base $e$ (a fixed number, about 2.718). Raising $e$ to a power undoes it: $e^{\\ln a} = a$. Before we can use that, the $\\ln$ must be alone. Subtract 2 from both sides: $y - 2 = \\ln(x - 1)$.\n\n' +
        'Now raise $e$ to the power of each side, which cancels the $\\ln$: $e^{y - 2} = x - 1$.\n\n' +
        'Add 1 to both sides to get $x$ alone: $x = e^{y - 2} + 1$.\n\n' +
        'We usually call a function\'s input $x$, so replace $y$ with $x$: $f^{-1}(x) = e^{x-2} + 1$.',
      conclusion: 'Testing: $f(2) = \\ln 1 + 2 = 2$, and the rule sends 2 back to $e^{0} + 1 = 2$. So the answer is $f^{-1}(x) = e^{x-2} + 1$.',
      whyWrong: [
        'This only swaps $\\ln$ for $e$ to the power and leaves the $-1$ and the $+2$ where they were. The other two steps of $f$ must be undone as well, in reverse order: subtract $2$ first, then take $e$ to the power, then add $1$.',
        'This keeps the right order but uses the wrong opposite operations: to undo "add $2$" you subtract $2$, and to undo "subtract $1$" you add $1$.',
        'This is the reciprocal $\\frac{1}{f(x)}$, not the inverse function.',
        null,
      ],
      keyIdea: 'List what $f$ does in order (subtract 1, take $\\ln$, add 2). The inverse undoes these in reverse order (subtract 2, take $e$ to the power, add 1). $\\ln$ and $e^x$ undo each other.',
    },
    check: {
      // value of each option at x = 2
      optionValues: [Math.E + 2, Math.exp(4) - 1, 1 / 2, 2],
      compute: () => solveFor((x) => Math.log(x - 1) + 2, 2, 1 + 1e-7, 100),
    },
  },

  {
    id: 'composite-inverse-016',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'The one-to-one functions $f$ and $g$ are defined on $\\{1, 2, 3, 4, 5\\}$ by the table below. Find $(f \\circ g)^{-1}(5)$.',
    table: {
      headers: ['$x$', '1', '2', '3', '4', '5'],
      rows: [
        ['$f(x)$', 3, 5, 4, 1, 2],
        ['$g(x)$', 2, 4, 1, 5, 3],
      ],
    },
    options: ['$3$', '$4$', '$1$', '$2$'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which input makes $f(g(x))$ equal 5?',
      solution:
        '$f \\circ g$ means apply $g$ first, then $f$. The inverse $(f \\circ g)^{-1}$ undoes this. So $(f \\circ g)^{-1}(5)$ asks: which input $x$ gives $f(g(x)) = 5$?\n\n' +
        'The last function to act is $f$, and its output must be 5. Look along the $f(x)$ row for 5. It is under $x = 2$, so $f(2) = 5$. So $g(x)$ must equal 2.\n\n' +
        'Now look along the $g(x)$ row for 2. It is under $x = 1$, so $g(1) = 2$.',
      conclusion: 'Going forwards to confirm: $g$ turns the input into 2, and $f(2) = 5$. So the answer is $1$.',
      whyWrong: [
        'This undoes in the wrong order, $f^{-1}(g^{-1}(5))$: $g^{-1}(5) = 4$ and $f^{-1}(4) = 3$. Since $g$ acts first in $f \\circ g$, you must undo $f$ first.',
        'This works forwards instead of backwards: $f(g(5)) = f(3) = 4$.',
        null,
        'This is only $f^{-1}(5) = 2$; it forgets the second step of undoing $g$.',
      ],
      keyIdea: 'To undo a composite from a table, work backwards and undo the last function first. Find the target in the outer function\'s row, read off its input, then find that number in the inner function\'s row.',
    },
    check: {
      optionValues: [3, 4, 1, 2],
      compute: () => {
        const f: Record<number, number> = { 1: 3, 2: 5, 3: 4, 4: 1, 5: 2 };
        const g: Record<number, number> = { 1: 2, 2: 4, 3: 1, 4: 5, 5: 3 };
        return [1, 2, 3, 4, 5].filter((x) => f[g[x]] === 5)[0];
      },
    },
  },
  {
    id: 'composite-inverse-018',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'A linear function $f(x) = ax + b$ satisfies $f^{-1}(7) = 2$ and $f^{-1}(1) = -1$. Find $f(f(1))$.',
    options: ['$13$', '$5$', '$-2$', '$25$'],
    correctIndex: 0,
    markScheme: {
      asking: 'If we work out the straight line from the two inverse facts, what is $f$ applied twice to 1?',
      solution:
        '$f^{-1}$ undoes $f$, so each fact can be flipped. $f^{-1}(7) = 2$ means $f(2) = 7$. And $f^{-1}(1) = -1$ means $f(-1) = 1$.\n\n' +
        'So the line $y = f(x)$ passes through the points $(2, 7)$ and $(-1, 1)$. In $f(x) = ax + b$, $a$ is the gradient (steepness) and $b$ is where it crosses the $y$-axis.\n\n' +
        'The gradient is the change in $y$ divided by the change in $x$: $a = \\frac{7 - 1}{2 - (-1)} = \\frac{6}{3} = 2$.\n\n' +
        'Find $b$ by putting the point $(2, 7)$ into $f(x) = 2x + b$: $7 = 2 \\times 2 + b$, so $7 = 4 + b$ and $b = 3$. So $f(x) = 2x + 3$.\n\n' +
        '$f(f(1))$ means apply $f$ twice, from the inside out. First $f(1) = 2 \\times 1 + 3 = 5$. Then $f(5) = 2 \\times 5 + 3 = 13$.',
      conclusion: 'The line is $f(x) = 2x + 3$. Applying it twice takes 1 to 5, and then 5 to 13, so the answer is $13$.',
      whyWrong: [
        null,
        'This is only $f(1) = 5$; it stops after applying $f$ once.',
        'This reads $f^{-1}(7) = 2$ as $f(7) = 2$ (and $f^{-1}(1) = -1$ as $f(1) = -1$), giving the wrong line $f(x) = \\frac{x - 3}{2}$, and then $f(f(1)) = f(-1) = -2$.',
        'This squares $f(1)$: $5^2 = 25$. But $f(f(1))$ means apply $f$ twice, not multiply $f(1)$ by itself.',
      ],
      keyIdea: 'Flip inverse facts first: $f^{-1}(a) = b$ means $f(b) = a$, which gives a point $(b, a)$ on the graph. With two points, use gradient $= \\frac{\\text{change in } y}{\\text{change in } x}$, then substitute one point to find the constant.',
    },
    check: {
      optionValues: [13, 5, -2, 25],
      compute: () => {
        // 2a + b = 7, -a + b = 1 solved by Cramer's rule with exact fractions
        const det = 2 * 1 - 1 * -1;
        const a = new Frac(7 * 1 - 1 * 1, det);
        const b = new Frac(2 * 1 - -1 * 7, det);
        const f = (x: Frac) => a.mul(x).add(b);
        return f(f(new Frac(1))).value();
      },
    },
  },
  {
    id: 'composite-inverse-019',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'Given $g(x) = 2x - 1$ and $(g \\circ f)(x) = 6x + 5$, find $f^{-1}(x)$.',
    options: ['$\\frac{x+1}{2}$', '$3x + 3$', '$\\frac{x-5}{6}$', '$\\frac{x-3}{3}$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What is $f$, and what rule undoes it?',
      solution:
        '$(g \\circ f)(x)$ means $g(f(x))$: $f$ acts first, then $g$. We don\'t know $f$ yet, so keep it as $f(x)$. $g$ doubles its input and subtracts 1, so $g(f(x)) = 2f(x) - 1$.\n\n' +
        'The question says this equals $6x + 5$, so $2f(x) - 1 = 6x + 5$.\n\n' +
        'Solve for $f(x)$ as if it were one unknown. Add 1 to both sides: $2f(x) = 6x + 6$. Divide by 2: $f(x) = 3x + 3$.\n\n' +
        'Now find the inverse, which undoes $f$. Write $y = 3x + 3$ and solve for $x$. Subtract 3: $y - 3 = 3x$. Divide by 3: $x = \\frac{y - 3}{3}$.\n\n' +
        'We usually call a function\'s input $x$, so replace $y$ with $x$: $f^{-1}(x) = \\frac{x-3}{3}$.',
      conclusion: 'Testing: $f(2) = 9$, and the rule sends 9 back to $\\frac{9 - 3}{3} = 2$. So the answer is $\\frac{x-3}{3}$.',
      whyWrong: [
        'This is $g^{-1}(x)$, the inverse of the wrong function.',
        'This is $f(x)$ itself; it forgets the final step of inverting.',
        'This is $(g \\circ f)^{-1}(x)$, the inverse of the whole composite $6x + 5$, not of $f$.',
        null,
      ],
      keyIdea: 'When the outer function and the composite are known, put $f(x)$ into the outer formula, set it equal to the composite and solve for $f(x)$. Only then invert, because the question asks for two separate jobs.',
    },
    check: {
      // value of each option at x = 9
      optionValues: [5, 30, 2 / 3, 2],
      compute: () => {
        const gf = (x: number) => 6 * x + 5;
        const f = (x: number) => (gf(x) + 1) / 2; // undo g
        return solveFor(f, 9, -100, 100);
      },
    },
  },
  {
    id: 'composite-inverse-022',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'A function has an inverse function only if it is:',
    options: ['One-to-one', 'Linear', 'Defined for all real numbers', 'Always positive'],
    correctIndex: 0,
    markScheme: {
      asking: 'What must be true of a function for it to have an inverse?',
      solution:
        'An **inverse** undoes a function: it takes each output back to the input it came from.\n\n' +
        'That only works if each output came from just one input. Take $f(x) = x^2$ on all real numbers: 9 comes from both 3 and $-3$, so an inverse wouldn\'t know which to return.\n\n' +
        'A function where each output comes from exactly one input is called **one-to-one**.',
      conclusion: 'To undo a function, every output must point back to one input, so the function must be one-to-one.',
      whyWrong: [
        null,
        'Many non-linear functions have inverses, such as $x^3$ and $e^x$.',
        'A restricted domain is fine: $\\sqrt{x}$ has an inverse although it is defined only for $x \\ge 0$.',
        'The sign of the outputs does not matter: $f(x) = x - 5$ takes negative values and still has an inverse.',
      ],
      keyIdea: 'To test whether an inverse exists, use the horizontal line test: if any horizontal line crosses the graph more than once, there is no inverse. Restricting the domain (the allowed inputs) can fix it, as with $x^2$ for $x \\ge 0$.',
    },
  },
  {
    id: 'composite-inverse-023',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'The notation $(f \\circ g)(x)$ means:',
    options: ['$f(g(x))$', '$g(f(x))$', '$f(x) \\times g(x)$', '$f(x) + g(x)$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does the small circle in $(f \\circ g)(x)$ tell us to do?',
      solution:
        'The small circle $\\circ$ means "composed with". A composite feeds the output of one function into another. It is not a multiplication.\n\n' +
        'Read $(f \\circ g)(x)$ from right to left. $g$ is next to the $x$, so $g$ acts first, giving $g(x)$. Then $f$ acts on that result, which is written $f(g(x))$.',
      conclusion: 'The function next to $x$ acts first, so $(f \\circ g)(x)$ means $f(g(x))$.',
      whyWrong: [
        null,
        'This is $(g \\circ f)(x)$, the reverse order. In $f \\circ g$, the function next to $x$, which is $g$, acts first.',
        'This multiplies the two outputs. Composition feeds one output into the other function.',
        'This adds the two outputs. Composition feeds one output into the other function.',
      ],
      keyIdea: 'The function closest to the $x$ acts first, in both $f(g(x))$ and $(f \\circ g)(x)$. Example: if $g(x) = x + 1$ and $f(x) = 2x$, then $(f \\circ g)(3)$ goes from 3 to 4 to 8.',
    },
  },
  {
    id: 'composite-inverse-024',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'The domain of $f^{-1}$ is the same as which set?',
    options: ['The range of $f$', 'The domain of $f$', 'All real numbers', 'The set of $x$ with $f(x) = 0$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which numbers can go into the function that undoes $f$?',
      solution:
        'The **domain** of a function is its allowed inputs, and the **range** is its possible outputs. The inverse $f^{-1}$ undoes $f$, taking outputs of $f$ back to inputs of $f$.\n\n' +
        'So what goes into $f^{-1}$ is what came out of $f$. For example, $f(x) = e^x$, where $e$ is a fixed number about 2.718, only gives outputs above 0. Its inverse $\\ln x$, the log with base $e$, accepts only inputs above 0.',
      conclusion: 'The inputs of $f^{-1}$ are the outputs of $f$, so its domain is the range of $f$.',
      whyWrong: [
        null,
        'This is the range of $f^{-1}$, not its domain. The inverse swaps the two sets.',
        'This is only true when $f$ can output every real number. For $f(x) = e^x$, the inverse $\\ln x$ accepts only $x > 0$.',
        'These are the zeros of $f$, which are just points in the domain of $f$. They have nothing to do with the inputs of $f^{-1}$.',
      ],
      keyIdea: 'An inverse swaps the two sets: domain of $f^{-1}$ = range of $f$, and range of $f^{-1}$ = domain of $f$. So to find the domain of an inverse, find the range of the original function.',
    },
  },
  {
    id: 'composite-inverse-025',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'Let $f(x) = 2x + 1$ and $g(x) = x + 3$. For the composition $g \\circ f$, find $(g \\circ f)^{-1}(10)$.',
    options: ['$3$', '$\\frac{3}{2}$', '$24$', '$\\frac{1}{24}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which input makes $g(f(x))$ equal 10?',
      solution:
        '$g \\circ f$ means $g(f(x))$: $f$ acts first, then $g$. The inverse at 10 asks: which input makes $g(f(x))$ equal 10?\n\n' +
        'Build the composite. $g$ adds 3 to its input, and its input is $f(x) = 2x + 1$. So $g(f(x)) = (2x + 1) + 3 = 2x + 4$.\n\n' +
        'Set it equal to 10: $2x + 4 = 10$.\n\n' +
        'Subtract 4 from both sides: $2x = 6$. Divide both sides by 2: $x = 3$.',
      conclusion: 'Testing: $f(3) = 7$ and $g(7) = 10$, so the input we want is $3$.',
      whyWrong: [
        null,
        'This composes in the wrong order: $f(g(x)) = 2x + 7$, and $2x + 7 = 10$ gives $\\frac{3}{2}$. In $g \\circ f$, the function $f$ acts first.',
        'This evaluates $g \\circ f$ at $10$: $2(10) + 4 = 24$. The inverse at $10$ asks which input gives the output $10$.',
        'This treats $-1$ as a power and takes $\\frac{1}{24}$. The notation means the inverse function, not a reciprocal.',
      ],
      keyIdea: 'To find $h^{-1}(a)$ for any function $h$, solve $h(x) = a$. For a composite, first write out $h$, with the function nearest the $x$ on the inside.',
    },
    check: {
      optionValues: [3, 3 / 2, 24, 1 / 24],
      compute: () => {
        const h = (x: number) => 2 * x + 1 + 3;
        return (10 - h(0)) / (h(1) - h(0));
      },
    },
  },];
