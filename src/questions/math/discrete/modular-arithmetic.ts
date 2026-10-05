import type { StaticQuestion } from '../../../types';
import { gcd, lcm } from '../../../lib/frac';
import { isPrime, mod } from '../../../lib/mathx';

/** a^n mod m by repeated multiplication (keeps numbers small). */
function powMod(a: number, n: number, m: number): number {
  let r = 1 % m;
  for (let i = 0; i < n; i++) r = (r * a) % m;
  return r;
}

/** Prime factorisation as a string like "2^3*3^2*5" (exponent 1 left out). */
function factorString(n: number): string {
  const parts: string[] = [];
  for (let p = 2; p * p <= n; p++) {
    let e = 0;
    while (n % p === 0) {
      n /= p;
      e++;
    }
    if (e) parts.push(e === 1 ? `${p}` : `${p}^${e}`);
  }
  if (n > 1) parts.push(`${n}`);
  return parts.join('*');
}

const countDivisors = (n: number): number => {
  let c = 0;
  for (let d = 1; d <= n; d++) if (n % d === 0) c++;
  return c;
};

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'modular-arithmetic-001',
    subtopic: 'modular-arithmetic',
    difficulty: 'foundation',
    stem: 'What is $47 \\bmod 6$?',
    options: ['$7$', '$5$', '$42$', '$1$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '$a \\bmod n$ means **the remainder** when $a$ is divided by $n$.\n\n' +
        '1. Find the largest multiple of 6 that is not bigger than 47: $6 \\times 7 = 42$ (the next one, $6 \\times 8 = 48$, is too big).\n' +
        '2. Subtract: $47 - 42 = 5$.\n\n' +
        'So $47 = 6 \\times 7 + 5$, and $47 \\bmod 6 = 5$.\n\n' +
        'Calculator check: $47 \\div 6 = 7.833...$; take the whole part 7, then $47 - 6 \\times 7 = 5$.',
      whyWrong: [
        'This is the **quotient** (how many times 6 goes into 47), not the remainder.',
        null,
        'This is the largest multiple of 6 below 47, $6 \\times 7 = 42$. You still need to subtract it from 47 to get the remainder.',
        'This is $48 - 47$: the distance up to the **next** multiple of 6. The remainder is measured down from the multiple **below** 47.',
      ],
      keyIdea: 'The mod operation gives the remainder: write $a = n \\times q + r$ with $0 \\le r < n$; then $a \\bmod n = r$.',
    },
    check: { optionValues: [7, 5, 42, 1], compute: () => mod(47, 6) },
  },
  {
    id: 'modular-arithmetic-002',
    subtopic: 'modular-arithmetic',
    difficulty: 'foundation',
    stem: 'What is the prime factorisation of $360$?',
    options: ['$2^2 \\times 3^2 \\times 10$', '$2^2 \\times 3^3 \\times 5$', '$2^3 \\times 3^2 \\times 5$', '$2^3 \\times 45$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Keep dividing by the smallest prime that goes in exactly:\n\n' +
        '- $360 \\div 2 = 180$\n' +
        '- $180 \\div 2 = 90$\n' +
        '- $90 \\div 2 = 45$\n' +
        '- $45 \\div 3 = 15$\n' +
        '- $15 \\div 3 = 5$\n' +
        '- $5$ is prime, stop.\n\n' +
        'We divided by 2 three times, by 3 twice and are left with 5:\n\n' +
        '$$360 = 2^3 \\times 3^2 \\times 5$$\n\n' +
        'Check: $8 \\times 9 \\times 5 = 360$.',
      whyWrong: [
        'This multiplies to 360, but 10 is not prime ($10 = 2 \\times 5$). The splitting stopped too early, so one factor of 2 is hidden inside the 10.',
        'This multiplies to $4 \\times 27 \\times 5 = 540$, not 360: the powers of 2 and 3 have been miscounted.',
        null,
        'This multiplies to 360, but 45 is not prime ($45 = 3^2 \\times 5$). A prime factorisation must use primes only.',
      ],
      keyIdea: 'A prime factorisation writes a number as a product of primes only; keep dividing by primes until the last factor is prime.',
    },
    check: {
      optionValues: ['2^2*3^2*10', '2^2*3^3*5', '2^3*3^2*5', '2^3*45'],
      compute: () => factorString(360),
    },
  },
  {
    id: 'modular-arithmetic-003',
    subtopic: 'modular-arithmetic',
    difficulty: 'foundation',
    stem: 'Which of these numbers is **prime**?',
    options: ['$51$', '$57$', '$91$', '$89$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'A prime has exactly two factors: 1 and itself. To test a number $n$, you only need to try the primes up to $\\sqrt{n}$. Here every number is below 100, so trying 2, 3, 5 and 7 is enough ($\\sqrt{100} = 10$).\n\n' +
        '- $51$: digit sum $5 + 1 = 6$ is divisible by 3, and $51 = 3 \\times 17$. Not prime.\n' +
        '- $57$: digit sum $5 + 7 = 12$ is divisible by 3, and $57 = 3 \\times 19$. Not prime.\n' +
        '- $91$: $91 = 7 \\times 13$. Not prime.\n' +
        '- $89$: it is odd, digit sum 17 (not a multiple of 3), does not end in 0 or 5, and $89 \\div 7 = 12.71...$. No prime up to $\\sqrt{89} \\approx 9.4$ divides it, so 89 is prime.',
      whyWrong: [
        '$51 = 3 \\times 17$. It looks prime because it is odd, but its digit sum 6 shows it is divisible by 3.',
        '$57 = 3 \\times 19$. Its digit sum 12 is a multiple of 3, so 3 divides it.',
        '$91 = 7 \\times 13$. It passes the tests for 2, 3 and 5, but you must also try 7.',
        null,
      ],
      keyIdea: 'To test whether $n$ is prime, try dividing by every prime up to $\\sqrt{n}$; if none divides it, $n$ is prime.',
    },
    check: { optionValues: [51, 57, 91, 89], compute: () => [51, 57, 91, 89].filter(isPrime)[0] },
  },
  {
    id: 'modular-arithmetic-004',
    subtopic: 'modular-arithmetic',
    difficulty: 'foundation',
    stem: 'Which of these numbers is divisible by $9$?',
    options: ['$5814$', '$4371$', '$3529$', '$1327$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Rule for 9:** a number is divisible by 9 exactly when the sum of its digits is divisible by 9.\n\n' +
        '| Number | Digit sum | Divisible by 9? |\n' +
        '| --- | --- | --- |\n' +
        '| 5814 | $5 + 8 + 1 + 4 = 18$ | yes |\n' +
        '| 4371 | $4 + 3 + 7 + 1 = 15$ | no |\n' +
        '| 3529 | $3 + 5 + 2 + 9 = 19$ | no |\n' +
        '| 1327 | $1 + 3 + 2 + 7 = 13$ | no |\n\n' +
        'Check: $5814 \\div 9 = 646$ exactly.',
      whyWrong: [
        null,
        'Its digit sum is 15, which is divisible by 3 but not by 9. This is the rule for 3, not for 9: $4371 = 3 \\times 1457$, but $4371 \\div 9$ is not whole.',
        'It ends in the digit 9, but the last digit does not decide divisibility by 9; its digit sum is 19, not a multiple of 9.',
        'Its last two digits, 27, are a multiple of 9, but "look at the last two digits" is the rule for 4, not for 9. Its digit sum is 13.',
      ],
      keyIdea: 'A number is divisible by 9 (or by 3) exactly when its digit sum is divisible by 9 (or by 3).',
    },
    check: { optionValues: [5814, 4371, 3529, 1327], compute: () => [5814, 4371, 3529, 1327].filter((n) => n % 9 === 0)[0] },
  },
  {
    id: 'modular-arithmetic-005',
    subtopic: 'modular-arithmetic',
    difficulty: 'foundation',
    stem: 'What is the highest common factor (HCF, also called GCD) of $84$ and $126$?',
    options: ['$252$', '$21$', '$42$', '$6$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Write both numbers as products of primes:\n\n' +
        '- $84 = 2^2 \\times 3 \\times 7$\n' +
        '- $126 = 2 \\times 3^2 \\times 7$\n\n' +
        'For the HCF take each prime that appears in **both**, with the **lower** power:\n\n' +
        '- 2: lower power is $2$ (from 126)\n' +
        '- 3: lower power is $3$ (from 84)\n' +
        '- 7: appears once in each, so $7$\n\n' +
        '$$\\gcd(84, 126) = 2 \\times 3 \\times 7 = 42$$\n\n' +
        'Check: $84 = 42 \\times 2$ and $126 = 42 \\times 3$, and 2 and 3 have no common factor, so nothing bigger works.',
      whyWrong: [
        'This is the **lowest common multiple**, $2^2 \\times 3^2 \\times 7 = 252$, which uses the higher powers. The HCF must divide both numbers, so it cannot be bigger than 84.',
        '21 is a common factor ($84 = 21 \\times 4$, $126 = 21 \\times 6$), but not the highest: the shared factor 2 has been left out.',
        null,
        '6 is a common factor, but it only uses the shared primes 2 and 3 and misses the shared prime 7.',
      ],
      keyIdea: 'HCF = product of the shared primes with the LOWER power; LCM = product of all primes with the HIGHER power.',
    },
    check: { optionValues: [252, 21, 42, 6], compute: () => gcd(84, 126) },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'modular-arithmetic-006',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'What is the last digit of $7^{2026}$?',
    options: ['$7$', '$9$', '$3$', '$1$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The last digit of a power only depends on the last digit of the previous power, so the last digits repeat in a cycle.\n\n' +
        '| Power of 7 | 1st | 2nd | 3rd | 4th | 5th |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| Value | 7 | 49 | 343 | 2401 | 16807 |\n' +
        '| Last digit | 7 | 9 | 3 | 1 | 7 |\n\n' +
        'The cycle is $7, 9, 3, 1$ and has length 4.\n\n' +
        'Divide the exponent by the cycle length: $2026 = 4 \\times 506 + 2$, remainder 2.\n\n' +
        'Remainder 2 means the **2nd** entry of the cycle, which is 9. (Remainder 0 would mean the 4th entry.)\n\n' +
        'So $7^{2026}$ ends in 9.',
      whyWrong: [
        'This uses the remainder of $2026 \\div 3$ (which is 1), as if the cycle had length 3. The cycle $7, 9, 3, 1$ has length 4.',
        null,
        'This is one place too far along the cycle: remainder 2 points to the 2nd entry (9), not the 3rd.',
        'This assumes the remainder is 0 (the end of the cycle), perhaps because 2026 is even. But 2026 is not a multiple of 4: $2026 = 2024 + 2$.',
      ],
      keyIdea: 'Last digits of powers repeat in a cycle: find the cycle, then use the remainder of the exponent divided by the cycle length.',
    },
    check: { optionValues: [7, 9, 3, 1], compute: () => powMod(7, 2026, 10) },
  },
  {
    id: 'modular-arithmetic-007',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'What is the remainder when $2^{100}$ is divided by $7$?',
    options: ['$4$', '$1$', '$6$', '$2$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Find a power of 2 that leaves remainder 1 when divided by 7:\n\n' +
        '- $2 \\equiv 2 \\pmod{7}$\n' +
        '- $2^2 = 4 \\equiv 4 \\pmod{7}$\n' +
        '- $2^3 = 8 \\equiv 1 \\pmod{7}$\n\n' +
        'Since $2^3 \\equiv 1$, the remainders repeat every 3 powers.\n\n' +
        'Write the exponent as a multiple of 3 plus a leftover: $100 = 3 \\times 33 + 1$.\n\n' +
        '$$2^{100} = \\left(2^3\\right)^{33} \\times 2 \\equiv 1^{33} \\times 2 = 2 \\pmod{7}$$\n\n' +
        'The remainder is 2.',
      whyWrong: [
        'This reduces the exponent by 7 (the divisor) instead of by 3 (the cycle length): $100 \\bmod 7 = 2$, giving $2^2 = 4$. The exponent must be reduced by the length of the cycle of remainders.',
        'This spots that $2^3 \\equiv 1$ but treats 100 as a multiple of 3. Only 99 is: $2^{100} = 2^{99} \\times 2$, so the leftover factor 2 is forgotten.',
        'This is the last digit of $2^{100}$ (its remainder when divided by **10**), found from the cycle $2, 4, 8, 6$. The question divides by 7.',
        null,
      ],
      keyIdea: 'If $a^k \\equiv 1 \\pmod{m}$, reduce the exponent modulo $k$: $a^{qk + r} \\equiv a^r \\pmod{m}$.',
    },
    check: { optionValues: [4, 1, 6, 2], compute: () => powMod(2, 100, 7) },
  },
  {
    id: 'modular-arithmetic-008',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'Which integer $x$ with $0 \\le x \\le 6$ satisfies $3x \\equiv 4 \\pmod{7}$?',
    options: ['$x = 6$', '$x = 5$', '$x = 1$', '$x = 4$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '$3x \\equiv 4 \\pmod{7}$ means $3x$ leaves remainder 4 when divided by 7. You **cannot** simply divide by 3, so test the values (there are only 7):\n\n' +
        '| $x$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $3x$ | 0 | 3 | 6 | 9 | 12 | 15 | 18 |\n' +
        '| $3x \\bmod 7$ | 0 | 3 | 6 | 2 | 5 | 1 | 4 |\n\n' +
        'Only $x = 6$ works: $3 \\times 6 = 18 = 2 \\times 7 + 4$.\n\n' +
        'Faster in an exam: plug each option into $3x$ and divide by 7.',
      whyWrong: [
        null,
        'This multiplies 4 by 3 ($12 \\equiv 5$) instead of undoing the multiplication. Check: $3 \\times 5 = 15 \\equiv 1 \\pmod{7}$, not 4.',
        'This subtracts 3 from 4 as if the equation were $x + 3 \\equiv 4$. Check: $3 \\times 1 = 3$, not 4 (mod 7).',
        'This ignores the coefficient 3 altogether. Check: $3 \\times 4 = 12 \\equiv 5 \\pmod{7}$, not 4.',
      ],
      keyIdea: 'To solve $ax \\equiv b \\pmod{m}$ with a small modulus, test each value (or each option); you cannot divide as in ordinary algebra.',
    },
    check: {
      optionValues: [6, 5, 1, 4],
      compute: () => {
        const sols = [0, 1, 2, 3, 4, 5, 6].filter((x) => (3 * x) % 7 === 4);
        return sols.length === 1 ? sols[0] : -1;
      },
    },
  },
  {
    id: 'modular-arithmetic-009',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'When the whole number $a$ is divided by 8 the remainder is 3, and when $b$ is divided by 8 the remainder is 6. What is the remainder when $a^2 b$ is divided by 8?',
    options: ['$54$', '$2$', '$6$', '$4$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'We know $a \\equiv 3 \\pmod{8}$ and $b \\equiv 6 \\pmod{8}$. In modular arithmetic you may replace each number by its remainder before multiplying.\n\n' +
        '1. $a^2 \\equiv 3^2 = 9 \\equiv 1 \\pmod{8}$\n' +
        '2. $a^2 b \\equiv 1 \\times 6 = 6 \\pmod{8}$\n\n' +
        'Check with real numbers: $a = 11$, $b = 14$ gives $a^2 b = 121 \\times 14 = 1694 = 8 \\times 211 + 6$. Remainder 6.',
      whyWrong: [
        'This is $3^2 \\times 6 = 54$ without reducing. A remainder when dividing by 8 must be between 0 and 7: $54 = 6 \\times 8 + 6$.',
        'This is the remainder of $ab$ ($3 \\times 6 = 18 \\equiv 2$): the square on $a$ has been forgotten.',
        null,
        'This doubles $a$ instead of squaring it: $2 \\times 3 \\times 6 = 36 \\equiv 4 \\pmod{8}$.',
      ],
      keyIdea: 'You can replace numbers by their remainders before adding, subtracting, multiplying or raising to powers, then reduce at the end.',
    },
    check: {
      optionValues: [54, 2, 6, 4],
      compute: () => {
        // try several real pairs with the given remainders; they must all agree
        const results = new Set<number>();
        for (const a of [3, 11, 19, 27]) for (const b of [6, 14, 22]) results.add((a * a * b) % 8);
        return results.size === 1 ? [...results][0] : -1;
      },
    },
  },
  {
    id: 'modular-arithmetic-010',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'The Euclidean algorithm is used to find $\\gcd(252, 198)$. What is the result?',
    options: ['$36$', '$54$', '$18$', '$9$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The Euclidean algorithm repeatedly replaces the pair (bigger, smaller) by (smaller, remainder) until the remainder is 0. The **last non-zero remainder** is the GCD.\n\n' +
        '1. $252 = 1 \\times 198 + 54$\n' +
        '2. $198 = 3 \\times 54 + 36$\n' +
        '3. $54 = 1 \\times 36 + 18$\n' +
        '4. $36 = 2 \\times 18$ exactly (remainder 0), stop.\n\n' +
        'The last non-zero remainder is 18, so $\\gcd(252, 198) = 18$.\n\n' +
        'Check with primes: $252 = 2^2 \\times 3^2 \\times 7$ and $198 = 2 \\times 3^2 \\times 11$, so the GCD is $2 \\times 3^2 = 18$.',
      whyWrong: [
        'This stops one step too early and takes the remainder from step 2. The algorithm continues until a remainder of 0 appears.',
        'This is only the first remainder, $252 - 198 = 54$. 54 does not divide 198 ($198 \\div 54 = 3.67$), so it cannot be the GCD.',
        null,
        '9 is a common factor ($3^2$), but the shared factor 2 has been forgotten; 18 also divides both numbers.',
      ],
      keyIdea: 'Euclid: $\\gcd(a, b) = \\gcd(b, a \\bmod b)$; repeat until the remainder is 0, and the last non-zero remainder is the GCD.',
    },
    check: {
      optionValues: [36, 54, 18, 9],
      compute: () => {
        let a = 252;
        let b = 198;
        while (b !== 0) [a, b] = [b, a % b];
        return a;
      },
    },
  },
  {
    id: 'modular-arithmetic-011',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'Bus A leaves the station every 12 minutes and bus B leaves every 18 minutes. Both buses leave together at 08:00. At what time do they next leave together?',
    options: ['08:30', '08:36', '08:06', '11:36'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The buses leave together after a number of minutes that is a multiple of both 12 and 18. The **first** such time is the lowest common multiple.\n\n' +
        '- $12 = 2^2 \\times 3$\n' +
        '- $18 = 2 \\times 3^2$\n\n' +
        'LCM: every prime with its **higher** power: $2^2 \\times 3^2 = 36$.\n\n' +
        '(Listing also works: multiples of 18 are 18, 36, ...; 36 is the first that 12 divides.)\n\n' +
        '36 minutes after 08:00 is **08:36**.',
      whyWrong: [
        'This adds the intervals, $12 + 18 = 30$ minutes. At 30 minutes bus A has not left (30 is not a multiple of 12).',
        null,
        'This uses the HCF, $\\gcd(12, 18) = 6$ minutes. At 08:06 neither bus leaves; you need a common **multiple**, not a common factor.',
        'This uses the product $12 \\times 18 = 216$ minutes (3 hours 36 minutes). They do meet then, but they already met earlier at 36 minutes.',
      ],
      keyIdea: '"When do they next coincide?" is a lowest common multiple (LCM) question.',
    },
    check: { optionValues: [30, 36, 6, 216], compute: () => lcm(12, 18) },
  },
  {
    id: 'modular-arithmetic-012',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'How many positive divisors (factors) does $72$ have, including 1 and 72?',
    options: ['$6$', '$5$', '$7$', '$12$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. Prime factorisation: $72 = 8 \\times 9 = 2^3 \\times 3^2$.\n' +
        '2. A divisor of 72 has the form $2^a \\times 3^b$ with $a \\in \\{0, 1, 2, 3\\}$ (4 choices) and $b \\in \\{0, 1, 2\\}$ (3 choices).\n' +
        '3. Number of divisors $= (3 + 1)(2 + 1) = 4 \\times 3 = 12$.\n\n' +
        'Check by listing pairs: $1 \\times 72$, $2 \\times 36$, $3 \\times 24$, $4 \\times 18$, $6 \\times 12$, $8 \\times 9$: 6 pairs, so 12 divisors.',
      whyWrong: [
        'This multiplies the exponents, $3 \\times 2 = 6$, forgetting that each exponent can also be 0. (6 is also the number of factor **pairs**, but each pair contains two divisors.)',
        'This adds the exponents, $3 + 2 = 5$. The choices for each prime must be multiplied, and each exponent can also be 0.',
        'This adds the choices, $(3 + 1) + (2 + 1) = 7$. The choices for the two primes are independent, so they must be **multiplied**.',
        null,
      ],
      keyIdea: 'If $n = p^a q^b \\cdots$, the number of positive divisors is $(a + 1)(b + 1) \\cdots$.',
    },
    check: { optionValues: [6, 5, 7, 12], compute: () => countDivisors(72) },
  },
  {
    id: 'modular-arithmetic-013',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print(-17 % 5, -17 // 5)' },
    options: ['`3 -4`', '`-2 -3`', '`3 -3`', '`-2 -4`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'In Python, `//` is **floor division**: it rounds **down** (towards minus infinity), and `%` gives the matching remainder, which always has the same sign as the divisor (here positive).\n\n' +
        '1. $-17 \\div 5 = -3.4$. Rounding **down** gives $-4$, so `-17 // 5` is `-4`.\n' +
        '2. The remainder satisfies $-17 = 5 \\times (-4) + r$, so $r = -17 + 20 = 3$. So `-17 % 5` is `3`.\n\n' +
        'Check: $5 \\times (-4) + 3 = -17$. The output is `3 -4`.',
      whyWrong: [
        null,
        'This is how languages such as C and Java behave: they round $-3.4$ towards zero (to $-3$) and give a negative remainder. Python rounds down instead.',
        'This mixes the two rules: the remainder 3 is right, but $-3.4$ rounded **down** is $-4$, not $-3$. Check: $5 \\times (-3) + 3 = -12$, not $-17$.',
        'The quotient $-4$ is right, but then the remainder must satisfy $5 \\times (-4) + r = -17$, giving $r = 3$, not $-2$.',
      ],
      keyIdea: 'In Python, `a // b` rounds down and `a % b` has the sign of `b`, so `a == b * (a // b) + a % b` always holds.',
    },
    python: { stdout: '3 -4\n' },
  },
  {
    id: 'modular-arithmetic-014',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'The five-digit number $47\\square28$ is divisible by $11$. Which digit goes in the box?',
    options: ['$1$', '$3$', '$8$', '$2$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Rule for 11:** alternately add and subtract the digits (starting $+$ at the left). The number is divisible by 11 exactly when this alternating sum is a multiple of 11 (0, 11, $-11$, ...).\n\n' +
        'Call the missing digit $d$. The digits are $4, 7, d, 2, 8$:\n\n' +
        '$$4 - 7 + d - 2 + 8 = d + 3$$\n\n' +
        'We need $d + 3$ to be a multiple of 11 with $0 \\le d \\le 9$, so $d + 3 = 11$ and $d = 8$.\n\n' +
        'Check: $47828 \\div 11 = 4348$ exactly.',
      whyWrong: [
        'This makes the ordinary digit sum $4 + 7 + 1 + 2 + 8 = 22$ a multiple of 11. Adding all the digits is the rule for 3 and 9; for 11 the signs must alternate. Indeed $47128 \\div 11$ is not whole.',
        'This makes a sign slip, getting $d - 3$ instead of $d + 3$ (then $3 - 3 = 0$). Recalculate carefully: $4 - 7 - 2 + 8 = 3$.',
        null,
        'This subtracts the last digit as well, $4 - 7 + d - 2 - 8 = d - 13$, which is $-11$ when $d = 2$. The signs must keep alternating: $+, -, +, -, +$.',
      ],
      keyIdea: 'Divisible by 11 means the alternating digit sum (plus, minus, plus, minus, ...) is a multiple of 11.',
    },
    check: {
      optionValues: [1, 3, 8, 2],
      compute: () => {
        const ds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => (47028 + 100 * d) % 11 === 0);
        return ds.length === 1 ? ds[0] : -1;
      },
    },
  },
  {
    id: 'modular-arithmetic-015',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'Two positive integers have HCF $6$ and LCM $180$. One of the numbers is $36$. What is the other number?',
    options: ['$5$', '$30$', '$144$', '$216$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'For any two positive integers, $\\text{HCF} \\times \\text{LCM} = $ the product of the two numbers.\n\n' +
        '$$6 \\times 180 = 36 \\times n$$\n\n' +
        '$$1080 = 36n \\quad \\Rightarrow \\quad n = \\frac{1080}{36} = 30$$\n\n' +
        'Check: $36 = 2^2 \\times 3^2$ and $30 = 2 \\times 3 \\times 5$. HCF $= 2 \\times 3 = 6$ and LCM $= 2^2 \\times 3^2 \\times 5 = 180$. Both match.',
      whyWrong: [
        'This is $180 \\div 36 = 5$, which leaves out the HCF. Also, the HCF 6 must divide both numbers, and 6 does not divide 5.',
        null,
        'This is $180 - 36$. HCF and LCM combine by multiplication, not subtraction. Check: 144 is a multiple of 36, so $\\gcd(36, 144) = 36$, not 6.',
        'This is $36 \\times 6$. The rule is HCF $\\times$ LCM $=$ product of the numbers, so you divide $6 \\times 180$ by 36.',
      ],
      keyIdea: 'For two positive integers $a$ and $b$: $\\gcd(a, b) \\times \\operatorname{lcm}(a, b) = a \\times b$.',
    },
    check: {
      optionValues: [5, 30, 144, 216],
      compute: () => {
        const found = [];
        for (let n = 1; n <= 1000; n++) if (gcd(36, n) === 6 && lcm(36, n) === 180) found.push(n);
        return found.length === 1 ? found[0] : -1;
      },
    },
  },
  {
    id: 'modular-arithmetic-016',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'What is printed by this pseudocode?',
    code: {
      lang: 'pseudocode',
      source: 'a = 1071\nb = 462\nwhile b != 0:\n    r = a mod b\n    a = b\n    b = r\nprint(a)',
    },
    options: ['$0$', '$147$', '$3$', '$21$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'This is the Euclidean algorithm. Trace each pass of the loop (the condition is checked before each pass):\n\n' +
        '| Pass | $a$ before | $b$ before | $r = a \\bmod b$ | $a$ after | $b$ after |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| 1 | 1071 | 462 | 147 | 462 | 147 |\n' +
        '| 2 | 462 | 147 | 21 | 147 | 21 |\n' +
        '| 3 | 147 | 21 | 0 | 21 | 0 |\n\n' +
        'Working: $1071 = 2 \\times 462 + 147$, $462 = 3 \\times 147 + 21$, $147 = 7 \\times 21$ exactly.\n\n' +
        'Now $b = 0$, so the loop stops and `print(a)` prints **21**, which is $\\gcd(1071, 462)$.',
      whyWrong: [
        'This is the final value of `b` (and of `r`). The loop stops when `b` becomes 0, but the program prints `a`.',
        'This is the remainder after the first pass. The loop keeps going while `b` is not 0, so there are two more passes.',
        'This is the number of passes of the loop, not the value printed.',
        null,
      ],
      keyIdea: 'In the Euclidean algorithm loop, `a` holds the GCD when `b` reaches 0.',
    },
    check: {
      optionValues: [0, 147, 3, 21],
      compute: () => {
        let a = 1071;
        let b = 462;
        while (b !== 0) {
          const r = a % b;
          a = b;
          b = r;
        }
        return a;
      },
    },
  },

  // ---------------------------------------------------------------- challenge
  {
    id: 'modular-arithmetic-017',
    subtopic: 'modular-arithmetic',
    difficulty: 'challenge',
    stem: 'What is the remainder when $1! + 2! + 3! + \\cdots + 100!$ is divided by $7$?',
    options: ['$0$', '$6$', '$2$', '$5$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'From $7!$ onwards every factorial contains the factor 7 ($7! = 1 \\times 2 \\times \\cdots \\times 7$), so $7!, 8!, \\ldots, 100!$ all leave remainder 0. Only $1!$ to $6!$ matter.\n\n' +
        '| $n$ | 1 | 2 | 3 | 4 | 5 | 6 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $n!$ | 1 | 2 | 6 | 24 | 120 | 720 |\n\n' +
        '$$1 + 2 + 6 + 24 + 120 + 720 = 873$$\n\n' +
        '$873 = 7 \\times 124 + 5$, so the remainder is 5.\n\n' +
        '(Or reduce as you go: $24 \\equiv 3$, $120 \\equiv 1$, $720 \\equiv 6$, and $1 + 2 + 6 + 3 + 1 + 6 = 19 \\equiv 5 \\pmod{7}$.)',
      whyWrong: [
        'This assumes every term is a multiple of 7. Only the terms from $7!$ onwards are; $1!$ to $6!$ do not contain the factor 7.',
        'This stops after $5!$ ($153 \\equiv 6$), as if $6!$ were already a multiple of 7. $6! = 720$ contains no factor 7 ($720 = 7 \\times 102 + 6$).',
        'This stops after $3!$ ($9 \\equiv 2$), as if $4!$ onwards were multiples of 7. That shortcut works for dividing by 12 or 24, not by 7.',
        null,
      ],
      keyIdea: 'Every $n!$ with $n \\ge p$ is divisible by $p$, so only the first few factorials affect the remainder.',
    },
    check: {
      optionValues: [0, 6, 2, 5],
      compute: () => {
        let total = 0;
        let f = 1;
        for (let n = 1; n <= 100; n++) {
          f = (f * n) % 7;
          total = (total + f) % 7;
        }
        return total;
      },
    },
  },
  {
    id: 'modular-arithmetic-018',
    subtopic: 'modular-arithmetic',
    difficulty: 'challenge',
    stem: 'What is the last digit of $3^{2026} + 7^{2026}$?',
    options: ['$8$', '$0$', '$2$', '$18$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Find each last digit separately, then add and keep only the last digit.\n\n' +
        '| Power | 1st | 2nd | 3rd | 4th |\n' +
        '| --- | --- | --- | --- | --- |\n' +
        '| Last digit of $3^n$ | 3 | 9 | 7 | 1 |\n' +
        '| Last digit of $7^n$ | 7 | 9 | 3 | 1 |\n\n' +
        'Both cycles have length 4. $2026 = 4 \\times 506 + 2$, remainder 2, so take the 2nd entry of each cycle:\n\n' +
        '- $3^{2026}$ ends in 9\n' +
        '- $7^{2026}$ ends in 9\n\n' +
        '$9 + 9 = 18$, so the sum ends in **8**.',
      whyWrong: [
        null,
        'This adds the bases first, as if $3^{n} + 7^{n} = 10^{n}$. Powers do not add like that: $3^2 + 7^2 = 58$, not $100$.',
        'This treats 2026 as a multiple of 4 (using the 4th entries, $1 + 1$). But $2026 = 2024 + 2$ leaves remainder 2.',
        'This is $9 + 9$ without reducing. A last digit must be a single digit 0 to 9; 18 ends in 8.',
      ],
      keyIdea: 'To find the last digit of a sum, find the last digit of each term (using cycles), add them, and take the last digit again.',
    },
    check: { optionValues: [8, 0, 2, 18], compute: () => (powMod(3, 2026, 10) + powMod(7, 2026, 10)) % 10 },
  },
  {
    id: 'modular-arithmetic-019',
    subtopic: 'modular-arithmetic',
    difficulty: 'challenge',
    stem: 'What is the **smallest** positive integer that leaves remainder 1 when divided by each of $2, 3, 4, 5$ and $6$, and is also divisible by $7$?',
    options: ['$61$', '$421$', '$301$', '$721$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. "Remainder 1 when divided by 2, 3, 4, 5 and 6" means $N - 1$ is divisible by all of them, so $N - 1$ is a multiple of their LCM.\n' +
        '2. $\\operatorname{lcm}(2, 3, 4, 5, 6) = 2^2 \\times 3 \\times 5 = 60$. So $N = 60k + 1$: 61, 121, 181, 241, 301, ...\n' +
        '3. Test each for divisibility by 7:\n\n' +
        '| $N$ | 61 | 121 | 181 | 241 | 301 |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| $N \\bmod 7$ | 5 | 2 | 6 | 3 | 0 |\n\n' +
        'The first one divisible by 7 is $301 = 7 \\times 43$.',
      whyWrong: [
        '61 leaves remainder 1 when divided by 2, 3, 4, 5 and 6, but it ignores the last condition: $61 = 7 \\times 8 + 5$ is not divisible by 7.',
        'This is $60 \\times 7 + 1$, multiplying the LCM by 7. But $421 = 7 \\times 60 + 1$ leaves remainder 1 when divided by 7, so it is not divisible by 7.',
        null,
        'This uses the product $2 \\times 3 \\times 4 \\times 5 \\times 6 = 720$ instead of the LCM 60. $721 = 7 \\times 103$ does satisfy every condition, but it is not the smallest.',
      ],
      keyIdea: 'Same remainder for several divisors means $N - r$ is a multiple of their LCM; then search the list $\\operatorname{lcm} \\times k + r$.',
    },
    check: {
      optionValues: [61, 421, 301, 721],
      compute: () => {
        for (let n = 1; ; n++) if ([2, 3, 4, 5, 6].every((d) => n % d === 1) && n % 7 === 0) return n;
      },
    },
  },
  {
    id: 'modular-arithmetic-020',
    subtopic: 'modular-arithmetic',
    difficulty: 'challenge',
    stem: 'How many zeros are there at the end of $100!$ (when it is written out in full)?',
    options: ['$20$', '$24$', '$10$', '$11$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Each zero at the end comes from a factor $10 = 2 \\times 5$. There are far more factors of 2 than of 5 in $100!$, so count the factors of 5.\n\n' +
        '1. Multiples of 5 up to 100: $\\left\\lfloor \\frac{100}{5} \\right\\rfloor = 20$, each giving at least one 5.\n' +
        '2. Multiples of $25 = 5^2$ (25, 50, 75, 100) contain a **second** 5: $\\left\\lfloor \\frac{100}{25} \\right\\rfloor = 4$ more.\n' +
        '3. Multiples of $125$: none below 100.\n\n' +
        'Total factors of 5: $20 + 4 = 24$, so $100!$ ends in **24** zeros.',
      whyWrong: [
        'This counts only the multiples of 5. Numbers like 25, 50, 75 and 100 contain $5^2$, so each gives two factors of 5.',
        null,
        'This only counts the multiples of 10. A zero is also made by a 5 from an odd multiple of 5 (like 15) paired with any spare 2.',
        'This counts the multiples of 10, plus one extra zero for 100. It still misses all the odd multiples of 5 and the extra 5s in 25, 50 and 75.',
      ],
      keyIdea: 'Trailing zeros of $n!$ = number of factors of 5 = $\\left\\lfloor \\frac{n}{5} \\right\\rfloor + \\left\\lfloor \\frac{n}{25} \\right\\rfloor + \\cdots$.',
    },
    check: {
      optionValues: [20, 24, 10, 11],
      compute: () => {
        let twos = 0;
        let fives = 0;
        for (let k = 1; k <= 100; k++) {
          let x = k;
          while (x % 2 === 0) {
            x /= 2;
            twos++;
          }
          while (x % 5 === 0) {
            x /= 5;
            fives++;
          }
        }
        return Math.min(twos, fives);
      },
    },
  },
  {
    id: 'modular-arithmetic-021',
    subtopic: 'modular-arithmetic',
    difficulty: 'challenge',
    stem: 'How many integers from 1 to 200 inclusive are divisible by $4$ or by $6$ (or both)?',
    options: ['$83$', '$75$', '$67$', '$51$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Count each set, then remove the double count (inclusion-exclusion).\n\n' +
        '1. Divisible by 4: $\\left\\lfloor \\frac{200}{4} \\right\\rfloor = 50$.\n' +
        '2. Divisible by 6: $\\left\\lfloor \\frac{200}{6} \\right\\rfloor = 33$ (since $6 \\times 33 = 198$).\n' +
        '3. Divisible by both 4 and 6 means divisible by $\\operatorname{lcm}(4, 6) = 12$: $\\left\\lfloor \\frac{200}{12} \\right\\rfloor = 16$ (since $12 \\times 16 = 192$).\n\n' +
        'These 16 numbers were counted twice, so\n\n' +
        '$$50 + 33 - 16 = 67$$',
      whyWrong: [
        'This is $50 + 33$ without removing the numbers divisible by both (like 12, 24, 36), which have been counted twice.',
        'This uses $4 \\times 6 = 24$ for "both": $50 + 33 - 8 = 75$. Numbers like 12 and 36 are divisible by 4 and 6 but not by 24; "both" means divisible by the LCM, 12.',
        null,
        'This subtracts the overlap twice: $83 - 2 \\times 16 = 51$. That counts numbers divisible by **exactly one** of 4 and 6, but the question includes "or both".',
      ],
      keyIdea: 'Count multiples of $a$ or $b$ as $\\lfloor n/a \\rfloor + \\lfloor n/b \\rfloor - \\lfloor n/\\operatorname{lcm}(a, b) \\rfloor$.',
    },
    check: {
      optionValues: [83, 75, 67, 51],
      compute: () => {
        let c = 0;
        for (let k = 1; k <= 200; k++) if (k % 4 === 0 || k % 6 === 0) c++;
        return c;
      },
    },
  },
];
