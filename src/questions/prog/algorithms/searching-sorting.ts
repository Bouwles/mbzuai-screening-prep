import type { StaticQuestion } from '../../../types';

/** Join source lines into one code string. */
const L = (...lines: string[]) => lines.join('\n');

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

/** Values compared with the target in a binary search over positions 1..n, rounding the middle down. */
function binaryProbes(a: number[], target: number): number[] {
  let lo = 1;
  let hi = a.length;
  const seen: number[] = [];
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    seen.push(a[mid - 1]);
    if (a[mid - 1] === target) break;
    if (a[mid - 1] < target) lo = mid + 1;
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

const BSEARCH_PSEUDO = L(
  'function search(A, n, target)',
  '   low = 1',
  '   high = n',
  '   while (low <= high)',
  '      mid = div(low + high, 2) // div is integer division',
  '      if A[mid] == target',
  '         return mid',
  '      else',
  '         if A[mid] < target',
  '            low = mid + 1',
  '         else',
  '            // missing line',
  '         end if',
  '      end if',
  '   end while',
  '   return 0',
  'end function',
);

export const questions: StaticQuestion[] = [
  // ======================================================== FOUNDATION
  {
    id: 'searching-sorting-001',
    subtopic: 'searching-sorting',
    difficulty: 'foundation',
    stem: 'A precondition for binary search on a list is that the list:',
    options: ['Has no duplicate values', 'Has a power of 2 as its length', 'Is sorted', 'Contains only numbers'],
    correctIndex: 2,
    markScheme: {
      solution:
        'After comparing the target with the middle element, binary search decides which half to keep:\n\n' +
        '- if the target is **smaller** than the middle element, it keeps only the left half;\n' +
        '- if the target is **bigger**, it keeps only the right half.\n\n' +
        'This decision is only safe if every item on the left is no bigger than the middle and every item on the right is no smaller, in other words if the list is **sorted**. On an unsorted list the target could be sitting in the half that was thrown away, so the search could wrongly report "not found".\n\n' +
        'A **precondition** is something that must be true before an algorithm starts. For binary search it is: **the list must be sorted**.',
      whyWrong: [
        'Duplicates do not break binary search: it still finds one of the equal items. The real requirement is that the list is in order.',
        'Any length works, because the middle index is found with whole-number division (round down). The two sides just differ by at most one item.',
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
    stem: 'A linear search runs on an unsorted list of 40 items, and the target is **not** in the list. How many comparisons does it make?',
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
    stem: 'Which sorting algorithm splits a list into two halves, sorts each half, and then **merges** them?',
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
    stem: 'One left-to-right pass of **bubble sort**, swapping neighbours when the left is bigger, is applied to `[6, 2, 9, 1, 5]`. What is the list afterwards?',
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
      'Its running time never depends on the input',
      'Items with equal keys keep their relative order',
      'It never fails on an empty list',
      'It needs no extra memory',
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
  {
    id: 'searching-sorting-021',
    subtopic: 'searching-sorting',
    difficulty: 'foundation',
    stem: 'Which search algorithm needs the data to be sorted first?',
    options: ['Linear search', 'Binary search', 'Both linear and binary search', 'Neither of them'],
    correctIndex: 1,
    markScheme: {
      solution: '**Binary search** throws away half of the data at each step, which is only safe when the data is sorted. Linear search checks every item in turn, so it works on any list.',
      whyWrong: [
        'Linear search checks items one at a time, so it works whatever order they are in.',
        null,
        'Only binary search relies on order. Linear search works on unsorted data too.',
        'Binary search does need sorted data, because it uses the order to decide which half to keep.',
      ],
      keyIdea: 'Binary search requires sorted data; linear search does not.',
    },
  },
  {
    id: 'searching-sorting-022',
    subtopic: 'searching-sorting',
    difficulty: 'foundation',
    stem: 'What is the best-case number of comparisons for a linear search on $n$ items?',
    options: ['$1$', '$n$', '$\\frac{n}{2}$', '$\\log_2 n$'],
    correctIndex: 0,
    markScheme: {
      solution: 'The best case is when the target is the **first** item checked, so the search stops after $1$ comparison.',
      whyWrong: [
        null,
        'This is the **worst** case, when the target is last or missing.',
        'This is about the **average** number of comparisons when the target is present.',
        'This is about the worst case for **binary** search, which is a different algorithm.',
      ],
      keyIdea: 'Linear search: best case 1 comparison, worst case $n$.',
    },
  },
  {
    id: 'searching-sorting-023',
    subtopic: 'searching-sorting',
    difficulty: 'foundation',
    stem: 'Which sort repeatedly finds the smallest remaining item and swaps it into the next position?',
    options: ['Selection sort', 'Bubble sort', 'Insertion sort', 'Merge sort'],
    correctIndex: 0,
    markScheme: {
      solution: '**Selection sort** selects the smallest item in the unsorted part and swaps it with the first unsorted item, so the sorted part grows from the front.',
      whyWrong: [
        null,
        'Bubble sort only swaps neighbouring items and carries the largest item to the end.',
        'Insertion sort takes the next item in order and slides it into the sorted part. It does not search for the smallest.',
        'Merge sort splits the list and merges sorted parts. It does not search for the smallest.',
      ],
      keyIdea: 'Selection sort: select the smallest remaining item, swap it to the front.',
    },
  },
  {
    id: 'searching-sorting-024',
    subtopic: 'searching-sorting',
    difficulty: 'foundation',
    stem: 'Which sort repeatedly swaps neighbouring items that are in the wrong order?',
    options: ['Merge sort', 'Selection sort', 'Bubble sort', 'Insertion sort'],
    correctIndex: 2,
    markScheme: {
      solution: '**Bubble sort** compares neighbouring items and swaps them when they are out of order, so the largest remaining item "bubbles" to the end of each pass.',
      whyWrong: [
        'Merge sort splits the list and merges sorted parts, so it does not swap neighbours.',
        'Selection sort swaps the smallest remaining item into place, often across a long distance.',
        null,
        'Insertion sort slides one item left into the sorted part until it fits, rather than making passes of neighbour swaps over the whole list.',
      ],
      keyIdea: 'Bubble sort works only by swapping neighbours that are out of order.',
    },
  },
  {
    id: 'searching-sorting-025',
    subtopic: 'searching-sorting',
    difficulty: 'foundation',
    stem: 'What is the largest number of passes bubble sort needs for a list of $n$ items?',
    options: ['$n$', '$\\frac{n}{2}$', '$n - 1$', '$n^2$'],
    correctIndex: 2,
    markScheme: {
      solution: 'Each pass puts one more item in its final place at the end. After $n - 1$ passes, $n - 1$ items are in place, so the one left over must be in place too. A version that repeats until a pass makes no swaps runs one extra checking pass, but that pass is not needed to sort.',
      whyWrong: [
        'This counts one pass too many. Once $n - 1$ items are placed, the last item has nowhere else to go.',
        'Half the passes is not enough in the worst case. A reversed list needs every one of the $n - 1$ passes.',
        null,
        'This is roughly the total number of **comparisons**, not the number of passes.',
      ],
      keyIdea: 'Bubble sort needs at most $n - 1$ passes, because each pass fixes one more item at the end.',
    },
  },

  // ======================================================== EXAM
  {
    id: 'searching-sorting-006',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'In the **worst case**, how many middle-element comparisons does binary search make on a sorted list of 100 items?',
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
    stem: 'Binary search looks for **35** in the sorted array `[3, 8, 12, 17, 21, 26, 30, 35, 41]`, indexed from 1, using `mid = div(low + high, 2)`. Which values are compared with 35, in order?',
    options: ['21, 35', '3, 8, 12, 17, 21, 26, 30, 35', '21, 30, 35', '21, 8, 3'],
    correctIndex: 2,
    markScheme: {
      solution:
        '`div` is integer division, so it rounds down. When the middle value is too small, set `low = mid + 1`; when it is too big, set `high = mid - 1`.\n\n' +
        '| Step | low | high | mid | value at mid | Decision |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| 1 | 1 | 9 | $10 \\div 2 = 5$ | 21 | $21 < 35$, so low = 6 |\n' +
        '| 2 | 6 | 9 | $15 \\div 2 = 7.5$, round down to 7 | 30 | $30 < 35$, so low = 8 |\n' +
        '| 3 | 8 | 9 | $17 \\div 2 = 8.5$, round down to 8 | 35 | found |\n\n' +
        'The values compared are 21, 30, 35.',
      whyWrong: [
        'This rounds the middle index **up** in step 2 (7.5 becomes 8, giving 35 straight away). `div` rounds down, so the middle index is 7.',
        'This is a linear search from the start of the list. Binary search jumps to the middle each time.',
        null,
        'This moves the wrong way: after 21 is too small it searches the left half instead of the right half, so it never reaches 35.',
      ],
      keyIdea: 'In a binary search trace, keep a table of low, high and mid, and always round mid down when the method uses `div`.',
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
    stem: 'Two left-to-right passes of **bubble sort**, swapping neighbours when the left is bigger, are applied to `[7, 3, 9, 2, 6, 4]`. What is the list afterwards?',
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
    stem: 'Three passes of **selection sort**, each swapping the smallest unsorted item into the first unsorted position, are applied to `[29, 10, 14, 37, 13, 5]`. What is the list afterwards?',
    options: [
      '`[5, 10, 13, 14, 37, 29]`',
      '`[5, 10, 13, 37, 14, 29]`',
      '`[10, 13, 5, 14, 29, 37]`',
      '`[5, 10, 13, 29, 14, 37]`',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Each pass looks only at the unsorted part, finds its smallest item and swaps it into the first unsorted position. A pass still counts when no swap is needed.\n\n' +
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
    stem: 'Three passes of **insertion sort**, where the first pass inserts the second item, are applied to `[8, 4, 6, 2, 9, 1]`. What is the list afterwards?',
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
    stem: 'This linear search counts its comparisons in `c`. Arrays are indexed from 1. What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'A = [4, 9, 2, 7, 9, 5]',
        'p = 0',
        'c = 0',
        'for i = 1 to length(A)',
        '   c = c + 1',
        '   if A[i] == 9',
        '      p = i',
        '      break',
        '   end if',
        'end for',
        'print(p, c)',
      ),
    },
    options: ['`5 5`', '`1 2`', '`2 2`', '`2 6`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '| `i` | `A[i]` | `c` | `A[i] == 9`? |\n' +
        '| --- | --- | --- | --- |\n' +
        '| 1 | 4 | 1 | no |\n' +
        '| 2 | 9 | 2 | yes: `p = 2`, then `break` |\n\n' +
        '`break` ends the loop at the **first** 9, so the second 9 at index 5 is never reached. It prints `2 2`.',
      whyWrong: [
        'This finds the **last** 9 (index 5). The `break` ends the loop at the first match.',
        'This counts positions from 0. In this array the first item is `A[1]`, so the first 9 is at index 2.',
        null,
        'This keeps counting to the end of the array. The `break` stops the loop, so `c` stops at 2.',
      ],
      keyIdea: 'Linear search stops at the first match; when the target is missing it compares with all $n$ items.',
    },
    check: {
      optionValues: ['5 5', '1 2', '2 2', '2 6'],
      compute: () => {
        const a = [4, 9, 2, 7, 9, 5];
        let p = 0;
        let c = 0;
        for (let i = 1; i <= a.length; i++) {
          c++;
          if (a[i - 1] === 9) {
            p = i;
            break;
          }
        }
        return `${p} ${c}`;
      },
    },
  },
  {
    id: 'searching-sorting-012',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'When merging `[2, 5, 9]` and `[3, 4, 10, 12]`, each comparison moves the smaller front item to the output, and leftovers are copied without comparing. How many comparisons are made?',
    options: ['7', '5', '12', '6'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Compare the two front items, move the smaller one to the output, and count one comparison each time. Stop counting as soon as one list is empty.\n\n' +
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
    stem: 'The table lists five students in their original order. What order results from a **stable** sort by score, lowest first?',
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
    stem: 'This bubble sort stops after a pass with no swaps. Arrays are indexed from 1. How many comparisons does it make on an **already sorted** array of 12 items?',
    code: {
      lang: 'pseudocode',
      source: L(
        'swapped = true',
        'while (swapped)',
        '   swapped = false',
        '   for i = 1 to n - 1',
        '      if A[i] > A[i + 1]',
        '         t = A[i]',
        '         A[i] = A[i + 1]',
        '         A[i + 1] = t',
        '         swapped = true',
        '      end if',
        '   end for',
        'end while',
      ),
    },
    options: ['66', '22', '11', '12'],
    correctIndex: 2,
    markScheme: {
      solution:
        'With $n = 12$, the `for` loop runs for $i = 1, 2, \\ldots, 11$, which is $n - 1 = 11$ comparisons per pass (12 items have 11 neighbouring pairs).\n\n' +
        '**Pass 1:** every pair is already in order, so no swaps happen and `swapped` stays false.\n\n' +
        'The `while` test now fails, so the loop stops after this single pass.\n\n' +
        'Total: $11$ comparisons. This is the **best case** of bubble sort with an early-exit flag.',
      whyWrong: [
        'This is $\\frac{12 \\times 11}{2} = 66$, the number of comparisons for a full bubble sort that never stops early. The `swapped` flag stops it after one pass.',
        'This assumes a second pass is needed to "confirm" the list is sorted. The first pass already makes no swaps, so the loop ends after it.',
        null,
        'This counts one comparison per item. A list of 12 items has only 11 neighbouring pairs (the `for` loop goes from 1 to $n - 1$).',
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
    stem: 'This binary search on a sorted array `A` is missing one line. Arrays are indexed from 1. Which line belongs at the comment so that the search always works?',
    code: { lang: 'pseudocode', source: BSEARCH_PSEUDO },
    options: ['`high = mid - 1`', '`high = mid + 1`', '`low = mid - 1`', '`high = mid`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The missing line runs when `A[mid] > target`, so the target (if present) must be to the **left** of `mid`.\n\n' +
        '- `mid` itself has just been checked and is not the target, so it can be excluded.\n' +
        '- The new search range should be `low` to `mid - 1`, so we set `high = mid - 1`.\n\n' +
        'Check a small case, `A = [1, 2, 3]`, target 1: mid = 2, `A[2] = 2 > 1`, so high = 1; then mid = 1, `A[1] = 1`, found. If the target were 0 (missing), high would then become 0, low = 1 > high, the loop ends and it returns 0.\n\n' +
        'Correct line: `high = mid - 1`.',
      whyWrong: [
        null,
        'This keeps `mid` and the item after it in the range, even though the target must be to the left of `mid`. With `[1, 2, 3]` and target 1: mid = 2, so high = 3 and the same mid is chosen forever (an infinite loop).',
        'This changes the wrong pointer. The target is on the left, so `high` must move; changing `low` can even repeat the same mid forever (try `[1, 2, 3]` with target 1).',
        'This keeps `mid` in the range even though it has already been checked. When low = high = mid and the target is missing, nothing changes and the loop never ends.',
      ],
      keyIdea: 'In binary search, after checking mid, exclude it: use `low = mid + 1` or `high = mid - 1`, otherwise the loop may never end.',
    },
  },
  {
    id: 'searching-sorting-016',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'Bubble sort, swapping neighbours when the left is bigger, sorts `[6, 3, 8, 1, 5]` into ascending order. How many **swaps** does it make in total?',
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
    id: 'searching-sorting-020',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
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
  {
    id: 'searching-sorting-026',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'This loop searches `A` for 8. Arrays are indexed from 1. What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('A = [5, 2, 8, 6]', 'i = 1', 'while (i <= length(A) and A[i] != 8)', '   i = i + 1', 'end while', 'print(i)'),
    },
    options: ['2', '3', '4', 'Infinite loop'],
    correctIndex: 1,
    markScheme: {
      solution:
        '| `i` | `A[i]` | `A[i] != 8`? |\n' +
        '| --- | --- | --- |\n' +
        '| 1 | 5 | yes, so `i` becomes 2 |\n' +
        '| 2 | 2 | yes, so `i` becomes 3 |\n' +
        '| 3 | 8 | no, so the loop stops |\n\n' +
        'It prints 3, the position of 8 in an array indexed from 1.',
      whyWrong: [
        'This counts positions from 0. Here the first item is `A[1]`, so 8 is at index 3.',
        null,
        'This is the length of the array. The loop stops as soon as it reaches the 8, before the last item.',
        '`i` goes up by 1 on each pass, and the test fails as soon as `A[i]` is 8.',
      ],
      keyIdea: 'A linear search stops at the first match, and the loop counter then holds the position of the match.',
    },
    check: {
      optionValues: [2, 3, 4, 'Infinite loop'],
      compute: () => {
        const a = [5, 2, 8, 6];
        let i = 1;
        let guard = 0;
        while (i <= a.length && a[i - 1] !== 8) {
          if (++guard > 1000) return 'Infinite loop';
          i++;
        }
        return i;
      },
    },
  },
  {
    id: 'searching-sorting-027',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'This faulty binary search uses `low = mid` instead of `low = mid + 1`. Arrays are indexed from 1. What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'A = [2, 4, 6, 8]',
        'low = 1',
        'high = 4',
        'while (low < high)',
        '   mid = div(low + high, 2) // div is integer division',
        '   if A[mid] < 8',
        '      low = mid',
        '   else',
        '      high = mid',
        '   end if',
        'end while',
        'print(low)',
      ),
    },
    options: ['4', '3', '2', 'Infinite loop'],
    correctIndex: 3,
    markScheme: {
      solution:
        '| `low` | `high` | `mid` | `A[mid]` | Update |\n' +
        '| --- | --- | --- | --- | --- |\n' +
        '| 1 | 4 | 2 | 4 | `low = 2` |\n' +
        '| 2 | 4 | 3 | 6 | `low = 3` |\n' +
        '| 3 | 4 | 3 | 6 | `low = 3` |\n\n' +
        'From the third row on nothing changes: `mid` stays 3, `low` stays 3 and $3 < 4$ stays true. The loop never ends.',
      whyWrong: [
        'This is the position of 8, which a correct search would find. Here `div(3 + 4, 2)` rounds down to 3, so `mid` never reaches 4.',
        'This is where `low` gets stuck, but the loop is still running, so `print(low)` is never reached.',
        'This stops after the first update. $2 < 4$ is still true, so the loop continues.',
        null,
      ],
      keyIdea: 'If an update can leave `low` and `high` unchanged, a binary search can loop forever, which is why `mid` must be excluded.',
    },
    check: {
      optionValues: [4, 3, 2, 'Infinite loop'],
      compute: () => {
        const a = [2, 4, 6, 8];
        let low = 1;
        let high = 4;
        let guard = 0;
        while (low < high) {
          if (++guard > 1000) return 'Infinite loop';
          const mid = Math.floor((low + high) / 2);
          if (a[mid - 1] < 8) low = mid;
          else high = mid;
        }
        return low;
      },
    },
  },
  {
    id: 'searching-sorting-028',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'What is printed? Arrays are indexed from 1.',
    code: {
      lang: 'pseudocode',
      source: L(
        'A = [4, 1, 3, 2]',
        'for i = 1 to 3',
        '   if A[i] > A[i + 1]',
        '      t = A[i]',
        '      A[i] = A[i + 1]',
        '      A[i + 1] = t',
        '   end if',
        'end for',
        'print(A)',
      ),
    },
    options: ['`[1, 3, 2, 4]`', '`[1, 2, 3, 4]`', '`[1, 4, 3, 2]`', '`[4, 3, 2, 1]`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'This is one pass of bubble sort. `t` holds a value while two items swap.\n\n' +
        '| `i` | Compare | Swap? | `A` afterwards |\n' +
        '| --- | --- | --- | --- |\n' +
        '| 1 | 4 and 1 | yes | `[1, 4, 3, 2]` |\n' +
        '| 2 | 4 and 3 | yes | `[1, 3, 4, 2]` |\n' +
        '| 3 | 4 and 2 | yes | `[1, 3, 2, 4]` |\n\n' +
        'It prints `[1, 3, 2, 4]`. The largest value has moved to the end, but the array is not yet fully sorted.',
      whyWrong: [
        null,
        'This is the fully sorted array. The code makes only one pass, so 3 and 2 are still out of order.',
        'This stops after the first swap. The loop continues up to `i = 3`.',
        'This sorts into descending order. The test `A[i] > A[i + 1]` moves larger values to the right.',
      ],
      keyIdea: 'A swap needs a temporary variable, and one bubble pass only guarantees the largest item reaches the end.',
    },
    check: {
      optionValues: ['[1, 3, 2, 4]', '[1, 2, 3, 4]', '[1, 4, 3, 2]', '[4, 3, 2, 1]'],
      compute: () => `[${bubblePasses([4, 1, 3, 2], 1).join(', ')}]`,
    },
  },
  {
    id: 'searching-sorting-029',
    subtopic: 'searching-sorting',
    difficulty: 'exam',
    stem: 'Selection sort scans the whole unsorted part on every pass. How many comparisons does it make in total on a list of 6 items?',
    options: ['15', '5', '36', '30'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Finding the smallest of $k$ unsorted items takes $k - 1$ comparisons.\n\n' +
        'With 6 items the passes make $5 + 4 + 3 + 2 + 1$ comparisons, which is $\\frac{6 \\times 5}{2} = 15$.\n\n' +
        'The count is the same for every list, even one that is already sorted.',
      whyWrong: [
        null,
        'This is the number of passes, $n - 1 = 5$. Each pass makes several comparisons.',
        'This is $6^2$, assuming every pass scans all 6 items. The unsorted part gets shorter each time.',
        'This is $6 \\times 5$, forgetting to divide by 2 in $\\frac{n(n - 1)}{2}$.',
      ],
      keyIdea: 'Selection sort always makes $\\frac{n(n - 1)}{2}$ comparisons.',
    },
    check: {
      optionValues: [15, 5, 36, 30],
      compute: () => {
        const n = 6;
        let c = 0;
        for (let p = 0; p < n - 1; p++) for (let i = p + 1; i < n; i++) c++;
        return c;
      },
    },
  },
];
