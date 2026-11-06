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
      solution:
        'In binary, each place is worth **double** the place to its right. Starting from the right, the place values are $1, 2, 4, 8, 16, 32$.\n\n' +
        '| Place value | 32 | 16 | 8 | 4 | 2 | 1 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- |\n' +
        '| Digit | 1 | 1 | 0 | 1 | 0 | 1 |\n\n' +
        'Add the place values that have a 1 under them:\n\n' +
        '$$32 + 16 + 4 + 1 = 53$$',
      whyWrong: [
        'This is what you get if you start the place values at the **left** end: you have really converted $101011_2 = 32 + 8 + 2 + 1 = 43$. The units (1s) place is always the rightmost digit.',
        null,
        'This is what you get if you start the place values at 2 instead of 1 (using $2, 4, 8, \\dots, 64$). The rightmost place is $2^0 = 1$, so this doubles the true answer.',
        'This is what you get if you drop the leftmost 1: $10101_2 = 16 + 4 + 1 = 21$. A 6-digit binary number has a leading place value of 32.',
      ],
      keyIdea: 'Binary place values are powers of 2 starting from $2^0 = 1$ at the right; add the place values where there is a 1.',
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
      solution:
        'Divide by 2 repeatedly and write down each remainder:\n\n' +
        '| Division | Quotient | Remainder |\n' +
        '| --- | --- | --- |\n' +
        '| $37 \\div 2$ | 18 | 1 |\n' +
        '| $18 \\div 2$ | 9 | 0 |\n' +
        '| $9 \\div 2$ | 4 | 1 |\n' +
        '| $4 \\div 2$ | 2 | 0 |\n' +
        '| $2 \\div 2$ | 1 | 0 |\n' +
        '| $1 \\div 2$ | 0 | 1 |\n\n' +
        'Read the remainders from the **bottom up**: $100101_2$.\n\n' +
        'Check with place values: $32 + 4 + 1 = 37$. Correct.',
      whyWrong: [
        'This is the remainders read from the **top down** ($1, 0, 1, 0, 0, 1$). The first remainder is the units digit, so it must go on the right: read the remainders from the bottom up.',
        'This writes a 1 for each of $32$, $4$ and $1$ but leaves out the zeros for the unused places $16$, $8$ and $2$. Without the zeros, $111_2$ is only $4 + 2 + 1 = 7$.',
        'This is $32 + 4 = 36$: the units digit has been left as 0. Since 37 is odd, its binary form must end in 1.',
        null,
      ],
      keyIdea: 'To convert decimal to binary, divide by 2 repeatedly and read the remainders from the last one to the first.',
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
      solution:
        'Each bit has 2 choices (0 or 1), and the choices are independent, so by the product rule:\n\n' +
        '$$2 \\times 2 \\times 2 \\times 2 \\times 2 \\times 2 = 2^6 = 64$$\n\n' +
        'These are the patterns $000000_2$ up to $111111_2$, i.e. the numbers $0$ to $63$, which is $64$ values.',
      whyWrong: [
        null,
        'This is the **largest** value, $2^6 - 1 = 63$. Counting from 0 to 63 gives 64 different values, because 0 counts too.',
        'This is $2 \\times 6$. The number of choices multiplies for each bit, so it is $2^6$, not $2 \\times 6$.',
        'This is $6^2$: the base and the power have been swapped. It should be $2^6$ (2 choices, 6 times).',
      ],
      keyIdea: 'With $n$ bits there are $2^n$ different patterns, so $2^n$ different values.',
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
      solution:
        'The largest value has every bit set to 1: $11111111_2$.\n\n' +
        '$$128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255$$\n\n' +
        'Quick rule: with $n$ bits the unsigned range is $0$ to $2^n - 1$, so $2^8 - 1 = 256 - 1 = 255$.',
      whyWrong: [
        'This is $2^8 = 256$, the **number of different values** a byte can hold. Since counting starts at 0, the largest is one less: 255.',
        'This is $2^7 = 128$, the place value of the leftmost bit only. All 8 bits being 1 gives more than that.',
        null,
        'This is the largest value of a **signed** (two\'s complement) byte. The question says unsigned, so all 8 bits are used for the size of the number.',
      ],
      keyIdea: 'An unsigned $n$-bit integer goes from $0$ up to $2^n - 1$.',
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
      solution:
        'Hexadecimal (base 16) uses the digits $0$ to $9$ and then $\\mathrm{A} = 10$, $\\mathrm{B} = 11$, $\\mathrm{C} = 12$, $\\mathrm{D} = 13$, $\\mathrm{E} = 14$, $\\mathrm{F} = 15$.\n\n' +
        'The place values are $1$ (right) and $16$ (left):\n\n' +
        '$$\\mathrm{2C}_{16} = 2 \\times 16 + 12 \\times 1 = 32 + 12 = 44$$',
      whyWrong: [
        'This uses 10 as the place value instead of 16: $2 \\times 10 + 12 = 32$. In hexadecimal the second place is worth 16.',
        'This reads the digits in the wrong order: $12 \\times 16 + 2 = 194$. The rightmost digit is the units digit.',
        'This just adds the digit values, $2 + 12 = 14$, ignoring place value: the 2 is worth $2 \\times 16$, not 2.',
        null,
      ],
      keyIdea: 'Each hexadecimal place is worth 16 times the place to its right, and the letters A to F stand for 10 to 15.',
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
      solution:
        'Add column by column from the right, just like decimal addition, but remember that in binary $1 + 1 = 10_2$ (write 0, carry 1) and $1 + 1 + 1 = 11_2$ (write 1, carry 1).\n\n' +
        '| Column | 8 | 4 | 2 | 1 |\n' +
        '| --- | --- | --- | --- | --- |\n' +
        '| First number | 1 | 0 | 1 | 1 |\n' +
        '| Second number | 0 | 1 | 1 | 0 |\n\n' +
        '- 1s column: 1 and 0, total 1. Write 1, carry 0.\n' +
        '- 2s column: 1 and 1, total 2. Write 0, carry 1.\n' +
        '- 4s column: 0 and 1 plus the carry 1, total 2. Write 0, carry 1.\n' +
        '- 8s column: 1 and 0 plus the carry 1, total 2. Write 0, carry 1.\n' +
        '- The final carry 1 becomes a new 16s digit.\n\n' +
        'Result: $10001_2$.\n\n' +
        'Check in decimal: $1011_2 = 11$, $0110_2 = 6$, and $11 + 6 = 17 = 16 + 1 = 10001_2$.',
      whyWrong: [
        'This writes 0 whenever a column adds to 2 but never carries the 1 to the next column. Ignoring carries gives $1101_2 = 13$, not $17$.',
        null,
        'This treats $1 + 1$ as $1$ (like the logical OR of the bits) instead of $10_2$. Its value is 15, but $11 + 6 = 17$.',
        'This adds the digits as if they were decimal, giving a digit 2. Binary only has the digits 0 and 1, so a column total of 2 must be written as 0 with a carry of 1.',
      ],
      keyIdea: 'In binary addition $1 + 1 = 10_2$: write 0 and carry 1 into the next column.',
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
      solution:
        'Each hexadecimal digit is exactly **4 bits** (because $2^4 = 16$), so convert each digit separately and join them.\n\n' +
        '- $\\mathrm{A} = 10 = 8 + 2 \\to 1010$\n' +
        '- $7 = 4 + 2 + 1 \\to 0111$ (pad to 4 bits with a leading 0)\n\n' +
        'Join them in the same order: $1010\\,0111 \\to 10100111_2$.\n\n' +
        'Check: $\\mathrm{A7}_{16} = 10 \\times 16 + 7 = 167$ and $10100111_2 = 128 + 32 + 4 + 2 + 1 = 167$.',
      whyWrong: [
        'This writes 7 as $111$ instead of the 4-bit group $0111$. Losing that 0 shifts the A part one place to the right: $1010111_2$ is only 87, not 167.',
        'This converts each digit correctly but puts the groups in the wrong order (7 first, then A). The groups must stay in the same order as the hex digits.',
        null,
        'This uses $1011$ for A, but $1011_2 = 11$, which is B. A is 10, so it is $1010$.',
      ],
      keyIdea: 'Hex to binary: replace each hex digit by its 4-bit group (padding with leading zeros), keeping the order.',
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
      solution:
        'In base 8 the place values are powers of 8: $1$, $8$, $8^2 = 64$ (from right to left).\n\n' +
        '| Place value | 64 | 8 | 1 |\n' +
        '| --- | --- | --- | --- |\n' +
        '| Digit | 1 | 5 | 7 |\n\n' +
        '$$1 \\times 64 + 5 \\times 8 + 7 \\times 1 = 64 + 40 + 7 = 111$$',
      whyWrong: [
        null,
        'This uses powers of 16 (hexadecimal place values): $1 \\times 256 + 5 \\times 16 + 7 = 343$. Octal place values are powers of 8.',
        'This reads the digits in the wrong order: $7 \\times 64 + 5 \\times 8 + 1 = 489$. The rightmost digit is the units digit.',
        'This just adds the digits, $1 + 5 + 7 = 13$, ignoring place value.',
      ],
      keyIdea: 'In base $b$, the place values from the right are $1, b, b^2, b^3, \\dots$; multiply each digit by its place value and add.',
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
      solution:
        'Divide by 16 and keep the remainders:\n\n' +
        '- $200 \\div 16 = 12$ remainder $8$ (because $12 \\times 16 = 192$ and $200 - 192 = 8$)\n' +
        '- $12 \\div 16 = 0$ remainder $12$\n\n' +
        'Read the remainders from the bottom up: $12$ then $8$. The value 12 is the single hex digit C, so the answer is $\\mathrm{C8}_{16}$.\n\n' +
        'Check: $12 \\times 16 + 8 = 192 + 8 = 200$.',
      whyWrong: [
        'This writes the remainders top-down (8 first). The first remainder is the units digit and goes on the **right**.',
        null,
        'This writes the quotient 12 as the two decimal digits 1 and 2. In hexadecimal, 12 must be written as the **single** digit C.',
        'This uses the calculator decimal $200 \\div 16 = 12.5$ and turns the 0.5 into a digit 5. The units digit is the **remainder**, $200 - 12 \\times 16 = 8$, not the digits after the decimal point.',
      ],
      keyIdea: 'Decimal to hex: divide by 16, use the whole-number remainders (written as 0 to F), and read them from last to first.',
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
      solution:
        'To make a negative number in two\'s complement: write the positive number, **flip every bit**, then **add 1**.\n\n' +
        '1. $13 = 8 + 4 + 1$, so in 8 bits $13 = 00001101_2$.\n' +
        '2. Flip every bit: $11110010_2$.\n' +
        '3. Add 1: $11110010_2 + 1 = 11110011_2$.\n\n' +
        'Check: in 8-bit two\'s complement, a pattern starting with 1 is worth its unsigned value minus 256. Here $11110011_2 = 243$ unsigned, and $243 - 256 = -13$. Correct.',
      whyWrong: [
        'This is **sign-and-magnitude**: a 1 for the sign followed by 13 in binary. Two\'s complement does not work like that; you must flip the bits and add 1.',
        'This is only the "flip every bit" step (the one\'s complement). You also need to add 1.',
        null,
        'This flips the bits and then **subtracts** 1 instead of adding 1.',
      ],
      keyIdea: 'Two\'s complement of a negative number: write the positive value, invert all bits, then add 1.',
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
      solution:
        'The leftmost bit is 1, so the number is negative. Two methods:\n\n' +
        '**Method 1 (flip and add 1).** Flip every bit: $00010111_2$. Add 1: $00011000_2 = 16 + 8 = 24$. So the value is $-24$.\n\n' +
        '**Method 2 (negative top bit).** In 8-bit two\'s complement the leftmost place is worth $-128$ instead of $+128$:\n\n' +
        '$$-128 + 64 + 32 + 8 = -24$$',
      whyWrong: [
        'This reads the pattern as an **unsigned** number ($128 + 64 + 32 + 8 = 232$). The question says it is signed two\'s complement, and a leading 1 means negative.',
        'This reads it as **sign-and-magnitude**: sign bit 1, then $1101000_2 = 104$. In two\'s complement the leading bit is worth $-128$.',
        'This flips the bits ($00010111_2 = 23$) but forgets to add 1 afterwards.',
        null,
      ],
      keyIdea: 'In $n$-bit two\'s complement the leftmost bit is worth $-2^{n-1}$; all other bits keep their usual positive place values.',
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
      solution:
        '1. Add three zeros on the right: $1101_2$ becomes $1101000_2$.\n' +
        '2. Convert to decimal: $64 + 32 + 8 = 104$.\n\n' +
        'Check: each place left doubles the number, and $1101_2 = 13$, so the result is $13 \\times 2^3 = 104$.',
      whyWrong: [
        'This multiplies 13 by the shift amount: $13 \\times 3 = 39$. Shifting by $k$ places multiplies by $2^k$, not by $k$.',
        'This adds the shift amount: $13 + 3 = 16$. A shift moves the bits, which multiplies by a power of 2.',
        null,
        'This shifts **right** by 3 places: $13 \\div 8$ rounded down is 1. A left shift makes the number bigger.',
      ],
      keyIdea: 'A left shift by $k$ places multiplies by $2^k$; a right shift by $k$ places divides by $2^k$ and rounds down.',
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
      solution:
        'With $n$ bits, two\'s complement covers $-2^{n-1}$ to $2^{n-1} - 1$.\n\n' +
        'Here $n = 10$, so $2^{n-1} = 2^9 = 512$:\n\n' +
        '- Smallest: $-512$ (pattern $1000000000_2$)\n' +
        '- Largest: $512 - 1 = 511$ (pattern $0111111111_2$)\n\n' +
        'That is $512 + 511 + 1 = 1024 = 2^{10}$ values in total, as expected for 10 bits. There is one more negative value than positive, because 0 uses one of the "non-negative" patterns.',
      whyWrong: [
        'This is the range for **sign-and-magnitude**, which wastes a pattern on "negative zero". Two\'s complement has only one zero, so it reaches one further on the negative side: $-512$.',
        null,
        'This is the range for an **unsigned** 10-bit number ($0$ to $2^{10} - 1$). Two\'s complement uses half of the patterns for negative numbers.',
        'This uses $2^{10}$ instead of $2^{9}$. One bit effectively decides the sign, so the size goes up to $2^{n-1}$, and these 2048 values would need 11 bits.',
      ],
      keyIdea: 'An $n$-bit two\'s complement integer ranges from $-2^{n-1}$ to $2^{n-1} - 1$.',
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
      solution:
        'With $n$ bits there are $2^n$ different codes. We need $2^n \\ge 300$.\n\n' +
        '- $2^8 = 256$, which is **less** than 300, so 8 bits are not enough (44 items would have no code).\n' +
        '- $2^9 = 512$, which is at least 300.\n\n' +
        'So the minimum is $9$ bits.',
      whyWrong: [
        'This rounds $\\log_2 300 \\approx 8.2$ **down**. But 8 bits only give $2^8 = 256$ codes, fewer than 300 items; you must always round **up**.',
        'This divides 300 by 8 (as if converting bits to bytes) and rounds up. The number of codes grows as $2^n$, not $8n$.',
        'This is the number of codes available with 9 bits ($2^9 = 512$), not the number of bits.',
        null,
      ],
      keyIdea: 'To give $N$ items different codes you need the smallest $n$ with $2^n \\ge N$.',
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
      solution:
        'Each pass doubles the total so far and adds the next digit, reading the digits from left to right.\n\n' +
        '| `i` | `A[i]` | `n` |\n' +
        '| --- | --- | --- |\n' +
        '| 1 | 1 | 1 |\n' +
        '| 2 | 1 | 3 |\n' +
        '| 3 | 0 | 6 |\n' +
        '| 4 | 1 | 13 |\n\n' +
        'The loop ends and prints **13**. This is the value of $1101_2 = 8 + 4 + 1$.',
      whyWrong: [
        'This reads the digits from right to left, which converts $1011_2 = 11$. The loop starts at `A[1]`, the leftmost digit.',
        null,
        'This only adds up the digits and forgets the `n * 2`, which gives each digit its place value.',
        'This doubles once more after the last digit. The last pass adds `A[4]` to $6 \\times 2$, and then the loop ends.',
      ],
      keyIdea: 'The loop "multiply by the base, then add the next digit" converts a list of digits to a number.',
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
      solution:
        'For $n$-bit two\'s complement the range is $-2^{n-1}$ to $2^{n-1} - 1$. With $n = 12$, $2^{11} = 2048$:\n\n' +
        '- Largest: $2048 - 1 = 2047$\n' +
        '- Smallest: $-2048$\n\n' +
        'Difference: $2047 - (-2048) = 2047 + 2048 = 4095$.\n\n' +
        '(Equivalently: there are $2^{12} = 4096$ values in a row, and the gap from the first to the last of $4096$ consecutive integers is $4096 - 1 = 4095$.)',
      whyWrong: [
        'This is the **number** of values, $2^{12} = 4096$. The difference between the first and last of 4096 consecutive integers is one less.',
        'This uses the sign-and-magnitude range $-2047$ to $2047$. Two\'s complement reaches $-2048$.',
        'This is just the largest value, 2047. The smallest value is negative, so subtracting it adds 2048 more.',
        null,
      ],
      keyIdea: 'An $n$-bit two\'s complement integer spans $-2^{n-1}$ to $2^{n-1} - 1$, so the spread is $2^n - 1$.',
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
      solution: 'A **bit** is one binary digit, and a **byte** is a group of $8$ bits.',
      whyWrong: [
        null,
        '4 bits is half a byte, sometimes called a nibble. It is the size of one hexadecimal digit.',
        '16 bits is two bytes.',
        '2 is the number of values one bit can take (0 or 1), not the number of bits in a byte.',
      ],
      keyIdea: 'One byte is 8 bits.',
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
      solution:
        'Hexadecimal uses the digits $0$ to $9$, then the letters $\\mathrm{A} = 10$, $\\mathrm{B} = 11$, $\\mathrm{C} = 12$, $\\mathrm{D} = 13$, $\\mathrm{E} = 14$ and $\\mathrm{F} = 15$.\n\n' +
        'So $\\mathrm{F}$ stands for $15$, the largest single hexadecimal digit.',
      whyWrong: [
        null,
        '16 is the base itself. Digits in base 16 run from 0 up to one less than the base.',
        'This is the position of F in the alphabet. The letters start at $\\mathrm{A} = 10$.',
        'This is the value of E, the letter before F.',
      ],
      keyIdea: 'The hexadecimal letters A to F stand for 10 to 15.',
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
      solution: 'A hexadecimal digit has 16 possible values, and $2^4 = 16$, so one hexadecimal digit corresponds to exactly $4$ bits.',
      whyWrong: [
        null,
        '8 bits is one byte, which takes **two** hexadecimal digits.',
        '16 is the number of values one digit can take, not the number of bits. You need $2^n = 16$, so $n = 4$.',
        '2 bits give only $2^2 = 4$ values, which is not enough for 16 different digits.',
      ],
      keyIdea: 'Because $2^4 = 16$, one hexadecimal digit is exactly 4 bits.',
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
      solution:
        '**Radix** is another word for the base of a number system: the number of different digits it uses.\n\n' +
        'Octal uses the digits $0$ to $7$, which is 8 digits, so its radix is $8$.',
      whyWrong: [
        null,
        'This is the radix of hexadecimal.',
        'This is the radix of ordinary decimal numbers.',
        'This is the radix of binary.',
      ],
      keyIdea: 'Radix means base: binary is 2, octal is 8, decimal is 10 and hexadecimal is 16.',
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
      solution:
        'One hexadecimal digit is 4 bits, so split the bits into groups of 4 **starting from the right**.\n\n' +
        '1. The groups are $10$ and $1101$. Pad the left group: $0010$ and $1101$.\n' +
        '2. $0010_2 = 2$ and $1101_2 = 13 = \\mathrm{D}$.\n\n' +
        'So the answer is $\\mathrm{2D}_{16}$.\n\n' +
        'Check: $101101_2 = 32 + 8 + 4 + 1 = 45$ and $\\mathrm{2D}_{16} = 2 \\times 16 + 13 = 45$.',
      whyWrong: [
        null,
        'This groups from the **left** ($1011$, $01$) and pads on the right, which changes the value. Groups must start from the right.',
        'This writes the two groups in the wrong order. The left group stays on the left.',
        'This finds the decimal value, 45, and writes it with a base 16 label. $45_{16}$ is worth $4 \\times 16 + 5 = 69$.',
      ],
      keyIdea: 'Binary to hexadecimal: group the bits in 4s from the right, padding the left group with zeros.',
    },
    check: {
      optionValues: ['2D', 'B4', 'D2', '45'],
      compute: () => toBase(fromBase('101101', 2), 16),
    },
  },
];
