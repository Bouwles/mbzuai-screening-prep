import type { GeneratedCore, Generator } from '../../../types';
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

function valueRow(A: number[]): string {
  return `| Index | ${A.map((_, i) => i + 1).join(' | ')} |\n| --- | ${A.map(() => '---').join(' | ')} |\n| Value | ${A.join(' | ')} |\n\n`;
}

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
    let working: string;

    if (kind === 'single') {
      const i = rng.int(2, n - 1);
      line = `print(A[${i}])`;
      v = at(i);
      working = `\`A[${i}]\` is the element at position ${i}, counting from 1, which is ${v}.`;
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
      working = `\`A[${i}]\` is ${at(i)} and \`A[${j}]\` is ${at(j)}, so the sum is ${v}.`;
      pool = [
        mkNum(at(i + 1) + at(j + 1), 'This counts from 0, so each index lands one position too far along. The first element is `A[1]`.'),
        mkNum(i + j, 'This adds the indices. `A[i]` gives the value stored at that index.'),
        mkNum(at(i) * at(j), 'This multiplies the two values. The code adds them.'),
        mkNum(at(i) + at(j + 1), `This reads the second index as ${j + 1}, one position too far along.`),
      ];
    } else {
      line = 'print(A[length(A)])';
      v = at(n);
      working = `\`length(A)\` is ${n}, so this reads \`A[${n}]\`, the last element, ${v}.`;
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
      solution: `${valueRow(A)}${working}\n\nAnswer: ${answer}`,
      keyIdea: 'In a 1-based array, `A[1]` is the first element and `A[length(A)]` is the last.',
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
    let rows: string;
    let pool: Cand[];
    let keyIdea: string;

    if (kind === 'sum') {
      lines = [head, 's = 0', 'for i = 1 to length(A)', '   s = s + A[i]', 'end for', 'print(s)'];
      let s = 0;
      rows = '| i | A[i] | s |\n|---|---|---|\n' + A.map((x, i) => `| ${i + 1} | ${x} | ${(s += x)} |`).join('\n');
      v = s;
      pool = [
        mkNum(v - A[n - 1], 'This stops one pass early. The loop runs up to and including the length.'),
        mkNum(v - A[0], 'This starts at `i = 2`, leaving out the first element.'),
        mkNum(A[n - 1], 'This is only the last element, as if the line were `s = A[i]`. The running total keeps every value.'),
      ];
      keyIdea = 'A running total starts at 0 and adds each element once.';
    } else if (kind === 'maxPos') {
      lines = [head, 'p = 1', 'for i = 2 to length(A)', '   if A[i] > A[p]', '      p = i', '   end if', 'end for', 'print(p)'];
      let p = 0;
      const out: string[] = [];
      for (let i = 1; i < n; i++) {
        const before = A[p];
        if (A[i] > before) p = i;
        out.push(`| ${i + 1} | ${A[i]} | ${before} | ${p + 1} |`);
      }
      rows = '| i | A[i] | A[p] before | p |\n|---|---|---|---|\n' + out.join('\n');
      v = p + 1;
      pool = [
        mkNum(A[p], 'This is the largest **value**. The code prints `p`, its position.'),
        mkNum(p, 'This counts positions from 0. Here the first element is at index 1.'),
        mkNum(n, 'This is the last index. `p` only changes when a larger value is found.'),
        mkNum(A.indexOf(Math.min(...A)) + 1, 'This is the position of the smallest value. The test is `A[i] > A[p]`, which looks for the largest.'),
      ];
      keyIdea = 'Track the position of the maximum separately from its value.';
    } else if (kind === 'countAbove') {
      const t = rng.pick(A);
      lines = [head, 'c = 0', 'for i = 1 to length(A)', `   if A[i] > ${t}`, '      c = c + 1', '   end if', 'end for', 'print(c)'];
      let c = 0;
      rows = `| i | A[i] | A[i] > ${t}? | c |\n|---|---|---|---|\n` + A.map((x, i) => `| ${i + 1} | ${x} | ${x > t ? 'yes' : 'no'} | ${x > t ? ++c : c} |`).join('\n');
      v = c;
      pool = [
        mkNum(c + 1, `This also counts the value equal to ${t}. The test is strictly greater than.`),
        mkNum(n, 'This counts every element and ignores the `if`.'),
        mkNum(A.filter((x) => x > t).reduce((s, x) => s + x, 0), 'This adds the values that pass the test. The code adds 1 each time.'),
        mkNum(n - c, 'This counts the elements that fail the test.'),
      ];
      keyIdea = 'A counter adds 1 for each element that passes the test.';
    } else if (kind === 'min') {
      lines = [head, 'm = A[1]', 'for i = 2 to length(A)', '   if A[i] < m', '      m = A[i]', '   end if', 'end for', 'print(m)'];
      let m = A[0];
      const out: string[] = [];
      for (let i = 1; i < n; i++) {
        if (A[i] < m) m = A[i];
        out.push(`| ${i + 1} | ${A[i]} | ${m} |`);
      }
      rows = '| i | A[i] | m |\n|---|---|---|\n' + out.join('\n');
      v = m;
      pool = [
        mkNum(Math.max(...A), 'This is the largest value. The test `A[i] < m` keeps the smaller value.'),
        mkNum(A[0], 'This is the starting value. `m` changes each time a smaller element is found.'),
        mkNum(A[n - 1], 'This is the last element, as if `m` were overwritten on every pass. It changes only when the test is true.'),
        mkNum(A.indexOf(m) + 1, 'This is the position of the smallest value. The code stores and prints the value.'),
      ];
      keyIdea = 'A minimum search starts from the first element and replaces it whenever a smaller one appears.';
    } else {
      lines = [head, 'c = 0', 'for i = 1 to length(A)', '   if mod(A[i],2) == 0 // mod is the modulus operator', '      c = c + 1', '   end if', 'end for', 'print(c)'];
      let c = 0;
      rows = '| i | A[i] | even? | c |\n|---|---|---|---|\n' + A.map((x, i) => `| ${i + 1} | ${x} | ${x % 2 === 0 ? 'yes' : 'no'} | ${x % 2 === 0 ? ++c : c} |`).join('\n');
      v = c;
      pool = [
        mkNum(n - c, 'This counts the odd numbers. A remainder of 0 on dividing by 2 means even.'),
        mkNum(A.filter((x) => x % 2 === 0).reduce((s, x) => s + x, 0), 'This adds the even values. The code adds 1 each time, not the value.'),
        mkNum(n, 'This counts every element and ignores the `if`.'),
        mkNum(c + 1, 'This is one too many: the counter starts at 0, so it ends on the number of even values.'),
      ];
      keyIdea = 'A counter adds 1 for each element that passes the test.';
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
      solution: `Follow the loop one pass at a time.\n\n${rows}\n\nAnswer: ${answer}`,
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
    let working: string;
    let keyIdea: string;
    let result: number[] | null;

    const stepRows = (steps: [string, number[]][]) => '| Line | `A` afterwards |\n|---|---|\n' + steps.map(([l, a]) => `| \`${l}\` | ${lit(a)} |`).join('\n');

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
        working = `\`t\` saves ${A[i - 1]}.\n\n` + stepRows([[`A[${i}] = A[${j}]`, copied], [`A[${j}] = t`, swapped]]);
        pool = [
          mkArr(copied, `This stops before the last line. \`A[${j}] = t\` puts the saved value into position ${j}.`),
          mkArr(copiedBack, `This writes the saved value but forgets that \`A[${i}]\` was changed.`),
          mkArr(A, 'This assumes the lines cancel out. Each one really changes the array.'),
        ];
        keyIdea = 'A swap saves one value, overwrites it, then writes the saved value to the other position.';
      } else {
        lines = [head, `A[${i}] = A[${j}]`, `A[${j}] = A[${i}]`, 'print(A)'];
        result = copied;
        working = stepRows([[`A[${i}] = A[${j}]`, copied], [`A[${j}] = A[${i}]`, copied]]) + `\n\nThe first line has already overwritten ${A[i - 1]}, so the second line changes nothing.`;
        pool = [
          mkArr(swapped, `This assumes the two lines swap the values. The ${A[i - 1]} is lost on the first line, because it was not saved in a temporary variable.`),
          mkArr(copiedBack, 'This does the two lines in the opposite order.'),
          mkArr(A, 'This assumes the lines cancel out. The first line really changes the array.'),
        ];
        keyIdea = 'Without a temporary variable, two assignments copy one value instead of swapping.';
      }
    } else if (kind === 'left') {
      lines = [head, 'for i = 1 to length(A) - 1', '   A[i] = A[i + 1]', 'end for', 'print(A)'];
      result = shiftedLeft;
      const steps: [string, number[]][] = [];
      const a = [...A];
      for (let i = 1; i < n; i++) {
        a[i - 1] = a[i];
        steps.push([`A[${i}] = A[${i + 1}]`, [...a]]);
      }
      working = stepRows(steps) + '\n\nThe first value is overwritten, and the last value is left in place, so it appears twice.';
      pool = [
        mkArr(rotatedLeft, 'This treats the shift as a rotation, moving the first value to the end. That value is overwritten and lost.'),
        mkArr(shiftedRight, 'This shifts right. The code copies `A[i + 1]` into `A[i]`, which moves values to the left.'),
        { text: 'Infinite loop', value: 'Infinite loop', why: 'A `for` loop runs a fixed number of passes, so it always ends.' },
        mkArr(spread, 'This copies each value to its right. The code copies from right to left.'),
      ];
      keyIdea = 'Shifting left overwrites the first value and leaves the last value in place twice.';
    } else if (kind === 'right') {
      lines = [head, `i = ${n}`, 'while (i > 1)', '   A[i] = A[i - 1]', '   i = i - 1', 'end while', 'print(A)'];
      result = shiftedRight;
      const steps: [string, number[]][] = [];
      const a = [...A];
      for (let i = n; i > 1; i--) {
        a[i - 1] = a[i - 2];
        steps.push([`A[${i}] = A[${i - 1}]`, [...a]]);
      }
      working = stepRows(steps) + '\n\nWorking from the right keeps each value until it has been copied.';
      pool = [
        mkArr(spread, 'This is what happens when the loop runs from the left. Running from the right keeps each value until it has been copied.'),
        { text: 'Infinite loop', value: 'Infinite loop', why: '`i` goes down by 1 on each pass, so it reaches 1 and the loop stops.' },
        mkArr(rotatedRight, 'This treats the shift as a rotation. The last value is overwritten and lost.'),
        mkArr(shiftedLeft, 'This shifts left. The code copies `A[i - 1]` into `A[i]`, which moves values to the right.'),
      ];
      keyIdea = 'To shift right without losing values, work from the last index down.';
    } else if (kind === 'spread') {
      lines = [head, 'for i = 2 to length(A)', '   A[i] = A[i - 1]', 'end for', 'print(A)'];
      result = spread;
      const steps: [string, number[]][] = [];
      const a = [...A];
      for (let i = 2; i <= n; i++) {
        a[i - 1] = a[i - 2];
        steps.push([`A[${i}] = A[${i - 1}]`, [...a]]);
      }
      working = stepRows(steps) + '\n\nEach pass copies the value that was just overwritten, so the first value spreads through the array.';
      pool = [
        mkArr(shiftedRight, 'This uses the old values on every pass. By the next pass, the element on the left has already been changed.'),
        mkArr(shiftedLeft, 'This shifts left. The code copies `A[i - 1]` into `A[i]`, so values move to the right.'),
        mkArr(rotatedRight, 'This treats the shift as a rotation. Nothing here moves the last value to the front.'),
      ];
      keyIdea = 'Shifting right from the left end spreads the first value through the whole array.';
    } else {
      lines = [head, `i = ${n}`, 'while (i > 1)', '   A[i] = A[i - 1]', 'end while', 'print(A)'];
      result = null;
      working = `Nothing in the loop body changes \`i\`, so it stays ${n}. The condition is always true, and the loop never reaches \`print\`.`;
      pool = [
        mkArr(shiftedRight, 'This is the result if the body also had `i = i - 1`. Without it, the loop never ends.'),
        mkArr(spread, 'This assumes the loop finishes after copying the first value along. `i` never changes, so it never finishes.'),
        (() => {
          const once = [...A];
          once[n - 1] = A[n - 2];
          return mkArr(once, 'This assumes the loop runs once. The condition is tested again after each pass and is still true.');
        })(),
      ];
      keyIdea = 'A `while` loop must change the variable in its condition, or it never ends.';
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
      solution: `${working}\n\nAnswer: ${answer}`,
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
