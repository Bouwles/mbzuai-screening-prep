import type { StaticQuestion } from '../../../types';

// ---------------------------------------------------------------- small simulators used ONLY by the answer checks
const key = (a: number[]) => a.join(',');

/** k passes of bubble sort (pass p compares positions 0..n-2-p, swapping if left > right). */
function bubblePasses(src: number[], k: number): number[] {
  const a = src.slice();
  for (let p = 0; p < k; p++)
    for (let i = 0; i < a.length - 1 - p; i++) if (a[i] > a[i + 1]) [a[i], a[i + 1]] = [a[i + 1], a[i]];
  return a;
}

/** k passes of selection sort (pass p swaps the minimum of a[p..] into position p). */
function selectionPasses(src: number[], k: number): number[] {
  const a = src.slice();
  for (let p = 0; p < k; p++) {
    let mi = p;
    for (let i = p + 1; i < a.length; i++) if (a[i] < a[mi]) mi = i;
    [a[p], a[mi]] = [a[mi], a[p]];
  }
  return a;
}

/** k passes of insertion sort (pass p inserts a[p] into the sorted prefix a[0..p-1]). */
function insertionPasses(src: number[], k: number): number[] {
  const a = src.slice();
  for (let p = 1; p <= k; p++) {
    const v = a[p];
    let j = p - 1;
    while (j >= 0 && a[j] > v) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = v;
  }
  return a;
}

/** Values compared with the target in a standard (round-down) binary search. */
function binaryProbes(a: number[], target: number): number[] {
  let lo = 0;
  let hi = a.length - 1;
  const seen: number[] = [];
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    seen.push(a[mid]);
    if (a[mid] === target) break;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return seen;
}

/** Worst-case number of binary-search comparisons over every present and absent target, for a list of n items. */
function maxProbes(n: number): number {
  const a = Array.from({ length: n }, (_, i) => 2 * i);
  let worst = 0;
  for (let t = -1; t <= 2 * n - 1; t++) worst = Math.max(worst, binaryProbes(a, t).length);
  return worst;
}

/** Number of comparisons made by the standard merge of two sorted lists. */
function mergeComparisons(x: number[], y: number[]): number {
  let i = 0;
  let j = 0;
  let c = 0;
  while (i < x.length && j < y.length) {
    c++;
    if (x[i] <= y[j]) i++;
    else j++;
  }
  return c;
}

/** Merge sort that counts every comparison made while merging. */
function mergeSortCount(a: number[]): { sorted: number[]; comps: number } {
  if (a.length <= 1) return { sorted: a.slice(), comps: 0 };
  const h = Math.floor(a.length / 2);
  const L = mergeSortCount(a.slice(0, h));
  const R = mergeSortCount(a.slice(h));
  const out: number[] = [];
  let i = 0;
  let j = 0;
  let c = 0;
  while (i < L.sorted.length && j < R.sorted.length) {
    c++;
    if (L.sorted[i] <= R.sorted[j]) out.push(L.sorted[i++]);
    else out.push(R.sorted[j++]);
  }
  out.push(...L.sorted.slice(i), ...R.sorted.slice(j));
  return { sorted: out, comps: L.comps + R.comps + c };
}

const BSEARCH_PSEUDO =
  'low ← 0\n' +
  'high ← n - 1\n' +
  'WHILE low <= high DO\n' +
  '    mid ← (low + high) DIV 2\n' +
  '    IF A[mid] = target THEN\n' +
  '        RETURN mid\n' +
  '    ELSE IF A[mid] < target THEN\n' +
  '        low ← mid + 1\n' +
  '    ELSE\n' +
  '        ______________\n' +
  '    ENDIF\n' +
  'ENDWHILE\n' +
  'RETURN -1';

export const questions: StaticQuestion[] = [
  // ======================================================== FOUNDATION
  {
    id: 'searching-sorting-001',
    subtopic: 'searching-sorting',
    difficulty: 'foundation',
    stem: 'Binary search finds an item by checking the **middle** element of the list and then throwing away the half that cannot contain the target. What must be true about the list for binary search to work correctly?',
    options: [
      'The list must have no duplicate values',
      'The length of the list must be a power of 2',
      'The list must be sorted (in order)',
      'The list must contain only numbers',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'After comparing the target with the middle element, binary search decides which half to keep:\n\n' +
        '- if the target is **smaller** than the middle element, it keeps only the left half;\n' +
        '- if the target is **bigger**, it keeps only the right half.\n\n' +
        'This decision is only safe if every item on the left is smaller than (or equal to) the middle and every item on the right is bigger, in other words if the list is **sorted**. On an unsorted list the target could be sitting in the half that was thrown away, so the search could wrongly report "not found".\n\n' +
        'So the precondition for binary search is: **the list must be sorted**.',
      whyWrong: [
        'Duplicates do not break binary search: it still finds one of the equal items. The real requirement is that the list is in order.',
        'Any length works, because the middle index is found with whole-number division (round down). A length that is a power of 2 just makes the halving come out exactly.',
        null,
        'Binary search works on anything that can be put in order and compared, such as words in alphabetical order. Being numbers is not the requirement; being sorted is.',
      ],
      keyIdea: 'Binary search only works on a sorted list, because it relies on order to know which half to throw away.',
    },
  },
  {
    id: 'searching-sorting-002',
    subtopic: 'searching-sorting',
    difficulty: 'foundation',
    stem: 'A linear search checks the items of an unsorted list one at a time, starting with the first item. The list has 40 items and the target is **not** in the list. How many comparisons does the search make before it reports "not found"?',
    options: ['20', '40', '6', '39'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Linear search compares the target with item 1, then item 2, then item 3, and so on.\n\n' +
        'It can only be sure the target is missing after it has compared the target with **every** item, because the target could be the very last one.\n\n' +
        'With 40 items that is 1 comparison per item: $40$ comparisons.\n\n' +
        'This is the **worst case** of linear search: $n$ comparisons for a list of $n$ items.',
      whyWrong: [
        'This is the *average* number of comparisons when the target is in the list (about half the list). When the target is missing, every item must be checked.',
        null,
        'This is the worst case for *binary* search on 40 items. Binary search needs a sorted list; a linear search checks items one at a time.',
        'This stops one item too early. The 40th item still has to be compared before the search can say the target is not there.',
      ],
      keyIdea: 'An unsuccessful linear search compares the target with every item, so it makes $n$ comparisons for $n$ items.',
    },
    check: {
      optionValues: [20, 40, 6, 39],
      compute: () => {
        const list = Array.from({ length: 40 }, (_, i) => 3 * i + 1);
        const target = 2; // never of the form 3i + 1
        let comps = 0;
        for (const x of list) {
          comps++;
          if (x === target) break;
        }
        return comps;
      },
    },
  },
  {
    id: 'searching-sorting-003',
    subtopic: 'searching-sorting',
    difficulty: 'foundation',
    stem: 'Which sorting algorithm works by splitting the list into two halves, sorting each half (using the same method again), and then **merging** the two sorted halves into one sorted list?',
    options: ['Insertion sort', 'Bubble sort', 'Selection sort', 'Merge sort'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Match each description to its algorithm:\n\n' +
        '- **Bubble sort** repeatedly compares neighbouring items and swaps them if they are in the wrong order.\n' +
        '- **Selection sort** repeatedly finds the smallest remaining item and swaps it into the next position.\n' +
        '- **Insertion sort** takes items one at a time and inserts each into its correct place in a growing sorted part.\n' +
        '- **Merge sort** splits the list in half, sorts each half the same way (recursion), then merges the two sorted halves.\n\n' +
        'The description "split, sort each half, merge" is **merge sort**. It is an example of *divide and conquer*.',
      whyWrong: [
        'Insertion sort never splits the list: it builds a sorted part at the front by inserting one item at a time.',
        'Bubble sort never splits the list: it repeatedly swaps neighbouring items that are out of order.',
        'Selection sort never splits the list: it repeatedly picks the smallest remaining item and swaps it into place.',
        null,
      ],
      keyIdea: 'Merge sort is the divide-and-conquer sort: split in half, sort each half, then merge.',
    },
  },
  {
    id: 'searching-sorting-004',
    subtopic: 'searching-sorting',
    difficulty: 'foundation',
    stem: 'The list `[6, 2, 9, 1, 5]` is being sorted into ascending order with **bubble sort**. In one pass, each pair of neighbouring items is compared from left to right, and the two are swapped if the left one is bigger. What is the list after the **first pass**?',
    options: ['`[1, 2, 5, 6, 9]`', '`[1, 2, 9, 6, 5]`', '`[2, 6, 1, 5, 9]`', '`[2, 6, 9, 1, 5]`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Work through the neighbouring pairs from left to right, always using the **current** list:\n\n' +
        '| Compare | Swap? | List afterwards |\n' +
        '| --- | --- | --- |\n' +
        '| 6 and 2 | yes ($6 > 2$) | `[2, 6, 9, 1, 5]` |\n' +
        '| 6 and 9 | no | `[2, 6, 9, 1, 5]` |\n' +
        '| 9 and 1 | yes | `[2, 6, 1, 9, 5]` |\n' +
        '| 9 and 5 | yes | `[2, 6, 1, 5, 9]` |\n\n' +
        'Notice how the biggest value, 9, "bubbles" all the way to the end in one pass.\n\n' +
        'After the first pass: `[2, 6, 1, 5, 9]`.',
      whyWrong: [
        'This is the fully sorted list. One pass of bubble sort only guarantees that the largest item reaches the end.',
        'This is one pass of *selection* sort (the smallest item, 1, is swapped with the first item). Bubble sort only swaps neighbours.',
        null,
        'This is one pass of *insertion* sort (only the 2 has been moved into place), or stopping after the first swap. A bubble sort pass continues to the end of the list.',
      ],
      keyIdea: 'One pass of bubble sort compares every neighbouring pair left to right, so the largest item ends up at the end.',
    },
    check: {
      optionValues: ['1,2,5,6,9', '1,2,9,6,5', '2,6,1,5,9', '2,6,9,1,5'],
      compute: () => key(bubblePasses([6, 2, 9, 1, 5], 1)),
    },
  },
  {
    id: 'searching-sorting-005',
    subtopic: 'searching-sorting',
    difficulty: 'foundation',
    stem: 'A sorting algorithm is described as **stable**. What does this mean?',
    options: [
      'It always takes the same amount of time, whatever the input',
      'Items with equal sort keys stay in the same order relative to each other as in the original list',
      'It never crashes, even on an empty list',
      'It sorts the list without needing any extra memory',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Suppose two students both scored 72, and Ali appears before Cai in the original list. After sorting by score:\n\n' +
        '- a **stable** sort guarantees Ali is still before Cai;\n' +
        '- an **unstable** sort might swap them.\n\n' +
        'So stability means: **items with equal keys keep their original relative order**. This matters when you sort by one thing after another (for example, sort by name, then stably by score, so students with the same score stay in name order).\n\n' +
        'Bubble sort, insertion sort and merge sort (written in the usual way) are stable. Selection sort, with its long-distance swaps, is usually not stable.',
      whyWrong: [
        'That describes an algorithm whose running time does not depend on the input. Stability is about the order of equal items.',
        null,
        'That describes robust code. Stability is about keeping equal items in their original relative order.',
        'That describes an *in-place* algorithm. Stability is a different property, about the order of equal items.',
      ],
      keyIdea: 'A stable sort keeps items with equal keys in their original relative order.',
    },
  },

  // ======================================================== EXAM
  {
    id: 'searching-sorting-006',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'A sorted list contains 100 items. In the **worst case**, how many comparisons does binary search need to find a target or decide it is not there? (Each check of a middle element counts as one comparison.)',
    options: ['50', '100', '6', '7'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Each comparison checks the middle item and throws away about half of what is left. In the worst case we always keep the bigger half:\n\n' +
        '| Comparison | Items still possible before it |\n' +
        '| --- | --- |\n' +
        '| 1 | 100 |\n' +
        '| 2 | 50 |\n' +
        '| 3 | 25 |\n' +
        '| 4 | 12 |\n' +
        '| 5 | 6 |\n' +
        '| 6 | 3 |\n' +
        '| 7 | 1 |\n\n' +
        'Using the formula: the worst case is $\\lfloor \\log_2 n \\rfloor + 1$. Since $2^6 = 64 \\le 100 < 128 = 2^7$, we get $\\lfloor \\log_2 100 \\rfloor = 6$, so the worst case is $6 + 1 = 7$ comparisons.\n\n' +
        'Quick check: $k$ comparisons can handle at most $2^k - 1$ items. $2^6 - 1 = 63$ is too few, $2^7 - 1 = 127$ is enough. Answer: 7.',
      whyWrong: [
        'This is about half the list, which is the *average* for a linear search. Binary search halves the list each time, so it needs far fewer comparisons.',
        'This is the worst case for *linear* search, which checks every item. Binary search halves the list at every step.',
        'This is $\\log_2 100 \\approx 6.64$ rounded down, but you must add 1: 6 comparisons can only deal with at most $2^6 - 1 = 63$ items.',
        null,
      ],
      keyIdea: 'Binary search needs at most $\\lfloor \\log_2 n \\rfloor + 1$ comparisons, because each comparison halves the remaining list.',
    },
    check: {
      optionValues: [50, 100, 6, 7],
      compute: () => maxProbes(100),
    },
  },
  {
    id: 'searching-sorting-007',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem:
      'Binary search is used to look for **35** in the sorted list `[3, 8, 12, 17, 21, 26, 30, 35, 41]` (indexes 0 to 8). It starts with low = 0 and high = 8 and uses mid = (low + high) DIV 2, rounding down. If the middle value is too small it sets low = mid + 1; if it is too big it sets high = mid - 1.\n\n' +
      'Which values are compared with 35, in order?',
    options: ['21, 35', '3, 8, 12, 17, 21, 26, 30, 35', '21, 30, 35', '21, 8, 3'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Trace the search step by step:\n\n' +
        '| Step | low | high | mid | value at mid | Decision |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| 1 | 0 | 8 | $(0 + 8) \\div 2 = 4$ | 21 | $21 < 35$, so low = 5 |\n' +
        '| 2 | 5 | 8 | $13 \\div 2 = 6.5$, round down to 6 | 30 | $30 < 35$, so low = 7 |\n' +
        '| 3 | 7 | 8 | $15 \\div 2 = 7.5$, round down to 7 | 35 | found |\n\n' +
        'The values compared are 21, 30, 35.',
      whyWrong: [
        'This rounds the middle index **up** in step 2 (6.5 becomes 7, giving 35 straight away). The question says DIV 2 rounds down, so the middle index is 6.',
        'This is a linear search from the start of the list. Binary search jumps to the middle each time.',
        null,
        'This moves the wrong way: after 21 is too small it searches the left half instead of the right half, so it never reaches 35.',
      ],
      keyIdea: 'In a binary search trace, keep a table of low, high and mid, and always round mid down when the method says DIV.',
    },
    check: {
      optionValues: ['21, 35', '3, 8, 12, 17, 21, 26, 30, 35', '21, 30, 35', '21, 8, 3'],
      compute: () => binaryProbes([3, 8, 12, 17, 21, 26, 30, 35, 41], 35).join(', '),
    },
  },
  {
    id: 'searching-sorting-008',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'The list `[7, 3, 9, 2, 6, 4]` is sorted into ascending order with **bubble sort**. In each pass, neighbouring items are compared from left to right and swapped if the left one is bigger. What is the list after **two** complete passes?',
    options: ['`[3, 7, 2, 6, 4, 9]`', '`[2, 3, 9, 7, 6, 4]`', '`[3, 7, 9, 2, 6, 4]`', '`[3, 2, 6, 4, 7, 9]`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Pass 1** (start `[7, 3, 9, 2, 6, 4]`):\n\n' +
        '- 7 and 3: swap, giving `[3, 7, 9, 2, 6, 4]`\n' +
        '- 7 and 9: no swap\n' +
        '- 9 and 2: swap, giving `[3, 7, 2, 9, 6, 4]`\n' +
        '- 9 and 6: swap, giving `[3, 7, 2, 6, 9, 4]`\n' +
        '- 9 and 4: swap, giving `[3, 7, 2, 6, 4, 9]`\n\n' +
        'The largest value, 9, is now in its final place.\n\n' +
        '**Pass 2** (start `[3, 7, 2, 6, 4, 9]`):\n\n' +
        '- 3 and 7: no swap\n' +
        '- 7 and 2: swap, giving `[3, 2, 7, 6, 4, 9]`\n' +
        '- 7 and 6: swap, giving `[3, 2, 6, 7, 4, 9]`\n' +
        '- 7 and 4: swap, giving `[3, 2, 6, 4, 7, 9]`\n' +
        '- (7 and 9: no swap; many versions skip this comparison because 9 is already in place)\n\n' +
        'After two passes: `[3, 2, 6, 4, 7, 9]`. The two largest values are at the end, as expected.',
      whyWrong: [
        'This is the list after only **one** pass. The question asks for two passes.',
        'This is two passes of *selection* sort (2 swapped to the front, then 3 already in place). Bubble sort only swaps neighbouring items.',
        'This is two passes of *insertion* sort (only the first three items have been put in order). Bubble sort moves the largest items to the end.',
        null,
      ],
      keyIdea: 'After $k$ passes of bubble sort, the $k$ largest items are in their final places at the end of the list.',
    },
    check: {
      optionValues: ['3,7,2,6,4,9', '2,3,9,7,6,4', '3,7,9,2,6,4', '3,2,6,4,7,9'],
      compute: () => key(bubblePasses([7, 3, 9, 2, 6, 4], 2)),
    },
  },
  {
    id: 'searching-sorting-009',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'The list `[29, 10, 14, 37, 13, 5]` is sorted into ascending order with **selection sort**. In each pass, the smallest item in the unsorted part is found and **swapped** with the first item of the unsorted part (a pass still counts even if no swap is needed). What is the list after **three** passes?',
    options: [
      '`[5, 10, 13, 14, 37, 29]`',
      '`[5, 10, 13, 37, 14, 29]`',
      '`[10, 13, 5, 14, 29, 37]`',
      '`[5, 10, 13, 29, 14, 37]`',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        '| Pass | Unsorted part | Smallest | Action | List afterwards |\n' +
        '| --- | --- | --- | --- | --- |\n' +
        '| 1 | `[29, 10, 14, 37, 13, 5]` | 5 | swap 5 with 29 | `[5, 10, 14, 37, 13, 29]` |\n' +
        '| 2 | `[10, 14, 37, 13, 29]` | 10 | already first, no swap | `[5, 10, 14, 37, 13, 29]` |\n' +
        '| 3 | `[14, 37, 13, 29]` | 13 | swap 13 with 14 | `[5, 10, 13, 37, 14, 29]` |\n\n' +
        'After three passes: `[5, 10, 13, 37, 14, 29]`. The first three positions hold the three smallest values, and the rest is still unsorted.',
      whyWrong: [
        'This does **four** passes: it skips counting pass 2 because no swap happened. A pass with no swap still counts as a pass.',
        null,
        'This is three passes of *bubble* sort, which pushes the largest items to the end. Selection sort fills the front with the smallest items.',
        'This moves each minimum to the front by **shifting** the other items right, instead of swapping it with the first unsorted item.',
      ],
      keyIdea: 'After $k$ passes of selection sort, the $k$ smallest items are in their final places at the front.',
    },
    check: {
      optionValues: ['5,10,13,14,37,29', '5,10,13,37,14,29', '10,13,5,14,29,37', '5,10,13,29,14,37'],
      compute: () => key(selectionPasses([29, 10, 14, 37, 13, 5], 3)),
    },
  },
  {
    id: 'searching-sorting-010',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'The list `[8, 4, 6, 2, 9, 1]` is sorted into ascending order with **insertion sort**. In each pass, the next unsorted item is inserted into its correct place in the sorted part at the front (the first pass inserts the second item, 4). What is the list after **three** passes?',
    options: ['`[2, 4, 6, 8, 9, 1]`', '`[1, 2, 4, 6, 9, 8]`', '`[4, 6, 8, 2, 9, 1]`', '`[2, 4, 1, 6, 8, 9]`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'At the start the sorted part is just `[8]`.\n\n' +
        '| Pass | Item inserted | Sorted part afterwards | Whole list |\n' +
        '| --- | --- | --- | --- |\n' +
        '| 1 | 4 (shift 8 right) | `[4, 8]` | `[4, 8, 6, 2, 9, 1]` |\n' +
        '| 2 | 6 (shift 8 right) | `[4, 6, 8]` | `[4, 6, 8, 2, 9, 1]` |\n' +
        '| 3 | 2 (shift 8, 6, 4 right) | `[2, 4, 6, 8]` | `[2, 4, 6, 8, 9, 1]` |\n\n' +
        'After three passes the first **four** items are in order, and 9 and 1 have not been touched yet: `[2, 4, 6, 8, 9, 1]`.',
      whyWrong: [
        null,
        'This is three passes of *selection* sort (1, then 2, then 4 swapped into the front). Insertion sort only works on the items it has reached so far.',
        'This is the list after only **two** passes. It counts the starting item 8 as if it were the first pass.',
        'This is three passes of *bubble* sort, which moves the largest items to the end.',
      ],
      keyIdea: 'After $k$ passes of insertion sort, the first $k + 1$ items are sorted among themselves, and the rest are untouched.',
    },
    check: {
      optionValues: ['2,4,6,8,9,1', '1,2,4,6,9,8', '4,6,8,2,9,1', '2,4,1,6,8,9'],
      compute: () => key(insertionPasses([8, 4, 6, 2, 9, 1], 3)),
    },
  },
  {
    id: 'searching-sorting-011',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'What does this Python code print? (The two printed lines are shown separated by a space.)',
    code: {
      lang: 'python',
      source:
        'def linear_search(items, target):\n' +
        '    count = 0\n' +
        '    for i in range(len(items)):\n' +
        '        count += 1\n' +
        '        if items[i] == target:\n' +
        '            return i, count\n' +
        '    return -1, count\n' +
        '\n' +
        'data = [4, 9, 2, 7, 9, 5]\n' +
        'print(linear_search(data, 9))\n' +
        'print(linear_search(data, 3))',
    },
    options: ['`(4, 5) (-1, 6)`', '`(2, 2) (-1, 6)`', '`(1, 2) (-1, 6)`', '`(1, 2) (-1, 5)`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**First call, target 9:**\n\n' +
        '| i | items[i] | count | equal to 9? |\n' +
        '| --- | --- | --- | --- |\n' +
        '| 0 | 4 | 1 | no |\n' +
        '| 1 | 9 | 2 | yes, return `(1, 2)` |\n\n' +
        'The function returns as soon as it finds the **first** 9, at index 1, after 2 comparisons. The second 9 at index 4 is never reached.\n\n' +
        '**Second call, target 3:** 3 is not in the list, so the loop runs for all 6 items (count goes 1, 2, ..., 6), then `return -1, count` gives `(-1, 6)`.\n\n' +
        'Printing a tuple shows it in brackets, so the output is `(1, 2)` then `(-1, 6)`.',
      whyWrong: [
        'This finds the **last** 9 (index 4). The `return` inside the loop ends the function at the first match.',
        'This uses a position counted from 1. Python indexes start at 0, so the first 9 is at index 1.',
        null,
        'This miscounts the unsuccessful search: `count` is increased once for each of the 6 items before the loop finishes.',
      ],
      keyIdea: 'Linear search stops at the first match; when the target is missing it compares with all $n$ items.',
    },
    python: { stdout: '(1, 2)\n(-1, 6)\n' },
  },
  {
    id: 'searching-sorting-012',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'In merge sort, two sorted lists are merged by repeatedly comparing the front items of each list and moving the smaller one to the output. When one list becomes empty, the rest of the other list is copied across with no more comparisons. How many comparisons are made when merging `[2, 5, 9]` and `[3, 4, 10, 12]`?',
    options: ['7', '5', '12', '6'],
    correctIndex: 1,
    markScheme: {
      solution:
        '| Compare | Smaller (moved to output) | Output so far |\n' +
        '| --- | --- | --- |\n' +
        '| 2 and 3 | 2 | `[2]` |\n' +
        '| 5 and 3 | 3 | `[2, 3]` |\n' +
        '| 5 and 4 | 4 | `[2, 3, 4]` |\n' +
        '| 5 and 10 | 5 | `[2, 3, 4, 5]` |\n' +
        '| 9 and 10 | 9 | `[2, 3, 4, 5, 9]` |\n\n' +
        'Now the first list is empty, so 10 and 12 are copied across **without** comparing: `[2, 3, 4, 5, 9, 10, 12]`.\n\n' +
        'Count the rows: **5** comparisons.',
      whyWrong: [
        'This counts every item placed in the output (7 items). The last two items, 10 and 12, are copied without any comparison.',
        null,
        'This compares every item of one list with every item of the other ($3 \\times 4 = 12$). Merging only ever compares the two front items.',
        'This uses the worst-case formula: total items minus 1, $7 - 1 = 6$. That only happens when one list runs out at the very end; here the first list runs out while 10 and 12 are still waiting, so fewer comparisons are needed.',
      ],
      keyIdea: 'Each comparison in a merge places one item; once a list is empty the rest is copied for free, so a merge of $n$ items makes at most $n - 1$ comparisons.',
    },
    check: {
      optionValues: [7, 5, 12, 6],
      compute: () => mergeComparisons([2, 5, 9], [3, 4, 10, 12]),
    },
  },
  {
    id: 'searching-sorting-013',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'The table shows five students in their original order. The list is sorted by **score, lowest first**, using a **stable** sorting algorithm. In what order are the students listed afterwards?',
    table: {
      headers: ['Name', 'Score'],
      rows: [
        ['Ali', 72],
        ['Bea', 85],
        ['Cai', 72],
        ['Dan', 60],
        ['Eve', 85],
      ],
    },
    options: ['Dan, Cai, Ali, Eve, Bea', 'Bea, Eve, Ali, Cai, Dan', 'Dan, Ali, Cai, Eve, Bea', 'Dan, Ali, Cai, Bea, Eve'],
    correctIndex: 3,
    markScheme: {
      solution:
        'First put the scores in ascending order: 60, 72, 72, 85, 85.\n\n' +
        '- 60: only Dan.\n' +
        '- 72: Ali and Cai. In the original list Ali comes **before** Cai, and a stable sort keeps that order: Ali, Cai.\n' +
        '- 85: Bea and Eve. Bea comes before Eve originally, so: Bea, Eve.\n\n' +
        'Sorted order: Dan, Ali, Cai, Bea, Eve.',
      whyWrong: [
        'This reverses the order of both pairs of equal scores. That could happen with an unstable sort, but a stable sort keeps Ali before Cai and Bea before Eve.',
        'This sorts by score from **highest** to lowest. The question asks for lowest first.',
        'This keeps the 72s in order but swaps the 85s. A stable sort keeps **every** group of equal scores in its original order, and Bea came before Eve.',
        null,
      ],
      keyIdea: 'With a stable sort, items with equal keys come out in the same relative order they went in.',
    },
    check: {
      optionValues: ['Dan, Cai, Ali, Eve, Bea', 'Bea, Eve, Ali, Cai, Dan', 'Dan, Ali, Cai, Eve, Bea', 'Dan, Ali, Cai, Bea, Eve'],
      compute: () => {
        const rows: [string, number][] = [
          ['Ali', 72],
          ['Bea', 85],
          ['Cai', 72],
          ['Dan', 60],
          ['Eve', 85],
        ];
        // Insertion sort is stable (only moves an item past strictly bigger ones).
        const a = rows.slice();
        for (let p = 1; p < a.length; p++) {
          const v = a[p];
          let j = p - 1;
          while (j >= 0 && a[j][1] > v[1]) {
            a[j + 1] = a[j];
            j--;
          }
          a[j + 1] = v;
        }
        return a.map((r) => r[0]).join(', ');
      },
    },
  },
  {
    id: 'searching-sorting-014',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'This version of bubble sort stops as soon as a pass makes no swaps. It is run on a list of 12 items that is **already sorted**. How many comparisons does it make in total?',
    code: {
      lang: 'pseudocode',
      source:
        'REPEAT\n' +
        '    swapped ← FALSE\n' +
        '    FOR i ← 0 TO n - 2\n' +
        '        IF A[i] > A[i + 1] THEN\n' +
        '            swap A[i] and A[i + 1]\n' +
        '            swapped ← TRUE\n' +
        '        ENDIF\n' +
        '    ENDFOR\n' +
        'UNTIL swapped = FALSE',
    },
    options: ['66', '22', '11', '12'],
    correctIndex: 2,
    markScheme: {
      solution:
        'With $n = 12$, the FOR loop runs for $i = 0, 1, \\ldots, 10$, which is $n - 1 = 11$ comparisons per pass (12 items have 11 neighbouring pairs).\n\n' +
        '**Pass 1:** every pair is already in order, so no swaps happen and `swapped` stays FALSE.\n\n' +
        'The UNTIL condition `swapped = FALSE` is now true, so the loop stops after this single pass.\n\n' +
        'Total: $11$ comparisons. This is the **best case** of bubble sort with an early-exit flag.',
      whyWrong: [
        'This is $\\frac{12 \\times 11}{2} = 66$, the number of comparisons for a full bubble sort that never stops early. The swapped flag stops it after one pass.',
        'This assumes a second pass is needed to "confirm" the list is sorted. The first pass already makes no swaps, so the loop ends after it.',
        null,
        'This counts one comparison per item. A list of 12 items has only 11 neighbouring pairs (the FOR loop goes from 0 to $n - 2$).',
      ],
      keyIdea: 'Bubble sort with a swapped flag needs only one pass, $n - 1$ comparisons, on an already sorted list (its best case).',
    },
    check: {
      optionValues: [66, 22, 11, 12],
      compute: () => {
        const a = Array.from({ length: 12 }, (_, i) => i + 1);
        let comps = 0;
        let swapped: boolean;
        do {
          swapped = false;
          for (let i = 0; i <= a.length - 2; i++) {
            comps++;
            if (a[i] > a[i + 1]) {
              [a[i], a[i + 1]] = [a[i + 1], a[i]];
              swapped = true;
            }
          }
        } while (swapped);
        return comps;
      },
    },
  },
  {
    id: 'searching-sorting-015',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'This pseudocode is meant to perform a binary search on a sorted array `A` of `n` items. Which line should fill the blank so that the search always works correctly?',
    code: { lang: 'pseudocode', source: BSEARCH_PSEUDO },
    options: ['`high ← mid - 1`', '`high ← mid + 1`', '`low ← mid - 1`', '`high ← mid`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The blank runs when `A[mid] > target`, so the target (if present) must be to the **left** of `mid`.\n\n' +
        '- `mid` itself has just been checked and is not the target, so it can be excluded.\n' +
        '- The new search range should be `low` to `mid - 1`, so we set `high ← mid - 1`.\n\n' +
        'Check a small case, `A = [1, 2, 3]`, target 1: mid = 1, `A[1] = 2 > 1`, so high = 0; then mid = 0, `A[0] = 1`, found. And if the target were 0 (missing): after that, high becomes $-1$, low = 0 > high, the loop ends and returns $-1$.\n\n' +
        'Correct line: `high ← mid - 1`.',
      whyWrong: [
        null,
        'This moves `high` to the **right**, making the range bigger. When low = high = mid it keeps choosing the same mid forever (an infinite loop).',
        'This changes the wrong pointer. The target is on the left, so `high` must move; changing `low` can even repeat the same mid forever (try `[1, 2, 3]` with target 1).',
        'This keeps `mid` in the range even though it has already been checked. When low = high = mid and the target is missing, nothing changes and the loop never ends.',
      ],
      keyIdea: 'In binary search, after checking mid, exclude it: use `low = mid + 1` or `high = mid - 1`, otherwise the loop may never end.',
    },
  },

  // ======================================================== CHALLENGE
  {
    id: 'searching-sorting-016',
    subtopic: 'searching-sorting',
    difficulty: 'challenge',
    stem: 'Bubble sort (compare neighbours left to right, swap if the left one is bigger, repeat passes until sorted) is used to sort `[6, 3, 8, 1, 5]` into ascending order. How many **swaps** does it make in total?',
    options: ['10', '6', '4', '2'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Method 1: trace it.**\n\n' +
        '- Pass 1: 6/3 swap, 6/8 no, 8/1 swap, 8/5 swap, giving `[3, 6, 1, 5, 8]` (3 swaps).\n' +
        '- Pass 2: 3/6 no, 6/1 swap, 6/5 swap, giving `[3, 1, 5, 6, 8]` (2 swaps).\n' +
        '- Pass 3: 3/1 swap, giving `[1, 3, 5, 6, 8]` (1 swap). Sorted.\n\n' +
        'Total: $3 + 2 + 1 = 6$ swaps.\n\n' +
        '**Method 2 (shortcut): count the pairs that are in the wrong order.** Each bubble-sort swap fixes exactly one such pair.\n\n' +
        '- 6 is before 3, 1 and 5 (all smaller): 3 pairs\n' +
        '- 3 is before 1: 1 pair\n' +
        '- 8 is before 1 and 5: 2 pairs\n' +
        '- 1 and 5: none\n\n' +
        'Total: $3 + 1 + 2 = 6$ swaps.',
      whyWrong: [
        'This is $\\frac{5 \\times 4}{2} = 10$, the number of swaps for a list in completely **reverse** order (every pair wrong). Here only some pairs are out of order.',
        null,
        'This is the number of passes for 5 items ($n - 1 = 4$), not the number of swaps.',
        'This is the number of swaps *selection* sort would make (1 with 6, then 5 with 8). Bubble sort only swaps neighbours, so it needs more swaps.',
      ],
      keyIdea: 'Bubble sort makes one swap for every pair of items that starts in the wrong order.',
    },
    check: {
      optionValues: [10, 6, 4, 2],
      compute: () => {
        const a = [6, 3, 8, 1, 5];
        let swaps = 0;
        for (let p = 0; p < a.length - 1; p++)
          for (let i = 0; i < a.length - 1 - p; i++)
            if (a[i] > a[i + 1]) {
              [a[i], a[i + 1]] = [a[i + 1], a[i]];
              swaps++;
            }
        return swaps;
      },
    },
  },
  {
    id: 'searching-sorting-017',
    subtopic: 'searching-sorting',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source:
        'def bsearch(a, target):\n' +
        '    lo, hi = 0, len(a) - 1\n' +
        '    steps = 0\n' +
        '    while lo <= hi:\n' +
        '        mid = (lo + hi) // 2\n' +
        '        steps += 1\n' +
        '        if a[mid] == target:\n' +
        '            return steps\n' +
        '        elif a[mid] < target:\n' +
        '            lo = mid + 1\n' +
        '        else:\n' +
        '            hi = mid - 1\n' +
        '    return -steps\n' +
        '\n' +
        'nums = list(range(2, 42, 2))   # 2, 4, 6, ..., 40\n' +
        'print(bsearch(nums, 34), bsearch(nums, 7))',
    },
    options: ['`17 -20`', '`5 5`', '`-4 -4`', '`5 -5`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`nums` has 20 items, index $i$ holds $2(i + 1)$, so `hi` starts at 19.\n\n' +
        '**Search for 34** (it is at index 16):\n\n' +
        '| steps | lo | hi | mid | a[mid] | action |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| 1 | 0 | 19 | 9 | 20 | $20 < 34$, lo = 10 |\n' +
        '| 2 | 10 | 19 | 14 | 30 | $30 < 34$, lo = 15 |\n' +
        '| 3 | 15 | 19 | 17 | 36 | $36 > 34$, hi = 16 |\n' +
        '| 4 | 15 | 16 | 15 | 32 | $32 < 34$, lo = 16 |\n' +
        '| 5 | 16 | 16 | 16 | 34 | found, return 5 |\n\n' +
        '**Search for 7** (not in the list, which only has even numbers):\n\n' +
        '| steps | lo | hi | mid | a[mid] | action |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| 1 | 0 | 19 | 9 | 20 | $20 > 7$, hi = 8 |\n' +
        '| 2 | 0 | 8 | 4 | 10 | $10 > 7$, hi = 3 |\n' +
        '| 3 | 0 | 3 | 1 | 4 | $4 < 7$, lo = 2 |\n' +
        '| 4 | 2 | 3 | 2 | 6 | $6 < 7$, lo = 3 |\n' +
        '| 5 | 3 | 3 | 3 | 8 | $8 > 7$, hi = 2 |\n\n' +
        'Now lo = 3 > hi = 2, the loop ends and the function returns `-steps` = $-5$.\n\n' +
        'Output: `5 -5`.',
      whyWrong: [
        'These are *linear* search counts (34 is the 17th item; a missing item needs all 20 comparisons). This code is a binary search.',
        'This forgets that an unsuccessful search returns `-steps`, so the second number is negative.',
        'This stops the loop as soon as lo equals hi (as if the condition were `lo < hi`), so the last item is never checked. The condition is `lo <= hi`.',
        null,
      ],
      keyIdea: 'Trace binary search with a lo / hi / mid table, and remember the loop still runs when lo equals hi.',
    },
    python: { stdout: '5 -5\n' },
  },
  {
    id: 'searching-sorting-018',
    subtopic: 'searching-sorting',
    difficulty: 'challenge',
    stem: 'Merge sort is applied to `[38, 27, 43, 3, 9, 82, 10, 15]`. The list is split into halves (4 and 4, then 2 and 2, then single items) and merged back up using the standard merge, which stops comparing when one list is empty. How many comparisons are made in **total**?',
    options: ['17', '24', '28', '7'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Level 1: merge single items into pairs** (1 comparison each):\n\n' +
        '- 38 and 27 give `[27, 38]`; 43 and 3 give `[3, 43]`; 9 and 82 give `[9, 82]`; 10 and 15 give `[10, 15]`.\n' +
        '- Comparisons: $4 \\times 1 = 4$.\n\n' +
        '**Level 2: merge pairs into fours.**\n\n' +
        '- `[27, 38]` with `[3, 43]`: 27 v 3 (take 3), 27 v 43 (take 27), 38 v 43 (take 38), then copy 43. That is 3 comparisons, giving `[3, 27, 38, 43]`.\n' +
        '- `[9, 82]` with `[10, 15]`: 9 v 10 (take 9), 82 v 10 (take 10), 82 v 15 (take 15), then copy 82. That is 3 comparisons, giving `[9, 10, 15, 82]`.\n\n' +
        '**Level 3: final merge** of `[3, 27, 38, 43]` with `[9, 10, 15, 82]`:\n\n' +
        '- 3 v 9, 27 v 9, 27 v 10, 27 v 15, 27 v 82, 38 v 82, 43 v 82: 7 comparisons, then copy 82.\n\n' +
        'Total: $4 + 6 + 7 = 17$ comparisons. (For this list every merge happens to be a worst case, $n - 1$ comparisons for $n$ items.)',
      whyWrong: [
        null,
        'This is $8 \\times 3 = 24$: it counts every item moved at every level as a comparison. Items copied after a list empties need no comparison.',
        'This is $\\frac{8 \\times 7}{2} = 28$, the number of comparisons for a full bubble sort of 8 items, not merge sort.',
        'This counts only the final merge. The lower levels (pairs and fours) also need comparisons.',
      ],
      keyIdea: 'Count merge sort comparisons level by level; each merge of $n$ items makes at most $n - 1$ comparisons.',
    },
    check: {
      optionValues: [17, 24, 28, 7],
      compute: () => mergeSortCount([38, 27, 43, 3, 9, 82, 10, 15]).comps,
    },
  },
  {
    id: 'searching-sorting-019',
    subtopic: 'searching-sorting',
    difficulty: 'challenge',
    stem: 'For a list of $n$ items (where $n$ is large), which statement is TRUE?',
    options: [
      'Binary search needs about $\\log_2 n$ comparisons even in its best case',
      'Selection sort makes fewer comparisons on an already sorted list than on a reversed list',
      'Insertion sort makes only $n - 1$ comparisons on a list that is already sorted',
      'The worst case for linear search is when the target is the first item in the list',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Check each statement:\n\n' +
        '- **Binary search best case:** if the target is the very first middle element, it is found in **1** comparison. So "about $\\log_2 n$ even in the best case" is false ($\\log_2 n$ is the worst case).\n' +
        '- **Selection sort:** every pass scans the whole unsorted part to find the minimum, whatever the order. It always makes $\\frac{n(n - 1)}{2}$ comparisons, so a sorted list does not help. False.\n' +
        '- **Insertion sort on a sorted list:** each new item is compared with its left neighbour once; that neighbour is smaller, so the item stays put. That is 1 comparison for each of the items 2 to $n$: $n - 1$ comparisons. **True** (this is its best case).\n' +
        '- **Linear search:** if the target is the first item, it is found in 1 comparison. That is the **best** case, not the worst. False.',
      whyWrong: [
        'The best case of binary search is 1 comparison (the target is the first middle element checked). About $\\log_2 n$ comparisons is the worst case.',
        'Selection sort always scans the entire unsorted part on every pass, so it makes the same $\\frac{n(n - 1)}{2}$ comparisons on any list.',
        null,
        'Finding the target at the first position takes 1 comparison, which is the best case. The worst case is the target being last or missing.',
      ],
      keyIdea: 'Insertion sort and early-exit bubble sort are fast on sorted lists, but selection sort always does the same work.',
    },
  },
  {
    id: 'searching-sorting-020',
    subtopic: 'searching-sorting',
    difficulty: 'challenge',
    stem: 'A binary search on a sorted list never needs more than **6** comparisons, whatever the target. What is the **largest** possible number of items in the list?',
    options: ['63', '64', '32', '36'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Think about how many items $k$ comparisons can handle.\n\n' +
        '- 1 comparison can deal with 1 item.\n' +
        '- Each extra comparison checks one middle item and leaves two halves, each of which can be handled by the remaining comparisons. So with $k$ comparisons the maximum size is $N(k) = 2N(k - 1) + 1$.\n\n' +
        '| $k$ | 1 | 2 | 3 | 4 | 5 | 6 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $N(k)$ | 1 | 3 | 7 | 15 | 31 | 63 |\n\n' +
        'In general $N(k) = 2^k - 1$, so with 6 comparisons: $2^6 - 1 = 63$ items.\n\n' +
        'Check: with 64 items the worst case is $\\lfloor \\log_2 64 \\rfloor + 1 = 6 + 1 = 7$ comparisons, which is too many. With 63 items it is $\\lfloor \\log_2 63 \\rfloor + 1 = 5 + 1 = 6$. Answer: 63.',
      whyWrong: [
        null,
        'This is $2^6$. But each comparison also uses up the middle item, so 6 comparisons handle only $2^6 - 1$ items; 64 items would need 7 in the worst case.',
        'This is $2^5$, as if one comparison were wasted. In fact 6 comparisons can handle up to 63 items.',
        'This is $6^2$. Binary search grows by doubling, not by squaring.',
      ],
      keyIdea: 'With $k$ comparisons, binary search can handle at most $2^k - 1$ items.',
    },
    check: {
      optionValues: [63, 64, 32, 36],
      compute: () => {
        let n = 1;
        while (maxProbes(n + 1) <= 6) n++;
        return n;
      },
    },
  },
];
