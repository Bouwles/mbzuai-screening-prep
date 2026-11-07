import type { Generator } from "../../../types";
import { steps as stepsOf } from "../../../lib/explanation";
import { lcm } from "../../../lib/frac";
import { nCr, nPr } from "../../../lib/mathx";
import { m, num } from "../../../lib/tex";

type Cand = { v: number; why: string };

/** Integer as LaTeX with thin-space thousands separators for 5+ digits: 1235520 -> "1\,235\,520". */
function big(n: number): string {
  const s = String(n);
  if (s.length < 5) return s;
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");
}

/** Keep up to 3 candidates that differ from the answer and from each other (by value and rendered text). */
function pickDistinct(answer: number, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const d of pool) {
    if (out.length === 3) break;
    if (!Number.isInteger(d.v) || d.v < 0) continue;
    if (d.v === answer || big(d.v) === big(answer)) continue;
    if (out.some((x) => x.v === d.v || big(x.v) === big(d.v))) continue;
    out.push(d);
  }
  return out;
}

const fl = (N: number, a: number) => Math.floor(N / a);
const nums = (n: number) => (n === 1 ? '1 number' : `${n} numbers`);
/** "$N \\div a = q$" or "$N \\div a \\approx 16.67$, which rounds down to 16". */
const countMultiples = (N: number, a: number) =>
  N % a === 0
    ? m(`${N} \\div ${a} = ${fl(N, a)}`)
    : `${m(`${N} \\div ${a} \\approx ${num(N / a, 2)}`)}, which rounds down to ${fl(N, a)}`;

/** The working for "choose r from n": "\\binom{6}{2} = \\frac{6 \\times 5}{2 \\times 1} = 15". */
function chooseTex(n: number, r: number): string {
  const head = `\\binom{${n}}{${r}}`;
  if (r === 1) return `${head} = ${n}`;
  const top = Array.from({ length: r }, (_, i) => n - i);
  const bottom = Array.from({ length: r }, (_, i) => r - i);
  return `${head} = \\frac{${top.join(" \\times ")}}{${bottom.join(" \\times ")}} = \\frac{${big(nPr(n, r))}}{${big(nPr(r, r))}} = ${big(nCr(n, r))}`;
}

// ---------------------------------------------------------------- pigeonhole contexts
interface PigeonCtx {
  /** fixed number of boxes, or null for a random number */
  k: number | null;
  kRange?: [number, number];
  boxes: string; // plural noun for boxes, e.g. "months"
  items: string; // plural noun for objects
  /** Form A stem: N objects, k boxes -> largest guaranteed n. */
  stemA: (N: number, k: number) => string;
  /** Form B stem: minimum objects to guarantee r in one box. */
  stemB: (r: number, k: number) => string;
}

const PIGEON_CTX: PigeonCtx[] = [
  {
    k: 12,
    boxes: "months",
    items: "people",
    stemA: (N) =>
      `Among ${N} people, what is the **largest** $n$ for which at least $n$ must have been born in the same month?`,
    stemB: (r) =>
      `What is the **smallest** number of people needed to be **certain** that at least ${r} were born in the same month?`,
  },
  {
    k: 7,
    boxes: "days of the week",
    items: "people",
    stemA: (N) =>
      `Among ${N} people, what is the **largest** $n$ for which at least $n$ must have been born on the same day of the week?`,
    stemB: (r) =>
      `What is the **smallest** number of people needed to be **certain** that at least ${r} were born on the same day of the week?`,
  },
  {
    k: null,
    kRange: [3, 8],
    boxes: "colours",
    items: "socks",
    stemA: (N, k) =>
      `Each of ${N} socks is one of ${k} colours. What is the **largest** $n$ for which at least $n$ must be the same colour?`,
    stemB: (r, k) =>
      `Socks come in ${k} colours. What is the **smallest** number of socks you must take to be **certain** of having ${r} of the same colour?`,
  },
  {
    k: 5,
    boxes: "grades",
    items: "students",
    stemA: (N) =>
      `Each of ${N} students gets one of 5 grades. What is the **largest** $n$ for which at least $n$ must get the same grade?`,
    stemB: (r) =>
      `Each student gets one of 5 grades. What is the **smallest** number of students needed to be **certain** that at least ${r} get the same grade?`,
  },
  {
    k: null,
    kRange: [4, 10],
    boxes: "mailboxes",
    items: "letters",
    stemA: (N, k) =>
      `${N} letters go into ${k} mailboxes. What is the **largest** $n$ for which some mailbox must receive at least $n$ letters?`,
    stemB: (r, k) =>
      `Letters go into ${k} mailboxes. What is the **smallest** number of letters needed to be **certain** that some mailbox receives at least ${r}?`,
  },
];

// ---------------------------------------------------------------- inclusion-exclusion pairs
const DIV_PAIRS: [number, number][] = [
  [2, 3],
  [2, 5],
  [2, 7],
  [3, 4],
  [3, 5],
  [3, 7],
  [4, 5],
  [4, 6],
  [4, 10],
  [5, 7],
  [6, 8],
  [6, 9],
  [6, 10],
  [8, 12],
  [9, 12],
];

export const generators: Generator[] = [
  // ================================================================ generalised pigeonhole
  {
    id: "gen-pigeonhole-counting-generalised-pigeonhole",
    subtopic: "pigeonhole-counting",
    difficulty: "exam",
    title:
      "Generalised pigeonhole principle: guaranteed amount or minimum needed",
    generate(rng) {
      const ctx = rng.pick(PIGEON_CTX);
      const k = ctx.k ?? rng.int(ctx.kRange![0], ctx.kRange![1]);
      const formA = rng.bool();

      if (formA) {
        // N objects in k boxes, N not a multiple of k, at least 3 per box on average
        let N = 0;
        do N = rng.int(2 * k + 1, 9 * k);
        while (N % k === 0);
        const q = fl(N, k);
        const s = N - q * k;
        const ans = q + 1; // = ceil(N / k)
        const exactDec = Math.round((N / k) * 100) === (N * 100) / k;
        const decTex = `\\frac{${N}}{${k}} ${exactDec ? "=" : "\\approx"} ${num(N / k, 2)}`;
        const pool: Cand[] = [
          {
            v: q,
            why: `This rounds ${m(decTex)} **down**. Giving ${q} to each of the ${k} ${ctx.boxes} only uses ${m(`${k} \\times ${q} = ${q * k}`)} of the ${N} ${ctx.items}; the ${s === 1 ? 'one' : s} left over must push at least one of the ${ctx.boxes} up to ${ans}, so round **up**.`,
          },
          {
            v: ans + 1,
            why: `This rounds ${m(`\\frac{${N}}{${k}}`)} up and then adds 1 more. The spread with ${ans} in ${s} of the ${ctx.boxes} and ${q} in the rest uses all ${N} ${ctx.items} and never reaches ${ans + 1}, so ${ans + 1} is not guaranteed.`,
          },
          {
            v: 2,
            why: `It is true that at least two ${ctx.items} must share one of the ${ctx.boxes} (the basic pigeonhole principle), but the question asks for the **largest** number that is guaranteed, which is ${m(`\\left\\lceil \\frac{${N}}{${k}} \\right\\rceil`)}.`,
          },
          {
            v: N - k,
            why: `This is ${m(`${N} - ${k}`)}: subtracting the number of ${ctx.boxes} from the number of ${ctx.items} has no meaning here. Divide and round up instead.`,
          },
          {
            v: s,
            why: `This is the **remainder** when ${N} is divided by ${k}: the ${s} leftover ${ctx.items}. The guaranteed number is the ${q} every box gets in the even spread, plus one for a leftover.`,
          },
          {
            v: k,
            why: `This is the number of ${ctx.boxes}, not the number of ${ctx.items} that must share one of them. Divide ${N} by ${k} and round up.`,
          },
        ];
        const distractors = pickDistinct(ans, pool);
        return {
          stem: ctx.stemA(N, k),
          answer: m(String(ans)),
          answerValue: ans,
          distractors: distractors.map((d) => ({
            text: m(big(d.v)),
            value: d.v,
            why: d.why,
          })),
          asking: `With ${N} ${ctx.items} and ${k} ${ctx.boxes}, what is the largest number that must share one of them?`,
          solution: stepsOf(
            `Treat the ${k} ${ctx.boxes} as boxes and the ${N} ${ctx.items} as objects going into them. To find what **must** happen, spread the objects as evenly as possible. That is the worst case, with no box getting more than necessary.`,
            `Divide: ${m(`${N} \\div ${k} = ${q}`)} remainder ${s} (the remainder is what is left over). So give each box ${q}, which uses ${m(`${k} \\times ${q} = ${q * k}`)} objects.`,
            `That leaves ${m(`${N} - ${q * k} = ${s}`)} over. ${s === 1 ? 'It' : 'Each one'} must go into a box that already has ${q}, so some box must reach ${m(`${q} + 1 = ${ans}`)}. In this even spread no box goes above ${ans}, so ${ans + 1} can't be guaranteed.`,
          ),
          conclusion: `An even spread still forces ${ans} into one box and never forces ${ans + 1}, so the largest $n$ is ${m(String(ans))}.`,
          keyIdea:
            "General pigeonhole: with $N$ objects in $k$ boxes, some box has at least $\\frac{N}{k}$ rounded **up**. Find it by giving every box an equal share, then placing one leftover.",
        };
      }

      // form B: minimum number of objects to force r in one box
      const r = rng.int(2, 6);
      const worst = k * (r - 1);
      const ans = worst + 1;
      const pool: Cand[] = [
        {
          v: worst,
          why: `${worst} ${ctx.items} could be exactly ${r - 1} in each of the ${k} ${ctx.boxes}, with none of the ${ctx.boxes} reaching ${r}. That is the worst case itself; one more is needed.`,
        },
        {
          v: k * r,
          why: `This is ${m(`${k} \\times ${r}`)}. That many does guarantee ${r} in one box, but it is not the smallest: the worst case only has ${r - 1} in every box (${worst} in total) before the next one completes a box.`,
        },
        {
          v: k * r + 1,
          why: `This assumes the worst case has ${r} in every box. But once a box has ${r} you are already done; the worst case has only ${r - 1} per box, so the answer is ${m(`${k} \\times ${r - 1} + 1`)}.`,
        },
        {
          v: k + 1,
          why: `This is ${m(`${k} + 1`)}, which only guarantees **two** in the same box (the basic pigeonhole principle), not ${r}.`,
        },
        {
          v: k + r - 1,
          why: `This adds ${m(`${k} + ${r} - 1`)} instead of multiplying: you can put ${r - 1} in **every** one of the ${k} boxes before being forced, which is ${m(`${k} \\times ${r - 1}`)}.`,
        },
      ];
      const distractors = pickDistinct(ans, pool);
      return {
        stem: ctx.stemB(r, k),
        answer: m(String(ans)),
        answerValue: ans,
        distractors: distractors.map((d) => ({
          text: m(big(d.v)),
          value: d.v,
          why: d.why,
        })),
        asking: `How many ${ctx.items} guarantee ${r} sharing one of the ${k} ${ctx.boxes}?`,
        solution: stepsOf(
          `"Certain" means we look at the worst case: as many ${ctx.items} as possible, with none of the ${ctx.boxes} reaching ${r}.`,
          `The most you can have without reaching ${r} is ${r - 1} in each of the ${k} ${ctx.boxes}. That is ${m(`${k} \\times ${r - 1} = ${worst}`)} ${ctx.items}.`,
          `The next one has to join one of the ${ctx.boxes} that already has ${r - 1}. That makes ${r}, and the total is ${m(`${worst} + 1 = ${ans}`)}.`,
        ),
        conclusion: `${worst} ${ctx.items} can still avoid ${r} in any one of the ${ctx.boxes}, but one more can't, so the minimum is ${m(String(ans))}.`,
        keyIdea:
          'To guarantee $r$ of one kind with $k$ kinds, the worst case holds $r - 1$ of each, so take $k(r - 1) + 1$. Spot it from "smallest" together with "certain" or "guarantee".',
      };
    },
  },

  // ================================================================ inclusion-exclusion with divisibility
  {
    id: "gen-pigeonhole-counting-inclusion-exclusion",
    subtopic: "pigeonhole-counting",
    difficulty: "exam",
    title: "Inclusion-exclusion: integers divisible by a or b (or neither)",
    generate(rng) {
      for (;;) {
        const [a, b] = rng.pick(DIV_PAIRS);
        const N = rng.int(5, 40) * 10;
        const l = lcm(a, b);
        const fa = fl(N, a);
        const fb = fl(N, b);
        const fab = fl(N, l);
        const either = fa + fb - fab;
        const neither = N - either;
        const askNeither = rng.bool(0.4);
        const ans = askNeither ? neither : either;
        const prodWrong = l !== a * b ? fa + fb - fl(N, a * b) : null;

        const pool: Cand[] = askNeither
          ? [
              {
                v: N - fa - fb,
                why: `This is ${m(`${N} - ${fa} - ${fb}`)}: the ${nums(fab)} divisible by both ${a} and ${b} ${fab === 1 ? 'was' : 'were'} counted in both groups, so ${fab === 1 ? 'it has' : 'they have'} been subtracted twice. Use ${m(`${fa} + ${fb} - ${fab}`)} first.`,
              },
              ...(prodWrong !== null
                ? [
                    {
                      v: N - prodWrong,
                      why: `This uses ${m(`${a} \\times ${b} = ${a * b}`)} for "divisible by both". But ${l} is divisible by both ${a} and ${b}: the overlap is the multiples of the **lowest common multiple**, ${l}.`,
                    },
                  ]
                : []),
              {
                v: either,
                why: `This is the number divisible by ${a} **or** ${b}. The question asks for **neither**, so subtract it from ${N}.`,
              },
              {
                v: N - (fa + fb - 2 * fab),
                why: `This removes only the numbers divisible by **exactly one** of ${a} and ${b}, so the ${nums(fab)} divisible by both ${fab === 1 ? 'is' : 'are'} wrongly left in the "neither" count.`,
              },
            ]
          : [
              {
                v: fa + fb,
                why: `This is ${m(`${fa} + ${fb}`)}: the multiples of ${l} (there ${fab === 1 ? 'is 1' : `are ${fab}`}) are divisible by both ${a} and ${b}, so they are counted twice. Subtract them once.`,
              },
              ...(prodWrong !== null
                ? [
                    {
                      v: prodWrong,
                      why: `This uses ${m(`${a} \\times ${b} = ${a * b}`)} for "divisible by both". But ${l} is divisible by both ${a} and ${b}: the overlap is the multiples of the **lowest common multiple**, ${l}.`,
                    },
                  ]
                : []),
              {
                v: neither,
                why: `This is ${m(`${N} - ${either}`)}, the count of numbers divisible by **neither** ${a} nor ${b}.`,
              },
              {
                v: fa + fb - 2 * fab,
                why: `This subtracts the overlap twice, which counts the numbers divisible by **exactly one** of ${a} and ${b}. "Or" includes the ${nums(fab)} divisible by both.`,
              },
            ];
        const distractors = pickDistinct(ans, pool);
        if (distractors.length < 3) continue; // re-roll

        const stem = askNeither
          ? `How many integers from 1 to ${N} inclusive are divisible by **neither** ${a} nor ${b}?`
          : `How many integers from 1 to ${N} inclusive are divisible by ${a} **or** by ${b} (or both)?`;
        return {
          stem,
          answer: m(String(ans)),
          answerValue: ans,
          distractors: distractors.map((d) => ({
            text: m(big(d.v)),
            value: d.v,
            why: d.why,
          })),
          asking: askNeither
            ? `How many numbers from 1 to ${N} are multiples of neither ${a} nor ${b}?`
            : `How many numbers from 1 to ${N} are multiples of ${a} or ${b}?`,
          solution: stepsOf(
            `To count the multiples of a number from 1 to ${N}, divide ${N} by that number and drop anything after the decimal point.`,
            `Multiples of ${a}: ${countMultiples(N, a)}. Multiples of ${b}: ${countMultiples(N, b)}.`,
            `Numbers divisible by both have been counted twice. A number divisible by both ${a} and ${b} is a multiple of their lowest common multiple (LCM, the smallest number both divide into), which is ${l}.${l === a * b ? "" : ` Note that this is smaller than ${m(`${a} \\times ${b}`)}.`}`,
            `Multiples of ${l}: ${countMultiples(N, l)}.`,
            `This is **inclusion-exclusion**: add the two groups, then take off the overlap once. ${m(`${fa} + ${fb} - ${fab} = ${either}`)}.`,
            askNeither && `The rest are multiples of neither: ${m(`${N} - ${either} = ${neither}`)}.`,
          ),
          conclusion: askNeither
            ? `${either} of the ${N} numbers are multiples of ${a} or ${b}, so ${m(String(ans))} are multiples of neither.`
            : `Adding ${fa} and ${fb} counts ${nums(fab)} twice, so removing one copy leaves ${m(String(ans))}.`,
          keyIdea:
            'For "divisible by $a$ or $b$": count the multiples of $a$, add the multiples of $b$, then subtract the multiples of their LCM. Count multiples by dividing the limit and rounding down. "Neither" is the total minus that result.',
        };
      }
    },
  },

  // ================================================================ grid paths
  {
    id: "gen-pigeonhole-counting-grid-paths",
    subtopic: "pigeonhole-counting",
    difficulty: "exam",
    title: "Counting shortest routes on a grid (optionally through a point)",
    generate(rng) {
      for (;;) {
        const w = rng.int(2, 7);
        const h = rng.int(2, 6);
        const through = rng.bool(0.5);
        const total = nCr(w + h, h);

        if (!through) {
          const ans = total;
          const pool: Cand[] = [
            {
              v: w * h,
              why: `This is ${m(`${w} \\times ${h}`)}: multiplying the side lengths of the grid does not count routes.`,
            },
            {
              v: 2 ** (w + h),
              why: `This is ${m(`2^{${w + h}}`)}: it treats each of the ${w + h} steps as a free choice of right or up. A shortest route must have **exactly** ${w} rights and ${h} ups, so most of those sequences miss the target.`,
            },
            {
              v: nPr(w + h, h),
              why: `This is ${m(`\\frac{${w + h}!}{${w}!}`)}: it treats the ${h} up steps as different from each other. They are identical, so you must also divide by ${m(`${h}!`)}.`,
            },
            {
              v: w + h,
              why: `This is ${m(`${w} + ${h}`)}, the **length** of each shortest route, not the number of different routes.`,
            },
            {
              v: nCr(w + h, h - 1),
              why: `This is ${m(`\\binom{${w + h}}{${h - 1}}`)}, an off-by-one: there are ${h} up steps to place among the ${w + h} steps, not ${h - 1}.`,
            },
          ];
          const distractors = pickDistinct(ans, pool);
          if (distractors.length < 3) continue; // re-roll
          return {
            stem: `How many shortest routes go from $(0, 0)$ to $(${w}, ${h})$ on a square grid, moving only **right** or **up**?`,
            answer: m(big(ans)),
            answerValue: ans,
            distractors: distractors.map((d) => ({
              text: m(big(d.v)),
              value: d.v,
              why: d.why,
            })),
            asking: `How many ways can you order ${w} right moves and ${h} up moves?`,
            solution: stepsOf(
              `Going from $(0, 0)$ to $(${w}, ${h})$ takes exactly ${w} right moves (R) and ${h} up moves (U). Any shortest route has exactly these, which makes ${m(`${w} + ${h} = ${w + h}`)} moves in total.`,
              `So a route is just a word such as ${"R".repeat(w)}${"U".repeat(h)}, made of ${w} Rs and ${h} Us. Different orders are different routes.`,
              `To write such a word, choose which ${h} of the ${w + h} positions hold a U. The other positions must be R. So we want the number of ways to choose ${h} from ${w + h}.`,
              `${m(`\\binom{${w + h}}{${h}}`)} means the number of ways to choose ${h} items from ${w + h} when order doesn't matter. ${m(chooseTex(w + h, h))}.`,
            ),
            conclusion: `Choosing where the ${h} up moves go among the ${w + h} moves gives ${m(big(ans))} routes.`,
            keyIdea:
              "For grid routes moving only right and up: total moves $=$ right $+$ up, then routes $= \\binom{\\text{total}}{\\text{up}}$. You choose which moves are up, and the rest are right.",
          };
        }

        // through a point (p, q) strictly inside the rectangle
        const p = rng.int(1, w - 1);
        const q = rng.int(1, h - 1);
        const leg1 = nCr(p + q, q);
        const leg2 = nCr(w - p + h - q, h - q);
        const ans = leg1 * leg2;
        const pool: Cand[] = [
          {
            v: leg1 + leg2,
            why: `This is ${m(`${leg1} + ${leg2}`)}: the two legs are travelled one **after** the other, so the counts are multiplied, not added.`,
          },
          {
            v: total,
            why: `This is ${m(`\\binom{${w + h}}{${h}}`)}, **all** shortest routes; it ignores the condition of passing through ${m(`(${p}, ${q})`)}.`,
          },
          {
            v: total - ans,
            why: `This is ${m(`${big(total)} - ${big(ans)}`)}, the number of routes that **avoid** ${m(`(${p}, ${q})`)}.`,
          },
          {
            v: leg1,
            why: `This only counts the routes from the start to ${m(`(${p}, ${q})`)}; it forgets to multiply by the ${leg2} ways to finish.`,
          },
          {
            v: leg2,
            why: `This only counts the routes from ${m(`(${p}, ${q})`)} to the end; it forgets to multiply by the ${leg1} ways to get there.`,
          },
        ];
        const distractors = pickDistinct(ans, pool);
        if (distractors.length < 3) continue; // re-roll the grid
        return {
          stem: `Moving only **right** or **up** on a square grid, how many shortest routes from $(0, 0)$ to $(${w}, ${h})$ **pass through** $(${p}, ${q})$?`,
          answer: m(big(ans)),
          answerValue: ans,
          distractors: distractors.map((d) => ({
            text: m(big(d.v)),
            value: d.v,
            why: d.why,
          })),
          asking: `How many shortest routes from $(0, 0)$ to $(${w}, ${h})$ go through $(${p}, ${q})$?`,
          solution: stepsOf(
            `A route through ${m(`(${p}, ${q})`)} has two legs: start to that point, **and then** that point to the end. Any first leg can join any second leg, so we count each leg and multiply.`,
            `Leg 1, from $(0, 0)$ to ${m(`(${p}, ${q})`)}: ${p} right and ${q} up, which is ${p + q} moves. A route is fixed once you choose which moves go up. ${m(`\\binom{${p + q}}{${q}}`)} means choosing ${q} from ${p + q}, and ${m(chooseTex(p + q, q))}.`,
            `Leg 2, from ${m(`(${p}, ${q})`)} to ${m(`(${w}, ${h})`)}: ${m(`${w} - ${p} = ${w - p}`)} right and ${m(`${h} - ${q} = ${h - q}`)} up, which is ${w - p + h - q} moves. Choosing which go up gives ${m(chooseTex(w - p + h - q, h - q))}.`,
            `Multiply the two legs: ${m(`${leg1} \\times ${leg2} = ${big(ans)}`)}.`,
          ),
          conclusion: `${leg1} ways to reach ${m(`(${p}, ${q})`)} and ${leg2} ways from there to the end give ${m(big(ans))} routes.`,
          keyIdea:
            "For routes through a point, split at that point: count each leg with $\\binom{\\text{moves}}{\\text{up}}$, then multiply. To count routes that avoid the point, subtract this from the total number of routes.",
        };
      }
    },
  },
];
