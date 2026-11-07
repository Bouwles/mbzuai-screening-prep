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
      asking: 'What must be true of a list before binary search will work?',
      solution:
        '**Binary search** looks at the middle item. If the target is smaller, it throws away the right half. If the target is larger, it throws away the left half.\n\n' +
        'Throwing away a half is only safe if that whole side really is too big or too small. In the unsorted list `[9, 2, 4, 7, 1]` the middle is 4. A search for 9 sees that 9 is larger and throws away the left side, but 9 was on that side.\n\n' +
        'Items in order guarantee that the discarded side can never hold the target, so the list has to be sorted.',
      conclusion: 'Discarding a half relies on the items being in order, so the requirement is that the list Is sorted.',
      whyWrong: [
        'Duplicates do not break binary search: it still finds one of the equal items. The real requirement is that the list is in order.',
        'Any length works, because the middle index is found with whole-number division (round down). The two sides just differ by at most one item.',
        null,
        'Binary search works on anything that can be put in order and compared, such as words in alphabetical order. Being numbers is not the requirement; being sorted is.',
      ],
      keyIdea: 'Ask what each step of the method relies on. Binary search discards a half using order, so sorting is the requirement. Length, data type and duplicates do not affect that step.',
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
      asking: 'How many items does a one-by-one search check when the target is not there?',
      solution:
        'A **linear search** checks items one at a time from the start, making one comparison per item. It stops early only if it finds the target.\n\n' +
        'The target is not in the list, so it never stops early. It can only be sure after checking every item, including the very last.\n\n' +
        'So there is one comparison for each of the 40 items, which is 40 comparisons.',
      conclusion: 'Every item has to be checked, so a list of 40 items takes 40 comparisons.',
      whyWrong: [
        'This is the *average* number of comparisons when the target is in the list (about half the list). When the target is missing, every item must be checked.',
        null,
        'This is the worst case for *binary* search on 40 items. Binary search needs a sorted list; a linear search checks items one at a time.',
        'This stops one item too early. The 40th item still has to be compared before the search can say the target is not there.',
      ],
      keyIdea: 'For linear search on $n$ items, a missing target or one in last place takes $n$ comparisons, and a target in first place takes 1. In general the comparisons equal the target\'s position.',
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
      asking: 'Which sort works by splitting a list in half and joining the sorted halves?',
      solution:
        'The key word is **merge**, which means joining two sorted lists into one sorted list by repeatedly taking the smaller front item.\n\n' +
        'A tiny example: split `[3, 1]` into `[3]` and `[1]`. A list of one item is already sorted, and merging the two gives `[1, 3]`.\n\n' +
        'A sort that splits, sorts each half and merges takes its name from that last step: merge sort.',
      conclusion: 'Splitting into halves and merging them is exactly what Merge sort does.',
      whyWrong: [
        'Insertion sort never splits the list: it builds a sorted part at the front by inserting one item at a time.',
        'Bubble sort never splits the list: it repeatedly swaps neighbouring items that are out of order.',
        'Selection sort never splits the list: it repeatedly picks the smallest remaining item and swaps it into place.',
        null,
      ],
      keyIdea: 'Match each sort to its one action: bubble swaps neighbours, selection picks the smallest remaining item, insertion slides the next item into place, and merge splits and joins.',
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
      asking: 'What does the list look like after one sweep of neighbour swaps?',
      solution:
        'One **pass** of bubble sort walks from left to right. At each position it compares two neighbours and swaps them if the left one is bigger.\n\n' +
        'Go through the pairs, always using the list as it stands after the last swap:\n\n| Compare | Left bigger? | List after |\n|---|---|---|\n| 6 and 2 | yes, swap | `[2, 6, 9, 1, 5]` |\n| 6 and 9 | no | `[2, 6, 9, 1, 5]` |\n| 9 and 1 | yes, swap | `[2, 6, 1, 9, 5]` |\n\n' +
        'The last pair is 9 and 5. The 9 is bigger, so swap them, which gives `[2, 6, 1, 5, 9]`.',
      conclusion: 'The largest value, 9, was carried to the end, so the list is `[2, 6, 1, 5, 9]`.',
      whyWrong: [
        'This is the fully sorted list. One pass of bubble sort only guarantees that the largest item reaches the end.',
        'This is one pass of *selection* sort (the smallest item, 1, is swapped with the first item). Bubble sort only swaps neighbours.',
        null,
        'This is one pass of *insertion* sort (only the 2 has been moved into place), or stopping after the first swap. A bubble sort pass continues to the end of the list.',
      ],
      keyIdea: 'For bubble sort passes, write one row for each neighbouring pair, always using the list as it stands after the last swap. Each pass moves the largest remaining item to the end.',
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
      asking: 'What does the word stable mean for a sorting method?',
      solution:
        'Sometimes two items have the same sort value, called a **key**. For example, Ali and Cai might both score 72, with Ali listed first.\n\n' +
        'When sorting by score, either one could come first. A **stable** sort always keeps them as they started, so Ali stays ahead of Cai.\n\n' +
        'So stable means items with equal keys stay in their original order.',
      conclusion: 'Stability is only about items that tie, so the answer is Items with equal keys keep their relative order.',
      whyWrong: [
        'That describes an algorithm whose running time does not depend on the input. Stability is about the order of equal items.',
        null,
        'That describes robust code. Stability is about keeping equal items in their original relative order.',
        'That describes an *in-place* algorithm. Stability is a different property, about the order of equal items.',
      ],
      keyIdea: 'Stable is only about ties. In-place is about extra memory, and best or worst case is about running time. To test stability, take two tied items and ask whether their order can change.',
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
      asking: 'Which search method only works if the data is already in order?',
      solution:
        '**Linear search** checks items one by one. It never uses their order, so it works on any list.\n\n' +
        'The other method checks the middle item and discards the half that cannot contain the target. It can only choose a half if the items are in order, and it is called **binary search**.',
      conclusion: 'Only one of the two uses the order of the items, and that is Binary search.',
      whyWrong: [
        'Linear search checks items one at a time, so it works whatever order they are in.',
        null,
        'Only binary search relies on order. Linear search works on unsorted data too.',
        'Binary search does need sorted data, because it uses the order to decide which half to keep.',
      ],
      keyIdea: 'Ask whether the method uses order to decide where to look next. If it does, as binary search does, the data must be sorted. A one-by-one scan never needs sorting.',
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
      asking: 'What is the fewest comparisons a one-by-one search can ever make?',
      solution:
        'A **linear search** starts at the first item and checks items in turn, stopping as soon as it finds the target.\n\n' +
        '**Best case** means the luckiest possible input. The luckiest input here has the target as the very first item.\n\n' +
        'The first comparison finds it and the search stops, so it makes just 1 comparison, whatever $n$ is.',
      conclusion: 'With the target in first place the search stops straight away, so the answer is $1$.',
      whyWrong: [
        null,
        'This is the **worst** case, when the target is last or missing.',
        'This is about the **average** number of comparisons when the target is present.',
        'This is about the worst case for **binary** search, which is a different algorithm.',
      ],
      keyIdea: 'Best case means the luckiest input and worst case the unluckiest. For linear search, the best is target first ($1$) and the worst is target last or missing ($n$).',
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
      asking: 'Which sort picks out the smallest remaining item on each pass?',
      solution:
        'Try this method on `[5, 2, 8]`. The smallest item is 2, so swap it into first place, giving `[2, 5, 8]`. The smallest of the rest is 5, already in place.\n\n' +
        'Each pass selects the smallest item that is left, so the method is called **selection sort**.',
      conclusion: 'Selecting the smallest remaining item on each pass is what Selection sort does.',
      whyWrong: [
        null,
        'Bubble sort only swaps neighbouring items and carries the largest item to the end.',
        'Insertion sort takes the next item in order and slides it into the sorted part. It does not search for the smallest.',
        'Merge sort splits the list and merges sorted parts. It does not search for the smallest.',
      ],
      keyIdea: 'Match each sort to its one action: selection picks the smallest remaining item, bubble swaps neighbours, insertion slides the next item into place, and merge splits and joins.',
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
      asking: 'Which sort works only by swapping items that sit next to each other?',
      solution:
        'Try this method on `[3, 2, 1]`. Compare 3 and 2 and swap, giving `[2, 3, 1]`. Compare 3 and 1 and swap, giving `[2, 1, 3]`.\n\n' +
        'Big values rise towards the end one swap at a time, like bubbles rising in water. So the method is called **bubble sort**.',
      conclusion: 'Repeatedly swapping neighbours that are in the wrong order is what Bubble sort does.',
      whyWrong: [
        'Merge sort splits the list and merges sorted parts, so it does not swap neighbours.',
        'Selection sort swaps the smallest remaining item into place, often across a long distance.',
        null,
        'Insertion sort slides one item left into the sorted part until it fits, rather than making passes of neighbour swaps over the whole list.',
      ],
      keyIdea: 'Match each sort to its one action: bubble swaps neighbours, selection picks the smallest remaining item, insertion slides the next item into place, and merge splits and joins.',
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
      asking: 'At most how many full sweeps does bubble sort need for $n$ items?',
      solution:
        'Each pass of bubble sort carries the largest remaining item to its final place at the end. So each pass fixes one more item.\n\n' +
        'Try 3 items in reverse order, `[3, 2, 1]`. Pass 1 gives `[2, 1, 3]`, and pass 2 gives `[1, 2, 3]`. That took 2 passes, not 3.\n\n' +
        'Once all the items but one are in place, the last one has nowhere else to go. So the largest number of passes is one fewer than the number of items: $n - 1$.',
      conclusion: 'One item is fixed per pass and the last item fixes itself, so the answer is $n - 1$.',
      whyWrong: [
        'This counts one pass too many. Once $n - 1$ items are placed, the last item has nowhere else to go.',
        'Half the passes is not enough in the worst case. A reversed list needs every one of the $n - 1$ passes.',
        null,
        'This is roughly the total number of **comparisons**, not the number of passes.',
      ],
      keyIdea: 'Bubble sort on $n$ items needs at most $n - 1$ passes, because each pass fixes one item. Test any such formula on a reversed list of 3 items.',
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
      asking: 'What is the largest number of checks binary search could need on 100 items?',
      solution:
        'Binary search checks the middle item, then keeps only one side. The worst case keeps the bigger side each time and finds the target only at the very end.\n\n' +
        'A check uses up the middle item, and the rest split into two sides. For example, 100 items lose the middle one and split into 49 and 50. Track the bigger side:\n\n| Check | Items before the check | Items kept after it |\n|---|---|---|\n| 1 | 100 | 50 |\n| 2 | 50 | 25 |\n| 3 | 25 | 12 |\n| 4 | 12 | 6 |\n| 5 | 6 | 3 |\n| 6 | 3 | 1 |\n\n' +
        'After check 6 there is still 1 item left, and it has to be checked too. So the total is $6 + 1 = 7$.',
      conclusion: 'It takes 6 checks to get down to one item, and that item needs one more, so the answer is 7.',
      whyWrong: [
        'This is about half the list, which is the *average* for a linear search. Binary search halves the list each time, so it needs far fewer comparisons.',
        'This is the worst case for *linear* search, which checks every item. Binary search halves the list at every step.',
        'This is $\\log_2 100 \\approx 6.64$ rounded down, but you must add 1: 6 comparisons can only deal with at most $2^6 - 1 = 63$ items.',
        null,
      ],
      keyIdea: 'In the worst case, $k$ comparisons cover at most $2^k - 1$ items, so find the smallest $k$ where that reaches $n$. Here $2^6 - 1 = 63$ is too few and $2^7 - 1 = 127$ is enough.',
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
      asking: 'Which array values does the search look at on its way to 35?',
      solution:
        'Binary search keeps two markers: `low` and `high` are the first and last indexes still being searched. It checks the item at the middle index, `mid`. Calling the array `A`, that item is `A[mid]`.\n\n' +
        '`div` divides and rounds down, so `div(15, 2)` is 7. If `A[mid]` is too small, the target must be further right, so `low` becomes `mid + 1`.\n\n' +
        'Write each index beside its value:\n\n| Index | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |\n|---|---|---|---|---|---|---|---|---|---|\n| Value | 3 | 8 | 12 | 17 | 21 | 26 | 30 | 35 | 41 |\n\n' +
        'Trace the first two checks:\n\n| Check | `low` | `high` | `mid` | `A[mid]` | Decision |\n|---|---|---|---|---|---|\n| 1 | 1 | 9 | `div(10, 2)` = 5 | 21 | $21 < 35$, so `low` = 6 |\n| 2 | 6 | 9 | `div(15, 2)` = 7 | 30 | $30 < 35$, so `low` = 8 |\n\n' +
        'Check 3: `low` is 8 and `high` is 9, so `mid` is `div(17, 2)`, which is 8. `A[8]` is 35, the target, so the search stops. Reading the `A[mid]` column in order gives 21, 30, 35.',
      conclusion: 'The search jumps to each middle in turn and stops on the target, so the values compared are 21, 30, 35.',
      whyWrong: [
        'This rounds the middle index **up** in step 2 (7.5 becomes 8, giving 35 straight away). `div` rounds down, so the middle index is 7.',
        'This is a linear search from the start of the list. Binary search jumps to the middle each time.',
        null,
        'This moves the wrong way: after 21 is too small it searches the left half instead of the right half, so it never reaches 35.',
      ],
      keyIdea: 'Trace binary search with columns for `low`, `high`, `mid` and `A[mid]`. Round `mid` down. If `A[mid]` is too small, `low` becomes `mid + 1`. If too big, `high` becomes `mid - 1`.',
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
      asking: 'What does the list look like after two sweeps of neighbour swaps?',
      solution:
        'One **pass** of bubble sort walks from left to right, comparing neighbours and swapping them if the left one is bigger.\n\n' +
        'Pass 1 starts from `[7, 3, 9, 2, 6, 4]`:\n\n| Compare | Left bigger? | List after |\n|---|---|---|\n| 7 and 3 | yes, swap | `[3, 7, 9, 2, 6, 4]` |\n| 7 and 9 | no | `[3, 7, 9, 2, 6, 4]` |\n| 9 and 2 | yes, swap | `[3, 7, 2, 9, 6, 4]` |\n| 9 and 6 | yes, swap | `[3, 7, 2, 6, 9, 4]` |\n| 9 and 4 | yes, swap | `[3, 7, 2, 6, 4, 9]` |\n\n' +
        'Pass 1 carried the largest value, 9, to the end. Pass 2 starts from the list it left behind:\n\n| Compare | Left bigger? | List after |\n|---|---|---|\n| 3 and 7 | no | `[3, 7, 2, 6, 4, 9]` |\n| 7 and 2 | yes, swap | `[3, 2, 7, 6, 4, 9]` |\n| 7 and 6 | yes, swap | `[3, 2, 6, 7, 4, 9]` |\n| 7 and 4 | yes, swap | `[3, 2, 6, 4, 7, 9]` |\n| 7 and 9 | no | `[3, 2, 6, 4, 7, 9]` |',
      conclusion: 'Pass 2 carried 7 up next to 9, so after two passes the list is `[3, 2, 6, 4, 7, 9]`.',
      whyWrong: [
        'This is the list after only **one** pass. The question asks for two passes.',
        'This is two passes of *selection* sort (2 swapped to the front, then 3 already in place). Bubble sort only swaps neighbouring items.',
        'This is two passes of *insertion* sort (only the first three items have been put in order). Bubble sort moves the largest items to the end.',
        null,
      ],
      keyIdea: 'Make one table per pass, with one row for each pair, and start each pass from the list the last one left behind. After $k$ passes the $k$ largest items are in place at the end.',
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
      asking: 'What does the list look like after three rounds of moving the smallest item forward?',
      solution:
        'One **pass** of selection sort finds the smallest item in the unsorted part, then swaps it with the first unsorted item. The sorted part grows at the front.\n\n' +
        'Pass 1. The unsorted part is the whole list, `[29, 10, 14, 37, 13, 5]`. The smallest is 5. Swap it with the first item, 29, giving `[5, 10, 14, 37, 13, 29]`.\n\n' +
        'Pass 2. The unsorted part is `[10, 14, 37, 13, 29]`. The smallest is 10, and it is already first, so nothing moves. This still counts as a pass.\n\n' +
        'Pass 3. The unsorted part is `[14, 37, 13, 29]`. The smallest is 13. Swap it with 14, giving `[5, 10, 13, 37, 14, 29]`.',
      conclusion: 'The three smallest values now fill the front, and the list is `[5, 10, 13, 37, 14, 29]`.',
      whyWrong: [
        'This does **four** passes: it skips counting pass 2 because no swap happened. A pass with no swap still counts as a pass.',
        null,
        'This is three passes of *bubble* sort, which pushes the largest items to the end. Selection sort fills the front with the smallest items.',
        'This moves each minimum to the front by **shifting** the other items right, instead of swapping it with the first unsorted item.',
      ],
      keyIdea: 'For selection sort, write the unsorted part on each pass, find its smallest item, and swap it with the first unsorted item. After $k$ passes the $k$ smallest items are at the front.',
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
      asking: 'What does the list look like after three items have been slotted into the sorted front part?',
      solution:
        '**Insertion sort** keeps a sorted part at the front, like sorted cards in your hand. Each pass takes the next item and slides it left until it fits.\n\n' +
        'At the start the sorted part is just `[8]`, because a single item is always in order. So pass 1 works on the second item.\n\n' +
        'The first two passes go like this:\n\n| Pass | Item taken | Sorted part before | What moves | List after |\n|---|---|---|---|---|\n| 1 | 4 | `[8]` | 8 shifts right | `[4, 8, 6, 2, 9, 1]` |\n| 2 | 6 | `[4, 8]` | 8 shifts right | `[4, 6, 8, 2, 9, 1]` |\n\n' +
        'Pass 3 takes the 2, and the sorted part is `[4, 6, 8]`. All three are bigger than 2, so they all shift right, and 2 goes at the very front. That gives `[2, 4, 6, 8, 9, 1]`.',
      conclusion: 'The first four items are now in order and 9 and 1 are untouched, so the list is `[2, 4, 6, 8, 9, 1]`.',
      whyWrong: [
        null,
        'This is three passes of *selection* sort (1, then 2, then 4 swapped into the front). Insertion sort only works on the items it has reached so far.',
        'This is the list after only **two** passes. It counts the starting item 8 as if it were the first pass.',
        'This is three passes of *bubble* sort, which moves the largest items to the end.',
      ],
      keyIdea: 'For insertion sort, split the list into a sorted part and an untouched part. Each pass moves one item across. After $k$ passes the first $k + 1$ items are sorted and the rest have not moved.',
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
      asking: 'What two numbers are printed: the position of the first 9 and the count of checks?',
      solution:
        '`c` counts comparisons, because line 5 adds 1 just before each check. `p` will store the index where 9 is found. `break` on line 8 ends the loop at once.\n\n' +
        'Trace the loop, starting with index 1:\n\n| `i` | `A[i]` | `c` becomes | `A[i] == 9`? |\n|---|---|---|---|\n| 1 | 4 | 1 | no, so the loop continues |\n\n' +
        'On the next pass `i` is 2 and `A[2]` is 9. Line 5 sets `c` to 2. The test is true, so line 7 sets `p` to 2 and `break` ends the loop. The later 9 at index 5 is never reached.\n\n' +
        'Line 11 prints `p` and then `c`, so the output is `2 2`.',
      conclusion: 'The search stops at the first match, index 2, after 2 comparisons, so the answer is `2 2`.',
      whyWrong: [
        'This finds the **last** 9 (index 5). The `break` ends the loop at the first match.',
        'This counts positions from 0. In this array the first item is `A[1]`, so the first 9 is at index 2.',
        null,
        'This keeps counting to the end of the array. The `break` stops the loop, so `c` stops at 2.',
      ],
      keyIdea: 'For a search with `break`, stop your trace table at the first match, because nothing after it runs. Add a column for each variable the code prints.',
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
      asking: 'How many front-item comparisons happen before one list runs out?',
      solution:
        '**Merging** joins two sorted lists into one. Each list\'s smallest remaining item is at its front, so only the two front items ever need comparing.\n\n' +
        'Each comparison moves the smaller front item to the output:\n\n| Compare | Moved | Left in first list | Left in second list |\n|---|---|---|---|\n| 2 and 3 | 2 | 5, 9 | 3, 4, 10, 12 |\n| 5 and 3 | 3 | 5, 9 | 4, 10, 12 |\n| 5 and 4 | 4 | 5, 9 | 10, 12 |\n| 5 and 10 | 5 | 9 | 10, 12 |\n| 9 and 10 | 9 | (empty) | 10, 12 |\n\n' +
        'The first list is now empty, so 10 and 12 are copied across with nothing left to compare them with.\n\n' +
        'Each row of the table was one comparison, and there are 5 rows.',
      conclusion: 'Comparisons stop as soon as the first list runs out, which takes 5 rows, so the answer is 5.',
      whyWrong: [
        'This counts every item placed in the output (7 items). The last two items, 10 and 12, are copied without any comparison.',
        null,
        'This compares every item of one list with every item of the other ($3 \\times 4 = 12$). Merging only ever compares the two front items.',
        'This uses the worst-case formula: total items minus 1, $7 - 1 = 6$. That only happens when one list runs out at the very end; here the first list runs out while 10 and 12 are still waiting, so fewer comparisons are needed.',
      ],
      keyIdea: 'For merge counts, make one row per comparison of the two front items. Each row moves one item. Stop when either list is empty, because the leftovers cost no comparisons.',
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
      asking: 'What order do the students end up in when sorted by score, with ties left as they started?',
      solution:
        'A **stable** sort orders by the key, here the score. Items with equal keys stay in the order they started.\n\n' +
        'List the scores from lowest to highest: 60, then the two 72s, then the two 85s.\n\n' +
        'For each tie, go back to the original table. Ali comes before Cai, and Bea comes before Eve.\n\n' +
        'Fill in the names, keeping those tied pairs in order:\n\n| Score | Students, in original order |\n|---|---|\n| 60 | Dan |\n| 72 | Ali, Cai |\n| 85 | Bea, Eve |',
      conclusion: 'Reading the scores in order and keeping ties as they started gives Dan, Ali, Cai, Bea, Eve.',
      whyWrong: [
        'This reverses the order of both pairs of equal scores. That could happen with an unstable sort, but a stable sort keeps Ali before Cai and Bea before Eve.',
        'This sorts by score from **highest** to lowest. The question asks for lowest first.',
        'This keeps the 72s in order but swaps the 85s. A stable sort keeps **every** group of equal scores in its original order, and Bea came before Eve.',
        null,
      ],
      keyIdea: 'For a stable sort, group the items by key in sorted order, then keep each group in its original order. Look at every tied group, because one swapped pair is enough to make an order wrong.',
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
      asking: 'How many pair checks does this code make if the list is already in order?',
      solution:
        'The comparing happens on line 5, so we need to count how many times line 5 runs.\n\n' +
        '`swapped` is a flag, a true or false marker. Line 3 sets it to false at the start of each pass. Line 9 sets it to true only if a swap happens.\n\n' +
        'On pass 1 the loop on line 4 runs `i` from 1 to $n - 1$, and here $n = 12$. That is 11 values of `i`, so line 5 compares 11 neighbouring pairs.\n\n' +
        'The array is already sorted, so `A[i] > A[i + 1]` is never true and line 9 never runs. `swapped` stays false.\n\n' +
        'Back on line 2, `while (swapped)` now fails, so no second pass happens. The total is just the 11 comparisons from pass 1.',
      conclusion: 'One pass with no swaps is enough to stop the loop, and that pass makes 11 comparisons, so the answer is 11.',
      whyWrong: [
        'This is $\\frac{12 \\times 11}{2} = 66$, the number of comparisons for a full bubble sort that never stops early. The `swapped` flag stops it after one pass.',
        'This assumes a second pass is needed to "confirm" the list is sorted. The first pass already makes no swaps, so the loop ends after it.',
        null,
        'This counts one comparison per item. A list of 12 items has only 11 neighbouring pairs (the `for` loop goes from 1 to $n - 1$).',
      ],
      keyIdea: 'With an early-exit flag, a sorted list of $n$ items costs one pass of $n - 1$ comparisons. Count neighbouring pairs, which is one fewer than the number of items.',
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
      asking: 'What should the code do when `A[mid]` is bigger than the target?',
      solution:
        '`low` and `high` (lines 2 and 3) mark the first and last indexes still being searched. Line 5 finds the middle index, `mid`.\n\n' +
        'We reach the missing line only when `A[mid]` is not the target (line 6) and is not smaller than the target (line 9). So `A[mid]` is too big.\n\n' +
        'The array is sorted, so the target can only be to the left of `mid`. That means the right-hand end of the range must come in, so `high` is the marker to change.\n\n' +
        '`mid` has just been checked, so it should leave the range. The new end is the index just before it, which is `high = mid - 1`. The range shrinks every time, so the loop always ends.',
      conclusion: 'The target is to the left and `mid` is already ruled out, so the missing line is `high = mid - 1`.',
      whyWrong: [
        null,
        'This keeps `mid` and the item after it in the range, even though the target must be to the left of `mid`. With `[1, 2, 3]` and target 1: mid = 2, so high = 3 and the same mid is chosen forever (an infinite loop).',
        'This changes the wrong pointer. The target is on the left, so `high` must move; changing `low` can even repeat the same mid forever (try `[1, 2, 3]` with target 1).',
        'This keeps `mid` in the range even though it has already been checked. When low = high = mid and the target is missing, nothing changes and the loop never ends.',
      ],
      keyIdea: 'With `while (low <= high)`, the new bounds must exclude `mid`: too small means `low = mid + 1`, and too big means `high = mid - 1`. Test any version on a tiny list such as `[1, 2, 3]` to see whether it can loop forever.',
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
      asking: 'How many swaps does bubble sort make in total to put this list in order?',
      solution:
        'One pass of bubble sort walks from left to right, comparing neighbours and swapping them if the left one is bigger. Passes continue until the list is sorted.\n\n' +
        'Pass 1 makes 3 swaps:\n\n| Compare | Swap? | List after |\n|---|---|---|\n| 6 and 3 | yes | `[3, 6, 8, 1, 5]` |\n| 6 and 8 | no | `[3, 6, 8, 1, 5]` |\n| 8 and 1 | yes | `[3, 6, 1, 8, 5]` |\n| 8 and 5 | yes | `[3, 6, 1, 5, 8]` |\n\n' +
        'Pass 2 makes 2 swaps:\n\n| Compare | Swap? | List after |\n|---|---|---|\n| 3 and 6 | no | `[3, 6, 1, 5, 8]` |\n| 6 and 1 | yes | `[3, 1, 6, 5, 8]` |\n| 6 and 5 | yes | `[3, 1, 5, 6, 8]` |\n| 6 and 8 | no | `[3, 1, 5, 6, 8]` |\n\n' +
        'Pass 3 swaps 3 and 1, giving `[1, 3, 5, 6, 8]`. That is 1 swap, and the list is now sorted, so no later comparison swaps anything.\n\n' +
        'Add up the swaps: $3 + 2 + 1 = 6$.',
      conclusion: 'The passes made 3, 2 and 1 swaps, so the total is 6.',
      whyWrong: [
        'This is $\\frac{5 \\times 4}{2} = 10$, the number of swaps for a list in completely **reverse** order (every pair wrong). Here only some pairs are out of order.',
        null,
        'This is the number of passes for 5 items ($n - 1 = 4$), not the number of swaps.',
        'This is the number of swaps *selection* sort would make (1 with 6, then 5 with 8). Bubble sort only swaps neighbours, so it needs more swaps.',
      ],
      keyIdea: 'Each bubble swap fixes one pair that is out of order. So the total swaps equal the number of pairs where a larger value comes before a smaller one, which you can count without tracing.',
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
      asking: 'What is the longest list binary search can always finish within 6 checks?',
      solution:
        'Each check uses up the middle item, and the rest split into two sides. The search then carries on in just one of those sides.\n\n' +
        'Build up from the smallest case. 1 check can handle 1 item. With 2 checks, each side can hold 1 item, plus the middle: $2 \\times 1 + 1 = 3$ items.\n\n' +
        'The same pattern continues. Each side can hold as many as one fewer check allows:\n\n| Checks | Most items |\n|---|---|\n| 1 | 1 |\n| 2 | $2 \\times 1 + 1 = 3$ |\n| 3 | $2 \\times 3 + 1 = 7$ |\n| 4 | $2 \\times 7 + 1 = 15$ |\n| 5 | $2 \\times 15 + 1 = 31$ |\n\n' +
        'One more row gives 6 checks: $2 \\times 31 + 1 = 63$ items.',
      conclusion: 'Each extra check doubles the list and adds a middle item, so 6 checks handle at most 63 items.',
      whyWrong: [
        null,
        'This is $2^6$. But each comparison also uses up the middle item, so 6 comparisons handle only $2^6 - 1$ items; 64 items would need 7 in the worst case.',
        'This is $2^5$, as if one comparison were wasted. In fact 6 comparisons can handle up to 63 items.',
        'This is $6^2$. Binary search grows by doubling, not by squaring.',
      ],
      keyIdea: 'With $k$ comparisons, binary search handles at most $2^k - 1$ items. Here that is $2^6 - 1 = 63$. To go the other way, find the smallest $k$ where $2^k - 1$ reaches the list length.',
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
      asking: 'What is `i` when the loop stops?',
      solution:
        'Line 3 keeps the loop going only while both tests are true: `i` is within the array, and `A[i]` is not 8. `!=` means not equal.\n\n' +
        'Trace it, testing `A[i]` before each pass:\n\n| `i` | `A[i]` | `A[i] != 8` | What happens |\n|---|---|---|---|\n| 1 | 5 | true | line 4 makes `i` 2 |\n| 2 | 2 | true | line 4 makes `i` 3 |\n\n' +
        'Now `A[3]` is 8, so `A[i] != 8` is false. That makes the whole `and` false, so the loop stops. Line 6 prints `i`, which is 3.',
      conclusion: 'The loop stops as soon as `A[i]` is 8, at index 3, so the answer is 3.',
      whyWrong: [
        'This counts positions from 0. Here the first item is `A[1]`, so 8 is at index 3.',
        null,
        'This is the length of the array. The loop stops as soon as it reaches the 8, before the last item.',
        '`i` goes up by 1 on each pass, and the test fails as soon as `A[i]` is 8.',
      ],
      keyIdea: 'For `while (a and b)`, the loop stops when either part is false. Trace `i` in a table and test before each pass. The value printed is the index where the test first fails.',
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
      asking: 'Does this search ever finish, and if so what is `low`?',
      solution:
        '`low` and `high` mark the ends of the range. Line 4 runs the loop while `low < high`, so it can only end if the two markers meet. `div` divides and rounds down.\n\n' +
        'Write each index beside its value:\n\n| Index | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| `A[i]` | 2 | 4 | 6 | 8 |\n\n' +
        'Trace the loop. `A[mid]` is below 8 every time, so line 7 runs each pass and sets `low` to `mid`:\n\n| Pass | `low` | `high` | `mid` | `A[mid]` | `low` becomes |\n|---|---|---|---|---|---|\n| 1 | 1 | 4 | `div(5,2)` = 2 | 4 | 2 |\n| 2 | 2 | 4 | `div(6,2)` = 3 | 6 | 3 |\n| 3 | 3 | 4 | `div(7,2)` = 3 | 6 | 3 |\n\n' +
        'Pass 3 starts with `low` at 3 and ends with `low` at 3, so nothing changed. Pass 4 is then exactly the same as pass 3, and so is every pass after it.\n\n' +
        'The test stays $3 < 4$, which is always true. So the loop never ends and line 12 is never reached.',
      conclusion: '`mid` keeps rounding down to `low`, so nothing changes and the answer is Infinite loop.',
      whyWrong: [
        'This is the position of 8, which a correct search would find. Here `div(3 + 4, 2)` rounds down to 3, so `mid` never reaches 4.',
        'This is where `low` gets stuck, but the loop is still running, so `print(low)` is never reached.',
        'This stops after the first update. $2 < 4$ is still true, so the loop continues.',
        null,
      ],
      keyIdea: 'With `low = mid`, watch the case where `high` is one more than `low`. `div` rounds down, so `mid` equals `low` and the range stops shrinking. A pass that changes no variable repeats forever.',
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
      asking: 'What does the array hold after one sweep of this loop?',
      solution:
        'Lines 4 to 6 swap two items. `t` keeps a copy of `A[i]` while it is overwritten, so neither value is lost.\n\n' +
        'Line 3 only allows the swap if the left item is bigger. The loop runs `i` = 1, 2, 3, so each neighbouring pair is checked once.\n\n' +
        'Trace the first two passes:\n\n| `i` | `A[i]` and `A[i + 1]` | Left bigger? | Array after |\n|---|---|---|---|\n| 1 | 4 and 1 | yes, swap | `[1, 4, 3, 2]` |\n| 2 | 4 and 3 | yes, swap | `[1, 3, 4, 2]` |\n\n' +
        'When `i` is 3, `A[3]` is 4 and `A[4]` is 2. The 4 is bigger, so they swap, giving `[1, 3, 2, 4]`. The loop then ends, and line 9 prints the array.',
      conclusion: 'One sweep moves the largest value, 4, to the end, but 3 and 2 stay out of order, so the answer is `[1, 3, 2, 4]`.',
      whyWrong: [
        null,
        'This is the fully sorted array. The code makes only one pass, so 3 and 2 are still out of order.',
        'This stops after the first swap. The loop continues up to `i = 3`.',
        'This sorts into descending order. The test `A[i] > A[i + 1]` moves larger values to the right.',
      ],
      keyIdea: 'A single `for` loop of neighbour swaps is one bubble sort pass, and it only puts the largest item in place. Make one row per `i`, using the array as it stands after the last swap.',
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
      asking: 'How many comparisons does selection sort make in total on 6 items?',
      solution:
        'To find the smallest item in a group, start with the first item as the smallest so far and compare it with each of the others. A group of $m$ items takes $m - 1$ comparisons.\n\n' +
        'Each pass places one item, so the unsorted part gets one shorter:\n\n| Pass | Items in the unsorted part | Comparisons |\n|---|---|---|\n| 1 | 6 | 5 |\n| 2 | 5 | 4 |\n| 3 | 4 | 3 |\n| 4 | 3 | 2 |\n| 5 | 2 | 1 |\n\n' +
        'When 1 item is left it is already in place, so there is no sixth pass. Add the last column: $5 + 4 + 3 + 2 + 1 = 15$.',
      conclusion: 'Adding the comparisons from all 5 passes gives 15.',
      whyWrong: [
        null,
        'This is the number of passes, $n - 1 = 5$. Each pass makes several comparisons.',
        'This is $6^2$, assuming every pass scans all 6 items. The unsorted part gets shorter each time.',
        'This is $6 \\times 5$, forgetting to divide by 2 in $\\frac{n(n - 1)}{2}$.',
      ],
      keyIdea: 'Selection sort on $n$ items always makes $(n - 1) + (n - 2) + \\dots + 1 = \\frac{n(n - 1)}{2}$ comparisons. Here $\\frac{6 \\times 5}{2} = 15$. The starting order of the list does not change this.',
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
