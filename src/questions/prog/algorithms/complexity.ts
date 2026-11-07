import type { StaticQuestion } from '../../../types';

// Helpers used only by the answer checks (they re-derive answers by actually running the rule).
const log2 = (x: number) => Math.log(x) / Math.log(2);

/** Join source lines into one code string. */
const L = (...lines: string[]) => lines.join('\n');

/** Worst-case number of items binary search inspects in a sorted list of n items. */
function binaryWorst(n: number): number {
  let probes = 0;
  let size = n;
  while (size > 0) {
    probes++;
    // after inspecting the middle item, the larger remaining half has floor(size / 2) items
    size = Math.floor(size / 2);
  }
  return probes;
}

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'complexity-001',
    subtopic: 'complexity',
    difficulty: 'foundation',
    stem: 'What is the **worst-case** time complexity of linear search on an unsorted list of $n$ items?',
    options: ['$O(1)$', '$O(\\log n)$', '$O(n)$', '$O(n^2)$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How does the work grow for a one-by-one search in the unluckiest case?',
      solution:
        'Big-O describes how the number of steps grows as the input size $n$ grows. So count the checks.\n\n' +
        'A linear search looks at items one at a time. In the worst case the target is last, or missing altogether, so every item gets checked.\n\n' +
        'That is 10 checks for 10 items and 1,000 checks for 1,000 items, so $n$ checks for $n$ items. Work that grows in step with $n$ is written $O(n)$.',
      conclusion: 'The worst case checks each of the $n$ items once, so the answer is $O(n)$.',
      whyWrong: [
        '$O(1)$ is the **best** case (the target happens to be first). The question asks for the worst case.',
        '$O(\\log n)$ is binary search, which halves the list each step. That only works on a **sorted** list; this list is unsorted and is checked item by item.',
        null,
        '$O(n^2)$ would need a loop inside a loop (comparing every item with every other item). Linear search makes a single pass, so the work is proportional to $n$, not $n^2$.',
      ],
      keyIdea: 'Count how many times the main action runs as $n$ grows. One pass over the items is $O(n)$. Halving each time is $O(\\log n)$. A loop inside a loop is $O(n^2)$.',
    },
  },
  {
    id: 'complexity-002',
    subtopic: 'complexity',
    difficulty: 'foundation',
    stem: 'An algorithm performs $T(n) = 3n^2 + 5n + 7$ steps on an input of size $n$. Its running time is of the order:',
    options: ['$O(n)$', '$O(n^2)$', '$O(1)$', '$O(n^3)$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which part of $3n^2 + 5n + 7$ controls the growth when $n$ is huge?',
      solution:
        '$T(n)$ counts the steps for an input of size $n$. Big-O asks how that count grows when $n$ gets very large.\n\n' +
        'Try a large value, $n = 1000$:\n\n| Term | Value at $n = 1000$ |\n|---|---|\n| $3n^2$ | $3\\,000\\,000$ |\n| $5n$ | $5000$ |\n| $7$ | $7$ |\n\n' +
        'The $3n^2$ term makes up almost all of the total, and the gap keeps widening as $n$ grows. So the other two terms can be ignored.\n\n' +
        'Big-O also drops the 3 in front, because multiplying by a fixed number does not change how the term grows. That leaves $n^2$, which is written $O(n^2)$.',
      conclusion: 'The $n^2$ term dominates for large $n$, and its coefficient is dropped, so the answer is $O(n^2)$.',
      whyWrong: [
        'This keeps the $5n$ term. For large $n$ the $n^2$ term is far bigger than $5n$, so $n^2$ is the dominant term.',
        null,
        'This treats the running time as fixed because the expression contains fixed numbers. Big-O describes how $T(n)$ grows as $n$ grows, and $3n^2$ grows without limit.',
        'This adds the powers of the terms ($2 + 1 = 3$). In Big-O you keep the **largest** power, you do not add the powers together.',
      ],
      keyIdea: 'To get Big-O from a formula, keep the fastest-growing term and drop the number in front of it. The order is $1 < \\log n < n < n\\log n < n^2 < n^3 < 2^n$.',
    },
  },
  {
    id: 'complexity-003',
    subtopic: 'complexity',
    difficulty: 'foundation',
    stem: 'Which of these functions grows **fastest** as $n$ becomes very large?',
    options: ['$100n$', '$n^2$', '$n\\log_2 n$', '$2^n$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which of these four formulas ends up the largest once $n$ is very big?',
      solution:
        'To compare growth, try a big value of $n$. Small values can mislead, because the 100 in $100n$ makes it look large at first.\n\n' +
        'Take $n = 64$. $\\log_2 64$ asks how many 2s multiply together to make 64. The answer is 6, because $2^6 = 64$.\n\n' +
        'Work out each formula at $n = 64$:\n\n| Formula | Value at $n = 64$ |\n|---|---|\n| $100n$ | $6400$ |\n| $n\\log_2 n$ | $64 \\times 6 = 384$ |\n| $n^2$ | $64 \\times 64 = 4096$ |\n| $2^n$ | about $1.8 \\times 10^{19}$ |\n\n' +
        '$2^n$ is far ahead of the rest. $100n$ is still above $n^2$ here only because of the 100: once $n$ passes 100, $n^2$ overtakes it.',
      conclusion: 'Adding 1 to $n$ doubles $2^n$, which none of the others do, so the fastest-growing is $2^n$.',
      whyWrong: [
        'The big coefficient 100 makes $100n$ larger for small $n$, but coefficients do not change the growth rate: $100n$ is still linear, $O(n)$.',
        '$n^2$ is a polynomial. Any exponential like $2^n$ eventually beats every polynomial (already at $n = 5$, $2^5 = 32 > 25$, and the gap explodes after that).',
        '$n\\log_2 n$ grows only slightly faster than $n$; it is much slower than $n^2$ and $2^n$.',
        null,
      ],
      keyIdea: 'Use the order $\\log n < n < n\\log n < n^2 < 2^n$. A number in front, such as 100, does not change a formula\'s place in that order. To check by trying a value, make $n$ much bigger than that number, because at $n = 64$ the 100 still puts $100n$ above $n^2$.',
    },
    check: {
      optionValues: [100 * 1000, 1000 ** 2, 1000 * log2(1000), 2 ** 1000],
      compute: () => {
        const n = 1000;
        const fs = [(x: number) => 100 * x, (x: number) => x * x, (x: number) => x * log2(x), (x: number) => 2 ** x];
        return Math.max(...fs.map((f) => f(n)));
      },
    },
  },
  {
    id: 'complexity-004',
    subtopic: 'complexity',
    difficulty: 'foundation',
    stem: 'What is the worst-case time complexity of **binary search** on a sorted list of $n$ items?',
    options: ['$O(\\log n)$', '$O(1)$', '$O(n)$', '$O(n\\log n)$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How does the number of checks grow for binary search on a sorted list?',
      solution:
        'Binary search checks the middle item, then throws away half of what is left. So count how many times it can halve the list.\n\n' +
        'In the worst case it keeps halving until one item remains. Start with 16 items: $16 \\to 8 \\to 4 \\to 2 \\to 1$. That is 4 halvings.\n\n' +
        'Doubling the list to 32 items adds only 1 more halving. So the checks go up by just one each time $n$ doubles.\n\n' +
        'The number of halvings to get from $n$ down to 1 is called $\\log_2 n$. So the growth is written $O(\\log n)$.',
      conclusion: 'The checks equal the number of halvings, which is about $\\log_2 n$, so the answer is $O(\\log n)$.',
      whyWrong: [
        null,
        '$O(1)$ is only the best case (the middle item happens to be the target). In the worst case the search keeps halving until one item is left.',
        '$O(n)$ is linear search, which checks items one by one. Binary search discards half of the remaining items every step, which is much faster.',
        '$O(n\\log n)$ is the cost of a good **sort** such as merge sort, not of searching an already sorted list.',
      ],
      keyIdea: 'If each step cuts the remaining work in half, the number of steps is about $\\log_2 n$, which is $O(\\log n)$. To test it, ask whether doubling $n$ adds just one step.',
    },
  },
  {
    id: 'complexity-005',
    subtopic: 'complexity',
    difficulty: 'foundation',
    stem: 'Which of these sorting algorithms has a **worst-case** time complexity of $O(n\\log n)$?',
    options: ['Bubble sort', 'Insertion sort', 'Merge sort', 'Selection sort'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which of these sorts stays at about $n\\log n$ steps even on its worst input?',
      solution:
        '$\\log_2 n$ is the number of times $n$ can be halved before reaching 1. So $n\\log n$ means about $\\log_2 n$ rounds of halving, with about $n$ steps of work in each round.\n\n' +
        'Bubble, insertion and selection sort work by passes inside passes. On a bad input that is about $n$ passes of up to $n$ steps each, so about $n \\times n$ steps.\n\n' +
        'Merge sort splits the list in half again and again, which gives about $\\log_2 n$ rounds. Each round of merging touches all $n$ items once. That holds for every input.',
      conclusion: 'With $n$ steps per round and $\\log_2 n$ rounds on any input, the sort that is $O(n\\log n)$ is Merge sort.',
      whyWrong: [
        'Bubble sort uses nested passes over the list, so its worst case (a reversed list) is $O(n^2)$. Its best case can be $O(n)$ with an early-exit check, but that is the best case, not the worst.',
        'Insertion sort is $O(n)$ on an already sorted list, but on a reversed list each item moves past all earlier ones, giving $O(n^2)$.',
        null,
        'Selection sort always scans the whole unsorted part to find the smallest item, so it is $O(n^2)$ in every case.',
      ],
      keyIdea: 'Worst-case sort costs: bubble, insertion and selection are $O(n^2)$, because they run passes inside passes. Merge sort is $O(n\\log n)$, from halving levels times $n$ work per level.',
    },
  },
  {
    id: 'complexity-010',
    subtopic: 'complexity',
    difficulty: 'foundation',
    stem: 'Which data structure gives the fastest average lookup of a value from its key?',
    options: ['An unsorted array of key-value pairs', 'A hash table', 'A stack', 'A queue'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which structure finds a value from its key in the fewest steps on average?',
      solution:
        'A **key** is what you look up by, like a name in a phone book. The **value** is what you get back, like the phone number.\n\n' +
        'An array of pairs has to be checked one by one, up to $n$ checks. A stack or a queue only gives access to one item, so you would have to remove items to look further.\n\n' +
        'A **hash table** runs the key through a function that works out a slot number, then jumps straight to that slot. On average the number of steps does not depend on how many items are stored, which is $O(1)$.',
      conclusion: 'Jumping straight to the slot beats checking items one by one, so the answer is A hash table.',
      whyWrong: [
        'This works, but each lookup is a linear search through the pairs: $O(n)$.',
        null,
        'A stack only gives access to its top item, so finding a key means removing items one by one.',
        'A queue only gives access to its front item, so finding a key means removing items one by one.',
      ],
      keyIdea: 'Lookup by key with no order needed points to a hash table, at $O(1)$ on average. Compare the others by counting checks: an unsorted array is $O(n)$, and stacks and queues must remove items.',
    },
  },
  {
    id: 'complexity-013',
    subtopic: 'complexity',
    difficulty: 'foundation',
    stem: 'Which operation on an array of $n$ items takes $O(n)$ time rather than $O(1)$?',
    options: ['Reading the item at index $i$', 'Reading the stored length', 'Adding at the end, with space free', 'Inserting at the front'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which array action gets slower as the array gets longer?',
      solution:
        '$O(1)$ means the work stays the same however big the array is. $O(n)$ means the work grows in step with its size.\n\n' +
        'Count the items each action has to touch on an array of $n$ items:\n\n| Action | Items touched | Why |\n|---|---|---|\n| Read index $i$ | 1 | jumps straight to that slot |\n| Read the stored length | 1 | it is one stored number |\n| Add at the end, space free | 1 | fills the free slot |\n| Insert at the front | $n$ | every item shifts one slot right |',
      conclusion: 'Only one action has to move all $n$ items, and that is Inserting at the front.',
      whyWrong: [
        'Indexing jumps straight to a position in memory, so it does not walk through the array.',
        'The length is stored as one number, so reading it does not count the items.',
        'Adding at the end moves nothing, because the free slot is already there.',
        null,
      ],
      keyIdea: 'To compare array operations, count the items that must move or be read. A known position with nothing shifted is $O(1)$. Anything that shifts or scans the whole array is $O(n)$.',
    },
  },
  {
    id: 'complexity-021',
    subtopic: 'complexity',
    difficulty: 'foundation',
    stem: 'What does Big-O notation describe?',
    options: ['The exact running time in seconds', 'How the work grows with input size', 'The number of lines of code', 'The speed of the computer'],
    correctIndex: 1,
    markScheme: {
      asking: 'What is Big-O notation actually telling you?',
      solution:
        'Big-O counts steps, not seconds. One loop over $n$ items does $n$ steps, so doubling the items doubles the steps. We write that as $O(n)$.\n\n' +
        'A loop inside a loop does $n \\times n$ steps, so doubling the items makes 4 times the steps. We write that as $O(n^2)$. Each Big-O names a pattern of growth as the input gets bigger.',
      conclusion: 'Big-O compares those growth patterns, not clock time or code length, so the answer is How the work grows with input size.',
      whyWrong: [
        'Exact seconds depend on the computer. Big-O only describes the shape of the growth.',
        null,
        'A short program can do a huge amount of work, so the number of lines tells you little about growth.',
        'Big-O does not depend on the machine, since it ignores constant factors.',
      ],
      keyIdea: 'Big-O answers one question: if the input gets bigger, how much more work is there? It ignores the computer\'s speed, fixed multipliers and how long the code looks.',
    },
  },
  {
    id: 'complexity-022',
    subtopic: 'complexity',
    difficulty: 'foundation',
    stem: 'What is the time complexity of reading `A[i]` from an array of $n$ items?',
    options: ['$O(n)$', '$O(1)$', '$O(\\log n)$', '$O(n^2)$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How much work does it take to read one array item when you know its index?',
      solution:
        'An array stores items side by side in memory. So the computer can work out where item $i$ is with one sum, using the array\'s start position and the size of each item.\n\n' +
        'It then jumps straight there, with no searching. The step count is the same whether the array has 10 items or 10 million. Work that does not grow with $n$ is written $O(1)$.',
      conclusion: 'Reading a known index takes the same work at any size, so the answer is $O(1)$.',
      whyWrong: [
        'This is the cost of searching for a **value**. Reading a known index needs no search.',
        null,
        'This is the cost of binary search, which looks for a value in a sorted list.',
        'This would need nested loops. Reading one item needs no loop at all.',
      ],
      keyIdea: 'Ask whether the work grows with $n$. Reading a known index never does, so it is $O(1)$. Searching for a value without knowing where it is does, so that is $O(n)$.',
    },
  },
  {
    id: 'complexity-023',
    subtopic: 'complexity',
    difficulty: 'foundation',
    stem: 'What is the worst-case time complexity of bubble sort on $n$ items?',
    options: ['$O(n)$', '$O(\\log n)$', '$O(n\\log n)$', '$O(n^2)$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How does bubble sort\'s work grow when the list is in the worst order?',
      solution:
        'Bubble sort compares neighbouring pairs in passes. Its worst case is a list in reverse order, which needs the most passes.\n\n' +
        'Count the comparisons. For $n$ items, pass 1 makes $n - 1$, pass 2 makes $n - 2$, and so on down to 1. With 5 items that is $4 + 3 + 2 + 1 = 10$.\n\n' +
        'In general the sum is $\\frac{n(n - 1)}{2}$ (with 5 items, $\\frac{5 \\times 4}{2} = 10$), which is about $\\frac{n^2}{2}$ comparisons.\n\n' +
        'Big-O drops the fixed $\\frac{1}{2}$ and keeps the $n^2$, which gives $O(n^2)$.',
      conclusion: 'A reversed list needs about $\\frac{n^2}{2}$ comparisons, so the answer is $O(n^2)$.',
      whyWrong: [
        'This is the **best** case with an early-exit check, on a list that is already sorted.',
        'Sorting has to look at every item at least once, so it cannot be faster than $O(n)$.',
        'This is the cost of merge sort, which splits the list in half.',
        null,
      ],
      keyIdea: 'When passes shrink by one each time, add them up: $(n - 1) + \\dots + 1 = \\frac{n(n - 1)}{2}$. That still grows like $n^2$. Bubble, insertion and selection sort all have this worst case.',
    },
  },
  {
    id: 'complexity-024',
    subtopic: 'complexity',
    difficulty: 'foundation',
    stem: 'What is the time complexity of two nested loops that each run $n$ times, with constant work inside?',
    options: ['$O(n)$', '$O(n^2)$', '$O(2n)$', '$O(\\log n)$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many times does the inside of two nested $n$-sized loops run?',
      solution:
        'The inner loop runs all the way through every time the outer loop takes one pass. So the counts multiply.\n\n' +
        'Try $n = 3$. Outer pass 1 has 3 inner runs, and so do passes 2 and 3. That is $3 + 3 + 3 = 9$ runs, which is $3 \\times 3$.\n\n' +
        'With $n$ in place of 3, there are $n$ outer passes with $n$ inner runs each. That is $n \\times n = n^2$ runs, which is written $O(n^2)$.',
      conclusion: '$n$ passes of $n$ runs make $n^2$ runs, so the answer is $O(n^2)$.',
      whyWrong: [
        'This is the cost of a single loop. Here the inner loop repeats on every outer pass.',
        null,
        'This adds the two loops, which is right only when one follows the other. Nested loops multiply.',
        'A logarithmic loop halves or doubles its counter. These loops each run $n$ times.',
      ],
      keyIdea: 'Loops one inside the other multiply, and loops one after the other add. So a loop of $n$ inside a loop of $n$ is $O(n^2)$, while two loops of $n$ in a row are $O(n)$.',
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'complexity-006',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'How many times is the line `count = count + 1` executed?',
    code: {
      lang: 'pseudocode',
      source: L('n = 20', 'count = 0', 'for i = 1 to n', '   for j = i to n', '      count = count + 1', '   end for', 'end for', 'print(count)'),
    },
    options: ['400', '190', '210', '20'],
    correctIndex: 2,
    markScheme: {
      asking: 'How many times in total does line 5 run?',
      solution:
        'The inner loop on line 4 starts at `j = i`, so its length depends on `i`. Both ends of a `for` loop are included.\n\n' +
        'Count the runs of line 5 for each value of `i`:\n\n| `i` | `j` goes | Runs of line 5 |\n|---|---|---|\n| 1 | 1 to 20 | 20 |\n| 2 | 2 to 20 | 19 |\n| 3 | 3 to 20 | 18 |\n| ... | ... | ... |\n| 20 | 20 to 20 | 1 |\n\n' +
        'So the total is $20 + 19 + 18 + \\dots + 1$.\n\n' +
        'Pair the numbers from the two ends: $20 + 1 = 21$, $19 + 2 = 21$, and so on. The 20 numbers make 10 such pairs.\n\n' +
        'So the total is $10 \\times 21 = 210$.',
      conclusion: 'The runs are $20 + 19 + \\dots + 1$, which adds up to 210.',
      whyWrong: [
        'This is $n^2 = 400$: it assumes the inner loop always runs $n$ times. It starts at $j = i$, so it gets shorter each time.',
        'This is $\\frac{20 \\times 19}{2}$, which is what you get if the inner loop started at $j = i + 1$. Starting at $j = i$ includes one extra run for every $i$.',
        null,
        'This counts only the outer loop. The counted line is inside the inner loop, which runs many times for each value of $i$.',
      ],
      keyIdea: 'An inner loop from `i` to `n` gives $n + (n - 1) + \\dots + 1 = \\frac{n(n + 1)}{2}$ runs. Starting from `i + 1` gives $\\frac{n(n - 1)}{2}$. Both grow like $n^2$, so both are $O(n^2)$.',
    },
    check: {
      optionValues: [400, 190, 210, 20],
      compute: () => {
        const n = 20;
        let count = 0;
        for (let i = 1; i <= n; i++) for (let j = i; j <= n; j++) count++;
        return count;
      },
    },
  },
  {
    id: 'complexity-007',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('n = 200', 'steps = 0', 'while (n > 1)', '   n = div(n,2) // div is integer division', '   steps = steps + 1', 'end while', 'print(steps)'),
    },
    options: ['8', '7', '199', 'Infinite loop'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many times can 200 be halved, rounding down, before it reaches 1?',
      solution:
        '`div(n,2)` divides by 2 and drops any remainder, so `div(25,2)` is 12. Line 5 adds 1 to `steps` on each pass, so `steps` counts the passes.\n\n' +
        'The loop on line 3 runs while `n > 1`. Here is each pass up to the last:\n\n| Pass | `n` at the start | `n` after line 4 | `steps` |\n|---|---|---|---|\n| 1 | 200 | 100 | 1 |\n| 2 | 100 | 50 | 2 |\n| 3 | 50 | 25 | 3 |\n| 4 | 25 | 12 | 4 |\n| 5 | 12 | 6 | 5 |\n| 6 | 6 | 3 | 6 |\n\n' +
        'Now `n` is 3, so the test is still true. Line 4 sets `n` to `div(3,2)`, which is 1, and `steps` becomes 7. Now $1 > 1$ is false, so the loop stops and line 7 prints 7.',
      conclusion: 'Halving 200 and rounding down reaches 1 after 7 passes, so the answer is 7.',
      whyWrong: [
        'This rounds $\\log_2 200 \\approx 7.6$ **up** to 8. Integer division rounds down at each step, and the loop stops as soon as `n` reaches 1, after 7 passes.',
        null,
        'This assumes `n` goes down by 1 each pass, as in `n = n - 1`. Halving shrinks `n` much faster.',
        '`n` is halved on every pass, so it reaches 1 and the test `n > 1` fails.',
      ],
      keyIdea: 'A loop that halves runs about $\\log_2 n$ times, so it is $O(\\log n)$. For the exact count, find the largest power of 2 up to $n$: $2^7 = 128$ gives 7 here.',
    },
    check: {
      optionValues: [8, 7, 199, 'Infinite loop'],
      compute: () => {
        let n = 200;
        let steps = 0;
        while (n > 1) {
          if (steps > 1000) return 'Infinite loop';
          n = Math.floor(n / 2);
          steps++;
        }
        return steps;
      },
    },
  },
  {
    id: 'complexity-008',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'What is the time complexity of `stats`, where $n$ is the length of `A`? Arrays are indexed from 1.',
    code: {
      lang: 'pseudocode',
      source: L(
        'function stats(A)',
        '   total = 0',
        '   for i = 1 to length(A)',
        '      total = total + A[i]',
        '   end for',
        '   biggest = A[1]',
        '   for i = 1 to length(A)',
        '      if A[i] > biggest',
        '         biggest = A[i]',
        '      end if',
        '   end for',
        '   return total + biggest',
        'end function',
      ),
    },
    options: ['$O(n^2)$', '$O(1)$', '$O(\\log n)$', '$O(n)$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How does the work in `stats` grow with the length of `A`?',
      solution:
        'Count how many times each part runs when `A` has $n$ items:\n\n| Lines | What they do | Runs |\n|---|---|---|\n| 2 | set `total` | 1 |\n| 3 to 5 | first loop | $n$ |\n| 6 | set `biggest` | 1 |\n| 7 to 11 | second loop | $n$ |\n| 12 | return | 1 |\n\n' +
        'The two loops come one after the other, and neither is inside the other. So their counts add, and the total is $n + n + 3 = 2n + 3$ steps.\n\n' +
        'Big-O keeps the fastest-growing term and drops the number in front of it. So $2n + 3$ becomes $O(n)$.',
      conclusion: 'Two separate loops add up to about $2n$ steps, which grows in step with $n$, so the answer is $O(n)$.',
      whyWrong: [
        'This multiplies the two loops. Loops only multiply when one is **inside** the other. These loops run one after the other, so their costs add: $n + n = 2n$, which is $O(n)$.',
        'This assumes the function is constant time because it only returns one number. It still has to visit all $n$ items (twice) to compute it.',
        '$O(\\log n)$ needs the remaining work to be halved each step. Here every item is visited, so the work grows in proportion to $n$.',
        null,
      ],
      keyIdea: 'Look at how the loops are arranged. One after the other, their counts add, so it stays $O(n)$. One inside the other, their counts multiply, which gives $O(n^2)$.',
    },
  },
  {
    id: 'complexity-009',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'What is the average time to check whether a value is present in an unsorted array of $n$ items, and in a hash table of $n$ items?',
    options: [
      'Array: $O(1)$; hash table: $O(1)$',
      'Array: $O(n)$; hash table: $O(n)$',
      'Array: $O(n)$; hash table: $O(1)$',
      'Array: $O(\\log n)$; hash table: $O(1)$',
    ],
    correctIndex: 2,
    markScheme: {
      asking: 'How much checking does it take to see if a value is present in each structure?',
      solution:
        '**Unsorted array.** You do not know where the value is, so you check items one by one. On average that is about half of them, $\\frac{n}{2}$ checks. Big-O drops the fixed $\\frac{1}{2}$, leaving $O(n)$.\n\n' +
        '**Hash table.** A function turns the value into a slot number, and you jump straight to that slot. On average this takes the same small number of steps however many items are stored, which is $O(1)$.',
      conclusion: 'One has to scan and the other can jump, so the answer is Array: $O(n)$; hash table: $O(1)$.',
      whyWrong: [
        'Reading an array by position is $O(1)$, but searching for a **value** is not: the items have to be checked one by one.',
        'This treats a hash table like an array. Hashing jumps straight to where the item would be, so it does not scan.',
        null,
        '$O(\\log n)$ would need binary search, which requires sorted data. This array is unsorted, so it needs a plain linear scan.',
      ],
      keyIdea: 'Ask how the structure finds an item. Scanning one by one is $O(n)$. Halving a sorted list is $O(\\log n)$. Hashing straight to a slot is $O(1)$ on average.',
    },
  },
  {
    id: 'complexity-011',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'A sort whose running time is proportional to $n^2$ takes 4 seconds for $n = 1000$. Roughly how long does it take for $n = 3000$?',
    options: ['12 seconds', '36 seconds', '108 seconds', '16 seconds'],
    correctIndex: 1,
    markScheme: {
      asking: 'If the input is 3 times bigger, how long will this $n^2$ sort take?',
      solution:
        'Time proportional to $n^2$ means the steps are about $n \\times n$, and the time follows the number of steps.\n\n' +
        'Find how many times bigger $n$ gets: $\\frac{3000}{1000} = 3$.\n\n' +
        'Both $n$s in $n \\times n$ get 3 times bigger, so the steps are multiplied by $3 \\times 3 = 9$.\n\n' +
        'The time grows by the same factor: $4 \\times 9 = 36$ seconds.',
      conclusion: 'Tripling $n$ multiplies the work by 9, so 4 seconds becomes 36 seconds.',
      whyWrong: [
        'This multiplies the time by 3, which would be right for an $O(n)$ algorithm. For $O(n^2)$ tripling $n$ multiplies the time by $3^2 = 9$.',
        null,
        'This multiplies the time by $3^3 = 27$, which would be right for an $O(n^3)$ algorithm.',
        'This squares the **time** ($4^2 = 16$) instead of squaring the scale factor of $n$. The square applies to how much bigger $n$ got, which is 3.',
      ],
      keyIdea: 'For time proportional to $n^p$, find $k$, the new size divided by the old size. Then multiply the old time by $k^p$. So $O(n)$ multiplies by $k$, and $O(n^2)$ by $k^2$.',
    },
    check: {
      optionValues: [12, 36, 108, 16],
      compute: () => {
        const t0 = 4;
        const n0 = 1000;
        const n1 = 3000;
        return (t0 * n1 ** 2) / n0 ** 2;
      },
    },
  },
  {
    id: 'complexity-012',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'What is the time complexity of `f` in terms of $n$?',
    code: {
      lang: 'pseudocode',
      source: L(
        'function f(n)',
        '   count = 0',
        '   for i = 1 to n',
        '      j = n',
        '      while (j > 1)',
        '         j = div(j,2) // div is integer division',
        '         count = count + 1',
        '      end while',
        '   end for',
        '   return count',
        'end function',
      ),
    },
    options: ['$O(n^2)$', '$O(\\log n)$', '$O(n\\log n)$', '$O(n)$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How does the number of times `count` goes up grow with $n$?',
      solution:
        'The outer loop on line 3 takes one pass for each `i` from 1 to `n`, which is $n$ passes.\n\n' +
        'Line 4 sets `j` back to `n` on every pass, so the inner `while` loop does the same work each time.\n\n' +
        'The inner loop halves `j` until it reaches 1. For $n = 16$ that goes $16 \\to 8 \\to 4 \\to 2 \\to 1$, which is 4 passes. The number of halvings is called $\\log_2 n$, and here $2^4 = 16$.\n\n' +
        'One loop is inside the other, so the counts multiply: line 7 runs $n \\times \\log_2 n$ times. For $n = 16$ that is $16 \\times 4 = 64$ times. Big-O writes this growth as $O(n\\log n)$.',
      conclusion: '$n$ outer passes with about $\\log_2 n$ inner passes each give the answer $O(n\\log n)$.',
      whyWrong: [
        'This assumes the inner loop runs $n$ times. It halves `j` each pass, so it runs only about $\\log_2 n$ times.',
        'This is the cost of the inner loop alone. It forgets that the outer loop repeats it $n$ times.',
        null,
        'This treats the inner loop as constant time. Its number of passes grows (slowly) with $n$: about $\\log_2 n$ passes.',
      ],
      keyIdea: 'Find each loop\'s growth separately. Adding 1 each pass gives $n$ passes, and halving gives $\\log_2 n$ passes. Then multiply if one loop is inside the other, and add if they are one after the other.',
    },
  },
  {
    id: 'complexity-014',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'In the **worst case**, how many items does binary search inspect in a sorted list of 1,000,000 items?',
    options: ['$1\\,000\\,000$', '$20$', '$500\\,000$', '$1000$'],
    correctIndex: 1,
    markScheme: {
      asking: 'About how many checks does binary search need at most for a million items?',
      solution:
        'Binary search checks the middle, then keeps only half. So the number of checks is about the number of halvings.\n\n' +
        'Use a handy fact: $2^{10} = 1024$, which is about 1000. So 10 halvings shrink a list about 1000 times.\n\n' +
        '10 halvings take 1,000,000 down to about 1000. Another 10 halvings take 1000 down to about 1.\n\n' +
        'That makes $10 + 10 = 20$ halvings. As a test, $2^{20} = 1\\,048\\,576$, which is just above a million.',
      conclusion: 'A million items need about 20 halvings, so the answer is $20$.',
      whyWrong: [
        'This is the worst case for **linear** search, which checks every item. Binary search halves the list each time.',
        null,
        'This is the average number of checks for linear search ($\\frac{n}{2}$), not binary search.',
        'This is $\\sqrt{1\\,000\\,000}$. Binary search is logarithmic, not square-root: the number of steps is about $\\log_2 n$.',
      ],
      keyIdea: 'Use $2^{10} \\approx 1000$, so each factor of 1000 costs about 10 comparisons. A thousand items take about 10, a million about 20 and a billion about 30.',
    },
    check: {
      optionValues: [1000000, 20, 500000, 1000],
      compute: () => binaryWorst(1000000),
    },
  },
  {
    id: 'complexity-018',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'Algorithm A takes $20n + 500$ steps and algorithm B takes $n^2$ steps on an input of size $n$. What is the **smallest** whole number $n$ for which A takes **fewer** steps than B?',
    options: ['$21$', '$34$', '$35$', '$23$'],
    correctIndex: 2,
    markScheme: {
      asking: 'From what size $n$ does $20n + 500$ become smaller than $n^2$?',
      solution:
        'We want the first $n$ where $20n + 500 < n^2$. For small $n$ the extra 500 keeps A bigger. For large $n$ the $n^2$ pulls ahead, so there is one crossing point to find.\n\n' +
        'Try round values to trap the crossing:\n\n| $n$ | A: $20n + 500$ | B: $n^2$ | A fewer? |\n|---|---|---|---|\n| 30 | 1100 | 900 | no |\n| 40 | 1300 | 1600 | yes |\n\n' +
        'So the crossing is between 30 and 40. Testing upwards, the first change comes here:\n\n| $n$ | A: $20n + 500$ | B: $n^2$ | A fewer? |\n|---|---|---|---|\n| 34 | 1180 | 1156 | no |\n| 35 | 1200 | 1225 | yes |',
      conclusion: 'At $n = 34$ A still takes more steps, and at the next whole number it takes fewer, so the answer is $35$.',
      whyWrong: [
        'This ignores the $+ 500$ and solves $20n < n^2$, giving $n > 20$. The 500 extra steps keep A slower for longer.',
        'At $n = 34$ A takes 1180 steps and B takes 1156, so A is not yet faster. A only takes fewer from the next whole number.',
        null,
        'This ignores the $20n$ term and solves $500 < n^2$, giving $n > \\sqrt{500} \\approx 22.4$. Both terms of A must be included.',
      ],
      keyIdea: 'To find where one formula beats another, try round values to trap the crossing between two numbers, then test whole numbers near it. Test both sides, because the answer must be a whole number.',
    },
    check: {
      optionValues: [21, 34, 35, 23],
      compute: () => {
        let n = 1;
        while (!(20 * n + 500 < n * n)) n++;
        return n;
      },
    },
  },
  {
    id: 'complexity-019',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'function countOps(n)',
        '   ops = 0',
        '   i = n',
        '   while (i > 0)',
        '      for j = 1 to n',
        '         ops = ops + 1',
        '      end for',
        '      i = div(i,2) // div is integer division',
        '   end while',
        '   return ops',
        'end function',
        '',
        'print(countOps(16))',
      ),
    },
    options: ['64', '80', '256', '31'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many times does `ops` go up when `n` is 16?',
      solution:
        '`div(i,2)` divides by 2 and drops any remainder, so `div(5,2)` is 2 and `div(1,2)` is 0.\n\n' +
        'The inner loop `for j = 1 to n` uses `n`, not `i`. So it always makes 16 runs, whatever `i` is.\n\n' +
        'The outer loop runs while `i > 0`, and line 8 halves `i` at the end of each pass:\n\n| Pass | `i` at the start | Runs of line 6 | `ops` after |\n|---|---|---|---|\n| 1 | 16 | 16 | 16 |\n| 2 | 8 | 16 | 32 |\n| 3 | 4 | 16 | 48 |\n| 4 | 2 | 16 | 64 |\n\n' +
        'Now `i` is 1, and $1 > 0$ is true, so there is one more pass: `ops` becomes $64 + 16 = 80$. Then `i` becomes `div(1,2)`, which is 0, so the loop stops. The function returns 80, and line 13 prints it.',
      conclusion: 'There are 5 outer passes of 16 runs each, and $5 \\times 16 = 80$, so the answer is 80.',
      whyWrong: [
        'This stops the outer loop when `i` reaches 1, as if the condition were `i > 1`. The condition is `i > 0`, so the pass with `i = 1` also runs, adding another 16.',
        null,
        'This is $16^2$: it assumes the outer loop also runs 16 times. The outer loop halves `i`, so it runs only 5 times.',
        'This is $16 + 8 + 4 + 2 + 1$, what you get if the inner loop ran from 1 to `i`. It runs from 1 to `n`, so it always runs 16 times.',
      ],
      keyIdea: 'For a halving loop around another loop, list the values of `i` to count the outer passes, then multiply by the inner runs. See whether the inner loop uses the fixed `n` or the shrinking `i`.',
    },
    check: {
      optionValues: [64, 80, 256, 31],
      compute: () => {
        const n = 16;
        let ops = 0;
        for (let i = n; i > 0; i = Math.floor(i / 2)) for (let j = 1; j <= n; j++) ops++;
        return ops;
      },
    },
  },
  {
    id: 'complexity-020',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'Finding a pair that sums to a target: method 1 checks every pair; method 2 makes one pass using a hash table with $O(1)$ lookups. What are their worst-case complexities?',
    options: [
      'Method 1: $O(n^2)$; method 2: $O(n)$',
      'Method 1: $O(n^2)$; method 2: $O(n^2)$',
      'Method 1: $O(n\\log n)$; method 2: $O(n)$',
      'Method 1: $O(n^2)$; method 2: $O(1)$',
    ],
    correctIndex: 0,
    markScheme: {
      asking: 'How do the two methods\' step counts grow as the list gets longer?',
      solution:
        '**Method 1** compares each item with every later item. For $n$ items that is $(n - 1) + (n - 2) + \\dots + 1$ pairs. With 5 items it is $4 + 3 + 2 + 1 = 10$ pairs.\n\n' +
        'That sum is $\\frac{n(n - 1)}{2}$ (with 5 items, $\\frac{5 \\times 4}{2} = 10$), which is about $\\frac{n^2}{2}$ pairs. Big-O drops the fixed $\\frac{1}{2}$, leaving $O(n^2)$.\n\n' +
        '**Method 2** goes through the items once. For each item $x$, it asks the hash table whether target $- x$ has already been seen, because that value would complete the pair.\n\n' +
        'One hash table lookup is $O(1)$, a fixed amount of work. So $n$ items cost $n$ lots of fixed work, which is $O(n)$.',
      conclusion: 'Checking every pair grows like $n^2$ and one pass with lookups grows like $n$, so the answer is Method 1: $O(n^2)$; method 2: $O(n)$.',
      whyWrong: [
        null,
        'This treats each lookup as a linear scan, which would be true for an array. A hash table lookup is $O(1)$ on average, so method 2 is $O(n)$.',
        'The number of pairs to check shrinks by one each time, but the total is still $\\frac{n(n-1)}{2}$, which is $O(n^2)$. Shrinking by one each time is not the same as halving.',
        'Each lookup is $O(1)$, but method 2 still loops over all $n$ items in the worst case, so the total is $O(n)$, not $O(1)$.',
      ],
      keyIdea: 'Count how many times the main action runs, then multiply by the cost of one action. Every pair means about $\\frac{n^2}{2}$ actions. One pass means $n$ actions, each costing $O(1)$ with a hash table.',
    },
  },
  {
    id: 'complexity-025',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'What is the time complexity of `g` in terms of $n$?',
    code: {
      lang: 'pseudocode',
      source: L('function g(n)', '   i = 1', '   while (i < n)', '      i = i * 2', '   end while', '   return i', 'end function'),
    },
    options: ['$O(1)$', '$O(n)$', '$O(\\log n)$', '$O(n^2)$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How does the number of loop passes grow with $n$?',
      solution:
        'Line 4 doubles `i` on each pass, and the loop on line 3 stops once `i` reaches `n`. So count the doublings.\n\n' +
        'Try some sizes:\n\n| $n$ | Values of `i` | Passes |\n|---|---|---|\n| 16 | 1, 2, 4, 8, 16 | 4 |\n| 32 | 1, 2, 4, 8, 16, 32 | 5 |\n| 64 | 1, 2, 4, 8, 16, 32, 64 | 6 |\n\n' +
        'Doubling $n$ only adds 1 pass. The number of doublings from 1 to $n$ is called $\\log_2 n$, and this growth is written $O(\\log n)$.',
      conclusion: 'The passes equal the number of doublings needed to reach $n$, so the answer is $O(\\log n)$.',
      whyWrong: [
        'The number of passes grows with $n$, although slowly, so the time is not constant.',
        'This assumes `i` goes up by 1 on each pass. Doubling reaches $n$ much faster.',
        null,
        'This would need a loop nested inside another loop, or a counter that takes $n^2$ steps. There is one doubling loop here.',
      ],
      keyIdea: 'Look at the line that changes the loop variable. Multiplying or dividing by a fixed number gives $O(\\log n)$. Adding or subtracting a fixed number gives $O(n)$.',
    },
  },
  {
    id: 'complexity-026',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'How many times in total is `count` increased?',
    code: {
      lang: 'pseudocode',
      source: L(
        'count = 0',
        'for i = 1 to 4',
        '   for j = 1 to 5',
        '      count = count + 1',
        '   end for',
        'end for',
        'for k = 1 to 6',
        '   count = count + 1',
        'end for',
        'print(count)',
      ),
    },
    options: ['26', '120', '15', '20'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many times does `count` go up across all three loops?',
      solution:
        'Line 4 sits inside two loops. The `j` loop is inside the `i` loop, so it runs all the way through on each pass.\n\n' +
        '`for i = 1 to 4` makes 4 passes, and `for j = 1 to 5` makes 5 runs on each one. So line 4 runs $4 \\times 5 = 20$ times.\n\n' +
        'The `k` loop on line 7 starts after the others have ended, so it is not inside them. Line 8 runs 6 times.\n\n' +
        'Loops one after the other add: $20 + 6 = 26$.',
      conclusion: 'The nested part gives 20 and the separate loop gives 6, so the answer is 26.',
      whyWrong: [
        null,
        'This multiplies all three loops, $4 \\times 5 \\times 6$. The third loop is not inside the others.',
        'This adds all three loops, $4 + 5 + 6$. The first two are nested, so they multiply.',
        'This counts only the nested loops and misses the 6 passes of the third loop.',
      ],
      keyIdea: 'Use the indentation. A loop inside another multiplies, and a loop after another adds. Work out each separate block first, then add the blocks together.',
    },
    check: {
      optionValues: [26, 120, 15, 20],
      compute: () => {
        let c = 0;
        for (let i = 1; i <= 4; i++) for (let j = 1; j <= 5; j++) c++;
        for (let k = 1; k <= 6; k++) c++;
        return c;
      },
    },
  },
  {
    id: 'complexity-027',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'Which list orders these growth rates from slowest to fastest for large $n$?',
    options: [
      '$\\log n,\\ n,\\ n\\log n,\\ n^2$',
      '$n,\\ \\log n,\\ n\\log n,\\ n^2$',
      '$\\log n,\\ n\\log n,\\ n,\\ n^2$',
      '$\\log n,\\ n,\\ n^2,\\ n\\log n$',
    ],
    correctIndex: 0,
    markScheme: {
      asking: 'Put these four growth rates in order, slowest-growing first.',
      solution:
        'To compare growth rates, try one large value of $n$. Take $\\log n$ as $\\log_2 n$, which asks how many 2s multiply together to make $n$. Choose $n = 1024$, because $2^{10} = 1024$, so $\\log_2 1024 = 10$.\n\n' +
        'Work out each one at $n = 1024$:\n\n| Growth rate | Working | Value |\n|---|---|---|\n| $\\log n$ | $\\log_2 1024$ | $10$ |\n| $n$ | | $1024$ |\n| $n\\log n$ | $1024 \\times 10$ | $10\\,240$ |\n| $n^2$ | $1024 \\times 1024$ | $1\\,048\\,576$ |',
      conclusion: 'Reading the values from smallest to largest gives $\\log n,\\ n,\\ n\\log n,\\ n^2$.',
      whyWrong: [
        null,
        'This puts $n$ below $\\log n$. A logarithm grows far more slowly than $n$.',
        'This puts $n\\log n$ below $n$. Multiplying $n$ by $\\log n$ makes it bigger once $\\log n > 1$.',
        'This puts $n^2$ below $n\\log n$. Since $n$ is much bigger than $\\log n$, $n \\times n$ is bigger than $n \\times \\log n$.',
      ],
      keyIdea: 'Test with $n = 1024$, where $\\log_2 n = 10$. To place $n\\log n$, compare it as a product: $n \\times \\log n$ beats $n$ but loses to $n \\times n$, since $\\log n$ is far smaller than $n$.',
    },
    check: {
      optionValues: ['a', 'b', 'c', 'd'],
      compute: () => {
        const n = 2 ** 20;
        const value: Record<string, number> = { log: log2(n), lin: n, nlog: n * log2(n), sq: n * n };
        const orders: Record<string, string[]> = {
          a: ['log', 'lin', 'nlog', 'sq'],
          b: ['lin', 'log', 'nlog', 'sq'],
          c: ['log', 'nlog', 'lin', 'sq'],
          d: ['log', 'lin', 'sq', 'nlog'],
        };
        const ok = Object.keys(orders).filter((k) => orders[k].every((t, i, a) => i === 0 || value[a[i - 1]] < value[t]));
        return ok.length === 1 ? ok[0] : 'none or several';
      },
    },
  },
];
