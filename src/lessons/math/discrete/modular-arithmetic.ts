import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'modular-arithmetic',
  know:
    '### Remainders and the mod operation\n\n' +
    'When you divide a whole number $a$ by $n$ you get a **quotient** $q$ and a **remainder** $r$:\n\n' +
    '$$a = n \\times q + r, \\qquad 0 \\le r < n$$\n\n' +
    'The remainder is written $a \\bmod n$. For example $47 = 6 \\times 7 + 5$, so $47 \\bmod 6 = 5$. The remainder is always smaller than $n$, so dividing by 6 can only leave $0, 1, 2, 3, 4$ or $5$.\n\n' +
    '**Calculator method:** $47 \\div 6 = 7.83...$; keep the whole part 7; then $47 - 6 \\times 7 = 5$.\n\n' +
    'In Python, `%` is mod and `//` is whole-number (floor) division: `47 % 6` is `5` and `47 // 6` is `7`. With negative numbers Python rounds **down**, so `-17 // 5` is `-4` and `-17 % 5` is `3`.\n\n' +
    '### Congruences\n\n' +
    'We write $a \\equiv b \\pmod{n}$ ("$a$ is congruent to $b$ mod $n$") when $a$ and $b$ leave the **same remainder** when divided by $n$, which is the same as saying $n$ divides $a - b$. Example: $17 \\equiv 2 \\pmod{5}$ because $17 - 2 = 15$. Think of a clock: 15:00 is 3 o\'clock because $15 \\equiv 3 \\pmod{12}$.\n\n' +
    'The big time-saver: you may replace numbers by their remainders **before** adding, subtracting, multiplying or taking powers. If $a \\equiv 3$ and $b \\equiv 6 \\pmod{8}$, then $ab \\equiv 18 \\equiv 2 \\pmod{8}$. You **cannot** divide freely, though: to solve $3x \\equiv 4 \\pmod{7}$, test $x = 0, 1, \\ldots, 6$ (the answer is $x = 6$, since $18 \\equiv 4$).\n\n' +
    '### Last digits and cycles of powers\n\n' +
    'The last digit of a number is its remainder mod 10. Last digits of powers repeat in a **cycle**:\n\n' +
    '| Base ends in | Cycle of last digits | Length |\n' +
    '| --- | --- | --- |\n' +
    '| 2 | 2, 4, 8, 6 | 4 |\n' +
    '| 3 | 3, 9, 7, 1 | 4 |\n' +
    '| 7 | 7, 9, 3, 1 | 4 |\n' +
    '| 8 | 8, 4, 2, 6 | 4 |\n' +
    '| 4 | 4, 6 | 2 |\n' +
    '| 9 | 9, 1 | 2 |\n' +
    '| 0, 1, 5, 6 | always the same digit | 1 |\n\n' +
    'To find the last digit of $7^{2026}$: divide the exponent by the cycle length, $2026 = 4 \\times 506 + 2$. Remainder 2 means the 2nd entry, 9. **Remainder 0 means the last entry** of the cycle, not the first.\n\n' +
    'The same idea works for any divisor: since $2^3 = 8 \\equiv 1 \\pmod{7}$, we get $2^{100} = (2^3)^{33} \\times 2 \\equiv 2 \\pmod{7}$.\n\n' +
    '### Divisibility rules\n\n' +
    '| Divisible by | Test |\n' +
    '| --- | --- |\n' +
    '| 2 | last digit even |\n' +
    '| 3 | digit sum divisible by 3 |\n' +
    '| 4 | last two digits divisible by 4 |\n' +
    '| 5 | last digit 0 or 5 |\n' +
    '| 6 | divisible by 2 **and** by 3 |\n' +
    '| 8 | last three digits divisible by 8 |\n' +
    '| 9 | digit sum divisible by 9 |\n' +
    '| 10 | last digit 0 |\n' +
    '| 11 | alternating sum of digits (plus, minus, plus, minus, ...) divisible by 11 (0 counts) |\n\n' +
    '### Primes and prime factorisation\n\n' +
    'A **prime** has exactly two factors, 1 and itself: 2, 3, 5, 7, 11, 13, ... (1 is **not** prime; 2 is the only even prime). To test $n$, try dividing by the primes up to $\\sqrt{n}$. Every whole number above 1 can be written as a product of primes in exactly one way (apart from the order of the factors), e.g. $360 = 2^3 \\times 3^2 \\times 5$. Find it by dividing by the smallest prime again and again.\n\n' +
    '### HCF (GCD) and LCM\n\n' +
    'The **highest common factor** is the biggest number dividing both; the **lowest common multiple** is the smallest number both divide. From the prime factorisations: HCF takes the shared primes with the **lower** power; LCM takes every prime with the **higher** power. With $84 = 2^2 \\times 3 \\times 7$ and $126 = 2 \\times 3^2 \\times 7$: HCF $= 2 \\times 3 \\times 7 = 42$, LCM $= 2^2 \\times 3^2 \\times 7 = 252$. Always $\\text{HCF} \\times \\text{LCM} = a \\times b$.\n\n' +
    'Word clues: "largest that divides both / biggest equal groups" means HCF; "next time they happen together" means LCM.\n\n' +
    '### The Euclidean algorithm\n\n' +
    'A fast way to find the HCF without factorising: replace (bigger, smaller) by (smaller, remainder) until the remainder is 0. The last non-zero remainder is the HCF. This is exactly the loop `while b != 0: a, b = b, a % b`, after which `a` is the GCD.\n\n' +
    '### Counting divisors\n\n' +
    'If $n = p^a \\times q^b$, every divisor is $p^i \\times q^j$ with $i$ from 0 to $a$ and $j$ from 0 to $b$. So there are $(a + 1)(b + 1)$ divisors. For $72 = 2^3 \\times 3^2$: $4 \\times 3 = 12$ divisors.',
  formulas: [
    { label: 'Division with remainder', tex: 'a = n \\times q + r, \\quad 0 \\le r < n, \\quad r = a \\bmod n', note: 'Calculator: $r = a - n \\times (\\text{whole part of } a \\div n)$.' },
    { label: 'Congruence', tex: 'a \\equiv b \\pmod{n} \\iff n \\mid (a - b)', note: 'Same remainder when divided by $n$.' },
    { label: 'Arithmetic with remainders', tex: '(a + b) \\bmod n = \\big((a \\bmod n) + (b \\bmod n)\\big) \\bmod n', note: 'The same works for $-$, $\\times$ and powers, but not for division.' },
    { label: 'Reducing a power', tex: 'a^k \\equiv 1 \\pmod{n} \\implies a^{qk + r} \\equiv a^r \\pmod{n}', note: 'For last digits use the cycle length (often 4); remainder 0 means the last entry of the cycle.' },
    { label: 'HCF and LCM from primes', tex: '\\gcd = \\prod p^{\\min(\\text{powers})}, \\qquad \\operatorname{lcm} = \\prod p^{\\max(\\text{powers})}' },
    { label: 'HCF times LCM', tex: '\\gcd(a, b) \\times \\operatorname{lcm}(a, b) = a \\times b' },
    { label: 'Euclidean algorithm', tex: '\\gcd(a, b) = \\gcd(b, \\; a \\bmod b), \\qquad \\gcd(a, 0) = a' },
    { label: 'Number of divisors', tex: 'n = p^a q^b r^c \\implies \\text{number of divisors} = (a + 1)(b + 1)(c + 1)' },
    { label: 'Multiples up to N', tex: '\\text{multiples of } k \\text{ in } 1, \\ldots, N = \\left\\lfloor \\frac{N}{k} \\right\\rfloor', note: 'For "divisible by $a$ or $b$" subtract the multiples of $\\operatorname{lcm}(a, b)$.' },
  ],
  examples: [
    {
      title: 'A remainder and a congruence',
      problem: 'Find $83 \\bmod 9$, and decide whether $83 \\equiv 38 \\pmod{9}$.',
      steps: [
        'Largest multiple of 9 not above 83: $9 \\times 9 = 81$.',
        'Remainder: $83 - 81 = 2$, so $83 \\bmod 9 = 2$.',
        '$38 = 9 \\times 4 + 2$, so $38 \\bmod 9 = 2$ as well.',
        'Same remainder, so yes: $83 \\equiv 38 \\pmod{9}$. (Check: $83 - 38 = 45 = 9 \\times 5$.)',
      ],
      answer: '$83 \\bmod 9 = 2$, and $83 \\equiv 38 \\pmod{9}$ is true.',
    },
    {
      title: 'HCF and LCM with the Euclidean algorithm',
      problem: 'Find $\\gcd(252, 198)$ and $\\operatorname{lcm}(252, 198)$.',
      steps: [
        '$252 = 1 \\times 198 + 54$',
        '$198 = 3 \\times 54 + 36$',
        '$54 = 1 \\times 36 + 18$',
        '$36 = 2 \\times 18$ exactly, so the last non-zero remainder is 18: $\\gcd = 18$.',
        'LCM: $\\frac{252 \\times 198}{18} = \\frac{49896}{18} = 2772$.',
      ],
      answer: '$\\gcd(252, 198) = 18$ and $\\operatorname{lcm}(252, 198) = 2772$.',
    },
    {
      title: 'Last digit of a big power',
      problem: 'Find the last digit of $13^{403}$.',
      steps: [
        'Only the last digit of the base matters: $13^{403}$ ends like $3^{403}$.',
        'Last digits of powers of 3: $3, 9, 7, 1$, then repeat. Cycle length 4.',
        'Divide the exponent by 4: $403 = 4 \\times 100 + 3$, remainder 3.',
        'Remainder 3 means the 3rd entry of the cycle: 7.',
      ],
      answer: 'The last digit is 7.',
    },
    {
      title: 'Exam level: counting divisors',
      problem: 'How many positive divisors does $360$ have, and how many of them are odd?',
      steps: [
        'Prime factorisation: $360 = 2^3 \\times 3^2 \\times 5$.',
        'All divisors: $(3 + 1)(2 + 1)(1 + 1) = 4 \\times 3 \\times 2 = 24$.',
        'An odd divisor has power of 2 equal to 0, so only the 3 and the 5 are chosen: $(2 + 1)(1 + 1) = 6$.',
        'Check the odd ones by listing: 1, 3, 5, 9, 15, 45. That is 6.',
      ],
      answer: '360 has 24 divisors, of which 6 are odd.',
    },
  ],
  traps: [
    '**Quotient instead of remainder.** $47 \\bmod 6$ is 5 (the remainder), not 7 (how many times 6 goes in).',
    '**Remainder 0 in a cycle.** If the exponent is a multiple of the cycle length, the answer is the **last** entry of the cycle (for example $7^{2024}$ ends in 1), not the first.',
    '**Reducing the exponent by the wrong number.** For $2^{100} \\bmod 7$ reduce the exponent by the cycle length 3, not by 7.',
    '**Mixing up HCF and LCM.** The HCF is never bigger than the smaller number; the LCM is never smaller than the bigger number. The product $a \\times b$ is a common multiple but usually not the lowest.',
    '**Counting divisors.** Add 1 to every exponent before multiplying: $2^3 \\times 3^2$ has $4 \\times 3 = 12$ divisors, not $3 \\times 2 = 6$.',
    '**Negative numbers in Python.** `-17 % 5` is `3` and `-17 // 5` is `-4`, because Python rounds down. Other languages may give `-2` and `-3`.',
  ],
  examTip:
    'In a 4-option question you rarely need to do everything from scratch. **Plug the options back in**: for a congruence like $3x \\equiv 4 \\pmod{7}$, multiply each option by 3 and divide by 7. **Use size checks**: an HCF cannot exceed the smaller number, an LCM cannot be below the larger, a remainder mod $n$ must be less than $n$ and a last digit is a single digit, so options like 18 for a last digit or 54 for a remainder mod 8 are out immediately. For powers, write the cycle out (it takes 10 seconds) and divide the exponent by its length. On a calculator, find $a \\bmod n$ (for positive $a$) as $a - n \\times (\\text{whole part of } a \\div n)$. Distractors are usually built from the classic slips: the quotient instead of the remainder, the LCM instead of the HCF, the product instead of the LCM, or the cycle position off by one.',
};
