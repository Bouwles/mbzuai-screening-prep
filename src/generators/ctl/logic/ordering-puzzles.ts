import type { GeneratedCore, Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { factorial } from '../../../lib/mathx';
import { m } from '../../../lib/tex';

const NAMES = [
  'Amal', 'Bilal', 'Chen', 'Dana', 'Elif', 'Farah', 'Gus', 'Hana', 'Imran', 'Jae', 'Kofi', 'Leila',
  'Musa', 'Nour', 'Omar', 'Priya', 'Quinn', 'Ravi', 'Sara', 'Tariq', 'Uma', 'Yara', 'Zaid',
];

const NUM_WORD = ['', '', '', 'Three', 'Four'];
const ORD = ['', '1st', '2nd', '3rd', '4th'];
const ord = (k: number) => ORD[k];

// ================================================================ 1. ranking from a chain of comparison clues
interface RankCtx {
  intro: (n: string) => string;
  /** "X is taller than Y" style phrase for "a is ranked above b". */
  above: (a: string, b: string) => string;
  /** Same fact phrased from the other person: "Y is shorter than X". */
  below: (b: string, a: string) => string;
  topWord: string; // "tallest" (used in explanations)
  bottomWord: string; // "shortest"
  /** Question for position k (k >= 2) counted from the top / from the bottom. */
  askTop: (k: number) => string;
  askBottom: (k: number) => string;
  sym: string; // what ">" means in the solution
}

const RANK_CTX: RankCtx[] = [
  {
    intro: (n) => `${n} friends compare their heights. No two are the same height.`,
    above: (a, b) => `${a} is taller than ${b}.`,
    below: (b, a) => `${b} is shorter than ${a}.`,
    topWord: 'tallest',
    bottomWord: 'shortest',
    askTop: (k) => `Who is the **${ord(k)} tallest**?`,
    askBottom: (k) => `Who is the **${ord(k)} shortest**?`,
    sym: 'is taller than',
  },
  {
    intro: (n) => `${n} runners finish a race with no ties.`,
    above: (a, b) => `${a} finished before ${b}.`,
    below: (b, a) => `${b} finished after ${a}.`,
    topWord: 'first finisher',
    bottomWord: 'last finisher',
    askTop: (k) => `Who finished **${ord(k)}**?`,
    askBottom: (k) => `Who finished **${ord(k)} from last**?`,
    sym: 'finished before',
  },
  {
    intro: (n) => `${n} students sit a test. No two get the same score.`,
    above: (a, b) => `${a} scored more than ${b}.`,
    below: (b, a) => `${b} scored less than ${a}.`,
    topWord: 'highest scorer',
    bottomWord: 'lowest scorer',
    askTop: (k) => `Who has the **${ord(k)} highest** score?`,
    askBottom: (k) => `Who has the **${ord(k)} lowest** score?`,
    sym: 'scored more than',
  },
  {
    intro: (n) => `${n} cousins compare their ages. No two are the same age.`,
    above: (a, b) => `${a} is older than ${b}.`,
    below: (b, a) => `${b} is younger than ${a}.`,
    topWord: 'oldest',
    bottomWord: 'youngest',
    askTop: (k) => `Who is the **${ord(k)} oldest**?`,
    askBottom: (k) => `Who is the **${ord(k)} youngest**?`,
    sym: 'is older than',
  },
];

function rankGenerate(rng: Rng): GeneratedCore {
  const ctx = rng.pick(RANK_CTX);
  const n = 4;
  const order = rng.sample(NAMES, n); // true order, top (rank 1) first
  // clues link consecutive people; some phrased "above", some "below"; shown in a shuffled order
  const clues = rng.shuffle(
    order.slice(0, -1).map((a, i) => {
      const b = order[i + 1];
      return rng.bool() ? ctx.above(a, b) : ctx.below(b, a);
    }),
  );
  // ask for the k-th from the top or from the bottom (never the extremes, so a chain is really needed)
  const fromTop = rng.bool();
  const k = rng.int(2, n - 1);
  const pos = fromTop ? k : n + 1 - k; // 1-based position from the top
  const answer = order[pos - 1];
  const ask = fromTop ? ctx.askTop(k) : ctx.askBottom(k);

  const stem = `${ctx.intro(NUM_WORD[n])}\n\n${clues.map((c) => `- ${c}`).join('\n')}\n\n${ask}`;

  // candidate mistakes (by position from the top)
  type Cand = { p: number; why: string };
  const pool: Cand[] = [
    {
      p: n + 1 - pos,
      why: `This person is ${ord(k)} counted from the **${fromTop ? ctx.bottomWord : ctx.topWord}** end, which is the wrong end of the order.`,
    },
    { p: pos - 1, why: `This person is one place too close to the ${ctx.topWord}: an off-by-one slip when counting along the chain.` },
    { p: pos + 1, why: `This person is one place too close to the ${ctx.bottomWord}: an off-by-one slip when counting along the chain.` },
    { p: 1, why: `This is the ${ctx.topWord}, at the very top of the chain, not the position the question asks for.` },
    { p: n, why: `This is the ${ctx.bottomWord}, at the very bottom of the chain, not the position the question asks for.` },
  ];
  const used = new Set<number>([pos]);
  const distractors: GeneratedCore['distractors'] = [];
  for (const c of pool) {
    if (distractors.length === 3) break;
    if (c.p < 1 || c.p > n || used.has(c.p)) continue;
    used.add(c.p);
    distractors.push({ text: order[c.p - 1], value: order[c.p - 1], why: c.why });
  }

  const rewritten = order
    .slice(0, -1)
    .map((a, i) => `- ${a} ${ctx.sym} ${order[i + 1]}`)
    .join('\n');
  const table =
    `| Position from the ${ctx.topWord} end | ${order.map((_, i) => String(i + 1)).join(' | ')} |\n` +
    `| --- | ${order.map(() => '---').join(' | ')} |\n` +
    `| Person | ${order.join(' | ')} |`;
  const solution =
    `Rewrite every clue in the **same direction**, as "X ${ctx.sym} Y" (a "${ctx.below('Y', 'X').replace(/\.$/, '')}" clue is the same fact as "X ${ctx.sym} Y"):\n\n` +
    `${rewritten}\n\n` +
    `Each person links to the next, so they join into one chain:\n\n${table}\n\n` +
    (fromTop
      ? `The ${ord(k)} from the ${ctx.topWord} end is position ${k} in the table: **${answer}**.`
      : `The table counts from the ${ctx.topWord} end. There are ${n} people, so ${ord(k)} from the ${ctx.bottomWord} end is position ${m(`${n} + 1 - ${k} = ${pos}`)} from the ${ctx.topWord} end: **${answer}**.`) +
    `\n\nAnswer: ${answer}`;

  return {
    stem,
    answer,
    answerValue: answer,
    distractors,
    solution,
    keyIdea: 'Rewrite all comparisons in one direction, chain them into a single line, then count carefully from the correct end.',
  };
}

// ================================================================ 2. counting arrangements under a constraint
type CountKind = 'row' | 'rowTogether' | 'rowApart' | 'rowBefore' | 'rowEnd' | 'rowNotFirst';

const COUNT_KINDS: CountKind[] = ['row', 'rowTogether', 'rowApart', 'rowBefore', 'rowEnd', 'rowNotFirst'];

const f = factorial;
const fx = (k: number) => `${k}!`;

function countGenerate(rng: Rng): GeneratedCore {
  const kind = rng.pick(COUNT_KINDS);
  const n = rng.int(3, 4);
  const [a, b] = rng.sample(NAMES, 2);
  const people = `${NUM_WORD[n]} people, including ${a} and ${b},`;

  let stem = '';
  let ans = 0;
  let steps = '';
  const pool: { v: number; why: string }[] = [];

  switch (kind) {
    case 'row': {
      stem = `In how many different ways can ${n} different people stand in a line?`;
      ans = f(n);
      steps =
        `Fill the places one at a time: ${n} choices for the first place, ${n - 1} for the second, and so on down to 1.\n\n` +
        m(`${Array.from({ length: n }, (_, i) => n - i).join(' \\times ')} = ${n}! = ${ans}`);
      pool.push(
        { v: (n * (n + 1)) / 2, why: `This is ${m(Array.from({ length: n }, (_, i) => n - i).join(' + '))}: the choices were added instead of multiplied.` },
        { v: n ** n, why: `This is ${m(`${n}^{${n}}`)}: it lets the same person fill more than one place.` },
        { v: f(n - 1), why: `This is ${m(fx(n - 1))}: it fixes one person in place and arranges only the others. All ${n} places are free, so use ${m(fx(n))}.` },
        { v: n * n, why: `This is ${m(`${n} \\times ${n}`)}: multiplying people by places is not a counting rule.` },
      );
      break;
    }
    case 'rowTogether': {
      stem = `${people} sit in a row of ${n} chairs. In how many ways can they sit if ${a} and ${b} **must sit next to each other**?`;
      ans = 2 * f(n - 1);
      steps =
        `Glue ${a} and ${b} into one block. There are now ${n - 1} units to arrange in a row: ${m(`${fx(n - 1)} = ${f(n - 1)}`)}.\n\n` +
        `Inside the block they can be in 2 orders (${a} then ${b}, or ${b} then ${a}).\n\n` +
        m(`2 \\times ${fx(n - 1)} = 2 \\times ${f(n - 1)} = ${ans}`);
      pool.push(
        { v: f(n - 1), why: `This is ${m(fx(n - 1))}: it forgets that ${a} and ${b} can swap places inside their block.` },
        { v: f(n), why: `This is ${m(fx(n))}, every seating, ignoring the condition.` },
        { v: f(n) - 2 * f(n - 1), why: `This is ${m(`${fx(n)} - 2 \\times ${fx(n - 1)}`)}, the number of seatings where they are **not** together: the opposite question.` },
        { v: 2 * f(n - 2), why: `This is ${m(`2 \\times ${fx(n - 2)}`)}: after gluing the pair there are ${n - 1} units, not ${n - 2}.` },
      );
      break;
    }
    case 'rowApart': {
      stem = `${people} sit in a row of ${n} chairs. In how many ways can they sit if ${a} and ${b} must **not** sit next to each other?`;
      const tog = 2 * f(n - 1);
      ans = f(n) - tog;
      steps =
        `All seatings: ${m(`${fx(n)} = ${f(n)}`)}.\n\n` +
        `Seatings with ${a} and ${b} together (block method): ${m(`2 \\times ${fx(n - 1)} = ${tog}`)}.\n\n` +
        `Not together ${m(`= ${f(n)} - ${tog} = ${ans}`)}.`;
      pool.push(
        { v: tog, why: `This is ${m(`2 \\times ${fx(n - 1)}`)}, the number of seatings where they **are** together. It still has to be subtracted from the total.` },
        { v: f(n) - f(n - 1), why: `This is ${m(`${fx(n)} - ${fx(n - 1)}`)}: it forgot that the "together" block can be in 2 orders, so only half of the together cases were removed.` },
        { v: f(n), why: `This is ${m(fx(n))}, every seating, ignoring the condition.` },
        { v: 2 * f(n - 2), why: `This is ${m(`2 \\times ${fx(n - 2)}`)}: it miscounts the units left after gluing the pair, and it never subtracts from the total.` },
      );
      break;
    }
    case 'rowBefore': {
      stem = `${NUM_WORD[n]} runners, including ${a} and ${b}, finish a race with no ties. In how many finishing orders does ${a} finish **before** ${b} (not necessarily immediately before)?`;
      ans = f(n) / 2;
      steps =
        `All finishing orders: ${m(`${fx(n)} = ${f(n)}`)}.\n\n` +
        `Swapping ${a} and ${b} pairs every order with another one, and in exactly one of each pair ${a} is ahead. So exactly half the orders work:\n\n` +
        m(`\\frac{${fx(n)}}{2} = \\frac{${f(n)}}{2} = ${ans}`);
      pool.push(
        { v: f(n), why: `This is ${m(fx(n))}, all orders. In half of them ${b} is ahead of ${a}.` },
        { v: f(n - 1), why: `This is ${m(fx(n - 1))}, the number of orders where ${a} finishes **immediately** before ${b}. "Before" allows runners in between.` },
        { v: 2 * f(n - 1), why: `This is ${m(`2 \\times ${fx(n - 1)}`)}, the number of orders where the two finish next to each other in either order.` },
        { v: f(n - 2), why: `This is ${m(fx(n - 2))}: it fixes ${a} first and ${b} second, which is only one of many ways for ${a} to beat ${b}.` },
      );
      break;
    }
    case 'rowEnd': {
      stem = `${people} stand in a line. In how many ways can they stand if ${a} must be at one of the two **ends** of the line?`;
      ans = 2 * f(n - 1);
      steps =
        `${a} has 2 choices of position (left end or right end).\n\n` +
        `The other ${n - 1} people fill the remaining ${n - 1} places in ${m(`${fx(n - 1)} = ${f(n - 1)}`)} ways.\n\n` +
        m(`2 \\times ${fx(n - 1)} = 2 \\times ${f(n - 1)} = ${ans}`);
      pool.push(
        { v: f(n - 1), why: `This is ${m(fx(n - 1))}: it puts ${a} at one particular end only. There are two ends.` },
        { v: f(n), why: `This is ${m(fx(n))}, every line-up, ignoring the condition.` },
        { v: f(n) - 2 * f(n - 1), why: `This is ${m(`${fx(n)} - 2 \\times ${fx(n - 1)}`)}, the number of line-ups where ${a} is **not** at an end.` },
        { v: f(n) / 2, why: `This is ${m(`\\frac{${fx(n)}}{2}`)}: it assumes ${a} is at an end in half of all line-ups, but only 2 of the ${n} positions are ends.` },
        { v: 2 + f(n - 1), why: `This is ${m(`2 + ${fx(n - 1)}`)}: the 2 choices of end were **added** to the arrangements of the others instead of multiplied.` },
        { v: 2 * f(n - 2), why: `This is ${m(`2 \\times ${fx(n - 2)}`)}: once ${a} is placed there are ${n - 1} other people to arrange, not ${n - 2}.` },
      );
      break;
    }
    case 'rowNotFirst': {
      stem = `${people} stand in a line. In how many orders is ${a} **not** first?`;
      ans = f(n) - f(n - 1);
      steps =
        `All orders: ${m(`${fx(n)} = ${f(n)}`)}.\n\n` +
        `Orders with ${a} first: the other ${n - 1} people fill the remaining places in ${m(`${fx(n - 1)} = ${f(n - 1)}`)} ways.\n\n` +
        `${a} not first ${m(`= ${f(n)} - ${f(n - 1)} = ${ans}`)}.`;
      pool.push(
        { v: f(n - 1), why: `This is ${m(fx(n - 1))}, the number of orders where ${a} **is** first. It still has to be subtracted from the total.` },
        { v: f(n), why: `This is ${m(fx(n))}, every order, ignoring the condition.` },
        { v: f(n) / 2, why: `This assumes ${a} is first in half of all orders, but ${a} is first in only 1 of every ${n}.` },
      );
      break;
    }
  }

  const distractors: GeneratedCore['distractors'] = [];
  const seen = new Set<number>([ans]);
  for (const c of pool) {
    if (distractors.length === 3) break;
    if (!Number.isInteger(c.v) || c.v <= 0 || seen.has(c.v)) continue;
    seen.add(c.v);
    distractors.push({ text: m(String(c.v)), value: c.v, why: c.why });
  }
  // guaranteed-different fallbacks (genuine slips) if the pool collided
  const fallbacks = [
    { v: ans * 2, why: 'This doubles the correct count, as if every arrangement could also be reversed or swapped once more. Nothing in the question allows that extra factor of 2.' },
    { v: ans / 2, why: 'This halves the correct count, as if each arrangement had been counted twice. Each arrangement is counted exactly once in the method shown.' },
    { v: ans * n, why: `This multiplies the correct count by ${n} for no reason, like counting every position again.` },
  ];
  for (const c of fallbacks) {
    if (distractors.length === 3) break;
    if (!Number.isInteger(c.v) || c.v <= 0 || seen.has(c.v)) continue;
    seen.add(c.v);
    distractors.push({ text: m(String(c.v)), value: c.v, why: c.why });
  }

  const answer = m(String(ans));
  return {
    stem,
    answer,
    answerValue: ans,
    distractors,
    solution: `${steps}\n\nAnswer: ${answer}`,
    keyIdea: 'In a row, $n$ people give $n!$ orders; glue "together" pairs into a block (times 2), and get "not" conditions by subtracting from the total.',
  };
}

export const generators: Generator[] = [
  {
    id: 'gen-ordering-puzzles-chain-rank',
    subtopic: 'ordering-puzzles',
    difficulty: 'foundation',
    title: 'Ranking from comparison clues',
    generate: rankGenerate,
  },
  {
    id: 'gen-ordering-puzzles-count-arrangements',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    title: 'Count arrangements in a row',
    generate: countGenerate,
  },
];
