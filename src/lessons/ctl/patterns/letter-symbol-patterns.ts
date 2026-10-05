import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'letter-symbol-patterns',
  know:
    '### The one big idea: letters are numbers in disguise\n\n' +
    'Almost every letter puzzle becomes easy once you replace each letter by its **position in the alphabet**: A = 1, B = 2, C = 3, ..., Z = 26. After that, a "letter sequence" is just a number sequence, and a "code" is just arithmetic.\n\n' +
    'Counting from A every time is slow and error-prone, so learn five **anchor letters**:\n\n' +
    '| Anchor | E | J | O | T | Y |\n|---|---|---|---|---|---|\n| Position | 5 | 10 | 15 | 20 | 25 |\n\n' +
    'Memory trick: **"EJOTY"** (say "ee-joe-tee"). To find R, go from the anchor O = 15: P = 16, Q = 17, R = 18. Also useful: M = 13 and N = 14 sit in the middle of the alphabet.\n\n' +
    '### Letter sequences\n\n' +
    'Write the positions under the letters and look at the **gaps** (differences) between neighbours.\n\n' +
    '- **Constant gap**: B, E, H, K is 2, 5, 8, 11, so add 3 each time. Next: 14 = N.\n' +
    '- **Growing gaps**: A, C, F, J is 1, 3, 6, 10, with gaps 2, 3, 4. The next gap is 5, giving 15 = O.\n' +
    '- **Two sequences woven together**: Z, B, X, D, V, F jumps around. Split it into odd places (Z, X, V: back 2) and even places (B, D, F: forward 2).\n' +
    '- **Famous number sequences**: if the gaps look messy, check the positions themselves. B, C, E, G, K, M is 2, 3, 5, 7, 11, 13: the primes. Also watch for squares (A, D, I, P is 1, 4, 9, 16) and Fibonacci-style sums.\n\n' +
    '### Wrapping round the alphabet\n\n' +
    'The alphabet is treated like a clock face: after Z comes A again. In numbers, if you go **above 26**, subtract 26; if you go **below 1**, add 26. For example, X + 4 is $24 + 4 = 28$, and $28 - 26 = 2$, which is B.\n\n' +
    '### Codes and ciphers\n\n' +
    '1. **Shift (Caesar) cipher**: every letter moves the same number of places. "Shift 3" turns CAT into FDW. To **decode**, move the same number of places **backwards**.\n' +
    '2. **Reverse alphabet**: A swaps with Z, B with Y, and so on. The two positions always add to 27, so code position $= 27 - \\text{position}$.\n' +
    '3. **Letter-to-number codes**: a word becomes the list of positions (DOG = 4, 15, 7), or their **sum** or **product**.\n' +
    '4. **Position-dependent or multi-step codes**: for example, the 1st letter shifts by 1, the 2nd by 2, and so on, or "shift, then write backwards".\n\n' +
    'When you are given an example such as "MANGO is written PDQJR", line the letters up and work out the change for **each** letter. If every change is the same, it is a shift cipher. If not, test the other code types. A rule only counts if it reproduces **every** example you are given.\n\n' +
    '### Repeating symbol patterns\n\n' +
    'If a block of $L$ symbols repeats forever, the $n$th symbol depends only on the **remainder** when $n$ is divided by $L$. For the block ▲ ● ■ ◆ (length 4), the 10th symbol: $10 = 2 \\times 4 + 2$, remainder 2, so it is the 2nd symbol, ●. A remainder of 0 means the **last** symbol of the block.\n\n' +
    'To count how many times a symbol appears in the first $n$ places, count it in the complete blocks, then look carefully at the leftover symbols at the start of the next block.\n\n' +
    '### Grid (matrix) patterns\n\n' +
    'In a 3 by 3 grid or a table, every row (or every column) follows the same rule. Typical rules: each number doubles along a row; the third number is the first times the second plus a constant; the third is the sum of squares. Method:\n\n' +
    '1. Guess a rule from the first complete row.\n' +
    '2. Test it on **every** other complete row. Throw it away if any row fails.\n' +
    '3. Apply the rule to the row with the question mark.\n' +
    '4. If you can, check the answer in the other direction too (down the columns).\n\n' +
    'Letter grids work the same way once the letters are turned into positions.\n\n' +
    '### Symbol equations\n\n' +
    'Puzzles like $\\triangle + \\triangle + \\triangle = 18$ are simultaneous equations in disguise. Start with the line that has only one kind of symbol, find its value, then substitute it into the next line.',
  formulas: [
    { label: 'Alphabet position', tex: 'A = 1,\\ B = 2,\\ \\ldots,\\ Z = 26', note: 'Anchors: E = 5, J = 10, O = 15, T = 20, Y = 25 ("EJOTY"); M = 13, N = 14.' },
    { label: 'Shift cipher (encode by k)', tex: '\\text{new position} = \\text{position} + k', note: 'If the result is above 26, subtract 26 (wrap past Z).' },
    { label: 'Shift cipher (decode by k)', tex: '\\text{original position} = \\text{code position} - k', note: 'If the result is below 1, add 26 (wrap past A).' },
    { label: 'Reverse-alphabet code', tex: '\\text{code position} = 27 - \\text{position}', note: 'A swaps with Z, B with Y, M with N: each pair adds to 27.' },
    { label: 'Wrap-around in code (0-based)', tex: '\\text{new index} = (\\text{index} + k) \\bmod 26', note: 'In Python: `chr((ord(ch) - ord("A") + k) % 26 + ord("A"))`, where A has index 0 (so Z has index 25).' },
    { label: 'Repeating block of length L', tex: 'n = qL + r \\;\\Rightarrow\\; n\\text{th symbol} = r\\text{th symbol of the block}', note: 'Here $r$ is the remainder. If $r = 0$, it is the **last** symbol of the block.' },
    { label: 'Count of a symbol in the first n places', tex: '\\text{count} = q \\times (\\text{count per block}) + (\\text{count in the first } r \\text{ symbols})', note: 'Here $n = qL + r$, with $q$ complete blocks and $r$ leftover symbols.' },
  ],
  examples: [
    {
      title: 'Next letter with a constant gap',
      problem: 'What letter comes next? **D, H, L, P, ?**',
      steps: [
        'Convert to positions: D = 4, H = 8, L = 12, P = 16.',
        'Gaps: $8 - 4 = 4$, $12 - 8 = 4$, $16 - 12 = 4$. The rule is "add 4".',
        'Next position: $16 + 4 = 20$.',
        'Position 20 is the anchor T.',
      ],
      answer: 'T',
    },
    {
      title: 'Decoding a shift cipher with wrap-around',
      problem: 'A word was encoded by moving every letter 3 places forward (wrapping Z to A). The code is **BHV**. What was the word?',
      steps: [
        'To decode, move each letter 3 places backwards.',
        'B = 2: $2 - 3 = -1$, which is below 1, so add 26: $-1 + 26 = 25$, which is Y.',
        'H = 8: $8 - 3 = 5$, which is E.',
        'V = 22: $22 - 3 = 19$, which is S.',
        'Check by encoding YES: Y + 3 wraps to B, E + 3 = H, S + 3 = V. ✓',
      ],
      answer: 'YES',
    },
    {
      title: 'Counting symbols in a repeating pattern',
      problem: 'The block ■ ■ ● ▲ repeats forever. How many squares (■) are in the first 30 symbols?',
      steps: [
        'Block length $L = 4$, with 2 squares in each block.',
        'Divide: $30 = 7 \\times 4 + 2$, so 7 complete blocks and 2 leftover symbols.',
        'Complete blocks: $7 \\times 2 = 14$ squares.',
        'The 2 leftovers are the first two symbols of a block: ■ ■. That is 2 more squares.',
        'Total: $14 + 2 = 16$.',
      ],
      answer: '16 squares',
    },
    {
      title: 'Finding the rule in a grid',
      problem: 'Each row turns the first two numbers into the third using the same rule. Rows: (4, 3, 13), (2, 5, 11), (3, 6, 19), (5, 4, ?). Find the missing number.',
      steps: [
        'Row 1, try adding: $4 + 3 = 7$, not 13. Rejected.',
        'Row 1, try multiplying: $4 \\times 3 = 12$, which is 1 less than 13. Guess the rule "multiply, then add 1".',
        'Test on row 2: $2 \\times 5 + 1 = 11$ ✓.',
        'Test on row 3: $3 \\times 6 + 1 = 19$ ✓. The rule fits every complete row.',
        'Apply it to the last row: $5 \\times 4 + 1 = 21$.',
      ],
      answer: '21',
    },
  ],
  traps: [
    'Miscounting letter positions. Counting from A each time causes slips like O = 14. Use the anchors E = 5, J = 10, O = 15, T = 20, Y = 25.',
    'Counting the starting letter as a step. "Move 3 places on from K" is L, M, N (ending at N), not K, L, M.',
    'Shifting the wrong way. Encoding a shift cipher moves forward; decoding moves backward. Distractors often contain the backwards-shifted word.',
    'Forgetting to wrap round. After Z comes A: subtract 26 when you go above 26 and add 26 when you go below 1.',
    'Checking a rule on only one example. A rule such as "multiply the first two numbers" can fit one row by luck; it must fit every complete row (and every given code example).',
    'Off-by-one with repeating blocks. A remainder of 0 means the last symbol of the block, not the first, and leftover symbols always come from the start of the block.',
  ],
  examTip:
    'These questions are quick wins if you are systematic. Write the alphabet positions (or just the anchors EJOTY) on your scrap paper at the start. For a sequence, write the positions and the gaps in two rows. For a code, line up the example letter by letter and write the change under each one. The wrong options are usually built from predictable slips: a shift in the wrong direction, a shift one too big or too small, the right letters in the wrong order, or a rule that only fits one row. So once you have an answer, **plug it back in**: encode your decoded word, or check your grid rule on every row. If you are short of time, eliminate options that break the pattern you can see (for example, a letter that is not 3 after the previous one in an "add 3" sequence) and choose among the rest.',
};
