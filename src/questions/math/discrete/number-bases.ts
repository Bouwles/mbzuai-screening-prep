import type { StaticQuestion } from '../../../types';

// Independent helpers for the answer checks: repeated division / place-value loops.
const DIGITS = '0123456789ABCDEF';
const fromBase = (s: string, b: number): number => {
  let v = 0;
  for (const ch of s) v = v * b + DIGITS.indexOf(ch.toUpperCase());
  return v;
};
const toBase = (n: number, b: number): string => {
  if (n === 0) return '0';
  let s = '';
  while (n > 0) {
    s = DIGITS[n % b] + s;
    n = Math.floor(n / b);
  }
  return s;
};
/** Value of an n-bit two's complement pattern. */
const twos = (bits: string): number => {
  const u = fromBase(bits, 2);
  return u >= 2 ** (bits.length - 1) ? u - 2 ** bits.length : u;
};

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'number-bases-001',
    subtopic: 'number-bases',
    difficulty: 'foundation',
    stem: 'Convert the binary number $110101_2$ to decimal.',
    options: ['$43$', '$53$', '$106$', '$21$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What is $110101_2$ written as an ordinary number?',
      solution:
        'The small 2 means base 2, also called **binary**. Each place is worth double the place to its right, starting with 1 on the far right: 1, 2, 4, 8, 16, 32.\n\n' +
        'Write the digits under their place values:\n\n| Place value | 32 | 16 | 8 | 4 | 2 | 1 |\n|---|---|---|---|---|---|---|\n| Digit | 1 | 1 | 0 | 1 | 0 | 1 |\n\n' +
        'A 1 means that place value counts, and a 0 means it doesn\'t. So add the place values above the 1s: $32 + 16 + 4 + 1 = 53$.',
      conclusion: 'The places holding a 1 are worth 32, 16, 4 and 1, which add up to $53$.',
      whyWrong: [
        'This is what you get if you start the place values at the **left** end: you have really converted $101011_2 = 32 + 8 + 2 + 1 = 43$. The units (1s) place is always the rightmost digit.',
        null,
        'This is what you get if you start the place values at 2 instead of 1 (using $2, 4, 8, \\dots, 64$). The rightmost place is $2^0 = 1$, so this doubles the true answer.',
        'This is what you get if you drop the leftmost 1: $10101_2 = 16 + 4 + 1 = 21$. A 6-digit binary number has a leading place value of 32.',
      ],
      keyIdea: 'To convert from any base to decimal, write the place values above the digits, starting with 1 on the right and multiplying by the base each time. Multiply each digit by its place value, then add.',
    },
    check: { optionValues: [43, 53, 106, 21], compute: () => fromBase('110101', 2) },
  },
  {
    id: 'number-bases-002',
    subtopic: 'number-bases',
    difficulty: 'foundation',
    stem: 'Write the decimal number $37$ in binary.',
    options: ['$101001_2$', '$111_2$', '$100100_2$', '$100101_2$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How do we write 37 using only 1s and 0s?',
      solution:
        'In binary the places are worth 32, 16, 8, 4, 2 and 1, each double the next. We build 37 from these, using each place at most once.\n\n' +
        'Go through the places from largest to smallest. If a place value fits into what is left, write 1 and subtract it. If not, write 0:\n\n| Place | Fits? | Left over | Digit |\n|---|---|---|---|\n| 32 | Yes | $37 - 32 = 5$ | 1 |\n| 16 | No | 5 | 0 |\n| 8 | No | 5 | 0 |\n| 4 | Yes | $5 - 4 = 1$ | 1 |\n| 2 | No | 1 | 0 |\n| 1 | Yes | $1 - 1 = 0$ | 1 |\n\n' +
        'Read the Digit column from top to bottom: 100101.',
      conclusion: '$32 + 4 + 1 = 37$, so in binary it is $100101_2$.',
      whyWrong: [
        'This is the right digits in reverse order. The largest place value, 32, belongs on the left, and the units digit belongs on the right.',
        'This writes a 1 for each of $32$, $4$ and $1$ but leaves out the zeros for the unused places $16$, $8$ and $2$. Without the zeros, $111_2$ is only $4 + 2 + 1 = 7$.',
        'This is $32 + 4 = 36$: the units digit has been left as 0. Since 37 is odd, its binary form must end in 1.',
        null,
      ],
      keyIdea: 'Decimal to binary: write the powers of 2 up to the number. Working from the largest, write 1 and subtract if it fits, and write 0 if it doesn\'t. Keep the zeros, since they hold the places.',
    },
    check: { optionValues: ['101001', '111', '100100', '100101'], compute: () => toBase(37, 2) },
  },
  {
    id: 'number-bases-003',
    subtopic: 'number-bases',
    difficulty: 'foundation',
    stem: 'How many **different** values can be represented using $6$ bits?',
    options: ['$64$', '$63$', '$12$', '$36$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many different patterns of 0s and 1s can six bits make?',
      solution:
        'A **bit** is a single binary digit: 0 or 1. So each bit has 2 choices.\n\n' +
        'The 6 bits are chosen separately, so multiply the choices: $2 \\times 2 \\times 2 \\times 2 \\times 2 \\times 2 = 2^6$.\n\n' +
        'Work it out by doubling: 2, 4, 8, 16, 32, 64. Each pattern stands for a different value, so that is 64 values.',
      conclusion: 'Six bits with 2 choices each give $2^6$ patterns, which is $64$ different values.',
      whyWrong: [
        null,
        'This is the **largest** value, $2^6 - 1 = 63$. Counting from 0 to 63 gives 64 different values, because 0 counts too.',
        'This is $2 \\times 6$. The number of choices multiplies for each bit, so it is $2^6$, not $2 \\times 6$.',
        'This is $6^2$: the base and the power have been swapped. It should be $2^6$ (2 choices, 6 times).',
      ],
      keyIdea: '$n$ bits give $2^n$ different values, running from 0 to $2^n - 1$ for unsigned numbers (no negatives). "How many values" asks for $2^n$, while "largest value" asks for $2^n - 1$.',
    },
    check: {
      optionValues: [64, 63, 12, 36],
      compute: () => {
        let count = 1;
        for (let bit = 0; bit < 6; bit++) count *= 2;
        return count;
      },
    },
  },
  {
    id: 'number-bases-004',
    subtopic: 'number-bases',
    difficulty: 'foundation',
    stem: 'A byte is $8$ bits. What is the **largest** whole number that can be stored in one byte as an unsigned (non-negative) integer?',
    options: ['$256$', '$128$', '$255$', '$127$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the biggest number that fits in 8 bits, with no negatives?',
      solution:
        'A **bit** is a binary digit, 0 or 1. The biggest value comes from setting every bit to 1: $11111111_2$, where the small 2 means binary.\n\n' +
        'Each place is worth double the one to its right, so the 8 places are worth 128, 64, 32, 16, 8, 4, 2 and 1. Add them all: $128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255$.',
      conclusion: 'Eight 1s add up to $255$, the largest value an unsigned byte can hold.',
      whyWrong: [
        'This is $2^8 = 256$, the **number of different values** a byte can hold. Since counting starts at 0, the largest is one less: 255.',
        'This is $2^7 = 128$, the place value of the leftmost bit only. All 8 bits being 1 gives more than that.',
        null,
        'This is the largest value of a **signed** (two\'s complement) byte. The question says unsigned, so all 8 bits are used for the size of the number.',
      ],
      keyIdea: 'The largest unsigned value with $n$ bits is $2^n - 1$. There are $2^n$ values, but one of them is 0, so the top value is one less.',
    },
    check: {
      optionValues: [256, 128, 255, 127],
      compute: () => fromBase('11111111', 2),
    },
  },
  {
    id: 'number-bases-005',
    subtopic: 'number-bases',
    difficulty: 'foundation',
    stem: 'Convert the hexadecimal number $\\mathrm{2C}_{16}$ to decimal.',
    options: ['$32$', '$194$', '$14$', '$44$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What is the hexadecimal number $\\mathrm{2C}$ as an ordinary number?',
      solution:
        '**Hexadecimal** is base 16. It needs 16 digits, so after 9 it uses letters: A is 10, B is 11, C is 12, D is 13, E is 14 and F is 15.\n\n' +
        'In base 16 the rightmost place is worth 1 and the next place is worth 16. So in $\\mathrm{2C}$, the 2 is in the 16s place and the C is in the units place.\n\n' +
        'Multiply each digit by its place value: $2 \\times 16 = 32$ and $12 \\times 1 = 12$.\n\n' +
        'Add the two results: $32 + 12 = 44$.',
      conclusion: 'Two 16s and twelve 1s make $44$.',
      whyWrong: [
        'This uses 10 as the place value instead of 16: $2 \\times 10 + 12 = 32$. In hexadecimal the second place is worth 16.',
        'This reads the digits in the wrong order: $12 \\times 16 + 2 = 194$. The rightmost digit is the units digit.',
        'This just adds the digit values, $2 + 12 = 14$, ignoring place value: the 2 is worth $2 \\times 16$, not 2.',
        null,
      ],
      keyIdea: 'Hexadecimal to decimal: turn letters into numbers (A is 10 up to F is 15), then multiply the left digit by 16 and add the right digit. For longer numbers the places are 1, 16, 256.',
    },
    check: { optionValues: [32, 194, 14, 44], compute: () => fromBase('2C', 16) },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'number-bases-006',
    subtopic: 'number-bases',
    difficulty: 'exam',
    stem: 'Calculate $1011_2 + 0110_2$, giving your answer in binary.',
    options: ['$1101_2$', '$10001_2$', '$1111_2$', '$1121_2$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What do you get by adding these two binary numbers?',
      solution:
        'Add column by column from the right, like ordinary addition. In binary (base 2, using only 0 and 1), $1 + 1$ is 2, which is written $10_2$: write 0 and carry 1.\n\n' +
        'Work through the columns of 1011 and 0110:\n\n| Column | Top digit | Bottom digit | Carry in | Total | Write | Carry out |\n|---|---|---|---|---|---|---|\n| 1s | 1 | 0 | 0 | 1 | 1 | 0 |\n| 2s | 1 | 1 | 0 | 2 | 0 | 1 |\n| 4s | 0 | 1 | 1 | 2 | 0 | 1 |\n| 8s | 1 | 0 | 1 | 2 | 0 | 1 |\n\n' +
        'The final carry of 1 becomes a new digit on the far left. Reading the Write column from bottom to top, with that carry first, gives 10001.',
      conclusion: 'Check: $1011_2$ is 11 and $0110_2$ is 6, and $11 + 6 = 17$, which is $16 + 1$. So the sum is $10001_2$.',
      whyWrong: [
        'This writes 0 whenever a column adds to 2 but never carries the 1 to the next column. Ignoring carries gives $1101_2 = 13$, not $17$.',
        null,
        'This treats $1 + 1$ as $1$ (like the logical OR of the bits) instead of $10_2$. Its value is 15, but $11 + 6 = 17$.',
        'This adds the digits as if they were decimal, giving a digit 2. Binary only has the digits 0 and 1, so a column total of 2 must be written as 0 with a carry of 1.',
      ],
      keyIdea: 'Binary addition: work right to left. Total 0 or 1: write it. Total 2: write 0 and carry 1. Total 3: write 1 and carry 1. Convert both numbers to decimal as a check.',
    },
    check: {
      optionValues: ['1101', '10001', '1111', '1121'],
      compute: () => toBase(fromBase('1011', 2) + fromBase('0110', 2), 2),
    },
  },
  {
    id: 'number-bases-007',
    subtopic: 'number-bases',
    difficulty: 'exam',
    stem: 'Convert $\\mathrm{A7}_{16}$ to binary.',
    options: ['$1010111_2$', '$01111010_2$', '$10100111_2$', '$10110111_2$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is $\\mathrm{A7}_{16}$ written in 0s and 1s?',
      solution:
        '**Hexadecimal** is base 16, using 0 to 9, then A to F for 10 to 15. One hexadecimal digit always matches exactly 4 binary digits (0s and 1s), because 4 binary digits make $2^4 = 16$ patterns. So we can convert one digit at a time.\n\n' +
        'A is 10, and $10 = 8 + 2$. Using the places 8, 4, 2, 1, that is $1010$.\n\n' +
        '7 is $4 + 2 + 1$. Using the places 8, 4, 2, 1, that is $0111$. Keep the leading 0, so the group has 4 digits.\n\n' +
        'Join the groups in the same order as the hex digits: $1010$ then $0111$ gives $10100111$.',
      conclusion: 'A becomes $1010$ and 7 becomes $0111$, so the whole number is $10100111_2$.',
      whyWrong: [
        'This writes 7 as $111$ instead of the 4-bit group $0111$. Losing that 0 shifts the A part one place to the right: $1010111_2$ is only 87, not 167.',
        'This converts each digit correctly but puts the groups in the wrong order (7 first, then A). The groups must stay in the same order as the hex digits.',
        null,
        'This uses $1011$ for A, but $1011_2 = 11$, which is B. A is 10, so it is $1010$.',
      ],
      keyIdea: 'Hex to binary: replace each hex digit by its own 4-bit group, in the same order, keeping leading zeros inside each group. Binary to hex is the reverse: group into fours from the right.',
    },
    check: {
      optionValues: ['1010111', '01111010', '10100111', '10110111'],
      compute: () => toBase(fromBase('A7', 16), 2),
    },
  },
  {
    id: 'number-bases-008',
    subtopic: 'number-bases',
    difficulty: 'foundation',
    stem: 'Convert the octal (base 8) number $157_8$ to decimal.',
    options: ['$111$', '$343$', '$489$', '$13$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is $157_8$ as an ordinary number?',
      solution:
        '**Octal** is base 8. Each place is worth 8 times the place to its right: 1, then 8, then $8 \\times 8 = 64$.\n\n' +
        'Line up the digits under those places and multiply each digit by its place value:\n\n| Place value | 64 | 8 | 1 |\n|---|---|---|---|\n| Digit | 1 | 5 | 7 |\n| Digit $\\times$ place | 64 | 40 | 7 |\n\n' +
        'Add the bottom row: $64 + 40 + 7 = 111$.',
      conclusion: 'One 64, five 8s and seven 1s make $111$.',
      whyWrong: [
        null,
        'This uses powers of 16 (hexadecimal place values): $1 \\times 256 + 5 \\times 16 + 7 = 343$. Octal place values are powers of 8.',
        'This reads the digits in the wrong order: $7 \\times 64 + 5 \\times 8 + 1 = 489$. The rightmost digit is the units digit.',
        'This just adds the digits, $1 + 5 + 7 = 13$, ignoring place value.',
      ],
      keyIdea: 'In base $b$, the places from the right are 1, $b$, $b^2$, and so on. Multiply each digit by its place value and add. Every digit must be smaller than $b$.',
    },
    check: { optionValues: [111, 343, 489, 13], compute: () => fromBase('157', 8) },
  },
  {
    id: 'number-bases-009',
    subtopic: 'number-bases',
    difficulty: 'foundation',
    stem: 'Write the decimal number $200$ in hexadecimal.',
    options: ['$\\mathrm{8C}_{16}$', '$\\mathrm{C8}_{16}$', '$128_{16}$', '$\\mathrm{C5}_{16}$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What is 200 written in base 16?',
      solution:
        'Hexadecimal is base 16, so its places are worth 1, then 16, then 256. Since 256 is bigger than 200, we only need the 16s place and the units place.\n\n' +
        'Find how many 16s fit into 200. $16 \\times 12 = 192$ fits, and $16 \\times 13 = 208$ is too big. So 12 sixteens fit.\n\n' +
        'The remainder (what is left over) goes in the units place: $200 - 192 = 8$.\n\n' +
        'In hexadecimal the value 12 is written as the single digit C. So the 16s digit is C and the units digit is 8, which gives C8.',
      conclusion: '$12 \\times 16 + 8 = 200$, and 12 is the digit C, so the answer is $\\mathrm{C8}_{16}$.',
      whyWrong: [
        'This puts the digits the wrong way round. The number of 16s goes on the left, and the remainder 8 is the units digit, on the **right**.',
        null,
        'This writes the value 12 as the two decimal digits 1 and 2. In hexadecimal, 12 must be written as the **single** digit C.',
        'This uses the calculator decimal $200 \\div 16 = 12.5$ and turns the 0.5 into a digit 5. The units digit is the **remainder**, $200 - 12 \\times 16 = 8$, not the digits after the decimal point.',
      ],
      keyIdea: 'Decimal to hex, for numbers below 256: divide by 16. The whole-number result is the left digit and the remainder is the right digit. Write values from 10 to 15 as A to F. Ignore any decimal places shown on a calculator.',
    },
    check: { optionValues: ['8C', 'C8', '128', 'C5'], compute: () => toBase(200, 16) },
  },
  {
    id: 'number-bases-010',
    subtopic: 'number-bases',
    difficulty: 'exam',
    stem: 'What is the **8-bit two\'s complement** representation of $-13$?',
    options: ['$10001101_2$', '$11110010_2$', '$11110011_2$', '$11110001_2$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What pattern of 8 bits stores $-13$ in two\'s complement?',
      solution:
        '**Two\'s complement** is the usual way to store negative whole numbers in bits. The recipe is: write the positive number, flip every bit, then add 1.\n\n' +
        'Write 13 in 8 bits. $13 = 8 + 4 + 1$, so it is $00001101$.\n\n' +
        'Flip every bit, so each 0 becomes 1 and each 1 becomes 0: $11110010$.\n\n' +
        'Add 1. The last digit is 0, so it simply becomes 1: $11110011$.',
      conclusion: 'Check, with the leftmost bit worth $-128$: $-128 + 64 + 32 + 16 + 2 + 1 = -13$. So the pattern is $11110011_2$.',
      whyWrong: [
        'This is **sign-and-magnitude**: a 1 for the sign followed by 13 in binary. Two\'s complement does not work like that; you must flip the bits and add 1.',
        'This is only the "flip every bit" step (the one\'s complement). You also need to add 1.',
        null,
        'This flips the bits and then **subtracts** 1 instead of adding 1.',
      ],
      keyIdea: 'To negate in two\'s complement: write the positive value in the full number of bits, flip every bit, add 1. To check, treat the leftmost bit as negative (here $-128$) and add the place values.',
    },
    check: {
      optionValues: ['10001101', '11110010', '11110011', '11110001'],
      compute: () => {
        const pos = toBase(13, 2).padStart(8, '0');
        const flipped = [...pos].map((b) => (b === '0' ? '1' : '0')).join('');
        return toBase(fromBase(flipped, 2) + 1, 2);
      },
    },
  },
  {
    id: 'number-bases-011',
    subtopic: 'number-bases',
    difficulty: 'exam',
    stem: 'The 8-bit pattern $11101000_2$ is a signed integer stored in **two\'s complement**. What decimal value does it represent?',
    options: ['$232$', '$-104$', '$-23$', '$-24$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What number does the bit pattern $11101000$ stand for in two\'s complement?',
      solution:
        'In **two\'s complement**, every place has its normal value, except that the leftmost place counts as negative. In 8 bits the places are $-128, 64, 32, 16, 8, 4, 2, 1$.\n\n' +
        'Write the bits under the places:\n\n| Place value | $-128$ | 64 | 32 | 16 | 8 | 4 | 2 | 1 |\n|---|---|---|---|---|---|---|---|---|\n| Bit | 1 | 1 | 1 | 0 | 1 | 0 | 0 | 0 |\n\n' +
        'A 1 means that place value counts. So add the values above the 1s: $-128 + 64 + 32 + 8$.\n\n' +
        'Do it in stages: $-128 + 64 = -64$, then $-64 + 32 = -32$, then $-32 + 8 = -24$.',
      conclusion: 'The leftmost bit gives $-128$ and the others add back 104, so the value is $-24$.',
      whyWrong: [
        'This reads the pattern as an **unsigned** number ($128 + 64 + 32 + 8 = 232$). The question says it is signed two\'s complement, and a leading 1 means negative.',
        'This reads it as **sign-and-magnitude**: sign bit 1, then $1101000_2 = 104$. In two\'s complement the leading bit is worth $-128$.',
        'This flips the bits ($00010111_2 = 23$) but forgets to add 1 afterwards.',
        null,
      ],
      keyIdea: 'Two\'s complement to decimal: give the leftmost bit a negative place value ($-2^{n-1}$ for $n$ bits) and add as usual. A leading 0 means a positive number, which you read as normal.',
    },
    check: { optionValues: [232, -104, -23, -24], compute: () => twos('11101000') },
  },
  {
    id: 'number-bases-012',
    subtopic: 'number-bases',
    difficulty: 'exam',
    stem: 'A **left shift** by $k$ places moves every bit $k$ places left and fills the gaps with 0s. What is $1101_2$ shifted left by 3 places, in decimal?',
    options: ['$39$', '$16$', '$104$', '$1$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What number do you get from $1101_2$ after moving its bits 3 places left?',
      solution:
        'First read $1101_2$: the places are 8, 4, 2, 1, so it is $8 + 4 + 1 = 13$.\n\n' +
        'Shift left by 3: move every bit 3 places left and fill the gaps with 0s. So $1101$ becomes $1101000$.\n\n' +
        'Read the new number using the places 64, 32, 16, 8, 4, 2, 1. The 1s sit under 64, 32 and 8, so the value is $64 + 32 + 8 = 104$.',
      conclusion: 'Each left shift doubles the number, so three shifts multiply 13 by $2^3 = 8$, which gives $104$.',
      whyWrong: [
        'This multiplies 13 by the shift amount: $13 \\times 3 = 39$. Shifting by $k$ places multiplies by $2^k$, not by $k$.',
        'This adds the shift amount: $13 + 3 = 16$. A shift moves the bits, which multiplies by a power of 2.',
        null,
        'This shifts **right** by 3 places: $13 \\div 8$ rounded down is 1. A left shift makes the number bigger.',
      ],
      keyIdea: 'Shifting left by $k$ places multiplies by $2^k$. So convert to decimal and multiply. Shifting right by $k$ places divides by $2^k$ and drops any remainder.',
    },
    check: { optionValues: [39, 16, 104, 1], compute: () => fromBase('1101' + '000', 2) },
  },
  {
    id: 'number-bases-013',
    subtopic: 'number-bases',
    difficulty: 'exam',
    stem: 'What is the range of values of a **10-bit two\'s complement** integer?',
    options: ['$-511$ to $511$', '$-512$ to $511$', '$0$ to $1023$', '$-1024$ to $1023$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What are the smallest and largest numbers that 10-bit two\'s complement can store?',
      solution:
        'A **bit** is a single 0 or 1, so 10 bits make $2^{10} = 1024$ different patterns, so 1024 different values can be stored.\n\n' +
        '**Two\'s complement** splits these evenly: half for negative numbers, and half for zero and the positive numbers. Half of 1024 is 512.\n\n' +
        'The 512 negative values are $-1, -2, -3$ and so on, so the lowest one is the 512th of them.\n\n' +
        'The other 512 values include zero. So they run from 0 up to $512 - 1 = 511$, and the negatives go down to $-512$.',
      conclusion: 'The negatives stop 512 below zero and the positives stop at 511, because zero takes one place. So the range is $-512$ to $511$.',
      whyWrong: [
        'This is the range for **sign-and-magnitude**, which wastes a pattern on "negative zero". Two\'s complement has only one zero, so it reaches one further on the negative side: $-512$.',
        null,
        'This is the range for an **unsigned** 10-bit number ($0$ to $2^{10} - 1$). Two\'s complement uses half of the patterns for negative numbers.',
        'This uses $2^{10}$ instead of $2^{9}$. One bit effectively decides the sign, so the size goes up to $2^{n-1}$, and these 2048 values would need 11 bits.',
      ],
      keyIdea: 'For $n$-bit two\'s complement, the range is $-2^{n-1}$ to $2^{n-1} - 1$. There is one more negative than positive, because zero takes a place among the non-negatives.',
    },
    check: {
      optionValues: ['-511..511', '-512..511', '0..1023', '-1024..1023'],
      compute: () => {
        const n = 10;
        return `${twos('1' + '0'.repeat(n - 1))}..${twos('0' + '1'.repeat(n - 1))}`;
      },
    },
  },
  {
    id: 'number-bases-014',
    subtopic: 'number-bases',
    difficulty: 'exam',
    stem: 'What is the **minimum** number of bits needed to give $300$ items different binary codes of the same length?',
    options: ['$8$', '$38$', '$512$', '$9$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How few bits can give 300 items a different code each?',
      solution:
        'A **bit** is a binary digit, 0 or 1. With $n$ bits, each bit has 2 choices, so there are $2^n$ different codes. We need at least 300 of them, one per item.\n\n' +
        'Try powers of 2 until one reaches 300:\n\n| Bits | Codes | Enough for 300? |\n|---|---|---|\n| 7 | $2^7 = 128$ | No |\n| 8 | $2^8 = 256$ | No |\n| 9 | $2^9 = 512$ | Yes |',
      conclusion: '8 bits give only 256 codes, and 9 bits give 512, so the minimum is $9$.',
      whyWrong: [
        'This rounds $\\log_2 300 \\approx 8.2$ **down**. But 8 bits only give $2^8 = 256$ codes, fewer than 300 items; you must always round **up**.',
        'This divides 300 by 8 (as if converting bits to bytes) and rounds up. The number of codes grows as $2^n$, not $8n$.',
        'This is the number of codes available with 9 bits ($2^9 = 512$), not the number of bits.',
        null,
      ],
      keyIdea: 'To find the bits needed for $N$ items, find the smallest $n$ with $2^n \\ge N$. List powers of 2 until you pass $N$. Always round up: spare codes are fine, but missing codes are not.',
    },
    check: {
      optionValues: [8, 38, 512, 9],
      compute: () => {
        let n = 0;
        while (2 ** n < 300) n++;
        return n;
      },
    },
  },
  {
    id: 'number-bases-015',
    subtopic: 'number-bases',
    difficulty: 'exam',
    stem: 'What does this pseudocode print? Arrays are indexed from 1.',
    code: {
      lang: 'pseudocode',
      source: 'A = [1, 1, 0, 1]\nn = 0\nfor i = 1 to length(A)\n   n = n * 2 + A[i]\nend for\nprint(n)',
    },
    options: ['11', '13', '3', '26'],
    correctIndex: 1,
    markScheme: {
      asking: 'What value does `n` hold once the loop has used every value in `A`?',
      solution:
        '`A` holds four values. Arrays start at 1 here, so `A[1]` is 1, `A[2]` is 1, `A[3]` is 0 and `A[4]` is 1. `length(A)` is 4, so the loop on line 3 runs with `i` = 1, 2, 3, 4.\n\n' +
        '`n` starts at 0. Line 4 doubles `n`, then adds the next value from `A`. Here is every pass:\n\n| Pass | `i` | `A[i]` | `n * 2 + A[i]` | `n` becomes |\n|---|---|---|---|---|\n| 1 | 1 | 1 | `0 * 2 + 1` | 1 |\n| 2 | 2 | 1 | `1 * 2 + 1` | 3 |\n| 3 | 3 | 0 | `3 * 2 + 0` | 6 |\n| 4 | 4 | 1 | `6 * 2 + 1` | 13 |\n\n' +
        'After pass 4 the loop ends. Line 6 prints `n`, which holds 13.',
      conclusion: 'The loop reads the digits 1, 1, 0, 1 as the binary number $1101_2 = 8 + 4 + 1$, so it prints 13.',
      whyWrong: [
        'This reads the digits from right to left, which converts $1011_2 = 11$. The loop starts at `A[1]`, the leftmost digit.',
        null,
        'This only adds up the digits and forgets the `n * 2`, which gives each digit its place value.',
        'This doubles once more after the last digit. The last pass adds `A[4]` to $6 \\times 2$, and then the loop ends.',
      ],
      keyIdea: '`n = n * base + digit` reads a number digit by digit from the left, so this loop converts to decimal. Trace it with one row per pass, or read the array as a number in that base.',
    },
    check: {
      optionValues: [11, 13, 3, 26],
      compute: () => {
        let n = 0;
        for (const d of [1, 1, 0, 1]) n = n * 2 + d;
        return n;
      },
    },
  },
  {
    id: 'number-bases-019',
    subtopic: 'number-bases',
    difficulty: 'exam',
    stem: 'A value is stored as a **12-bit two\'s complement** integer. What is the difference between the **largest** and the **smallest** values that can be stored?',
    options: ['$4096$', '$4094$', '$2047$', '$4095$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How far is it from the smallest to the largest 12-bit two\'s complement value?',
      solution:
        'A **bit** is a single 0 or 1, so 12 bits make $2^{12} = 4096$ patterns. Two\'s complement uses half of them for negative numbers, and half of 4096 is 2048.\n\n' +
        'So the smallest value is $-2048$. The largest is $2048 - 1 = 2047$, which is one less because zero uses up one of the non-negative patterns.\n\n' +
        'Difference means largest minus smallest: $2047 - (-2048)$. Subtracting a negative is the same as adding: $2047 + 2048 = 4095$.',
      conclusion: 'The gap from $-2048$ up to 2047 is $4095$.',
      whyWrong: [
        'This is the **number** of values, $2^{12} = 4096$. The difference between the first and last of 4096 consecutive integers is one less.',
        'This uses the sign-and-magnitude range $-2047$ to $2047$. Two\'s complement reaches $-2048$.',
        'This is just the largest value, 2047. The smallest value is negative, so subtracting it adds 2048 more.',
        null,
      ],
      keyIdea: 'For $n$ bits the range is $-2^{n-1}$ to $2^{n-1} - 1$. Largest minus smallest is always $2^n - 1$, because the gap between the first and last of a list is one less than its length.',
    },
    check: {
      optionValues: [4096, 4094, 2047, 4095],
      compute: () => twos('0' + '1'.repeat(11)) - twos('1' + '0'.repeat(11)),
    },
  },
  {
    id: 'number-bases-021',
    subtopic: 'number-bases',
    difficulty: 'foundation',
    stem: 'How many bits are there in one **byte**?',
    options: ['$8$', '$4$', '$16$', '$2$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many bits make one byte?',
      solution:
        'A **bit** is one binary digit, either 0 or 1. It is the smallest piece of computer data.\n\n' +
        'A **byte** is a group of bits treated as one unit, and its standard size is 8 bits. For example, $01000001$ is one byte.',
      conclusion: 'A byte is defined as a group of eight bits, so the answer is $8$.',
      whyWrong: [
        null,
        '4 bits is half a byte, sometimes called a nibble. It is the size of one hexadecimal digit.',
        '16 bits is two bytes.',
        '2 is the number of values one bit can take (0 or 1), not the number of bits in a byte.',
      ],
      keyIdea: 'Keep these sizes together: 1 byte is 8 bits, and 1 hex digit is 4 bits. A question in bytes often needs multiplying by 8 to turn it into bits, which gives $2^8 = 256$ values per byte.',
    },
  },
  {
    id: 'number-bases-022',
    subtopic: 'number-bases',
    difficulty: 'foundation',
    stem: 'What value does the hexadecimal digit $\\mathrm{F}$ represent?',
    options: ['$15$', '$16$', '$6$', '$14$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What number does the hexadecimal digit F stand for?',
      solution:
        'Hexadecimal is base 16, so it has 16 digits with values from 0 to 15. After 9, letters take over.\n\n' +
        'Count on from 9: A is 10, B is 11, C is 12, D is 13, E is 14 and F is 15.',
      conclusion: 'F is the last hexadecimal digit, so it stands for $15$.',
      whyWrong: [
        null,
        '16 is the base itself. Digits in base 16 run from 0 up to one less than the base.',
        'This is the position of F in the alphabet. The letters start at $\\mathrm{A} = 10$.',
        'This is the value of E, the letter before F.',
      ],
      keyIdea: 'Digits in base $b$ run from 0 to $b - 1$. For hexadecimal, A starts at 10, so add 9 to the letter\'s place in the alphabet: F is the 6th letter, and $6 + 9 = 15$.',
    },
    check: { optionValues: [15, 16, 6, 14], compute: () => fromBase('F', 16) },
  },
  {
    id: 'number-bases-023',
    subtopic: 'number-bases',
    difficulty: 'foundation',
    stem: 'How many bits does one hexadecimal digit represent?',
    options: ['$4$', '$8$', '$16$', '$2$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many binary digits are needed to write one hexadecimal digit?',
      solution:
        'One hexadecimal digit can take 16 different values, from 0 to 15.\n\n' +
        '$n$ bits make $2^n$ patterns, so we need $2^n = 16$. Doubling gives 2, 4, 8, 16, which reaches 16 at the fourth step. So $2^4 = 16$. For example, F is $1111$.',
      conclusion: '16 values need exactly 4 bits, since $2^4 = 16$, so the answer is $4$.',
      whyWrong: [
        null,
        '8 bits is one byte, which takes **two** hexadecimal digits.',
        '16 is the number of values one digit can take, not the number of bits. You need $2^n = 16$, so $n = 4$.',
        '2 bits give only $2^2 = 4$ values, which is not enough for 16 different digits.',
      ],
      keyIdea: 'To find the bits per digit, write the base as a power of 2. Base 16 is $2^4$, so 4 bits per digit. Base 8 is $2^3$, so 3 bits per digit.',
    },
    check: {
      optionValues: [4, 8, 16, 2],
      compute: () => {
        let n = 0;
        while (2 ** n < 16) n++;
        return n;
      },
    },
  },
  {
    id: 'number-bases-024',
    subtopic: 'number-bases',
    difficulty: 'foundation',
    stem: 'What is the **radix** of the octal number system?',
    options: ['$8$', '$16$', '$10$', '$2$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the base of the octal number system?',
      solution:
        '**Radix** is another word for base: how many different digits a number system uses.\n\n' +
        '"Oct" means eight, as in octopus. Octal uses the digits 0 to 7, which is 8 digits in total.',
      conclusion: 'Octal has eight digits, so its radix is $8$.',
      whyWrong: [
        null,
        'This is the radix of hexadecimal.',
        'This is the radix of ordinary decimal numbers.',
        'This is the radix of binary.',
      ],
      keyIdea: 'Match the name to the base: binary is 2, octal is 8, decimal is 10 and hexadecimal is 16. The radix is always one more than the largest digit allowed.',
    },
  },
  {
    id: 'number-bases-025',
    subtopic: 'number-bases',
    difficulty: 'exam',
    stem: 'Convert $101101_2$ to hexadecimal.',
    options: ['$\\mathrm{2D}_{16}$', '$\\mathrm{B4}_{16}$', '$\\mathrm{D2}_{16}$', '$45_{16}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is $101101_2$ written in base 16?',
      solution:
        'One hexadecimal digit equals 4 binary digits, because $2^4 = 16$. So we split the binary number into groups of 4.\n\n' +
        'Group from the **right**, because that is where the place values start. $101101$ splits into $10$ and $1101$. The left group is short, so pad it on the left with 0s to get $0010$. This doesn\'t change its value.\n\n' +
        'Convert each group using the places 8, 4, 2, 1. In hexadecimal, A to F stand for 10 to 15, so 13 is D:\n\n| Group | Working | Value | Hex digit |\n|---|---|---|---|\n| $0010$ | 2 | 2 | 2 |\n| $1101$ | $8 + 4 + 1$ | 13 | D |',
      conclusion: 'The left group is 2 and the right group is D, so the number is $\\mathrm{2D}_{16}$.',
      whyWrong: [
        null,
        'This groups from the **left** ($1011$, $01$) and pads on the right, which changes the value. Groups must start from the right.',
        'This writes the two groups in the wrong order. The left group stays on the left.',
        'This finds the decimal value, 45, and writes it with a base 16 label. $45_{16}$ is worth $4 \\times 16 + 5 = 69$.',
      ],
      keyIdea: 'Binary to hex: group into fours from the right, pad the leftmost group with 0s, and convert each group to one digit (10 to 15 become A to F). Keep the groups in their original order.',
    },
    check: {
      optionValues: ['2D', 'B4', 'D2', '45'],
      compute: () => toBase(fromBase('101101', 2), 16),
    },
  },
];
