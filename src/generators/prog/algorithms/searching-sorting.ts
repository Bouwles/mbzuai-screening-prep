import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps, table } from '../../../lib/explanation';
import { pyList } from '../../../lib/tex';

// ---------------------------------------------------------------- helpers
const show = (a: number[]) => `\`${pyList(a)}\``;
const sameList = (a: number[], b: number[]) => a.length === b.length && a.every((x, i) => x === b[i]);
const isSorted = (a: number[]) => a.every((x, i) => i === 0 || a[i - 1] <= x);
const passWord = (k: number) => (k === 1 ? '1 pass' : `${k} passes`);

type Alg = 'bubble' | 'selection' | 'insertion';
const ALG_NAME: Record<Alg, string> = { bubble: 'bubble sort', selection: 'selection sort', insertion: 'insertion sort' };
/** One-clause rule for the stem. */
const ALG_SHORT: Record<Alg, string> = {
  bubble: 'each swapping neighbours left to right when the left is bigger',
  selection: 'each swapping the smallest unsorted item into the first unsorted position',
  insertion: 'each inserting the next item into the sorted front part, starting with the second item',
};
const ALG_RULE: Record<Alg, string> = {
  bubble: 'One pass of bubble sort compares each pair of neighbours from left to right and swaps them if the left one is bigger.',
  selection: 'One pass of selection sort swaps the smallest unsorted item with the first unsorted item (a pass still counts if no swap is needed).',
  insertion: 'One pass of insertion sort puts the next unsorted item into its place in the sorted front part (the first pass inserts the second item).',
};
/** The first step of the working: what one pass does, for someone who has not met this sort. */
const ALG_TEACH: Record<Alg, string> = {
  bubble: 'One **pass** of bubble sort walks through the list from left to right. At each position it compares two neighbours and swaps them if the left one is bigger.',
  selection: 'One **pass** of selection sort finds the smallest item in the unsorted part, then swaps it with the first unsorted item. The sorted part grows at the front of the list.',
  insertion: 'Insertion sort keeps a sorted part at the front, like sorted cards in your hand. It starts as just the first item. One **pass** takes the next item and slides it left until it fits.',
};

/** Runs k passes and returns the list after each pass plus a description of each pass. */
function runPasses(alg: Alg, src: number[], k: number): { states: number[][]; notes: string[] } {
  const a = src.slice();
  const states: number[][] = [];
  const notes: string[] = [];
  const n = a.length;
  for (let p = 0; p < k; p++) {
    if (alg === 'bubble') {
      const rows: string[][] = [];
      for (let i = 0; i < n - 1 - p; i++) {
        const [x, y] = [a[i], a[i + 1]];
        if (x > y) [a[i], a[i + 1]] = [y, x];
        rows.push([`${x} and ${y}`, x > y ? 'yes, swap' : 'no', show(a)]);
      }
      const settled = p === 0 ? '' : ` The last ${p === 1 ? 'item is' : `${p} items are`} already in place, so stop before ${p === 1 ? 'it' : 'them'}.`;
      notes.push(steps(`**Pass ${p + 1}.** Compare the pairs, always using the list as it stands after the last swap.${settled}`, table(['Compare', 'Left bigger?', 'List after'], rows)));
    } else if (alg === 'selection') {
      let mi = p;
      for (let i = p + 1; i < n; i++) if (a[i] < a[mi]) mi = i;
      const part = show(a.slice(p));
      const [small, first] = [a[mi], a[p]];
      [a[p], a[mi]] = [a[mi], a[p]];
      notes.push(
        mi === p
          ? `**Pass ${p + 1}.** The unsorted part is ${part}. The smallest item is ${small}, and it is already first, so nothing moves. This still counts as a pass. The list stays ${show(a)}.`
          : `**Pass ${p + 1}.** The unsorted part is ${part}. The smallest item is ${small}. Swap it with ${first}, the first unsorted item, giving ${show(a)}.`,
      );
    } else {
      const idx = p + 1;
      const v = a[idx];
      const sortedBefore = show(a.slice(0, idx));
      let j = idx - 1;
      const shifted: number[] = [];
      while (j >= 0 && a[j] > v) {
        shifted.push(a[j]);
        a[j + 1] = a[j];
        j--;
      }
      a[j + 1] = v;
      notes.push(
        shifted.length === 0
          ? `**Pass ${p + 1}.** Take the next item, ${v}. The sorted part is ${sortedBefore}. Its largest item, ${a[idx - 1]}, is smaller than ${v}, so ${v} stays where it is. The list stays ${show(a)}.`
          : `**Pass ${p + 1}.** Take the next item, ${v}. The sorted part is ${sortedBefore}. ${shifted.length === 1 ? `${shifted[0]} is` : `${shifted.join(' and ')} are`} bigger than ${v}, so ${shifted.length === 1 ? 'it shifts' : 'they shift'} one place right and ${v} goes in the gap, giving ${show(a)}.`,
      );
    }
    states.push(a.slice());
  }
  return { states, notes };
}
const after = (alg: Alg, src: number[], k: number): number[] => (k === 0 ? src.slice() : runPasses(alg, src, k).states[k - 1]);

/** Values compared with the target by a binary search variant (null if it loops forever). */
function probes(
  a: number[],
  target: number,
  opt: { ceil?: boolean; strict?: boolean; flip?: boolean; noPlusMinus?: boolean } = {},
): number[] | null {
  let lo = 0;
  let hi = a.length - 1;
  const seen: number[] = [];
  const states = new Set<string>();
  while (opt.strict ? lo < hi : lo <= hi) {
    const st = `${lo},${hi}`;
    if (states.has(st)) return null;
    states.add(st);
    const mid = opt.ceil ? Math.floor((lo + hi + 1) / 2) : Math.floor((lo + hi) / 2);
    seen.push(a[mid]);
    if (a[mid] === target) return seen;
    const goRight = opt.flip ? a[mid] > target : a[mid] < target;
    if (goRight) lo = opt.noPlusMinus ? mid : mid + 1;
    else hi = opt.noPlusMinus ? mid : mid - 1;
  }
  return seen;
}

const BS_CODE = [
  'function search(A, target)',
  '   low = 1',
  '   high = length(A)',
  '   while (low <= high)',
  '      mid = div(low + high, 2) // div is integer division',
  '      if A[mid] == target',
  '         return mid',
  '      else',
  '         if A[mid] < target',
  '            low = mid + 1',
  '         else',
  '            high = mid - 1',
  '         end if',
  '      end if',
  '   end while',
  '   return 0',
  'end function',
].join('\n');

type Cand<T> = { v: T; text: string; why: string };
function pickThree<T>(answerText: string, pool: Cand<T>[]): Cand<T>[] {
  const out: Cand<T>[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (c.text === answerText || out.some((o) => o.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

// ---------------------------------------------------------------- generators
export const generators: Generator[] = [
  {
    id: 'gen-searching-sorting-pass-state',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    title: 'State of a list after k passes of bubble, selection or insertion sort',
    generate(rng: Rng) {
      for (let attempt = 0; ; attempt++) {
        const n = rng.int(5, 7);
        const pool = Array.from({ length: 39 }, (_, i) => i + 1);
        const list = rng.sample(pool, n);
        const alg = rng.pick<Alg>(['bubble', 'selection', 'insertion']);
        const k = rng.int(1, 3);
        const { states, notes } = runPasses(alg, list, k);
        const ans = states[k - 1];
        if ((isSorted(ans) || sameList(ans, list)) && attempt < 200) continue;
        const others = (['bubble', 'selection', 'insertion'] as Alg[]).filter((x) => x !== alg);
        const cands: Cand<string>[] = [];
        for (const o of others) {
          const r = after(o, list, k);
          cands.push({
            v: r.join(','),
            text: show(r),
            why:
              `This is the list after ${passWord(k)} of ${ALG_NAME[o]}, not ${ALG_NAME[alg]}` +
              (sameList(r, list) ? ` (for this list, ${ALG_NAME[o]} leaves it unchanged)` : '') +
              `. ${ALG_RULE[alg]}`,
          });
        }
        if (k >= 2) {
          const r = after(alg, list, k - 1);
          cands.push({ v: r.join(','), text: show(r), why: `This is the list after only ${passWord(k - 1)}: you stopped one pass too early.` });
        }
        const r1 = after(alg, list, k + 1);
        cands.push({ v: r1.join(','), text: show(r1), why: `This is the list after ${passWord(k + 1)}: you did one pass too many.` });
        const sorted = [...list].sort((x, y) => x - y);
        cands.push({
          v: sorted.join(','),
          text: show(sorted),
          why: `This is the fully sorted list. After only ${passWord(k)} of ${ALG_NAME[alg]} the list is not necessarily sorted yet.`,
        });
        // shuffle the order of mistakes so that variants use different distractors
        const order = rng.shuffle(cands);
        const picked = pickThree(show(ans), order);
        if (picked.length < 3 && attempt < 200) continue;
        const answer = show(ans);
        const what =
          alg === 'bubble'
            ? `After ${passWord(k)} of bubble sort, the ${k === 1 ? 'largest item is' : `${k} largest items are`} at the end.`
            : alg === 'selection'
              ? `After ${passWord(k)} of selection sort, the ${k === 1 ? 'smallest item is' : `${k} smallest items are`} at the front.`
              : `After ${passWord(k)} of insertion sort, the first ${k + 1} items are in order and the rest have not been touched.`;
        return {
          stem: `${passWord(k).charAt(0).toUpperCase() + passWord(k).slice(1)} of **${ALG_NAME[alg]}**, ${ALG_SHORT[alg]}, ${k === 1 ? 'is' : 'are'} applied to ${show(list)}. What is the list afterwards?`,
          answer,
          answerValue: ans.join(','),
          distractors: picked.map((c) => ({ text: c.text, value: c.v, why: c.why })),
          asking: `What does the list look like after ${passWord(k)} of ${ALG_NAME[alg]}?`,
          solution: steps(ALG_TEACH[alg], `The list starts as ${show(list)}.`, ...notes),
          conclusion: `${what} The list is ${answer}.`,
          keyIdea:
            alg === 'bubble'
              ? 'For bubble sort, write one row for each neighbouring pair and start each pass from the list the last one left. After $k$ passes the $k$ largest items are in place at the end.'
              : alg === 'selection'
                ? 'For selection sort, write the unsorted part on each pass, find its smallest item, and swap it with the first unsorted item. After $k$ passes the $k$ smallest items are at the front.'
                : 'For insertion sort, split the list into a sorted part and an untouched part. Each pass moves one item across. After $k$ passes the first $k + 1$ items are sorted and the rest have not moved.',
        };
      }
    },
  },
  {
    id: 'gen-searching-sorting-binary-trace',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    title: 'Trace a binary search: which values are compared?',
    generate(rng: Rng) {
      for (let attempt = 0; ; attempt++) {
        const n = rng.int(9, 15);
        const a: number[] = [];
        let v = rng.int(1, 15);
        for (let i = 0; i < n; i++) {
          a.push(v);
          v += rng.int(2, 9);
        }
        const present = rng.bool(0.7);
        let target: number;
        if (present) target = rng.pick(a);
        else {
          const j = rng.int(0, n - 2);
          target = a[j] + 1; // gaps are at least 2, so this is never in the list
        }
        const seq = probes(a, target)!;
        const fmtSeq = (s: number[]) => s.join(', ');
        const answer = fmtSeq(seq);
        const cands: Cand<string>[] = [];
        const ceil = probes(a, target, { ceil: true });
        if (ceil)
          cands.push({
            v: fmtSeq(ceil),
            text: fmtSeq(ceil),
            why: 'This rounds the middle index **up** when low + high is odd. `div` rounds down.',
          });
        const flip = probes(a, target, { flip: true });
        if (flip)
          cands.push({
            v: fmtSeq(flip),
            text: fmtSeq(flip),
            why: 'This goes the wrong way: when the middle value is too small it searches the left half instead of the right half (and vice versa).',
          });
        const strict = probes(a, target, { strict: true });
        if (strict && strict.length > 0)
          cands.push({
            v: fmtSeq(strict),
            text: fmtSeq(strict),
            why: 'This stops the loop as soon as low equals high (as if the condition were low < high), so the last remaining item is never compared. The loop runs while low <= high.',
          });
        const noPM = probes(a, target, { noPlusMinus: true });
        if (noPM)
          cands.push({
            v: fmtSeq(noPM),
            text: fmtSeq(noPM),
            why: 'This sets low = mid or high = mid instead of mid + 1 or mid - 1, so the item just checked stays in the range and the later middles change.',
          });
        const idx = present ? a.indexOf(target) : a.findIndex((x) => x > target);
        const lin = a.slice(0, idx + 1);
        if (lin.length >= 2 && lin.length <= 8)
          cands.push({
            v: fmtSeq(lin),
            text: fmtSeq(lin),
            why: present
              ? 'This is a linear search from the start of the list. Binary search jumps to the middle each time.'
              : 'This is a linear search from the start, stopping at the first value bigger than the target. Binary search jumps to the middle each time.',
          });
        const picked = pickThree(answer, rng.shuffle(cands));
        if (picked.length < 3 && attempt < 300) continue;
        if (picked.length < 3) throw new Error('binary-trace: not enough distractors');

        // trace table
        let lo = 1;
        let hi = n;
        const rows: (string | number)[][] = [];
        let step = 0;
        let found = false;
        let lastCheck = '';
        while (lo <= hi) {
          step++;
          const mid = Math.floor((lo + hi) / 2);
          const half = (lo + hi) % 2 === 1 ? `$${lo + hi} \\div 2 = ${(lo + hi) / 2}$, round down to ${mid}` : `$${lo + hi} \\div 2 = ${mid}$`;
          const value = a[mid - 1];
          let act: string;
          if (value === target) {
            act = 'found';
            found = true;
          } else if (value < target) act = `$${value} < ${target}$, so \`low\` = ${mid + 1}`;
          else act = `$${value} > ${target}$, so \`high\` = ${mid - 1}`;
          rows.push([step, lo, hi, half, value, act]);
          lastCheck = `Check ${step}: \`low\` is ${lo} and \`high\` is ${hi}, so \`mid\` comes from ${half}, and \`A[${mid}]\` is ${value}.`;
          if (found) break;
          if (value < target) lo = mid + 1;
          else hi = mid - 1;
        }
        const lastValue = seq[seq.length - 1];
        const ending = found
          ? `That is the target, so line 7 returns and the search stops.`
          : `Since ${lastValue < target ? `$${lastValue} < ${target}$, \`low\` becomes ${lo}` : `$${lastValue} > ${target}$, \`high\` becomes ${hi}`}. Now \`low\` is bigger than \`high\`, so the loop on line 4 ends and ${target} is not in the list.`;
        const solution = steps(
          'Binary search only works on a sorted list. It checks the middle item, then throws away the half that cannot contain the target.',
          '`low` and `high` (lines 2 and 3) are the first and last indexes still being searched. Line 5 finds the middle index, `mid`, and `A[mid]` is the value at that index. `div` divides and rounds down, so `div(7, 2)` is 3.',
          'Line 9 decides which half to keep. If `A[mid]` is too small, the target must be further right, so line 10 moves `low`. If it is too big, line 12 moves `high`.',
          'Write each index beside its value:',
          table(['Index', ...a.map((_, i) => i + 1)], [['Value', ...a]]),
          rows.length > 1 && 'Trace the search one check at a time:',
          rows.length > 1 && table(['Check', '`low`', '`high`', '`mid`, from `low + high`', '`A[mid]`', 'Decision'], rows.slice(0, -1)),
          `${lastCheck} ${ending}`,
        );
        return {
          stem: `This binary search looks for **${target}** in the sorted array ${show(a)}. Arrays are indexed from 1. Which values are compared with ${target}, in order?`,
          code: { lang: 'pseudocode', source: BS_CODE },
          answer,
          answerValue: answer,
          distractors: picked.map((c) => ({ text: c.text, value: c.v, why: c.why })),
          asking: `Which array values does the search check, in order, while looking for ${target}?`,
          solution,
          conclusion: `Reading the \`A[mid]\` values in the order they were checked gives ${answer}.`,
          keyIdea: 'Trace binary search with columns for `low`, `high`, `mid` and `A[mid]`. Round `mid` down. If `A[mid]` is too small, `low` becomes `mid + 1`. If too big, `high` becomes `mid - 1`. Stop when found or when `low` passes `high`.',
        };
      }
    },
  },
  {
    id: 'gen-searching-sorting-merge-count',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    title: 'Count the comparisons in a merge step',
    generate(rng: Rng) {
      const m = rng.int(2, 4);
      const n = rng.int(3, 5);
      const vals = rng.sample(
        Array.from({ length: 60 }, (_, i) => i + 1),
        m + n,
      );
      const x = vals.slice(0, m).sort((p, q) => p - q);
      const y = vals.slice(m).sort((p, q) => p - q);
      let i = 0;
      let j = 0;
      const rows: (string | number)[][] = [];
      const out: number[] = [];
      while (i < m && j < n) {
        const take = x[i] <= y[j] ? x[i] : y[j];
        rows.push([`${x[i]} and ${y[j]}`, take, show([...out, take])]);
        out.push(take);
        if (x[i] <= y[j]) i++;
        else j++;
      }
      const c = rows.length;
      const restList = i < m ? x.slice(i) : y.slice(j);
      const emptied = i < m ? 'second' : 'first';
      const answer = String(c);
      const pool: Cand<number>[] = [
        {
          v: m + n,
          text: String(m + n),
          why: `This counts every item placed in the output (${m + n} items). Items copied after one list is empty need no comparison.`,
        },
        {
          v: m + n - 1,
          text: String(m + n - 1),
          why: `This is the worst-case formula (total items minus 1 = ${m + n - 1}). That only happens when one list runs out at the very end; here it runs out earlier.`,
        },
        {
          v: m * n,
          text: String(m * n),
          why: `This compares every item of one list with every item of the other ($${m} \\times ${n} = ${m * n}$). A merge only ever compares the two front items.`,
        },
        {
          v: Math.min(m, n),
          text: String(Math.min(m, n)),
          why: `This counts only the items of the shorter list (${Math.min(m, n)} items), as if only they needed comparing. In fact every item moved before a list runs out costs one comparison, whichever list it comes from.`,
        },
      ];
      const picked = pickThree(answer, pool);
      // guaranteed fallback (never needed in practice, kept for safety)
      for (let extra = c + 1; picked.length < 3; extra++)
        if (!picked.some((p) => p.v === extra) && extra !== c)
          picked.push({ v: extra, text: String(extra), why: 'This miscounts the rows of the merge: count one comparison for each item moved before a list becomes empty.' });
      const solution = steps(
        '**Merging** joins two sorted lists into one sorted list. Each list is already in order, so its smallest remaining item is always at its front.',
        'So only the two front items ever need comparing. Each comparison moves the smaller one to the output, which means one comparison moves exactly one item.',
        'Here is every comparison:',
        table(['Compare', 'Smaller (moved)', 'Output so far'], rows),
        `Now the ${emptied} list is empty, so ${restList.join(' and ')} ${restList.length === 1 ? 'is' : 'are'} copied across with nothing left to compare against. The output is ${show([...out, ...restList])}.`,
        `Each row of the table was one comparison, and there ${c === 1 ? 'is 1 row' : `are ${c} rows`}.`,
      );
      return {
        stem: `When merging ${show(x)} and ${show(y)}, each comparison moves the smaller front item to the output, and leftovers are copied without comparing. How many comparisons are made?`,
        answer,
        answerValue: c,
        distractors: picked.map((p) => ({ text: p.text, value: p.v, why: p.why })),
        asking: 'How many front-item comparisons happen before one list runs out?',
        solution,
        conclusion: `Comparisons stop as soon as the ${emptied} list runs out, which takes ${c === 1 ? '1 row' : `${c} rows`}, so the answer is ${answer}.`,
        keyIdea: 'For merge counts, make one row per comparison of the two front items. Each row moves one item. Stop when either list is empty, because the leftovers cost no comparisons.',
      };
    },
  },
];
