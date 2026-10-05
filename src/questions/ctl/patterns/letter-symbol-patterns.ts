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
      solution:
        'Turn each letter into its position in the alphabet (A = 1, B = 2, ...):\n\n' +
        '| Letter | B | E | H | K |\n|---|---|---|---|---|\n| Position | 2 | 5 | 8 | 11 |\n\n' +
        'The gaps are $5 - 2 = 3$, $8 - 5 = 3$, $11 - 8 = 3$, so the rule is "add 3".\n\n' +
        'Next position: $11 + 3 = 14$. The 14th letter is N (remember N = 14 because M = 13).\n\n' +
        'Answer: N.',
      whyWrong: [
        'M is position 13: this adds only 2 to K. It happens if you count K itself as one of the three steps (K, L, M). Count the steps after K: L, M, N.',
        'O is position 15: this adds 4 instead of 3, overshooting by one letter.',
        null,
        'L is simply the letter after K. It ignores the rule: every term is 3 places after the one before.',
      ],
      keyIdea: 'Convert letters to alphabet positions, find the gap between terms, and apply the same gap to get the next letter.',
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
      solution:
        'Find each letter\'s position. A quick way is to use the anchor letters **E = 5, J = 10, O = 15, T = 20, Y = 25** (remember "EJOTY").\n\n' +
        '- D: A, B, C, D, so D = 4.\n' +
        '- O: O is an anchor, O = 15.\n' +
        '- G: E = 5, F = 6, G = 7.\n\n' +
        'So DOG is written **4, 15, 7**.',
      whyWrong: [
        null,
        'This miscounts O as 14 (that is N). Use the anchor O = 15 to avoid counting errors.',
        'This starts counting at A = 0, so every number is 1 too small. The code says A = 1.',
        'This counts backwards from Z (Z = 1, Y = 2, ...). That is a different code, the reverse alphabet, not the one described.',
      ],
      keyIdea: 'Letter-to-number codes use alphabet positions; the anchors E = 5, J = 10, O = 15, T = 20, Y = 25 make counting fast and safe.',
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
      solution:
        'Move each letter 3 places forward.\n\n' +
        '| Letter | Position | $+3$ | New letter |\n|---|---|---|---|\n' +
        '| C | 3 | 6 | F |\n| A | 1 | 4 | D |\n| T | 20 | 23 | W |\n\n' +
        'So CAT becomes **FDW**.',
      whyWrong: [
        'This shifts each letter 3 places **backwards** (C to Z, A to X, T to Q). That is how you would *decode*, not encode.',
        null,
        'This shifts each letter by only 1 place (C to D, A to B, T to U).',
        'This shifts each letter by 4 places instead of 3 (C to G, A to E, T to X).',
      ],
      keyIdea: 'A shift (Caesar) cipher adds the same number to every letter\'s position; encoding moves forward, decoding moves back.',
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
      solution:
        'The block ▲ ● ■ ◆ has length 4, so the pattern repeats every 4 symbols.\n\n' +
        'Divide the position by the block length and look at the **remainder**:\n\n' +
        '$$10 = 2 \\times 4 + 2$$\n\n' +
        'So two full blocks (8 symbols) are used up, and the 10th symbol is the **2nd** symbol of a block.\n\n' +
        'The 2nd symbol of the block is ● (circle).\n\n' +
        'Check by listing: 9th ▲, 10th ●.',
      whyWrong: [
        '▲ is the 9th symbol. After two full blocks (8 symbols) the next symbol is the 9th, not the 10th: you need to count one more.',
        '■ is the 3rd symbol of the block. This is an off-by-one slip: remainder 2 means the 2nd symbol, not the one after it.',
        '◆ sits at positions 4, 8, 12, ... (the multiples of 4). 10 is not a multiple of 4, so the 10th symbol cannot be ◆.',
        null,
      ],
      keyIdea: 'For a repeating block of length $L$, the $n$th symbol is found from the remainder when $n$ is divided by $L$ (remainder 0 means the last symbol of the block).',
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
      solution:
        'Look along each row:\n\n' +
        '- Row 1: $2 \\to 4 \\to 8$, each number is double the one before.\n' +
        '- Row 2: $3 \\to 6 \\to 12$, again each number doubles.\n\n' +
        'So the rule is "double each time". Row 3: $5 \\to 10 \\to 10 \\times 2 = 20$.\n\n' +
        'Check with the columns: column 3 is always 4 times column 1 ($8 = 4 \\times 2$, $12 = 4 \\times 3$, $20 = 4 \\times 5$). Answer: 20.',
      whyWrong: [
        'This continues 5, 10 by **adding** 5. The rows above do not add a fixed amount (2, 4, 8 goes up by 2 then by 4), they double.',
        'This is $5 \\times 5$. Squaring the first number does not match row 1 ($2 \\times 2 = 4$, not 8).',
        null,
        'This multiplies the first two numbers, $5 \\times 10$. That rule happens to work for row 1 ($2 \\times 4 = 8$) but fails row 2 ($3 \\times 6 = 18$, not 12). Always test a rule on **every** complete row.',
      ],
      keyIdea: 'Find a rule that works for every complete row (or column), then apply it to the incomplete one.',
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
      solution:
        'Write the positions: A = 1, C = 3, F = 6, J = 10, O = 15.\n\n' +
        'Gaps: $3 - 1 = 2$, $6 - 3 = 3$, $10 - 6 = 4$, $15 - 10 = 5$.\n\n' +
        'The gaps go up by 1 each time, so the next gap is 6.\n\n' +
        'Next position: $15 + 6 = 21$. Using the anchor T = 20, position 21 is U.\n\n' +
        'Answer: U.',
      whyWrong: [
        'T is position 20: this repeats the last gap of 5. The gaps are growing (2, 3, 4, 5), so the next one is 6.',
        null,
        'V is position 22: this adds 7, jumping one gap too far.',
        'S is position 19: this adds only 4, as if the gaps started shrinking again. The gaps keep increasing.',
      ],
      keyIdea: 'If the gaps between positions are not constant, look at how the gaps themselves change (here they increase by 1).',
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
      solution:
        'When a sequence jumps around, try splitting it into two **interleaved** sequences (odd places and even places).\n\n' +
        '- 1st, 3rd, 5th terms: Z (26), X (24), V (22). The rule is "go back 2". Next: $22 - 2 = 20$, which is T.\n' +
        '- 2nd, 4th, 6th terms: B (2), D (4), F (6). The rule is "go forward 2". Next: $6 + 2 = 8$, which is H.\n\n' +
        'The 7th term belongs to the first sequence and the 8th to the second, so the next two letters are **T, H**.',
      whyWrong: [
        null,
        'These are the right two letters in the wrong order. The 7th term continues the backwards sequence Z, X, V, so T comes before H.',
        'U is only 1 step back from V. The backwards sequence goes Z, X, V, which steps back by 2 each time.',
        'G is only 1 step on from F. The forwards sequence goes B, D, F, which steps forward by 2 each time.',
      ],
      keyIdea: 'A sequence that seems to jump randomly is often two simpler sequences woven together: split it into odd and even positions.',
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
      solution:
        'First work out the rule from CAT. Positions: C = 3, A = 1, T = 20.\n\n' +
        '- Sum: $3 + 1 + 20 = 24$. This matches.\n' +
        '- (Product: $3 \\times 1 \\times 20 = 60$, which does not match.)\n\n' +
        'So the code adds the alphabet positions.\n\n' +
        'DOG: D = 4, O = 15, G = 7, so $4 + 15 + 7 = 26$.\n\n' +
        'Answer: 26.',
      whyWrong: [
        'This miscounts O as 14 (which is N), giving $4 + 14 + 7 = 25$. Use the anchor O = 15.',
        'This uses reverse-alphabet positions (Z = 1, so D = 23, O = 12, G = 20) and adds them. That rule does not give CAT = 24 (it gives 57).',
        'This multiplies the positions: $4 \\times 15 \\times 7 = 420$. Multiplying does not fit the example, since $3 \\times 1 \\times 20 = 60$, not 24.',
        null,
      ],
      keyIdea: 'Test candidate rules (sum, product, reverse positions...) on the given example first; only the rule that reproduces it can be used.',
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
      solution:
        'Compare each letter of MANGO with the code PDQJR:\n\n' +
        '| Original | M | A | N | G | O |\n|---|---|---|---|---|---|\n| Code | P | D | Q | J | R |\n| Shift | $+3$ | $+3$ | $+3$ | $+3$ | $+3$ |\n\n' +
        'Every letter moves 3 places forward. Apply this to APPLE:\n\n' +
        '- A (1) becomes position 4: D\n- P (16) becomes 19: S\n- P becomes S\n- L (12) becomes 15: O\n- E (5) becomes 8: H\n\n' +
        'So APPLE is written **DSSOH**.',
      whyWrong: [
        'This shifts each letter 3 places **backwards**. In the example the code letters come later in the alphabet than the originals (M to P), so the shift is forwards.',
        'This shifts by only 2, which happens if you count the starting letter as one of the steps (M, N, O instead of N, O, P).',
        null,
        'This shifts by 4 places instead of 3.',
      ],
      keyIdea: 'Find the shift from a given example by comparing positions letter by letter, then apply the same shift to the new word.',
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
      solution:
        'To **decode**, move each letter 4 places **backwards**, wrapping from A round to Z.\n\n' +
        '- A: going back 4 places, Z, Y, X, W. So A decodes to W. (In numbers: $1 - 4 = -3$, and $-3 + 26 = 23$, which is W.)\n' +
        '- E: going back 4 places, D, C, B, A. So E decodes to A. ($5 - 4 = 1$)\n' +
        '- C: going back 4 places, B, A, Z, Y. So C decodes to Y. ($3 - 4 = -1$, and $-1 + 26 = 25$, which is Y.)\n\n' +
        'The original word is **WAY**. Check: W + 4 = A, A + 4 = E, Y + 4 = C.',
      whyWrong: [
        'This moves each letter 4 places **forward** again (encoding twice). To undo the code you must move backwards.',
        null,
        'This moves back only 3 places (A to X, E to B, C to Z).',
        'This moves back 5 places (A to V, E to Z, C to X), one step too many.',
      ],
      keyIdea: 'Decoding a shift cipher means applying the opposite shift; when you go past A, add 26 to wrap round to the end of the alphabet.',
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
      solution:
        'The block has 6 symbols, and each block contains 3 triangles.\n\n' +
        'Divide 50 by the block length:\n\n' +
        '$$50 = 8 \\times 6 + 2$$\n\n' +
        '- 8 complete blocks use $8 \\times 6 = 48$ symbols and contain $8 \\times 3 = 24$ triangles.\n' +
        '- The 2 leftover symbols (the 49th and 50th) are the **start** of a new block: ● ●. They contain no triangles.\n\n' +
        'Total: 24 triangles from the complete blocks, and none from the leftovers, so **24** triangles.',
      whyWrong: [
        null,
        'This assumes half the symbols are triangles ($50 \\div 2 = 25$). Only 3 out of every 6 are triangles, and the leftover symbols happen to be circles.',
        'This counts the 2 leftover symbols as triangles. The leftovers are the first two symbols of a block, which are circles.',
        'This rounds $50 \\div 6 \\approx 8.3$ up to 9 blocks, giving $9 \\times 3 = 27$. The 9th block is far from complete: only its first two symbols are used.',
      ],
      keyIdea: 'Split the count into complete blocks plus a remainder, then look at exactly which symbols the remainder contains.',
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
      solution:
        'Try simple rules on the first complete row, then test them on the others.\n\n' +
        '- Adding: $3 + 4 = 7$, not 13. Rejected.\n' +
        '- Multiplying: $3 \\times 4 = 12$, which is 1 less than 13.\n\n' +
        'Try "multiply, then add 1" on every complete row:\n\n' +
        '- Row 1: $3 \\times 4 + 1 = 13$ ✓\n' +
        '- Row 2: $5 \\times 2 + 1 = 11$ ✓\n' +
        '- Row 3: $2 \\times 7 + 1 = 15$ ✓\n\n' +
        'The rule works for every complete row. Last row: $6 \\times 3 + 1 = 19$.\n\n' +
        'Answer: 19.',
      whyWrong: [
        'This is $6 \\times 3$: it forgets the "+ 1" part of the rule. Check row 1: $3 \\times 4 = 12$, not 13.',
        'This is $6 + 3 + 1$: adding the numbers does not fit, since $3 + 4 + 1 = 8$, not 13.',
        'This is $6 + 3$: adding the numbers does not fit any of the complete rows.',
        null,
      ],
      keyIdea: 'Guess a rule from one row, then confirm it on every other complete row before applying it.',
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
      solution:
        'Convert to positions:\n\n' +
        '| | Col 1 | Col 2 | Col 3 |\n|---|---|---|---|\n| Row 1 | 1 | 3 | 5 |\n| Row 2 | 2 | 5 | 8 |\n| Row 3 | 3 | 7 | ? |\n\n' +
        '- Row 1 goes up by 2, row 2 goes up by 3, so row 3 should go up by 4: $3 \\to 7 \\to 11$.\n' +
        '- Check with the columns: column 3 is $5, 8, \\ldots$, going up by 3, so the next is $8 + 3 = 11$. ✓\n\n' +
        'Position 11 is K (J = 10). Answer: K.',
      whyWrong: [
        'I is G + 2: it reuses row 1\'s step of 2. Each row has its own step (2, 3, 4), and row 3\'s step is $7 - 3 = 4$.',
        null,
        'J is G + 3: it reuses row 2\'s step of 3 instead of row 3\'s step of 4.',
        'L is G + 5: one step too far. Row 3 goes C to G, a step of 4, so the next letter is 4 after G.',
      ],
      keyIdea: 'In a grid, find the rule along each row (or down each column) and use the other direction as a check.',
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
      solution:
        'Solve one symbol at a time, starting with the line that has only one kind of symbol.\n\n' +
        '1. $3 \\times \\triangle = 18$, so $\\triangle = 18 \\div 3 = 6$.\n' +
        '2. $6 + \\square = 10$, so $\\square = 10 - 6 = 4$.\n' +
        '3. $4 \\times \\bigcirc = 12$, so $\\bigcirc = 12 \\div 4 = 3$.\n\n' +
        'Then $\\triangle + \\square + \\bigcirc = 6 + 4 + 3 = 13$.',
      whyWrong: [
        'This subtracts in the last line ($\\bigcirc = 12 - 4 = 8$) instead of dividing. The line says $\\square \\times \\bigcirc = 12$, so divide 12 by 4.',
        'This divides 18 by 2 instead of 3 (there are **three** triangles), giving $\\triangle = 9$, $\\square = 1$, $\\bigcirc = 12$.',
        null,
        'This is just $\\triangle + \\square$, read off the second line. It forgets to add the circle.',
      ],
      keyIdea: 'Symbol puzzles are simultaneous equations in disguise: solve the line with one unknown first, then substitute.',
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
      solution:
        '**Step 1: shift each letter 2 places forward.**\n\n' +
        '| Letter | C | O | D | E |\n|---|---|---|---|---|\n| Position | 3 | 15 | 4 | 5 |\n| $+2$ | 5 | 17 | 6 | 7 |\n| New letter | E | Q | F | G |\n\n' +
        'This gives EQFG.\n\n' +
        '**Step 2: write it backwards.** EQFG reversed is **GFQE**.\n\n' +
        '(The two steps can be done in either order: reversing CODE gives EDOC, and shifting that by 2 also gives GFQE.)',
      whyWrong: [
        null,
        'This does the shift but forgets step 2, writing the word backwards.',
        'This reverses the word (EDOC) but then shifts 2 places **backwards** instead of forwards.',
        'This reverses the word (EDOC) but shifts by only 1 place instead of 2.',
      ],
      keyIdea: 'For multi-step codes, apply each step carefully and in full; a shift and a reversal can be done in either order.',
    },
    check: { optionValues: ['GFQE', 'EQFG', 'CBMA', 'FEPD'], compute: () => reverse(shift('CODE', 2)) },
  },
  {
    id: 'letter-symbol-patterns-016',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source:
        'word = "ZOO"\nout = ""\nfor ch in word:\n    pos = ord(ch) - ord("A")\n    out += chr((pos + 2) % 26 + ord("A"))\nprint(out)',
    },
    options: ['`AQQ`', '`XMM`', '`CRR`', '`BQQ`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`ord` gives a character\'s code number and `chr` turns a number back into a character. `ord("A")` is 65, so `ord(ch) - ord("A")` gives a **0-based** position: A = 0, B = 1, ..., Z = 25.\n\n' +
        'The loop is a shift cipher with shift 2, and `% 26` wraps round the alphabet.\n\n' +
        '| `ch` | `pos` | `(pos + 2) % 26` | new letter | `out` |\n|---|---|---|---|---|\n' +
        '| `Z` | 25 | $27 \\bmod 26 = 1$ | `B` | `B` |\n| `O` | 14 | 16 | `Q` | `BQ` |\n| `O` | 14 | 16 | `Q` | `BQQ` |\n\n' +
        'It prints `BQQ`.',
      whyWrong: [
        'This shifts O correctly but moves Z only one step, to A. Shifting Z by 2 goes Z to A (one step) and then A to B (second step).',
        'This shifts each letter 2 places **backwards**. The code adds 2 to the position.',
        'This is what you get if you use A = 1 positions (Z = 26, O = 15) but still add `ord("A")` at the end: every letter lands one place too far. The code subtracts `ord("A")`, so A = 0.',
        null,
      ],
      keyIdea: 'In code, a shift cipher is `chr((ord(ch) - ord("A") + k) % 26 + ord("A"))`: positions are 0-based and `% 26` does the wrap-around.',
    },
    python: { stdout: 'BQQ\n' },
  },

  // ================================================================ challenge
  {
    id: 'letter-symbol-patterns-017',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'challenge',
    stem: 'What letter comes next?\n\n**B, C, E, G, K, M, ?**',
    options: ['O', 'P', 'Q', 'S'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Positions: B = 2, C = 3, E = 5, G = 7, K = 11, M = 13.\n\n' +
        'The gaps are 1, 2, 2, 4, 2, which do not follow a simple arithmetic rule, so look at the positions themselves:\n\n' +
        '$$2, 3, 5, 7, 11, 13$$\n\n' +
        'These are the **prime numbers** in order. The next prime after 13 is 17 (14, 15 and 16 are not prime).\n\n' +
        'Position 17 is Q (O = 15, P = 16, Q = 17). Answer: Q.',
      whyWrong: [
        'O is position 15: this repeats the last gap of 2. But 15 is not prime ($15 = 3 \\times 5$), and the gaps do not simply repeat.',
        'P is M + 3. This happens if you try to add 4 but count M itself as the first step (M, N, O, P).',
        null,
        'S is position 19. It is prime, but it skips 17, which is the next prime after 13.',
      ],
      keyIdea: 'When the gaps look irregular, check whether the positions themselves form a famous sequence: primes, squares, Fibonacci, triangular numbers.',
    },
    check: {
      optionValues: ['O', 'P', 'Q', 'S'],
      compute: () => {
        const isPrime = (n: number) => n > 1 && Array.from({ length: n - 2 }, (_, i) => i + 2).every((d) => n % d !== 0);
        const seq = 'BCEGKM'.split('').map(pos);
        if (!seq.every(isPrime)) throw new Error('not primes');
        let n = seq[seq.length - 1] + 1;
        while (!isPrime(n)) n++;
        return letter(n);
      },
    },
  },
  {
    id: 'letter-symbol-patterns-018',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'challenge',
    stem: 'Every row of the table follows the same rule, which turns the first two numbers into the third. What number replaces the question mark?',
    table: {
      headers: ['First', 'Second', 'Third'],
      rows: [
        [2, 3, 13],
        [4, 1, 17],
        [1, 5, 26],
        [5, 2, '?'],
      ],
    },
    options: ['27', '29', '49', '21'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Adding or multiplying does not work ($2 + 3 = 5$, $2 \\times 3 = 6$). The third numbers 13, 17, 26 are bigger, which suggests **squares**.\n\n' +
        'Try "square both numbers and add":\n\n' +
        '- Row 1: $2^2 + 3^2 = 4 + 9 = 13$ ✓\n' +
        '- Row 2: $4^2 + 1^2 = 16 + 1 = 17$ ✓\n' +
        '- Row 3: $1^2 + 5^2 = 1 + 25 = 26$ ✓\n\n' +
        'Last row: $5^2 + 2^2 = 25 + 4 = 29$.\n\n' +
        'Answer: 29.',
      whyWrong: [
        'This is $5^2 + 2$: it squares only the first number. Check row 1: $2^2 + 3 = 7$, not 13.',
        null,
        'This is $(5 + 2)^2$: adding first and then squaring. Check row 1: $(2 + 3)^2 = 25$, not 13.',
        'This is $5^2 - 2^2$: subtracting the squares instead of adding them. Check row 1: $4 - 9 = -5$, not 13.',
      ],
      keyIdea: 'If the outputs grow faster than sums or products, try squares; then confirm the rule on every complete row.',
    },
    check: {
      optionValues: [27, 29, 49, 21],
      compute: () => {
        const rule = (a: number, b: number) => a * a + b * b;
        const rows = [
          [2, 3, 13],
          [4, 1, 17],
          [1, 5, 26],
        ];
        if (!rows.every(([a, b, c]) => rule(a, b) === c)) throw new Error('rule fails');
        return rule(5, 2);
      },
    },
  },
  {
    id: 'letter-symbol-patterns-019',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'challenge',
    stem: 'In a code language, **CAT** is written as **XZG**. How is **DOG** written in the same code?',
    options: ['WLT', 'VKS', 'YJB', 'TLW'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Compare positions:\n\n' +
        '| Original | C (3) | A (1) | T (20) |\n|---|---|---|---|\n| Code | X (24) | Z (26) | G (7) |\n| Sum | 27 | 27 | 27 |\n\n' +
        'The shifts are not all the same (C goes back 5 but A goes back 1), so this is **not** a shift cipher. Instead, each pair of positions adds up to 27: the alphabet is reversed (A swaps with Z, B with Y, and so on).\n\n' +
        'Rule: code position $= 27 - \\text{original position}$.\n\n' +
        '- D (4): $27 - 4 = 23$, W\n- O (15): $27 - 15 = 12$, L\n- G (7): $27 - 7 = 20$, T\n\n' +
        'So DOG is written **WLT**.',
      whyWrong: [
        null,
        'This uses $26 - \\text{position}$ instead of $27 - \\text{position}$. Check with the example: $26 - 3 = 23$ gives W for C, but the code gives X.',
        'This assumes a shift cipher, taking the shift from C to X (back 5) and applying it to every letter. It does not fit the example: A shifted back 5 is V, not Z.',
        'This applies the correct reverse-alphabet swap but then also writes the word backwards. Nothing in the example is reversed: C, A, T map to X, Z, G in the same order.',
      ],
      keyIdea: 'If the shift changes from letter to letter, test the "reverse alphabet" code, where original and code positions always add to 27.',
    },
    check: {
      optionValues: ['WLT', 'VKS', 'YJB', 'TLW'],
      compute: () => {
        const code = (w: string) =>
          w
            .split('')
            .map((c) => letter(27 - pos(c)))
            .join('');
        if (code('CAT') !== 'XZG') throw new Error('rule does not fit');
        return code('DOG');
      },
    },
  },
  {
    id: 'letter-symbol-patterns-020',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'challenge',
    stem: 'In a code, the 1st letter of a word moves **1** place forward in the alphabet, the 2nd letter moves **2** places, the 3rd letter moves **3** places, and so on. For example, **BAD** becomes **CCG**. What does **CODE** become?',
    options: ['DPEF', 'CPFH', 'GSHI', 'DQGI'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Check the rule on the example: B + 1 = C, A + 2 = C, D + 3 = G, so BAD becomes CCG. ✓\n\n' +
        'Now CODE:\n\n' +
        '| Place in word | 1st | 2nd | 3rd | 4th |\n|---|---|---|---|---|\n' +
        '| Letter | C (3) | O (15) | D (4) | E (5) |\n| Move forward by | 1 | 2 | 3 | 4 |\n| New position | 4 | 17 | 7 | 9 |\n| New letter | D | Q | G | I |\n\n' +
        'CODE becomes **DQGI**.',
      whyWrong: [
        'This moves every letter by just 1 place. The shift grows with the position in the word: 1, 2, 3, 4.',
        'This uses shifts 0, 1, 2, 3, starting one too low. In the example the first letter B does move (to C), so the first shift is 1.',
        'This moves every letter 4 places, using the shift for the last letter on the whole word.',
        null,
      ],
      keyIdea: 'In a position-dependent code the shift changes along the word: apply shift 1 to the 1st letter, 2 to the 2nd, and so on, and verify on the example.',
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
    difficulty: 'challenge',
    stem: 'In a certain code, **BAG = 14** and **FED = 120**. Using the same code, what is **HIDE**?',
    options: ['26', '1440', '30', '672'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Positions: B = 2, A = 1, G = 7 and F = 6, E = 5, D = 4.\n\n' +
        'Test rules on **both** examples:\n\n' +
        '| Rule | BAG | FED |\n|---|---|---|\n| Sum | $2 + 1 + 7 = 10$ | $6 + 5 + 4 = 15$ |\n| Product | $2 \\times 1 \\times 7 = 14$ ✓ | $6 \\times 5 \\times 4 = 120$ ✓ |\n\n' +
        'The code multiplies the positions.\n\n' +
        'HIDE: H = 8, I = 9, D = 4, E = 5.\n\n' +
        '$$8 \\times 9 \\times 4 \\times 5 = 72 \\times 20 = 1440$$\n\n' +
        'Answer: 1440.',
      whyWrong: [
        'This adds the positions: $8 + 9 + 4 + 5 = 26$. Adding does not fit either example (BAG would be 10, not 14).',
        null,
        'This uses "add the positions, then add 4", which fits BAG ($10 + 4 = 14$) but not FED ($15 + 4 = 19$, not 120). A rule must fit every example.',
        'This multiplies positions counted from A = 0 (H = 7, I = 8, D = 3, E = 4): $7 \\times 8 \\times 3 \\times 4 = 672$. With A = 0, BAG would be 0, not 14.',
      ],
      keyIdea: 'When you are given two examples, a rule only counts if it reproduces both of them.',
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
];
