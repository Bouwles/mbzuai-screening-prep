import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { m } from '../../../lib/tex';

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
const rev = (s: string) => [...s].reverse().join('');
const flip = (s: string) => [...s].map((c) => (c === '0' ? '1' : '0')).join('');

const binT = (s: string) => m(`${s}_2`);
const hexT = (s: string) => m(`\\mathrm{${s}}_{16}`);
const octT = (s: string) => m(`${s}_8`);
const decT = (n: number) => m(String(n));

/** A candidate distractor. `key` decides sameness (usually the numeric value it stands for). */
type Cand = { text: string; value: number | string; key: string; why: string };

/** Keep up to 3 candidates different from the answer and from each other (by key and by text). */
function pickDistinct(ansKey: string, ansText: string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (c.key === ansKey || c.text === ansText) continue;
    if (out.some((x) => x.key === c.key || x.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

const finish = (core: Omit<GeneratedCore, 'distractors'>, ds: Cand[]): GeneratedCore => ({
  ...core,
  distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
});

/** Markdown table of place values and digits. */
function placeTable(digits: string, base: number): string {
  const L = digits.length;
  const pv = [...digits].map((_, i) => String(base ** (L - 1 - i)));
  return (
    `| Place value | ${pv.join(' | ')} |\n` +
    `| --- | ${pv.map(() => '---').join(' | ')} |\n` +
    `| Digit | ${[...digits].join(' | ')} |\n\n`
  );
}

/** Repeated-division table for decimal n in base b; returns the markdown. */
function divisionTable(n: number, b: number): string {
  let out = `| Division | Quotient | Remainder |\n| --- | --- | --- |\n`;
  let x = n;
  while (x > 0) {
    const q = Math.floor(x / b);
    const r = x % b;
    out += `| $${x} \\div ${b}$ | ${q} | ${r}${r >= 10 ? ` (${DIGITS[r]})` : ''} |\n`;
    x = q;
  }
  return out + '\n';
}

// ---------------------------------------------------------------- conversions
type Mode = 'bin2dec' | 'dec2bin' | 'hex2dec' | 'dec2hex' | 'oct2dec';

function convert(rng: Rng): GeneratedCore {
  const mode = rng.pick<Mode>(['bin2dec', 'dec2bin', 'hex2dec', 'dec2hex', 'oct2dec']);
  for (;;) {
    if (mode === 'bin2dec') {
      const n = rng.int(19, 250);
      const s = toBase(n, 2);
      const L = s.length;
      const r = rev(s);
      const ones = [...s].map((c, i) => (c === '1' ? 2 ** (L - 1 - i) : 0)).filter((x) => x > 0);
      const linear = [...s].reduce((acc, c, i) => acc + (c === '1' ? L - i : 0), 0);
      const answer = decT(n);
      const pool: Cand[] = [
        {
          text: decT(fromBase(r, 2)),
          value: fromBase(r, 2),
          key: String(fromBase(r, 2)),
          why: `This starts the place values at the **left** end, so it really converts ${binT(r)}. The units (1s) place is always the rightmost digit.`,
        },
        {
          text: decT(2 * n),
          value: 2 * n,
          key: String(2 * n),
          why: `This starts the place values at 2 instead of 1. The rightmost place is $2^0 = 1$, so this doubles the true value.`,
        },
        {
          text: decT(n - 2 ** (L - 1)),
          value: n - 2 ** (L - 1),
          key: String(n - 2 ** (L - 1)),
          why: `This leaves out the leftmost 1, which is worth $2^{${L - 1}} = ${2 ** (L - 1)}$ in ${L === 8 ? "an" : "a"} ${L}-digit binary number.`,
        },
        {
          text: decT(linear),
          value: linear,
          key: String(linear),
          why: `This uses the place values $1, 2, 3, 4, \\dots$ (adding 1 each time). Binary place values **double**: $1, 2, 4, 8, \\dots$`,
        },
      ];
      const ds = pickDistinct(String(n), answer, pool);
      if (ds.length < 3) continue;
      return finish(
        {
          stem: `Convert the binary number ${binT(s)} to decimal.`,
          answer,
          answerValue: n,
          solution:
            `In binary each place is worth double the place to its right, starting from 1 at the right.\n\n` +
            placeTable(s, 2) +
            `Add the place values that have a 1 under them:\n\n` +
            `$$${ones.join(' + ')} = ${n}$$\n\n` +
            `Answer: ${answer}`,
          keyIdea: 'Binary place values are powers of 2 starting from $2^0 = 1$ at the right; add the place values where there is a 1.',
        },
        ds,
      );
    }

    if (mode === 'dec2bin') {
      const n = rng.int(19, 200);
      const s = toBase(n, 2);
      const answer = binT(s);
      const r = rev(s);
      const noZeros = s.replace(/0/g, '');
      const lastLost = s.slice(0, -1);
      const unitsFlipped = toBase(n ^ 1, 2);
      const pool: Cand[] = [
        {
          text: binT(r),
          value: r,
          key: String(fromBase(r, 2)),
          why: `This writes the remainders from the **top down**. The first remainder is the units digit, so the remainders must be read from the bottom up.`,
        },
        {
          text: binT(unitsFlipped),
          value: unitsFlipped,
          key: String(n ^ 1),
          why:
            n % 2 === 1
              ? `This ends in 0, but ${n} is odd, so its binary form must end in 1 (the first remainder, ${n} divided by 2, is 1).`
              : `This ends in 1, but ${n} is even, so its binary form must end in 0 (the first remainder, ${n} divided by 2, is 0).`,
        },
        ...(noZeros !== s
          ? [
              {
                text: binT(noZeros),
                value: noZeros,
                key: String(fromBase(noZeros, 2)),
                why: `This leaves out the zeros. The zeros are placeholders for unused place values; without them ${binT(noZeros)} is only ${fromBase(noZeros, 2)}.`,
              },
            ]
          : []),
        {
          text: binT(lastLost),
          value: lastLost,
          key: String(fromBase(lastLost, 2)),
          why: `This leaves out the very first remainder (the units digit). Every division by 2 gives one binary digit, and all of them are needed.`,
        },
      ];
      const ds = pickDistinct(String(n), answer, pool);
      if (ds.length < 3) continue;
      const ones = [...s].map((c, i) => (c === '1' ? 2 ** (s.length - 1 - i) : 0)).filter((x) => x > 0);
      return finish(
        {
          stem: `Write the decimal number $${n}$ in binary.`,
          answer,
          answerValue: s,
          solution:
            `Divide by 2 repeatedly and write down each remainder:\n\n` +
            divisionTable(n, 2) +
            `Read the remainders from the **bottom up**: ${binT(s)}.\n\n` +
            `Check with place values: $${ones.join(' + ')} = ${n}$.\n\n` +
            `Answer: ${answer}`,
          keyIdea: 'Decimal to binary: divide by 2 repeatedly and read the remainders from the last one to the first.',
        },
        ds,
      );
    }

    if (mode === 'hex2dec') {
      const d1 = rng.int(1, 15);
      const d0 = rng.int(1, 15);
      if (d1 < 10 && d0 < 10) continue;
      const h = DIGITS[d1] + DIGITS[d0];
      const n = 16 * d1 + d0;
      const answer = decT(n);
      const concat = Number(`${d1}${d0}`);
      const pool: Cand[] = [
        {
          text: decT(10 * d1 + d0),
          value: 10 * d1 + d0,
          key: String(10 * d1 + d0),
          why: `This uses 10 as the place value of the left digit: $${d1} \\times 10 + ${d0}$. In hexadecimal the second place is worth 16.`,
        },
        {
          text: decT(16 * d0 + d1),
          value: 16 * d0 + d1,
          key: String(16 * d0 + d1),
          why: `This reads the digits in the wrong order: $${d0} \\times 16 + ${d1}$. The rightmost digit is the units digit.`,
        },
        {
          text: decT(d1 + d0),
          value: d1 + d0,
          key: String(d1 + d0),
          why: `This just adds the digit values, $${d1} + ${d0}$, ignoring place value.`,
        },
        {
          text: decT(concat),
          value: concat,
          key: String(concat),
          why: `This writes the digit values ${d1} and ${d0} side by side as decimal digits. Each hex digit must be multiplied by its place value and then added.`,
        },
      ];
      const ds = pickDistinct(String(n), answer, pool);
      if (ds.length < 3) continue;
      const letters = [...h].filter((c) => DIGITS.indexOf(c) >= 10);
      return finish(
        {
          stem: `Convert the hexadecimal number ${hexT(h)} to decimal.`,
          answer,
          answerValue: n,
          solution:
            `Hexadecimal uses $\\mathrm{A} = 10$, $\\mathrm{B} = 11$, $\\mathrm{C} = 12$, $\\mathrm{D} = 13$, $\\mathrm{E} = 14$, $\\mathrm{F} = 15$. ` +
            `Here ${letters.map((c) => m(`\\mathrm{${c}} = ${DIGITS.indexOf(c)}`)).join(' and ')}.\n\n` +
            `The place values are 16 (left) and 1 (right):\n\n` +
            `$$${hexT(h).slice(1, -1)} = ${d1} \\times 16 + ${d0} \\times 1 = ${16 * d1} + ${d0} = ${n}$$\n\n` +
            `Answer: ${answer}`,
          keyIdea: 'Each hexadecimal place is worth 16 times the place to its right; the letters A to F stand for 10 to 15.',
        },
        ds,
      );
    }

    if (mode === 'dec2hex') {
      const n = rng.int(26, 255);
      const q = Math.floor(n / 16);
      const r = n % 16;
      if (q === 0 || r === 0 || (q < 10 && r < 10)) continue;
      const h = DIGITS[q] + DIGITS[r];
      const answer = hexT(h);
      const pool: Cand[] = [];
      if (q !== r)
        pool.push({
          text: hexT(rev(h)),
          value: rev(h),
          key: String(fromBase(rev(h), 16)),
          why: `This writes the remainders top-down. The first remainder (${r}) is the units digit and goes on the **right**.`,
        });
      const cat = `${q}${r}`;
      pool.push({
        text: m(`${cat}_{16}`),
        value: cat,
        key: String(fromBase(cat, 16)),
        why: `This writes ${
          q >= 10 && r >= 10
            ? `both remainders, ${q} and ${r}, as two decimal digits each`
            : q >= 10
              ? `the remainder ${q} as two decimal digits`
              : `the remainder ${r} as two decimal digits`
        }. In hexadecimal every value from 10 to 15 is a **single** digit (A to F).`,
      });
      if (r === 4 || r === 8 || r === 12) {
        const fracDigits = String(r / 16).slice(2); // 0.25 -> "25", 0.5 -> "5", 0.75 -> "75"
        const wrong = DIGITS[q] + fracDigits;
        pool.push({
          text: hexT(wrong),
          value: wrong,
          key: String(fromBase(wrong, 16)),
          why: `This uses the calculator decimal $${n} \\div 16 = ${q + r / 16}$ and turns the decimal part into digits. The units digit is the **remainder**, $${n} - ${q} \\times 16 = ${r}$.`,
        });
      }
      const shifted = [...h].map((c) => (DIGITS.indexOf(c) >= 11 ? DIGITS[DIGITS.indexOf(c) - 1] : c)).join('');
      if (shifted !== h)
        pool.push({
          text: hexT(shifted),
          value: shifted,
          key: String(fromBase(shifted, 16)),
          why: `This counts the letters from $\\mathrm{A} = 11$. The letters start at $\\mathrm{A} = 10$, so for example $\\mathrm{B} = 11$ and $\\mathrm{F} = 15$.`,
        });
      const ds = pickDistinct(String(n), answer, pool);
      if (ds.length < 3) continue;
      return finish(
        {
          stem: `Write the decimal number $${n}$ in hexadecimal.`,
          answer,
          answerValue: h,
          solution:
            `Divide by 16 and keep the whole-number remainders:\n\n` +
            `- $${n} \\div 16 = ${q}$ remainder $${r}$ (because $${q} \\times 16 = ${16 * q}$ and $${n} - ${16 * q} = ${r}$)\n` +
            `- $${q} \\div 16 = 0$ remainder $${q}$\n\n` +
            `Read the remainders from the bottom up: ${q} then ${r}. As hex digits these are ${m(`\\mathrm{${DIGITS[q]}}`)} and ${m(`\\mathrm{${DIGITS[r]}}`)}.\n\n` +
            `Check: $${q} \\times 16 + ${r} = ${n}$.\n\n` +
            `Answer: ${answer}`,
          keyIdea: 'Decimal to hex: divide by 16, write each remainder as one digit 0 to F, and read them from last to first.',
        },
        ds,
      );
    }

    // oct2dec
    const a = rng.int(1, 7);
    const b = rng.int(1, 7);
    const c = rng.int(1, 7);
    const o = `${a}${b}${c}`;
    const n = 64 * a + 8 * b + c;
    const answer = decT(n);
    const pool: Cand[] = [
      {
        text: decT(256 * a + 16 * b + c),
        value: 256 * a + 16 * b + c,
        key: String(256 * a + 16 * b + c),
        why: `This uses powers of 16 (hexadecimal place values $256, 16, 1$). Octal place values are powers of 8: $64, 8, 1$.`,
      },
      {
        text: decT(64 * c + 8 * b + a),
        value: 64 * c + 8 * b + a,
        key: String(64 * c + 8 * b + a),
        why: `This reads the digits in the wrong order: $${c} \\times 64 + ${b} \\times 8 + ${a}$. The rightmost digit is the units digit.`,
      },
      {
        text: decT(16 * a + 8 * b + c),
        value: 16 * a + 8 * b + c,
        key: String(16 * a + 8 * b + c),
        why: `This uses the place values $1, 8, 16$ (doubling after 8). Each octal place is worth **8 times** the one to its right: $1, 8, 64$.`,
      },
      {
        text: decT(a + b + c),
        value: a + b + c,
        key: String(a + b + c),
        why: `This just adds the digits, $${a} + ${b} + ${c}$, ignoring place value.`,
      },
    ];
    const ds = pickDistinct(String(n), answer, pool);
    if (ds.length < 3) continue;
    return finish(
      {
        stem: `Convert the octal (base 8) number ${octT(o)} to decimal.`,
        answer,
        answerValue: n,
        solution:
          `In base 8 the place values from the right are $1$, $8$, $8^2 = 64$.\n\n` +
          placeTable(o, 8) +
          `$$${a} \\times 64 + ${b} \\times 8 + ${c} \\times 1 = ${64 * a} + ${8 * b} + ${c} = ${n}$$\n\n` +
          `Answer: ${answer}`,
        keyIdea: 'In base $b$ the place values from the right are $1, b, b^2, b^3, \\dots$; multiply each digit by its place value and add.',
      },
      ds,
    );
  }
}

// ---------------------------------------------------------------- two's complement
function twosComplement(rng: Rng): GeneratedCore {
  for (;;) {
    if (rng.bool()) {
      // encode -k in 8 bits
      const k = rng.int(2, 120);
      const pos = toBase(k, 2).padStart(8, '0');
      const fl = flip(pos);
      const ans = toBase(256 - k, 2);
      const answer = binT(ans);
      const signMag = '1' + toBase(k, 2).padStart(7, '0');
      const minus1 = toBase(254 - k, 2);
      const pool: Cand[] = [
        {
          text: binT(signMag),
          value: signMag,
          key: signMag,
          why: `This is **sign-and-magnitude**: a sign bit 1 followed by ${k} in binary. Two's complement needs the bits flipped and then 1 added.`,
        },
        {
          text: binT(fl),
          value: fl,
          key: fl,
          why: `This is only the "flip every bit" step (the one's complement). You must also add 1.`,
        },
        {
          text: binT(minus1),
          value: minus1,
          key: minus1,
          why: `This flips the bits and then **subtracts** 1 instead of adding 1.`,
        },
        {
          text: binT(pos),
          value: pos,
          key: pos,
          why: `This is $+${k}$, not $-${k}$. A negative number in two's complement always starts with a 1.`,
        },
      ];
      const ds = pickDistinct(ans, answer, pool);
      if (ds.length < 3) continue;
      return finish(
        {
          stem: `What is the **8-bit two's complement** representation of $-${k}$?`,
          answer,
          answerValue: ans,
          solution:
            `To make a negative number in two's complement: write the positive number in 8 bits, **flip every bit**, then **add 1**.\n\n` +
            `1. $${k}$ in 8 bits is ${binT(pos)}.\n` +
            `2. Flip every bit: ${binT(fl)}.\n` +
            `3. Add 1: ${binT(ans)}.\n\n` +
            `Check: a pattern starting with 1 is worth its unsigned value minus 256. Here ${binT(ans)} is $${256 - k}$ unsigned, and $${256 - k} - 256 = -${k}$. Correct.\n\n` +
            `Answer: ${answer}`,
          keyIdea: "Two's complement of a negative number: write the positive value, invert all the bits, then add 1.",
        },
        ds,
      );
    }
    // decode an 8-bit negative pattern
    const v = rng.int(-120, -2);
    const u = v + 256;
    const bits = toBase(u, 2);
    const fl = flip(bits);
    const answer = decT(v);
    const rest = u - 128;
    const restTerms = [64, 32, 16, 8, 4, 2, 1].filter((p) => (rest & p) !== 0);
    const pool: Cand[] = [
      {
        text: decT(u),
        value: u,
        key: String(u),
        why: `This reads the pattern as an **unsigned** number. In two's complement a leading 1 means the number is negative.`,
      },
      {
        text: decT(-rest),
        value: -rest,
        key: String(-rest),
        why: `This reads it as **sign-and-magnitude** (sign bit 1, then ${m(`${bits.slice(1)}_2 = ${rest}`)}). In two's complement the leading bit is worth $-128$.`,
      },
      {
        text: decT(-(255 - u)),
        value: -(255 - u),
        key: String(-(255 - u)),
        why: `This flips the bits (${m(`${fl}_2 = ${255 - u}`)}) but forgets to add 1 afterwards.`,
      },
      {
        text: decT(-v),
        value: -v,
        key: String(-v),
        why: `This finds the size of the number correctly but forgets the minus sign. A leading 1 means the value is negative.`,
      },
    ];
    const ds = pickDistinct(String(v), answer, pool);
    if (ds.length < 3) continue;
    return finish(
      {
        stem: `The 8-bit pattern ${binT(bits)} is a signed integer stored in **two's complement**. What decimal value does it represent?`,
        answer,
        answerValue: v,
        solution:
          `The leftmost bit is 1, so the number is negative.\n\n` +
          `**Method 1 (flip and add 1).** Flip every bit: ${m(`${fl}_2 = ${255 - u}`)}. Add 1: $${255 - u} + 1 = ${256 - u}$. So the value is $${v}$.\n\n` +
          `**Method 2 (negative top bit).** In 8-bit two's complement the leftmost place is worth $-128$ instead of $+128$:\n\n` +
          `$$-128 + ${restTerms.join(' + ')} = ${v}$$\n\n` +
          `Answer: ${answer}`,
        keyIdea: "In $n$-bit two's complement the leftmost bit is worth $-2^{n-1}$; all the other bits keep their usual positive place values.",
      },
      ds,
    );
  }
}

// ---------------------------------------------------------------- binary addition
const PLACE_NAMES = ['1s', '2s', '4s', '8s', '16s', '32s', '64s'];

function binaryAddition(rng: Rng): GeneratedCore {
  for (;;) {
    const a = rng.int(5, 31);
    const b = rng.int(3, 31);
    if (a === b || (a & b) === 0 || (a ^ b) < 4) continue;
    const sa = toBase(a, 2);
    const sb = toBase(b, 2);
    const w = Math.max(sa.length, sb.length);
    const pa = sa.padStart(w, '0');
    const pb = sb.padStart(w, '0');
    const sum = a + b;
    const ans = toBase(sum, 2);
    const answer = binT(ans);

    // column-by-column working
    const steps: string[] = [];
    let carry = 0;
    for (let i = 0; i < w; i++) {
      const da = Number(pa[w - 1 - i]);
      const db = Number(pb[w - 1 - i]);
      const tot = da + db + carry;
      steps.push(
        `- ${PLACE_NAMES[i]} column: digits ${da} and ${db}${carry ? ', plus the carry 1' : ''}, total ${tot}. Write ${tot % 2}, carry ${Math.floor(tot / 2)}.`,
      );
      carry = Math.floor(tot / 2);
    }
    if (carry) steps.push(`- The final carry 1 becomes a new ${PLACE_NAMES[w]} digit on the left.`);

    const decDigits = [...pa].map((c, i) => Number(c) + Number(pb[i])).join('').replace(/^0+/, '');
    const xor = toBase(a ^ b, 2);
    const or = toBase(a | b, 2);
    const pool: Cand[] = [
      {
        text: binT(xor),
        value: xor,
        key: String(a ^ b),
        why: `This writes 0 when a column adds to 2 but never carries the 1 into the next column. Ignoring the carries gives ${a ^ b} instead of ${sum}.`,
      },
      {
        text: binT(decDigits),
        value: decDigits,
        key: 'dec:' + decDigits,
        why: `This adds the columns like decimal digits, giving a digit 2. Binary only has the digits 0 and 1: a column total of 2 is written as 0 with a carry of 1.`,
      },
      {
        text: binT(or),
        value: or,
        key: String(a | b),
        why: `This treats $1 + 1$ as $1$ (like a logical OR) instead of $10_2$. Its value is ${a | b}, but $${a} + ${b} = ${sum}$.`,
      },
    ];
    if (sum >= 2 ** w) {
      const dropped = toBase(sum - 2 ** w, 2).padStart(w, '0');
      pool.push({
        text: binT(dropped),
        value: dropped,
        key: String(sum - 2 ** w),
        why: `This drops the final carry on the left. Nothing limits the answer to ${w} bits here, so the carry becomes a new leading 1.`,
      });
    }
    const ds = pickDistinct(String(sum), answer, pool);
    if (ds.length < 3) continue;
    return finish(
      {
        stem: `Calculate ${m(`${sa}_2 + ${sb}_2`)}, giving your answer in binary.`,
        answer,
        answerValue: ans,
        solution:
          `Line the numbers up on the right and add column by column. In binary $1 + 1 = 10_2$ (write 0, carry 1) and $1 + 1 + 1 = 11_2$ (write 1, carry 1).\n\n` +
          `| Number | ${[...pa].map((_, i) => String(2 ** (w - 1 - i))).join(' | ')} |\n` +
          `| --- | ${[...pa].map(() => '---').join(' | ')} |\n` +
          `| First | ${[...pa].join(' | ')} |\n` +
          `| Second | ${[...pb].join(' | ')} |\n\n` +
          steps.join('\n') +
          `\n\nResult: ${binT(ans)}. Check in decimal: $${a} + ${b} = ${sum}$.\n\n` +
          `Answer: ${answer}`,
        keyIdea: 'In binary addition $1 + 1 = 10_2$: write 0 and carry 1 into the next column, exactly like carrying a ten in decimal.',
      },
      ds,
    );
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-number-bases-convert',
    subtopic: 'number-bases',
    difficulty: 'foundation',
    title: 'Convert between binary, octal, decimal and hexadecimal',
    generate: convert,
  },
  {
    id: 'gen-number-bases-twos-complement',
    subtopic: 'number-bases',
    difficulty: 'exam',
    title: "8-bit two's complement: encode or decode a negative number",
    generate: twosComplement,
  },
  {
    id: 'gen-number-bases-binary-addition',
    subtopic: 'number-bases',
    difficulty: 'foundation',
    title: 'Add two binary numbers with carries',
    generate: binaryAddition,
  },
];
