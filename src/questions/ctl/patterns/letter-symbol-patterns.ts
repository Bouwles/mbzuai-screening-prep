import type { StaticQuestion } from '../../../types';

// ---------------------------------------------------------------- helpers used by the answer checks
/** Alphabet position of a capital letter: A = 1, ..., Z = 26. */
const pos = (ch: string): number => ch.charCodeAt(0) - 64;
/** Letter at a position, wrapping round the alphabet (27 -> A, 0 -> Z). */
const letter = (n: number): string => String.fromCharCode(((((n - 1) % 26) + 26) % 26) + 65);
/** Shift every letter of a word by k places (negative k = backwards), wrapping Z -> A. */
const shift = (word: string, k: number): string =>
  word
    .split('')
    .map((c) => letter(pos(c) + k))
    .join('');
const reverse = (s: string): string => s.split('').reverse().join('');
/** Next letter in a sequence whose gaps form an arithmetic sequence (constant gaps, or gaps going up by 1). */
function nextBySecondDifference(seq: string): string {
  const p = seq.split('').map(pos);
  const gaps = p.slice(1).map((v, i) => v - p[i]);
  const gapStep = gaps[gaps.length - 1] - gaps[gaps.length - 2];
  return letter(p[p.length - 1] + gaps[gaps.length - 1] + gapStep);
}

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'letter-symbol-patterns-001',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'foundation',
    stem: 'What letter comes next in the sequence?\n\n**B, E, H, K, ?**',
    options: ['M', 'O', 'N', 'L'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which letter comes after K in this list?',
      solution:
        'Letters are hard to compare, so turn them into numbers using their positions in the alphabet: A = 1, B = 2, C = 3 and so on. Here B = 2, E = 5, H = 8 and K = 11.\n\n' +
        'Find the gaps: $5 - 2 = 3$, $8 - 5 = 3$ and $11 - 8 = 3$. Each letter is 3 places after the one before.\n\n' +
        'Add 3 to K\'s position: $11 + 3 = 14$. Counting on from J = 10, position 14 is N.',
      conclusion: 'The pattern adds 3 positions each time, and position 14 is N.',
      whyWrong: [
        'M is position 13: this adds only 2 to K. It happens if you count K itself as one of the three steps (K, L, M). Count the steps after K: L, M, N.',
        'O is position 15: this adds 4 instead of 3, overshooting by one letter.',
        null,
        'L is simply the letter after K. It ignores the rule: every term is 3 places after the one before.',
      ],
      keyIdea: 'Turn letters into positions (A = 1). Useful anchors are E = 5, J = 10, O = 15, T = 20 and Y = 25. Find the gaps, then treat it as a number sequence.',
    },
    check: { optionValues: ['M', 'O', 'N', 'L'], compute: () => nextBySecondDifference('BEHK') },
  },
  {
    id: 'letter-symbol-patterns-002',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'foundation',
    stem: 'In a code, every letter is replaced by its position in the alphabet: A = 1, B = 2, C = 3, ..., Z = 26. How is the word **DOG** written in this code?',
    options: ['4, 15, 7', '4, 14, 7', '3, 14, 6', '23, 12, 20'],
    correctIndex: 0,
    markScheme: {
      asking: 'What numbers stand for the letters D, O and G?',
      solution:
        'The code uses each letter\'s position in the alphabet. Counting from A every time invites slips, so use anchors: E = 5, J = 10, O = 15, T = 20.\n\n' +
        'D is one before E, so D = 4. O is an anchor, so O = 15. G is two after E, so G = 7.\n\n' +
        'Write the three numbers in the same order as the letters of the word: 4, 15, 7.',
      conclusion: 'Writing the three positions in order gives 4, 15, 7.',
      whyWrong: [
        null,
        'This miscounts O as 14 (that is N). Use the anchor O = 15 to avoid counting errors.',
        'This starts counting at A = 0, so every number is 1 too small. The code says A = 1.',
        'This counts backwards from Z (Z = 1, Y = 2, ...). That is a different code, the reverse alphabet, not the one described.',
      ],
      keyIdea: 'Learn the anchors E = 5, J = 10, O = 15, T = 20, Y = 25 and count from the nearest one. Read the code\'s starting point as well: A = 1 means the first letter\'s number is 1, not 0.',
    },
    check: {
      optionValues: ['4,15,7', '4,14,7', '3,14,6', '23,12,20'],
      compute: () =>
        'DOG'
          .split('')
          .map(pos)
          .join(','),
    },
  },
  {
    id: 'letter-symbol-patterns-003',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'foundation',
    stem: 'A shift cipher replaces each letter by the letter **3 places later** in the alphabet (A becomes D, B becomes E, and so on). How is **CAT** written in this cipher?',
    options: ['ZXQ', 'FDW', 'DBU', 'GEX'],
    correctIndex: 1,
    markScheme: {
      asking: 'What do you get when you move each letter of CAT forward 3 places?',
      solution:
        'A **shift cipher** moves every letter by the same number of places. Here that number is 3, moving forward towards Z.\n\n' +
        'Count on 3 letters from each letter, one at a time, starting with the letter after it. The last column spells FDW:\n\n| Letter | Count on 3 | New letter |\n|---|---|---|\n| C | D, E, F | F |\n| A | B, C, D | D |\n| T | U, V, W | W |',
      conclusion: 'Shifting each letter 3 places forward gives FDW.',
      whyWrong: [
        'This shifts each letter 3 places **backwards** (C to Z, A to X, T to Q). That is how you would *decode*, not encode.',
        null,
        'This shifts each letter by only 1 place (C to D, A to B, T to U).',
        'This shifts each letter by 4 places instead of 3 (C to G, A to E, T to X).',
      ],
      keyIdea: 'For a shift cipher, count forward the given number of places for each letter, starting from the letter after it. Past Z, continue from A. To decode, count backwards instead.',
    },
    check: { optionValues: ['ZXQ', 'FDW', 'DBU', 'GEX'], compute: () => shift('CAT', 3) },
  },
  {
    id: 'letter-symbol-patterns-004',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'foundation',
    stem: 'A row of symbols repeats the same block of four over and over:\n\n▲ ● ■ ◆ ▲ ● ■ ◆ ▲ ● ■ ◆ ...\n\nWhat is the **10th** symbol in the row?',
    options: ['▲ (triangle)', '■ (square)', '◆ (diamond)', '● (circle)'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which symbol is in place 10 of this repeating row?',
      solution:
        'The row repeats every 4 symbols. So count how many full blocks fit into 10: $10 \\div 4$ is 2 remainder 2. The **remainder** is what is left over after dividing.\n\n' +
        'Two full blocks use up $2 \\times 4 = 8$ symbols, so symbol 8 is the end of a block, which is ◆.\n\n' +
        'The remainder of 2 means we go 2 symbols into a new block. Symbol 9 is ▲, and symbol 10 is ●.',
      conclusion: 'The remainder of 2 points to the second symbol of the block, which is ● (circle).',
      whyWrong: [
        '▲ is the 9th symbol. After two full blocks (8 symbols) the next symbol is the 9th, not the 10th: you need to count one more.',
        '■ is the 3rd symbol of the block. This is an off-by-one slip: remainder 2 means the 2nd symbol, not the one after it.',
        '◆ sits at positions 4, 8, 12, ... (the multiples of 4). 10 is not a multiple of 4, so the 10th symbol cannot be ◆.',
        null,
      ],
      keyIdea: 'For repeating patterns, divide the position by the block length. A remainder of $k$ means the $k$th symbol of the block. A remainder of 0 means the last symbol of the block.',
    },
    check: {
      optionValues: ['▲', '■', '◆', '●'],
      compute: () => {
        const block = ['▲', '●', '■', '◆'];
        return block[(10 - 1) % block.length];
      },
    },
  },
  {
    id: 'letter-symbol-patterns-005',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'foundation',
    stem: 'Each row of this grid follows the same rule. What number replaces the question mark?',
    table: {
      headers: ['Column 1', 'Column 2', 'Column 3'],
      rows: [
        [2, 4, 8],
        [3, 6, 12],
        [5, 10, '?'],
      ],
    },
    options: ['15', '25', '20', '50'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which number completes the third row?',
      solution:
        'Look at row 1: 2, 4, 8. Each number is double the one before: $2 \\times 2 = 4$ and $4 \\times 2 = 8$.\n\n' +
        'Test this on row 2: 3, 6, 12. We get $3 \\times 2 = 6$ and $6 \\times 2 = 12$, so the rule holds.\n\n' +
        'Apply it to row 3: 5, 10, ?. The first step fits, because $5 \\times 2 = 10$. So the missing number is $10 \\times 2 = 20$.',
      conclusion: 'Every row doubles from left to right, so the missing number is 20.',
      whyWrong: [
        'This continues 5, 10 by **adding** 5. The rows above do not add a fixed amount (2, 4, 8 goes up by 2 then by 4), they double.',
        'This is $5 \\times 5$. Squaring the first number does not match row 1 ($2 \\times 2 = 4$, not 8).',
        null,
        'This multiplies the first two numbers, $5 \\times 10$. That rule happens to work for row 1 ($2 \\times 4 = 8$) but fails row 2 ($3 \\times 6 = 18$, not 12). Always test a rule on **every** complete row.',
      ],
      keyIdea: 'Find a rule from one complete row, then test it on every other complete row. If it survives, apply it to the incomplete row. Try adding, then multiplying, then powers, and reject any rule that fails even one row.',
    },
    check: {
      optionValues: [15, 25, 20, 50],
      compute: () => {
        const rows = [
          [2, 4, 8],
          [3, 6, 12],
        ];
        const ratio = rows[0][1] / rows[0][0];
        if (!rows.every((r) => r[1] === r[0] * ratio && r[2] === r[1] * ratio)) throw new Error('rule fails');
        return 10 * ratio;
      },
    },
  },

  // ================================================================ exam
  {
    id: 'letter-symbol-patterns-006',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'What letter comes next?\n\n**A, C, F, J, O, ?**',
    options: ['T', 'U', 'V', 'S'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which letter comes after O in this list?',
      solution:
        'Turn the letters into positions: A = 1, C = 3, F = 6, J = 10, O = 15.\n\n' +
        'Find the gaps: $3 - 1 = 2$, $6 - 3 = 3$, $10 - 6 = 4$ and $15 - 10 = 5$. The gaps go up by 1 each time.\n\n' +
        'So the next gap is 6, and the next position is $15 + 6 = 21$. Counting on from T = 20, position 21 is U.',
      conclusion: 'Gaps of 2, 3, 4 and 5 are followed by a gap of 6, so the next letter is U.',
      whyWrong: [
        'T is position 20: this repeats the last gap of 5. The gaps are growing (2, 3, 4, 5), so the next one is 6.',
        null,
        'V is position 22: this adds 7, jumping one gap too far.',
        'S is position 19: this adds only 4, as if the gaps started shrinking again. The gaps keep increasing.',
      ],
      keyIdea: 'If the gaps between letter positions are not equal, write the gaps in a row and look for a pattern in them. A steadily growing gap is common. Use anchors (E = 5, J = 10, O = 15, T = 20) to avoid miscounting.',
    },
    check: { optionValues: ['T', 'U', 'V', 'S'], compute: () => nextBySecondDifference('ACFJO') },
  },
  {
    id: 'letter-symbol-patterns-007',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'What are the next **two** letters in this sequence?\n\n**Z, B, X, D, V, F, ?, ?**',
    options: ['T, H', 'H, T', 'U, H', 'T, G'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which two letters continue this list?',
      solution:
        'The letters jump around, so it may be two lists woven together. Split it by position:\n\n| Positions | Letters | Movement |\n|---|---|---|\n| 1st, 3rd, 5th | Z, X, V | 2 places back each time |\n| 2nd, 4th, 6th | B, D, F | 2 places forward each time |\n\n' +
        'The 7th place belongs to the first list. Going 2 places back from V gives U, then T. So the 7th letter is T.\n\n' +
        'The 8th place belongs to the second list. Going 2 places forward from F gives G, then H. So the 8th letter is H.',
      conclusion: 'The two woven lists give the 7th and 8th letters in order: T, H.',
      whyWrong: [
        null,
        'These are the right two letters in the wrong order. The 7th term continues the backwards sequence Z, X, V, so T comes before H.',
        'U is only 1 step back from V. The backwards sequence goes Z, X, V, which steps back by 2 each time.',
        'G is only 1 step on from F. The forwards sequence goes B, D, F, which steps forward by 2 each time.',
      ],
      keyIdea: 'When letters jump back and forth, split them into odd and even positions and find a rule for each list. Then work out which list each missing place belongs to, and keep the letters in the requested order.',
    },
    check: {
      optionValues: ['T,H', 'H,T', 'U,H', 'T,G'],
      compute: () => {
        const seq = 'ZBXDVF'.split('').map(pos);
        const odd = seq.filter((_, i) => i % 2 === 0);
        const even = seq.filter((_, i) => i % 2 === 1);
        const nextOdd = odd[odd.length - 1] + (odd[1] - odd[0]);
        const nextEven = even[even.length - 1] + (even[1] - even[0]);
        return `${letter(nextOdd)},${letter(nextEven)}`;
      },
    },
  },
  {
    id: 'letter-symbol-patterns-008',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'In a certain code, **CAT = 24**. Using the same code, what is **DOG**?',
    options: ['25', '55', '420', '26'],
    correctIndex: 3,
    markScheme: {
      asking: 'Work out what the code does from CAT, then use it on DOG.',
      solution:
        'When a word turns into a number, the number often comes from letter positions. Here C = 3, A = 1 and T = 20.\n\n' +
        'Test the simplest idea, adding: $3 + 1 + 20 = 24$. That matches CAT = 24. Multiplying would give 60, so adding is the rule.\n\n' +
        'Use the rule on DOG. D = 4, O = 15 and G = 7, so $4 + 15 + 7 = 26$.',
      conclusion: 'The code adds the letter positions, so DOG gives 26.',
      whyWrong: [
        'This miscounts O as 14 (which is N), giving $4 + 14 + 7 = 25$. Use the anchor O = 15.',
        'This uses reverse-alphabet positions (Z = 1, so D = 23, O = 12, G = 20) and adds them. That rule does not give CAT = 24 (it gives 57).',
        'This multiplies the positions: $4 \\times 15 \\times 7 = 420$. Multiplying does not fit the example, since $3 \\times 1 \\times 20 = 60$, not 24.',
        null,
      ],
      keyIdea: 'When a word equals a number, write each letter\'s position (A = 1). Try adding the positions first, then multiplying. Keep only a rule that reproduces every example, then apply it to the new word.',
    },
    check: {
      optionValues: [25, 55, 420, 26],
      compute: () => {
        const sum = (w: string) => w.split('').reduce((a, c) => a + pos(c), 0);
        if (sum('CAT') !== 24) throw new Error('rule does not fit');
        return sum('DOG');
      },
    },
  },
  {
    id: 'letter-symbol-patterns-009',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'In a code language, **MANGO** is written as **PDQJR**. How is **APPLE** written in the same code?',
    options: ['XMMIB', 'CRRNG', 'DSSOH', 'ETTPI'],
    correctIndex: 2,
    markScheme: {
      asking: 'Work out the code from MANGO, then use it on APPLE.',
      solution:
        'Compare the two words one letter at a time, using positions:\n\n| Original | M | A | N | G | O |\n|---|---|---|---|---|---|\n| Position | 13 | 1 | 14 | 7 | 15 |\n| Code | P | D | Q | J | R |\n| Position | 16 | 4 | 17 | 10 | 18 |\n\n' +
        'In every column the code position is 3 more: for example, $16 - 13 = 3$. So the code moves each letter 3 places forward.\n\n' +
        'Apply this to APPLE. The bottom row spells DSSOH:\n\n| Original | A | P | P | L | E |\n|---|---|---|---|---|---|\n| Count on 3 | B, C, D | Q, R, S | Q, R, S | M, N, O | F, G, H |\n| Code | D | S | S | O | H |',
      conclusion: 'Moving each letter 3 places forward turns APPLE into DSSOH.',
      whyWrong: [
        'This shifts each letter 3 places **backwards**. In the example the code letters come later in the alphabet than the originals (M to P), so the shift is forwards.',
        'This shifts by only 2, which happens if you count the starting letter as one of the steps (M, N, O instead of N, O, P).',
        null,
        'This shifts by 4 places instead of 3.',
      ],
      keyIdea: 'To crack a letter-for-letter code, compare the first letters of an example to find the shift. Confirm it on the other letters, because some codes change the shift. Then apply it to the new word.',
    },
    check: {
      optionValues: ['XMMIB', 'CRRNG', 'DSSOH', 'ETTPI'],
      compute: () => {
        const k = pos('P') - pos('M');
        if (shift('MANGO', k) !== 'PDQJR') throw new Error('not a constant shift');
        return shift('APPLE', k);
      },
    },
  },
  {
    id: 'letter-symbol-patterns-010',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'A message was encoded by moving every letter **4 places forward** in the alphabet, wrapping round from Z back to A (so W becomes A). The encoded word is **AEC**. What was the original word?',
    options: ['EIG', 'WAY', 'XBZ', 'VZX'],
    correctIndex: 1,
    markScheme: {
      asking: 'Undo the 4-place shift. Which word was turned into AEC?',
      solution:
        'The word was encoded by moving **forward** 4 places. To get back to the original, do the opposite: move **backward** 4 places.\n\n' +
        'The alphabet wraps round, so going backward past A continues from Z. Count back from each letter. The last column spells WAY:\n\n| Coded letter | Count back 4 | Original |\n|---|---|---|\n| A | Z, Y, X, W | W |\n| E | D, C, B, A | A |\n| C | B, A, Z, Y | Y |',
      conclusion: 'Moving each letter back 4 places gives WAY. To test it, moving W forward 4 places gives A, matching the stem.',
      whyWrong: [
        'This moves each letter 4 places **forward** again (encoding twice). To undo the code you must move backwards.',
        null,
        'This moves back only 3 places (A to X, E to B, C to Z).',
        'This moves back 5 places (A to V, E to Z, C to X), one step too many.',
      ],
      keyIdea: 'To decode a shift cipher, apply the opposite shift. When going back past A, wrap round to Z. Using positions, add 26 if the result is below 1. Test your answer by encoding it again.',
    },
    check: { optionValues: ['EIG', 'WAY', 'XBZ', 'VZX'], compute: () => shift('AEC', -4) },
  },
  {
    id: 'letter-symbol-patterns-011',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'A long row of symbols repeats this block of six over and over:\n\n● ● ■ ▲ ▲ ▲\n\n(circle, circle, square, triangle, triangle, triangle). How many **triangles** are there among the **first 50** symbols?',
    options: ['24', '25', '26', '27'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many triangles appear in the first 50 symbols of this repeating row?',
      solution:
        'The block has 6 symbols, and 3 of them are triangles. Find how many full blocks fit into 50: $50 \\div 6$ is 8 remainder 2, because $8 \\times 6 = 48$ with 2 left over.\n\n' +
        'Look at the 2 leftover symbols. They are the first 2 symbols of a new block: ● and ●. Neither is a triangle, so they add nothing.\n\n' +
        'So all the triangles are in the 8 full blocks, with 3 in each: $8 \\times 3 = 24$.',
      conclusion: 'The 8 full blocks hold all the triangles, and the 2 extra circles add none, so the total is 24.',
      whyWrong: [
        null,
        'This takes half of 50, because half of each block is triangles. That only works for full blocks: the last 2 symbols are both circles, so it is half of 48.',
        'This counts the 2 leftover symbols as triangles. The leftovers are the first two symbols of a block, which are circles.',
        'This rounds $50 \\div 6 \\approx 8.3$ up to 9 blocks, giving $9 \\times 3 = 27$. The 9th block is far from complete: only its first two symbols are used.',
      ],
      keyIdea: 'To count items in a repeating pattern, find the full blocks by dividing, then multiply by the number of items per block. Then look at the remainder symbols one by one, and add any that match.',
    },
    check: {
      optionValues: [24, 25, 26, 27],
      compute: () => {
        const block = ['C', 'C', 'S', 'T', 'T', 'T'];
        let count = 0;
        for (let i = 0; i < 50; i++) if (block[i % block.length] === 'T') count++;
        return count;
      },
    },
  },
  {
    id: 'letter-symbol-patterns-012',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'Every row of the table follows the same rule, which turns the first two numbers into the third. What number replaces the question mark?',
    table: {
      headers: ['First', 'Second', 'Third'],
      rows: [
        [3, 4, 13],
        [5, 2, 11],
        [2, 7, 15],
        [6, 3, '?'],
      ],
    },
    options: ['18', '10', '9', '19'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which number completes the last row, using the same rule as the others?',
      solution:
        'Look at row 1: 3, 4, 13. Adding gives $3 + 4 = 7$, which is far from 13. Multiplying gives $3 \\times 4 = 12$, which is just 1 short.\n\n' +
        'So try "multiply, then add 1". Test it on the other complete rows: $5 \\times 2 + 1 = 11$ fits, and $2 \\times 7 + 1 = 15$ fits.\n\n' +
        'Apply it to the last row: $6 \\times 3 + 1 = 18 + 1 = 19$.',
      conclusion: 'The rule "multiply, then add 1" works for every complete row and gives 19.',
      whyWrong: [
        'This is $6 \\times 3$: it forgets the "+ 1" part of the rule. Check row 1: $3 \\times 4 = 12$, not 13.',
        'This is $6 + 3 + 1$: adding the numbers does not fit, since $3 + 4 + 1 = 8$, not 13.',
        'This is $6 + 3$: adding the numbers does not fit any of the complete rows.',
        null,
      ],
      keyIdea: 'Try simple operations on one row: add, multiply, square. If a result is close, adjust by a small fixed amount. Test that rule on every complete row. Only then apply it to the incomplete row.',
    },
    check: {
      optionValues: [18, 10, 9, 19],
      compute: () => {
        const rule = (a: number, b: number) => a * b + 1;
        const rows = [
          [3, 4, 13],
          [5, 2, 11],
          [2, 7, 15],
        ];
        if (!rows.every(([a, b, c]) => rule(a, b) === c)) throw new Error('rule fails');
        return rule(6, 3);
      },
    },
  },
  {
    id: 'letter-symbol-patterns-013',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'The letters in this 3 by 3 grid follow a pattern along the rows and down the columns. Which letter replaces the question mark?',
    table: {
      headers: ['', 'Column 1', 'Column 2', 'Column 3'],
      rows: [
        ['Row 1', 'A', 'C', 'E'],
        ['Row 2', 'B', 'E', 'H'],
        ['Row 3', 'C', 'G', '?'],
      ],
    },
    options: ['I', 'K', 'J', 'L'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which letter belongs in the bottom-right square of the grid?',
      solution:
        'Turn the letters into positions, with A = 1:\n\n|  | Column 1 | Column 2 | Column 3 |\n|---|---|---|---|\n| Row 1 | A = 1 | C = 3 | E = 5 |\n| Row 2 | B = 2 | E = 5 | H = 8 |\n| Row 3 | C = 3 | G = 7 | ? |\n\n' +
        'Find each row\'s gap. Row 1 goes up by 2 and row 2 goes up by 3. So row 3 should go up by 4, and it does: $7 - 3 = 4$.\n\n' +
        'Add row 3\'s gap once more: $7 + 4 = 11$. Since J = 10, position 11 is K. The columns agree: column 3 goes 5, 8, 11.',
      conclusion: 'Row 3 goes up by 4 and the columns agree, so the missing letter is K.',
      whyWrong: [
        'I is G + 2: it reuses row 1\'s step of 2. Each row has its own step (2, 3, 4), and row 3\'s step is $7 - 3 = 4$.',
        null,
        'J is G + 3: it reuses row 2\'s step of 3 instead of row 3\'s step of 4.',
        'L is G + 5: one step too far. Row 3 goes C to G, a step of 4, so the next letter is 4 after G.',
      ],
      keyIdea: 'Turn the grid letters into numbers, then look at the gaps along rows and down columns. Each line may have its own gap. Use one direction to find the answer and the other direction to test it.',
    },
    check: {
      optionValues: ['I', 'K', 'J', 'L'],
      compute: () => {
        const r3 = [pos('C'), pos('G')];
        const viaRow = letter(r3[1] + (r3[1] - r3[0]));
        const col3 = [pos('E'), pos('H')];
        const viaCol = letter(col3[1] + (col3[1] - col3[0]));
        if (viaRow !== viaCol) throw new Error('row and column disagree');
        return viaRow;
      },
    },
  },
  {
    id: 'letter-symbol-patterns-014',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'Each symbol stands for a whole number.\n\n$$\\triangle + \\triangle + \\triangle = 18$$\n\n$$\\triangle + \\square = 10$$\n\n$$\\square \\times \\bigcirc = 12$$\n\nWhat is the value of $\\triangle + \\square + \\bigcirc$?',
    options: ['18', '22', '13', '10'],
    correctIndex: 2,
    markScheme: {
      asking: 'Find the values of the three shapes, then add them.',
      solution:
        'Each shape stands for one number. Start with the line that has only one kind of shape: $\\triangle + \\triangle + \\triangle = 18$. Three equal numbers total 18, so $\\triangle = 18 \\div 3 = 6$.\n\n' +
        'Put 6 into the second line: $6 + \\square = 10$. Take 6 from both sides to get $\\square$ on its own: $\\square = 4$.\n\n' +
        'Put 4 into the third line: $4 \\times \\bigcirc = 12$. Divide both sides by 4: $\\bigcirc = 3$.\n\n' +
        'Add the three values: $6 + 4 + 3 = 13$.',
      conclusion: 'The shapes stand for 6, 4 and 3, which add up to 13.',
      whyWrong: [
        'This subtracts in the last line ($\\bigcirc = 12 - 4 = 8$) instead of dividing. The line says $\\square \\times \\bigcirc = 12$, so divide 12 by 4.',
        'This divides 18 by 2 instead of 3 (there are **three** triangles), giving $\\triangle = 9$, $\\square = 1$, $\\bigcirc = 12$.',
        null,
        'This is just $\\triangle + \\square$, read off the second line. It forgets to add the circle.',
      ],
      keyIdea: 'Treat shapes as unknown numbers. Start from the line with only one unknown, solve it, and substitute that value into the next line. Repeat until every shape has a value, then combine them as the question asks.',
    },
    check: {
      optionValues: [18, 22, 13, 10],
      compute: () => {
        const tri = 18 / 3;
        const sq = 10 - tri;
        const circ = 12 / sq;
        return tri + sq + circ;
      },
    },
  },
  {
    id: 'letter-symbol-patterns-015',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'A code works in two steps: first move every letter **2 places forward** in the alphabet, then write the result **backwards**. How is **CODE** written in this code?',
    options: ['GFQE', 'EQFG', 'CBMA', 'FEPD'],
    correctIndex: 0,
    markScheme: {
      asking: 'Apply the two steps to CODE, in order. What do you get?',
      solution:
        'First step: move every letter 2 places forward. So CODE becomes EQFG:\n\n| Letter | C | O | D | E |\n|---|---|---|---|---|\n| 2 places forward | E | Q | F | G |\n\n' +
        'Second step: write EQFG backwards, reading from its last letter to its first: G, F, Q, E. That spells GFQE.',
      conclusion: 'Shifting and then reversing gives GFQE.',
      whyWrong: [
        null,
        'This does the shift but forgets step 2, writing the word backwards.',
        'This reverses the word (EDOC) but then shifts 2 places **backwards** instead of forwards.',
        'This reverses the word (EDOC) but shifts by only 1 place instead of 2.',
      ],
      keyIdea: 'For a code with several steps, do them one at a time in the stated order, and write down the word after each step so that no step gets skipped. To decode, undo the steps in reverse order.',
    },
    check: { optionValues: ['GFQE', 'EQFG', 'CBMA', 'FEPD'], compute: () => reverse(shift('CODE', 2)) },
  },
  {
    id: 'letter-symbol-patterns-016',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'Letters are numbered A = 0 to Z = 25. Arrays are indexed from 1. This code shifts Z, O, O forward by 2 places. What does it print, in order?',
    code: {
      lang: 'pseudocode',
      source: 'L = [25, 14, 14]\nfor i = 1 to 3\n   print(mod(L[i] + 2, 26)) // mod is the modulus operator\nend for',
    },
    options: ['`0 16 16`', '`23 12 12`', '`27 16 16`', '`1 16 16`'],
    correctIndex: 3,
    markScheme: {
      asking: 'What are the three numbers that this loop prints?',
      solution:
        '`L` holds the positions of Z, O, O, where A = 0. Arrays start at 1 here, so `L[1]` is 25, `L[2]` is 14 and `L[3]` is 14.\n\n' +
        '`mod(a,b)` means the remainder when `a` is divided by `b`. For example, $27 \\div 26$ is 1 remainder 1, so `mod(27,26)` is 1. Here it wraps a position round: past Z, it goes back to the start.\n\n' +
        'The loop on line 2 runs with `i` as 1, 2 and 3, and line 3 prints the last column each time:\n\n| `i` | `L[i]` | `L[i] + 2` | `mod(L[i] + 2, 26)` |\n|---|---|---|---|\n| 1 | 25 | 27 | 1 |\n| 2 | 14 | 16 | 16 |\n| 3 | 14 | 16 | 16 |',
      conclusion: 'Z wraps round to position 1 and each O moves to 16, so the code prints `1 16 16`.',
      whyWrong: [
        'This moves Z only one step, to position 0. Shifting by 2 goes from Z to A and then from A to B, which is position 1.',
        'This shifts each letter 2 places **backwards**. The code adds 2 to the position.',
        'This forgets the wrap-around: $27$ is not a position, and `mod(27, 26)` is 1.',
        null,
      ],
      keyIdea: 'With letters numbered from 0, a shift is `mod(position + shift, 26)`. Anything below 26 stays the same, and anything from 26 up wraps to the start. Trace an array loop with a table of `i`, `L[i]` and the result.',
    },
    check: {
      optionValues: ['0 16 16', '23 12 12', '27 16 16', '1 16 16'],
      compute: () => [pos('Z') - 1, pos('O') - 1, pos('O') - 1].map((p) => (p + 2) % 26).join(' '),
    },
  },
  {
    id: 'letter-symbol-patterns-020',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'In a code, the $k$th letter of a word moves $k$ places forward in the alphabet, so **BAD** becomes **CCG**. What does **CODE** become?',
    options: ['DPEF', 'CPFH', 'GSHI', 'DQGI'],
    correctIndex: 3,
    markScheme: {
      asking: 'Using the position-based shifts, what does CODE become?',
      solution:
        'Try the rule on the example first. In BAD, B is the 1st letter, so it moves 1 place to C. A is the 2nd letter, so it moves 2 places to C. D is the 3rd letter, so it moves 3 places to G. That gives CCG, as the stem says.\n\n' +
        'Apply the same rule to CODE. The bottom row spells DQGI:\n\n| Place in the word | 1st | 2nd | 3rd | 4th |\n|---|---|---|---|---|\n| Letter | C | O | D | E |\n| Move forward | 1 | 2 | 3 | 4 |\n| New letter | D | Q | G | I |',
      conclusion: 'Each letter moves by its place in the word, so CODE becomes DQGI.',
      whyWrong: [
        'This moves every letter by just 1 place. The shift grows with the position in the word: 1, 2, 3, 4.',
        'This uses shifts 0, 1, 2, 3, starting one too low. In the example the first letter B does move (to C), so the first shift is 1.',
        'This moves every letter 4 places, using the shift for the last letter on the whole word.',
        null,
      ],
      keyIdea: 'Draw a table with each letter\'s place on top and its shift underneath. Try the rule on the example before using it. Count shifts from the letter itself: the next letter along is 1 place.',
    },
    check: {
      optionValues: ['DPEF', 'CPFH', 'GSHI', 'DQGI'],
      compute: () => {
        const code = (w: string) =>
          w
            .split('')
            .map((c, i) => letter(pos(c) + i + 1))
            .join('');
        if (code('BAD') !== 'CCG') throw new Error('rule does not fit');
        return code('CODE');
      },
    },
  },
  {
    id: 'letter-symbol-patterns-021',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'In a certain code, **BAG = 14** and **FED = 120**. Using the same code, what is **HIDE**?',
    options: ['26', '1440', '30', '672'],
    correctIndex: 1,
    markScheme: {
      asking: 'Find the rule that turns BAG into 14 and FED into 120, then apply it to HIDE.',
      solution:
        'Turn the letters into positions, with A = 1. BAG is 2, 1, 7. FED is 6, 5, 4.\n\n' +
        'Try adding: $2 + 1 + 7 = 10$, not 14. So adding fails.\n\n' +
        'Try multiplying: $2 \\times 1 \\times 7 = 14$, which fits. Test FED: $6 \\times 5 \\times 4 = 120$, which also fits.\n\n' +
        'Apply it to HIDE: H = 8, I = 9, D = 4 and E = 5. Multiply in pairs to make it easier: $8 \\times 9 = 72$ and $4 \\times 5 = 20$, so $72 \\times 20 = 1440$.',
      conclusion: 'The code multiplies the letter positions, and for HIDE that gives 1440.',
      whyWrong: [
        'This adds the positions: $8 + 9 + 4 + 5 = 26$. Adding does not fit either example (BAG would be 10, not 14).',
        null,
        'This uses "add the positions, then add 4", which fits BAG ($10 + 4 = 14$) but not FED ($15 + 4 = 19$, not 120). A rule must fit every example.',
        'This multiplies positions counted from A = 0 (H = 7, I = 8, D = 3, E = 4): $7 \\times 8 \\times 3 \\times 4 = 672$. With A = 0, BAG would be 0, not 14.',
      ],
      keyIdea: 'Write the letter positions (A = 1) and try adding, then multiplying. A rule counts only if it fits every example. When multiplying, pair the numbers to make it easier, such as $4 \\times 5 = 20$.',
    },
    check: {
      optionValues: [26, 1440, 30, 672],
      compute: () => {
        const prod = (w: string) => w.split('').reduce((a, c) => a * pos(c), 1);
        if (prod('BAG') !== 14 || prod('FED') !== 120) throw new Error('rule does not fit');
        return prod('HIDE');
      },
    },
  },
  {
    id: 'letter-symbol-patterns-022',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'foundation',
    stem: 'With A = 1, what is the position of the letter **M** in the alphabet?',
    options: ['12', '13', '14', '15'],
    correctIndex: 1,
    markScheme: {
      asking: 'Counting A as 1, what number is M?',
      solution:
        'Use anchors instead of counting from A: E = 5, J = 10, O = 15. M lies between J and O.\n\n' +
        'Count on from J = 10: K = 11, L = 12, M = 13.',
      conclusion: 'Counting on from J = 10 reaches M at position 13.',
      whyWrong: [
        'This is L, or M counted from A = 0. The question says A = 1.',
        null,
        'This is N, the letter after M.',
        'This is O, the anchor letter. M comes two letters before it.',
      ],
      keyIdea: 'Learn the anchors E = 5, J = 10, O = 15, T = 20, Y = 25. Count from the nearest one instead of from A, so that mistakes are less likely.',
    },
    check: { optionValues: [12, 13, 14, 15], compute: () => pos('M') },
  },
  {
    id: 'letter-symbol-patterns-023',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'foundation',
    stem: 'A shift cipher replaces each letter using:',
    options: ['the same shift for every letter', 'a different shift for each letter', 'the reversed alphabet', 'its position as a number'],
    correctIndex: 0,
    markScheme: {
      asking: 'How does a shift cipher change the letters?',
      solution:
        'A **cipher** is a way of hiding a message by changing its letters. In a **shift** cipher, every letter moves along the alphabet.\n\n' +
        '"Shift" means the whole alphabet slides by one fixed amount. If A moves 3 places to D, then B moves 3 places to E, and so on. So every letter gets the same shift.',
      conclusion: 'One fixed amount applies to all the letters, so a shift cipher uses the same shift for every letter.',
      whyWrong: [
        null,
        'That is a position-dependent code. In a shift cipher the shift never changes.',
        'That is the reverse-alphabet code, where A swaps with Z and B with Y.',
        'That is a letter-to-number code, such as DOG = 4, 15, 7.',
      ],
      keyIdea: 'Recognise the code by comparing positions. The same gap for all letters is a shift cipher. A gap that changes with the letter\'s place is a position code. A swapped with Z is the reverse alphabet. Letters becoming numbers is a letter-to-number code.',
    },
  },
  {
    id: 'letter-symbol-patterns-024',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'foundation',
    stem: 'In the reverse-alphabet code, A becomes Z, B becomes Y, and so on. What does **D** become?',
    options: ['W', 'X', 'V', 'E'],
    correctIndex: 0,
    markScheme: {
      asking: 'Using the reversed alphabet, what letter matches D?',
      solution:
        'The code pairs up the alphabet from both ends. Write out the pairs we are given: A with Z, and B with Y. The next pair is C with X.\n\n' +
        'Go one more step. D is the next letter after C, and the next letter going backwards from X is W. So D becomes W.',
      conclusion: 'D is the 4th letter from the start, and the 4th letter from the end is W.',
      whyWrong: [
        null,
        'This is the code for C. Counting along A to Z, B to Y, C to X, D goes one further, to W.',
        'This is the code for E, which uses $27 - 5$. D is position 4.',
        'This is the next letter after D, which is a shift by 1, not a reversal.',
      ],
      keyIdea: 'For the reverse-alphabet code, each pair of positions adds up to 27, so new position $= 27 -$ old position. For example, D is 4, and $27 - 4 = 23$, which is W.',
    },
    check: { optionValues: ['W', 'X', 'V', 'E'], compute: () => letter(27 - pos('D')) },
  },
  {
    id: 'letter-symbol-patterns-025',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'foundation',
    stem: 'A block of $5$ symbols repeats forever. Which place in the block does the 23rd symbol occupy?',
    options: ['1st', '2nd', '3rd', '4th'],
    correctIndex: 2,
    markScheme: {
      asking: 'If a 5-symbol block keeps repeating, which place in the block is symbol 23?',
      solution:
        'Find how many full blocks come before it. $23 \\div 5$ is 4 remainder 3, because $4 \\times 5 = 20$ with 3 left over.\n\n' +
        'Four full blocks use up 20 symbols, so the 21st symbol starts a new block. The 21st is in 1st place, the 22nd is in 2nd place, and the 23rd is in 3rd place.',
      conclusion: 'The remainder of 3 means the 23rd symbol is in the 3rd place of the block.',
      whyWrong: [
        'This is the place of the 21st symbol, which comes straight after 4 complete blocks.',
        'This is the place of the 22nd symbol: an off-by-one slip.',
        null,
        'This is the place of the 24th symbol: an off-by-one slip.',
      ],
      keyIdea: 'Divide the position by the block size. The remainder gives the place in the block. A remainder of 0 means the last place in the block, not the first.',
    },
    check: { optionValues: [1, 2, 3, 4], compute: () => ((23 - 1) % 5) + 1 },
  },
];
