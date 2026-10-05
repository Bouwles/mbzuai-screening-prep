import type { Lesson } from '../../../types';

// Note: the numbers in this lesson are deliberately different from the static questions,
// so reading the lesson never hands over a practice answer.
export const lesson: Lesson = {
  subtopic: 'simultaneous-equations',
  know:
    '### What "simultaneous" means\n\n' +
    'One equation with two unknowns, like $x + y = 12$, has endless solutions: $(1, 11)$, $(4, 8)$, $(7, 5)$ and so on. ' +
    'Add a second equation, like $x - y = 2$, and usually only **one** pair works in both at the same time. ' +
    'Finding that pair is "solving simultaneous equations". Here it is $(7, 5)$: $7 + 5 = 12$ and $7 - 5 = 2$.\n\n' +
    'On a graph, each linear equation is a straight line, and the solution is the point where the lines **cross**.\n\n' +
    '### Method 1: elimination\n\n' +
    'Add or subtract the equations so that one unknown disappears.\n\n' +
    '1. Line up the $x$ terms, $y$ terms and constants.\n' +
    '2. If needed, multiply one or both equations (every term!) so one unknown has the same number in front of it.\n' +
    '3. **Same signs: subtract. Different signs: add.**\n' +
    '4. Solve the one-unknown equation that is left.\n' +
    '5. Substitute back to find the other unknown, then check in the equation you did not use.\n\n' +
    'Example: $2x + 3y = 7$ and $5x - 6y = 4$. Doubling the first gives $4x + 6y = 14$; now $+6y$ and $-6y$ have different signs, so add: $9x = 18$, $x = 2$. ' +
    'Then $2(2) + 3y = 7$ gives $3y = 3$, so $y = 1$.\n\n' +
    '### Method 2: substitution\n\n' +
    'Best when one equation already says "$y = \\ldots$" (or $x = \\ldots$). Put that whole expression, in brackets, into the other equation. ' +
    'With $y = 3x - 2$ and $2x + y = 13$: $2x + (3x - 2) = 13$, so $5x - 2 = 13$, $5x = 15$, $x = 3$, and $y = 3(3) - 2 = 7$.\n\n' +
    'Substitution is also the method for **non-linear** systems (a line and a curve).\n\n' +
    '### A line and a curve\n\n' +
    'To find where $y = x + 3$ meets $y = x^2 - x$, set the two expressions for $y$ equal and bring everything to one side: $x^2 - x = x + 3$ becomes $x^2 - 2x - 3 = 0$. ' +
    'Factorise: $(x - 3)(x + 1) = 0$, so $x = 3$ or $x = -1$. Then find each $y$ from the **line**: the points are $(3, 6)$ and $(-1, 2)$.\n\n' +
    'The number of meeting points follows the discriminant $b^2 - 4ac$ of that quadratic:\n\n' +
    '| $b^2 - 4ac$ | Meaning |\n' +
    '| --- | --- |\n' +
    '| positive | line crosses the curve at 2 points |\n' +
    '| zero | line **touches** the curve (tangent), 1 point |\n' +
    '| negative | line misses the curve, no points |\n\n' +
    '### Three equations, three unknowns\n\n' +
    'Use elimination twice. Remove the **same** unknown (say $y$) from two different pairs of equations. That leaves two equations in the other two unknowns: solve them as usual, then substitute back to get the third. ' +
    'In a multiple-choice question it is often faster to plug each option into **all three** equations.\n\n' +
    '### When there is no solution or infinitely many\n\n' +
    'For $ax + by = c$ and $dx + ey = f$, first work out $ae - bd$.\n\n' +
    '- If $ae - bd \\ne 0$: the lines have different gradients and cross once, so there is exactly **one** solution.\n' +
    '- If $ae - bd = 0$ and the constants are in the **same** ratio as the coefficients: both equations describe the same line, so there are **infinitely many** solutions.\n' +
    '- If $ae - bd = 0$ but the constants are **not** in that ratio: the lines are parallel and different, so there is **no** solution.\n\n' +
    'Example: $x + 2y = 5$ and $3x + 6y = 12$. Tripling the first gives $3x + 6y = 15$, which contradicts $12$, so there is no solution. ' +
    'If the second equation had been $3x + 6y = 15$, it would be the same line and there would be infinitely many solutions. ' +
    'Two straight lines can never meet at exactly two points.\n\n' +
    '### Word problems\n\n' +
    'Give each unknown a letter, then turn each fact into one equation. Typical pairs: "how many items" and "total cost"; "sum" and "difference"; two different shopping baskets. ' +
    'Always ask yourself at the end: does my answer make sense (whole number of tickets, positive price)?\n\n' +
    '### Clever substitutions (challenge level)\n\n' +
    'Some systems look scary but become linear with a new letter. For equations containing $\\frac{1}{x}$ and $\\frac{1}{y}$, let $u = \\frac{1}{x}$ and $v = \\frac{1}{y}$. ' +
    'For equations containing $2^x$ and $3^y$, let $a = 2^x$ and $b = 3^y$ (and remember $2^{x+1} = 2 \\times 2^x$). ' +
    'The official sample question uses $\\sin\\alpha$, $\\cos\\beta$ and $\\tan\\gamma$ as the "letters". Solve the linear system, then **convert back** to the original unknowns.',
  formulas: [
    { label: 'General 2 by 2 linear system', tex: 'ax + by = c, \\qquad dx + ey = f' },
    { label: 'Elimination rule', tex: '\\text{same sign} \\Rightarrow \\text{subtract}, \\qquad \\text{different signs} \\Rightarrow \\text{add}', note: 'Make one unknown have the same size of coefficient in both equations first.' },
    { label: 'Determinant test', tex: 'ae - bd \\ne 0 \\iff \\text{exactly one solution}' },
    { label: 'Solution by formula (Cramer)', tex: 'x = \\frac{ce - bf}{ae - bd}, \\qquad y = \\frac{af - cd}{ae - bd}', note: 'A quick calculator check; only works when $ae - bd \\ne 0$.' },
    { label: 'No solution (parallel lines)', tex: '\\frac{a}{d} = \\frac{b}{e} \\ne \\frac{c}{f}', note: 'Coefficients in the same ratio, constants not.' },
    { label: 'Infinitely many solutions (same line)', tex: '\\frac{a}{d} = \\frac{b}{e} = \\frac{c}{f}', note: 'One equation is an exact multiple of the other, constants included.' },
    { label: 'Line meets curve: count of points', tex: 'b^2 - 4ac > 0: \\ 2, \\qquad b^2 - 4ac = 0: \\ 1 \\text{ (tangent)}, \\qquad b^2 - 4ac < 0: \\ 0', note: 'Use the quadratic you get after substituting the line into the curve.' },
  ],
  examples: [
    {
      title: 'Elimination with opposite signs',
      problem: 'Solve $4x + 3y = 18$ and $2x - 3y = 0$.',
      steps: [
        'The $y$ terms are $+3y$ and $-3y$ (different signs), so add the equations.',
        'Adding the left-hand sides gives $4x + 2x = 6x$ (the $y$ terms cancel), and adding the right-hand sides gives $18$. So $6x = 18$.',
        'Divide by 6: $x = 3$.',
        'Substitute into the first equation: $4(3) + 3y = 18$, so $12 + 3y = 18$, $3y = 6$ and $y = 2$.',
        'Check in the second equation: $2(3) - 3(2) = 6 - 6 = 0$.',
      ],
      answer: '$x = 3$, $y = 2$',
    },
    {
      title: 'Word problem (scaling both equations)',
      problem: '2 coffees and 3 muffins cost AED 39; 3 coffees and 5 muffins cost AED 62. Find the price of each.',
      steps: [
        'Let $c$ = coffee price and $m$ = muffin price (in AED): $2c + 3m = 39$ and $3c + 5m = 62$.',
        'Make the $c$ terms match: multiply the first equation by 3 and the second by 2 (every term): $6c + 9m = 117$ and $6c + 10m = 124$.',
        'The $c$ terms are both $+6c$ (same sign), so subtract the first from the second: $(6c + 10m) - (6c + 9m) = 124 - 117$, giving $m = 7$.',
        'Substitute into $2c + 3m = 39$: $2c + 21 = 39$, so $2c = 18$ and $c = 9$.',
        'Check in the other equation: $3(9) + 5(7) = 27 + 35 = 62$.',
      ],
      answer: 'A coffee costs AED 9 and a muffin costs AED 7.',
    },
    {
      title: 'A line meeting a curve',
      problem: 'Find where the line $y = 2x + 1$ meets the curve $y = x^2 - x - 3$.',
      steps: [
        'Set the two expressions for $y$ equal: $x^2 - x - 3 = 2x + 1$.',
        'Bring everything to one side (subtract $2x$ and subtract 1): $x^2 - 3x - 4 = 0$.',
        'Factorise (two numbers that multiply to $-4$ and add to $-3$ are $-4$ and $1$): $(x - 4)(x + 1) = 0$, so $x = 4$ or $x = -1$.',
        'Find each $y$ from the line $y = 2x + 1$: $x = 4$ gives $y = 9$; $x = -1$ gives $y = -1$.',
        'Check in the curve: $16 - 4 - 3 = 9$ and $1 + 1 - 3 = -1$.',
      ],
      answer: '$(4, 9)$ and $(-1, -1)$',
    },
    {
      title: 'Three equations in three unknowns',
      problem: 'Solve $x + y + z = 9$, $x - y + 2z = 7$, $2x + y - z = 3$.',
      steps: [
        'Add the first and second equations ($y$ cancels): $2x + 3z = 16$.',
        'Add the second and third equations ($y$ cancels): $3x + z = 10$.',
        'From $3x + z = 10$: $z = 10 - 3x$. Substitute into $2x + 3z = 16$: $2x + 3(10 - 3x) = 16$, so $2x + 30 - 9x = 16$, $-7x = -14$ and $x = 2$.',
        'Then $z = 10 - 3(2) = 4$, and from the first equation $y = 9 - 2 - 4 = 3$.',
        'Check all three: $2 + 3 + 4 = 9$, $2 - 3 + 8 = 7$, $4 + 3 - 4 = 3$.',
      ],
      answer: '$(x, y, z) = (2, 3, 4)$',
    },
    {
      title: 'No solution: finding the value of k',
      problem: 'For which value of $k$ does the system $x + 2y = 5$, $3x + ky = 12$ have no solution?',
      steps: [
        'No solution needs parallel lines, so the $x$ and $y$ coefficients must be in the same ratio: $\\frac{1}{3} = \\frac{2}{k}$.',
        'Cross-multiply: $k = 6$. (Same thing with the determinant: $1 \\times k - 2 \\times 3 = 0$ gives $k = 6$.)',
        'Check the constants: tripling the first equation gives $3x + 6y = 15$, but the second says $3x + 6y = 12$. They contradict each other, so there really is no solution (not infinitely many).',
      ],
      answer: '$k = 6$',
    },
  ],
  traps: [
    'Multiplying only the left-hand side of an equation. When you scale an equation, multiply **every** term, including the constant: $2x + 5y = 3$ doubled is $4x + 10y = 6$, not $4x + 10y = 3$.',
    'Adding when you should subtract (or the other way round). Look at the signs of the matching terms: same sign means subtract, different signs means add. Be extra careful subtracting negatives: $-4y - (-4y) = 0$.',
    'Forgetting brackets in substitution. Substituting $y = 3x - 2$ into $2x + y$ gives $2x + (3x - 2)$; with a minus sign in front, $2x - (3x - 2) = -x + 2$, not $-x - 2$.',
    'Stopping after finding one unknown, or giving $y$ when the question asks for $x$. Find both, then reread exactly what is asked (sometimes it is $x + y$ or $xy$).',
    'For a line and a curve: giving the roots of the quadratic with $y = 0$, or forgetting to find $y$. Each $x$ gives its own $y$, worked out from the line.',
    'Saying "no solution" whenever $ae - bd = 0$. You must also compare the constants: if they are in the same ratio, the equations are the same line and there are infinitely many solutions.',
  ],
  examTip:
    'In a 4-option question you rarely need to solve from scratch. **Plug each option into every equation**: the right one works in all of them, and the wrong ones usually satisfy only some (they were built from a slip). ' +
    'This is the fastest method for 3 by 3 systems and "sample question 3" style systems in $\\sin$, $\\cos$ and $\\tan$. ' +
    'If the question asks for $x + y$, try adding or subtracting the equations first: it often gives the answer in one line. ' +
    'For "no solution / infinitely many" questions, check the ratio of the $x$ and $y$ coefficients ($ae - bd = 0$), then the constants. ' +
    'For word problems, eliminate options that are not whole numbers or not positive when they count people or tickets. ' +
    'Finally, watch for distractors that are the **other** unknown, the value before dividing, or the swapped pair.',
};
