import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { gcd } from '../../../lib/frac';
import { dm, m, num } from '../../../lib/tex';

/** Money as plain text: whole numbers stay whole, anything else gets exactly 2 decimal places. */
const money = (x: number): string => {
  const r = Math.round(x * 100) / 100;
  return `AED ${Number.isInteger(r) ? String(r) : r.toFixed(2)}`;
};
/** Money always with 2 decimal places (for "give your answer to 2 d.p." questions). */
const money2 = (x: number): string => `AED ${x.toFixed(2)}`;
const round2 = (x: number): number => Math.round(x * 100) / 100;

interface Cand {
  value: number;
  text: string;
  why: string;
}

/** Keep the first 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistractors(answer: Cand, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(c.value) || c.value <= 0) continue;
    const clash = [answer, ...out].some((o) => Math.abs(o.value - c.value) < 0.005 || o.text === c.text);
    if (clash) continue;
    out.push(c);
  }
  return out;
}

/**
 * value of P * (M / 1000)^n rounded half-up to the nearest cent, computed exactly with BigInt
 * (M is the yearly multiplier in thousandths, e.g. 1.025 -> 1025).
 */
function compoundCents(P: number, M: number, n: number): number {
  const numer = BigInt(P) * 100n * BigInt(M) ** BigInt(n);
  const denom = 1000n ** BigInt(n);
  const cents = (2n * numer + denom) / (2n * denom);
  return Number(cents) / 100;
}

// ------------------------------------------------------------------ reverse percentages
const genReverse: Generator = {
  id: 'gen-percentages-ratio-reverse',
  subtopic: 'percentages-ratio',
  difficulty: 'exam',
  title: 'Reverse percentage: find the original price',
  generate(rng: Rng) {
    const p = rng.pick([5, 10, 15, 20, 25, 30, 35, 40] as const);
    const up = rng.bool();
    const original = 20 * rng.int(5, 100);
    const newPct = up ? 100 + p : 100 - p;
    const final = (original * newPct) / 100; // integer because original is a multiple of 20 and p of 5
    const mult = newPct / 100;
    const multTex = num(mult);
    const oppMult = up ? (100 - p) / 100 : (100 + p) / 100;

    const item = rng.pick(['jacket', 'laptop', 'sofa', 'bicycle', 'watch', 'printer', 'tablet', 'camera'] as const);
    const stem = up
      ? rng.pick([
          `The price of a ${item} is increased by ${p}%. The new price is ${money(final)}. What was the price **before** the increase?`,
          `After a ${p}% price rise, a ${item} costs ${money(final)}. What did it cost before the rise?`,
        ])
      : rng.pick([
          `In a sale, the price of a ${item} is reduced by ${p}%. The sale price is ${money(final)}. What was the original price?`,
          `A ${item} is sold at ${p}% off. A customer pays ${money(final)}. What was the price before the discount?`,
        ]);

    const answer: Cand = { value: original, text: money(original), why: '' };
    const pool: Cand[] = [
      {
        value: round2(final * oppMult),
        text: money(final * oppMult),
        why: up
          ? `This takes ${p}% **of the new price** off (${m(`${final} \\times ${num(oppMult)}`)}). The ${p}% was added to the smaller original price, so taking ${p}% of ${final} removes too much.`
          : `This adds ${p}% **of the sale price** back on (${m(`${final} \\times ${num(oppMult)}`)}). The ${p}% was taken from the larger original price, so adding ${p}% of ${final} is not enough.`,
      },
      {
        value: round2(final / oppMult),
        text: money(final / oppMult),
        why: up
          ? `This divides by ${m(num(oppMult))}, the multiplier for a ${p}% **decrease**. The price went up, so the original must be smaller than ${final}.`
          : `This divides by ${m(num(oppMult))}, the multiplier for a ${p}% **increase**. The price went down, so the original must be bigger than ${final}.`,
      },
      {
        value: round2(final / (p / 100)),
        text: money(final / (p / 100)),
        why: `This divides by ${m(num(p / 100))} (the ${p}% change itself) instead of by the multiplier ${m(multTex)}. The new price is ${newPct}% of the original, not ${p}%.`,
      },
      {
        value: round2(final * mult),
        text: money(final * mult),
        why: `This applies the ${p}% change a second time (${m(`${final} \\times ${multTex}`)}) instead of undoing it. Reversing a change means dividing by the multiplier.`,
      },
      {
        value: up ? final - p : final + p,
        text: money(up ? final - p : final + p),
        why: `This treats ${p}% as AED ${p}. A percentage must be turned into a multiplier, not used as an amount of money.`,
      },
      {
        value: final,
        text: money(final),
        why: `This is the price **after** the ${up ? 'increase' : 'discount'}; the question asks for the price before it.`,
      },
    ];
    const distractors = pickDistractors(answer, pool);

    const changeWord = up ? 'increase' : 'decrease';
    const solution =
      `This is a **reverse percentage**: we know the price *after* the ${changeWord} and want the original.\n\n` +
      `Step 1: after a ${p}% ${changeWord} the price is ${up ? `${m(`100\\% + ${p}\\% = ${newPct}\\%`)}` : `${m(`100\\% - ${p}\\% = ${newPct}\\%`)}`} of the original, so the multiplier is ${m(multTex)}:` +
      dm(`\\text{original} \\times ${multTex} = ${final}`) +
      `Step 2: undo the multiplication by dividing:` +
      dm(`\\text{original} = ${final} \\div ${multTex} = ${original}`) +
      `Check: ${m(`${original} \\times ${multTex} = ${final}`)} ✓\n\n` +
      `Answer: ${answer.text}`;

    return {
      stem,
      answer: answer.text,
      answerValue: original,
      distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
      solution,
      keyIdea: 'Reverse percentages: original $\\times$ multiplier $=$ new value, so DIVIDE the new value by the multiplier.',
    };
  },
};

// ------------------------------------------------------------------ compound interest / depreciation
const genCompound: Generator = {
  id: 'gen-percentages-ratio-compound',
  subtopic: 'percentages-ratio',
  difficulty: 'exam',
  title: 'Compound interest or depreciation over several years',
  generate(rng: Rng) {
    const growth = rng.bool(0.6);
    const P = 500 * rng.int(2, 40);
    // rates in tenths of a per cent so that 2.5% is exact
    const rate = growth ? rng.pick([2, 2.5, 3, 4, 5, 6, 8, 10, 12] as const) : rng.pick([5, 8, 10, 12, 15, 20, 25] as const);
    const n = growth ? rng.int(2, 6) : rng.int(2, 4);
    const R = Math.round(rate * 10);
    const M = growth ? 1000 + R : 1000 - R;
    const multTex = num(M / 1000);
    const A = compoundCents(P, M, n);

    const answer: Cand = { value: A, text: money2(A), why: '' };
    let stem: string;
    let pool: Cand[];
    if (growth) {
      const who = rng.pick(['Aisha', 'Omar', 'Lina', 'Yusuf', 'Maya', 'Khalid'] as const);
      stem = `${who} invests AED ${P} at ${rate}% per year **compound** interest, compounded annually. What is the total value of the investment after ${n} years? Give your answer to 2 decimal places.`;
      const simple = P * (1 + (rate * n) / 100);
      const plus1 = compoundCents(P, M, n + 1);
      const minus1 = compoundCents(P, M, n - 1);
      pool = [
        {
          value: round2(simple),
          text: money2(simple),
          why: `This is **simple** interest: ${m(`${P} \\times ${num(rate / 100)} \\times ${n}`)} added once. Compound interest also earns interest on the interest from earlier years.`,
        },
        {
          value: round2(A - P),
          text: money2(A - P),
          why: 'This is only the **interest** earned. The question asks for the total value of the investment.',
        },
        {
          value: plus1,
          text: money2(plus1),
          why: `This uses ${n + 1} years instead of ${n}: the power must equal the number of years.`,
        },
        {
          value: minus1,
          text: money2(minus1),
          why: `This uses ${n - 1} years instead of ${n}: the power must equal the number of years.`,
        },
      ];
    } else {
      const thing = rng.pick(['car', 'motorbike', 'laptop', 'machine', 'boat'] as const);
      stem = `A ${thing} costs AED ${P} when new. Its value **depreciates** by ${rate}% each year. What is its value after ${n} years? Give your answer to 2 decimal places.`;
      const simple = P * (1 - (rate * n) / 100);
      const wrongDir = compoundCents(P, 1000 + R, n);
      const plus1 = compoundCents(P, M, n + 1);
      pool = [
        {
          value: round2(simple),
          text: money2(simple),
          why: `This takes ${m(`${n} \\times ${rate}\\%`)} off the **original** price in one go. Each year the ${rate}% is taken from the value at the start of that year, which keeps getting smaller.`,
        },
        {
          value: round2(P - A),
          text: money2(P - A),
          why: 'This is how much value has been **lost**, not what the item is still worth.',
        },
        {
          value: wrongDir,
          text: money2(wrongDir),
          why: `This uses the multiplier ${m(num((1000 + R) / 1000))} (growth) instead of ${m(multTex)}. Depreciation means the value goes **down**.`,
        },
        {
          value: plus1,
          text: money2(plus1),
          why: `This uses ${n + 1} years instead of ${n}: the power must equal the number of years.`,
        },
      ];
    }
    const oneYear = round2((P * M) / 1000);
    pool.push({
      value: oneYear,
      text: money2(oneYear),
      why: `This applies the multiplier ${m(multTex)} only once, i.e. for one year instead of ${n} years.`,
    });
    const distractors = pickDistractors(answer, pool);

    // "=" when the value after y years is exact to the cent, "\approx" when it has been rounded
    const eq = (y: number): string =>
      (BigInt(P) * 100n * BigInt(M) ** BigInt(y)) % 1000n ** BigInt(y) === 0n ? '=' : '\\approx';
    const steps: string[] = [];
    for (let y = 1; y <= n; y++) {
      const val = compoundCents(P, M, y);
      const lhs = y === 1 ? `${P} \\times ${multTex}` : `${P} \\times ${multTex}^{${y}}`;
      steps.push(`- After ${y} year${y === 1 ? '' : 's'}: ${m(`${lhs} ${eq(y)} ${val.toFixed(2)}`)}`);
    }
    const V = growth ? 'A' : 'V';
    const solution =
      (growth
        ? `With compound interest the value is multiplied by ${m(`1 + \\frac{${rate}}{100} = ${multTex}`)} every year.`
        : `Depreciation of ${rate}% means the item keeps ${m(`100\\% - ${rate}\\% = ${num(100 - rate)}\\%`)} of its value each year, so the yearly multiplier is ${m(multTex)}.`) +
      dm(`${V} = P \\times ${multTex}^{n} = ${P} \\times ${multTex}^{${n}} ${eq(n)} ${A.toFixed(2)}`) +
      `Year by year, the power goes up by one each year (use the full calculator value and round to 2 decimal places only at the end):\n\n` +
      steps.join('\n') +
      `\n\nAnswer: ${answer.text}`;

    return {
      stem,
      answer: answer.text,
      answerValue: A,
      distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
      solution,
      keyIdea: growth
        ? 'Compound interest: $A = P\\left(1 + \\frac{r}{100}\\right)^{n}$, the multiplier is applied once per year.'
        : 'Depreciation: $V = P\\left(1 - \\frac{r}{100}\\right)^{n}$, the value is multiplied by the same number every year.',
    };
  },
};

// ------------------------------------------------------------------ sharing in a ratio
const NAMES = ['Amal', 'Bilal', 'Chen', 'Dana', 'Farah', 'Hamad', 'Layla', 'Omar', 'Sara', 'Tariq'] as const;

const genRatio: Generator = {
  id: 'gen-percentages-ratio-share',
  subtopic: 'percentages-ratio',
  difficulty: 'exam',
  title: 'Share an amount in a given ratio',
  generate(rng: Rng) {
    const people = rng.int(2, 3);
    let parts: number[] = [];
    for (;;) {
      parts = Array.from({ length: people }, () => rng.int(1, 9));
      const g = parts.reduce((a, b) => gcd(a, b));
      // 1 : 2 is too small to give three different believable mistakes, so re-roll it
      // and with three people, a share of exactly half the total leaves too few distinct mistakes
      const s = parts.reduce((a, b) => a + b, 0);
      if (g === 1 && new Set(parts).size === people && s > 3 && !(people === 3 && parts.some((q) => 2 * q === s))) break;
    }
    const names = rng.sample(NAMES, people);
    const S = parts.reduce((a, b) => a + b, 0);
    const u = rng.int(3, 60);
    const T = S * u;
    const ratioTex = m(parts.join(' : '));
    const nameList = people === 2 ? `${names[0]} and ${names[1]}` : `${names[0]}, ${names[1]} and ${names[2]}`;
    const mode = rng.bool(0.6) ? 'total' : 'difference';

    let stem: string;
    let answer: Cand;
    let pool: Cand[];
    let solution: string;
    let keyIdea: string;

    if (mode === 'total') {
      const t = rng.int(0, people - 1);
      const o = (t + 1) % people;
      const rt = parts[t];
      const ans = rt * u;
      stem = `${nameList} share AED ${T} in the ratio ${ratioTex} (in that order). How much does ${names[t]} receive?`;
      answer = { value: ans, text: money(ans), why: '' };
      pool = [
        {
          // with a ratio number of 1 this would just be the whole total, which is not a believable slip
          value: rt > 1 ? round2(T / rt) : -1,
          text: money(T / rt),
          why: `This divides the total by ${names[t]}'s ratio number (${rt}) instead of by the total number of parts (${S}).`,
        },
        {
          value: parts[o] * u,
          text: money(parts[o] * u),
          why: `This is ${names[o]}'s share (${parts[o]} part${parts[o] === 1 ? '' : 's'}), not ${names[t]}'s.`,
        },
        {
          // the classic "a : b means a/b" slip: only for two people, and only when it is not just a multiple of the total
          value: people === 2 && S - rt > 1 && rt !== S - rt ? round2((T * rt) / (S - rt)) : -1,
          text: money((T * rt) / (S - rt)),
          why: `This treats the ratio as the fraction ${m(`\\frac{${rt}}{${S - rt}}`)} of the total. ${names[t]} gets ${rt} part${rt === 1 ? '' : 's'} out of **${S}** parts altogether, so the fraction is ${m(`\\frac{${rt}}{${S}}`)}.`,
        },
        {
          value: u,
          text: money(u),
          why: `This is the value of **one** part (${m(`${T} \\div ${S}`)}). ${names[t]} receives ${rt} parts.`,
        },
        ...(people === 3
          ? [
              {
                value: parts[(t + 2) % 3] * u,
                text: money(parts[(t + 2) % 3] * u),
                why: `This is ${names[(t + 2) % 3]}'s share (${parts[(t + 2) % 3]} part${parts[(t + 2) % 3] === 1 ? '' : 's'}), not ${names[t]}'s.`,
              },
              {
                value: T - ans,
                text: money(T - ans),
                why: `This is what the other two people receive **together** (${m(`${T} - ${ans}`)}), not ${names[t]}'s share.`,
              },
            ]
          : []),
        {
          value: round2(T / people),
          text: money(T / people),
          why: 'This shares the money equally and ignores the ratio.',
        },
      ];
      solution =
        `Step 1: add the parts of the ratio: ${m(`${parts.join(' + ')} = ${S}`)} parts.\n\n` +
        `Step 2: find one part: ${m(`${T} \\div ${S} = ${u}`)}, so one part is AED ${u}.\n\n` +
        `Step 3: ${names[t]} has ${rt} part${rt === 1 ? '' : 's'}: ${m(`${rt} \\times ${u} = ${ans}`)}.\n\n` +
        `Check: the shares are ${parts.map((q) => `AED ${q * u}`).join(', ')}, which add up to AED ${T}. ✓\n\n` +
        `Answer: ${answer.text}`;
      keyIdea = 'To share in a ratio: add the parts, divide the total by that sum to get one part, then multiply.';
    } else {
      // X gets more than Y
      const order = parts.map((_, i) => i).sort((a, b) => parts[a] - parts[b]);
      const yIdx = order[0];
      const xIdx = rng.pick(order.slice(1));
      const diffParts = parts[xIdx] - parts[yIdx];
      const D = diffParts * u;
      stem = `${nameList} share some money in the ratio ${ratioTex} (in that order). ${names[xIdx]} receives AED ${D} more than ${names[yIdx]}. How much money is shared altogether?`;
      answer = { value: T, text: money(T), why: '' };
      pool = [
        {
          value: S * D,
          text: money(S * D),
          why: `This treats the AED ${D} difference as **one** part. The difference is ${m(`${parts[xIdx]} - ${parts[yIdx]} = ${diffParts}`)} parts.`,
        },
        {
          value: parts[xIdx] * u,
          text: money(parts[xIdx] * u),
          why: `This is only ${names[xIdx]}'s share, not the total amount shared.`,
        },
        ...(people === 3
          ? [
              {
                value: (parts[xIdx] + parts[yIdx]) * u,
                text: money((parts[xIdx] + parts[yIdx]) * u),
                why: `This adds only ${names[xIdx]}'s and ${names[yIdx]}'s shares and forgets the third person.`,
              },
            ]
          : []),
        {
          value: T + D,
          text: money(T + D),
          why: `This adds the AED ${D} difference on top of the total. The difference is already part of ${names[xIdx]}'s share.`,
        },
        {
          value: parts[yIdx] * u,
          text: money(parts[yIdx] * u),
          why: `This is only ${names[yIdx]}'s share, not the total amount shared.`,
        },
        {
          value: u,
          text: money(u),
          why: 'This is the value of one part, not the total amount shared.',
        },
      ];
      solution =
        `Step 1: the difference between ${names[xIdx]} and ${names[yIdx]} is ${m(`${parts[xIdx]} - ${parts[yIdx]} = ${diffParts}`)} part${diffParts === 1 ? '' : 's'}.\n\n` +
        `Step 2: ${diffParts === 1 ? 'that part is' : `those ${diffParts} parts are`} worth AED ${D}, so one part is ${m(`${D} \\div ${diffParts} = ${u}`)}.\n\n` +
        `Step 3: the total is ${m(`${parts.join(' + ')} = ${S}`)} parts, so the total is ${m(`${S} \\times ${u} = ${T}`)}.\n\n` +
        `Check: the shares are ${parts.map((q) => `AED ${q * u}`).join(', ')}, and ${m(`${parts[xIdx] * u} - ${parts[yIdx] * u} = ${D}`)}. ✓\n\n` +
        `Answer: ${answer.text}`;
      keyIdea = 'Match the given difference to the difference in ratio parts to find one part, then scale up to the whole.';
    }

    const distractors = pickDistractors(answer, pool);
    // guaranteed-different fallbacks (never needed with the pools above, but kept for safety)
    let extra = 2;
    while (distractors.length < 3) {
      const v = answer.value + extra * u;
      const c: Cand = { value: v, text: money(v), why: `This adds ${extra} extra part${extra === 1 ? '' : 's'} by miscounting the parts of the ratio.` };
      if (!distractors.some((d) => d.text === c.text)) distractors.push(c);
      extra++;
    }

    return {
      stem,
      answer: answer.text,
      answerValue: answer.value,
      distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
      solution,
      keyIdea,
    };
  },
};

export const generators: Generator[] = [genReverse, genCompound, genRatio];
