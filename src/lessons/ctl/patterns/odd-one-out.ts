import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'odd-one-out',
  know:
    '### What these questions test\n\n' +
    'All the questions in this topic ask the same thing in different clothes: **can you spot a hidden rule from a few examples, and then use it?** You will meet three main types:\n\n' +
    '- **Function machines (rules from examples):** a table of inputs and outputs, and you must find the output for a new input (or the input for a given output).\n' +
    '- **Odd one out:** four numbers, words or shapes; three share a property and one does not.\n' +
    '- **Analogies:** "A is to B as C is to ?". The same change that turns A into B must turn C into the answer.\n\n' +
    'The maths is usually simple. What matters is a **calm, systematic search** and **checking your rule on every example**.\n\n' +
    '### Function machines: finding the rule\n\n' +
    'Work through these steps in order.\n\n' +
    '1. **Look at the differences.** Subtract each output from the next one. If the inputs go up by 1 and the outputs always go up by the same amount, the rule is "multiply by that amount, then add a fixed number": $y = ax + b$.\n' +
    '2. **Find the fixed number.** Take any row: $b = \\text{output} - a \\times \\text{input}$.\n' +
    '3. **If the differences are not constant,** look at the differences of the differences (second differences). If those are constant, the rule has a square in it. Compare the outputs with $1, 4, 9, 16, \\ldots$ and see what is left over.\n' +
    '4. **If the numbers grow very fast,** compare with cubes ($1, 8, 27, 64, \\ldots$) or powers of 2 ($2, 4, 8, 16, \\ldots$).\n' +
    '5. **Check the rule on every row.** One matching row proves nothing: any two points fit some straight line.\n\n' +
    'Careful: if the inputs go up in 2s, a jump of 6 in the output means $a = 6 \\div 2 = 3$, not 6.\n\n' +
    '| Inputs | Outputs | Differences | Rule |\n' +
    '| --- | --- | --- | --- |\n' +
    '| $1, 2, 3, 4$ | $5, 8, 11, 14$ | $3, 3, 3$ | $y = 3x + 2$ |\n' +
    '| $1, 2, 3, 4$ | $0, 3, 8, 15$ | $3, 5, 7$ | $y = x^2 - 1$ |\n' +
    '| $1, 2, 3, 4$ | $3, 10, 29, 66$ | $7, 19, 37$ | $y = x^3 + 2$ |\n\n' +
    '### Running a machine backwards\n\n' +
    'If you know the output and want the input, undo each step with its **opposite** (inverse) operation, in **reverse order**: the last thing the machine did is the first thing you undo. For "multiply by 4 then add 5" with output $85$: subtract 5 to get $80$, then divide by 4 to get $20$. Then run your answer forwards to check.\n\n' +
    '### Rules with two inputs, or with digits\n\n' +
    'For a rule like $a \\star b$, compare each result with simple combinations: $a + b$, $ab$, $a^2$, $2a + b$. Often the result is "close to" one of them, and the left-over part is the other number. If the outputs jump around and do not grow with the inputs (for example $23 \\to 13$ but $37 \\to 58$), try working on the **separate digits** (sum, product, squares of the digits).\n\n' +
    '### Odd one out\n\n' +
    'The key rule: **the property must split the items 3 against 1.** A property that splits them 2 against 2 is not the answer, and a one-off fact ("it is the biggest") is not a shared property. Run through this checklist:\n\n' +
    '- **Numbers:** even or odd; multiples of 3, 5, 7; prime; perfect square; cube; triangular ($1, 3, 6, 10, 15, 21, 28, \\ldots$); digit sums; a pattern inside each pair.\n' +
    '- **Words:** palindromes (read the same backwards), anagrams (same letters rearranged, so sort the letters), category (e.g. one is not a programming language).\n' +
    '- **Shapes described in words:** number of sides, right angles, equal sides, pairs of parallel sides, lines of symmetry, 2D or 3D.\n' +
    '- **Code expressions:** evaluate each one exactly as Python 3 would. Remember that `int(3.9)` chops off the decimals (giving `3`), `7 // 2` rounds down (giving `3`), and `round(2.5)` sends an exact half to the nearest **even** whole number (giving `2`).\n\n' +
    'Beware of "fake primes": $51 = 3 \\times 17$, $57 = 3 \\times 19$, $87 = 3 \\times 29$ and $91 = 7 \\times 13$.\n\n' +
    '### Analogies\n\n' +
    'Find the change that turns the first item into the second, then apply exactly the same change to the third. With letters, use alphabet positions ($A = 1$, $B = 2$, ..., $Z = 26$). With numbers, a single pair is often ambiguous ($3 \\to 27$ could be "times 9" or "cubed"), so use every pair you are given and choose the rule that fits all of them.',
  formulas: [
    { label: 'Linear rule (constant differences)', tex: 'y = ax + b', note: '$a$ = change in output for each increase of $1$ in the input; $b$ = the fixed number added.' },
    { label: 'Finding the multiplier and the fixed number', tex: 'a = \\frac{y_2 - y_1}{x_2 - x_1}, \\qquad b = y_1 - a x_1', note: 'Use two rows of the table, then check the rule on a third.' },
    { label: 'Reversing a "multiply then add" machine', tex: 'y = ax + b \\;\\Rightarrow\\; x = \\frac{y - b}{a}', note: 'Undo the last step first: subtract $b$, then divide by $a$.' },
    { label: 'Quadratic test', tex: '\\text{second differences constant} \\;\\Rightarrow\\; \\text{rule contains } x^2', note: 'Compare the outputs with $1, 4, 9, 16, 25, \\ldots$ and see what is left over.' },
    { label: 'Triangular numbers', tex: 'T_n = \\frac{n(n+1)}{2}: \\; 1, 3, 6, 10, 15, 21, 28, 36, 45, 55', note: '$N$ is triangular exactly when $8N + 1$ is a perfect square.' },
    { label: 'Squares and cubes to know', tex: '1, 4, 9, 16, 25, 36, 49, 64, 81, 100 \\qquad 1, 8, 27, 64, 125', note: 'Many rules are "square (or cube) plus or minus a small number".' },
    { label: 'Divisibility by 3', tex: '3 \\mid N \\iff 3 \\mid (\\text{digit sum of } N)', note: 'Example: $87$ has digit sum $15$, so $87$ is a multiple of $3$.' },
    { label: 'Prime test', tex: '\\text{test only the primes } p \\le \\sqrt{N}', note: 'For $67$: $\\sqrt{67} < 9$, so test $2, 3, 5, 7$ only.' },
    { label: 'Pythagorean triples', tex: 'a^2 + b^2 = c^2: \\; (3, 4, 5), \\; (5, 12, 13), \\; (8, 15, 17), \\; (7, 24, 25)' },
    { label: 'Alphabet positions', tex: 'A = 1, \\; B = 2, \\; \\ldots, \\; M = 13, \\; \\ldots, \\; Z = 26' },
  ],
  examples: [
    {
      title: 'Find a linear rule and use it',
      problem: 'A function machine turns $1, 2, 3, 4$ into $1, 4, 7, 10$. What does it turn $20$ into?',
      steps: [
        'Differences: $4 - 1 = 3$, $7 - 4 = 3$, $10 - 7 = 3$. Constant, so the rule is "multiply by $3$, then add or subtract something".',
        'Fixed number: for input $1$, $3 \\times 1 = 3$ but the output is $1$, so subtract $2$. Rule: $y = 3x - 2$.',
        'Check on the last row: $3 \\times 4 - 2 = 10$. Correct.',
        'Apply: $3 \\times 20 - 2 = 58$.',
      ],
      answer: '$58$',
    },
    {
      title: 'Run a machine backwards',
      problem: 'A machine multiplies its input by $5$ and then subtracts $3$. The output is $42$. What was the input?',
      steps: [
        'The last step was "subtract 3", so undo it first: $42 + 3 = 45$.',
        'Then undo "multiply by 5": $45 \\div 5 = 9$.',
        'Check forwards: $5 \\times 9 - 3 = 42$. Correct.',
      ],
      answer: '$9$',
    },
    {
      title: 'Odd one out in numbers',
      problem: 'Which is the odd one out: $25$, $64$, $121$, $150$?',
      steps: [
        'Even or odd: $64$ and $150$ are even, $25$ and $121$ are odd. That is 2 against 2, so it is not the rule.',
        'Multiples of 5: $25$ and $150$. Again 2 against 2.',
        'Perfect squares: $25 = 5^2$, $64 = 8^2$, $121 = 11^2$, but $150$ lies between $12^2 = 144$ and $13^2 = 169$. That is 3 against 1.',
      ],
      answer: '$150$ (the only number that is not a perfect square)',
    },
    {
      title: 'An analogy with three examples',
      problem: '$2$ is to $6$, $4$ is to $20$, and $7$ is to $56$. Using the same rule, $9$ is to what?',
      steps: [
        'A straight-line rule through the first two pairs would add $7$ per step ($y = 7x - 8$), but that gives $7 \\times 7 - 8 = 41$ for input $7$, not $56$. So the rule is not linear.',
        'The outputs grow fast, so compare with squares: $2^2 = 4$, $4^2 = 16$, $7^2 = 49$. The leftovers are $2$, $4$ and $7$: the input itself.',
        'Rule: $y = x^2 + x = x(x + 1)$. Check: $2 \\times 3 = 6$, $4 \\times 5 = 20$, $7 \\times 8 = 56$. All correct.',
        'Apply: $9 \\times 10 = 90$.',
      ],
      answer: '$90$',
    },
  ],
  traps: [
    'Building the rule from **one example only**. $1 \\to 5$ suggests "times 5", but $2 \\to 7$ immediately breaks it. Always test the rule on every row.',
    'Answering for the **next row** of the table instead of the input actually asked for (for example giving the output for input $5$ when the question asks about input $10$).',
    'Reversing a machine in the **wrong order** or with the wrong operation. Undo the last step first, and use the opposite operation (undo "subtract 2" by adding 2).',
    'Choosing an odd one out because of a property that splits the items **2 against 2**, or a one-off fact such as "it is the largest". The right property is shared by exactly three items.',
    'Believing that numbers such as $51$, $57$, $87$ and $91$ are prime. Use the digit-sum test for 3 and try 7 before deciding.',
    'Forgetting a finishing step: the "+ 1" in $x^2 + 1$, or the square root in a Pythagoras rule ($\\sqrt{8^2 + 15^2} = 17$, not $289$).',
  ],
  examTip:
    'These questions are made for elimination, and you have about a minute each. For a function machine, work out the rule, check it on every row of the table, then use it; for "which input?" questions you can also **plug each option in**: run it forwards through the machine and see which one gives the stated output. The wrong options are built from typical slips (forgetting the added number, using the next row, undoing in the wrong order), so if your answer matches one of those slips, re-check. For odd one out, quickly test each option against the checklist (parity, multiples of 3 and 5, prime, square, triangular, palindrome, anagram, parallel sides) and throw away any property that splits the options 2 against 2. For analogies, write the change as a short rule ("cube it", "shift each letter forward 1") and confirm it on every given pair before choosing.',
};
