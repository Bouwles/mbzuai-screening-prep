import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { pyList } from '../../../lib/tex';

// ---------------------------------------------------------------- helpers
const show = (a: number[]) => `\`${pyList(a)}\``;
const sameList = (a: number[], b: number[]) => a.length === b.length && a.every((x, i) => x === b[i]);
const isSorted = (a: number[]) => a.every((x, i) => i === 0 || a[i - 1] <= x);
const passWord = (k: number) => (k === 1 ? '1 pass' : `${k} passes`);

type Alg = 'bubble' | 'selection' | 'insertion';
const ALG_NAME: Record<Alg, string> = { bubble: 'bubble sort', selection: 'selection sort', insertion: 'insertion sort' };
const ALG_RULE: Record<Alg, string> = {
  bubble: 'In one pass of bubble sort, each pair of neighbouring items is compared from left to right and swapped if the left one is bigger.',
  selection:
    'In one pass of selection sort, the smallest item in the unsorted part is found and swapped with the first item of the unsorted part (a pass still counts if no swap is needed).',
  insertion:
    'In one pass of insertion sort, the next unsorted item is inserted into its correct place in the sorted part at the front (the first pass inserts the second item).',
};

/** Runs k passes and returns the list after each pass plus a description of each pass. */
function runPasses(alg: Alg, src: number[], k: number): { states: number[][]; notes: string[] } {
  const a = src.slice();
  const states: number[][] = [];
  const notes: string[] = [];
  const n = a.length;
  for (let p = 0; p < k; p++) {
    if (alg === 'bubble') {
      const parts: string[] = [];
      for (let i = 0; i < n - 1 - p; i++) {
        if (a[i] > a[i + 1]) {
          parts.push(`${a[i]} and ${a[i + 1]}: swap`);
          [a[i], a[i + 1]] = [a[i + 1], a[i]];
        } else parts.push(`${a[i]} and ${a[i + 1]}: no swap`);
      }
      notes.push(parts.join('; '));
    } else if (alg === 'selection') {
      let mi = p;
      for (let i = p + 1; i < n; i++) if (a[i] < a[mi]) mi = i;
      const part = pyList(a.slice(p));
      if (mi === p) notes.push(`unsorted part \`${part}\`, smallest is ${a[p]}, already first, so no swap`);
      else notes.push(`unsorted part \`${part}\`, smallest is ${a[mi]}, swap it with ${a[p]}`);
      [a[p], a[mi]] = [a[mi], a[p]];
    } else {
      const idx = p + 1;
      const v = a[idx];
      const sortedBefore = pyList(a.slice(0, idx));
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
          ? `insert ${v} into the sorted part \`${sortedBefore}\`: it is already bigger than ${a[idx - 1]}, so it stays`
          : `insert ${v} into the sorted part \`${sortedBefore}\`: shift ${shifted.join(', ')} one place right and put ${v} in the gap`,
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

const BS_CODE =
  'low ← 0\n' +
  'high ← length(A) - 1\n' +
  'WHILE low <= high DO\n' +
  '    mid ← (low + high) DIV 2      // round down\n' +
  '    compare A[mid] with target\n' +
  '    IF A[mid] = target THEN\n' +
  '        RETURN mid\n' +
  '    ELSE IF A[mid] < target THEN\n' +
  '        low ← mid + 1\n' +
  '    ELSE\n' +
  '        high ← mid - 1\n' +
  '    ENDIF\n' +
  'ENDWHILE\n' +
  'RETURN -1                         // not found';

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
        const solution =
          `${ALG_RULE[alg]}\n\nStart: ${show(list)}\n\n` +
          states.map((s, i) => `- **Pass ${i + 1}:** ${notes[i]}. List: ${show(s)}`).join('\n') +
          `\n\n${what}\n\nAnswer: ${answer}`;
        return {
          stem: `The list ${show(list)} is sorted into ascending order using **${ALG_NAME[alg]}**. ${ALG_RULE[alg]} What is the list after **${passWord(k)}**?`,
          answer,
          answerValue: ans.join(','),
          distractors: picked.map((c) => ({ text: c.text, value: c.v, why: c.why })),
          solution,
          keyIdea:
            alg === 'bubble'
              ? 'Each pass of bubble sort carries the largest remaining item to the end of the list.'
              : alg === 'selection'
                ? 'Each pass of selection sort swaps the smallest remaining item into the next position at the front.'
                : 'Each pass of insertion sort grows the sorted part at the front by one item.',
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
            why: 'This rounds the middle index **up** when low + high is odd. DIV 2 rounds down.',
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
        let lo = 0;
        let hi = n - 1;
        const rows: string[] = [];
        let step = 0;
        let found = false;
        while (lo <= hi) {
          step++;
          const mid = Math.floor((lo + hi) / 2);
          const half = (lo + hi) % 2 === 1 ? `$${lo + hi} \\div 2 = ${(lo + hi) / 2}$, round down to ${mid}` : `$${lo + hi} \\div 2 = ${mid}$`;
          let act: string;
          if (a[mid] === target) {
            act = 'found';
            found = true;
          } else if (a[mid] < target) act = `$${a[mid]} < ${target}$, so low = ${mid + 1}`;
          else act = `$${a[mid]} > ${target}$, so high = ${mid - 1}`;
          rows.push(`| ${step} | ${lo} | ${hi} | ${half} | ${a[mid]} | ${act} |`);
          if (found) break;
          if (a[mid] < target) lo = mid + 1;
          else hi = mid - 1;
        }
        const ending = found
          ? `${target} is found after ${step} comparison${step === 1 ? '' : 's'}.`
          : `Now low = ${lo} is bigger than high = ${hi}, so the loop stops and the search reports that ${target} is not in the list.`;
        const solution =
          `The list has ${n} items, so low = 0 and high = ${n - 1} at the start.\n\n` +
          '| Step | low | high | mid | A[mid] | Decision |\n| --- | --- | --- | --- | --- | --- |\n' +
          rows.join('\n') +
          `\n\n${ending}\n\nAnswer: ${answer}`;
        return {
          stem: `The binary search below is used to look for **${target}** in the sorted list ${show(a)} (indexes start at 0). Which values are compared with ${target}, in order? (The target may or may not be in the list.)`,
          code: { lang: 'pseudocode', source: BS_CODE },
          answer,
          answerValue: answer,
          distractors: picked.map((c) => ({ text: c.text, value: c.v, why: c.why })),
          solution,
          keyIdea: 'Trace binary search with a table of low, high and mid, rounding mid down and excluding mid after each comparison.',
        };
      }
    },
  },
  {
    id: 'gen-searching-sorting-merge-count',
    subtopic: 'searching-sorting',
    difficulty: 'foundation',
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
      const rows: string[] = [];
      const out: number[] = [];
      while (i < m && j < n) {
        const take = x[i] <= y[j] ? x[i] : y[j];
        rows.push(`| ${x[i]} and ${y[j]} | ${take} | \`${pyList([...out, take])}\` |`);
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
      const solution =
        'Compare the front items, move the smaller one to the output, and repeat:\n\n' +
        '| Compare | Smaller (moved) | Output so far |\n| --- | --- | --- |\n' +
        rows.join('\n') +
        `\n\nNow the ${emptied} list is empty, so ${restList.join(', ')} ${restList.length === 1 ? 'is' : 'are'} copied across with no more comparisons, giving \`${pyList([...out, ...restList])}\`.\n\n` +
        `Counting the rows of the table gives the number of comparisons.\n\nAnswer: ${answer}`;
      return {
        stem: `In merge sort, two sorted lists are merged by repeatedly comparing the front items of each list and moving the smaller one to the output. When one list becomes empty, the rest of the other list is copied across with no more comparisons. How many comparisons are made when merging ${show(x)} and ${show(y)}?`,
        answer,
        answerValue: c,
        distractors: picked.map((p) => ({ text: p.text, value: p.v, why: p.why })),
        solution,
        keyIdea: 'Each comparison in a merge places exactly one item; once one list is empty the rest is copied without comparing.',
      };
    },
  },
];
