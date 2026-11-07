import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';
import { det3 } from '../../../lib/mathx';

// ---- helpers used only by the answer checks (re-derive answers from the raw coefficients) ----

/** Solve ax + by = c, dx + ey = f exactly (Cramer's rule). */
function solve2(a: number, b: number, c: number, d: number, e: number, f: number): { x: Frac; y: Frac } {
  const D = a * e - b * d;
  return { x: new Frac(c * e - b * f, D), y: new Frac(a * f - c * d, D) };
}

/** Solve a 3x3 system A [x, y, z] = r exactly (Cramer's rule). */
function solve3(A: number[][], r: number[]): Frac[] {
  const D = det3(A);
  return [0, 1, 2].map((j) => new Frac(det3(A.map((row, i) => row.map((v, k) => (k === j ? r[i] : v)))), D));
}

const pairStr = (s: { x: Frac; y: Frac }) => `${s.x},${s.y}`;

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'simultaneous-equations-001',
    subtopic: 'simultaneous-equations',
    difficulty: 'foundation',
    stem: 'Solve the simultaneous equations $x + y = 10$ and $x - y = 4$. What is the value of $x$?',
    options: ['$7$', '$3$', '$14$', '$6$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which value of $x$ fits both equations at the same time?',
      solution:
        '**Simultaneous equations** must both be true at the same time, for the same $x$ and the same $y$. Our plan is to remove one letter so that only one remains.\n\n' +
        'The first equation has $+y$ and the second has $-y$. If we add the equations, these cancel, because $y + (-y)$ is nothing.\n\n' +
        'Add the left sides and the right sides: $(x + y) + (x - y) = 10 + 4$, which gives $2x = 14$.\n\n' +
        'Divide both sides by 2: $x = 14 \\div 2 = 7$.',
      conclusion: 'Then $y = 10 - 7 = 3$, and $7 - 3 = 4$ fits the second equation too. So the answer is $7$.',
      whyWrong: [
        null,
        '$3$ is the value of $y$, not $x$. Read the question carefully: it asks for $x$.',
        '$14$ is $2x$. After adding the equations you still have to divide both sides by 2.',
        '$6$ is what you get by **subtracting** the equations: $(x + y) - (x - y) = 2y = 6$. That is $2y$, not $x$.',
      ],
      keyIdea: 'Look for a letter with the same number in both equations. If its signs are opposite, add the equations. If its signs match, subtract them. That leaves one letter to solve for.',
    },
    check: { optionValues: [7, 3, 14, 6], compute: () => solve2(1, 1, 10, 1, -1, 4).x.value() },
  },
  {
    id: 'simultaneous-equations-003',
    subtopic: 'simultaneous-equations',
    difficulty: 'foundation',
    stem: 'Which pair $(x, y)$ satisfies **both** $2x + y = 7$ and $x - y = 2$?',
    options: ['$(2, 3)$', '$(5, 3)$', '$(3, 1)$', '$(1, 3)$'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which pair of numbers makes both equations true together?',
      solution:
        'A pair $(x, y)$ is a solution only if it makes **both** equations true. We can solve directly, then test the result.\n\n' +
        'One equation has $+y$ and the other has $-y$, so adding them cancels $y$: $(2x + y) + (x - y) = 7 + 2$, which gives $3x = 9$.\n\n' +
        'Divide both sides by 3: $x = 3$.\n\n' +
        'Put $x = 3$ into $x - y = 2$: $3 - y = 2$. Subtract 3 from both sides: $-y = -1$, so $y = 1$.',
      conclusion: 'Testing $(3, 1)$ gives $2 \\times 3 + 1 = 7$ and $3 - 1 = 2$. Both are true, so the answer is $(3, 1)$.',
      whyWrong: [
        '$(2, 3)$ works in the first equation ($4 + 3 = 7$) but not the second: $2 - 3 = -1$, not $2$. A solution must satisfy both equations.',
        '$(5, 3)$ works in the second equation ($5 - 3 = 2$) but not the first: $2(5) + 3 = 13$, not $7$.',
        null,
        '$(1, 3)$ has the right numbers in the wrong order. Check: $2(1) + 3 = 5$, not $7$.',
      ],
      keyIdea: 'With pairs to choose from, substitute each pair into both equations. A pair that fits only one equation is wrong. Keep the order straight: the first number is $x$, the second is $y$.',
    },
    check: { optionValues: ['2,3', '5,3', '3,1', '1,3'], compute: () => pairStr(solve2(2, 1, 7, 1, -1, 2)) },
  },
  {
    id: 'simultaneous-equations-004',
    subtopic: 'simultaneous-equations',
    difficulty: 'foundation',
    stem: 'How many solutions does this pair of simultaneous equations have?\n\n$$2x + 3y = 6$$\n\n$$4x + 6y = 15$$',
    options: ['Exactly one solution', 'Infinitely many solutions', 'Exactly two solutions', 'No solution'],
    correctIndex: 3,
    markScheme: {
      asking: 'How many pairs $(x, y)$ make both equations true?',
      solution:
        'Each equation is a straight line, and a solution is a point on both lines. Compare the left sides: $4x + 6y$ is exactly double $2x + 3y$.\n\n' +
        'Multiply every term of the first equation by 2: $2(2x + 3y) = 2 \\times 6$, so $4x + 6y = 12$.\n\n' +
        'But the second equation says $4x + 6y = 15$. The same expression cannot equal both 12 and 15, so no pair of numbers can make both true.',
      conclusion: 'The lines have the same slope (steepness) but different positions, so they are parallel and never meet. The answer is No solution.',
      whyWrong: [
        'Exactly one solution needs the lines to have different gradients. Here both lines have gradient $-\\frac{2}{3}$, so they are parallel.',
        'Infinitely many solutions would need the second equation to be an exact multiple of the first, i.e. $4x + 6y = 12$. The constant is $15$, so the lines are parallel but different.',
        'Two straight lines can never meet at exactly two points: they meet once, never, or they are the same line.',
        null,
      ],
      keyIdea: 'Compare the equations first. If the left sides are multiples of each other, scale one to match. Different constants mean no solution (parallel lines). The same constants mean infinitely many (the same line).',
    },
    check: {
      optionValues: ['one', 'infinite', 'two', 'none'],
      compute: () => {
        const [a, b, c, d, e, f] = [2, 3, 6, 4, 6, 15];
        if (a * e - b * d !== 0) return 'one';
        return a * f === c * d && b * f === c * e ? 'infinite' : 'none';
      },
    },
  },
  {
    id: 'simultaneous-equations-019',
    subtopic: 'simultaneous-equations',
    difficulty: 'foundation',
    stem: 'Two straight lines have different slopes. How many solutions does the pair of equations have?',
    options: ['Exactly one', 'None', 'Exactly two', 'Infinitely many'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many points can two lines with different steepness share?',
      solution:
        'A solution of a pair of line equations is a point on both lines. So the number of solutions is the number of crossing points.\n\n' +
        'Lines with different slopes have different steepness, so they must meet somewhere. Being straight, they meet only once, and after crossing they just move further apart.',
      conclusion: 'Two straight lines with different slopes cross at one point, so the answer is Exactly one.',
      whyWrong: [
        null,
        'No solution needs parallel lines, and parallel lines have **equal** slopes.',
        'Two different straight lines can never meet at exactly two points.',
        'Infinitely many solutions needs both equations to describe the same line, which would have equal slopes.',
      ],
      keyIdea: 'Compare slopes (steepness) and intercepts (where each line crosses the $y$-axis). Different slopes: one solution. Same slope with different intercepts: no solution. Same slope with the same intercept: infinitely many.',
    },
  },
  {
    id: 'simultaneous-equations-020',
    subtopic: 'simultaneous-equations',
    difficulty: 'foundation',
    stem: 'On a graph, what does the solution of a pair of linear simultaneous equations represent?',
    options: ['The point where the lines cross', 'Where each line meets the $y$-axis', 'The slope of each line', 'Where each line meets the $x$-axis'],
    correctIndex: 0,
    markScheme: {
      asking: 'Where on a graph do you find the $x$ and $y$ that fit both equations?',
      solution:
        'Each equation draws a straight line. Every point on a line is a pair $(x, y)$ that makes that equation true.\n\n' +
        'A solution must make **both** equations true, so its point must lie on both lines. The only such place is where they meet. For example, $y = x$ and $y = 2 - x$ meet at $(1, 1)$, and $(1, 1)$ fits both.',
      conclusion: 'A point on both lines fits both equations, so the answer is the point where the lines cross.',
      whyWrong: [
        null,
        'A $y$-intercept lies on its own line, but usually not on the other line, so it does not satisfy both equations.',
        'A slope measures how steep a line is. A solution is a pair of values $(x, y)$.',
        'An $x$-intercept lies on its own line, but usually not on the other line, so it does not satisfy both equations.',
      ],
      keyIdea: 'Picture each equation as a line. One crossing means one solution, parallel lines mean none, and the same line twice means infinitely many. Read the solution from the crossing point\'s coordinates.',
    },
  },
  {
    id: 'simultaneous-equations-021',
    subtopic: 'simultaneous-equations',
    difficulty: 'foundation',
    stem: 'A system of linear equations that has no solution is called:',
    options: ['Inconsistent', 'Consistent', 'Dependent', 'Homogeneous'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the name for a set of equations with no solution?',
      solution:
        'A **system** means a set of equations that must all be true together. If no values can make them all true, they contradict each other.\n\n' +
        '**Inconsistent** means contradicting. For example, $x + y = 1$ and $x + y = 2$ cannot both be true, so this system has no solution.',
      conclusion: 'The equations contradict each other, so the word is Inconsistent.',
      whyWrong: [
        null,
        'A consistent system has at least one solution.',
        'A dependent system has one equation that follows from the others, so it has infinitely many solutions in the two-line case.',
        'A homogeneous system has every constant equal to 0, so it always has the solution where all the unknowns are 0.',
      ],
      keyIdea: 'Match each name to its count. Consistent: at least one solution. Inconsistent: none. Dependent: one equation follows from the others, giving infinitely many. Homogeneous: every constant is 0.',
    },
  },
  {
    id: 'simultaneous-equations-022',
    subtopic: 'simultaneous-equations',
    difficulty: 'foundation',
    stem: 'To eliminate $y$ from $2x + 3y = 7$ and $5x - 3y = 1$, you should:',
    options: ['add the equations', 'subtract the equations', 'multiply the equations', 'divide one equation by the other'],
    correctIndex: 0,
    markScheme: {
      asking: 'What should you do to the two equations to make $y$ disappear?',
      solution:
        '**Eliminate** means remove. Look at the $y$ terms: the first equation has $+3y$ and the second has $-3y$.\n\n' +
        'These are the same size with opposite signs, so together they make nothing: $3y - 3y$ cancels.\n\n' +
        'So adding does it: $(2x + 3y) + (5x - 3y) = 7 + 1$ gives $7x = 8$, with no $y$ left.',
      conclusion: 'Opposite signs cancel when combined, so you should add the equations.',
      whyWrong: [
        null,
        'Subtracting gives $-3x + 6y = 6$, so the $y$ terms double instead of cancelling. Subtract only when the signs are the same.',
        'Multiplying the equations creates terms such as $xy$ and $y^2$, which makes the system harder.',
        'Dividing one equation by the other gives a fraction with both unknowns in it, so $y$ does not disappear.',
      ],
      keyIdea: 'To eliminate a letter, make its number the same size in both equations, multiplying if needed. Opposite signs: add the equations. Same signs: subtract them.',
    },
  },
  {
    id: 'simultaneous-equations-023',
    subtopic: 'simultaneous-equations',
    difficulty: 'foundation',
    stem: 'If two linear equations describe the same line, how many solutions does the system have?',
    options: ['Infinitely many', 'Exactly one', 'Exactly two', 'None'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many solutions are there when both equations draw the same line?',
      solution:
        'A solution is a point that lies on both lines. If the two equations describe the same line, every point on that line is on both.\n\n' +
        'For example, $x + y = 2$ and $2x + 2y = 4$ are the same line, because the second is the first doubled. The points $(0, 2)$, $(1, 1)$ and $(2, 0)$ all work, and so does every other point on the line. A line has endless points.',
      conclusion: 'Every one of the line\'s endless points is a solution, so the answer is Infinitely many.',
      whyWrong: [
        null,
        'Exactly one solution is the case of two lines with different slopes, which cross once.',
        'Two straight lines can never share exactly two points: if they share two, they are the same line.',
        'No solution is the case of parallel lines with different intercepts, which never meet.',
      ],
      keyIdea: 'If one equation is an exact multiple of the other, including the number on the right, they are the same line and there are infinitely many solutions. Test by scaling one equation to match the other.',
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'simultaneous-equations-002',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    stem: 'Use substitution to solve $y = 2x + 1$ and $3x + y = 16$. Give your answer as $(x, y)$.',
    options: ['$(7, 3)$', '$(3, 7)$', '$(3, 6)$', '$\\left(\\frac{17}{5}, \\frac{39}{5}\\right)$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which pair of values for $x$ and $y$ fits both equations?',
      solution:
        'The first equation tells us exactly what $y$ is: $y = 2x + 1$. So **substitution** works: wherever we see $y$ in the other equation, we can write $2x + 1$ instead.\n\n' +
        'Replace $y$ in $3x + y = 16$: $3x + (2x + 1) = 16$. Now there is only one letter.\n\n' +
        'Collect the $x$ terms: $3x + 2x = 5x$, so $5x + 1 = 16$.\n\n' +
        'Subtract 1 from both sides: $5x = 15$. Divide both sides by 5: $x = 3$.\n\n' +
        'Put $x = 3$ back into $y = 2x + 1$: $y = 2 \\times 3 + 1 = 7$.',
      conclusion: 'In the other equation, $3 \\times 3 + 7 = 16$, which is true. So the answer is $(3, 7)$.',
      whyWrong: [
        'This has $x$ and $y$ the wrong way round. Check it: $y = 2(7) + 1 = 15$, not $3$.',
        null,
        'This forgets the $+1$ when finding $y$: $y = 2(3) + 1 = 7$, not $2(3) = 6$.',
        'This moves the $+1$ across without changing its sign, giving $5x = 16 + 1 = 17$. It should be $5x = 16 - 1 = 15$.',
      ],
      keyIdea: 'If one equation already says what $y$ equals, put that expression in place of $y$ in the other equation. Solve for $x$, then substitute back to get $y$.',
    },
    check: {
      optionValues: ['7,3', '3,7', '3,6', '17/5,39/5'],
      compute: () => {
        const x = new Frac(16 - 1, 3 + 2);
        return `${x},${x.mul(2).add(1)}`;
      },
    },
  },
  {
    id: 'simultaneous-equations-005',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    stem: 'Solve $3x + 2y = 12$ and $5x - 2y = 4$. What is the value of $y$?',
    options: ['$2$', '$-3$', '$3$', '$6$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What value of $y$ fits both equations?',
      solution:
        'The $y$ terms are $+2y$ and $-2y$: the same size, with opposite signs. Adding the equations cancels them, leaving only $x$.\n\n' +
        'Add the left sides and the right sides: $(3x + 2y) + (5x - 2y) = 12 + 4$, which gives $8x = 16$.\n\n' +
        'Divide both sides by 8: $x = 2$. But the question asks for $y$, so we are not finished.\n\n' +
        'Put $x = 2$ into the first equation: $3 \\times 2 + 2y = 12$, so $6 + 2y = 12$.\n\n' +
        'Subtract 6 from both sides: $2y = 6$. Divide both sides by 2: $y = 3$.',
      conclusion: 'In the second equation, $5 \\times 2 - 2 \\times 3 = 4$, which is true. So the answer is $3$.',
      whyWrong: [
        '$2$ is the value of $x$; the question asks for $y$.',
        'Sign slip when finding $y$ from the second equation: $5(2) - 2y = 4$ gives $-2y = -6$, and a negative divided by a negative is **positive**, so $y = 3$, not $-3$. (Checking $y = -3$ in the first equation gives $6 - 6 = 0$, not $12$.)',
        null,
        '$6$ is $2y$. Divide by 2 to get $y = 3$.',
      ],
      keyIdea: 'When a letter has the same size with opposite signs, add the equations to remove it. Solve for the other letter, then substitute back. Note which letter the question asks for.',
    },
    check: { optionValues: [2, -3, 3, 6], compute: () => solve2(3, 2, 12, 5, -2, 4).y.value() },
  },
  {
    id: 'simultaneous-equations-006',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    stem: 'Solve the simultaneous equations $3x + 2y = 4$ and $5x - 4y = 14$. Give your answer as $(x, y)$.',
    options: ['$(2, 1)$', '$(2, -1)$', '$\\left(\\frac{18}{11}, -\\frac{5}{11}\\right)$', '$(-1, 2)$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which pair $(x, y)$ fits both equations?',
      solution:
        'We want one letter to cancel when we add. The $y$ terms are $+2y$ and $-4y$. If the first were $+4y$, they would be the same size with opposite signs.\n\n' +
        'So multiply every term of the first equation by 2, including the number on the right: $6x + 4y = 8$.\n\n' +
        'Add this to the second equation: $(6x + 4y) + (5x - 4y) = 8 + 14$, which gives $11x = 22$.\n\n' +
        'Divide both sides by 11: $x = 2$.\n\n' +
        'Put $x = 2$ into the first equation: $3 \\times 2 + 2y = 4$, so $6 + 2y = 4$.\n\n' +
        'Subtract 6 from both sides: $2y = -2$. Divide both sides by 2: $y = -1$.',
      conclusion: 'In the second equation, $5 \\times 2 - 4 \\times (-1) = 10 + 4 = 14$, which is true. So the answer is $(2, -1)$.',
      whyWrong: [
        'Sign slip in the last step: $6 + 2y = 4$ gives $2y = 4 - 6 = -2$, not $+2$. Checking $(2, 1)$ in the second equation gives $10 - 4 = 6$, not $14$.',
        null,
        'This multiplies only the left side of the first equation by 2, writing $6x + 4y = 4$. Then $11x = 18$. You must multiply **every** term, including the constant: $6x + 4y = 8$.',
        'These are the right numbers in the wrong order. Check: $3(-1) + 2(2) = 1$, not $4$.',
      ],
      keyIdea: 'When no letter cancels straight away, multiply one equation (every term) so one letter has the same size in both. Add if the signs are opposite, subtract if they match, then substitute back.',
    },
    check: { optionValues: ['2,1', '2,-1', '18/11,-5/11', '-1,2'], compute: () => pairStr(solve2(3, 2, 4, 5, -4, 14)) },
  },
  {
    id: 'simultaneous-equations-007',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    stem: 'If $3x + 2y = 17$ and $2x + 3y = 13$, what is the value of $x + y$?',
    options: ['$4$', '$30$', '$6$', '$5$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What do $x$ and $y$ add up to?',
      solution:
        'The question wants $x + y$, not $x$ and $y$ separately. Look at the numbers: in front of $x$ they are 3 and 2, and in front of $y$ they are 2 and 3. They swap, which suggests adding.\n\n' +
        'Add the two equations: $(3x + 2y) + (2x + 3y) = 17 + 13$. This gives $5x + 5y = 30$.\n\n' +
        'Both terms on the left have a 5, so take it out: $5(x + y) = 30$.\n\n' +
        'Divide both sides by 5: $x + y = 30 \\div 5 = 6$.',
      conclusion: 'Adding made $x + y$ appear directly, with no need to find $x$ or $y$ alone. So the answer is $6$.',
      whyWrong: [
        '$4$ is $x - y$, which you get by **subtracting** the equations. The question asks for $x + y$.',
        '$30$ is $5x + 5y = 5(x + y)$. You still need to divide by 5.',
        null,
        '$5$ is the value of $x$ alone; the question asks for $x + y = 5 + 1$.',
      ],
      keyIdea: 'If asked for a combination such as $x + y$, try adding or subtracting the equations before solving. Numbers that swap between the equations, such as 3, 2 and 2, 3, are a strong sign this shortcut works.',
    },
    check: {
      optionValues: [4, 30, 6, 5],
      compute: () => {
        const s = solve2(3, 2, 17, 2, 3, 13);
        return s.x.add(s.y).value();
      },
    },
  },
  {
    id: 'simultaneous-equations-008',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    stem: 'A cinema charges AED 45 for an adult ticket and AED 30 for a child ticket. A group buys 7 tickets and pays AED 255 in total. How many **adult** tickets did they buy?',
    options: ['$4$', '$3$', '$17$', '$1$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many of the 7 tickets were adult tickets?',
      solution:
        'Use letters for what we do not know. Let $a$ be the number of adult tickets and $c$ the number of child tickets.\n\n' +
        'Two facts give two equations. There are 7 tickets: $a + c = 7$. The cost is 45 per adult plus 30 per child: $45a + 30c = 255$.\n\n' +
        'From the first equation, $c = 7 - a$. Put this into the second equation: $45a + 30(7 - a) = 255$.\n\n' +
        'Expand the bracket: $30 \\times 7 = 210$ and $30 \\times (-a) = -30a$. So $45a + 210 - 30a = 255$, which simplifies to $15a + 210 = 255$.\n\n' +
        'Subtract 210 from both sides: $15a = 45$. Divide both sides by 15: $a = 3$.',
      conclusion: '3 adult tickets cost AED 135 and 4 child tickets cost AED 120, which totals AED 255. So the answer is $3$.',
      whyWrong: [
        '$4$ is the number of **child** tickets. The question asks for adult tickets.',
        null,
        'This drops the $210$ when expanding $30(7 - a)$, giving $15a = 255$ and $a = 17$, which is impossible as only 7 tickets were bought.',
        'This divides the extra AED 45 by the adult price (45) instead of by the price **difference** $45 - 30 = 15$. Each swap from child to adult adds only AED 15.',
      ],
      keyIdea: 'In "two prices, total count, total cost" problems: write one equation for the count and one for the cost. Rewrite one letter using the count equation, substitute it into the cost equation, and solve.',
    },
    check: {
      optionValues: [4, 3, 17, 1],
      compute: () => {
        for (let a = 0; a <= 7; a++) if (45 * a + 30 * (7 - a) === 255) return a;
        return -1;
      },
    },
  },
  {
    id: 'simultaneous-equations-009',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    stem: 'Where does the line $y = x + 1$ meet the curve $y = x^2 - 3x + 4$?',
    options: ['$(1, 2)$ and $(3, 4)$', '$(1, 0)$ and $(3, 0)$', '$(-1, 0)$ and $(-3, -2)$', 'They do not meet'],
    correctIndex: 0,
    markScheme: {
      asking: 'At which points are the line and the curve in the same place?',
      solution:
        'Where the line and curve meet, they share the same $x$ and the same $y$. Both equations start with $y =$, so set their right sides equal: $x^2 - 3x + 4 = x + 1$.\n\n' +
        'This has an $x^2$, so it is a quadratic. Get 0 on one side by subtracting $x$ and subtracting 1 from both sides: $x^2 - 4x + 3 = 0$.\n\n' +
        'Factorise. We need two numbers that multiply to 3 and add to $-4$. They are $-1$ and $-3$, so $(x - 1)(x - 3) = 0$.\n\n' +
        'If two brackets multiply to 0, one of them is 0. So $x = 1$ or $x = 3$.\n\n' +
        'Each point needs a $y$ too. Use the simpler equation, $y = x + 1$. When $x = 1$, $y = 2$. When $x = 3$, $y = 4$.',
      conclusion: 'Both fit the curve as well: $1 - 3 + 4 = 2$ and $9 - 9 + 4 = 4$. So the answer is $(1, 2)$ and $(3, 4)$.',
      whyWrong: [
        null,
        'These use the correct $x$ values but put $y = 0$. Those are where $x^2 - 4x + 3$ crosses the $x$-axis, not where the line meets the curve; substitute back to find $y$.',
        'Sign error when reading the roots: $(x - 1)(x - 3) = 0$ gives $x = 1$ and $x = 3$, not $-1$ and $-3$.',
        'This comes from a sign slip when moving $x$ across, giving $x^2 - 2x + 3 = 0$, whose discriminant $4 - 12$ is negative. The correct equation $x^2 - 4x + 3 = 0$ has two real roots.',
      ],
      keyIdea: 'To find where a line meets a curve, set the two expressions for $y$ equal. Make a quadratic equal to 0 and solve it. Put each $x$ into the line to get its $y$.',
    },
    check: {
      optionValues: ['1,2;3,4', '1,0;3,0', '-1,0;-3,-2', 'none'],
      compute: () => {
        // x^2 - 3x + 4 = x + 1  ->  x^2 + bx + c = 0
        const b = -3 - 1;
        const c = 4 - 1;
        const disc = b * b - 4 * c;
        if (disc < 0) return 'none';
        const xs = [(-b - Math.sqrt(disc)) / 2, (-b + Math.sqrt(disc)) / 2];
        return xs.map((x) => `${x},${x + 1}`).join(';');
      },
    },
  },
  {
    id: 'simultaneous-equations-010',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    stem: 'Which of the following is the solution $(x, y, z)$ of the system below?\n\n$$x + y + z = 6$$\n\n$$2x - y + z = 3$$\n\n$$x + 2y - z = 2$$',
    options: ['$(3, 3, 0)$', '$(1, 2, 3)$', '$(4, 0, 2)$', '$(2, -1, -2)$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which set of three numbers makes all three equations true?',
      solution:
        'With three unknowns, remove one letter to leave two equations in two letters. Look at $z$: the first equation has $+z$ and the third has $-z$, so adding them removes it.\n\n' +
        'Add the first and third: $(x + y + z) + (x + 2y - z) = 6 + 2$, which gives $2x + 3y = 8$.\n\n' +
        'Add the second and third too, as the second also has $+z$: $(2x - y + z) + (x + 2y - z) = 3 + 2$, which gives $3x + y = 5$.\n\n' +
        'From $3x + y = 5$ we get $y = 5 - 3x$. Substitute into $2x + 3y = 8$: $2x + 3(5 - 3x) = 8$, so $2x + 15 - 9x = 8$, so $-7x = -7$, and $x = 1$.\n\n' +
        'Then $y = 5 - 3 \\times 1 = 2$.\n\n' +
        'Put $x = 1$ and $y = 2$ into the first equation: $1 + 2 + z = 6$, so $z = 3$.',
      conclusion: 'The second and third equations also work: $2 - 2 + 3 = 3$ and $1 + 4 - 3 = 2$. So the answer is $(1, 2, 3)$.',
      whyWrong: [
        '$(3, 3, 0)$ satisfies the first two equations but fails the third: with $z = 0$ it gives $3 + 2(3) = 9$, not $2$. You must check every equation.',
        null,
        '$(4, 0, 2)$ satisfies the first and third equations but fails the second: with $y = 0$ it gives $2(4) + 2 = 10$, not $3$.',
        '$(2, -1, -2)$ satisfies the second and third equations but fails the first: $2 - 1 - 2 = -1$, not $6$.',
      ],
      keyIdea: 'With three unknowns and answer choices, substituting each choice into all three equations is often quickest. To solve from scratch, use pairs of equations to remove the same letter, then solve the two left.',
    },
    check: {
      optionValues: ['3,3,0', '1,2,3', '4,0,2', '2,-1,-2'],
      compute: () =>
        solve3(
          [
            [1, 1, 1],
            [2, -1, 1],
            [1, 2, -1],
          ],
          [6, 3, 2],
        ).join(','),
    },
  },
  {
    id: 'simultaneous-equations-011',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    stem: 'For which value of $k$ does the system $2x + ky = 4$ and $3x + 6y = 7$ have **no solution**?',
    options: ['$9$', '$-4$', '$4$', '$6$'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which $k$ makes the two lines parallel, so that they never meet?',
      solution:
        'Each equation is a straight line. No solution means the lines never meet, so they must be **parallel**. For parallel lines, the numbers in front of $x$ and $y$ must be in the same ratio.\n\n' +
        'Match them up. The $x$ numbers are 2 and 3. The $y$ numbers are $k$ and 6. So $\\frac{2}{3} = \\frac{k}{6}$.\n\n' +
        'Multiply both sides by 6 to find $k$: $k = \\frac{2}{3} \\times 6 = 4$.',
      conclusion: 'With $k = 4$, multiplying the first equation by $\\frac{3}{2}$ gives $3x + 6y = 6$, but the second says $3x + 6y = 7$. They contradict, so the answer is $4$.',
      whyWrong: [
        'This sets the ratio up upside down: $\\frac{2}{3} = \\frac{6}{k}$ gives $k = 9$. Compare $x$-coefficient with $x$-coefficient and $y$ with $y$, in the same order: $\\frac{2}{3} = \\frac{k}{6}$.',
        'Sign error: the determinant condition is $12 - 3k = 0$, so $k = 4$. Writing $12 + 3k = 0$ gives $-4$.',
        null,
        'This just copies the $y$-coefficient of the second equation. The $x$-coefficients are $2$ and $3$, so the $y$-coefficients must be in the same ratio: $4$ and $6$.',
      ],
      keyIdea: 'For no solution, the $x$ and $y$ numbers must be in the same ratio, but the constants must not be. Write the ratio with the same order on both sides, solve, then compare the constants.',
    },
    check: {
      optionValues: [9, -4, 4, 6],
      compute: () => {
        // 2*6 - 3k = 0
        const k = (2 * 6) / 3;
        // confirm it is "no solution", not "infinitely many": constants not in the same ratio
        return 2 * 7 !== 3 * 4 ? k : NaN;
      },
    },
  },
  {
    id: 'simultaneous-equations-012',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    stem: 'At a shop, 3 pens and 2 notebooks cost AED 21, while 5 pens and 4 notebooks cost AED 37. How much does **one notebook** cost?',
    options: ['AED 5', 'AED 8', 'AED 6', 'AED 3'],
    correctIndex: 3,
    markScheme: {
      asking: 'What is the price of a single notebook?',
      solution:
        'Let $p$ be the price of a pen and $n$ the price of a notebook, in AED. The two facts give $3p + 2n = 21$ and $5p + 4n = 37$.\n\n' +
        'Make the notebook terms match. Doubling the first equation gives $4n$, the same as the second: $2 \\times (3p + 2n) = 2 \\times 21$, so $6p + 4n = 42$.\n\n' +
        'Both now have $+4n$, so subtracting cancels them. Take the second from the doubled one: $(6p + 4n) - (5p + 4n) = 42 - 37$, which gives $p = 5$. So a pen costs AED 5.\n\n' +
        'Put $p = 5$ into the first equation: $3 \\times 5 + 2n = 21$, so $15 + 2n = 21$.\n\n' +
        'Subtract 15 from both sides: $2n = 6$. Divide both sides by 2: $n = 3$.',
      conclusion: '5 pens and 4 notebooks then cost $25 + 12 = 37$, which is right. So one notebook costs AED 3.',
      whyWrong: [
        'AED 5 is the price of a **pen**, not a notebook.',
        'This subtracts the equations without scaling first: $(5p + 4n) - (3p + 2n) = 2p + 2n = 16$, so $p + n = 8$. That is the price of one pen **plus** one notebook.',
        'AED 6 is $2n$, the price of two notebooks. Divide by 2.',
        null,
      ],
      keyIdea: 'Turn each sentence into an equation, using a letter for each price. Multiply one equation so that one letter matches, subtract to remove it, then substitute back.',
    },
    check: { optionValues: [5, 8, 6, 3], compute: () => solve2(3, 2, 21, 5, 4, 37).y.value() },
  },
  {
    id: 'simultaneous-equations-013',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    stem: 'The equations $3x - y = c$ and $6x - 2y = 10$ are given. For which value of $c$ does the system have **infinitely many** solutions?',
    options: ['$c = 10$', '$c = 5$', '$c = 20$', 'Any value of $c$ except $5$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What must $c$ be for both equations to describe the same line?',
      solution:
        'Two equations have **infinitely many** solutions when they describe the same line. Then every point on that line fits both.\n\n' +
        'Compare the left sides. $6x - 2y$ is exactly twice $3x - y$, because $2 \\times 3x = 6x$ and $2 \\times (-y) = -2y$.\n\n' +
        'So the right side must also double. Doubling the first equation gives $6x - 2y = 2c$, and this must match $6x - 2y = 10$. So $2c = 10$.\n\n' +
        'Divide both sides by 2: $c = 5$.',
      conclusion: 'With $c = 5$, the second equation is just the first doubled, so they are the same line. The answer is $c = 5$.',
      whyWrong: [
        'This copies the constant without scaling. The second equation is **twice** the first, so its constant $10$ must be twice $c$.',
        null,
        'This doubles $10$ instead of halving it. The second equation is twice the first, so its constant is twice $c$: $2c = 10$, which gives $c = 5$, not $2 \\times 10 = 20$.',
        'This is the condition for **no** solution: when $c \\ne 5$ the lines are parallel but different, so they never meet.',
      ],
      keyIdea: 'For infinitely many solutions, one whole equation must be a multiple of the other, including the constant. Find the multiplier from the $x$ or $y$ terms, then apply it to the constant.',
    },
    check: {
      optionValues: [10, 5, 20, null],
      compute: () => {
        const scale = 6 / 3; // second equation's x-coefficient over the first's
        return 10 / scale;
      },
    },
  },
  {
    id: 'simultaneous-equations-017',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    stem: 'The line $y = 2x + k$ meets the curve $y = x^2 + 4x + 6$ at **exactly one** point. Find $k$.',
    options: ['$5$', '$2$', '$-5$', '$3$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What must $k$ be for the line to touch the curve at just one point?',
      solution:
        'Where the line and curve meet, their $y$ values are equal: $2x + k = x^2 + 4x + 6$.\n\n' +
        'Get 0 on one side to make a quadratic. Subtract $2x$ and subtract $k$ from both sides: $0 = x^2 + 2x + 6 - k$.\n\n' +
        'Each solution of this quadratic is a meeting point. One meeting point means exactly one solution. That happens when the **discriminant**, $b^2 - 4ac$, equals 0. It is the part under the root in the quadratic formula, $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$, so when it is 0, adding or subtracting the root changes nothing and only one value of $x$ comes out.\n\n' +
        'Read the numbers from $x^2 + 2x + (6 - k) = 0$: $a = 1$, $b = 2$, and $c = 6 - k$, which is everything without an $x$.\n\n' +
        'Set the discriminant to 0: $2^2 - 4 \\times 1 \\times (6 - k) = 0$, so $4 - 24 + 4k = 0$, so $4k - 20 = 0$.\n\n' +
        'Add 20 to both sides: $4k = 20$. Divide both sides by 4: $k = 5$.',
      conclusion: 'With $k = 5$ the quadratic is $x^2 + 2x + 1 = (x + 1)^2 = 0$, which has just one solution. So the answer is $5$.',
      whyWrong: [
        null,
        'This forgets to subtract the $2x$ from the line, using $b = 4$: $16 - 4(6 - k) = 0$ gives $k = 2$. After moving $2x$ across, $b = 4 - 2 = 2$.',
        'Sign error when moving $k$ across: writing $x^2 + 2x + 6 + k = 0$ gives $4 - 4(6 + k) = 0$ and $k = -5$. Subtracting $k$ from both sides gives $6 - k$.',
        '$3$ is the $y$-coordinate of the touching point $(-1, 3)$, not the value of $k$.',
      ],
      keyIdea: 'When a line meets a curve at exactly one point (it touches), set the expressions equal, make a quadratic equal to 0, then set $b^2 - 4ac = 0$ and solve for the unknown.',
    },
    check: {
      optionValues: [5, 2, -5, 3],
      compute: () => {
        // x^2 + (4 - 2)x + (6 - k) = 0 has discriminant 0  ->  b^2 = 4(6 - k)
        const b = 4 - 2;
        return 6 - (b * b) / 4;
      },
    },
  },
  {
    id: 'simultaneous-equations-018',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    stem: 'Boxes A and B together weigh 13 kg, B and C weigh 17 kg, and A and C weigh 16 kg. How much does box B weigh?',
    options: ['$23$ kg', '$30$ kg', '$7$ kg', '$6$ kg'],
    correctIndex: 2,
    markScheme: {
      asking: 'How heavy is box B by itself?',
      solution:
        'Let $a$, $b$ and $c$ be the weights of boxes A, B and C in kg. The facts are $a + b = 13$, $b + c = 17$ and $a + c = 16$.\n\n' +
        'Each box appears in exactly two equations, so adding all three counts each box twice: $(a + b) + (b + c) + (a + c) = 13 + 17 + 16$. This gives $2a + 2b + 2c = 46$.\n\n' +
        'Divide both sides by 2 to get the weight of all three: $a + b + c = 23$.\n\n' +
        'We know A and C together are 16. Taking those away from the total leaves B alone: $b = 23 - 16 = 7$.',
      conclusion: 'Then $a = 13 - 7 = 6$ and $c = 17 - 7 = 10$, and those add to 16 as stated. So the answer is $7$ kg.',
      whyWrong: [
        '$23$ kg is the total weight of all three boxes, $a + b + c$, not box B on its own.',
        'This forgets to halve: adding the three equations gives $2(a + b + c) = 46$, so the total is $23$, not $46$. Then $46 - 16 = 30$.',
        null,
        '$6$ kg is box A: it comes from subtracting the B and C pair ($23 - 17$) instead of the A and C pair.',
      ],
      keyIdea: 'When equations give sums of pairs, add them all. Each unknown appears the same number of times, so you can find the total. Subtract the pair that leaves out the unknown you want.',
    },
    check: {
      optionValues: [23, 30, 7, 6],
      compute: () =>
        solve3(
          [
            [1, 1, 0],
            [0, 1, 1],
            [1, 0, 1],
          ],
          [13, 17, 16],
        )[1].value(),
    },
  },
];
