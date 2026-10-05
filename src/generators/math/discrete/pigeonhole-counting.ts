import type { Generator } from "../../../types";
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
const floorTex = (N: number, a: number) =>
  `\\left\\lfloor \\frac{${N}}{${a}} \\right\\rfloor`;

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
      `There are ${N} people at a concert. What is the **largest** number $n$ for which we can be **certain** that at least $n$ of them were born in the same month?`,
    stemB: (r) =>
      `What is the **smallest** number of people needed to be **certain** that at least ${r} of them were born in the same month?`,
  },
  {
    k: 7,
    boxes: "days of the week",
    items: "people",
    stemA: (N) =>
      `${N} people belong to a sports club. What is the **largest** number $n$ for which we can be **certain** that at least $n$ of them were born on the same day of the week?`,
    stemB: (r) =>
      `What is the **smallest** number of people needed to be **certain** that at least ${r} of them were born on the same day of the week?`,
  },
  {
    k: null,
    kRange: [3, 8],
    boxes: "colours",
    items: "socks",
    stemA: (N, k) =>
      `A drawer holds ${N} socks, and each sock is one of ${k} colours. What is the **largest** number $n$ for which we can be **certain** that at least $n$ of the socks are the same colour?`,
    stemB: (r, k) =>
      `A drawer contains plenty of socks in ${k} different colours. In the dark, what is the **smallest** number of socks you must take out to be **certain** of having at least ${r} socks of the same colour?`,
  },
  {
    k: 5,
    boxes: "grades",
    items: "students",
    stemA: (N) =>
      `${N} students sit a test that is graded with one of 5 grades (A, B, C, D or E). What is the **largest** number $n$ for which we can be **certain** that at least $n$ students receive the same grade?`,
    stemB: (r) =>
      `A test is graded with one of 5 grades (A, B, C, D or E). What is the **smallest** number of students who must sit the test to be **certain** that at least ${r} of them receive the same grade?`,
  },
  {
    k: null,
    kRange: [4, 10],
    boxes: "mailboxes",
    items: "letters",
    stemA: (N, k) =>
      `${N} letters are delivered into ${k} mailboxes. What is the **largest** number $n$ for which we can be **certain** that some mailbox receives at least $n$ letters?`,
    stemB: (r, k) =>
      `Letters are delivered into ${k} mailboxes. What is the **smallest** number of letters that must be delivered to be **certain** that some mailbox receives at least ${r} letters?`,
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
          solution:
            `Boxes: the ${k} ${ctx.boxes}. Objects: the ${N} ${ctx.items}. To keep every box as small as possible, spread the objects as evenly as you can.\n\n` +
            `- ${m(`${N} \\div ${k} = ${q}`)} remainder ${s}, so giving ${q} to every box uses ${m(`${k} \\times ${q} = ${q * k}`)} objects.\n` +
            `- There ${s === 1 ? 'is' : 'are'} still ${m(`${N} - ${q * k} = ${s}`)} left over, and ${s === 1 ? 'it' : 'each'} must go into a box that already has ${q}. So some box has at least ${ans}.\n` +
            `- More than ${ans} is not guaranteed: put ${ans} in ${s} box${s === 1 ? "" : "es"} and ${q} in the others; that uses all ${N} and no box has ${ans + 1}.\n\n` +
            `$$n = \\left\\lceil \\frac{${N}}{${k}} \\right\\rceil = ${ans}$$\n\n` +
            `Answer: ${m(String(ans))}`,
          keyIdea:
            "Generalised pigeonhole: $N$ objects in $k$ boxes force some box to contain at least $\\left\\lceil \\frac{N}{k} \\right\\rceil$.",
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
        solution:
          `Boxes: the ${k} ${ctx.boxes}. Imagine the **worst case**, where you avoid ${r} in any box for as long as possible.\n\n` +
          `- You can have ${r - 1} in every box without any box reaching ${r}: ${m(`${k} \\times ${r - 1} = ${worst}`)}.\n` +
          `- The next one must land in a box that already has ${r - 1}, making ${r}.\n\n` +
          `$$${k}(${r} - 1) + 1 = ${worst} + 1 = ${ans}$$\n\n` +
          `Answer: ${m(String(ans))}`,
        keyIdea:
          "To force $r$ objects into one of $k$ boxes you need $k(r-1) + 1$: fill every box to $r - 1$, then add one more.",
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
        const lcmLine =
          l === a * b
            ? `Divisible by **both**: multiples of ${m(`\\text{lcm}(${a}, ${b}) = ${l}`)}: ${m(`${floorTex(N, l)} = ${fab}`)}.`
            : `Divisible by **both**: multiples of ${m(`\\text{lcm}(${a}, ${b}) = ${l}`)} (not ${m(`${a} \\times ${b}`)}): ${m(`${floorTex(N, l)} = ${fab}`)}.`;
        return {
          stem,
          answer: m(String(ans)),
          answerValue: ans,
          distractors: distractors.map((d) => ({
            text: m(big(d.v)),
            value: d.v,
            why: d.why,
          })),
          solution:
            `Count multiples by dividing and rounding down (the brackets mean "round down").\n\n` +
            `- Multiples of ${a}: ${m(`${floorTex(N, a)} = ${fa}`)}.\n` +
            `- Multiples of ${b}: ${m(`${floorTex(N, b)} = ${fb}`)}.\n` +
            `- ${lcmLine}\n\n` +
            `Inclusion-exclusion (the overlap was counted twice, so subtract it once):\n\n` +
            `$$${fa} + ${fb} - ${fab} = ${either}$$\n\n` +
            (askNeither
              ? `Neither: ${m(`${N} - ${either} = ${neither}`)}.\n\n`
              : "") +
            `Answer: ${m(String(ans))}`,
          keyIdea:
            'Inclusion-exclusion: $|A \\cup B| = |A| + |B| - |A \\cap B|$, and "divisible by both" means a multiple of the LCM.',
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
            stem: `A robot moves on a square grid from $(0, 0)$ to $(${w}, ${h})$, one unit at a time, only to the **right** or **up**. How many different shortest routes are there?`,
            answer: m(big(ans)),
            answerValue: ans,
            distractors: distractors.map((d) => ({
              text: m(big(d.v)),
              value: d.v,
              why: d.why,
            })),
            solution:
              `Every shortest route has exactly ${w} right steps (R) and ${h} up steps (U), so ${m(`${w} + ${h} = ${w + h}`)} steps in total.\n\n` +
              `A route is fixed once you decide **which ${h} of the ${w + h} steps are U**:\n\n` +
              `$$\\binom{${w + h}}{${h}} = \\frac{${w + h}!}{${w}! \\times ${h}!} = ${big(ans)}$$\n\n` +
              `Answer: ${m(big(ans))}`,
            keyIdea:
              "Shortest grid routes with $m$ rights and $n$ ups: $\\binom{m+n}{n}$ (choose where the ups go).",
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
          stem: `A robot moves on a square grid from $(0, 0)$ to $(${w}, ${h})$, one unit at a time, only to the **right** or **up**. How many shortest routes **pass through** the point $(${p}, ${q})$?`,
          answer: m(big(ans)),
          answerValue: ans,
          distractors: distractors.map((d) => ({
            text: m(big(d.v)),
            value: d.v,
            why: d.why,
          })),
          solution:
            `Split the journey at ${m(`(${p}, ${q})`)} and multiply (first leg **and then** second leg).\n\n` +
            `- Start to ${m(`(${p}, ${q})`)}: ${p} right and ${q} up, so ${m(`\\binom{${p + q}}{${q}} = ${leg1}`)} routes.\n` +
            `- ${m(`(${p}, ${q})`)} to ${m(`(${w}, ${h})`)}: ${w - p} right and ${h - q} up, so ${m(`\\binom{${w - p + h - q}}{${h - q}} = ${leg2}`)} routes.\n\n` +
            `$$${leg1} \\times ${leg2} = ${big(ans)}$$\n\n` +
            `Answer: ${m(big(ans))}`,
          keyIdea:
            "Routes through a point = (routes to the point) times (routes from the point to the end).",
        };
      }
    },
  },
];
