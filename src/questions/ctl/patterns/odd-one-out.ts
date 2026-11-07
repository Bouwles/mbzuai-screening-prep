import type { StaticQuestion } from '../../../types';
import { det3, isPrime } from '../../../lib/mathx';

// ---------------------------------------------------------------- helpers for the answer checks
const isSquare = (n: number): boolean => Number.isInteger(Math.sqrt(n));
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
    id: 'odd-one-out-002',
    subtopic: 'odd-one-out',
    difficulty: 'foundation',
    stem: 'Three of these numbers share a property that the fourth does not have. Which number is the odd one out?',
    options: ['$16$', '$49$', '$81$', '$54$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which number does not share a property with the other three?',
      solution:
        'An odd-one-out question wants a property that three items have and one does not. Try simple properties first, and see how each one splits the numbers:\n\n| Property | Has it | Does not have it | Split |\n|---|---|---|---|\n| Even | 16, 54 | 49, 81 | 2 against 2 |\n| Multiple of 3 | 81, 54 | 16, 49 | 2 against 2 |\n\n' +
        'Those splits do not pick out one number. Now try **perfect squares**, which are whole numbers multiplied by themselves: $16 = 4 \\times 4$, $49 = 7 \\times 7$ and $81 = 9 \\times 9$.\n\n' +
        'That leaves 54. It is not a perfect square, because $7 \\times 7 = 49$ and $8 \\times 8 = 64$, and 54 falls between them. So the split is 3 against 1, with 54 on its own.',
      conclusion: 'Three of the numbers are perfect squares and the other is not, so the odd one out is $54$.',
      whyWrong: [
        '$16 = 4^2$ is a perfect square, just like $49$ and $81$. It is even, but so is $54$, so being even does not single it out.',
        '$49 = 7^2$ is a perfect square. It is odd, but so is $81$, so being odd does not single it out.',
        '$81 = 9^2$ is a perfect square. It is a multiple of $3$, but so is $54$, so that property splits the numbers 2 against 2.',
        null,
      ],
      keyIdea: 'List simple properties: even or odd, prime, square, cube, multiple of 3. For each one, see how it splits the four items. The right property gives 3 against 1. Ignore any 2 against 2 split.',
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
    options: ['REFER', 'MOTOR', 'RADAR', 'ROTOR'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which word does not share a property with the other three?',
      solution:
        'All four words have 5 letters and look alike, so the property is probably about the order of the letters. A simple test is to read each word backwards.\n\n' +
        'A word that reads the same both ways is called a **palindrome**. Test each word, and only MOTOR fails:\n\n| Word | Backwards | The same? |\n|---|---|---|\n| REFER | REFER | Yes |\n| RADAR | RADAR | Yes |\n| ROTOR | ROTOR | Yes |\n| MOTOR | ROTOM | No |',
      conclusion: 'Three of the words are palindromes, and the word that is not is MOTOR.',
      whyWrong: [
        'REFER reads the same forwards and backwards (R-E-F-E-R), so it shares the palindrome property with RADAR and ROTOR. It is the only word with an E or an F, but every word here has some letter of its own, so that is not a rule.',
        null,
        'RADAR is a palindrome: backwards it is still RADAR. It is the only word with an A, but that is a one-off detail, not a rule that the other three share.',
        'ROTOR looks very like MOTOR (they differ by one letter), which tempts you to pair them, but ROTOR backwards is still ROTOR, so it is a palindrome like REFER and RADAR.',
      ],
      keyIdea: 'For word odd-one-outs, test properties of the letters: palindrome (same backwards), anagram (same letters rearranged), number of vowels. Find the property that splits the words 3 against 1. Do not be misled by words that look alike.',
    },
    check: {
      optionValues: ['REFER', 'MOTOR', 'RADAR', 'ROTOR'],
      compute: () => oddByKey(['REFER', 'MOTOR', 'RADAR', 'ROTOR'], (w) => String(isPalindrome(w))),
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
      asking: 'The machine gave 28. What number went in?',
      solution:
        'The machine did two things: first subtract 2, then multiply by 4. To go backwards, undo them in **reverse order**, like taking off your shoes before your socks.\n\n' +
        'The last thing done was "multiply by 4", so undo that first. The opposite of multiplying is dividing: $28 \\div 4 = 7$.\n\n' +
        'Next undo "subtract 2". The opposite of subtracting is adding: $7 + 2 = 9$. Test it by running forwards: $9 - 2 = 7$, then $7 \\times 4 = 28$.',
      conclusion: 'Undoing both steps in reverse order gives the input $9$.',
      whyWrong: [
        null,
        'This undoes the steps in the wrong order: $(28 + 2) \\div 4 = 7.5$. The last thing the machine did was multiply by 4, so that must be undone first.',
        'This divides by 4 correctly but then subtracts 2 again instead of adding 2: $7 - 2 = 5$. To undo "subtract 2" you add 2.',
        'This runs the machine forwards on $28$: $(28 - 2) \\times 4 = 104$. The question gives the output and asks for the input.',
      ],
      keyIdea: 'To find an input from an output, write the machine\'s steps, then reverse their order and use the opposite of each: $\\times$ becomes $\\div$, and $-$ becomes $+$. Test by running your answer forwards.',
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
      asking: 'What rule turns 2 into 8 and 3 into 27, and what does it do to 5?',
      solution:
        'Look for a rule that fits both examples. Try multiplying: $2 \\times 4 = 8$ but $3 \\times 9 = 27$. The multiplier changes, so a fixed multiplier does not work.\n\n' +
        'Try powers, using the number itself: $2 \\times 2 \\times 2 = 8$ and $3 \\times 3 \\times 3 = 27$. Both fit. Multiplying a number by itself three times is called **cubing**, and it is written $2^3$ or $3^3$.\n\n' +
        'Apply the rule to 5: $5 \\times 5 \\times 5 = 25 \\times 5 = 125$.',
      conclusion: 'The rule is to cube the number, and $5^3$ is $125$.',
      whyWrong: [
        'This squares $5$ instead of cubing it. Check against the examples: $2^2 = 4$, not $8$.',
        'This uses only $3 \\to 27$ and reads it as "multiply by 9". That fails the first example: $2 \\times 9 = 18$, not $8$.',
        null,
        'This confuses "cubed" with "times 3": $5 \\times 3 = 15$. Cubing means $5 \\times 5 \\times 5$.',
      ],
      keyIdea: 'For "$a$ is to $b$" questions, find a rule that works on every given pair. Try add, multiply, square and cube, and test each on all the pairs before using it. Learn the cubes: 1, 8, 27, 64, 125.',
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
      asking: 'What change turns ACE into BDF, and what does it make of MOQ?',
      solution:
        'Compare the two groups one letter at a time: A to B, C to D, and E to F. Each letter moves 1 place forward.\n\n' +
        'So the rule is "move every letter forward by 1". Apply it to MOQ: M to N, O to P, and Q to R.',
      conclusion: 'Moving each letter of MOQ forward 1 place gives NPR.',
      whyWrong: [
        'This writes the three letters straight after M (N, O, P). It loses the "skip one letter" spacing inside each group: ACE and BDF both jump by 2 inside the group.',
        null,
        'This shifts every letter one place **back** (M to L) instead of forward. A to B is a move forward.',
        'This shifts every letter forward by 2 (copying the gap inside the group) instead of by 1. A moves only to B.',
      ],
      keyIdea: 'For letter analogies, compare matching letters in the two example groups and write the move for each. Apply exactly that move to each letter of the new group. Do not use the gaps inside a group by mistake.',
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
    id: 'odd-one-out-001',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
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
      asking: 'What rule links each input to its output, and what does it give for input 10?',
      solution:
        'The input goes up by 1 each row, and the output goes up by 2 each row: $7 - 5 = 2$, $9 - 7 = 2$ and $11 - 9 = 2$. So each extra 1 of input adds 2 to the output, and the rule starts with "multiply by 2".\n\n' +
        'Try the first row: $2 \\times 1 = 2$, but the output is 5. We need 3 more, because $5 - 2 = 3$. So the rule is output $= 2 \\times$ input $+ 3$.\n\n' +
        'Test it on another row: $2 \\times 4 + 3 = 11$, which matches the table.\n\n' +
        'Apply it to input 10: $2 \\times 10 + 3 = 20 + 3 = 23$.',
      conclusion: 'The rule output $= 2 \\times$ input $+ 3$ fits every row, and input 10 gives $23$.',
      whyWrong: [
        'This is the output for input $5$, the next row of the table ($11 + 2 = 13$). The question asks for input $10$, which is six steps beyond input $4$.',
        'This is $2 \\times 10$: it spots "multiply by $2$" but forgets to add the $3$.',
        null,
        'This uses only the first example, $1 \\to 5$, and guesses "multiply by $5$". The second example already breaks that rule: $2 \\times 5 = 10$, but the table says $7$.',
      ],
      keyIdea: 'For a table of inputs and outputs, find how much the output changes when the input goes up by 1: that is the multiplier. Then find the fixed number to add or subtract from one row. Test the rule on another row.',
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
      asking: 'What rule links each input to its output, and what does it give for input 7?',
      solution:
        'Find the gaps in the outputs: $5 - 2 = 3$, $10 - 5 = 5$ and $17 - 10 = 7$. The gaps keep growing, so this is not a simple multiply-and-add rule.\n\n' +
        'Gaps of 3, 5, 7 are typical of square numbers, so compare each output with the input squared (the input times itself):\n\n| Input | Input squared | Output |\n|---|---|---|\n| 1 | 1 | 2 |\n| 2 | 4 | 5 |\n| 3 | 9 | 10 |\n| 4 | 16 | 17 |\n\n' +
        'Every output is exactly 1 more than the square. So the rule is: square the input, then add 1.\n\n' +
        'Apply it to input 7: $7^2 + 1 = 49 + 1 = 50$.',
      conclusion: 'The rule is to square and then add 1, and input 7 gives $50$.',
      whyWrong: [
        'This assumes the outputs keep going up by $7$ (the last difference): $17 + 3 \\times 7 = 38$. The differences themselves grow by $2$ each time, so the rule is not linear.',
        'This is $7^2$: it finds the squaring but forgets the extra $1$. Check: $1^2 = 1$, but the table says $2$.',
        'This is the output for input $5$, the next row of the table ($17 + 9 = 26$). The question asks about input $7$.',
        null,
      ],
      keyIdea: 'If output gaps grow steadily, the rule involves a square. Compare each output with the input squared, and look at the difference. A fixed difference gives the rule: input squared plus or minus that number. Test it on every row.',
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
      asking: 'What rule combines $a$ and $b$ into the output, and what does it give for 3 and 6?',
      solution:
        'Try simple rules on the first row ($a = 2$, $b = 3$, output 7). Adding gives 5, which is too small. Multiplying gives 6, which is 1 short, so "multiply and add 1" is worth testing.\n\n' +
        'Test it on the second row ($a = 4$, $b = 1$): $4 \\times 1 + 1 = 5$, but the output is 9. So that rule is wrong.\n\n' +
        'In row 2, $a = 4$ is large and $b$ is small, yet the output is 9. That suggests doubling $a$. Try $2a + b$, which means double $a$, then add $b$:\n\n| $a$ | $b$ | $2a + b$ | Output |\n|---|---|---|---|\n| 2 | 3 | $4 + 3 = 7$ | 7 |\n| 4 | 1 | $8 + 1 = 9$ | 9 |\n| 5 | 2 | $10 + 2 = 12$ | 12 |\n\n' +
        'It fits every row. Apply it to $a = 3$ and $b = 6$: $2 \\times 3 + 6 = 6 + 6 = 12$.',
      conclusion: 'The rule $2a + b$ fits every example, and for $a = 3$, $b = 6$ it gives $12$.',
      whyWrong: [
        null,
        'This uses $a + 2b$, doubling the wrong number: $3 + 2 \\times 6 = 15$. Check it on the first row: $2 + 6 = 8$, not $7$.',
        'This just adds: $3 + 6 = 9$. Adding fails the very first row ($2 + 3 = 5$, not $7$).',
        'This uses $ab + 1$, which happens to fit the first row ($2 \\times 3 + 1 = 7$) but fails the second ($4 \\times 1 + 1 = 5$, not $9$). A rule must fit **every** example.',
      ],
      keyIdea: 'For a two-input machine, try $a + b$, then $a \\times b$, then forms such as $2a + b$ or $a + 2b$. Test each rule on every row, and reject it if even one row fails. Only then apply it.',
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
      asking: 'Which pair does not fit the rule that the other three follow?',
      solution:
        'We do not know the rule yet, so look for a pattern. The second numbers grow quickly compared with the first, which points to squares. Compare each $y$ with $x$ squared ($x$ times itself):\n\n| Pair | $x^2$ | $y - x^2$ |\n|---|---|---|\n| $(2, 5)$ | 4 | $1$ |\n| $(5, 26)$ | 25 | $1$ |\n| $(4, 15)$ | 16 | $-1$ |\n| $(7, 50)$ | 49 | $1$ |\n\n' +
        'Three pairs give a difference of 1, so the shared rule is $y = x^2 + 1$.\n\n' +
        'Now test the remaining pair. With $x = 4$, the rule gives $4^2 + 1 = 17$, but this pair has $y = 15$. So $(4, 15)$ breaks the rule.',
      conclusion: 'Three pairs follow $y = x^2 + 1$, and the pair that breaks it is $(4, 15)$.',
      whyWrong: [
        '$(2, 5)$ fits the shared rule $y = x^2 + 1$: $2^2 + 1 = 5$. It also fits $y = 2x + 1$, but that rule works for no other pair, so it is not the shared rule.',
        '$(5, 26)$ fits the shared rule $y = x^2 + 1$: $5^2 + 1 = 25 + 1 = 26$. Its big jump can look unusual, but $(7, 50)$ jumps even more.',
        null,
        '$(7, 50)$ fits $y = x^2 + 1$: $7^2 + 1 = 49 + 1 = 50$. It has the largest numbers, but size alone is not a rule.',
      ],
      keyIdea: 'Find a rule that fits three pairs. If $y$ grows fast, compare it with $x^2$. If it grows slowly, try a multiply-and-add rule. Test the rule on all four pairs: the one that fails is the odd one out.',
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
    options: ['$51$', '$67$', '$57$', '$93$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which number does not share a hidden property with the other three?',
      solution:
        'All four are odd two-digit numbers, so being odd does not help. Try dividing by small numbers, starting with 3.\n\n' +
        'A quick test for 3 is to add the digits. If the total is a multiple of 3, so is the number:\n\n| Number | Digit total | Multiple of 3? |\n|---|---|---|\n| 51 | $5 + 1 = 6$ | Yes: $3 \\times 17$ |\n| 57 | $5 + 7 = 12$ | Yes: $3 \\times 19$ |\n| 93 | $9 + 3 = 12$ | Yes: $3 \\times 31$ |\n| 67 | $6 + 7 = 13$ | No |\n\n' +
        '67 does not divide exactly by 2, 3, 5 or 7 either. So it is a **prime number**: only 1 and itself divide it exactly. The other three are not prime.',
      conclusion: 'Three of the numbers are multiples of 3, and the one that is not, which is prime, is $67$.',
      whyWrong: [
        '$51$ looks prime, but $51 = 3 \\times 17$ (its digit sum $6$ is a multiple of 3). Like $57$ and $93$, it is a multiple of 3.',
        null,
        '$57$ looks prime, but $57 = 3 \\times 19$. It belongs with $51$ and $93$, which are also multiples of 3.',
        '$93$ looks prime, but $93 = 3 \\times 31$ (digit sum $12$). It is the largest number, but like $51$ and $57$ it is a multiple of 3, so it belongs with them.',
      ],
      keyIdea: 'When numbers look prime, test them: add the digits to test for 3, then try 7 and 11. Numbers like 51, 57 and 91 look prime but are not. Then look for the 3 against 1 split.',
    },
    check: {
      optionValues: [51, 67, 57, 93],
      compute: () => oddByKey([51, 67, 57, 93], (n) => String(isPrime(n))),
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
      asking: 'What rule turns 2 into 3, 4 into 15 and 6 into 35, and what does it do to 9?',
      solution:
        'The outputs grow quickly, so compare them with squares (a number times itself): $2^2 = 4$, $4^2 = 16$ and $6^2 = 36$.\n\n' +
        'Each output is just 1 below the square: $4 - 1 = 3$, $16 - 1 = 15$ and $36 - 1 = 35$. So the rule is: square the number, then subtract 1.\n\n' +
        'Apply it to 9: $9^2 - 1 = 81 - 1 = 80$.',
      conclusion: 'The rule is to square and then subtract 1, which turns 9 into $80$.',
      whyWrong: [
        '$81 = 9^2$: it spots the squaring but forgets to subtract $1$. Check: $2^2 = 4$, not $3$.',
        'This guesses the rule "multiply by 6 and subtract 1" from $6 \\to 35$ alone, giving $6 \\times 9 - 1 = 53$. It fails the first pair: $6 \\times 2 - 1 = 11$, not $3$.',
        'This continues the outputs as a list (differences $12, 20$, then $28$, giving $35 + 28 = 63$). But the inputs go up in 2s, so the next item in the list belongs to input $8$ ($8^2 - 1 = 63$), not input $9$.',
        null,
      ],
      keyIdea: 'For "$a$ is to $b$" questions, test squares and cubes first when the numbers jump fast. Note how far each output is from that power. Apply the rule to the new number directly, instead of continuing the outputs as a list.',
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
      asking: 'Which shape is outside the family the other three belong to?',
      solution:
        'Two lines are **parallel** if they always stay the same distance apart. A **parallelogram** is a four-sided shape with two pairs of parallel sides.\n\n' +
        'Count the pairs of parallel sides in each shape. Only the trapezium is not a parallelogram:\n\n| Shape | Pairs of parallel sides | Parallelogram? |\n|---|---|---|\n| Square | 2 | Yes |\n| Rectangle | 2 | Yes |\n| Rhombus | 2 | Yes |\n| Trapezium | 1 | No |',
      conclusion: 'Three shapes are parallelograms, and the one that is not is the Trapezium (exactly one pair of parallel sides).',
      whyWrong: [
        null,
        'A square has two pairs of parallel sides, so it is a parallelogram like the rectangle and rhombus. It is the "most special" shape, but the families it belongs to (rectangles, rhombuses) contain only two of the options, while the parallelogram family contains three.',
        'A rectangle has two pairs of parallel sides. Its right angles are shared with the square, so they do not make it unique.',
        'A rhombus has two pairs of parallel sides. It has no right angles, but neither does a general trapezium, so that property splits the shapes 2 against 2.',
      ],
      keyIdea: 'For shapes, test properties that group them: parallel sides, equal sides, right angles. Look for the property that gives a 3 against 1 split. Squares, rectangles and rhombuses are all parallelograms, but trapeziums are not.',
    },
  },
  {
    id: 'odd-one-out-013',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    stem: 'A function `f(n)` gave the results in the table. Which line could be its body? (`mod` gives the remainder and `div` is integer division.)',
    table: {
      headers: ['`n`', '`f(n)`'],
      rows: [
        [5, 1],
        [9, 1],
        [14, 2],
        [20, 0],
      ],
    },
    options: ['`return div(n,5)`', '`return mod(n,3)`', '`return mod(n,4)`', '`return div(n,4)`'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which line of code gives all four results in the table?',
      solution:
        '`mod(n,k)` means the remainder when `n` is divided by `k`. For example, $14 \\div 4$ is 3 remainder 2, so `mod(14,4)` is 2. `div(n,k)` means the whole-number answer with the remainder thrown away, so `div(14,4)` is 3.\n\n' +
        'A correct line must match every row. Work out each option for each `n`. Only the `mod(n,4)` column matches the table in all four rows:\n\n| `n` | Table says | `div(n,5)` | `mod(n,3)` | `mod(n,4)` | `div(n,4)` |\n|---|---|---|---|---|---|\n| 5 | 1 | 1 | 2 | 1 | 1 |\n| 9 | 1 | 1 | 0 | 1 | 2 |\n| 14 | 2 | 2 | 2 | 2 | 3 |\n| 20 | 0 | 4 | 2 | 0 | 5 |',
      conclusion: 'It is the only line that matches all four rows: `return mod(n,4)`.',
      whyWrong: [
        '`div(n,5)` matches the first three rows (1, 1, 2) but gives `div(20,5) = 4` for the last row, not 0. Always test the rule on every example.',
        '`mod(n,3)` fails straight away: `mod(5,3)` is 2, not 1.',
        null,
        '`div(n,4)` confuses the quotient with the remainder: `div(9,4)` is 2, but the table says 1.',
      ],
      keyIdea: 'To match code to a table of results, make one column per option and work out every row. Reject an option at the first row that disagrees. `mod` gives the remainder, and `div` gives the whole-number result of a division.',
    },
    check: {
      optionValues: ['div(n,5)', 'mod(n,3)', 'mod(n,4)', 'div(n,4)'],
      compute: () => {
        const rows = [
          [5, 1],
          [9, 1],
          [14, 2],
          [20, 0],
        ];
        const cands: [string, (n: number) => number][] = [
          ['div(n,5)', (n) => Math.floor(n / 5)],
          ['mod(n,3)', (n) => n % 3],
          ['mod(n,4)', (n) => n % 4],
          ['div(n,4)', (n) => Math.floor(n / 4)],
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
      asking: 'What rule does $\\star$ follow, and what does it give for 6 and 2?',
      solution:
        '$\\star$ is a made-up symbol for a rule that takes two numbers. Try simple rules on $3 \\star 2 = 11$: adding gives 5 and multiplying gives 6, which are both much too small.\n\n' +
        'The result is large even with a small second number: $4 \\star 1 = 17$. That suggests the first number gets squared (multiplied by itself). $4^2 = 16$, and $17 - 16 = 1$, which equals the second number. So try: first number squared, plus the second.\n\n' +
        'Test it on the other examples: $3^2 + 2 = 9 + 2 = 11$ fits, and $5^2 + 3 = 25 + 3 = 28$ fits.\n\n' +
        'Apply it to $6 \\star 2$: $6^2 + 2 = 36 + 2 = 38$.',
      conclusion: 'The rule is the first number squared plus the second, so $6 \\star 2$ gives $38$.',
      whyWrong: [
        'This is $6^2$: it finds the squaring but forgets to add the second number $2$.',
        null,
        'This squares both numbers: $6^2 + 2^2 = 40$. Check on the first example: $3^2 + 2^2 = 13$, not $11$.',
        'This multiplies by the second number instead of adding it: $6^2 \\times 2 = 72$. Check: $3^2 \\times 2 = 18$, not $11$.',
      ],
      keyIdea: 'For a made-up operator, look at an example with a small second number to see what the first number does alone. It is often squared. Then work out what the second number adds, and test the rule on every example.',
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
      asking: 'Which word is not made from the same letters as the other three?',
      solution:
        'The stem says to look at the letters, so compare which letters each word uses. A neat way is to sort each word\'s letters into alphabetical order.\n\n' +
        'Sort them and compare. Words with the same letters rearranged are called **anagrams**, and LINTER is the one that differs:\n\n| Word | Letters in order |\n|---|---|\n| LISTEN | E I L N S T |\n| SILENT | E I L N S T |\n| TINSEL | E I L N S T |\n| LINTER | E I L N R T |',
      conclusion: 'Three words are anagrams of each other, and the word with an R in place of an S is LINTER.',
      whyWrong: [
        'LISTEN uses the letters E, I, L, N, S, T, exactly the same as SILENT and TINSEL. It starts with L like LINTER, but a shared first letter only links two words.',
        'SILENT is an anagram of LISTEN and TINSEL (same letters E, I, L, N, S, T rearranged).',
        'TINSEL is an anagram of LISTEN and SILENT: rearranging its letters gives both of them.',
        null,
      ],
      keyIdea: 'To test for anagrams, write each word\'s letters in alphabetical order and compare. Identical lists mean anagrams. The odd one out often shares most letters, so compare every letter, not just the start of the word.',
    },
    check: {
      optionValues: ['LISTEN', 'SILENT', 'TINSEL', 'LINTER'],
      compute: () => oddByKey(['LISTEN', 'SILENT', 'TINSEL', 'LINTER'], (w) => [...w].sort().join('')),
    },
  },

  {
    id: 'odd-one-out-016',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    stem: 'A function machine multiplies its input by a fixed number, then adds another fixed number. Input $3$ gives output $17$ and input $7$ gives output $33$. Which input gives output $85$?',
    options: ['$20$', '$15$', '$18$', '$16.25$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Find the machine\'s two numbers, then find which input gives 85.',
      solution:
        'The machine is: output $= m \\times$ input $+ c$, where $m$ is the multiplier and $c$ is the number added. We need both.\n\n' +
        'From input 3 to input 7, the input goes up by $7 - 3 = 4$, and the output goes up by $33 - 17 = 16$. So each 1 of input adds $16 \\div 4 = 4$, which means $m = 4$.\n\n' +
        'Use input 3 to find $c$: $4 \\times 3 = 12$, and the output is 17, so $c = 17 - 12 = 5$. The machine is: output $= 4 \\times$ input $+ 5$.\n\n' +
        'Now work backwards from 85. Undo the last step first, "add 5": $85 - 5 = 80$. Then undo "multiply by 4": $80 \\div 4 = 20$. Test it: $4 \\times 20 + 5 = 85$.',
      conclusion: 'Reversing the machine from 85 gives the input $20$.',
      whyWrong: [
        null,
        'This assumes the output is proportional to the input: since $85 = 5 \\times 17$, it takes $5 \\times 3 = 15$. Because the machine adds a fixed number, it is not proportional: $4 \\times 15 + 5 = 65$, not $85$.',
        'This finds the multiplier 4 but then takes the added number as $17 - 4 = 13$, forgetting to multiply 4 by the input 3. Then $(85 - 13) \\div 4 = 18$.',
        'This undoes the steps in the wrong order: $85 \\div 4 - 5 = 16.25$. The last step was "add 5", so subtract 5 first.',
      ],
      keyIdea: 'With two examples of a multiply-then-add machine, the multiplier is the change in output divided by the change in input. Get the added number from one example. To find an input, reverse the machine: subtract first, then divide.',
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
    id: 'odd-one-out-020',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    stem: 'A rule turns a pair of numbers into one number: $(3, 4) \\to 5$, $(6, 8) \\to 10$ and $(5, 12) \\to 13$. What does the rule give for $(8, 15)$?',
    options: ['$17$', '$289$', '$23$', '$16$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What rule turns each pair into one number, and what does it give for $(8, 15)$?',
      solution:
        'Try simple rules on $(3, 4) \\to 5$. Adding gives 7 and multiplying gives 12, so neither works. Adding 1 to the larger number fits here, but $(6, 8)$ would then give 9, not 10.\n\n' +
        'The numbers 3, 4, 5 may look familiar: they are the sides of a right-angled triangle. So try Pythagoras\' theorem: square both numbers, add them, then take the square root (the number which, times itself, gives that total).\n\n' +
        'Test it on all three examples. $(3, 4)$: $9 + 16 = 25$, and $\\sqrt{25} = 5$. $(6, 8)$: $36 + 64 = 100$, and $\\sqrt{100} = 10$. $(5, 12)$: $25 + 144 = 169$, and $\\sqrt{169} = 13$.\n\n' +
        'Apply it to $(8, 15)$: $8^2 + 15^2 = 64 + 225 = 289$. Since $17 \\times 17 = 289$, the square root is 17.',
      conclusion: 'The rule is to square both numbers, add them and take the square root, and for $(8, 15)$ that gives $17$.',
      whyWrong: [
        null,
        'This is $8^2 + 15^2 = 289$: it forgets the final square root. Check: $3^2 + 4^2 = 25$, but the example gives $5$.',
        'This simply adds the numbers: $8 + 15 = 23$. Check: $3 + 4 = 7$, not $5$.',
        'This uses "add 1 to the larger number", which fits $(3, 4) \\to 5$ and $(5, 12) \\to 13$ but fails $(6, 8)$: $8 + 1 = 9$, not $10$.',
      ],
      keyIdea: 'Know the common right-angled triangle sets: 3, 4, 5; 5, 12, 13; 8, 15, 17; and their multiples, such as 6, 8, 10. If you see them, try squaring, adding and taking the root. Test every example before using the rule.',
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
  {
    id: 'odd-one-out-021',
    subtopic: 'odd-one-out',
    difficulty: 'foundation',
    stem: 'Which number is the odd one out?',
    options: ['$7$', '$3$', '$5$', '$9$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which number does not share a property with the other three?',
      solution:
        'All four are small whole numbers, so test whether each one is **prime**. A prime has exactly two factors, 1 and itself. A factor is a whole number that divides it exactly.\n\n' +
        'Write the ways to make each number by multiplying. 9 has an extra way, $3 \\times 3$, so it is not prime:\n\n| Number | Ways to multiply | Prime? |\n|---|---|---|\n| 3 | $1 \\times 3$ | Yes |\n| 5 | $1 \\times 5$ | Yes |\n| 7 | $1 \\times 7$ | Yes |\n| 9 | $1 \\times 9$ and $3 \\times 3$ | No |',
      conclusion: 'Three of the numbers are prime, and the one that is not is $9$.',
      whyWrong: [
        '$7$ is prime, like $3$ and $5$, so it fits with them.',
        '$3$ is prime, like $5$ and $7$. It is a factor of $9$, but that does not separate it from the rest.',
        '$5$ is prime, like $3$ and $7$, so it fits with them.',
        null,
      ],
      keyIdea: 'With small numbers, test prime first: a prime has exactly two factors. Also try even or odd, square, and multiple of 3. Look for a property shared by three of the items and missing from the fourth.',
    },
    check: {
      optionValues: [7, 3, 5, 9],
      compute: () => oddByKey([7, 3, 5, 9], (n) => String(isPrime(n))),
    },
  },
  {
    id: 'odd-one-out-022',
    subtopic: 'odd-one-out',
    difficulty: 'foundation',
    stem: 'A **palindrome** is a word that:',
    options: ['reads the same forwards and backwards', 'uses each letter only once', 'has the same letters as another word', 'starts and ends with a vowel'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is special about a word that is a palindrome?',
      solution:
        'Take the word RADAR and write it from the last letter to the first: R, A, D, A, R. It is the same word.\n\n' +
        'A word that behaves like this, such as LEVEL or NOON, is called a **palindrome**: it reads the same forwards and backwards.',
      conclusion: 'That is the definition: a palindrome reads the same forwards and backwards.',
      whyWrong: [
        null,
        'A palindrome usually repeats letters: RADAR uses R twice and A twice.',
        'This describes an **anagram**, such as LISTEN and SILENT.',
        'RADAR is a palindrome that starts and ends with a consonant.',
      ],
      keyIdea: 'To test for a palindrome, compare the first letter with the last, the second with the second-last, and so on, working inwards. If every pair matches, it is a palindrome. Try it on LEVEL.',
    },
    check: {
      optionValues: ['RADAR', null, null, null],
      compute: () => ['RADAR', 'MOTOR'].filter(isPalindrome).join('+'),
    },
  },
  {
    id: 'odd-one-out-023',
    subtopic: 'odd-one-out',
    difficulty: 'foundation',
    stem: 'Two words are **anagrams** of each other when they:',
    options: ['use the same letters in a different order', 'read the same backwards', 'start with the same letter', 'have the same number of letters'],
    correctIndex: 0,
    markScheme: {
      asking: 'What makes two words anagrams of each other?',
      solution:
        'Take the word LISTEN and rearrange its letters to spell SILENT. Every letter is used exactly once, and none are added.\n\n' +
        'Two words connected like this are called **anagrams**: they use the same letters in a different order.',
      conclusion: 'Two words are anagrams when they use the same letters in a different order.',
      whyWrong: [
        null,
        'This describes a **palindrome**, which is a property of one word.',
        'LISTEN and SILENT are anagrams that start with different letters.',
        'Equal length is necessary but not enough: CAT and DOG have the same length but different letters.',
      ],
      keyIdea: 'To test for anagrams, sort each word\'s letters alphabetically and compare. LISTEN and SILENT both become E I L N S T. Identical lists mean anagrams, and being the same length is not enough.',
    },
    check: {
      optionValues: ['same letters', null, null, null],
      compute: () => {
        const sorted = (w: string) => [...w].sort().join('');
        return sorted('LISTEN') === sorted('SILENT') ? 'same letters' : 'different';
      },
    },
  },
  {
    id: 'odd-one-out-024',
    subtopic: 'odd-one-out',
    difficulty: 'foundation',
    stem: 'In an odd-one-out question with four items, the right property splits them:',
    options: ['3 against 1', '2 against 2', '4 against 0', 'by size alone'],
    correctIndex: 0,
    markScheme: {
      asking: 'How should a good rule divide the four items?',
      solution:
        'We are looking for one item that is different from the others. So the property must be shared by some items and missing from just that one.\n\n' +
        'A 2 against 2 split picks out no single item, and a 4 against 0 split separates nobody. Only 3 against 1 leaves a single item on its own while the others share the property.',
      conclusion: 'One item must stand alone while the others share the property, so the split is 3 against 1.',
      whyWrong: [
        null,
        'A 2 against 2 split leaves no single item as the odd one out, so that property is not the rule.',
        'If all four items share a property, it cannot separate any of them.',
        'Being the largest or smallest is a one-off fact, not a property that three items share.',
      ],
      keyIdea: 'For each property you try, write how it splits the four items. Reject 2 against 2 and 4 against 0. Keep testing properties until one gives 3 against 1: the single item is the answer.',
    },
  },
];
