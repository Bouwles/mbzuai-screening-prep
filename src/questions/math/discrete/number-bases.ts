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
    difficulty: 'exam',
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
    difficulty: 'exam',
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
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print(13 << 3, 200 >> 2)' },
    options: ['`39 100`', '`16 198`', '`104 50`', '`1 800`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A **left shift** by $k$ places multiplies by $2^k$; a **right shift** by $k$ places divides by $2^k$ (rounding down).\n\n' +
        '- `13 << 3`: $13 \\times 2^3 = 13 \\times 8 = 104$. In binary, $1101_2$ becomes $1101000_2$ (three zeros added on the right).\n' +
        '- `200 >> 2`: $200 \\div 2^2 = 200 \\div 4 = 50$. In binary, $11001000_2$ becomes $110010_2$ (the two rightmost bits are dropped).\n\n' +
        '`print` separates its two values with a space, so the output is `104 50`.',
      whyWrong: [
        'This multiplies by 3 and divides by 2, i.e. uses the shift amount itself. Shifting by $k$ multiplies or divides by $2^k$, not by $k$.',
        'This adds 3 and subtracts 2. A shift moves the bits, which multiplies or divides by a power of 2.',
        null,
        'This shifts in the wrong directions: `<<` (arrows pointing left) moves bits left, making the number **bigger**; `>>` makes it smaller.',
      ],
      keyIdea: '`x << k` is $x \\times 2^k$ and `x >> k` is $x \\div 2^k$ rounded down.',
    },
    python: { stdout: '104 50' },
  },
  {
    id: 'number-bases-013',
    subtopic: 'number-bases',
    difficulty: 'exam',
    stem: 'A sensor stores readings as **10-bit two\'s complement** integers. What is the range of values it can store?',
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
    stem: 'A school wants to give each of its $300$ students a different binary ID code, all of the same length. What is the **minimum** number of bits each code needs?',
    options: ['$8$', '$38$', '$512$', '$9$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'With $n$ bits there are $2^n$ different codes. We need $2^n \\ge 300$.\n\n' +
        '- $2^8 = 256$, which is **less** than 300, so 8 bits are not enough (44 students would have no code).\n' +
        '- $2^9 = 512$, which is at least 300.\n\n' +
        'So the minimum is $9$ bits.',
      whyWrong: [
        'This rounds $\\log_2 300 \\approx 8.2$ **down**. But 8 bits only give $2^8 = 256$ codes, fewer than 300 students; you must always round **up**.',
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
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'n = 0\nfor ch in "1101":\n    n = n * 2 + int(ch)\nprint(n, bin(n << 1), hex(n))',
    },
    options: ['`11 0b10110 0xb`', '`13 0b11010 0xd`', '`13 0b110 0xd`', '`13 11010 d`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The loop reads the binary string from **left to right**. Each step doubles the total so far (shifting it one place left) and adds the new digit.\n\n' +
        '| `ch` | calculation | `n` |\n' +
        '| --- | --- | --- |\n' +
        '| (start) | | 0 |\n' +
        '| `"1"` | $0 \\times 2 + 1$ | 1 |\n' +
        '| `"1"` | $1 \\times 2 + 1$ | 3 |\n' +
        '| `"0"` | $3 \\times 2$ | 6 |\n' +
        '| `"1"` | $6 \\times 2 + 1$ | 13 |\n\n' +
        'So `n` is 13 (indeed $1101_2 = 8 + 4 + 1 = 13$).\n\n' +
        '- `n << 1` is $13 \\times 2 = 26 = 11010_2$, and `bin` writes it with the prefix `0b`: `0b11010`.\n' +
        '- `hex(13)`: 13 is the hex digit d, and Python writes it in lower case with the prefix `0x`: `0xd`.\n\n' +
        'Output: `13 0b11010 0xd`.',
      whyWrong: [
        'This reads the string from right to left, i.e. converts $1011_2 = 11$. The loop goes through `"1101"` from the first character, and doubling at each step makes the first character the most significant bit.',
        null,
        'This treats `<<` as halving: `13 >> 1` would be $6 = 110_2$. The arrows point left, so `n << 1` doubles 13 to 26.',
        'This forgets that `bin()` and `hex()` return strings that start with the prefixes `0b` and `0x`.',
      ],
      keyIdea: 'The "multiply by the base and add the next digit" loop converts a digit string to a number; `bin` and `hex` return strings with `0b` and `0x` prefixes.',
    },
    python: { stdout: '13 0b11010 0xd' },
  },

  // ---------------------------------------------------------------- challenge
  {
    id: 'number-bases-016',
    subtopic: 'number-bases',
    difficulty: 'challenge',
    stem: 'Convert the octal number $725_8$ to hexadecimal.',
    options: ['$\\mathrm{EA1}_{16}$', '$\\mathrm{2D5}_{16}$', '$725_{16}$', '$\\mathrm{1D5}_{16}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Go through binary. Each octal digit is exactly **3 bits** ($2^3 = 8$) and each hex digit is exactly **4 bits** ($2^4 = 16$).\n\n' +
        '1. Octal to binary, 3 bits per digit: $7 \\to 111$, $2 \\to 010$, $5 \\to 101$. So $725_8 = 111010101_2$.\n' +
        '2. Regroup into 4s **starting from the right**: $1\\;1101\\;0101$, and pad the left group to $0001$.\n' +
        '3. Each group to hex: $0001 \\to 1$, $1101 \\to 13 = \\mathrm{D}$, $0101 \\to 5$.\n\n' +
        'Answer: $\\mathrm{1D5}_{16}$.\n\n' +
        'Check via decimal: $725_8 = 7 \\times 64 + 2 \\times 8 + 5 = 469$ and $\\mathrm{1D5}_{16} = 256 + 13 \\times 16 + 5 = 256 + 208 + 5 = 469$.',
      whyWrong: [
        'This regroups the bits into 4s starting from the **left** ($1110\\;1010\\;1$). Groups must be made from the right, because the units bit is on the right; padding goes on the left.',
        'This converts $725$ as if it were a **decimal** number ($725 = 2 \\times 256 + 13 \\times 16 + 5$). It is an octal number worth only 469.',
        'This copies the digits unchanged, as if octal and hex digits matched one for one. They do not: an octal digit is 3 bits but a hex digit is 4 bits.',
        null,
      ],
      keyIdea: 'Octal to hex: expand each octal digit into 3 bits, then regroup into 4-bit groups from the right.',
    },
    check: {
      optionValues: ['EA1', '2D5', '725', '1D5'],
      compute: () => {
        const bits = [...'725'].map((d) => toBase(fromBase(d, 8), 2).padStart(3, '0')).join('');
        return toBase(fromBase(bits, 2), 16);
      },
    },
  },
  {
    id: 'number-bases-017',
    subtopic: 'number-bases',
    difficulty: 'challenge',
    stem: 'A computer stores integers in **8-bit two\'s complement**. It adds $01100100_2$ and $00110010_2$ and keeps only 8 bits of the result. What decimal value does the stored result represent?',
    options: ['$150$', '$-106$', '$-22$', '$-105$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. The inputs: $01100100_2 = 64 + 32 + 4 = 100$ and $00110010_2 = 32 + 16 + 2 = 50$.\n' +
        '2. Binary addition gives $10010110_2$ (this is $150$ as an unsigned number, and it still fits in 8 bits, so nothing is cut off).\n' +
        '3. But in 8-bit two\'s complement a leading 1 means negative. The leftmost bit is worth $-128$:\n\n' +
        '$$-128 + 16 + 4 + 2 = -106$$\n\n' +
        'This is **overflow**: the true answer 150 is bigger than the largest 8-bit two\'s complement value (127), so adding two positive numbers produced a negative result.',
      whyWrong: [
        'This is the true sum $100 + 50$, but 8-bit two\'s complement can only store up to 127, so 150 cannot be represented. The stored pattern $10010110_2$ is read as a negative number.',
        null,
        'This reads $10010110_2$ as **sign-and-magnitude** (sign bit 1, then $0010110_2 = 22$). In two\'s complement the leading bit is worth $-128$.',
        'This flips the bits ($01101001_2 = 105$) but forgets to add 1 when decoding the negative number.',
      ],
      keyIdea: 'If two positive two\'s complement numbers add to more than $2^{n-1} - 1$, the result overflows and appears negative.',
    },
    check: {
      optionValues: [150, -106, -22, -105],
      compute: () => {
        const sum = (fromBase('01100100', 2) + fromBase('00110010', 2)) % 256;
        return twos(toBase(sum, 2).padStart(8, '0'));
      },
    },
  },
  {
    id: 'number-bases-018',
    subtopic: 'number-bases',
    difficulty: 'challenge',
    stem: 'In some base $b$, the sum $34_b + 25_b = 61_b$ is correct. What is $b$?',
    options: ['$9$', '$10$', '$8$', '$6$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Write every number using place values in base $b$:\n\n' +
        '- $34_b = 3b + 4$\n' +
        '- $25_b = 2b + 5$\n' +
        '- $61_b = 6b + 1$\n\n' +
        'Set up the equation: $(3b + 4) + (2b + 5) = 6b + 1$, so $5b + 9 = 6b + 1$, giving $b = 8$.\n\n' +
        'Check it is a valid base: the largest digit used is 6, and $6 < 8$. In decimal: $34_8 = 28$, $25_8 = 21$, $61_8 = 49$, and $28 + 21 = 49$. Correct.\n\n' +
        'Quick column view: the units give $4 + 5 = 9$, which must be "write 1, carry 1", so $9 = b + 1$ and $b = 8$.',
      whyWrong: [
        'This drops the units digit of $61_b$, writing it as $6b$: then $5b + 9 = 6b$ gives $b = 9$. Check: $34_9 + 25_9 = 31 + 23 = 54$, but $61_9 = 55$.',
        'This assumes the numbers are ordinary decimals, but $34 + 25 = 59$ in decimal, not 61.',
        null,
        'This takes the base to be the largest digit that appears. A base-$b$ number can only use digits $0$ to $b - 1$, so a base containing the digit 6 must be at least 7.',
      ],
      keyIdea: 'Turn base-$b$ numbers into expressions in $b$ using place values, then solve the equation (and check every digit is less than $b$).',
    },
    check: {
      optionValues: [9, 10, 8, 6],
      compute: () => {
        for (let b = 2; b <= 16; b++) {
          const digitsOk = [...'342561'].every((d) => fromBase(d, 16) < b);
          if (digitsOk && fromBase('34', b) + fromBase('25', b) === fromBase('61', b)) return b;
        }
        return -1;
      },
    },
  },
  {
    id: 'number-bases-019',
    subtopic: 'number-bases',
    difficulty: 'challenge',
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
    id: 'number-bases-020',
    subtopic: 'number-bases',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print(-21 >> 2, -21 // 4, int(-21 / 4))' },
    options: ['`-5 -5 -5`', '`-6 -6 -5`', '`-6 -5 -5`', '`-5 -6 -5`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Exactly: $-21 \\div 4 = -5.25$. The three expressions round this in different ways.\n\n' +
        '- `-21 >> 2`: a right shift by 2 divides by $2^2 = 4$ and rounds **down** (towards $-\\infty$). Down from $-5.25$ is $-6$. (Python integers behave as two\'s complement with infinitely many sign bits, so the shift floors.)\n' +
        '- `-21 // 4`: floor division also rounds **down**: $-6$.\n' +
        '- `int(-21 / 4)`: `-21 / 4` is the float $-5.25$, and `int()` **chops off** the decimal part (rounds towards zero): $-5$.\n\n' +
        'Output: `-6 -6 -5`.',
      whyWrong: [
        'This assumes all three round towards zero. For negative numbers, `>>` and `//` round **down**, and down from $-5.25$ is $-6$, not $-5$.',
        null,
        'This gets the shift right but thinks `//` chops towards zero like `int()`. Floor division always rounds down, so `-21 // 4` is $-6$.',
        'This gets `//` right but thinks the right shift rounds towards zero. A right shift by $k$ is the same as `// 2**k`, so it also gives $-6$.',
      ],
      keyIdea: '`x >> k` equals `x // 2**k` (rounding down), which differs from `int(x / 2**k)` (rounding towards zero) when $x$ is negative and not an exact multiple of $2^k$.',
    },
    python: { stdout: '-6 -6 -5' },
  },
];
