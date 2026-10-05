import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'searching-sorting',
  know:
    '### Why this topic matters\n\n' +
    'Searching (finding an item) and sorting (putting items in order) are the classic first algorithms. Exam questions here are mostly **tracing**: you are given a small list and asked what happens after a few steps, or how many comparisons are made. You do not need clever maths, just a careful, step-by-step method. Always write the list out again after every step.\n\n' +
    '### Linear search\n\n' +
    'Check the items one at a time from the start until you find the target or run out of items. It works on **any** list, sorted or not.\n\n' +
    '- **Best case:** the target is the first item, so 1 comparison.\n' +
    '- **Worst case:** the target is last or missing, so $n$ comparisons for $n$ items.\n' +
    '- **Average** (target present): about $\\frac{n}{2}$ comparisons.\n\n' +
    'A singly linked list can only be walked from the front, so searching it is always a linear search: $n$ comparisons in the worst case.\n\n' +
    '### Binary search\n\n' +
    'Binary search only works on a **sorted** list. This precondition is examined a lot. Keep two markers, low and high, around the part of the list that could still contain the target:\n\n' +
    '1. Find the middle: mid = (low + high) DIV 2, which means divide and **round down**.\n' +
    '2. If the middle item is the target, stop.\n' +
    '3. If the middle item is too small, the target must be to the right: low = mid + 1.\n' +
    '4. If it is too big, the target must be to the left: high = mid - 1.\n' +
    '5. Repeat while low <= high. If low passes high, the target is not there.\n\n' +
    'Each comparison throws away about half of what is left, so a list of 1000 items needs at most 10 comparisons ($2^{10} = 1024$). The worst case is $\\lfloor \\log_2 n \\rfloor + 1$ comparisons, and with $k$ comparisons you can search at most $2^k - 1$ items. The best case is still 1 comparison (the first middle item is the target).\n\n' +
    '**How to trace:** draw a table with columns low, high, mid, A[mid] and decision. Indexes start at 0, so a list of 9 items has high = 8 at the start.\n\n' +
    '### Bubble sort\n\n' +
    'One **pass**: go along the list comparing each pair of neighbours and swap them if the left one is bigger. The biggest item "bubbles" to the end in the first pass, so after $k$ passes the $k$ largest items are in their final places at the end. A list of $n$ items needs at most $n - 1$ passes. Because the last $k$ items are already in place after $k$ passes, the next pass can stop before them: the passes make $(n - 1) + (n - 2) + \\cdots + 1 = \\frac{n(n - 1)}{2}$ comparisons in total (for 5 items: $4 + 3 + 2 + 1 = 10$).\n\n' +
    'A common improvement stops as soon as a pass makes **no swaps**. On a list that is already sorted this needs just one pass of $n - 1$ comparisons (the best case). The total number of swaps equals the number of pairs that start in the wrong order.\n\n' +
    '### Selection sort\n\n' +
    'In each pass, find the **smallest** item in the unsorted part and **swap** it with the first unsorted item. After $k$ passes the $k$ smallest items are in their final places at the front. A pass still counts even if the smallest item is already in place. Selection sort always scans the whole unsorted part, so it makes $\\frac{n(n - 1)}{2}$ comparisons on every list, even a sorted one.\n\n' +
    '### Insertion sort\n\n' +
    'Think of sorting a hand of cards. The first item on its own counts as a sorted part. In each pass, take the next item and slide it left past every bigger item into its correct place. After $k$ passes the **first $k + 1$ items** are in order among themselves, and the rest of the list has not been touched. On a sorted list each item is compared once and stays put, so only $n - 1$ comparisons are made.\n\n' +
    '### Merge sort\n\n' +
    'A *divide and conquer* method: split the list in half, sort each half (by splitting again until single items are left), then **merge** sorted lists back together. To merge, compare the front items of the two lists and move the smaller one to the output; when one list is empty, copy the rest of the other without comparing. Merging lists with $n$ items in total takes at most $n - 1$ comparisons. Merge sort is much faster than the others on big lists, but it needs extra memory for the merged lists.\n\n' +
    '### Stability and best/worst cases\n\n' +
    'A sort is **stable** if items with equal keys keep their original relative order. Bubble, insertion and merge sort are stable; selection sort (with long-distance swaps) is usually not.\n\n' +
    '| Algorithm | Best case | Worst case | Stable? |\n' +
    '| --- | --- | --- | --- |\n' +
    '| Linear search | 1 comparison | $n$ comparisons | not a sort |\n' +
    '| Binary search (sorted list) | 1 comparison | $\\lfloor \\log_2 n \\rfloor + 1$ comparisons | not a sort |\n' +
    '| Bubble sort (with early exit) | $n - 1$ (already sorted) | $\\frac{n(n - 1)}{2}$ (reversed) | yes |\n' +
    '| Selection sort | $\\frac{n(n - 1)}{2}$ | $\\frac{n(n - 1)}{2}$ | usually no |\n' +
    '| Insertion sort | $n - 1$ (already sorted) | $\\frac{n(n - 1)}{2}$ (reversed) | yes |\n' +
    '| Merge sort | about $n \\log_2 n$ | about $n \\log_2 n$ | yes |',
  formulas: [
    { label: 'Linear search comparisons', tex: '\\text{best} = 1, \\quad \\text{worst} = n, \\quad \\text{average} \\approx \\frac{n}{2}' },
    { label: 'Binary search middle index', tex: '\\text{mid} = \\left\\lfloor \\frac{\\text{low} + \\text{high}}{2} \\right\\rfloor', note: 'Round down (DIV). Then use low = mid + 1 or high = mid - 1.' },
    { label: 'Binary search worst case', tex: '\\lfloor \\log_2 n \\rfloor + 1 \\text{ comparisons}', note: 'For example, 100 items: $2^6 = 64 \\le 100 < 128$, so $6 + 1 = 7$.' },
    { label: 'Items searchable with k comparisons', tex: 'n_{\\max} = 2^k - 1' },
    { label: 'Comparisons in a full bubble or selection sort', tex: '(n - 1) + (n - 2) + \\cdots + 1 = \\frac{n(n - 1)}{2}' },
    { label: 'Best case: early-exit bubble sort or insertion sort on a sorted list', tex: 'n - 1 \\text{ comparisons}' },
    { label: 'Bubble sort swaps', tex: '\\text{swaps} = \\text{number of pairs in the wrong order}', note: 'A fully reversed list has $\\frac{n(n - 1)}{2}$ such pairs.' },
    { label: 'Merging two sorted lists', tex: '\\text{comparisons} \\le n_1 + n_2 - 1' },
    { label: 'State after k passes', tex: '\\text{bubble: } k \\text{ largest at the end} \\quad \\text{selection: } k \\text{ smallest at the front} \\quad \\text{insertion: first } k + 1 \\text{ in order}' },
  ],
  examples: [
    {
      title: 'Linear search count (easy)',
      problem: 'A linear search looks for 7 in the list `[3, 9, 7, 2, 7]`. How many comparisons are made? How many would be made if it looked for 5?',
      steps: [
        'Compare 7 with 3: not equal (1 comparison).',
        'Compare 7 with 9: not equal (2 comparisons).',
        'Compare 7 with 7: found, so the search stops (3 comparisons). The second 7 is never reached.',
        'For 5: it is not in the list, so all 5 items are compared before the search gives up: 5 comparisons.',
      ],
      answer: '3 comparisons for 7, and 5 comparisons for 5.',
    },
    {
      title: 'Bubble sort passes',
      problem: 'Show `[5, 1, 4, 2, 8]` after each of the first two passes of bubble sort (ascending).',
      steps: [
        'Pass 1: 5 and 1 swap, giving `[1, 5, 4, 2, 8]`.',
        'Pass 1: 5 and 4 swap, giving `[1, 4, 5, 2, 8]`.',
        'Pass 1: 5 and 2 swap, giving `[1, 4, 2, 5, 8]`.',
        'Pass 1: 5 and 8 do not swap. After pass 1: `[1, 4, 2, 5, 8]` (8 is in place).',
        'Pass 2: 1 and 4 no swap; 4 and 2 swap, giving `[1, 2, 4, 5, 8]`; 4 and 5 no swap.',
        'After pass 2: `[1, 2, 4, 5, 8]`. The two largest items (5 and 8) are in place, and here the list happens to be fully sorted.',
      ],
      answer: 'After pass 1: `[1, 4, 2, 5, 8]`. After pass 2: `[1, 2, 4, 5, 8]`.',
    },
    {
      title: 'Selection sort versus insertion sort',
      problem: 'Starting from `[4, 3, 6, 1, 5]`, find the list after two passes of (a) selection sort and (b) insertion sort.',
      steps: [
        '(a) Pass 1: the smallest item is 1; swap it with the first item 4, giving `[1, 3, 6, 4, 5]`.',
        '(a) Pass 2: the smallest of the unsorted part `[3, 6, 4, 5]` is 3, which is already first, so no swap: `[1, 3, 6, 4, 5]`.',
        '(b) Pass 1: insert 3 into the sorted part `[4]`: 3 is smaller, so 4 shifts right, giving `[3, 4, 6, 1, 5]`.',
        '(b) Pass 2: insert 6 into `[3, 4]`: it is bigger than 4, so it stays, giving `[3, 4, 6, 1, 5]`.',
        'Check: selection sort put the 2 smallest items at the front; insertion sort sorted the first 3 items among themselves.',
      ],
      answer: '(a) `[1, 3, 6, 4, 5]`; (b) `[3, 4, 6, 1, 5]`.',
    },
    {
      title: 'Binary search trace (exam level)',
      problem: 'Binary search looks for 23 in `[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]` (indexes 0 to 9). Which values are compared, and how many comparisons are made?',
      steps: [
        'Start: low = 0, high = 9.',
        'mid = $(0 + 9) \\div 2 = 4.5$, round down to 4. A[4] = 16, and $16 < 23$, so low = 5.',
        'mid = $(5 + 9) \\div 2 = 7$. A[7] = 56, and $56 > 23$, so high = 6.',
        'mid = $(5 + 6) \\div 2 = 5.5$, round down to 5. A[5] = 23: found.',
        'Values compared: 16, 56, 23. That is 3 comparisons, within the worst case of $\\lfloor \\log_2 10 \\rfloor + 1 = 4$.',
      ],
      answer: '16, 56, 23 (3 comparisons).',
    },
  ],
  traps: [
    'Using binary search on an **unsorted** list. It can miss the target; the list must be sorted first.',
    'Rounding the middle index **up**. DIV means round down: $(5 + 8) \\div 2 = 6.5$ gives mid = 6, not 7.',
    'Forgetting the $+1$ in the binary search worst case: 100 items need 7 comparisons, not 6, because 6 comparisons only cover $2^6 - 1 = 63$ items.',
    'Mixing up the sorts: bubble sort fills the **end** with the largest items, selection sort fills the **front** with the smallest, and insertion sort sorts the first $k + 1$ items but leaves the rest untouched.',
    'Miscounting passes: in insertion sort the first pass inserts the **second** item; in selection sort a pass with no swap still counts as a pass.',
    'In a merge, counting the items copied at the end as comparisons. Once one list is empty, no more comparisons are made.',
  ],
  examTip:
    'Most questions show a short list and four possible "states" or counts. The wrong options are usually the result of a **different** algorithm or of one pass too few or too many, so do quick checks before tracing fully. After $k$ bubble passes the $k$ largest values must be at the end; after $k$ selection passes the $k$ smallest must be at the front; after $k$ insertion passes the first $k + 1$ items must be in order and the rest unchanged. These checks often eliminate two or three options in seconds. For binary search counts, list the powers of 2 (1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024): find the smallest power of 2 that is **bigger** than $n$, and its exponent is the worst case (100 items: $128 = 2^7$, so 7). If an option equals $n$ or $\\frac{n}{2}$ for a binary search question, it is a linear-search distractor. For comparison counts, remember the big three: linear $n$, full bubble or selection $\\frac{n(n - 1)}{2}$, and best-case insertion $n - 1$.',
};
