import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'linear-equations',
  know:
    '### What is a linear equation?\n\n' +
    'A **linear equation** is one where the unknown (usually $x$) appears only to the power 1: no $x^2$, no $\\sqrt{x}$, no $x$ on the bottom of a fraction once you have tidied up. Examples: $3x - 7 = 11$ and $5(x - 2) = 3x + 4$. A linear equation almost always has exactly one answer. (Rarely the $x$ terms cancel completely: then you get either a false statement like $-6 = 4$, meaning **no** solution, or a true one like $4 = 4$, meaning **every** $x$ works.)\n\n' +
    'Think of an equation as a **balance**. Whatever you do to one side, you must do to the other side, and the balance stays level. Your job is to get $x$ on its own.\n\n' +
    '### Solving: undo, in reverse order\n\n' +
    'To solve $3x - 7 = 11$, ask "what has been done to $x$?" First it was multiplied by 3, then 7 was subtracted. Undo these in **reverse** order with the opposite operation:\n\n' +
    '1. Undo "$-7$" by adding 7 to both sides: $3x = 18$.\n' +
    '2. Undo "times 3" by dividing both sides by 3: $x = 6$.\n\n' +
    'Always finish by **checking**: $3(6) - 7 = 11$. Correct.\n\n' +
    '### Brackets and $x$ on both sides\n\n' +
    'The general recipe:\n\n' +
    '1. **Expand** every bracket. The number in front multiplies **every** term inside: $-3(2x - 5) = -6x + 15$ (minus times minus is plus).\n' +
    '2. **Collect** the $x$ terms on one side and the plain numbers on the other. A term that "moves across" changes sign, because really you are adding or subtracting it on both sides.\n' +
    '3. **Divide** by the number in front of $x$.\n\n' +
    '### Equations with fractions\n\n' +
    'Multiply **every term on both sides** by the lowest common denominator (LCD). For $\\frac{x + 3}{4} - \\frac{x - 1}{3} = 1$ the LCD is 12, giving $3(x + 3) - 4(x - 1) = 12$. Keep each numerator in a bracket so that a minus sign in front of a fraction changes the sign of the whole numerator.\n\n' +
    '### Linear inequalities\n\n' +
    'Inequalities use $<$ (less than), $>$ (greater than), $\\le$ (less than or equal to) and $\\ge$ (greater than or equal to). You solve them exactly like equations, with **one extra rule**:\n\n' +
    '**When you multiply or divide both sides by a negative number, flip the inequality sign.**\n\n' +
    'Why? $2 < 5$ is true, but multiply both sides by $-1$ and you get $-2$ and $-5$, and $-2 > -5$. Multiplying by a negative reverses the order of numbers. Adding or subtracting (any number) never flips the sign, and nor does multiplying or dividing by a positive number.\n\n' +
    'A "sandwich" like $-3 \\le 2x + 5 < 11$ is solved by doing the same thing to **all three parts** at once.\n\n' +
    '### Changing the subject of a formula\n\n' +
    'Making a letter "the subject" means rearranging so that letter is alone on one side, e.g. turning $v = u + at$ into $t = \\frac{v - u}{a}$. It is just solving an equation where the other letters behave like numbers. If the new subject appears **twice**, collect both terms on one side and **factorise** it out: $xy - 2x = y + 3$ becomes $x(y - 2) = y + 3$.\n\n' +
    '### Absolute value\n\n' +
    'The absolute value $|A|$ is the **size** of $A$ without its sign, i.e. its distance from 0: $|5| = 5$ and $|-5| = 5$. So it is never negative.\n\n' +
    '| Type | Means | Shape of answer |\n' +
    '| --- | --- | --- |\n' +
    '| $\\lvert A \\rvert = c$ | $A = c$ or $A = -c$ | two values |\n' +
    '| $\\lvert A \\rvert < c$ | $-c < A < c$ | one interval (between) |\n' +
    '| $\\lvert A \\rvert > c$ | $A > c$ or $A < -c$ | two outer pieces |\n\n' +
    'The same patterns work with $\\le$ and $\\ge$ (just keep the end values). These rules are for a positive number $c$. If $c$ is negative, $|A| = c$ and $|A| < c$ have **no** solutions at all, because an absolute value is never negative.\n\n' +
    'If the other side contains $x$ (like $|x + 1| = 2x - 4$), solve both cases and then **check** each answer in the original equation: reject any answer that makes the right-hand side negative. For $|A| = |B|$, use $A = B$ or $A = -B$.',
  formulas: [
    { label: 'Balance rule', tex: 'a = b \\;\\Rightarrow\\; a + k = b + k, \\quad ak = bk, \\quad \\frac{a}{k} = \\frac{b}{k} \\; (k \\ne 0)', note: 'Do the same thing to both sides.' },
    { label: 'Expanding a bracket', tex: 'k(a + b) = ka + kb, \\qquad -(a - b) = -a + b', note: 'The number in front multiplies every term inside.' },
    { label: 'General linear equation', tex: 'ax + b = c \\;\\Rightarrow\\; x = \\frac{c - b}{a} \\quad (a \\ne 0)' },
    { label: 'No solution / infinitely many', tex: 'ax = b: \\quad a = 0,\\ b \\ne 0 \\Rightarrow \\text{no solution}; \\quad a = 0,\\ b = 0 \\Rightarrow \\text{every } x' },
    { label: 'Inequality flip rule', tex: 'a < b \\;\\text{ and }\\; k < 0 \\;\\Rightarrow\\; ka > kb', note: 'Multiplying or dividing by a negative reverses the sign. Adding or subtracting never does.' },
    { label: 'Absolute value: definition', tex: '|x| = \\begin{cases} x & x \\ge 0 \\\\ -x & x < 0 \\end{cases}' },
    { label: 'Absolute value equation', tex: '|A| = c \\;(c > 0) \\iff A = c \\;\\text{ or }\\; A = -c' },
    { label: 'Absolute value: less than', tex: '|A| < c \\iff -c < A < c' },
    { label: 'Absolute value: greater than', tex: '|A| > c \\iff A > c \\;\\text{ or }\\; A < -c' },
    { label: 'Equal absolute values', tex: '|A| = |B| \\iff A = B \\;\\text{ or }\\; A = -B' },
  ],
  examples: [
    {
      title: 'Brackets on both sides',
      problem: 'Solve $5(x - 2) = 3x + 4$.',
      steps: [
        'Expand the bracket (5 multiplies both terms): $5x - 10 = 3x + 4$.',
        'Subtract $3x$ from both sides: $2x - 10 = 4$.',
        'Add 10 to both sides: $2x = 14$.',
        'Divide both sides by 2: $x = 7$.',
        'Check: $5(7 - 2) = 25$ and $3(7) + 4 = 25$. They match.',
      ],
      answer: '$x = 7$',
    },
    {
      title: 'An inequality that flips',
      problem: 'Solve $\\frac{4 - 3x}{2} \\le x + 7$.',
      steps: [
        'Multiply both sides by 2 (positive, no flip): $4 - 3x \\le 2x + 14$.',
        'Subtract $2x$ from both sides: $4 - 5x \\le 14$.',
        'Subtract 4 from both sides: $-5x \\le 10$.',
        'Divide by $-5$, which is negative, so flip the sign: $x \\ge -2$.',
        'Check with $x = 0$: $\\frac{4}{2} = 2 \\le 7$, true. So numbers above $-2$ work.',
      ],
      answer: '$x \\ge -2$',
    },
    {
      title: 'Changing the subject when it appears twice',
      problem: 'Make $x$ the subject of $y = \\frac{2x + 3}{x - 1}$.',
      steps: [
        'Multiply both sides by $(x - 1)$: $y(x - 1) = 2x + 3$.',
        'Expand: $xy - y = 2x + 3$.',
        'Collect the $x$ terms on the left, the rest on the right: $xy - 2x = y + 3$.',
        'Factorise out $x$: $x(y - 2) = y + 3$.',
        'Divide by $(y - 2)$: $x = \\frac{y + 3}{y - 2}$.',
      ],
      answer: '$x = \\frac{y + 3}{y - 2}$',
    },
    {
      title: 'Absolute value with x on the other side',
      problem: 'Solve $|x + 1| = 2x - 4$.',
      steps: [
        'Case 1: $x + 1 = 2x - 4$, so $x = 5$.',
        'Case 2: $-(x + 1) = 2x - 4$, i.e. $-x - 1 = 2x - 4$, so $3 = 3x$ and $x = 1$.',
        'Check $x = 5$: $|6| = 6$ and $2(5) - 4 = 6$. Works.',
        'Check $x = 1$: $|2| = 2$ but $2(1) - 4 = -2$. An absolute value cannot be negative, so reject $x = 1$.',
      ],
      answer: '$x = 5$ only',
    },
    {
      title: 'An absolute value inequality',
      problem: 'Solve $|2x + 1| > 5$.',
      steps: [
        '"Greater than 5 in size" means $2x + 1$ is more than 5 away from 0, so **either** $2x + 1 > 5$ **or** $2x + 1 < -5$.',
        'Case 1: $2x + 1 > 5$. Subtract 1: $2x > 4$. Divide by 2: $x > 2$.',
        'Case 2: $2x + 1 < -5$. Subtract 1: $2x < -6$. Divide by 2: $x < -3$.',
        'Check: $x = 3$ gives $|7| = 7 > 5$ (true); $x = 0$ gives $|1| = 1$, which is not greater than 5 (false, and 0 is correctly left out).',
      ],
      answer: '$x < -3$ or $x > 2$',
    },
  ],
  traps: [
    'Multiplying only the first term of a bracket: $5(x - 2)$ is $5x - 10$, not $5x - 2$. With a negative in front, every sign inside changes: $-3(2x - 5) = -6x + 15$.',
    'Forgetting to flip the inequality sign when multiplying or dividing by a negative (for example $-2x > 6$ gives $x < -3$, not $x > -3$). Also do not flip when the number is positive.',
    'Clearing fractions but forgetting to multiply the other side (or a whole-number term) by the LCD as well. Every single term must be multiplied.',
    'Solving only the positive case of an absolute value equation. $|x - 4| = 7$ has two answers, 11 and $-3$.',
    'Not checking answers when the other side of an absolute value equation contains $x$: one of the "answers" may make that side negative and must be rejected.',
    'When changing the subject, dividing only part of a side, e.g. turning $v - u = at$ into $t = \\frac{v}{a} - u$. Divide the **whole** side.',
  ],
  examTip:
    'In a 4-option question the wrong options are built from exactly the slips listed above, so the fastest and safest method is often to **plug the options back in**. For an equation, substitute each value into both sides with your calculator: only one will balance. For an inequality, pick an easy test number (like 0, or a value just inside one option but outside another) and see whether it satisfies the original inequality; this eliminates "forgot to flip" options instantly. For an absolute value, check every value in each option: an option that contains a value that fails is wrong. For a rearranged formula, choose simple numbers (e.g. $u = 2$, $a = 3$, $t = 4$ so $v = 14$), then see which option gives back the right value. With about a minute per question, solve directly when it is quick, and use substitution to confirm.',
};
