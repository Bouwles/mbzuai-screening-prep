import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'number-bases',
  know:
    '### Place value: the idea behind every base\n\n' +
    'In ordinary decimal (base 10), the number $352$ means $3 \\times 100 + 5 \\times 10 + 2 \\times 1$. Each place is worth **10 times** the place to its right, and we only need the ten digits $0$ to $9$.\n\n' +
    'A different **base** just changes that multiplier. In base $b$, the places from the right are worth $1$, $b$, $b^2$, $b^3$, and so on, and the digits go from $0$ to $b - 1$. We write the base as a small subscript: $101_2$ is binary, $101_{10}$ is decimal.\n\n' +
    '| Base | Name | Digits | Place values (from the right) |\n' +
    '| --- | --- | --- | --- |\n' +
    '| 2 | binary | 0, 1 | 1, 2, 4, 8, 16, 32, 64, 128 |\n' +
    '| 8 | octal | 0 to 7 | 1, 8, 64, 512 |\n' +
    '| 10 | decimal | 0 to 9 | 1, 10, 100, 1000 |\n' +
    '| 16 | hexadecimal | 0 to 9, A to F | 1, 16, 256, 4096 |\n\n' +
    'Hexadecimal ("hex") needs six extra digits, so it uses letters: $\\mathrm{A} = 10$, $\\mathrm{B} = 11$, $\\mathrm{C} = 12$, $\\mathrm{D} = 13$, $\\mathrm{E} = 14$, $\\mathrm{F} = 15$.\n\n' +
    '### Any base to decimal\n\n' +
    'Multiply each digit by its place value and add. For example $10110_2 = 16 + 4 + 2 = 22$, and $\\mathrm{3F}_{16} = 3 \\times 16 + 15 = 63$. Always start the place values at **1 on the right**.\n\n' +
    '### Decimal to any base\n\n' +
    'Divide by the base again and again, writing down the **remainders**, until the quotient is 0. Then read the remainders from the **bottom up** (the first remainder is the units digit). For hex, a remainder from 10 to 15 becomes one letter.\n\n' +
    'For small numbers you can also use "biggest place value first": $37 = 32 + 4 + 1$, so put 1s under 32, 4 and 1 and 0s everywhere else: $100101_2$. Do not forget the zeros.\n\n' +
    '### Shortcuts between binary, octal and hex\n\n' +
    'Because $8 = 2^3$ and $16 = 2^4$:\n\n' +
    '- one **octal** digit is exactly **3 bits** ($5_8 = 101_2$)\n' +
    '- one **hex** digit is exactly **4 bits** ($\\mathrm{B}_{16} = 1011_2$)\n\n' +
    'So $\\mathrm{A7}_{16} = 1010\\;0111_2$. Going the other way, split the binary number into groups of 4 (or 3) **starting from the right**, padding the leftmost group with zeros. To go from octal to hex, pass through binary.\n\n' +
    '### Binary addition\n\n' +
    'Add column by column from the right, exactly like decimal, but you "carry" at 2 instead of at 10: $1 + 1 = 10_2$ (write 0, carry 1) and $1 + 1 + 1 = 11_2$ (write 1, carry 1). A quick check: convert both numbers to decimal, add, and convert back.\n\n' +
    '### Bits, bytes and how many values\n\n' +
    'A **bit** is one binary digit. A **byte** is 8 bits (half a byte, 4 bits, is a nibble, which is one hex digit). With $n$ bits there are $2^n$ different patterns, so:\n\n' +
    '- $n$ bits can store $2^n$ different values\n' +
    '- unsigned (no negatives), the range is $0$ to $2^n - 1$; one byte holds $0$ to $255$\n' +
    '- to give $N$ things different codes you need the smallest $n$ with $2^n \\ge N$ (always round **up**)\n\n' +
    '### Two\'s complement (negative numbers)\n\n' +
    'Computers store negative integers using **two\'s complement**. In $n$ bits, the leftmost bit is worth $-2^{n-1}$ instead of $+2^{n-1}$; all other bits are normal. In 8 bits, $11111111_2 = -128 + 127 = -1$.\n\n' +
    '- **To write $-k$:** write $k$ in $n$ bits, flip every bit, then add 1. Example: $5 = 00000101_2$, flipped $11111010_2$, add 1: $-5 = 11111011_2$.\n' +
    '- **To read a pattern starting with 1:** flip and add 1 to get the size, then put a minus sign in front. Or subtract $2^n$ from its unsigned value: $11111011_2 = 251$ unsigned, and $251 - 256 = -5$.\n' +
    '- **Range:** $-2^{n-1}$ to $2^{n-1} - 1$; for 8 bits, $-128$ to $127$. Adding two positives that go past the top **overflows** into a negative pattern.\n\n' +
    '### Bit shifts\n\n' +
    'Shifting the bits one place left adds a 0 on the right, which **doubles** the number (just like adding a 0 in decimal multiplies by 10). Shifting right drops the rightmost bit, which **halves** the number and rounds down. In Python, `x << k` is $x \\times 2^k$ and `x >> k` is $x \\div 2^k$ rounded down, the same as `x // 2**k`.',
  formulas: [
    { label: 'Value of a base-$b$ number', tex: '(d_k \\dots d_1 d_0)_b = d_k b^k + \\dots + d_1 b + d_0', note: 'Every digit must be between $0$ and $b - 1$.' },
    { label: 'Hex letters', tex: '\\mathrm{A} = 10,\\ \\mathrm{B} = 11,\\ \\mathrm{C} = 12,\\ \\mathrm{D} = 13,\\ \\mathrm{E} = 14,\\ \\mathrm{F} = 15' },
    { label: 'Digit groups', tex: '1 \\text{ octal digit} = 3 \\text{ bits}, \\quad 1 \\text{ hex digit} = 4 \\text{ bits}', note: 'Group bits from the right.' },
    { label: 'Bits and bytes', tex: '1 \\text{ byte} = 8 \\text{ bits}' },
    { label: 'Number of values with $n$ bits', tex: '2^n', note: 'Unsigned range: $0$ to $2^n - 1$.' },
    { label: 'Bits needed for $N$ different codes', tex: '\\text{smallest } n \\text{ with } 2^n \\ge N' },
    { label: "Two's complement range ($n$ bits)", tex: '-2^{n-1} \\text{ to } 2^{n-1} - 1' },
    { label: "Two's complement of $-k$", tex: '\\text{flip all bits of } k, \\text{ then add } 1 \\quad (\\text{equivalently } 2^n - k \\text{ unsigned})' },
    { label: 'Bit shifts', tex: 'x \\ll k = x \\times 2^k, \\qquad x \\gg k = \\left\\lfloor \\frac{x}{2^k} \\right\\rfloor', note: 'Here $\\ll$ and $\\gg$ mean the shift operators, written `<<` and `>>` in Python. The brackets $\\lfloor \\; \\rfloor$ mean round down.' },
  ],
  examples: [
    {
      title: 'Binary to decimal',
      problem: 'Convert $1011010_2$ to decimal.',
      steps: [
        'Write the place values from the right: $1, 2, 4, 8, 16, 32, 64$. The 7 digits fill places $64$ down to $1$.',
        'The digits $1, 0, 1, 1, 0, 1, 0$ have 1s under $64$, $16$, $8$ and $2$.',
        'Add those place values: $64 + 16 + 8 + 2 = 90$.',
      ],
      answer: '$1011010_2 = 90$',
    },
    {
      title: 'Decimal to hexadecimal and binary',
      problem: 'Write $181$ in hexadecimal, then in binary.',
      steps: [
        '$181 \\div 16 = 11$ remainder $5$ (since $11 \\times 16 = 176$).',
        '$11 \\div 16 = 0$ remainder $11$, and $11$ is the hex digit $\\mathrm{B}$.',
        'Read the remainders bottom up: $\\mathrm{B5}_{16}$.',
        'Each hex digit is 4 bits: $\\mathrm{B} = 1011$ and $5 = 0101$.',
        'Join them: $10110101_2$. Check: $128 + 32 + 16 + 4 + 1 = 181$.',
      ],
      answer: '$181 = \\mathrm{B5}_{16} = 10110101_2$',
    },
    {
      title: "Two's complement",
      problem: "Write $-36$ in 8-bit two's complement, and check your answer.",
      steps: [
        '$36 = 32 + 4$, so in 8 bits $36 = 00100100_2$.',
        'Flip every bit: $11011011_2$.',
        'Add 1: $11011100_2$.',
        'Check with the negative top bit: $-128 + 64 + 16 + 8 + 4 = -36$. Correct.',
      ],
      answer: '$-36 = 11011100_2$',
    },
    {
      title: 'Exam level: an unknown base',
      problem: 'In base $b$, $52_b = 37$. Find $b$.',
      steps: [
        'Use place values: $52_b = 5b + 2$.',
        'Set it equal to 37: $5b + 2 = 37$, so $5b = 35$ and $b = 7$.',
        'Check the digits are allowed: the largest digit is 5, and $5 < 7$. Also $5 \\times 7 + 2 = 37$.',
      ],
      answer: '$b = 7$',
    },
  ],
  traps: [
    'Reading the remainders top-down when converting from decimal. The **first** remainder is the units digit, so read from the bottom up.',
    'Leaving out the zeros: $37 = 32 + 4 + 1$ is $100101_2$, not $111_2$. Every place between the leading 1 and the units needs a digit.',
    'Confusing "how many values" with "largest value": $n$ bits give $2^n$ values but the largest unsigned value is $2^n - 1$ (one byte: 256 values, largest 255).',
    'Forgetting the "add 1" in two\'s complement, or using sign-and-magnitude (just setting the first bit to 1). In 8 bits, $-13$ is $11110011_2$, not $10001101_2$ and not $11110010_2$.',
    'Grouping bits from the left when converting to hex or octal. Always group from the **right** and pad the leftmost group with zeros.',
    'Thinking a shift by $k$ multiplies by $k$. A left shift by 3 multiplies by $2^3 = 8$; a right shift rounds **down**, so in Python `-21 >> 2` is $-6$, not $-5$.',
  ],
  examTip:
    'These questions are quick marks if you **check by converting back**. For a conversion, turn each option back into decimal (or into the base you started from) and see which one matches; this takes seconds with place values. Fast eliminations: an odd decimal number must end in 1 in binary, an even one in 0; a binary answer containing a 2, or an octal answer containing an 8 or 9, is impossible; in base $b$ every digit must be less than $b$. For two\'s complement, a negative number must start with 1, and the "flip but forget to add 1" option is always exactly one away from the answer, so do the last step carefully. For "how many bits" questions, list powers of 2 ($2, 4, 8, 16, 32, 64, 128, 256, 512, 1024$) and pick the first one that is **at least** the number needed.',
};
