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
      asking: 'What is left over after dividing 47 by 6?',
      solution:
        '$\\bmod$ (short for modulo) gives the **remainder**: what is left over after dividing. For example, $14 \\bmod 4$ is 2, because $14 = 3 \\times 4 + 2$.\n\n' +
        'Find the biggest multiple of 6 that fits in 47. $6 \\times 7 = 42$ fits, and $6 \\times 8 = 48$ is too big.\n\n' +
        'Subtract to find what is left: $47 - 42 = 5$.',
      conclusion: '47 is $6 \\times 7$ with 5 left over, so the remainder is $5$.',
      whyWrong: [
        'This is the **quotient** (how many times 6 goes into 47), not the remainder.',
        null,
        'This is the largest multiple of 6 below 47, $6 \\times 7 = 42$. You still need to subtract it from 47 to get the remainder.',
        'This is $48 - 47$: the distance up to the **next** multiple of 6. The remainder is measured down from the multiple **below** 47.',
      ],
      keyIdea: 'For $a \\bmod n$: find the largest multiple of $n$ not above $a$, then subtract it from $a$. The result is always from 0 to $n - 1$.',
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
      asking: 'Which product of prime numbers equals 360?',
      solution:
        'A **prime** is a whole number above 1 whose only factors are 1 and itself. A **prime factorisation** writes a number as a product of primes only.\n\n' +
        'Keep dividing by the smallest prime that works:\n\n| Number | Divide by | Result |\n|---|---|---|\n| 360 | 2 | 180 |\n| 180 | 2 | 90 |\n| 90 | 2 | 45 |\n| 45 | 3 | 15 |\n| 15 | 3 | 5 |\n| 5 | 5 | 1 |\n\n' +
        'Count the primes used: 2 three times, 3 twice and 5 once. Write the repeats as powers: $2 \\times 2 \\times 2 = 2^3$ and $3 \\times 3 = 3^2$.',
      conclusion: 'Check: $8 \\times 9 \\times 5 = 360$, and only primes were used, so the answer is $2^3 \\times 3^2 \\times 5$.',
      whyWrong: [
        'This multiplies to 360, but 10 is not prime ($10 = 2 \\times 5$). The splitting stopped too early, so one factor of 2 is hidden inside the 10.',
        'This multiplies to $4 \\times 27 \\times 5 = 540$, not 360: the powers of 2 and 3 have been miscounted.',
        null,
        'This multiplies to 360, but 45 is not prime ($45 = 3^2 \\times 5$). A prime factorisation must use primes only.',
      ],
      keyIdea: 'Divide by the smallest prime that goes in (2, then 3, then 5, and so on) until you reach 1. An option containing a non-prime such as 10 or 45 can be ruled out straight away.',
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
      asking: 'Which number can only be divided exactly by 1 and itself?',
      solution:
        'A **prime** has exactly two factors: 1 and itself. To test a number, try dividing it by primes. All these numbers are below 100 and $10 \\times 10 = 100$, so any factor pair must include a number below 10. That means only 2, 3, 5 and 7 need testing.\n\n' +
        'Three of the numbers break down:\n\n| Number | Factors found | Prime? |\n|---|---|---|\n| 51 | $3 \\times 17 = 51$ | No |\n| 57 | $3 \\times 19 = 57$ | No |\n| 91 | $7 \\times 13 = 91$ | No |\n\n' +
        'Test 89. It is odd, so 2 fails. Its digits add to 17, not a multiple of 3, so 3 fails. It doesn\'t end in 0 or 5, so 5 fails. $7 \\times 12 = 84$ leaves 5, so 7 fails.',
      conclusion: 'No prime up to 7 divides it exactly, so the prime is $89$.',
      whyWrong: [
        '$51 = 3 \\times 17$. It looks prime because it is odd, but its digit sum 6 shows it is divisible by 3.',
        '$57 = 3 \\times 19$. Its digit sum 12 is a multiple of 3, so 3 divides it.',
        '$91 = 7 \\times 13$. It passes the tests for 2, 3 and 5, but you must also try 7.',
        null,
      ],
      keyIdea: 'To test a number below 100, try 2, 3, 5 and 7. If none divides it exactly, it is prime. Watch out for 51, 57 and 91, which look prime but aren\'t.',
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
      asking: 'Which number divides exactly by 9?',
      solution:
        'Use the **digit-sum test**: add up a number\'s digits. The number is divisible by 9 exactly when that total is divisible by 9.\n\n' +
        'Add the digits of each number:\n\n| Number | Digit sum | Divisible by 9? |\n|---|---|---|\n| 4371 | $4 + 3 + 7 + 1 = 15$ | No |\n| 3529 | $3 + 5 + 2 + 9 = 19$ | No |\n| 1327 | $1 + 3 + 2 + 7 = 13$ | No |\n| 5814 | $5 + 8 + 1 + 4 = 18$ | Yes |',
      conclusion: 'Only one digit sum is a multiple of 9, and $9 \\times 646 = 5814$ confirms it, so the answer is $5814$.',
      whyWrong: [
        null,
        'Its digit sum is 15, which is divisible by 3 but not by 9. This is the rule for 3, not for 9: $4371 = 3 \\times 1457$, but $4371 \\div 9$ is not whole.',
        'It ends in the digit 9, but the last digit does not decide divisibility by 9; its digit sum is 19, not a multiple of 9.',
        'Its last two digits, 27, are a multiple of 9, but "look at the last two digits" is the rule for 4, not for 9. Its digit sum is 13.',
      ],
      keyIdea: 'For divisibility by 9, add the digits and test that total for 9. The same idea works for 3. Don\'t look at the last digit, which only works for 2, 5 and 10.',
    },
    check: { optionValues: [5814, 4371, 3529, 1327], compute: () => [5814, 4371, 3529, 1327].filter((n) => n % 9 === 0)[0] },
  },
  {
    id: 'modular-arithmetic-005',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'What is the highest common factor (HCF, also called GCD) of $84$ and $126$?',
    options: ['$252$', '$21$', '$42$', '$6$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the biggest number that divides both 84 and 126 exactly?',
      solution:
        'The **HCF** is the biggest factor two numbers share. A reliable way to find it is to write each number as a product of primes (numbers divisible only by 1 and themselves).\n\n' +
        'Break both numbers down: $84 = 2 \\times 2 \\times 3 \\times 7$ and $126 = 2 \\times 3 \\times 3 \\times 7$.\n\n' +
        'Pick out what appears in both lists. Both have one 2, one 3 and one 7. The second 2 of 84 has no partner, and neither does the second 3 of 126.\n\n' +
        'Multiply the shared primes: $2 \\times 3 \\times 7 = 42$.',
      conclusion: '$84 = 42 \\times 2$ and $126 = 42 \\times 3$, and 2 and 3 share no further factor, so the HCF is $42$.',
      whyWrong: [
        'This is the **lowest common multiple**, $2^2 \\times 3^2 \\times 7 = 252$, which uses the higher powers. The HCF must divide both numbers, so it cannot be bigger than 84.',
        '21 is a common factor ($84 = 21 \\times 4$, $126 = 21 \\times 6$), but not the highest: the shared factor 2 has been left out.',
        null,
        '6 is a common factor, but it only uses the shared primes 2 and 3 and misses the shared prime 7.',
      ],
      keyIdea: 'For the HCF, write both numbers as primes and multiply what they share, using the lower power of each prime. For the LCM (lowest common multiple), use the higher power of each prime.',
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
      asking: 'What digit does $7^{2026}$ end in?',
      solution:
        'We can\'t work out this huge number, so we look for a pattern. The last digit of a product depends only on the last digits of the numbers being multiplied.\n\n' +
        'Work out the first few powers of 7:\n\n| Power | Value | Last digit |\n|---|---|---|\n| $7$ | 7 | 7 |\n| $7^2$ | 49 | 9 |\n| $7^3$ | 343 | 3 |\n| $7^4$ | 2401 | 1 |\n| $7^5$ | 16807 | 7 |\n\n' +
        'The last digit repeats in a cycle of length 4: 7, 9, 3, 1, then 7 again.\n\n' +
        'Divide the power by the cycle length to find the place in the cycle: $2026 = 4 \\times 506 + 2$, so the remainder is 2.\n\n' +
        'Remainder 2 means the 2nd place in the cycle 7, 9, 3, 1, which is 9.',
      conclusion: 'The power 2026 lands on the 2nd place of the cycle, so $7^{2026}$ ends in $9$.',
      whyWrong: [
        'This uses the remainder of $2026 \\div 3$ (which is 1), as if the cycle had length 3. The cycle $7, 9, 3, 1$ has length 4.',
        null,
        'This is one place too far along the cycle: remainder 2 points to the 2nd entry (9), not the 3rd.',
        'This assumes the remainder is 0 (the end of the cycle), perhaps because 2026 is even. But 2026 is not a multiple of 4: $2026 = 2024 + 2$.',
      ],
      keyIdea: 'For the last digit of a big power, list the first few last digits until they repeat, then divide the power by the cycle length. The remainder gives the place in the cycle, and remainder 0 means the last place.',
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
      asking: 'What is left over when the huge number $2^{100}$ is divided by 7?',
      solution:
        'We can\'t work out $2^{100}$ directly, so find the remainders of small powers of 2 when divided by 7 and look for a pattern:\n\n| Power | Value | Remainder when divided by 7 |\n|---|---|---|\n| $2$ | 2 | 2 |\n| $2^2$ | 4 | 4 |\n| $2^3$ | 8 | 1 |\n| $2^4$ | 16 | 2 |\n| $2^5$ | 32 | 4 |\n| $2^6$ | 64 | 1 |\n\n' +
        'The remainders repeat in a cycle of length 3: 2, 4, 1.\n\n' +
        'Divide the power by the cycle length: $100 = 3 \\times 33 + 1$, so the remainder is 1.\n\n' +
        'Remainder 1 means the 1st place in the cycle 2, 4, 1, which is 2.',
      conclusion: 'The power 100 lands on the 1st place of the cycle, so the remainder is $2$.',
      whyWrong: [
        'This reduces the exponent by 7 (the divisor) instead of by 3 (the cycle length): $100 \\bmod 7 = 2$, giving $2^2 = 4$. The exponent must be reduced by the length of the cycle of remainders.',
        'This spots that $2^3 \\equiv 1$ but treats 100 as a multiple of 3. Only 99 is: $2^{100} = 2^{99} \\times 2$, so the leftover factor 2 is forgotten.',
        'This is the last digit of $2^{100}$ (its remainder when divided by **10**), found from the cycle $2, 4, 8, 6$. The question divides by 7.',
        null,
      ],
      keyIdea: 'For the remainder of a huge power, list the remainders of small powers until they repeat. Then find the place in the cycle by dividing the power by the cycle length. Remainder 0 means the last place.',
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
      asking: 'Which $x$ from 0 to 6 makes $3x$ leave remainder 4 when divided by 7?',
      solution:
        '$3x \\equiv 4 \\pmod{7}$ means $3x$ and 4 leave the same remainder when divided by 7. So we need $3x$ to leave remainder 4.\n\n' +
        'There are only seven possible values of $x$, so try them all:\n\n| $x$ | $3x$ | Remainder when divided by 7 |\n|---|---|---|\n| 0 | 0 | 0 |\n| 1 | 3 | 3 |\n| 2 | 6 | 6 |\n| 3 | 9 | 2 |\n| 4 | 12 | 5 |\n| 5 | 15 | 1 |\n| 6 | 18 | 4 |',
      conclusion: 'Only one row gives remainder 4, because $18 = 2 \\times 7 + 4$, so the answer is $x = 6$.',
      whyWrong: [
        null,
        'This multiplies 4 by 3 ($12 \\equiv 5$) instead of undoing the multiplication. Check: $3 \\times 5 = 15 \\equiv 1 \\pmod{7}$, not 4.',
        'This subtracts 3 from 4 as if the equation were $x + 3 \\equiv 4$. Check: $3 \\times 1 = 3$, not 4 (mod 7).',
        'This ignores the coefficient 3 altogether. Check: $3 \\times 4 = 12 \\equiv 5 \\pmod{7}$, not 4.',
      ],
      keyIdea: 'With a small modulus (the number you divide by), make a table of every allowed $x$ and work out the remainder. You can\'t simply divide both sides in a congruence, so checking the values directly is the safe way.',
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
    stem: 'If $a \\equiv 3 \\pmod{8}$ and $b \\equiv 6 \\pmod{8}$, what is the remainder when $a^2 b$ is divided by 8?',
    options: ['$54$', '$2$', '$6$', '$4$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is left over when $a^2 b$ is divided by 8?',
      solution:
        '$a \\equiv 3 \\pmod{8}$ means $a$ leaves remainder 3 when divided by 8. For example, $a$ could be 3, 11 or 19. In the same way, $b$ leaves remainder 6.\n\n' +
        'Useful rule: in a remainder calculation, you can replace any number by its remainder before multiplying. This works because the multiples of 8 you drop stay multiples of 8 when multiplied, so they never change the remainder. So replace $a$ with 3 and $b$ with 6.\n\n' +
        'That turns $a^2 b$ into $3^2 \\times 6 = 9 \\times 6 = 54$.\n\n' +
        'Divide by 8: $8 \\times 6 = 48$, and $54 - 48 = 6$.',
      conclusion: '54 leaves 6 over when divided by 8, so the remainder is $6$.',
      whyWrong: [
        'This is $3^2 \\times 6 = 54$ without reducing. A remainder when dividing by 8 must be between 0 and 7: $54 = 6 \\times 8 + 6$.',
        'This is the remainder of $ab$ ($3 \\times 6 = 18 \\equiv 2$): the square on $a$ has been forgotten.',
        null,
        'This doubles $a$ instead of squaring it: $2 \\times 3 \\times 6 = 36 \\equiv 4 \\pmod{8}$.',
      ],
      keyIdea: 'In remainder questions, replace each letter with its given remainder, do the multiplying and adding, then reduce at the end. The result must be smaller than the divisor.',
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
      asking: 'What is the biggest number that divides both 252 and 198 exactly?',
      solution:
        '$\\gcd$ stands for greatest common divisor, the biggest number dividing both. The **Euclidean algorithm** finds it: divide the larger number by the smaller, then repeat with the smaller number and the remainder. It works because any number dividing both also divides the remainder.\n\n' +
        'Repeat until the remainder is 0:\n\n| Divide | Working | Remainder |\n|---|---|---|\n| $252 \\div 198$ | $252 = 1 \\times 198 + 54$ | 54 |\n| $198 \\div 54$ | $198 = 3 \\times 54 + 36$ | 36 |\n| $54 \\div 36$ | $54 = 1 \\times 36 + 18$ | 18 |\n| $36 \\div 18$ | $36 = 2 \\times 18$ | 0 |\n\n' +
        'The gcd is the last remainder that isn\'t 0, which is 18.',
      conclusion: 'The remainder reaches 0 straight after 18, so $\\gcd(252, 198)$ is $18$.',
      whyWrong: [
        'This stops one step too early and takes the remainder from step 2. The algorithm continues until a remainder of 0 appears.',
        'This is only the first remainder, $252 - 198 = 54$. 54 does not divide 198 ($198 \\div 54 = 3.67$), so it cannot be the GCD.',
        null,
        '9 is a common factor ($3^2$), but the shared factor 2 has been forgotten; 18 also divides both numbers.',
      ],
      keyIdea: 'Euclidean algorithm: replace (larger, smaller) with (smaller, remainder) until the remainder is 0. The last non-zero remainder is the gcd. It is far quicker than listing factors when the numbers are large.',
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
    stem: 'What is the lowest common multiple (LCM) of $12$ and $18$?',
    options: ['$30$', '$36$', '$6$', '$216$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What is the smallest number that both 12 and 18 divide into exactly?',
      solution:
        'A **multiple** of a number is that number times a whole number. The **LCM** is the smallest number that is a multiple of both.\n\n' +
        'List the multiples of the larger number, 18, until one is also a multiple of 12:\n\n| Multiple of 18 | Divides by 12? |\n|---|---|\n| 18 | No: 12 goes in once, leaving 6 |\n| 36 | Yes: $12 \\times 3 = 36$ |',
      conclusion: '36 is the first multiple of 18 that 12 also divides, so the LCM is $36$.',
      whyWrong: [
        'This adds the numbers, $12 + 18 = 30$. But 30 is not a multiple of 12.',
        null,
        'This is the HCF, $\\gcd(12, 18) = 6$. You need a common **multiple**, not a common factor.',
        'This is the product $12 \\times 18 = 216$. It is a common multiple, but not the lowest, because 12 and 18 share the factor 6.',
      ],
      keyIdea: 'List multiples of the larger number until one divides by the smaller. For bigger numbers write each as a product of primes and take the higher power of each prime, or use LCM $= \\frac{a \\times b}{\\text{HCF}}$, where HCF is the highest common factor.',
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
      asking: 'How many whole numbers divide 72 exactly?',
      solution:
        'Start with the prime factorisation, which writes 72 as a product of primes: $72 = 8 \\times 9 = 2^3 \\times 3^2$.\n\n' +
        'Any divisor of 72 is made from these primes. It can use up to three 2s and up to two 3s.\n\n' +
        'So the number of 2s can be 0, 1, 2 or 3, which is 4 choices. The number of 3s can be 0, 1 or 2, which is 3 choices. Using none is allowed.\n\n' +
        'Each pair of choices builds a different divisor, so multiply: $4 \\times 3 = 12$.',
      conclusion: 'The divisors are 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36 and 72, which makes $12$ in total.',
      whyWrong: [
        'This multiplies the exponents, $3 \\times 2 = 6$, forgetting that each exponent can also be 0. (6 is also the number of factor **pairs**, but each pair contains two divisors.)',
        'This adds the exponents, $3 + 2 = 5$. The choices for each prime must be multiplied, and each exponent can also be 0.',
        'This adds the choices, $(3 + 1) + (2 + 1) = 7$. The choices for the two primes are independent, so they must be **multiplied**.',
        null,
      ],
      keyIdea: 'Write $N = p^a \\times q^b$ using primes. The number of divisors is then $(a + 1)(b + 1)$. Add 1 to each power because using none of that prime is allowed.',
    },
    check: { optionValues: [6, 5, 7, 12], compute: () => countDivisors(72) },
  },
  {
    id: 'modular-arithmetic-013',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'What is the remainder $r$, with $0 \\le r < 5$, when $-17$ is divided by $5$?',
    options: ['$3$', '$-2$', '$2$', '$-4$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What remainder from 0 to 4 does $-17$ leave when divided by 5?',
      solution:
        'Division with remainder means writing $-17 = 5 \\times q + r$, where $q$ is a whole number (the quotient) and $r$ is the remainder. The question says $r$ must be from 0 to 4, so it can\'t be negative.\n\n' +
        'So we need a multiple of 5 at or **below** $-17$, so that adding a positive $r$ brings us up to $-17$. $-15$ is above $-17$, so it won\'t do. The next one down is $-20$, which is $5 \\times (-4)$.\n\n' +
        'Find the gap from $-20$ up to $-17$: $-17 - (-20) = 3$.',
      conclusion: '$-17 = 5 \\times (-4) + 3$, and 3 lies between 0 and 4, so the remainder is $3$.',
      whyWrong: [
        null,
        'This rounds $-3.4$ towards zero, using $q = -3$. Then $r = -2$, which breaks the condition $0 \\le r < 5$.',
        'This is the remainder of $+17$. The minus sign has been ignored.',
        'This is the quotient $q$, not the remainder $r$.',
      ],
      keyIdea: 'For a negative number, go down to the next multiple of $n$ below it, then count up to the number. Another way: find the remainder of the positive number and subtract it from $n$ (here $5 - 2 = 3$), unless it is 0.',
    },
    check: { optionValues: [3, -2, 2, -4], compute: () => mod(-17, 5) },
  },
  {
    id: 'modular-arithmetic-014',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'The five-digit number $47\\square28$ is divisible by $11$. Which digit goes in the box?',
    options: ['$1$', '$3$', '$8$', '$2$'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which digit in the box makes $47\\square28$ a multiple of 11?',
      solution:
        'Use the **test for 11**: go along the digits, alternately adding and subtracting, starting with adding. The number is divisible by 11 exactly when the result is a multiple of 11. Zero counts as a multiple.\n\n' +
        'Call the missing digit $d$. The signs go $+, -, +, -, +$, which gives $4 - 7 + d - 2 + 8$.\n\n' +
        'Collect the ordinary numbers: $4 - 7 - 2 + 8 = 3$. So the result is $d + 3$.\n\n' +
        '$d$ is a single digit from 0 to 9, so $d + 3$ is between 3 and 12. The only multiple of 11 in that range is 11.\n\n' +
        'Solve $d + 3 = 11$ by taking 3 from both sides: $d = 8$.',
      conclusion: 'With 8 in the box, $4 - 7 + 8 - 2 + 8 = 11$, a multiple of 11, so the digit is $8$.',
      whyWrong: [
        'This makes the ordinary digit sum $4 + 7 + 1 + 2 + 8 = 22$ a multiple of 11. Adding all the digits is the rule for 3 and 9; for 11 the signs must alternate. Indeed $47128 \\div 11$ is not whole.',
        'This makes a sign slip, getting $d - 3$ instead of $d + 3$ (then $3 - 3 = 0$). Recalculate carefully: $4 - 7 - 2 + 8 = 3$.',
        null,
        'This subtracts the last digit as well, $4 - 7 + d - 2 - 8 = d - 13$, which is $-11$ when $d = 2$. The signs must keep alternating: $+, -, +, -, +$.',
      ],
      keyIdea: 'Test for 11: alternate $+$ and $-$ along the digits. For a missing digit, write the result in terms of $d$, then use the range 0 to 9 to find which multiple of 11 it can be.',
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
      asking: 'Using the HCF and LCM, what number pairs with 36?',
      solution:
        'The **HCF** is the biggest number dividing both. The **LCM** is the smallest number both divide into. They are linked by a rule: HCF $\\times$ LCM $=$ first number $\\times$ second number.\n\n' +
        'Why the rule holds: write both numbers as products of primes (numbers divisible only by 1 and themselves). For each prime, the HCF takes the lower power and the LCM takes the higher power. Between them, they use every prime from both numbers exactly once.\n\n' +
        'Call the unknown number $x$ and substitute: $6 \\times 180 = 36 \\times x$.\n\n' +
        'Work out the left side: $6 \\times 180 = 1080$. So $1080 = 36x$.\n\n' +
        'Divide both sides by 36 to get $x$ on its own: $x = 1080 \\div 36 = 30$.',
      conclusion: 'The HCF of 36 and 30 is 6 and their LCM is 180, as given, so the other number is $30$.',
      whyWrong: [
        'This is $180 \\div 36 = 5$, which leaves out the HCF. Also, the HCF 6 must divide both numbers, and 6 does not divide 5.',
        null,
        'This is $180 - 36$. HCF and LCM combine by multiplication, not subtraction. Check: 144 is a multiple of 36, so $\\gcd(36, 144) = 36$, not 6.',
        'This is $36 \\times 6$. The rule is HCF $\\times$ LCM $=$ product of the numbers, so you divide $6 \\times 180$ by 36.',
      ],
      keyIdea: 'Given the HCF, the LCM and one number, use HCF $\\times$ LCM $=$ product of the two numbers, then divide by the known number. Check that the HCF divides your answer.',
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
      source: 'a = 1071\nb = 462\nwhile (b != 0)\n   r = mod(a,b) // mod is the modulus operator\n   a = b\n   b = r\nend while\nprint(a)',
    },
    options: ['0', '147', 'Infinite loop', '21'],
    correctIndex: 3,
    markScheme: {
      asking: 'What is the value of `a` when the loop stops and it gets printed?',
      solution:
        '`mod(a,b)` means the remainder when `a` is divided by `b`. For example, `mod(7,3)` is 1, because $7 = 2 \\times 3 + 1$.\n\n' +
        '`!=` means "not equal to", so the loop keeps running while `b` is not 0. Each pass, line 4 stores the remainder in `r`, line 5 copies `b` into `a`, and line 6 copies `r` into `b`.\n\n' +
        'Trace every pass. Line 4 uses $1071 = 2 \\times 462 + 147$, then $462 = 3 \\times 147 + 21$, then $147 = 7 \\times 21$:\n\n| Pass | `a` at start | `b` at start | `r` | `a` becomes | `b` becomes |\n|---|---|---|---|---|---|\n| 1 | 1071 | 462 | 147 | 462 | 147 |\n| 2 | 462 | 147 | 21 | 147 | 21 |\n| 3 | 147 | 21 | 0 | 21 | 0 |\n\n' +
        'Now `b` is 0, so the loop stops. Line 8 prints `a`, which holds 21.',
      conclusion: 'This loop is the Euclidean algorithm for the highest common factor of 1071 and 462, and it prints 21.',
      whyWrong: [
        'This is the final value of `b` (and of `r`). The loop stops when `b` becomes 0, but the program prints `a`.',
        'This is the remainder after the first pass. The loop keeps going while `b` is not 0, so there are two more passes.',
        'A remainder is always smaller than the divisor, so `b` shrinks on every pass and must reach 0.',
        null,
      ],
      keyIdea: 'A loop with `r = mod(a,b)`, `a = b`, `b = r` finds the gcd (greatest common divisor, the same as the highest common factor) of its two starting numbers. To trace it, use one row per pass and update in the code\'s order. The result ends up in `a`, not `b`.',
    },
    check: {
      optionValues: [0, 147, 'Infinite loop', 21],
      compute: () => {
        let a = 1071;
        let b = 462;
        for (let pass = 0; b !== 0; pass++) {
          if (pass > 1000) return 'Infinite loop';
          const r = a % b;
          a = b;
          b = r;
        }
        return a;
      },
    },
  },
  {
    id: 'modular-arithmetic-018',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'What is the last digit of $3^{2026} + 7^{2026}$?',
    options: ['$8$', '$0$', '$2$', '$18$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the last digit when you add $3^{2026}$ and $7^{2026}$?',
      solution:
        'We can\'t work out these huge powers, so find the last digit of each by looking for a repeating pattern, then add them.\n\n' +
        'Multiply repeatedly and keep only the last digit. Both patterns repeat every 4 powers:\n\n| Power | 1st | 2nd | 3rd | 4th |\n|---|---|---|---|---|\n| Powers of 3 | 3 | 9 | 7 | 1 |\n| Powers of 7 | 7 | 9 | 3 | 1 |\n\n' +
        'Divide the power by the cycle length: $2026 = 4 \\times 506 + 2$, so the remainder is 2. That points to the 2nd column.\n\n' +
        'In the 2nd column both powers end in 9. So $3^{2026}$ ends in 9, and $7^{2026}$ ends in 9.\n\n' +
        'Add the last digits: $9 + 9 = 18$. Only the last digit of that total matters, which is 8.',
      conclusion: 'Both powers end in 9, and $9 + 9 = 18$ ends in $8$.',
      whyWrong: [
        null,
        'This adds the bases first, as if $3^{n} + 7^{n} = 10^{n}$. Powers do not add like that: $3^2 + 7^2 = 58$, not $100$.',
        'This treats 2026 as a multiple of 4 (using the 4th entries, $1 + 1$). But $2026 = 2024 + 2$ leaves remainder 2.',
        'This is $9 + 9$ without reducing. A last digit must be a single digit 0 to 9; 18 ends in 8.',
      ],
      keyIdea: 'For the last digit of a sum of powers, find each power\'s last digit using its cycle, add them, then keep only the last digit of the total. Never add the bases first.',
    },
    check: { optionValues: [8, 0, 2, 18], compute: () => (powMod(3, 2026, 10) + powMod(7, 2026, 10)) % 10 },
  },
  {
    id: 'modular-arithmetic-021',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'How many integers from 1 to 200 inclusive are divisible by $4$ or by $6$ (or both)?',
    options: ['$83$', '$75$', '$67$', '$51$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How many numbers from 1 to 200 are multiples of 4 or 6?',
      solution:
        'To count the multiples of a number from 1 to 200, divide 200 by that number and drop anything after the decimal point.\n\n' +
        'Multiples of 4: $200 \\div 4 = 50$. Multiples of 6: $200 \\div 6 = 33.3\\ldots$, which gives 33.\n\n' +
        'Numbers such as 12 and 24 are multiples of both, so they have been counted twice. A number divisible by both 4 and 6 is a multiple of their LCM (lowest common multiple), which is 12.\n\n' +
        'Multiples of 12: $200 \\div 12 = 16.6\\ldots$, which gives 16.\n\n' +
        'Add the two counts and take off the overlap once: $50 + 33 - 16 = 67$.',
      conclusion: 'Adding 50 and 33 counts 16 numbers twice, so removing one copy of them leaves $67$.',
      whyWrong: [
        'This is $50 + 33$ without removing the numbers divisible by both (like 12, 24, 36), which have been counted twice.',
        'This uses $4 \\times 6 = 24$ for "both": $50 + 33 - 8 = 75$. Numbers like 12 and 36 are divisible by 4 and 6 but not by 24; "both" means divisible by the LCM, 12.',
        null,
        'This subtracts the overlap twice: $83 - 2 \\times 16 = 51$. That counts numbers divisible by **exactly one** of 4 and 6, but the question includes "or both".',
      ],
      keyIdea: 'For "divisible by $a$ or $b$": add the multiples of $a$ to the multiples of $b$, then subtract the multiples of their LCM. Find each count by dividing the limit and rounding down. Use the LCM for "both", not $a \\times b$.',
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
  {
    id: 'modular-arithmetic-022',
    subtopic: 'modular-arithmetic',
    difficulty: 'foundation',
    stem: 'The statement $a \\equiv b \\pmod{n}$ means that $a$ and $b$:',
    options: ['leave the same remainder when divided by $n$', 'are both multiples of $n$', 'add up to $n$', 'are equal'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does $a \\equiv b \\pmod{n}$ tell you about $a$ and $b$?',
      solution:
        '$a \\equiv b \\pmod{n}$ is read "$a$ is congruent to $b$ modulo $n$". It compares remainders after dividing by $n$.\n\n' +
        'For example, $17 \\equiv 2 \\pmod{5}$, because $17 = 3 \\times 5 + 2$ and 2 divided by 5 also leaves 2. So 17 and 2 are different numbers, but they match when you divide by 5.',
      conclusion: 'Congruent numbers need not be equal: they leave the same remainder when divided by $n$.',
      whyWrong: [
        null,
        'Multiples of $n$ are only the case with remainder 0. For example $17 \\equiv 2 \\pmod{5}$, and neither is a multiple of 5.',
        'Congruence compares the remainders. It says nothing about the sum: $17 + 2$ is not 5.',
        'Equal numbers are congruent, but congruent numbers need not be equal: $17 \\ne 2$.',
      ],
      keyIdea: 'Read $a \\equiv b \\pmod{n}$ as "$a$ and $b$ have the same remainder when divided by $n$". You can also test it this way: $n$ must divide $a - b$ exactly. Here $17 - 2 = 15$ divides by 5.',
    },
  },
  {
    id: 'modular-arithmetic-023',
    subtopic: 'modular-arithmetic',
    difficulty: 'foundation',
    stem: 'What is the only even **prime** number?',
    options: ['$2$', '$4$', '$0$', '$1$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which even number is also prime?',
      solution:
        'A **prime** is a whole number above 1 with exactly two factors: 1 and itself.\n\n' +
        'An even number is a multiple of 2. So any even number above 2 has at least three factors: 1, 2 and itself. That stops it being prime.\n\n' +
        'That leaves only 2 itself, whose factors are just 1 and 2.',
      conclusion: 'Its only factors are 1 and itself, so the only even prime is $2$.',
      whyWrong: [
        null,
        '$4 = 2 \\times 2$ has three factors (1, 2 and 4), so it is not prime.',
        '0 is divisible by every positive whole number, so it is not prime.',
        '1 has only one factor and is not counted as prime. It is not even either.',
      ],
      keyIdea: 'Test a prime by listing its factors: exactly two, no more and no fewer. So 1 is not prime (one factor), and no even number above 2 is prime.',
    },
    check: {
      optionValues: [2, 4, 0, 1],
      compute: () => {
        const evens = [];
        for (let k = 0; k <= 100; k += 2) if (isPrime(k)) evens.push(k);
        return evens.length === 1 ? evens[0] : -1;
      },
    },
  },
  {
    id: 'modular-arithmetic-024',
    subtopic: 'modular-arithmetic',
    difficulty: 'foundation',
    stem: 'Which list gives all the possible remainders when a whole number is divided by $4$?',
    options: ['$0, 1, 2, 3$', '$1, 2, 3, 4$', '$0, 1, 2, 3, 4$', '$1, 2, 3$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What remainders are possible when dividing by 4?',
      solution:
        'The **remainder** is what is left over after dividing. If 4 or more were left over, 4 could go in once more. So the remainder must be smaller than 4.\n\n' +
        'A short run of numbers shows the list. 8, 9, 10 and 11 leave remainders 0, 1, 2 and 3. Then 12 leaves 0 again, so the pattern repeats.',
      conclusion: 'A remainder can\'t reach 4, and multiples of 4 leave 0, so the full list is $0, 1, 2, 3$.',
      whyWrong: [
        null,
        'A remainder of 4 would mean 4 could go in one more time. Multiples of 4 leave remainder 0, which this list leaves out.',
        'A remainder must be **less** than 4, so 4 cannot appear.',
        'This forgets remainder 0, which is what every multiple of 4 leaves.',
      ],
      keyIdea: 'Dividing by $n$ gives exactly $n$ possible remainders: 0, 1, up to $n - 1$. Remainder 0 counts, and remainder $n$ never happens.',
    },
    check: {
      optionValues: ['0,1,2,3', '1,2,3,4', '0,1,2,3,4', '1,2,3'],
      compute: () => {
        const rs = new Set<number>();
        for (let k = 0; k < 100; k++) rs.add(mod(k, 4));
        return [...rs].sort((p, q) => p - q).join(',');
      },
    },
  },
  {
    id: 'modular-arithmetic-025',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: 'n = 23\nc = 0\nwhile (n > 0)\n   if mod(n,3) == 0 // mod is the modulus operator\n      c = c + 1\n   end if\n   n = n - 4\nend while\nprint(c)',
    },
    options: ['2', '1', '6', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many times does the loop find that `n` is a multiple of 3?',
      solution:
        '`mod(n,3)` means the remainder when `n` is divided by 3. For example, `mod(7,3)` is 1, because $7 = 2 \\times 3 + 1$. If the remainder is 0, then `n` is a multiple of 3.\n\n' +
        'So line 5 adds 1 to `c` only when `n` is a multiple of 3. Line 7 takes 4 off `n` on every pass, and the loop keeps going while `n` is above 0.\n\n' +
        'Trace every pass:\n\n| Pass | `n` | `mod(n,3)` | `c` after the pass |\n|---|---|---|---|\n| 1 | 23 | 2 | 0 |\n| 2 | 19 | 1 | 0 |\n| 3 | 15 | 0 | 1 |\n| 4 | 11 | 2 | 1 |\n| 5 | 7 | 1 | 1 |\n| 6 | 3 | 0 | 2 |\n\n' +
        'After pass 6, `n` becomes $3 - 4 = -1$. That is not above 0, so the loop stops. Line 9 prints `c`, which holds 2.',
      conclusion: '`n` is a multiple of 3 only at 15 and at 3, so `c` goes up twice and the answer is 2.',
      whyWrong: [
        null,
        'This stops too early and misses `n = 3`. The condition is `n > 0`, so the pass with `n = 3` still runs.',
        'This is the number of passes of the loop. `c` only goes up when `mod(n,3)` is 0.',
        '`n` falls by 4 on every pass, so it reaches $-1$ and the condition `n > 0` becomes false.',
      ],
      keyIdea: 'For a counter inside a loop, draw a table with the loop variable, the value the `if` tests, and the counter. The counter changes only when the `if` is true, so the number of passes isn\'t the result.',
    },
    check: {
      optionValues: [2, 1, 6, 'Infinite loop'],
      compute: () => {
        let n = 23;
        let c = 0;
        for (let pass = 0; n > 0; pass++) {
          if (pass > 1000) return 'Infinite loop';
          if (mod(n, 3) === 0) c++;
          n -= 4;
        }
        return c;
      },
    },
  },
  {
    id: 'modular-arithmetic-026',
    subtopic: 'modular-arithmetic',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: 'n = 10\ns = 0\nwhile (n != 0)\n   s = s + mod(n,2) // mod is the modulus operator\n   n = n - 3\nend while\nprint(s)',
    },
    options: ['Infinite loop', '2', '4', '3'],
    correctIndex: 0,
    markScheme: {
      asking: 'Does the loop ever stop, and if it does, what is printed?',
      solution:
        '`!=` means "not equal to". So line 3 keeps the loop going until `n` is exactly 0. If `n` skips past 0, nothing stops the loop.\n\n' +
        'Line 5 takes 3 off `n` on each pass. Follow `n`: 10, 7, 4, 1, $-2$, $-5$, $-8$, and so on.\n\n' +
        '`n` jumps from 1 to $-2$ and misses 0. After that it only gets more negative, so it can never equal 0.\n\n' +
        'So the condition on line 3 stays true for ever, and line 7 is never reached.',
      conclusion: '`n` never equals 0, so the loop never ends and the answer is Infinite loop.',
      whyWrong: [
        null,
        'This is the value of `s` when `n` first goes below 0, but the condition is `n != 0`, not `n > 0`.',
        'This counts the passes with `n` equal to 10, 7, 4 and 1. The loop does not stop at that point, and `s` does not count passes.',
        'This is the value of `s` after the pass with `n = -5`. The loop has no reason to stop there, because `n` never equals 0.',
      ],
      keyIdea: 'When a loop\'s condition uses `!=`, check whether the variable actually lands on that value, since a jump can skip over it. Here the start, 10, isn\'t a multiple of the step size 3, so `n` jumps past 0.',
    },
    check: {
      optionValues: ['Infinite loop', 2, 4, 3],
      compute: () => {
        let n = 10;
        let s = 0;
        for (let pass = 0; n !== 0; pass++) {
          if (pass > 1000) return 'Infinite loop';
          s += mod(n, 2);
          n -= 3;
        }
        return s;
      },
    },
  },
];
