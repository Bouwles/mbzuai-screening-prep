import type { StaticQuestion } from '../../../types';
import { det3, isPrime } from '../../../lib/mathx';

// ---------------------------------------------------------------- helpers for the answer checks
const isSquare = (n: number): boolean => Number.isInteger(Math.sqrt(n));
const isTriangular = (n: number): boolean => isSquare(8 * n + 1);
const isPalindrome = (w: string): boolean => w === [...w].reverse().join('');
/** Linear rule y = a*x + b through the first two examples (checked against every example). */
function linearRule(xs: number[], ys: number[]): { a: number; b: number } {
  const a = (ys[1] - ys[0]) / (xs[1] - xs[0]);
  const b = ys[0] - a * xs[0];
  xs.forEach((x, i) => {
    if (a * x + b !== ys[i]) throw new Error('examples are not linear');
  });
  return { a, b };
}
/** Pick the only candidate rule that fits every example (throws unless exactly one fits). */
function onlyFit<T extends (...args: number[]) => number>(cands: T[], examples: number[][]): T {
  const fits = cands.filter((f) => examples.every((e) => f(...e.slice(0, -1)) === e[e.length - 1]));
  if (fits.length !== 1) throw new Error(`expected exactly one rule to fit, got ${fits.length}`);
  return fits[0];
}
/** The element whose key value differs from all the others' (shared) key value. */
function oddByKey<T>(items: T[], key: (t: T) => string | number): T {
  const keys = items.map(key);
  const odd = items.filter((_, i) => keys.filter((k) => k === keys[i]).length === 1);
  if (odd.length !== 1) throw new Error('no unique odd one out');
  return odd[0];
}

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'odd-one-out-001',
    subtopic: 'odd-one-out',
    difficulty: 'foundation',
    stem: 'A function machine takes an input and gives an output. The table shows four examples. Using the same rule, what is the output when the input is $10$?',
    table: {
      headers: ['Input', 'Output'],
      rows: [
        [1, 5],
        [2, 7],
        [3, 9],
        [4, 11],
      ],
    },
    options: ['$13$', '$20$', '$23$', '$50$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: see how the output changes.** Each time the input goes up by $1$, the output goes up by $2$ ($5, 7, 9, 11$). So the rule starts with "multiply by $2$".\n\n' +
        '**Step 2: find the fixed number.** For input $1$: $2 \\times 1 = 2$, but the output is $5$, so we must add $3$.\n\n' +
        '$$\\text{output} = 2 \\times \\text{input} + 3$$\n\n' +
        '**Step 3: check on another row.** Input $4$: $2 \\times 4 + 3 = 11$, which matches the table.\n\n' +
        '**Step 4: apply the rule.** Input $10$: $2 \\times 10 + 3 = 23$.',
      whyWrong: [
        'This is the output for input $5$, the next row of the table ($11 + 2 = 13$). The question asks for input $10$, which is six steps beyond input $4$.',
        'This is $2 \\times 10$: it spots "multiply by $2$" but forgets to add the $3$.',
        null,
        'This uses only the first example, $1 \\to 5$, and guesses "multiply by $5$". The second example already breaks that rule: $2 \\times 5 = 10$, but the table says $7$.',
      ],
      keyIdea: 'For a function machine, find how much the output changes per 1 step of input (the multiplier), then the fixed number to add, and check the rule on every row.',
    },
    check: {
      optionValues: [13, 20, 23, 50],
      compute: () => {
        const { a, b } = linearRule([1, 2, 3, 4], [5, 7, 9, 11]);
        return a * 10 + b;
      },
    },
  },
  {
    id: 'odd-one-out-002',
    subtopic: 'odd-one-out',
    difficulty: 'foundation',
    stem: 'Three of these numbers share a property that the fourth does not have. Which number is the odd one out?',
    options: ['$16$', '$49$', '$81$', '$54$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Test common number properties one at a time and look for one that splits the numbers **3 against 1**.\n\n' +
        '- **Even or odd?** $16$ and $54$ are even; $49$ and $81$ are odd. That splits them 2 against 2, so it is not the rule.\n' +
        '- **Multiple of 3?** $54$ and $81$ are; $16$ and $49$ are not. Again 2 against 2.\n' +
        '- **Perfect square?** $16 = 4^2$, $49 = 7^2$, $81 = 9^2$. But $54$ lies between $7^2 = 49$ and $8^2 = 64$, so it is **not** a square. That splits them 3 against 1.\n\n' +
        'The odd one out is $54$.',
      whyWrong: [
        '$16 = 4^2$ is a perfect square, just like $49$ and $81$. It is even, but so is $54$, so being even does not single it out.',
        '$49 = 7^2$ is a perfect square. It is odd, but so is $81$, so being odd does not single it out.',
        '$81 = 9^2$ is a perfect square. It is a multiple of $3$, but so is $54$, so that property splits the numbers 2 against 2.',
        null,
      ],
      keyIdea: 'An odd-one-out property must split the items 3 against 1; a property that splits them 2 against 2 is not the rule.',
    },
    check: {
      optionValues: [16, 49, 81, 54],
      compute: () => oddByKey([16, 49, 81, 54], (n) => String(isSquare(n))),
    },
  },
  {
    id: 'odd-one-out-003',
    subtopic: 'odd-one-out',
    difficulty: 'foundation',
    stem: 'Which word is the odd one out?',
    options: ['LEVEL', 'MOTOR', 'RADAR', 'ROTOR'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Read each word **backwards**:\n\n' +
        '| Word | Backwards | Same? |\n' +
        '| --- | --- | --- |\n' +
        '| LEVEL | LEVEL | yes |\n' +
        '| RADAR | RADAR | yes |\n' +
        '| ROTOR | ROTOR | yes |\n' +
        '| MOTOR | ROTOM | no |\n\n' +
        'LEVEL, RADAR and ROTOR are **palindromes** (they read the same in both directions). MOTOR is not, so MOTOR is the odd one out.',
      whyWrong: [
        'LEVEL reads the same forwards and backwards (L-E-V-E-L), so it shares the palindrome property with RADAR and ROTOR.',
        null,
        'RADAR is a palindrome: backwards it is still RADAR. It is the only word with an A, but that is a one-off detail, not a rule that the other three share.',
        'ROTOR looks very like MOTOR (they differ by one letter), which tempts you to pair them, but ROTOR backwards is still ROTOR, so it is a palindrome like LEVEL and RADAR.',
      ],
      keyIdea: 'With words, check structural rules such as palindromes, anagrams or letter patterns, not surface details like a single shared letter.',
    },
    check: {
      optionValues: ['LEVEL', 'MOTOR', 'RADAR', 'ROTOR'],
      compute: () => oddByKey(['LEVEL', 'MOTOR', 'RADAR', 'ROTOR'], (w) => String(isPalindrome(w))),
    },
  },
  {
    id: 'odd-one-out-004',
    subtopic: 'odd-one-out',
    difficulty: 'foundation',
    stem: 'A function machine does two things to its input, in this order: **subtract 2**, then **multiply by 4**. The output is $28$. What was the input?',
    options: ['$9$', '$7.5$', '$5$', '$104$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'To go backwards, undo each step with its **inverse** operation, in **reverse order** (like taking off your shoes before your socks).\n\n' +
        '1. The last step was "multiply by 4", so undo it first by dividing by 4: $28 \\div 4 = 7$.\n' +
        '2. The first step was "subtract 2", so undo it by adding 2: $7 + 2 = 9$.\n\n' +
        'Check by running the machine forwards: $9 - 2 = 7$, then $7 \\times 4 = 28$. Correct.\n\n' +
        'The input was $9$.',
      whyWrong: [
        null,
        'This undoes the steps in the wrong order: $(28 + 2) \\div 4 = 7.5$. The last thing the machine did was multiply by 4, so that must be undone first.',
        'This divides by 4 correctly but then subtracts 2 again instead of adding 2: $7 - 2 = 5$. To undo "subtract 2" you add 2.',
        'This runs the machine forwards on $28$: $(28 - 2) \\times 4 = 104$. The question gives the output and asks for the input.',
      ],
      keyIdea: 'To reverse a function machine, undo the steps in reverse order using inverse operations, then check by running it forwards.',
    },
    check: {
      optionValues: [9, 7.5, 5, 104],
      compute: () => {
        // brute-force search over inputs in steps of 0.25
        for (let x = -200; x <= 200; x += 0.25) if ((x - 2) * 4 === 28) return x;
        throw new Error('no input found');
      },
    },
  },
  {
    id: 'odd-one-out-005',
    subtopic: 'odd-one-out',
    difficulty: 'foundation',
    stem: '$2$ is to $8$ as $3$ is to $27$. Using the same rule, $5$ is to what?',
    options: ['$25$', '$45$', '$125$', '$15$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The rule must work for **both** examples.\n\n' +
        '- "Multiply by 4" works for $2 \\to 8$, but $3 \\times 4 = 12$, not $27$.\n' +
        '- "Multiply by 9" works for $3 \\to 27$, but $2 \\times 9 = 18$, not $8$.\n' +
        '- "Cube the number": $2^3 = 2 \\times 2 \\times 2 = 8$ and $3^3 = 3 \\times 3 \\times 3 = 27$. Both work.\n\n' +
        'So $5 \\to 5^3 = 5 \\times 5 \\times 5 = 125$.',
      whyWrong: [
        'This squares $5$ instead of cubing it. Check against the examples: $2^2 = 4$, not $8$.',
        'This uses only $3 \\to 27$ and reads it as "multiply by 9". That fails the first example: $2 \\times 9 = 18$, not $8$.',
        null,
        'This confuses "cubed" with "times 3": $5 \\times 3 = 15$. Cubing means $5 \\times 5 \\times 5$.',
      ],
      keyIdea: 'In an analogy, find the one transformation that turns every first item into its partner, then apply it to the new item.',
    },
    check: {
      optionValues: [25, 45, 125, 15],
      compute: () => {
        const rule = onlyFit(
          [(n: number) => 4 * n, (n: number) => 9 * n, (n: number) => n * n, (n: number) => n * n * n, (n: number) => 3 * n],
          [
            [2, 8],
            [3, 27],
          ],
        );
        return rule(5);
      },
    },
  },
  {
    id: 'odd-one-out-006',
    subtopic: 'odd-one-out',
    difficulty: 'foundation',
    stem: '**ACE** is to **BDF** as **MOQ** is to what?',
    options: ['NOP', 'NPR', 'LNP', 'OQS'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Turn the letters into alphabet positions ($A = 1$, $B = 2$, ...).\n\n' +
        '- ACE is $1, 3, 5$ and BDF is $2, 4, 6$: **every letter moves forward by 1**, and the gaps of 2 inside the group are kept.\n' +
        '- MOQ is $13, 15, 17$. Move each forward by 1: $14, 16, 18$, which is N, P, R.\n\n' +
        'The answer is NPR.',
      whyWrong: [
        'This writes the three letters straight after M (N, O, P). It loses the "skip one letter" spacing inside each group: ACE and BDF both jump by 2 inside the group.',
        null,
        'This shifts every letter one place **back** (M to L) instead of forward. A to B is a move forward.',
        'This shifts every letter forward by 2 (copying the gap inside the group) instead of by 1. A moves only to B.',
      ],
      keyIdea: 'For letter analogies, convert letters to alphabet positions and find the shift that turns the first group into the second.',
    },
    check: {
      optionValues: ['NOP', 'NPR', 'LNP', 'OQS'],
      compute: () => {
        const shift = 'B'.charCodeAt(0) - 'A'.charCodeAt(0);
        // confirm the same shift turns ACE into BDF
        const apply = (w: string) => [...w].map((c) => String.fromCharCode(c.charCodeAt(0) + shift)).join('');
        if (apply('ACE') !== 'BDF') throw new Error('shift does not fit');
        return apply('MOQ');
      },
    },
  },

  // ================================================================ exam
  {
    id: 'odd-one-out-007',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    stem: 'A function machine gives the outputs in the table. Using the same rule, what is the output when the input is $7$?',
    table: {
      headers: ['Input', 'Output'],
      rows: [
        [1, 2],
        [2, 5],
        [3, 10],
        [4, 17],
      ],
    },
    options: ['$38$', '$49$', '$26$', '$50$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Differences.** The outputs go up by $3, 5, 7$. These are not constant, so the rule is not "multiply and add". The differences themselves go up by $2$ each time (second differences are constant), which points to a rule with a **square** in it.\n\n' +
        '**Compare with the squares.** The squares of the inputs are $1, 4, 9, 16$. Each output is exactly one more: $2, 5, 10, 17$.\n\n' +
        '$$\\text{output} = \\text{input}^2 + 1$$\n\n' +
        '**Apply.** Input $7$: $7^2 + 1 = 49 + 1 = 50$.\n\n' +
        '(You can also extend the table: differences $9, 11, 13$ give $26, 37, 50$ for inputs $5, 6, 7$.)',
      whyWrong: [
        'This assumes the outputs keep going up by $7$ (the last difference): $17 + 3 \\times 7 = 38$. The differences themselves grow by $2$ each time, so the rule is not linear.',
        'This is $7^2$: it finds the squaring but forgets the extra $1$. Check: $1^2 = 1$, but the table says $2$.',
        'This is the output for input $5$, the next row of the table ($17 + 9 = 26$). The question asks about input $7$.',
        null,
      ],
      keyIdea: 'If the first differences are not constant but the second differences are, compare the outputs with the square numbers.',
    },
    check: {
      optionValues: [38, 49, 26, 50],
      compute: () => {
        // extend the table using the constant second difference
        const ys = [2, 5, 10, 17];
        const d2 = ys[2] - 2 * ys[1] + ys[0];
        while (ys.length < 7) {
          const n = ys.length;
          ys.push(2 * ys[n - 1] - ys[n - 2] + d2);
        }
        return ys[6];
      },
    },
  },
  {
    id: 'odd-one-out-008',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    stem: 'A machine takes two numbers $a$ and $b$ and outputs one number. The table shows three examples. What is the output for $a = 3$ and $b = 6$?',
    table: {
      headers: ['$a$', '$b$', 'Output'],
      rows: [
        [2, 3, 7],
        [4, 1, 9],
        [5, 2, 12],
      ],
    },
    options: ['$12$', '$15$', '$9$', '$19$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Try simple rules and test each on **every** row.\n\n' +
        '- $a + b$: $2 + 3 = 5$, not $7$. Rejected.\n' +
        '- $ab + 1$: $2 \\times 3 + 1 = 7$ works, but $4 \\times 1 + 1 = 5$, not $9$. Rejected.\n' +
        '- $2a + b$: $2 \\times 2 + 3 = 7$, $2 \\times 4 + 1 = 9$, $2 \\times 5 + 2 = 12$. All three work.\n\n' +
        'So the rule is $\\text{output} = 2a + b$. For $a = 3$, $b = 6$: $2 \\times 3 + 6 = 12$.',
      whyWrong: [
        null,
        'This uses $a + 2b$, doubling the wrong number: $3 + 2 \\times 6 = 15$. Check it on the first row: $2 + 6 = 8$, not $7$.',
        'This just adds: $3 + 6 = 9$. Adding fails the very first row ($2 + 3 = 5$, not $7$).',
        'This uses $ab + 1$, which happens to fit the first row ($2 \\times 3 + 1 = 7$) but fails the second ($4 \\times 1 + 1 = 5$, not $9$). A rule must fit **every** example.',
      ],
      keyIdea: 'A rule inferred from examples must work for every example; one matching row proves nothing.',
    },
    check: {
      optionValues: [12, 15, 9, 19],
      compute: () => {
        // solve p*a + q*b + r = output for the three rows (Cramer's rule)
        const A = [
          [2, 3, 1],
          [4, 1, 1],
          [5, 2, 1],
        ];
        const y = [7, 9, 12];
        const D = det3(A);
        const col = (j: number) => A.map((row, i) => row.map((v, k) => (k === j ? y[i] : v)));
        const [p, q, r] = [0, 1, 2].map((j) => det3(col(j)) / D);
        return p * 3 + q * 6 + r;
      },
    },
  },
  {
    id: 'odd-one-out-009',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    stem: 'In three of these pairs $(x, y)$, the second number is made from the first by the same rule. Which pair is the odd one out?',
    options: ['$(2, 5)$', '$(5, 26)$', '$(4, 15)$', '$(7, 50)$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Find a rule from one pair, then test it on all the others.\n\n' +
        '$26$ is one more than $25 = 5^2$, so try $y = x^2 + 1$:\n\n' +
        '- $(2, 5)$: $2^2 + 1 = 5$. Fits.\n' +
        '- $(5, 26)$: $5^2 + 1 = 26$. Fits.\n' +
        '- $(7, 50)$: $7^2 + 1 = 50$. Fits.\n' +
        '- $(4, 15)$: $4^2 + 1 = 17$, not $15$. Does **not** fit (it follows $y = x^2 - 1$ instead).\n\n' +
        'The odd one out is $(4, 15)$.',
      whyWrong: [
        '$(2, 5)$ fits the shared rule $y = x^2 + 1$: $2^2 + 1 = 5$. It also fits $y = 2x + 1$, but that rule works for no other pair, so it is not the shared rule.',
        '$(5, 26)$ fits the shared rule $y = x^2 + 1$: $5^2 + 1 = 25 + 1 = 26$. Its big jump can look unusual, but $(7, 50)$ jumps even more.',
        null,
        '$(7, 50)$ fits $y = x^2 + 1$: $7^2 + 1 = 49 + 1 = 50$. It has the largest numbers, but size alone is not a rule.',
      ],
      keyIdea: 'Guess a rule from one item, test it on every item, and the item that fails is the odd one out.',
    },
    check: {
      optionValues: ['2,5', '5,26', '4,15', '7,50'],
      compute: () => {
        const pairs = [
          [2, 5],
          [5, 26],
          [4, 15],
          [7, 50],
        ];
        // the three "regular" pairs share the same value of y - x^2
        const odd = oddByKey(pairs, ([x, y]) => y - x * x);
        return odd.join(',');
      },
    },
  },
  {
    id: 'odd-one-out-010',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    stem: 'Which number is the odd one out?',
    options: ['$51$', '$67$', '$57$', '$87$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'All four numbers are odd, so parity does not help. Try divisibility.\n\n' +
        '**Divisibility by 3** (a number is a multiple of 3 when its digit sum is):\n\n' +
        '- $51$: $5 + 1 = 6$, so $51 = 3 \\times 17$.\n' +
        '- $57$: $5 + 7 = 12$, so $57 = 3 \\times 19$.\n' +
        '- $87$: $8 + 7 = 15$, so $87 = 3 \\times 29$.\n' +
        '- $67$: $6 + 7 = 13$, not a multiple of 3.\n\n' +
        '**Is 67 prime?** Since $8^2 = 64 < 67 < 81 = 9^2$, we only need to test the primes $2, 3, 5, 7$. $67$ is odd, its digit sum is not a multiple of 3, it does not end in 0 or 5, and $7 \\times 9 = 63$, $7 \\times 10 = 70$. So $67$ is prime.\n\n' +
        '$67$ is the only prime; the other three are multiples of 3. The odd one out is $67$.',
      whyWrong: [
        '$51$ looks prime, but $51 = 3 \\times 17$ (its digit sum $6$ is a multiple of 3). Like $57$ and $87$, it is a multiple of 3.',
        null,
        '$57$ looks prime, but $57 = 3 \\times 19$. It belongs with $51$ and $87$, which are also multiples of 3.',
        '$87 = 3 \\times 29$. It is the largest number, but like $51$ and $57$ it is a multiple of 3, so it belongs with them.',
      ],
      keyIdea: 'Numbers like 51, 57, 87 and 91 look prime but are not; use the digit-sum test for 3 and test primes up to the square root.',
    },
    check: {
      optionValues: [51, 67, 57, 87],
      compute: () => oddByKey([51, 67, 57, 87], (n) => String(isPrime(n))),
    },
  },
  {
    id: 'odd-one-out-011',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    stem: '$2$ is to $3$, $4$ is to $15$, and $6$ is to $35$. Using the same rule, $9$ is to what?',
    options: ['$81$', '$53$', '$63$', '$80$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The outputs grow much faster than the inputs, so compare them with the **squares** of the inputs:\n\n' +
        '| Input | Input squared | Output |\n' +
        '| --- | --- | --- |\n' +
        '| $2$ | $4$ | $3$ |\n' +
        '| $4$ | $16$ | $15$ |\n' +
        '| $6$ | $36$ | $35$ |\n\n' +
        'Every output is one less than the square: $\\text{output} = \\text{input}^2 - 1$.\n\n' +
        'So $9 \\to 9^2 - 1 = 81 - 1 = 80$.\n\n' +
        '(Another way to see it: $1 \\times 3$, $3 \\times 5$, $5 \\times 7$, so $9 \\to 8 \\times 10 = 80$.)',
      whyWrong: [
        '$81 = 9^2$: it spots the squaring but forgets to subtract $1$. Check: $2^2 = 4$, not $3$.',
        'This guesses the rule "multiply by 6 and subtract 1" from $6 \\to 35$ alone, giving $6 \\times 9 - 1 = 53$. It fails the first pair: $6 \\times 2 - 1 = 11$, not $3$.',
        'This continues the outputs as a list (differences $12, 20$, then $28$, giving $35 + 28 = 63$). But the inputs go up in 2s, so the next item in the list belongs to input $8$ ($8^2 - 1 = 63$), not input $9$.',
        null,
      ],
      keyIdea: 'When outputs grow quickly, compare them with squares or cubes of the inputs and look for a small fixed difference.',
    },
    check: {
      optionValues: [81, 53, 63, 80],
      compute: () => {
        const rule = onlyFit(
          [(n: number) => n * n, (n: number) => n * n - 1, (n: number) => 6 * n - 1, (n: number) => n * n + 1, (n: number) => 5 * n + 5],
          [
            [2, 3],
            [4, 15],
            [6, 35],
          ],
        );
        return rule(9);
      },
    },
  },
  {
    id: 'odd-one-out-012',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    stem: 'Three of these four-sided shapes belong to a family of quadrilaterals that the fourth shape does not belong to. Which shape is the odd one out?',
    options: ['Trapezium (exactly one pair of parallel sides)', 'Square', 'Rectangle', 'Rhombus'],
    correctIndex: 0,
    markScheme: {
      solution:
        'List the key properties and look for one that splits the shapes 3 against 1.\n\n' +
        '| Shape | Four right angles? | All sides equal? | Two pairs of parallel sides? |\n' +
        '| --- | --- | --- | --- |\n' +
        '| Square | yes | yes | yes |\n' +
        '| Rectangle | yes | no | yes |\n' +
        '| Rhombus | no | yes | yes |\n' +
        '| Trapezium | no | no | **no** |\n\n' +
        '- Right angles split them 2 against 2.\n' +
        '- Equal sides split them 2 against 2.\n' +
        '- Two pairs of parallel sides (being a **parallelogram**) splits them 3 against 1.\n\n' +
        'The square, rectangle and rhombus are all parallelograms; the trapezium is not. The trapezium is the odd one out.',
      whyWrong: [
        null,
        'A square has two pairs of parallel sides, so it is a parallelogram like the rectangle and rhombus. It is the "most special" shape, but the families it belongs to (rectangles, rhombuses) contain only two of the options, while the parallelogram family contains three.',
        'A rectangle has two pairs of parallel sides. Its right angles are shared with the square, so they do not make it unique.',
        'A rhombus has two pairs of parallel sides. It has no right angles, but neither does a general trapezium, so that property splits the shapes 2 against 2.',
      ],
      keyIdea: 'For shapes, tabulate properties (sides, angles, parallel sides, symmetry) and pick the property that splits the items 3 against 1.',
    },
  },
  {
    id: 'odd-one-out-013',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    stem: 'A Python function `f(n)` has a one-line body `return ...`. When it was tested it gave the results in the table. Which line could be the body of `f`?',
    table: {
      headers: ['`n`', '`f(n)`'],
      rows: [
        [5, 1],
        [9, 1],
        [14, 2],
        [20, 0],
      ],
    },
    options: ['`return n // 5`', '`return n % 3`', '`return n % 4`', '`return n // 4`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Recall: `//` is whole-number (floor) division and `%` gives the **remainder**. Test each candidate on every row:\n\n' +
        '| `n` | wanted | `n // 5` | `n % 3` | `n % 4` | `n // 4` |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| 5 | 1 | 1 | 2 | 1 | 1 |\n' +
        '| 9 | 1 | 1 | 0 | 1 | 2 |\n' +
        '| 14 | 2 | 2 | 2 | 2 | 3 |\n' +
        '| 20 | 0 | 4 | 2 | 0 | 5 |\n\n' +
        'Only `n % 4` matches every row: $5 = 4 + 1$, $9 = 8 + 1$, $14 = 12 + 2$, and $20 = 5 \\times 4$ exactly, so its remainder is $0$.\n\n' +
        'So the body is `return n % 4`.',
      whyWrong: [
        '`n // 5` matches the first three rows (1, 1, 2) but gives `20 // 5 = 4` for the last row, not 0. Always test the rule on every example.',
        '`n % 3` fails straight away: `5 % 3` is 2, not 1.',
        null,
        '`n // 4` confuses the quotient with the remainder: `9 // 4` is 2, but the table says 1.',
      ],
      keyIdea: 'Test a candidate rule on every input-output example; a rule that fits only some rows is wrong.',
    },
    check: {
      optionValues: ['n // 5', 'n % 3', 'n % 4', 'n // 4'],
      compute: () => {
        const rows = [
          [5, 1],
          [9, 1],
          [14, 2],
          [20, 0],
        ];
        const cands: [string, (n: number) => number][] = [
          ['n // 5', (n) => Math.floor(n / 5)],
          ['n % 3', (n) => n % 3],
          ['n % 4', (n) => n % 4],
          ['n // 4', (n) => Math.floor(n / 4)],
        ];
        const fits = cands.filter(([, f]) => rows.every(([n, out]) => f(n) === out));
        if (fits.length !== 1) throw new Error('not unique');
        return fits[0][0];
      },
    },
  },
  {
    id: 'odd-one-out-014',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    stem: 'The operation $\\star$ follows a hidden rule. You are told that $3 \\star 2 = 11$, $4 \\star 1 = 17$ and $5 \\star 3 = 28$. What is $6 \\star 2$?',
    options: ['$36$', '$38$', '$40$', '$72$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Each answer is close to the **square of the first number**:\n\n' +
        '- $3 \\star 2 = 11$, and $3^2 = 9$. Extra: $11 - 9 = 2$, which is the second number.\n' +
        '- $4 \\star 1 = 17$, and $4^2 = 16$. Extra: $1$, the second number.\n' +
        '- $5 \\star 3 = 28$, and $5^2 = 25$. Extra: $3$, the second number.\n\n' +
        'So the rule is $a \\star b = a^2 + b$.\n\n' +
        'Then $6 \\star 2 = 6^2 + 2 = 36 + 2 = 38$.',
      whyWrong: [
        'This is $6^2$: it finds the squaring but forgets to add the second number $2$.',
        null,
        'This squares both numbers: $6^2 + 2^2 = 40$. Check on the first example: $3^2 + 2^2 = 13$, not $11$.',
        'This multiplies by the second number instead of adding it: $6^2 \\times 2 = 72$. Check: $3^2 \\times 2 = 18$, not $11$.',
      ],
      keyIdea: 'For a mystery operation, compare each result with a simple calculation on the inputs (square, product, sum) and see what is left over.',
    },
    check: {
      optionValues: [36, 38, 40, 72],
      compute: () => {
        const rule = onlyFit(
          [(a: number) => a * a, (a: number, b: number) => a * a + b, (a: number, b: number) => a * a + b * b, (a: number, b: number) => a * a * b, (a: number, b: number) => a * b + 5],
          [
            [3, 2, 11],
            [4, 1, 17],
            [5, 3, 28],
          ],
        );
        return rule(6, 2);
      },
    },
  },
  {
    id: 'odd-one-out-015',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    stem: 'Look at the letters in each word. Which word is the odd one out?',
    options: ['LISTEN', 'SILENT', 'TINSEL', 'LINTER'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Write the letters of each word in alphabetical order:\n\n' +
        '| Word | Letters sorted |\n' +
        '| --- | --- |\n' +
        '| LISTEN | E I L N S T |\n' +
        '| SILENT | E I L N S T |\n' +
        '| TINSEL | E I L N S T |\n' +
        '| LINTER | E I L N R T |\n\n' +
        'LISTEN, SILENT and TINSEL use exactly the same six letters: they are **anagrams** of each other. LINTER has an R instead of an S, so LINTER is the odd one out.',
      whyWrong: [
        'LISTEN uses the letters E, I, L, N, S, T, exactly the same as SILENT and TINSEL. It starts with L like LINTER, but a shared first letter only links two words.',
        'SILENT is an anagram of LISTEN and TINSEL (same letters E, I, L, N, S, T rearranged).',
        'TINSEL is an anagram of LISTEN and SILENT: rearranging its letters gives both of them.',
        null,
      ],
      keyIdea: 'Sorting the letters of each word is a quick, reliable way to spot anagrams.',
    },
    check: {
      optionValues: ['LISTEN', 'SILENT', 'TINSEL', 'LINTER'],
      compute: () => oddByKey(['LISTEN', 'SILENT', 'TINSEL', 'LINTER'], (w) => [...w].sort().join('')),
    },
  },

  // ================================================================ challenge
  {
    id: 'odd-one-out-016',
    subtopic: 'odd-one-out',
    difficulty: 'challenge',
    stem: 'A function machine multiplies its input by a fixed number and then adds another fixed number. An input of $3$ gives an output of $17$, and an input of $7$ gives an output of $33$. Which input gives an output of $85$?',
    options: ['$20$', '$15$', '$18$', '$16.25$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Find the multiplier.** The input goes up by $7 - 3 = 4$ and the output goes up by $33 - 17 = 16$. So each 1 extra on the input adds $16 \\div 4 = 4$: the multiplier is $4$.\n\n' +
        '**Find the added number.** $4 \\times 3 = 12$, but the output is $17$, so the machine adds $17 - 12 = 5$.\n\n' +
        '$$\\text{output} = 4 \\times \\text{input} + 5$$\n\n' +
        'Check: $4 \\times 7 + 5 = 33$. Correct.\n\n' +
        '**Work backwards from 85.** Undo "add 5": $85 - 5 = 80$. Undo "multiply by 4": $80 \\div 4 = 20$.\n\n' +
        'Check: $4 \\times 20 + 5 = 85$. The input is $20$.',
      whyWrong: [
        null,
        'This assumes the output is proportional to the input: since $85 = 5 \\times 17$, it takes $5 \\times 3 = 15$. Because the machine adds a fixed number, it is not proportional: $4 \\times 15 + 5 = 65$, not $85$.',
        'This finds the multiplier 4 but then takes the added number as $17 - 4 = 13$, forgetting to multiply 4 by the input 3. Then $(85 - 13) \\div 4 = 18$.',
        'This undoes the steps in the wrong order: $85 \\div 4 - 5 = 16.25$. The last step was "add 5", so subtract 5 first.',
      ],
      keyIdea: 'From two input-output pairs of a "multiply then add" machine: multiplier = change in output divided by change in input; then reverse the machine step by step.',
    },
    check: {
      optionValues: [20, 15, 18, 16.25],
      compute: () => {
        const { a, b } = linearRule([3, 7], [17, 33]);
        return (85 - b) / a;
      },
    },
  },
  {
    id: 'odd-one-out-017',
    subtopic: 'odd-one-out',
    difficulty: 'challenge',
    stem: 'Three of these numbers belong to the same well-known sequence of numbers. Which number is the odd one out?',
    options: ['$78$', '$28$', '$35$', '$55$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'First rule out the obvious properties:\n\n' +
        '- Even/odd: $78, 28$ even; $35, 55$ odd. 2 against 2.\n' +
        '- Multiples of 5: $35, 55$. 2 against 2.\n' +
        '- Multiples of 7: $28, 35$. 2 against 2.\n\n' +
        'Now try the **triangular numbers** $T_n = \\frac{n(n+1)}{2}$: $1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, \\ldots$\n\n' +
        '- $28 = \\frac{7 \\times 8}{2}$\n' +
        '- $55 = \\frac{10 \\times 11}{2}$\n' +
        '- $78 = \\frac{12 \\times 13}{2}$\n' +
        '- $35$ falls between $28$ and $36$, so it is **not** triangular.\n\n' +
        '(Quick test: $N$ is triangular exactly when $8N + 1$ is a perfect square. $8 \\times 35 + 1 = 281$ is not a square, but $8 \\times 28 + 1 = 225 = 15^2$.)\n\n' +
        'The odd one out is $35$.',
      whyWrong: [
        '$78 = \\frac{12 \\times 13}{2}$ is the 12th triangular number. It is the largest number and the only multiple of 3, but those are one-off facts, not a sequence shared by the other three.',
        '$28 = \\frac{7 \\times 8}{2}$ is the 7th triangular number. Being even does not single it out, because $78$ is even too.',
        null,
        '$55 = \\frac{10 \\times 11}{2}$ is the 10th triangular number. It is also a Fibonacci number, but none of $28$, $35$ or $78$ is, so Fibonacci cannot be the shared sequence.',
      ],
      keyIdea: 'Know the famous sequences (squares, cubes, primes, triangular, Fibonacci) and test each number against them after ruling out properties that split 2 against 2.',
    },
    check: {
      optionValues: [78, 28, 35, 55],
      compute: () => oddByKey([78, 28, 35, 55], (n) => String(isTriangular(n))),
    },
  },
  {
    id: 'odd-one-out-018',
    subtopic: 'odd-one-out',
    difficulty: 'challenge',
    stem: 'Three of these Python 3 expressions evaluate to the same value. Which expression gives a different value?',
    options: ['`7 // 2`', '`int(3.9)`', '`len("abc")`', '`round(2.5)`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Evaluate each expression carefully:\n\n' +
        '- `7 // 2`: floor division keeps the whole-number part of $3.5$, giving `3`.\n' +
        '- `int(3.9)`: `int()` **chops off** the decimal part (it does not round), giving `3`.\n' +
        '- `len("abc")`: the string has 3 characters, giving `3`.\n' +
        '- `round(2.5)`: in Python 3, a value exactly halfway between two integers is rounded to the **even** one ("banker\'s rounding"). $2.5$ is halfway between 2 and 3, and 2 is even, so the result is `2`.\n\n' +
        'Three expressions give `3`; `round(2.5)` gives `2`, so it is the odd one out.',
      whyWrong: [
        '`//` is floor division, so `7 // 2` is `3` (not `3.5`), the same value as `int(3.9)` and `len("abc")`.',
        '`int()` truncates rather than rounds, so `int(3.9)` is `3`, not `4`. If you thought it rounded up you would pick this, but it matches the others.',
        '`len("abc")` counts the characters: there are 3, the same value as `7 // 2` and `int(3.9)`.',
        null,
      ],
      keyIdea: 'In Python 3, `int()` truncates, `//` floors, and `round()` sends exact halves to the nearest even integer, so `round(2.5)` is `2`.',
    },
    check: {
      optionValues: [3, 3, 3, 2],
      compute: () => {
        // emulate Python 3 semantics
        const roundHalfEven = (x: number) => {
          const f = Math.floor(x);
          const d = x - f;
          if (d > 0.5) return f + 1;
          if (d < 0.5) return f;
          return f % 2 === 0 ? f : f + 1;
        };
        const vals = [Math.floor(7 / 2), Math.trunc(3.9), 'abc'.length, roundHalfEven(2.5)];
        return oddByKey(vals, (v) => v);
      },
    },
  },
  {
    id: 'odd-one-out-019',
    subtopic: 'odd-one-out',
    difficulty: 'challenge',
    stem: '$23$ is to $13$, $45$ is to $41$, and $37$ is to $58$. Using the same rule, $62$ is to what?',
    options: ['$64$', '$40$', '$12$', '$38$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The outputs do not follow the size of the inputs ($23 \\to 13$ but $37 \\to 58$), so look at the **digits** separately.\n\n' +
        'Try squaring each digit and adding:\n\n' +
        '- $23$: $2^2 + 3^2 = 4 + 9 = 13$. Fits.\n' +
        '- $45$: $4^2 + 5^2 = 16 + 25 = 41$. Fits.\n' +
        '- $37$: $3^2 + 7^2 = 9 + 49 = 58$. Fits.\n\n' +
        'So $62 \\to 6^2 + 2^2 = 36 + 4 = 40$.',
      whyWrong: [
        'This adds the digits first and then squares: $(6 + 2)^2 = 64$. Check: $(2 + 3)^2 = 25$, not $13$.',
        null,
        'This multiplies the digits: $6 \\times 2 = 12$. Check: $2 \\times 3 = 6$, not $13$.',
        'This squares only the first digit: $6^2 + 2 = 38$. Check: $2^2 + 3 = 7$, not $13$.',
      ],
      keyIdea: 'When outputs do not grow with the inputs, try operations on the individual digits, and confirm the rule on every example.',
    },
    check: {
      optionValues: [64, 40, 12, 38],
      compute: () => {
        const digits = (n: number) => [Math.floor(n / 10), n % 10];
        const rule = onlyFit(
          [
            (n: number) => digits(n).reduce((s, d) => s + d * d, 0),
            (n: number) => digits(n).reduce((s, d) => s + d, 0) ** 2,
            (n: number) => digits(n).reduce((s, d) => s * d, 1),
            (n: number) => digits(n)[0] ** 2 + digits(n)[1],
          ],
          [
            [23, 13],
            [45, 41],
            [37, 58],
          ],
        );
        return rule(62);
      },
    },
  },
  {
    id: 'odd-one-out-020',
    subtopic: 'odd-one-out',
    difficulty: 'challenge',
    stem: 'A rule turns a pair of numbers into one number: $(3, 4) \\to 5$, $(6, 8) \\to 10$ and $(5, 12) \\to 13$. What does the rule give for $(8, 15)$?',
    options: ['$17$', '$289$', '$23$', '$16$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'These are **Pythagorean triples**: the output is the hypotenuse of a right-angled triangle with the two inputs as the shorter sides.\n\n' +
        '- $\\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$\n' +
        '- $\\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$\n' +
        '- $\\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13$\n\n' +
        'So the rule is $\\sqrt{a^2 + b^2}$. For $(8, 15)$: $8^2 + 15^2 = 64 + 225 = 289$, and $\\sqrt{289} = 17$.',
      whyWrong: [
        null,
        'This is $8^2 + 15^2 = 289$: it forgets the final square root. Check: $3^2 + 4^2 = 25$, but the example gives $5$.',
        'This simply adds the numbers: $8 + 15 = 23$. Check: $3 + 4 = 7$, not $5$.',
        'This uses "add 1 to the larger number", which fits $(3, 4) \\to 5$ and $(5, 12) \\to 13$ but fails $(6, 8)$: $8 + 1 = 9$, not $10$.',
      ],
      keyIdea: 'Recognise famous number patterns such as Pythagorean triples, and check a guessed rule against every example, not just most of them.',
    },
    check: {
      optionValues: [17, 289, 23, 16],
      compute: () => {
        const rule = onlyFit(
          [(a: number, b: number) => Math.sqrt(a * a + b * b), (a: number, b: number) => a * a + b * b, (a: number, b: number) => a + b, (a: number, b: number) => Math.max(a, b) + 1],
          [
            [3, 4, 5],
            [6, 8, 10],
            [5, 12, 13],
          ],
        );
        return rule(8, 15);
      },
    },
  },
];
