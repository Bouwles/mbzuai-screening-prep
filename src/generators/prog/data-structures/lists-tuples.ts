import type { GeneratedCore, Generator } from '../../../types';
import { steps, table } from '../../../lib/explanation';
import type { Rng } from '../../../lib/rng';

const STEM = 'Arrays are indexed from 1. What does this pseudocode print?';

/** How the pseudocode prints an array. */
const repr = (a: number[]) => `[${a.join(', ')}]`;
const lit = (a: number[]) => `\`${repr(a)}\``;

type Cand = { text: string; value: string | number; why: string };

/** Keep up to 3 candidates whose text differs from the answer and from each other. */
function pickDistinct(answer: string, pool: Cand[]): Cand[] {
  const key = (s: string) => s.replace(/[\s`]/g, '');
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (key(c.text) === key(answer) || out.some((o) => key(o.text) === key(c.text))) continue;
    out.push(c);
  }
  return out;
}

const mkNum = (v: number, why: string): Cand => ({ text: String(v), value: v, why });
const mkArr = (a: number[], why: string): Cand => ({ text: lit(a), value: repr(a), why });

/** Each index above its value. */
const indexTable = (A: number[]) => table(['Index', ...A.map((_, i) => i + 1)], [['Value', ...A]]);
const INDEX_INTRO = 'Write each index above its value, counting from 1 as the question says:';

/** A trace with one column per array index, so it is clear which position each line changes. */
const arrayTrace = (front: string[], rows: [(string | number)[], number[]][]) =>
  table([...front, ...rows[0][1].map((_, k) => `\`A[${k + 1}]\``)], rows.map(([cells, a]) => [...cells, ...a]));

// ---------------------------------------------------------------- generator 1: read elements by index
function genIndex(rng: Rng): GeneratedCore {
  for (;;) {
    const n = rng.int(4, 6);
    const A = rng.sample(Array.from({ length: 39 }, (_, i) => i + 2), n);
    const at = (i: number) => A[i - 1];
    const kind = rng.pick(['single', 'sum', 'last'] as const);
    let line: string;
    let v: number;
    let pool: Cand[];
    let asking: string;
    let working: string;
    let conclusion: string;

    if (kind === 'single') {
      const i = rng.int(2, n - 1);
      line = `print(A[${i}])`;
      v = at(i);
      asking = `Which value is stored at index ${i} of \`A\`?`;
      working = steps(`\`A[${i}]\` means the value at index ${i}. Look under ${i} in the table: the value there is ${v}. Line 2 prints it.`);
      conclusion = `Index ${i} holds ${v}, so the answer is ${v}.`;
      pool = [
        mkNum(at(i + 1), `This counts from 0, so index ${i} lands on position ${i + 1}. The first element is \`A[1]\`.`),
        mkNum(at(i - 1), `This stops one position short: \`A[${i}]\` is position ${i}, not position ${i - 1}.`),
        mkNum(i, 'This is the index itself. `A[i]` gives the value stored at that index.'),
        mkNum(n, 'This is the length of the array, not the value at the index.'),
      ];
    } else if (kind === 'sum') {
      const i = rng.int(1, n - 2);
      const j = rng.int(i + 1, n - 1);
      line = `print(A[${i}] + A[${j}])`;
      v = at(i) + at(j);
      asking = `What do you get by adding the values at indexes ${i} and ${j}?`;
      working = steps(
        `\`A[${i}]\` means the value at index ${i}, which is ${at(i)}. \`A[${j}]\` means the value at index ${j}, which is ${at(j)}.`,
        `Line 2 adds them, $${at(i)} + ${at(j)} = ${v}$, and \`print\` shows the result.`,
      );
      conclusion = `\`A[${i}]\` is ${at(i)} and \`A[${j}]\` is ${at(j)}, so the answer is ${v}.`;
      pool = [
        mkNum(at(i + 1) + at(j + 1), 'This counts from 0, so each index lands one position too far along. The first element is `A[1]`.'),
        mkNum(i + j, 'This adds the indices. `A[i]` gives the value stored at that index.'),
        mkNum(at(i) * at(j), 'This multiplies the two values. The code adds them.'),
        mkNum(at(i) + at(j + 1), `This reads the second index as ${j + 1}, one position too far along.`),
      ];
    } else {
      line = 'print(A[length(A)])';
      v = at(n);
      asking = 'What value is at the last position of `A`?';
      working = steps(
        `\`length(A)\` gives the number of elements, which is ${n}. So \`A[length(A)]\` is the same as \`A[${n}]\`.`,
        `Look under ${n} in the table: the value there is ${v}. Line 2 prints it.`,
      );
      conclusion = `The last index is ${n}, and it holds ${v}, so the answer is ${v}.`;
      pool = [
        mkNum(at(n - 1), `This treats the last index as ${n - 1}, which is true when counting from 0. Counting from 1 it is ${n}.`),
        mkNum(n, 'This is the length itself. The code uses it as an index into the array.'),
        mkNum(at(1), 'This is the first element. `length(A)` is the index of the last one.'),
      ];
    }

    const answer = String(v);
    const ds = pickDistinct(answer, pool);
    if (ds.length < 3) continue;
    return {
      stem: STEM,
      code: { lang: 'pseudocode', source: `A = ${repr(A)}\n${line}` },
      answer,
      answerValue: v,
      distractors: ds,
      asking,
      solution: steps(INDEX_INTRO, indexTable(A), working),
      conclusion,
      keyIdea: 'Draw an index row above the values, counting from 1. Replace each `A[i]` with the value under that index, then do any calculation. `length(A)` is the number of elements, so `A[length(A)]` is always the last one.',
    };
  }
}

// ---------------------------------------------------------------- generator 2: traverse with a loop
function genTraverse(rng: Rng): GeneratedCore {
  for (;;) {
    const n = rng.int(4, 5);
    const A = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], n);
    const kind = rng.pick(['sum', 'maxPos', 'countAbove', 'min', 'even'] as const);
    const head = `A = ${repr(A)}`;
    let lines: string[];
    let v: number;
    let asking: string;
    let working: string;
    let conclusion: string;
    let pool: Cand[];
    let keyIdea: string;

    if (kind === 'sum') {
      lines = [head, 's = 0', 'for i = 1 to length(A)', '   s = s + A[i]', 'end for', 'print(s)'];
      let s = 0;
      const rows = A.map((x, i) => {
        const before = s;
        s += x;
        return [i + 1, x, `$${before} + ${x}$`, s];
      });
      v = s;
      asking = 'What total does `s` reach after the loop goes through `A`?';
      working = steps(
        `\`length(A)\` is ${n}, so the loop runs with \`i\` from 1 to ${n}. That visits every index of \`A\` once, and \`A[i]\` is the value at index \`i\`.`,
        '`s` is a **running total**. It starts at 0 on line 2. Line 4 takes the old `s`, adds `A[i]`, and stores the result back in `s`.',
        'Trace each pass. Line 6 prints the value of `s` in the last row:',
        table(['`i`', '`A[i]`', 'Line 4 with numbers', '`s` becomes'], rows),
      );
      conclusion = `Every value is added once, and $${A.join(' + ')}$ gives ${v}.`;
      pool = [
        mkNum(v - A[n - 1], 'This stops one pass early. The loop runs up to and including the length.'),
        mkNum(v - A[0], 'This starts at `i = 2`, leaving out the first element.'),
        mkNum(A[n - 1], 'This is only the last element, as if the line were `s = A[i]`. The running total keeps every value.'),
      ];
      keyIdea = 'Spot the pattern `s = s + A[i]` with `s` starting at 0: it adds up the elements. Check the first and last index the loop visits, then add those values.';
    } else if (kind === 'maxPos') {
      lines = [head, 'p = 1', 'for i = 2 to length(A)', '   if A[i] > A[p]', '      p = i', '   end if', 'end for', 'print(p)'];
      let p = 0;
      const rows: (string | number)[][] = [];
      for (let i = 1; i < n; i++) {
        const before = A[p];
        const bigger = A[i] > before;
        if (bigger) p = i;
        rows.push([i + 1, A[i], before, bigger ? 'yes' : 'no', p + 1]);
      }
      v = p + 1;
      asking = 'Which index does `p` hold when the loop ends?';
      working = steps(
        'Write each index above its value:',
        indexTable(A),
        `\`p\` holds a **position**, not a value. It starts at 1 on line 2. So \`A[p]\` is the largest value found so far, starting with \`A[1]\`, which is ${A[0]}.`,
        'Line 4 compares the current value with `A[p]`. If the current value is bigger, line 5 moves `p` to the current index. If not, `p` stays where it is.',
        'Trace each pass. Line 8 prints `p`, the position, and not the value stored there:',
        table(['`i`', '`A[i]`', '`A[p]` before', '`A[i] > A[p]`?', '`p` afterwards'], rows),
      );
      conclusion = `The largest value, ${A[p]}, is at index ${v}, and line 8 prints the index, so the answer is ${v}.`;
      pool = [
        mkNum(A[p], 'This is the largest **value**. The code prints `p`, its position.'),
        mkNum(p, 'This counts positions from 0. Here the first element is at index 1.'),
        mkNum(n, 'This is the last index. `p` only changes when a larger value is found.'),
        mkNum(A.indexOf(Math.min(...A)) + 1, 'This is the position of the smallest value. The test is `A[i] > A[p]`, which looks for the largest.'),
      ];
      keyIdea = 'In a "find the largest" loop, check whether it prints the value or the position. Trace one row per pass: compare with the current best, and update only when the test is true. `p` stores an index, so look up `A[p]` each time.';
    } else if (kind === 'countAbove') {
      const t = rng.pick(A);
      lines = [head, 'c = 0', 'for i = 1 to length(A)', `   if A[i] > ${t}`, '      c = c + 1', '   end if', 'end for', 'print(c)'];
      let c = 0;
      const rows = A.map((x, i) => [i + 1, x, x > t ? 'yes' : 'no', x > t ? ++c : c]);
      v = c;
      asking = `How many elements of \`A\` are greater than ${t}?`;
      working = steps(
        '`c` is a **counter**. It starts at 0 on line 2, and line 5 adds 1 to it. It counts elements and does not add their values.',
        `\`A[i]\` is the value at index \`i\`. Line 4 tests whether it is strictly greater than ${t}. An element equal to ${t} fails the test, because \`>\` does not include equal values.`,
        'Trace every element. Line 8 prints the value of `c` in the last row:',
        table(['`i`', '`A[i]`', `\`A[i] > ${t}\`?`, '`c` afterwards'], rows),
      );
      conclusion = `Counting the elements above ${t}, \`c\` ends at ${v}, so line 8 prints ${v}.`;
      pool = [
        mkNum(c + 1, `This also counts the value equal to ${t}. The test is strictly greater than.`),
        mkNum(n, 'This counts every element and ignores the `if`.'),
        mkNum(A.filter((x) => x > t).reduce((s, x) => s + x, 0), 'This adds the values that pass the test. The code adds 1 each time.'),
        mkNum(n - c, 'This counts the elements that fail the test.'),
      ];
      keyIdea = 'Spot the difference between `c = c + 1`, which counts, and `s = s + A[i]`, which adds values. Mark each element that passes the test, then count the marks. `>` leaves out a value equal to the limit.';
    } else if (kind === 'min') {
      lines = [head, 'm = A[1]', 'for i = 2 to length(A)', '   if A[i] < m', '      m = A[i]', '   end if', 'end for', 'print(m)'];
      let m = A[0];
      const rows: (string | number)[][] = [];
      for (let i = 1; i < n; i++) {
        const before = m;
        if (A[i] < m) m = A[i];
        rows.push([i + 1, A[i], before, A[i] < before ? 'yes' : 'no', m]);
      }
      v = m;
      asking = 'What value does `m` hold when the loop ends?';
      working = steps(
        `\`m\` holds the smallest value found so far. Line 2 starts it at \`A[1]\`, which is ${A[0]}, so the loop can start from index 2.`,
        'Line 4 tests whether the current value is smaller than `m`. If it is, line 5 replaces `m` with it. If not, `m` stays the same.',
        'Trace each pass. Line 8 prints the value of `m` in the last row:',
        table(['`i`', '`A[i]`', '`m` before', '`A[i] < m`?', '`m` afterwards'], rows),
      );
      conclusion = `The smallest element is ${v}, and that is where \`m\` ends up, so the answer is ${v}.`;
      pool = [
        mkNum(Math.max(...A), 'This is the largest value. The test `A[i] < m` keeps the smaller value.'),
        mkNum(A[0], 'This is the starting value. `m` changes each time a smaller element is found.'),
        mkNum(A[n - 1], 'This is the last element, as if `m` were overwritten on every pass. It changes only when the test is true.'),
        mkNum(A.indexOf(m) + 1, 'This is the position of the smallest value. The code stores and prints the value.'),
      ];
      keyIdea = 'A "smallest so far" search starts `m` at the first element and replaces it only when a smaller element appears. Trace one row per pass with `m` before and after. If `m` starts below every element, it never changes.';
    } else {
      lines = [head, 'c = 0', 'for i = 1 to length(A)', '   if mod(A[i],2) == 0 // mod is the modulus operator', '      c = c + 1', '   end if', 'end for', 'print(c)'];
      let c = 0;
      const rows = A.map((x, i) => [i + 1, x, x % 2, x % 2 === 0 ? 'yes' : 'no', x % 2 === 0 ? ++c : c]);
      v = c;
      asking = 'How many elements of `A` are even?';
      working = steps(
        '`mod(x,2)` is the remainder when `x` is divided by 2. For example, $7 \\div 2$ is 3 remainder 1, so `mod(7,2)` is 1. A remainder of 0 means the number is even.',
        '`A[i]` is the value at index `i`, so line 4 asks whether that value is even. Each time it is, line 5 adds 1 to `c`. `c` is a **counter**: it starts at 0 and does not add the values themselves.',
        'Trace every element. Line 8 prints the value of `c` in the last row:',
        table(['`i`', '`A[i]`', '`mod(A[i],2)`', 'Even?', '`c` afterwards'], rows),
      );
      conclusion = `Counting the even values (${A.filter((x) => x % 2 === 0).join(', ')}) gives ${v}.`;
      pool = [
        mkNum(n - c, 'This counts the odd numbers. A remainder of 0 on dividing by 2 means even.'),
        mkNum(A.filter((x) => x % 2 === 0).reduce((s, x) => s + x, 0), 'This adds the even values. The code adds 1 each time, not the value.'),
        mkNum(n, 'This counts every element and ignores the `if`.'),
        mkNum(c + 1, 'This is one too many: the counter starts at 0, so it ends on the number of even values.'),
      ];
      keyIdea = 'For `mod(x,2) == 0`, mark each even element, then count the marks. `c = c + 1` counts, while `s = s + A[i]` would add the values. A remainder of 0 means the second number divides the first exactly.';
    }

    const answer = String(v);
    const ds = pickDistinct(answer, pool);
    if (ds.length < 3) continue;
    return {
      stem: STEM,
      code: { lang: 'pseudocode', source: lines.join('\n') },
      answer,
      answerValue: v,
      distractors: ds,
      asking,
      solution: working,
      conclusion,
      keyIdea,
    };
  }
}

// ---------------------------------------------------------------- generator 3: swap and shift
function genShift(rng: Rng): GeneratedCore {
  for (;;) {
    const n = rng.int(3, 4);
    const A = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], n);
    const kind = rng.pick(['swap', 'badSwap', 'left', 'right', 'spread', 'stuck'] as const);
    const head = `A = ${repr(A)}`;
    const shiftedLeft = [...A.slice(1), A[n - 1]];
    const shiftedRight = [A[0], ...A.slice(0, n - 1)];
    const rotatedLeft = [...A.slice(1), A[0]];
    const rotatedRight = [A[n - 1], ...A.slice(0, n - 1)];
    const spread = A.map(() => A[0]);
    let lines: string[];
    let pool: Cand[];
    let asking: string;
    let working: string;
    let conclusion: string;
    let keyIdea: string;
    let result: number[] | null;

    const COPY = '`=` copies the value on the right into the place on the left, erasing what was there.';

    if (kind === 'swap' || kind === 'badSwap') {
      const i = rng.int(1, n - 1);
      const j = rng.int(i + 1, n);
      const swapped = [...A];
      swapped[i - 1] = A[j - 1];
      swapped[j - 1] = A[i - 1];
      const copied = [...A];
      copied[i - 1] = A[j - 1];
      const copiedBack = [...A];
      copiedBack[j - 1] = A[i - 1];
      if (kind === 'swap') {
        lines = [head, `t = A[${i}]`, `A[${i}] = A[${j}]`, `A[${j}] = t`, 'print(A)'];
        result = swapped;
        asking = 'What does `A` hold after these three lines change it?';
        working = steps(
          `${COPY} \`t\` is a spare variable, used here to save a value before it gets erased.`,
          'Trace each line, with one column for each index. Line 5 prints the array from the last row:',
          arrayTrace(['Line', 'What it does', '`t`'], [
            [[1, 'creates `A`', '-'], A],
            [[2, `saves \`A[${i}]\` in \`t\``, A[i - 1]], A],
            [[3, `copies \`A[${j}]\` into \`A[${i}]\``, A[i - 1]], copied],
            [[4, `copies \`t\` into \`A[${j}]\``, A[i - 1]], swapped],
          ]),
        );
        conclusion = `The saved ${A[i - 1]} ends at index ${j} and the ${A[j - 1]} ends at index ${i}, so the answer is ${lit(swapped)}.`;
        pool = [
          mkArr(copied, `This stops before the last line. \`A[${j}] = t\` puts the saved value into position ${j}.`),
          mkArr(copiedBack, `This writes the saved value but forgets that \`A[${i}]\` was changed.`),
          mkArr(A, 'This assumes the lines cancel out. Each one really changes the array.'),
        ];
        keyIdea = 'For array changes, draw one row per line, with a column for each index and each variable. Copy the row down and change only the cell that line assigns. The pattern save, overwrite, restore is a swap.';
      } else {
        lines = [head, `A[${i}] = A[${j}]`, `A[${j}] = A[${i}]`, 'print(A)'];
        result = copied;
        asking = 'What does `A` hold after these two copying lines?';
        working = steps(
          `${COPY} It uses whatever value is there at that moment, after any earlier changes.`,
          'Trace each line, with one column for each index. Line 4 prints the array from the last row:',
          arrayTrace(['Line', 'What it does'], [
            [[1, 'creates `A`'], A],
            [[2, `copies \`A[${j}]\`, which is ${A[j - 1]}, into \`A[${i}]\` and erases the ${A[i - 1]}`], copied],
            [[3, `copies \`A[${i}]\`, now ${A[j - 1]}, into \`A[${j}]\``], copied],
          ]),
        );
        conclusion = `The ${A[i - 1]} was erased on line 2 and never saved, so line 3 changes nothing and the answer is ${lit(copied)}.`;
        pool = [
          mkArr(swapped, `This assumes the two lines swap the values. The ${A[i - 1]} is lost on the first line, because it was not saved in a temporary variable.`),
          mkArr(copiedBack, 'This does the two lines in the opposite order.'),
          mkArr(A, 'This assumes the lines cancel out. The first line really changes the array.'),
        ];
        keyIdea = 'Two assignments alone cannot swap. When you see `X = Y` followed by `Y = X` with no spare variable, both end up holding the old value of `Y`. Trace one row per line, using updated values.';
      }
    } else if (kind === 'left') {
      lines = [head, 'for i = 1 to length(A) - 1', '   A[i] = A[i + 1]', 'end for', 'print(A)'];
      result = shiftedLeft;
      const rows: [(string | number)[], number[]][] = [[['start', '-'], A]];
      const a = [...A];
      for (let i = 1; i < n; i++) {
        a[i - 1] = a[i];
        rows.push([[i, `\`A[${i}] = A[${i + 1}]\``], [...a]]);
      }
      asking = 'What does `A` hold after each value is overwritten by the value to its right?';
      working = steps(
        `\`length(A)\` is ${n}, so line 2 runs \`i\` from 1 to $${n} - 1 = ${n - 1}$.`,
        `Line 3 copies the value one place to the right into position \`i\`, erasing what was there. \`A[${n}]\` is never written to, because \`i\` stops at ${n - 1}.`,
        'Trace each pass, using the updated array each time. Line 5 prints the last row:',
        arrayTrace(['`i`', 'Line 3 becomes'], rows),
      );
      conclusion = `The ${A[0]} is overwritten and the last value, ${A[n - 1]}, stays in place, so the answer is ${lit(shiftedLeft)}.`;
      pool = [
        mkArr(rotatedLeft, 'This treats the shift as a rotation, moving the first value to the end. That value is overwritten and lost.'),
        mkArr(shiftedRight, 'This shifts right. The code copies `A[i + 1]` into `A[i]`, which moves values to the left.'),
        { text: 'Infinite loop', value: 'Infinite loop', why: 'A `for` loop runs a fixed number of passes, so it always ends.' },
        mkArr(spread, 'This copies each value to its right. The code copies from right to left.'),
      ];
      keyIdea = 'Copying `A[i + 1]` into `A[i]` from left to right is a left shift: the first value is lost and the last value appears twice. It is not a rotation. Check with one row per pass, using updated values.';
    } else if (kind === 'right') {
      lines = [head, `i = ${n}`, 'while (i > 1)', '   A[i] = A[i - 1]', '   i = i - 1', 'end while', 'print(A)'];
      result = shiftedRight;
      const rows: [(string | number)[], number[]][] = [[['start', '-'], A]];
      const passes: number[] = [];
      const a = [...A];
      for (let i = n; i > 1; i--) {
        a[i - 1] = a[i - 2];
        passes.push(i);
        rows.push([[i, `\`A[${i}] = A[${i - 1}]\``], [...a]]);
      }
      asking = 'What does `A` hold after the loop copies values from right to left?';
      working = steps(
        `\`i\` starts at ${n} on line 2, and line 5 lowers it by 1 each pass. Line 3 keeps going while \`i\` is above 1, so the passes have \`i\` as ${passes.join(', ')}. At \`i\` = 1, $1 > 1$ is false and the loop stops.`,
        'Line 4 copies the value on the left of position `i` into position `i`. Starting from the right means each value is copied before it gets overwritten.',
        'Trace each pass, using the updated array each time. Line 7 prints the last row:',
        arrayTrace(['`i`', 'Line 4 becomes'], rows),
      );
      conclusion = `Each value moves one place right, the ${A[n - 1]} is lost and \`A[1]\` stays, so the answer is ${lit(shiftedRight)}.`;
      pool = [
        mkArr(spread, 'This is what happens when the loop runs from the left. Running from the right keeps each value until it has been copied.'),
        { text: 'Infinite loop', value: 'Infinite loop', why: '`i` goes down by 1 on each pass, so it reaches 1 and the loop stops.' },
        mkArr(rotatedRight, 'This treats the shift as a rotation. The last value is overwritten and lost.'),
        mkArr(shiftedLeft, 'This shifts left. The code copies `A[i - 1]` into `A[i]`, which moves values to the right.'),
      ];
      keyIdea = 'To spot a right shift, look for `A[i] = A[i - 1]` with `i` going down from the last index. Going right to left uses old values, so nothing spreads. The last value is lost and the first appears twice.';
    } else if (kind === 'spread') {
      lines = [head, 'for i = 2 to length(A)', '   A[i] = A[i - 1]', 'end for', 'print(A)'];
      result = spread;
      const rows: [(string | number)[], number[]][] = [[['start', '-'], A]];
      const a = [...A];
      for (let i = 2; i <= n; i++) {
        a[i - 1] = a[i - 2];
        rows.push([[i, `\`A[${i}] = A[${i - 1}]\``], [...a]]);
      }
      asking = 'What does `A` hold after the loop copies values from left to right?';
      working = steps(
        `\`length(A)\` is ${n}, so the passes have \`i\` from 2 to ${n}. Line 3 copies the value on the left of position \`i\` into position \`i\`.`,
        'The loop goes left to right, so the value on the left has already been changed by the pass before. Use the updated array each time, not the original. Line 5 prints the last row:',
        arrayTrace(['`i`', 'Line 3 becomes'], rows),
      );
      conclusion = `Each pass copies the ${A[0]} one place further along, so the answer is ${lit(spread)}.`;
      pool = [
        mkArr(shiftedRight, 'This uses the old values on every pass. By the next pass, the element on the left has already been changed.'),
        mkArr(shiftedLeft, 'This shifts left. The code copies `A[i - 1]` into `A[i]`, so values move to the right.'),
        mkArr(rotatedRight, 'This treats the shift as a rotation. Nothing here moves the last value to the front.'),
      ];
      keyIdea = 'Compare the loop direction with the copy direction. Going left to right while copying from the left spreads the first value everywhere. Going right to left gives a shift. Trace with updated values.';
    } else {
      lines = [head, `i = ${n}`, 'while (i > 1)', '   A[i] = A[i - 1]', 'end while', 'print(A)'];
      result = null;
      const once = [...A];
      once[n - 1] = A[n - 2];
      asking = 'Does this `while` loop ever finish?';
      working = steps(
        'Line 3 keeps the loop going while `i` is above 1. For it to stop, `i` would have to drop to 1 or below.',
        `Line 2 sets \`i\` to ${n}. The only line inside the loop is line 4, which changes \`A\` but not \`i\`. There is no \`i = i - 1\`, so \`i\` stays at ${n}.`,
        'Trace a few passes. Every pass looks the same:',
        arrayTrace(['Pass', '`i`', '`i > 1`?'], [
          [[1, n, 'yes'], once],
          [[2, n, 'yes'], once],
          [[3, n, 'yes'], once],
        ]),
        `$${n} > 1$ is always true, so the condition can never become false. The loop runs forever, and line 6 is never reached.`,
      );
      conclusion = '`i` never changes, so `i > 1` stays true and the answer is Infinite loop.';
      pool = [
        mkArr(shiftedRight, 'This is the result if the body also had `i = i - 1`. Without it, the loop never ends.'),
        mkArr(spread, 'This assumes the loop finishes after copying the first value along. `i` never changes, so it never finishes.'),
        mkArr(once, 'This assumes the loop runs once. The condition is tested again after each pass and is still true.'),
      ];
      keyIdea = 'For any `while` loop, find the variable in its condition and look for a line in the body that changes it. If no line does, and the condition starts true, the loop never ends.';
    }

    const answer = result ? lit(result) : 'Infinite loop';
    const ds = pickDistinct(answer, pool);
    if (ds.length < 3) continue;
    return {
      stem: STEM,
      code: { lang: 'pseudocode', source: lines.join('\n') },
      answer,
      answerValue: result ? repr(result) : 'Infinite loop',
      distractors: ds,
      asking,
      solution: working,
      conclusion,
      keyIdea,
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-lists-tuples-index',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    title: 'Read array elements by index',
    generate: genIndex,
  },
  {
    id: 'gen-lists-tuples-traverse',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    title: 'Trace a loop over an array: sum, count, maximum, minimum',
    generate: genTraverse,
  },
  {
    id: 'gen-lists-tuples-shift',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    title: 'Trace a swap or shift in an array',
    generate: genShift,
  },
];
