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
      solution:
        'The $y$ terms are $+y$ and $-y$, so **adding** the two equations makes $y$ disappear:\n\n' +
        '$$(x + y) + (x - y) = 10 + 4$$\n\n' +
        '$$2x = 14$$\n\n' +
        'Divide both sides by 2: $x = 7$.\n\n' +
        'Check: from $x + y = 10$ we get $y = 3$, and $7 - 3 = 4$, which matches the second equation.',
      whyWrong: [
        null,
        '$3$ is the value of $y$, not $x$. Read the question carefully: it asks for $x$.',
        '$14$ is $2x$. After adding the equations you still have to divide both sides by 2.',
        '$6$ is what you get by **subtracting** the equations: $(x + y) - (x - y) = 2y = 6$. That is $2y$, not $x$.',
      ],
      keyIdea: 'When one unknown has opposite signs in the two equations, add the equations to eliminate it.',
    },
    check: { optionValues: [7, 3, 14, 6], compute: () => solve2(1, 1, 10, 1, -1, 4).x.value() },
  },
  {
    id: 'simultaneous-equations-002',
    subtopic: 'simultaneous-equations',
    difficulty: 'foundation',
    stem: 'Use substitution to solve $y = 2x + 1$ and $3x + y = 16$. Give your answer as $(x, y)$.',
    options: ['$(7, 3)$', '$(3, 7)$', '$(3, 6)$', '$\\left(\\frac{17}{5}, \\frac{39}{5}\\right)$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The first equation already tells us what $y$ is, so substitute $y = 2x + 1$ into the second equation:\n\n' +
        '$$3x + (2x + 1) = 16$$\n\n' +
        '$$5x + 1 = 16$$\n\n' +
        '$$5x = 15$$\n\n' +
        '$$x = 3$$\n\n' +
        'Now find $y$ from $y = 2x + 1$: $y = 2(3) + 1 = 7$.\n\n' +
        'Check in the second equation: $3(3) + 7 = 16$. So the solution is $(3, 7)$.',
      whyWrong: [
        'This has $x$ and $y$ the wrong way round. Check it: $y = 2(7) + 1 = 15$, not $3$.',
        null,
        'This forgets the $+1$ when finding $y$: $y = 2(3) + 1 = 7$, not $2(3) = 6$.',
        'This moves the $+1$ across without changing its sign, giving $5x = 16 + 1 = 17$. It should be $5x = 16 - 1 = 15$.',
      ],
      keyIdea: 'If one equation gives $y$ in terms of $x$, substitute that whole expression (in brackets) into the other equation.',
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
    id: 'simultaneous-equations-003',
    subtopic: 'simultaneous-equations',
    difficulty: 'foundation',
    stem: 'Which pair $(x, y)$ satisfies **both** $2x + y = 7$ and $x - y = 2$?',
    options: ['$(2, 3)$', '$(5, 3)$', '$(3, 1)$', '$(1, 3)$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Add the equations to eliminate $y$:\n\n' +
        '$$(2x + y) + (x - y) = 7 + 2$$\n\n' +
        '$$3x = 9 \\quad\\Rightarrow\\quad x = 3$$\n\n' +
        'Then $y = x - 2 = 1$.\n\n' +
        'Check $(3, 1)$ in both: $2(3) + 1 = 7$ and $3 - 1 = 2$. Both work.\n\n' +
        'Exam shortcut: you can also test each option in **both** equations; only $(3, 1)$ passes both tests.',
      whyWrong: [
        '$(2, 3)$ works in the first equation ($4 + 3 = 7$) but not the second: $2 - 3 = -1$, not $2$. A solution must satisfy both equations.',
        '$(5, 3)$ works in the second equation ($5 - 3 = 2$) but not the first: $2(5) + 3 = 13$, not $7$.',
        null,
        '$(1, 3)$ has the right numbers in the wrong order. Check: $2(1) + 3 = 5$, not $7$.',
      ],
      keyIdea: 'A solution of a system must make every equation true at the same time, so always check both.',
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
      solution:
        'Multiply the first equation by 2:\n\n' +
        '$$4x + 6y = 12$$\n\n' +
        'But the second equation says $4x + 6y = 15$. The same expression $4x + 6y$ cannot equal both $12$ and $15$, so there is a contradiction: **no solution**.\n\n' +
        'Graph view: rearranged, the lines are $y = 2 - \\frac{2}{3}x$ and $y = \\frac{5}{2} - \\frac{2}{3}x$. Same gradient $-\\frac{2}{3}$, different $y$-intercepts, so they are parallel and never meet.',
      whyWrong: [
        'Exactly one solution needs the lines to have different gradients. Here both lines have gradient $-\\frac{2}{3}$, so they are parallel.',
        'Infinitely many solutions would need the second equation to be an exact multiple of the first, i.e. $4x + 6y = 12$. The constant is $15$, so the lines are parallel but different.',
        'Two straight lines can never meet at exactly two points: they meet once, never, or they are the same line.',
        null,
      ],
      keyIdea: 'If the left-hand sides are multiples of each other but the right-hand sides are not in the same ratio, the lines are parallel and there is no solution.',
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
    id: 'simultaneous-equations-005',
    subtopic: 'simultaneous-equations',
    difficulty: 'foundation',
    stem: 'Solve $3x + 2y = 12$ and $5x - 2y = 4$. What is the value of $y$?',
    options: ['$2$', '$-3$', '$3$', '$6$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The $y$ terms are $+2y$ and $-2y$, so **add** the equations:\n\n' +
        '$$8x = 16 \\quad\\Rightarrow\\quad x = 2$$\n\n' +
        'Substitute $x = 2$ into the first equation:\n\n' +
        '$$3(2) + 2y = 12$$\n\n' +
        '$$6 + 2y = 12$$\n\n' +
        '$$2y = 6 \\quad\\Rightarrow\\quad y = 3$$\n\n' +
        'Check in the second equation: $5(2) - 2(3) = 10 - 6 = 4$.',
      whyWrong: [
        '$2$ is the value of $x$; the question asks for $y$.',
        'Sign slip when finding $y$ from the second equation: $5(2) - 2y = 4$ gives $-2y = -6$, and a negative divided by a negative is **positive**, so $y = 3$, not $-3$. (Checking $y = -3$ in the first equation gives $6 - 6 = 0$, not $12$.)',
        null,
        '$6$ is $2y$. Divide by 2 to get $y = 3$.',
      ],
      keyIdea: 'Same sign: subtract the equations. Different signs: add them.',
    },
    check: { optionValues: [2, -3, 3, 6], compute: () => solve2(3, 2, 12, 5, -2, 4).y.value() },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'simultaneous-equations-006',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    stem: 'Solve the simultaneous equations $3x + 2y = 4$ and $5x - 4y = 14$. Give your answer as $(x, y)$.',
    options: ['$(2, 1)$', '$(2, -1)$', '$\\left(\\frac{18}{11}, -\\frac{5}{11}\\right)$', '$(-1, 2)$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Make the $y$ coefficients match: multiply **every term** of the first equation by 2.\n\n' +
        '$$6x + 4y = 8$$\n\n' +
        'Now the $y$ terms are $+4y$ and $-4y$, so add this to the second equation:\n\n' +
        '$$(6x + 4y) + (5x - 4y) = 8 + 14$$\n\n' +
        '$$11x = 22 \\quad\\Rightarrow\\quad x = 2$$\n\n' +
        'Substitute into $3x + 2y = 4$:\n\n' +
        '$$6 + 2y = 4 \\quad\\Rightarrow\\quad 2y = -2 \\quad\\Rightarrow\\quad y = -1$$\n\n' +
        'Check in the second equation: $5(2) - 4(-1) = 10 + 4 = 14$. So $(x, y) = (2, -1)$.',
      whyWrong: [
        'Sign slip in the last step: $6 + 2y = 4$ gives $2y = 4 - 6 = -2$, not $+2$. Checking $(2, 1)$ in the second equation gives $10 - 4 = 6$, not $14$.',
        null,
        'This multiplies only the left side of the first equation by 2, writing $6x + 4y = 4$. Then $11x = 18$. You must multiply **every** term, including the constant: $6x + 4y = 8$.',
        'These are the right numbers in the wrong order. Check: $3(-1) + 2(2) = 1$, not $4$.',
      ],
      keyIdea: 'Scale one equation (every term, including the constant) so that one unknown has matching coefficients, then add or subtract.',
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
      solution:
        'You do not need $x$ and $y$ separately. **Add** the two equations:\n\n' +
        '$$(3x + 2y) + (2x + 3y) = 17 + 13$$\n\n' +
        '$$5x + 5y = 30$$\n\n' +
        'Divide by 5: $x + y = 6$.\n\n' +
        '(Full solution, if you want it: subtracting the equations gives $x - y = 4$; together with $x + y = 6$ this gives $x = 5$, $y = 1$. Check: $15 + 2 = 17$ and $10 + 3 = 13$, and $5 + 1 = 6$.)',
      whyWrong: [
        '$4$ is $x - y$, which you get by **subtracting** the equations. The question asks for $x + y$.',
        '$30$ is $5x + 5y = 5(x + y)$. You still need to divide by 5.',
        null,
        '$5$ is the value of $x$ alone; the question asks for $x + y = 5 + 1$.',
      ],
      keyIdea: 'When the coefficients are "swapped" between the equations, adding (or subtracting) them gives $x + y$ (or $x - y$) directly.',
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
      solution:
        'Let $a$ = number of adult tickets and $c$ = number of child tickets.\n\n' +
        '- Number of tickets: $a + c = 7$\n' +
        '- Total cost: $45a + 30c = 255$\n\n' +
        'From the first equation, $c = 7 - a$. Substitute into the second:\n\n' +
        '$$45a + 30(7 - a) = 255$$\n\n' +
        '$$45a + 210 - 30a = 255$$\n\n' +
        '$$15a = 45 \\quad\\Rightarrow\\quad a = 3$$\n\n' +
        'So $c = 4$. Check: $45(3) + 30(4) = 135 + 120 = 255$.',
      whyWrong: [
        '$4$ is the number of **child** tickets. The question asks for adult tickets.',
        null,
        'This drops the $210$ when expanding $30(7 - a)$, giving $15a = 255$ and $a = 17$, which is impossible as only 7 tickets were bought.',
        'This divides the extra AED 45 by the adult price (45) instead of by the price **difference** $45 - 30 = 15$. Each swap from child to adult adds only AED 15.',
      ],
      keyIdea: 'Turn each sentence of a word problem into one equation (count and total value), then solve the pair.',
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
      solution:
        'At a meeting point both $y$ values are equal, so set the right-hand sides equal:\n\n' +
        '$$x^2 - 3x + 4 = x + 1$$\n\n' +
        'Bring everything to one side (subtract $x$ and subtract 1):\n\n' +
        '$$x^2 - 4x + 3 = 0$$\n\n' +
        'Factorise: $(x - 1)(x - 3) = 0$, so $x = 1$ or $x = 3$.\n\n' +
        'Find each $y$ from the line $y = x + 1$: $x = 1$ gives $y = 2$, and $x = 3$ gives $y = 4$.\n\n' +
        'Check in the curve: $1 - 3 + 4 = 2$ and $9 - 9 + 4 = 4$. The points are $(1, 2)$ and $(3, 4)$.',
      whyWrong: [
        null,
        'These use the correct $x$ values but put $y = 0$. Those are where $x^2 - 4x + 3$ crosses the $x$-axis, not where the line meets the curve; substitute back to find $y$.',
        'Sign error when reading the roots: $(x - 1)(x - 3) = 0$ gives $x = 1$ and $x = 3$, not $-1$ and $-3$.',
        'This comes from a sign slip when moving $x$ across, giving $x^2 - 2x + 3 = 0$, whose discriminant $4 - 12$ is negative. The correct equation $x^2 - 4x + 3 = 0$ has two real roots.',
      ],
      keyIdea: 'For a line and a curve, substitute the line into the curve to get a quadratic, solve it, then find each $y$ from the line.',
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
      solution:
        'Eliminate $z$ twice, then solve the 2 by 2 system that is left.\n\n' +
        '- First + third: $(x + y + z) + (x + 2y - z) = 6 + 2$, so $2x + 3y = 8$.\n' +
        '- Second + third: $(2x - y + z) + (x + 2y - z) = 3 + 2$, so $3x + y = 5$.\n\n' +
        'From $3x + y = 5$: $y = 5 - 3x$. Substitute into $2x + 3y = 8$:\n\n' +
        '$$2x + 3(5 - 3x) = 8 \\quad\\Rightarrow\\quad 2x + 15 - 9x = 8 \\quad\\Rightarrow\\quad -7x = -7 \\quad\\Rightarrow\\quad x = 1$$\n\n' +
        'Then $y = 5 - 3 = 2$ and $z = 6 - 1 - 2 = 3$.\n\n' +
        'Check all three: $1 + 2 + 3 = 6$, $2 - 2 + 3 = 3$, $1 + 4 - 3 = 2$.\n\n' +
        'Exam shortcut: substitute each option into **all three** equations; every wrong option fails one of them.',
      whyWrong: [
        '$(3, 3, 0)$ satisfies the first two equations but fails the third: with $z = 0$ it gives $3 + 2(3) = 9$, not $2$. You must check every equation.',
        null,
        '$(4, 0, 2)$ satisfies the first and third equations but fails the second: with $y = 0$ it gives $2(4) + 2 = 10$, not $3$.',
        '$(2, -1, -2)$ satisfies the second and third equations but fails the first: $2 - 1 - 2 = -1$, not $6$.',
      ],
      keyIdea: 'With three unknowns, eliminate the same variable from two different pairs of equations to get a 2 by 2 system, and always check the answer in all three.',
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
      solution:
        'There is no solution when the lines are parallel, i.e. when the $x$ and $y$ coefficients are in the same ratio:\n\n' +
        '$$\\frac{2}{3} = \\frac{k}{6} \\quad\\Rightarrow\\quad 3k = 12 \\quad\\Rightarrow\\quad k = 4$$\n\n' +
        '(Equivalently, the determinant $2 \\times 6 - 3k$ must be $0$.)\n\n' +
        'Check the constants: with $k = 4$, multiplying the first equation by $\\frac{3}{2}$ gives $3x + 6y = 6$, but the second equation says $3x + 6y = 7$. Contradiction, so there is no solution (not infinitely many).',
      whyWrong: [
        'This sets the ratio up upside down: $\\frac{2}{3} = \\frac{6}{k}$ gives $k = 9$. Compare $x$-coefficient with $x$-coefficient and $y$ with $y$, in the same order: $\\frac{2}{3} = \\frac{k}{6}$.',
        'Sign error: the determinant condition is $12 - 3k = 0$, so $k = 4$. Writing $12 + 3k = 0$ gives $-4$.',
        null,
        'This just copies the $y$-coefficient of the second equation. The $x$-coefficients are $2$ and $3$, so the $y$-coefficients must be in the same ratio: $4$ and $6$.',
      ],
      keyIdea: 'Two linear equations have no unique solution exactly when $ae - bd = 0$; then check the constants to decide between none and infinitely many.',
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
      solution:
        'Let $p$ = price of a pen and $n$ = price of a notebook (in AED).\n\n' +
        '$$3p + 2n = 21$$\n\n' +
        '$$5p + 4n = 37$$\n\n' +
        'Double the first equation so the $n$ terms match: $6p + 4n = 42$.\n\n' +
        'Subtract the second equation: $(6p + 4n) - (5p + 4n) = 42 - 37$, so $p = 5$.\n\n' +
        'Substitute into $3p + 2n = 21$: $15 + 2n = 21$, so $2n = 6$ and $n = 3$.\n\n' +
        'Check: $5(5) + 4(3) = 25 + 12 = 37$. One notebook costs AED 3.',
      whyWrong: [
        'AED 5 is the price of a **pen**, not a notebook.',
        'This subtracts the equations without scaling first: $(5p + 4n) - (3p + 2n) = 2p + 2n = 16$, so $p + n = 8$. That is the price of one pen **plus** one notebook.',
        'AED 6 is $2n$, the price of two notebooks. Divide by 2.',
        null,
      ],
      keyIdea: 'Scale an equation so one unknown has the same coefficient in both, then subtract to eliminate it.',
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
      solution:
        'Divide the second equation by 2:\n\n' +
        '$$3x - y = 5$$\n\n' +
        'This has exactly the same left-hand side as the first equation $3x - y = c$.\n\n' +
        '- If $c = 5$, the two equations describe the **same line**, so every point on it is a solution: infinitely many solutions.\n' +
        '- If $c \\ne 5$, the lines are parallel and distinct: no solution.\n\n' +
        'So $c = 5$.',
      whyWrong: [
        'This copies the constant without scaling. The second equation is **twice** the first, so its constant $10$ must be twice $c$.',
        null,
        'This doubles $10$ instead of halving it. The second equation is twice the first, so its constant is twice $c$: $2c = 10$, which gives $c = 5$, not $2 \\times 10 = 20$.',
        'This is the condition for **no** solution: when $c \\ne 5$ the lines are parallel but different, so they never meet.',
      ],
      keyIdea: 'Infinitely many solutions means one equation is an exact multiple of the other, constants included.',
    },
    check: {
      optionValues: [10, 5, 20, null],
      compute: () => {
        const scale = 6 / 3; // second equation's x-coefficient over the first's
        return 10 / scale;
      },
    },
  },

  // ------------------------------------------------------------------ challenge
  {
    id: 'simultaneous-equations-014',
    subtopic: 'simultaneous-equations',
    difficulty: 'challenge',
    stem: 'Solve $\\frac{2}{x} + \\frac{3}{y} = 2$ and $\\frac{4}{x} - \\frac{9}{y} = -1$. Give your answer as $(x, y)$.',
    options: ['$\\left(\\frac{1}{2}, \\frac{1}{3}\\right)$', '$(3, 2)$', '$\\left(10, \\frac{5}{3}\\right)$', '$(2, 3)$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'These are not linear in $x$ and $y$, but they **are** linear in $u = \\frac{1}{x}$ and $v = \\frac{1}{y}$:\n\n' +
        '$$2u + 3v = 2$$\n\n' +
        '$$4u - 9v = -1$$\n\n' +
        'Multiply the first by 3 (every term): $6u + 9v = 6$. Add to the second:\n\n' +
        '$$10u = 5 \\quad\\Rightarrow\\quad u = \\frac{1}{2}$$\n\n' +
        'Substitute: $2 \\times \\frac{1}{2} + 3v = 2$, so $3v = 1$ and $v = \\frac{1}{3}$.\n\n' +
        'Undo the substitution: $x = \\frac{1}{u} = 2$ and $y = \\frac{1}{v} = 3$.\n\n' +
        'Check: $\\frac{2}{2} + \\frac{3}{3} = 2$ and $\\frac{4}{2} - \\frac{9}{3} = 2 - 3 = -1$. So $(x, y) = (2, 3)$.',
      whyWrong: [
        'These are $u$ and $v$. You must undo the substitution: $x = \\frac{1}{u}$ and $y = \\frac{1}{v}$.',
        'The numbers are swapped. Check: $\\frac{2}{3} + \\frac{3}{2} = \\frac{13}{6}$, not $2$.',
        'This multiplies only the left side by 3, writing $6u + 9v = 2$. Then $10u = 1$, $u = \\frac{1}{10}$, $x = 10$, and $y$ comes out as $\\frac{5}{3}$. Every term must be multiplied, including the constant.',
        null,
      ],
      keyIdea: 'A clever substitution (here $u = \\frac{1}{x}$, $v = \\frac{1}{y}$) can turn a non-linear system into an ordinary linear one; remember to convert back at the end.',
    },
    check: {
      optionValues: ['1/2,1/3', '3,2', '10,5/3', '2,3'],
      compute: () => {
        const { x: u, y: v } = solve2(2, 3, 2, 4, -9, -1);
        return `${new Frac(u.d, u.n)},${new Frac(v.d, v.n)}`;
      },
    },
  },
  {
    id: 'simultaneous-equations-015',
    subtopic: 'simultaneous-equations',
    difficulty: 'challenge',
    stem: 'Solve the simultaneous equations $2^x + 3^y = 17$ and $2^{x+1} - 3^y = 7$. Give your answer as $(x, y)$.',
    options: ['$(8, 9)$', '$(3, 2)$', '$(4, 3)$', '$(2, 3)$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'First rewrite $2^{x+1} = 2 \\times 2^x$. Now let $a = 2^x$ and $b = 3^y$:\n\n' +
        '$$a + b = 17$$\n\n' +
        '$$2a - b = 7$$\n\n' +
        'Add the equations: $3a = 24$, so $a = 8$. Then $b = 17 - 8 = 9$.\n\n' +
        'Convert back:\n\n' +
        '- $2^x = 8 = 2^3$, so $x = 3$\n' +
        '- $3^y = 9 = 3^2$, so $y = 2$\n\n' +
        'Check: $2^3 + 3^2 = 8 + 9 = 17$ and $2^4 - 3^2 = 16 - 9 = 7$. So $(x, y) = (3, 2)$.',
      whyWrong: [
        'These are the values of $a = 2^x$ and $b = 3^y$. You still need to solve $2^x = 8$ and $3^y = 9$.',
        null,
        'This treats $2^x = 8$ as $2x = 8$ and $3^y = 9$ as $3y = 9$, i.e. multiplication instead of powers. In fact $2^4 = 16$, not $8$.',
        'The exponents are swapped. Check: $2^2 + 3^3 = 4 + 27 = 31$, not $17$.',
      ],
      keyIdea: 'Substitute $a = 2^x$, $b = 3^y$ (using $2^{x+1} = 2 \\times 2^x$) to get a linear system, then convert back with powers.',
    },
    check: {
      optionValues: ['8,9', '3,2', '4,3', '2,3'],
      compute: () => {
        const { x: a, y: b } = solve2(1, 1, 17, 2, -1, 7);
        let x = 0;
        while (2 ** x < a.value()) x++;
        let y = 0;
        while (3 ** y < b.value()) y++;
        return 2 ** x === a.value() && 3 ** y === b.value() ? `${x},${y}` : 'no integer solution';
      },
    },
  },
  {
    id: 'simultaneous-equations-016',
    subtopic: 'simultaneous-equations',
    difficulty: 'challenge',
    stem: 'Solve the system below. What is the value of $y$?\n\n$$x + y + z = 4$$\n\n$$2x + y - z = 0$$\n\n$$x - 2y + 2z = 10$$',
    options: ['$1$', '$-\\frac{1}{2}$', '$-1$', '$-\\frac{11}{5}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Eliminate $z$ from two different pairs.\n\n' +
        '- First + second: the $z$ terms cancel and the right-hand sides add to $4$, so $3x + 2y = 4$. Call this (A).\n' +
        '- Third minus twice the first: $(x - 2y + 2z) - (2x + 2y + 2z) = 10 - 8$, so $-x - 4y = 2$. Call this (B).\n\n' +
        'From (B): $x = -2 - 4y$. Substitute into (A):\n\n' +
        '$$3(-2 - 4y) + 2y = 4$$\n\n' +
        '$$-6 - 12y + 2y = 4$$\n\n' +
        '$$-10y = 10 \\quad\\Rightarrow\\quad y = -1$$\n\n' +
        'Then $x = -2 - 4(-1) = 2$ and $z = 4 - 2 - (-1) = 3$.\n\n' +
        'Check the third equation: $2 - 2(-1) + 2(3) = 2 + 2 + 6 = 10$. So $y = -1$.',
      whyWrong: [
        'Sign slip in the last division: $-10y = 10$ gives $y = -1$, not $+1$.',
        'This doubles the $y$ and $z$ terms of the first equation but forgets to double $x$, writing $x + 2y + 2z = 8$. Subtracting then gives $-4y = 2$. When you multiply an equation, multiply **every** term.',
        null,
        'This forgets to double the right-hand side when forming "third minus twice the first", using $10 - 4 = 6$ instead of $10 - 8 = 2$. That gives $-x - 4y = 6$ and leads to $y = -\\frac{11}{5}$.',
      ],
      keyIdea: 'To solve three equations in three unknowns, eliminate one variable from two different pairs, solve the resulting 2 by 2 system, then back-substitute.',
    },
    check: {
      optionValues: [1, -0.5, -1, -2.2],
      compute: () =>
        solve3(
          [
            [1, 1, 1],
            [2, 1, -1],
            [1, -2, 2],
          ],
          [4, 0, 10],
        )[1].value(),
    },
  },
  {
    id: 'simultaneous-equations-017',
    subtopic: 'simultaneous-equations',
    difficulty: 'challenge',
    stem: 'The line $y = 2x + k$ meets the curve $y = x^2 + 4x + 6$ at **exactly one** point. Find $k$.',
    options: ['$5$', '$2$', '$-5$', '$3$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Set the two expressions for $y$ equal:\n\n' +
        '$$x^2 + 4x + 6 = 2x + k$$\n\n' +
        'Bring everything to one side:\n\n' +
        '$$x^2 + 2x + (6 - k) = 0$$\n\n' +
        'Exactly one meeting point means this quadratic has exactly one (repeated) root, so the discriminant is zero:\n\n' +
        '$$b^2 - 4ac = 2^2 - 4(1)(6 - k) = 0$$\n\n' +
        '$$4 - 24 + 4k = 0 \\quad\\Rightarrow\\quad 4k = 20 \\quad\\Rightarrow\\quad k = 5$$\n\n' +
        'Check: with $k = 5$ the quadratic is $x^2 + 2x + 1 = (x + 1)^2 = 0$, so $x = -1$ and $y = 2(-1) + 5 = 3$. The curve gives $1 - 4 + 6 = 3$ too: one touching point $(-1, 3)$.',
      whyWrong: [
        null,
        'This forgets to subtract the $2x$ from the line, using $b = 4$: $16 - 4(6 - k) = 0$ gives $k = 2$. After moving $2x$ across, $b = 4 - 2 = 2$.',
        'Sign error when moving $k$ across: writing $x^2 + 2x + 6 + k = 0$ gives $4 - 4(6 + k) = 0$ and $k = -5$. Subtracting $k$ from both sides gives $6 - k$.',
        '$3$ is the $y$-coordinate of the touching point $(-1, 3)$, not the value of $k$.',
      ],
      keyIdea: 'A line touches a curve (one meeting point) exactly when the quadratic you get after substituting has discriminant $0$.',
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
    difficulty: 'challenge',
    stem: 'There are three boxes, A, B and C. Boxes A and B together weigh 13 kg, boxes B and C together weigh 17 kg, and boxes A and C together weigh 16 kg. How much does box B weigh?',
    options: ['$23$ kg', '$30$ kg', '$7$ kg', '$6$ kg'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Let the weights be $a$, $b$ and $c$ (in kg):\n\n' +
        '$$a + b = 13, \\quad b + c = 17, \\quad a + c = 16$$\n\n' +
        'Add all three equations: each letter appears twice, so\n\n' +
        '$$2a + 2b + 2c = 46 \\quad\\Rightarrow\\quad a + b + c = 23$$\n\n' +
        'Box B is the total minus A and C: $b = 23 - (a + c) = 23 - 16 = 7$.\n\n' +
        '(Also $a = 23 - 17 = 6$ and $c = 23 - 13 = 10$. Check: $6 + 7 = 13$, $7 + 10 = 17$, $6 + 10 = 16$.) Box B weighs 7 kg.',
      whyWrong: [
        '$23$ kg is the total weight of all three boxes, $a + b + c$, not box B on its own.',
        'This forgets to halve: adding the three equations gives $2(a + b + c) = 46$, so the total is $23$, not $46$. Then $46 - 16 = 30$.',
        null,
        '$6$ kg is box A: it comes from subtracting the B and C pair ($23 - 17$) instead of the A and C pair.',
      ],
      keyIdea: 'In a symmetric system, adding all the equations often gives the total at once; then subtract a pair to find each unknown.',
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
