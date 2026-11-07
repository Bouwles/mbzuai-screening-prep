import type { Generator } from '../../../types';
import { steps as stepsOf, table as tbl } from '../../../lib/explanation';
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

    const ans = m(String(answer));
    const q = Math.floor(n / L);
    const dividePower = `Divide the power by the cycle length to find the place in the cycle: ${m(r === 0 ? `${n} = ${L} \\times ${q}` : `${n} = ${L} \\times ${q} + ${r}`)}, so the remainder is ${r}.`;
    const readCycle =
      r === 0
        ? `Remainder 0 means a whole number of cycles, so we land on the last place of the cycle. The ${ordinal(L)} place holds ${answer}.`
        : `Remainder ${r} means the ${ordinal(pos)} place in the cycle ${cycle.join(', ')}, which is ${answer}.`;

    let stem: string;
    let asking: string;
    let solution: string;
    let conclusion: string;
    if (c.mode === 'digit') {
      const d = base % 10;
      stem = `What is the last digit of ${m(powTex)}?`;
      asking = `What digit does ${m(powTex)} end in?`;
      // one row per power, plus one more to show the first digit coming back
      const rows = [[ordinal(1), m(String(d)), d] as (string | number)[]];
      for (let k = 2; k <= L + 1; k++) {
        const prev = cycle[k - 2];
        rows.push([ordinal(k), m(`${prev} \\times ${d} = ${prev * d}`), (prev * d) % 10]);
      }
      solution = stepsOf(
        `We can't work out this huge number, so we look for a pattern. The last digit of a product depends only on the last digits of the numbers being multiplied.${base !== d ? ` So ${m(powTex)} ends in the same digit as ${m(`${d}^{${n}}`)}.` : ''}`,
        `Work out the powers of ${d}. For each one, multiply the last digit so far by ${d} and keep only the last digit:\n\n${tbl([`Power of ${d}`, 'Working', 'Last digit'], rows)}`,
        `The last digit repeats in a cycle of length ${L}: ${cycle.join(', ')}, then ${cycle[0]} again.`,
        dividePower,
        readCycle,
      );
      conclusion = `The power ${n} lands on the ${ordinal(pos)} place of the cycle, so ${m(powTex)} ends in ${ans}.`;
    } else {
      stem = `What is the remainder when ${m(powTex)} is divided by ${modulus}?`;
      asking = `What is left over when ${m(powTex)} is divided by ${modulus}?`;
      const rows = [[ordinal(1), m(String(base)), cycle[0]] as (string | number)[]];
      for (let k = 2; k <= L + 1; k++) {
        const prev = cycle[k - 2];
        rows.push([ordinal(k), m(`${prev} \\times ${base} = ${prev * base}`), (prev * base) % modulus]);
      }
      solution = stepsOf(
        `We can't work out this huge number directly, so we look for a pattern in the remainders of small powers of ${base}. A remainder is what is left over after dividing.`,
        `For each power, multiply the last remainder by ${base}, then divide by ${modulus} and keep the remainder:\n\n${tbl([`Power of ${base}`, 'Working', `Remainder after dividing by ${modulus}`], rows)}`,
        `The remainders repeat in a cycle of length ${L}: ${cycle.join(', ')}, then ${cycle[0]} again.`,
        dividePower,
        readCycle,
      );
      conclusion = `The power ${n} lands on the ${ordinal(pos)} place of the cycle, so the remainder is ${ans}.`;
    }

    return {
      stem,
      answer: ans,
      answerValue: answer,
      distractors: ds.map((d) => ({ text: m(String(d.v)), value: d.v, why: d.why })),
      asking,
      solution,
      conclusion,
      keyIdea:
        c.mode === 'digit'
          ? 'For the last digit of a big power, list the first few last digits until they repeat, then divide the power by the cycle length. The remainder gives the place in the cycle, and remainder 0 means the last place.'
          : 'For the remainder of a huge power, list the remainders of small powers until they repeat. Then find the place in the cycle by dividing the power by the cycle length. Remainder 0 means the last place.',
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
    stem: (a, b) => `Two lights flash together at time 0, one every ${a} seconds and the other every ${b} seconds. After how many seconds do they next flash together?`,
    unit: 'seconds',
  },
  {
    kind: 'hcf-word',
    stem: (a, b) => `Identical packs use up ${a} pencils and ${b} erasers with nothing left over. What is the **largest** possible number of packs?`,
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

    const ans = m(String(answer));
    const primeRows = primes.map((p) => {
      const ea = ex(fa, p);
      const eb = ex(fb, p);
      const use = isH ? Math.min(ea, eb) : Math.max(ea, eb);
      return [p, ea, eb, use === 0 ? 'none' : m(power(String(p), use))];
    });
    const chosen = isH ? fg : fl;
    const chain = [factorTex(chosen), chosen.map(([p, e]) => p ** e).join(' \\times '), String(answer)].filter((x, i, all) => i === 0 || x !== all[i - 1]);
    const intro: Record<GLKind, string> = {
      hcf: 'The **highest common factor** (HCF) is the biggest number that divides both numbers exactly.',
      lcm: 'The **lowest common multiple** (LCM) is the smallest number that both numbers divide into exactly.',
      'lcm-word': `The first light flashes at multiples of ${a} seconds, and the second at multiples of ${b}. They flash together at a multiple of both, and the next such time is the **lowest common multiple** (LCM).`,
      'hcf-word': `The number of packs must divide both ${a} and ${b} exactly, so that nothing is left over. The largest such number is the **highest common factor** (HCF).`,
    };
    const solution = stepsOf(
      intro[kind],
      `Write each number as a product of primes (numbers divisible only by 1 and themselves): ${m(`${a} = ${factorTex(fa)}`)} and ${m(`${b} = ${factorTex(fb)}`)}.`,
      (isH
        ? 'For the HCF, take each prime with its **lower** power, because that is all both numbers share. A prime missing from one number has power 0, so it is left out:'
        : 'For the LCM, take each prime with its **higher** power, so that the result contains everything from both numbers:') +
        `\n\n${tbl(['Prime', `Power in ${a}`, `Power in ${b}`, 'Use'], primeRows)}`,
      chain.length > 1 ? `Multiply the chosen powers: ${m(chain.join(' = '))}.` : `Only one prime is chosen, so the result is ${m(chain[0])}.`,
    );
    const finalWords: Record<GLKind, string> = {
      hcf: `so the HCF is ${ans}`,
      lcm: `so the LCM is ${ans}`,
      'lcm-word': `so they next flash together after ${ans} seconds`,
      'hcf-word': `so the largest number of packs is ${ans}`,
    };
    const asking: Record<GLKind, string> = {
      hcf: `What is the biggest number that divides both ${a} and ${b} exactly?`,
      lcm: `What is the smallest number that both ${a} and ${b} divide into exactly?`,
      'lcm-word': `What is the first time that is a multiple of both ${a} and ${b}?`,
      'hcf-word': `What is the biggest number that divides both ${a} and ${b} exactly?`,
    };

    return {
      stem,
      answer: m(String(answer)),
      answerValue: answer,
      distractors: ds.map((d) => ({ text: m(String(d.v)), value: d.v, why: d.why })),
      asking: asking[kind],
      solution,
      conclusion: `Check: ${isH ? `the **lowest common multiple** (LCM), the smallest number both divide into, is ${l}` : `the **highest common factor** (HCF), the biggest number dividing both, is ${g}`}. HCF $\\times$ LCM ${m(`= ${g} \\times ${l} = ${g * l}`)}, the same as ${m(`${a} \\times ${b}`)}, ${finalWords[kind]}.`,
      keyIdea: isH
        ? 'For the HCF, write both numbers as primes and multiply what they share, using the lower power of each prime. "Largest that divides both" signals an HCF question.'
        : 'For the LCM, write both numbers as primes and multiply every prime, using the higher power of each. "When do they next happen together" signals an LCM question.',
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
    const ans = m(String(answer));
    // the division table behind the factorisation
    const divRows: (string | number)[][] = [];
    let left = n;
    for (const [p, e] of fs)
      for (let i = 0; i < e; i++) {
        divRows.push([left, p, left / p]);
        left /= p;
      }
    const powersAllowed = (p: number, e: number) => {
      const low = evenMode && p === 2 ? 1 : 0;
      return e === low ? String(e) : `${low} to ${e}`;
    };
    const choices = fs.map(([p, e]) => (evenMode && p === 2 ? e : e + 1));
    const multiply = m(`${choices.join(' \\times ')} = ${answer}`);
    const solution = stepsOf(
      `Start with the prime factorisation, which writes ${n} as a product of primes (numbers divisible only by 1 and themselves). Keep dividing by the smallest prime that works:\n\n${tbl(['Number', 'Divide by', 'Result'], divRows)}`,
      `Count how many times each prime was used. That gives ${m(`${n} = ${ftex}`)}.`,
      `Any divisor of ${n} is made from these primes, using each one up to the power shown. ${
        evenMode ? 'An **even** divisor must contain at least one 2, so the power of 2 cannot be 0. The other primes may be left out:' : 'Leaving a prime out (power 0) is allowed:'
      }\n\n${tbl(['Prime', 'Powers allowed', 'Choices'], fs.map(([p, e], i) => [p, powersAllowed(p, e), choices[i]]))}`,
      `Each set of choices builds a different divisor, so multiply: ${multiply}.`,
    );

    return {
      stem: evenMode
        ? `How many of the positive divisors of ${m(String(n))} are **even**?`
        : `How many positive divisors does ${m(String(n))} have (including 1 and ${n})?`,
      answer: m(String(answer)),
      answerValue: answer,
      distractors: ds.map((d) => ({ text: m(String(d.v)), value: d.v, why: d.why })),
      asking: evenMode ? `How many divisors of ${n} are even?` : `How many whole numbers divide ${n} exactly?`,
      solution,
      conclusion: evenMode
        ? `The power of 2 has ${e2} ${e2 === 1 ? 'choice' : 'choices'} and the other primes give ${oddCount} combinations, so ${ans} divisors are even.`
        : `Every divisor comes from exactly one set of choices, so ${n} has ${ans} divisors.`,
      keyIdea: evenMode
        ? 'Count divisors by choosing a power of each prime. For even divisors the power of 2 must be at least 1, so it has one choice fewer. Multiply that by the choices for the other primes.'
        : 'Write $N = p^a \\times q^b$ using primes. The number of divisors is then $(a + 1)(b + 1)$. Add 1 to each power because using none of that prime is allowed.',
    };
  },
};

export const generators: Generator[] = [powerCycle, hcfLcm, countDivisorsGen];
