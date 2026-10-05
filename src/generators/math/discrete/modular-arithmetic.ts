import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { gcd, lcm } from '../../../lib/frac';
import { m, power } from '../../../lib/tex';

type Cand = { v: number; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (value and rendered text). */
function pickDistinct(answer: number, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isInteger(c.v) || c.v < 0) continue;
    if (c.v === answer || String(c.v) === String(answer)) continue;
    if (out.some((x) => x.v === c.v)) continue;
    out.push(c);
  }
  return out;
}

function powMod(a: number, n: number, mod: number): number {
  let r = 1 % mod;
  let b = a % mod;
  let e = n;
  while (e > 0) {
    if (e & 1) r = (r * b) % mod;
    b = (b * b) % mod;
    e = Math.floor(e / 2);
  }
  return r;
}

/** Prime factorisation as [prime, exponent] pairs. */
function factorise(n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let p = 2; p * p <= n; p++) {
    let e = 0;
    while (n % p === 0) {
      n /= p;
      e++;
    }
    if (e) out.push([p, e]);
  }
  if (n > 1) out.push([n, 1]);
  return out;
}

/** "2^{3} \times 3 \times 5" (clean: no ^{1}). */
function factorTex(fs: [number, number][]): string {
  return fs.map(([p, e]) => power(String(p), e)).join(' \\times ');
}

const ordinal = (k: number): string => {
  const s = k % 100 >= 11 && k % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[k % 10] ?? 'th';
  return `${k}${s}`;
};

// ---------------------------------------------------------------- power cycles
interface PowCase {
  mode: 'digit' | 'mod';
  base: number;
  n: number;
  modulus: number;
  cycle: number[]; // cycle[i] = base^(i+1) mod modulus
}

/** Bases (mod m) whose powers repeat with a cycle of length 3 to 6 starting at the first power. */
const MOD_BASES: Record<number, number[]> = {
  7: [2, 3, 4, 5],
  9: [2, 4, 5, 7],
  11: [3, 4, 5, 9],
  13: [3, 4, 5, 8, 9, 10],
};

function makePowCase(rng: Rng): PowCase {
  if (rng.bool(0.5)) {
    const d = rng.pick([2, 3, 7, 8]);
    const base = d + 10 * rng.pick([0, 0, 1, 2, 3, 4]);
    const n = rng.int(21, 2099);
    const cycle = [1, 2, 3, 4].map((k) => powMod(base, k, 10));
    return { mode: 'digit', base, n, modulus: 10, cycle };
  }
  const modulus = rng.pick([7, 9, 11, 13]);
  const base = rng.pick(MOD_BASES[modulus]);
  const n = rng.int(20, 999);
  const cycle: number[] = [];
  let x = base % modulus;
  do {
    cycle.push(x);
    x = (x * base) % modulus;
  } while (cycle[cycle.length - 1] !== 1);
  return { mode: 'mod', base, n, modulus, cycle };
}

const powerCycle: Generator = {
  id: 'gen-modular-arithmetic-power-cycle',
  subtopic: 'modular-arithmetic',
  difficulty: 'exam',
  title: 'Last digit or remainder of a large power (cycles)',
  generate(rng) {
    const c = makePowCase(rng);
    const { base, n, modulus, cycle } = c;
    const L = cycle.length;
    const r = n % L;
    const pos = r === 0 ? L : r; // 1-based position in the cycle
    const answer = cycle[pos - 1];
    const powTex = `${base}^{${n}}`;

    const pool: Cand[] = [];
    if (r === 0) {
      // the classic slip: remainder 0 read as the start of the cycle
      pool.push({
        v: cycle[0],
        why: `This treats remainder 0 as "the start of the cycle" and takes the 1st entry. Remainder 0 means ${n} is a whole number of cycles, so the power is at the **end** of a cycle (the ${ordinal(L)} entry).`,
      });
    } else {
      // one step too far along the cycle
      pool.push({
        v: cycle[pos % L],
        why: `This reads one place too far along the cycle: remainder ${r} points to the ${ordinal(pos)} entry, not the ${ordinal((pos % L) + 1)}.`,
      });
      pool.push({
        v: cycle[L - 1],
        why: `This treats ${n} as a multiple of the cycle length ${L} (using the last entry of the cycle). But ${m(`${n} \\div ${L}`)} leaves remainder ${r}.`,
      });
    }
    if (c.mode === 'mod') {
      const e = n % modulus;
      pool.push({
        v: powMod(base, e, modulus),
        why: `This reduces the exponent by ${modulus} (the divisor) instead of by ${L} (the cycle length): ${m(`${n} \\bmod ${modulus} = ${e}`)}. The exponent must be reduced using the length of the cycle of remainders.`,
      });
      pool.push({
        v: powMod(base, n, 10),
        why: `This is the last digit of ${m(powTex)}, i.e. its remainder when divided by **10**. The question divides by ${modulus}.`,
      });
      if (r !== 0)
        pool.push({
          v: 1,
          why: `This spots that ${m(`${power(String(base), L)} \\equiv 1 \\pmod{${modulus}}`)} but treats ${n} as a multiple of ${L}, forgetting the leftover factor ${m(power(String(base), r))}.`,
        });
      pool.push({
        v: (base * n) % modulus,
        why: `This multiplies the base by the exponent (${m(`${base} \\times ${n}`)}) instead of raising it to that power.`,
      });
      pool.push({
        v: modulus - answer,
        why: `This is ${m(`${modulus} - ${answer}`)}: the distance from ${m(powTex)} **up** to the next multiple of ${modulus}. The remainder is measured **down** to the multiple below, so it is ${answer}.`,
      });
      if (r >= 2 && base ** r >= modulus)
        pool.push({
          v: base ** r,
          why: `This finds the right power, ${m(power(String(base), r))}, but forgets to divide it by ${modulus}: ${m(`${base ** r} = ${modulus} \\times ${Math.floor(base ** r / modulus)} + ${answer}`)}, and a remainder must be less than ${modulus}.`,
        });
    } else {
      const e = n % 10;
      if (e !== 0)
        pool.push({
          v: powMod(base, e, 10),
          why: `This uses the last digit of the exponent (${e}) as the power, instead of the remainder of ${n} divided by the cycle length ${L}.`,
        });
      pool.push({
        v: (base * n) % 10,
        why: `This is the last digit of ${m(`${base} \\times ${n}`)}: it multiplies the base by the exponent instead of raising it to that power.`,
      });
    }
    pool.push({
      v: r,
      why: `This writes down the remainder of ${m(`${n} \\div ${L}`)} (which is ${r}) itself, instead of using it to pick an entry from the cycle.`,
    });
    // misreading the cycle position by one place backwards
    pool.push({
      v: cycle[(pos - 2 + L) % L],
      why: `This reads one place too early in the cycle: remainder ${r} points to the ${ordinal(pos)} entry.`,
    });
    for (let k = 0; k < L; k++)
      pool.push({
        v: cycle[k],
        why: `This is the ${ordinal(k + 1)} entry of the cycle, which is what you get if you work out the remainder of ${m(`${n} \\div ${L}`)} wrongly as ${(k + 1) % L} instead of ${r}.`,
      });
    const ds = pickDistinct(answer, pool);

    const header = Array.from({ length: L }, (_, k) => ordinal(k + 1));
    let solution: string;
    let stem: string;
    if (c.mode === 'digit') {
      const d = base % 10;
      stem = `What is the last digit of ${m(powTex)}?`;
      solution =
        (base !== d ? `Only the last digit of the base matters, so ${m(powTex)} ends in the same digit as ${m(`${d}^{${n}}`)}.\n\n` : '') +
        `The last digits of the powers of ${d} repeat in a cycle:\n\n` +
        `| Power | ${header.join(' | ')} |\n| --- | ${header.map(() => '---').join(' | ')} |\n| Last digit | ${cycle.join(' | ')} |\n\n` +
        `The cycle has length ${L}.\n\n`;
    } else {
      stem = `What is the remainder when ${m(powTex)} is divided by ${modulus}?`;
      solution =
        `Work out the remainders of the powers of ${base} when divided by ${modulus}, until the remainder 1 appears:\n\n` +
        `| Power of ${base} | ${header.join(' | ')} |\n| --- | ${header.map(() => '---').join(' | ')} |\n| Remainder | ${cycle.join(' | ')} |\n\n` +
        `Since ${m(`${power(String(base), L)} \\equiv 1 \\pmod{${modulus}}`)}, the remainders repeat every ${L} powers.\n\n`;
    }
    const q = Math.floor(n / L);
    solution +=
      `Divide the exponent by the cycle length: ${m(r === 0 ? `${n} = ${L} \\times ${q}` : `${n} = ${L} \\times ${q} + ${r}`)}, remainder ${r}.\n\n` +
      (r === 0
        ? `Remainder 0 means a whole number of cycles, so we are at the **end** of a cycle: the ${ordinal(L)} entry, which is ${answer}.\n\n`
        : `Remainder ${r} means the ${ordinal(pos)} entry of the cycle, which is ${answer}.\n\n`) +
      `Answer: ${m(String(answer))}`;

    return {
      stem,
      answer: m(String(answer)),
      answerValue: answer,
      distractors: ds.map((d) => ({ text: m(String(d.v)), value: d.v, why: d.why })),
      solution,
      keyIdea:
        c.mode === 'digit'
          ? 'Last digits of powers repeat in a cycle: reduce the exponent by the cycle length (remainder 0 means the last entry of the cycle).'
          : 'If $a^k \\equiv 1 \\pmod{m}$, the remainders of powers of $a$ repeat every $k$ steps, so reduce the exponent modulo $k$.',
    };
  },
};

// ---------------------------------------------------------------- HCF / LCM
type GLKind = 'hcf' | 'lcm' | 'lcm-word' | 'hcf-word';

interface WordCtx {
  stem: (a: number, b: number) => string;
  unit: string;
  kind: 'lcm-word' | 'hcf-word';
}

const WORD: WordCtx[] = [
  {
    kind: 'lcm-word',
    stem: (a, b) => `Two warning lights flash together at time 0. One flashes every ${a} seconds and the other every ${b} seconds. After how many seconds do they next flash together?`,
    unit: 'seconds',
  },
  {
    kind: 'lcm-word',
    stem: (a, b) => `Two runners start together at the same point of a circular track. One completes a lap every ${a} seconds and the other every ${b} seconds. After how many seconds are they next together at the starting point?`,
    unit: 'seconds',
  },
  {
    kind: 'lcm-word',
    stem: (a, b) => `A server backs up file A every ${a} minutes and file B every ${b} minutes. Both backups run at midnight. After how many minutes do both backups next run at the same time?`,
    unit: 'minutes',
  },
  {
    kind: 'hcf-word',
    stem: (a, b) => `A rectangular floor measures ${a} cm by ${b} cm. It is to be covered exactly with identical square tiles, with no cutting. What is the side length, in cm, of the **largest** possible square tile?`,
    unit: 'cm',
  },
  {
    kind: 'hcf-word',
    stem: (a, b) => `A teacher has ${a} pencils and ${b} erasers. She wants to make identical packs using all of them, with no items left over. What is the **largest** number of packs she can make?`,
    unit: 'packs',
  },
];

function makePair(rng: Rng): { a: number; b: number } {
  for (;;) {
    const mk = () => 2 ** rng.int(0, 3) * 3 ** rng.int(0, 2) * 5 ** rng.int(0, 1) * 7 ** rng.int(0, rng.bool(0.3) ? 1 : 0);
    const a = mk();
    const b = mk();
    if (a < 12 || b < 12 || a > 360 || b > 360 || a === b) continue;
    const g = gcd(a, b);
    if (g === 1 || g === a || g === b) continue; // avoid coprime or one dividing the other
    return a < b ? { a, b } : { a: b, b: a };
  }
}

const hcfLcm: Generator = {
  id: 'gen-modular-arithmetic-hcf-lcm',
  subtopic: 'modular-arithmetic',
  difficulty: 'exam',
  title: 'HCF and LCM from prime factorisations',
  generate(rng) {
    const { a, b } = makePair(rng);
    const kindPick = rng.int(0, 3);
    const kind: GLKind = (['hcf', 'lcm', 'lcm-word', 'hcf-word'] as const)[kindPick];
    const ctx = kind === 'lcm-word' || kind === 'hcf-word' ? rng.pick(WORD.filter((w) => w.kind === kind)) : null;
    const g = gcd(a, b);
    const l = lcm(a, b);
    const fa = factorise(a);
    const fb = factorise(b);
    const fg = factorise(g);
    const fl = factorise(l);
    const primes = [...new Set([...fa, ...fb].map(([p]) => p))].sort((x, y) => x - y);
    const ex = (fs: [number, number][], p: number) => fs.find(([q]) => q === p)?.[1] ?? 0;
    // highest powers of the SHARED primes only
    const sharedMax = primes.filter((p) => ex(fa, p) && ex(fb, p)).reduce((acc, p) => acc * p ** Math.max(ex(fa, p), ex(fb, p)), 1);
    const smallestShared = fg[0][0];
    const isH = kind === 'hcf' || kind === 'hcf-word';
    const answer = isH ? g : l;

    const pool: Cand[] = isH
      ? [
          { v: l, why: `This is the **lowest common multiple**, which uses the higher power of every prime. The HCF must divide both numbers, so it cannot be bigger than ${a}.` },
          {
            v: sharedMax,
            why: `This takes the shared primes with the **higher** power. For the HCF you must take the **lower** power, otherwise the result does not divide both numbers.`,
          },
          {
            v: g / smallestShared,
            why: `This is a common factor, but not the highest: one factor of ${smallestShared} that both numbers share has been missed.`,
          },
          { v: a * b, why: `This multiplies the two numbers. The product is a common **multiple**; the HCF is a common **factor**.` },
          { v: b - a, why: `This subtracts the two numbers. The difference is not, in general, a factor of both.` },
        ]
      : [
          { v: a * b, why: `This multiplies the two numbers: ${m(`${a} \\times ${b} = ${a * b}`)}. That is a common multiple, but not the lowest, because ${a} and ${b} share the factor ${g}.` },
          { v: g, why: `This is the **highest common factor**. You need a common **multiple**, which must be at least as big as ${b}.` },
          {
            v: sharedMax,
            why: `This only uses the primes that appear in **both** numbers. The LCM must include every prime that appears in either number.`,
          },
          ...(kind === 'lcm-word' ? [{ v: a + b, why: `This adds the two intervals. At ${a + b} ${ctx!.unit} the first event is not due (it is not a multiple of ${a}).` }] : []),
          { v: (a * b) / (g * g), why: `This divides the product by the HCF twice. The rule is ${m('\\operatorname{lcm} = \\frac{ab}{\\gcd}')}, dividing by the HCF only once.` },
        ];
    // genuine fallbacks: other common multiples / factors
    if (isH) for (const p of [2, 3, 5, 7]) if (g % p === 0) pool.push({ v: g / p, why: `This is a common factor but not the highest: a shared factor ${p} has been left out.` });
    for (const k of [2, 3, 4]) pool.push({ v: isH ? g * k : l * k, why: isH ? `This number does not divide both ${a} and ${b}, so it is not a common factor.` : `This is a common multiple, but not the **lowest** one: ${l} comes first.` });
    const ds = pickDistinct(answer, pool);

    const stem =
      kind === 'hcf'
        ? `What is the highest common factor (HCF) of ${m(String(a))} and ${m(String(b))}?`
        : kind === 'lcm'
          ? `What is the lowest common multiple (LCM) of ${m(String(a))} and ${m(String(b))}?`
          : ctx!.stem(a, b);

    const lines = primes.map((p) => {
      const ea = ex(fa, p);
      const eb = ex(fb, p);
      const use = isH ? Math.min(ea, eb) : Math.max(ea, eb);
      return `- prime ${p}: power ${ea} in ${a}, power ${eb} in ${b}, so use ${use === 0 ? 'none' : m(power(String(p), use))}`;
    });
    const why =
      kind === 'lcm-word'
        ? `The events coincide after a number of ${ctx!.unit} that is a multiple of both ${a} and ${b}; the **first** such time is the LCM.\n\n`
        : kind === 'hcf-word'
          ? `The answer must divide both ${a} and ${b} exactly, and we want the **largest** such number: the HCF.\n\n`
          : '';
    const solution =
      why +
      `Write both numbers as products of primes:\n\n` +
      `- ${m(`${a} = ${factorTex(fa)}`)}\n- ${m(`${b} = ${factorTex(fb)}`)}\n\n` +
      (isH ? 'For the HCF take each prime with the **lower** power (a prime missing from one number is left out):\n\n' : 'For the LCM take every prime with the **higher** power:\n\n') +
      lines.join('\n') +
      '\n\n' +
      `${m(`${isH ? '\\gcd' : '\\operatorname{lcm}'}(${a}, ${b}) = ${factorTex(isH ? fg : fl)} = ${answer}`)}\n\n` +
      `Check: ${m(`\\gcd \\times \\operatorname{lcm} = ${g} \\times ${l} = ${g * l}`)} and ${m(`${a} \\times ${b} = ${a * b}`)}, which agree.\n\n` +
      `Answer: ${m(String(answer))}`;

    return {
      stem,
      answer: m(String(answer)),
      answerValue: answer,
      distractors: ds.map((d) => ({ text: m(String(d.v)), value: d.v, why: d.why })),
      solution,
      keyIdea: isH
        ? 'HCF = product of the shared primes with the LOWER power; "largest that divides both" is an HCF question.'
        : 'LCM = product of every prime with the HIGHER power; "when do they next coincide" is an LCM question.',
    };
  },
};

// ---------------------------------------------------------------- counting divisors
const countDivisorsGen: Generator = {
  id: 'gen-modular-arithmetic-count-divisors',
  subtopic: 'modular-arithmetic',
  difficulty: 'exam',
  title: 'Count the divisors of a number from its prime factorisation',
  generate(rng) {
    let fs: [number, number][];
    let n: number;
    for (;;) {
      const k = rng.pick([2, 2, 3]);
      const ps = rng.sample([2, 3, 5, 7, 11], k).sort((x, y) => x - y);
      const maxE: Record<number, number> = { 2: 5, 3: 3, 5: 2, 7: 2, 11: 1 };
      fs = ps.map((p) => [p, rng.int(1, maxE[p])] as [number, number]);
      n = fs.reduce((acc, [p, e]) => acc * p ** e, 1);
      if (n >= 24 && n <= 5000 && fs.some(([, e]) => e > 1)) break;
    }
    const exps = fs.map(([, e]) => e);
    const total = exps.reduce((acc, e) => acc * (e + 1), 1);
    const has2 = fs[0][0] === 2;
    const evenMode = has2 && rng.bool(0.3);
    const e2 = has2 ? fs[0][1] : 0;
    const oddCount = total / (e2 + 1);
    const evenCount = total - oddCount;
    const answer = evenMode ? evenCount : total;

    const prodE = exps.reduce((a, e) => a * e, 1);
    const sumE = exps.reduce((a, e) => a + e, 0);
    const sumE1 = exps.reduce((a, e) => a + e + 1, 0);
    const pool: Cand[] = evenMode
      ? [
          { v: total, why: `This is the total number of divisors, ${total}; it includes the ${oddCount} odd ones.` },
          { v: oddCount, why: `This is the number of **odd** divisors (power of 2 equal to 0). The even divisors are all the others.` },
          {
            v: e2 + oddCount,
            why: `This adds the ${e2 === 1 ? '1 choice' : `${e2} choices`} for the power of 2 and the ${oddCount} choices for the other primes, instead of multiplying them.`,
          },
          { v: total / 2, why: `This assumes exactly half the divisors are even. That is only true when the power of 2 is 1.` },
          { v: total - 1, why: `This removes only the divisor 1, but every odd divisor must be removed.` },
        ]
      : [
          { v: prodE, why: `This multiplies the exponents (${exps.join(' and ')}) without adding 1 to each. Every exponent can also be 0, which gives one extra choice for each prime.` },
          { v: sumE + 1, why: `This adds the exponents and then adds 1. The choices for different primes are independent, so they must be **multiplied**.` },
          { v: sumE1, why: `This adds the numbers of choices, ${exps.map((e) => e + 1).join(' + ')}. The choices for different primes are independent, so they must be **multiplied**.` },
          { v: total - 2, why: `This leaves out 1 and ${n} itself, but the question counts all positive divisors, including those two.` },
          { v: total / 2, why: `This counts factor **pairs** (like ${m(`1 \\times ${n}`)}); each pair contains two divisors.` },
          { v: sumE, why: `This counts the prime factors with repetition (the sum of the exponents), not the divisors.` },
        ];
    for (let k = 1; k <= 6; k++) pool.push({ v: answer + k, why: `This over-counts: the formula ${m('(a + 1)(b + 1) \\cdots')} gives exactly ${total} divisors in total, with no extras.` });
    const ds = pickDistinct(answer, pool);

    const ftex = factorTex(fs);
    const choiceList = fs.map(([p, e]) => `- power of ${p}: from 0 to ${e}, which is ${e + 1} choices`).join('\n');
    const prodTex = exps.map((e) => `(${e} + 1)`).join('');
    let solution =
      `First write ${m(String(n))} as a product of primes: ${m(`${n} = ${ftex}`)}.\n\n` +
      `Every divisor is made by choosing a power of each prime, from 0 up to the power in ${n}:\n\n${choiceList}\n\n` +
      `Total number of divisors: ${m(`${prodTex} = ${exps.map((e) => e + 1).join(' \\times ')} = ${total}`)}.\n\n`;
    if (evenMode) {
      const rest = fs.slice(1);
      solution +=
        `A divisor is **odd** when the power of 2 is 0. Then only the other primes are chosen: ${m(rest.map(([, e]) => `(${e} + 1)`).join('') + ` = ${oddCount}`)} odd divisors.\n\n` +
        `Even divisors: ${m(`${total} - ${oddCount} = ${evenCount}`)}.\n\n` +
        (e2 === 1
          ? `(Directly: the power of 2 must be exactly 1, which is 1 choice, so there are as many even divisors as odd ones: ${evenCount}.)\n\n`
          : `(Directly: the power of 2 must be from 1 to ${e2}, which is ${e2} choices, so ${m(`${e2} \\times ${oddCount} = ${evenCount}`)}.)\n\n`);
    }
    solution += `Answer: ${m(String(answer))}`;

    return {
      stem: evenMode
        ? `How many of the positive divisors of ${m(String(n))} are **even**?`
        : `How many positive divisors does ${m(String(n))} have (including 1 and ${n})?`,
      answer: m(String(answer)),
      answerValue: answer,
      distractors: ds.map((d) => ({ text: m(String(d.v)), value: d.v, why: d.why })),
      solution,
      keyIdea: evenMode
        ? 'Count divisors by choosing a power of each prime; for even divisors the power of 2 must be at least 1.'
        : 'If $n = p^a q^b \\cdots$, then $n$ has $(a + 1)(b + 1) \\cdots$ positive divisors.',
    };
  },
};

export const generators: Generator[] = [powerCycle, hcfLcm, countDivisorsGen];
