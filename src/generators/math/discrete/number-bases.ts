import type { Generator, GeneratedCore } from '../../../types';
import { steps as stepsOf, table as tbl } from '../../../lib/explanation';
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

/** Table of place values and digits, with an optional extra row. */
function placeTable(digits: string, base: number, label = 'Digit', extra?: (string | number)[]): string {
  const L = digits.length;
  const pv = [...digits].map((_, i) => base ** (L - 1 - i));
  return tbl(['Place value', ...pv], [[label, ...digits], ...(extra ? [extra] : [])]);
}

/** "32, 16, 4 and 1". */
function listAnd(xs: (string | number)[]): string {
  return xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
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
          asking: `What is ${binT(s)} written as an ordinary number?`,
          solution: stepsOf(
            'The small 2 means base 2, also called **binary**. Each place is worth double the place to its right, starting with 1 on the far right.',
            `Write the digits under their place values:\n\n${placeTable(s, 2)}`,
            ones.length === 1
              ? `A 1 means that place value counts, and a 0 means it doesn't. Only one place holds a 1, so the value is ${n}.`
              : `A 1 means that place value counts, and a 0 means it doesn't. So add the place values above the 1s: ${m(`${ones.join(' + ')} = ${n}`)}.`,
          ),
          conclusion:
            ones.length === 1
              ? `The only place holding a 1 is worth ${answer}.`
              : `The places holding a 1 are worth ${listAnd(ones)}, which add up to ${answer}.`,
          keyIdea: 'To convert from any base to decimal, write the place values above the digits, starting with 1 on the right and multiplying by the base each time. Multiply each digit by its place value, then add.',
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
          why: `This is the right digits in reverse order. The largest place value belongs on the left, and the units digit belongs on the right.`,
        },
        {
          text: binT(unitsFlipped),
          value: unitsFlipped,
          key: String(n ^ 1),
          why:
            n % 2 === 1
              ? `This ends in 0, but ${n} is odd, so its binary form must end in 1. Every other place value is even, so only the units place can make the total odd.`
              : `This ends in 1, but ${n} is even, so its binary form must end in 0. Every other place value is even, so a 1 in the units place would make the total odd.`,
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
          why: `This leaves off the units digit on the right. Every place needs a digit, and without it ${binT(lastLost)} is only ${fromBase(lastLost, 2)}.`,
        },
      ];
      const ds = pickDistinct(String(n), answer, pool);
      if (ds.length < 3) continue;
      const ones = [...s].map((c, i) => (c === '1' ? 2 ** (s.length - 1 - i) : 0)).filter((x) => x > 0);
      const places = [...s].map((_, i) => 2 ** (s.length - 1 - i));
      let left = n;
      const buildRows = places.map((p, i) => {
        if (s[i] === '0') return [p, 'No', left, 0];
        const row = [p, 'Yes', m(`${left} - ${p} = ${left - p}`), 1];
        left -= p;
        return row;
      });
      return finish(
        {
          stem: `Write the decimal number $${n}$ in binary.`,
          answer,
          answerValue: s,
          asking: `How do we write ${n} using only 1s and 0s?`,
          solution: stepsOf(
            `In binary the places are worth ${listAnd(places)}, each double the next. We build ${n} from these, using each place at most once.`,
            `Go through the places from largest to smallest. If a place value fits into what is left, write 1 and subtract it. If not, write 0:\n\n${tbl(['Place', 'Fits?', 'Left over', 'Digit'], buildRows)}`,
            `Read the Digit column from top to bottom: ${s}.`,
          ),
          conclusion:
            ones.length === 1
              ? `${n} is exactly one place value, so in binary it is ${answer}.`
              : `${m(`${ones.join(' + ')} = ${n}`)}, so in binary it is ${answer}.`,
          keyIdea: 'Decimal to binary: write the powers of 2 up to the number. Working from the largest, write 1 and subtract if it fits, and write 0 if it does not. Keep the zeros, since they hold the places.',
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
      return finish(
        {
          stem: `Convert the hexadecimal number ${hexT(h)} to decimal.`,
          answer,
          answerValue: n,
          asking: `What is the hexadecimal number ${hexT(h)} as an ordinary number?`,
          solution: stepsOf(
            '**Hexadecimal** is base 16. It needs 16 digits, so after 9 it uses letters: A is 10, B is 11, C is 12, D is 13, E is 14 and F is 15.',
            `In base 16 the rightmost place is worth 1 and the next place is worth 16. So ${h[0]} is in the 16s place and ${h[1]} is in the units place. Their values are ${d1} and ${d0}.`,
            `Multiply each digit by its place value: ${m(`${d1} \\times 16 = ${16 * d1}`)} and ${m(`${d0} \\times 1 = ${d0}`)}.`,
            `Add the two results: ${m(`${16 * d1} + ${d0} = ${n}`)}.`,
          ),
          conclusion: `${d1} ${d1 === 1 ? 'sixteen' : 'sixteens'} and ${d0} ${d0 === 1 ? 'one' : 'ones'} make ${answer}.`,
          keyIdea: 'Hexadecimal to decimal: turn letters into numbers (A is 10 up to F is 15), then multiply the left digit by 16 and add the right digit. For longer numbers the places are 1, 16, 256.',
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
          why: `This puts the digits the wrong way round. The number of 16s goes on the left, and the remainder ${r} is the units digit, on the **right**.`,
        });
      const cat = `${q}${r}`;
      pool.push({
        text: m(`${cat}_{16}`),
        value: cat,
        key: String(fromBase(cat, 16)),
        why: `This writes ${
          q >= 10 && r >= 10
            ? `both values, ${q} and ${r}, as two decimal digits each`
            : q >= 10
              ? `the value ${q} as two decimal digits`
              : `the value ${r} as two decimal digits`
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
          asking: `What is ${n} written in base 16?`,
          solution: stepsOf(
            `Hexadecimal places are worth 1, then 16, then 256. Since 256 is bigger than ${n}, we only need the 16s place and the units place.`,
            `Find how many 16s fit into ${n}. ${m(`16 \\times ${q} = ${16 * q}`)} fits, and ${m(`16 \\times ${q + 1} = ${16 * (q + 1)}`)} is too big. So ${q} sixteens fit.`,
            `The remainder (what is left over) goes in the units place: ${m(`${n} - ${16 * q} = ${r}`)}.`,
            `In hexadecimal the values 10 to 15 are the letters A to F: A is 10, B is 11, C is 12, D is 13, E is 14 and F is 15. So the 16s digit is ${DIGITS[q]} and the units digit is ${DIGITS[r]}, which gives ${h}.`,
          ),
          conclusion: `${m(`${q} \\times 16 + ${r} = ${n}`)}, so the number in hexadecimal is ${answer}.`,
          keyIdea: 'Decimal to hex: divide by 16. The whole-number result is the left digit and the remainder is the right digit. Write values from 10 to 15 as A to F. Ignore any decimal places shown on a calculator.',
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
        asking: `What is ${octT(o)} as an ordinary number?`,
        solution: stepsOf(
          '**Octal** is base 8. Each place is worth 8 times the place to its right: 1, then 8, then $8 \\times 8 = 64$.',
          `Line up the digits under those places and multiply each digit by its place value:\n\n${placeTable(o, 8, 'Digit', ['Digit $\\times$ place', 64 * a, 8 * b, c])}`,
          `Add the bottom row: ${m(`${64 * a} + ${8 * b} + ${c} = ${n}`)}.`,
        ),
        conclusion: `${m(`${a} \\times 64 + ${b} \\times 8 + ${c}`)} comes to ${answer}.`,
        keyIdea: 'In base $b$, the places from the right are 1, $b$, $b^2$, and so on. Multiply each digit by its place value and add. Every digit must be smaller than $b$.',
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
      const kTerms = [128, 64, 32, 16, 8, 4, 2, 1].filter((p) => (k & p) !== 0);
      const negTerms = [64, 32, 16, 8, 4, 2, 1].filter((p) => ((128 - k) & p) !== 0);
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
          asking: `What pattern of 8 bits stores $-${k}$ in two's complement?`,
          solution: stepsOf(
            "**Two's complement** is the usual way to store negative whole numbers in bits (binary digits, each 0 or 1). The recipe is: write the positive number, flip every bit, then add 1.",
            `Write ${k} in 8 bits. ${kTerms.length === 1 ? `${k} is a single place value` : m(`${k} = ${kTerms.join(' + ')}`)}, so it is ${m(pos)}.`,
            `Flip every bit, so each 0 becomes 1 and each 1 becomes 0: ${m(fl)}.`,
            fl.endsWith('0')
              ? `Add 1. The last digit is 0, so it simply becomes 1: ${m(ans)}.`
              : `Add 1. In binary $1 + 1$ is written $10_2$, so the 1s at the end turn into 0s and the carry lands on the first 0 to their left: ${m(ans)}.`,
          ),
          conclusion: `Check, with the leftmost bit worth $-128$: ${m(`-128 + ${negTerms.join(' + ')} = -${k}`)}. So the pattern is ${answer}.`,
          keyIdea: "To negate in two's complement: write the positive value in the full number of bits, flip every bit, add 1. To check, treat the leftmost bit as negative (here $-128$) and add the place values.",
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
        asking: `What number does the bit pattern ${binT(bits)} stand for in two's complement?`,
        solution: stepsOf(
          "In **two's complement**, every place has its normal value, except that the leftmost place counts as negative. In 8 bits (binary digits, each 0 or 1) the places are $-128, 64, 32, 16, 8, 4, 2, 1$.",
          `Write the bits under the places:\n\n${tbl(['Place value', '$-128$', 64, 32, 16, 8, 4, 2, 1], [['Bit', ...bits]])}`,
          `A 1 means that place value counts. So add the values above the 1s: ${m(`-128 + ${restTerms.join(' + ')}`)}.`,
          restTerms.length === 1
            ? `Work it out: ${m(`-128 + ${rest} = ${v}`)}.`
            : `First add the positive places: ${m(`${restTerms.join(' + ')} = ${rest}`)}. Then ${m(`-128 + ${rest} = ${v}`)}.`,
        ),
        conclusion: `The leftmost bit gives $-128$ and the others add back ${rest}, so the value is ${answer}.`,
        keyIdea: "Two's complement to decimal: give the leftmost bit a negative place value ($-2^{n-1}$ for $n$ bits) and add as usual. A leading 0 means a positive number, which you read as normal.",
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
    const rows: (string | number)[][] = [];
    let carry = 0;
    for (let i = 0; i < w; i++) {
      const da = Number(pa[w - 1 - i]);
      const db = Number(pb[w - 1 - i]);
      const tot = da + db + carry;
      rows.push([PLACE_NAMES[i], da, db, carry, tot, tot % 2, Math.floor(tot / 2)]);
      carry = Math.floor(tot / 2);
    }

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
        asking: 'What do you get by adding these two binary numbers?',
        solution: stepsOf(
          'Add column by column from the right, like ordinary addition. In binary, $1 + 1$ is 2, which is written $10_2$: write 0 and carry 1. And $1 + 1 + 1$ is 3, which is written $11_2$: write 1 and carry 1.',
          `Line the numbers up on the right as ${pa} and ${pb}, then work through the columns:\n\n${tbl(['Column', 'Top digit', 'Bottom digit', 'Carry in', 'Total', 'Write', 'Carry out'], rows)}`,
          carry
            ? `The final carry of 1 becomes a new digit on the far left. Reading the Write column from bottom to top, with that carry first, gives ${ans}.`
            : `Reading the Write column from bottom to top gives ${ans}.`,
        ),
        conclusion: `Check: ${binT(sa)} is ${a} and ${binT(sb)} is ${b}, and ${m(`${a} + ${b} = ${sum}`)}. So the sum is ${answer}.`,
        keyIdea: 'Binary addition: work right to left. Total 0 or 1: write it. Total 2: write 0 and carry 1. Total 3: write 1 and carry 1. Convert both numbers to decimal as a check.',
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
