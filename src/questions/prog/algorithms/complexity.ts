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
      solution:
        'This is **linear search**.\n\n' +
        '- In the worst case the target is the **last** item, or not in the list at all.\n' +
        '- Then the program has to look at every one of the $n$ items: $n$ comparisons.\n' +
        '- The number of steps grows in direct proportion to $n$ (double the list, double the work).\n\n' +
        'So the worst-case time complexity is $O(n)$.',
      whyWrong: [
        '$O(1)$ is the **best** case (the target happens to be first). The question asks for the worst case.',
        '$O(\\log n)$ is binary search, which halves the list each step. That only works on a **sorted** list; this list is unsorted and is checked item by item.',
        null,
        '$O(n^2)$ would need a loop inside a loop (comparing every item with every other item). Linear search makes a single pass, so the work is proportional to $n$, not $n^2$.',
      ],
      keyIdea: 'Linear search may have to check every item, so its worst case is $O(n)$.',
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
      solution:
        'Two rules turn a step count into Big-O:\n\n' +
        '1. Keep only the **fastest-growing term**. Of $3n^2$, $5n$ and $7$, the term $3n^2$ grows fastest: for $n = 1000$ it is $3\\,000\\,000$, while $5n = 5000$ and $7$ stays $7$.\n' +
        '2. **Drop the constant multiplier**: $3n^2 \\to n^2$.\n\n' +
        'So $T(n) = O(n^2)$, which is also read as "of the order of $n^2$".',
      whyWrong: [
        'This keeps the $5n$ term. For large $n$ the $n^2$ term is far bigger than $5n$, so $n^2$ is the dominant term.',
        null,
        'This treats the running time as fixed because the expression contains fixed numbers. Big-O describes how $T(n)$ grows as $n$ grows, and $3n^2$ grows without limit.',
        'This adds the powers of the terms ($2 + 1 = 3$). In Big-O you keep the **largest** power, you do not add the powers together.',
      ],
      keyIdea: 'For Big-O, keep the dominant (fastest-growing) term and drop its constant coefficient.',
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
      solution:
        'Compare the functions at a large value, say $n = 1000$:\n\n' +
        '| Function | Value at $n = 1000$ |\n' +
        '| --- | --- |\n' +
        '| $100n$ | $100\\,000$ |\n' +
        '| $n\\log_2 n$ | about $9966$ |\n' +
        '| $n^2$ | $1\\,000\\,000$ |\n' +
        '| $2^n$ | about $1.07 \\times 10^{301}$ |\n\n' +
        'The exponential $2^n$ **doubles** every time $n$ goes up by 1, so it overtakes every polynomial. The growth ladder is $n\\log n < n^2 < 2^n$, and $100n$ is just $O(n)$.\n\n' +
        'So $2^n$ grows fastest.',
      whyWrong: [
        'The big coefficient 100 makes $100n$ larger for small $n$, but coefficients do not change the growth rate: $100n$ is still linear, $O(n)$.',
        '$n^2$ is a polynomial. Any exponential like $2^n$ eventually beats every polynomial (already at $n = 5$, $2^5 = 32 > 25$, and the gap explodes after that).',
        '$n\\log_2 n$ grows only slightly faster than $n$; it is much slower than $n^2$ and $2^n$.',
        null,
      ],
      keyIdea: 'Exponential growth ($2^n$) beats any polynomial, which beats $n\\log n$, which beats linear.',
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
      solution:
        'Binary search looks at the **middle** item. If that is not the target, it throws away the half that cannot contain the target.\n\n' +
        '- After 1 step about $\\frac{n}{2}$ items remain, after 2 steps $\\frac{n}{4}$, after $k$ steps $\\frac{n}{2^k}$.\n' +
        '- It stops when about 1 item is left: $\\frac{n}{2^k} = 1$, so $2^k = n$, so $k = \\log_2 n$.\n\n' +
        'The number of steps is about $\\log_2 n$, so binary search is $O(\\log n)$.',
      whyWrong: [
        null,
        '$O(1)$ is only the best case (the middle item happens to be the target). In the worst case the search keeps halving until one item is left.',
        '$O(n)$ is linear search, which checks items one by one. Binary search discards half of the remaining items every step, which is much faster.',
        '$O(n\\log n)$ is the cost of a good **sort** such as merge sort, not of searching an already sorted list.',
      ],
      keyIdea: 'Halving the search space each step gives about $\\log_2 n$ steps: $O(\\log n)$.',
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
      solution:
        'Worst-case complexities of the standard sorts:\n\n' +
        '| Algorithm | Worst case | Why |\n' +
        '| --- | --- | --- |\n' +
        '| Bubble sort | $O(n^2)$ | up to $n - 1$ passes, each comparing up to $n - 1$ neighbouring pairs |\n' +
        '| Insertion sort | $O(n^2)$ | a reversed list makes every item shift past all earlier items |\n' +
        '| Selection sort | $O(n^2)$ | always scans the whole unsorted part to find the minimum |\n' +
        '| Merge sort | $O(n\\log n)$ | about $\\log_2 n$ levels of halving, and $O(n)$ merging work per level |\n\n' +
        'Only merge sort is $O(n\\log n)$ in the worst case.',
      whyWrong: [
        'Bubble sort uses nested passes over the list, so its worst case (a reversed list) is $O(n^2)$. Its best case can be $O(n)$ with an early-exit check, but that is the best case, not the worst.',
        'Insertion sort is $O(n)$ on an already sorted list, but on a reversed list each item moves past all earlier ones, giving $O(n^2)$.',
        null,
        'Selection sort always scans the whole unsorted part to find the smallest item, so it is $O(n^2)$ in every case.',
      ],
      keyIdea: 'Merge sort splits the list in half repeatedly ($\\log_2 n$ levels) and does $O(n)$ merging per level: $O(n\\log n)$.',
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
      solution:
        'A **hash table** (also called a key-value map or dictionary) turns the key into a number that points straight to where the value is stored, so a lookup takes $O(1)$ time on average, however many items there are.\n\n' +
        'The other structures have to look through their items, which takes $O(n)$ time.',
      whyWrong: [
        'This works, but each lookup is a linear search through the pairs: $O(n)$.',
        null,
        'A stack only gives access to its top item, so finding a key means removing items one by one.',
        'A queue only gives access to its front item, so finding a key means removing items one by one.',
      ],
      keyIdea: 'To look up a value by its key, use a hash table: $O(1)$ on average.',
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
      solution:
        'An array stores its items in one block of memory, in order, and remembers its length.\n\n' +
        '- Reading index $i$ jumps straight to that position: $O(1)$.\n' +
        '- The length is stored, so reading it is one step: $O(1)$.\n' +
        '- Adding at the end moves nothing: $O(1)$.\n' +
        '- Inserting at the **front** forces all $n$ items to shift one place to the right first: $O(n)$.',
      whyWrong: [
        'Indexing jumps straight to a position in memory, so it does not walk through the array.',
        'The length is stored as one number, so reading it does not count the items.',
        'Adding at the end moves nothing, because the free slot is already there.',
        null,
      ],
      keyIdea: 'Changing the front of an array shifts every item ($O(n)$); working at the end or indexing is $O(1)$.',
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
      solution: 'Big-O describes how the amount of work grows as the input size $n$ grows. It ignores constant factors and fixed details such as the speed of the computer.',
      whyWrong: [
        'Exact seconds depend on the computer. Big-O only describes the shape of the growth.',
        null,
        'A short program can do a huge amount of work, so the number of lines tells you little about growth.',
        'Big-O does not depend on the machine, since it ignores constant factors.',
      ],
      keyIdea: 'Big-O describes how work grows with input size, ignoring constants.',
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
      solution: 'An array stores its items side by side in memory, so the position of `A[i]` can be calculated directly. That takes the same time whatever the size of the array: $O(1)$, called constant time.',
      whyWrong: [
        'This is the cost of searching for a **value**. Reading a known index needs no search.',
        null,
        'This is the cost of binary search, which looks for a value in a sorted list.',
        'This would need nested loops. Reading one item needs no loop at all.',
      ],
      keyIdea: 'Reading an array item by index is $O(1)$.',
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
      solution: 'Bubble sort makes up to $n - 1$ passes. They compare $n-1, n-2, \\dots, 1$ neighbouring pairs, so $\\frac{n(n-1)}{2} \\approx \\frac{n^2}{2}$ comparisons in total, which is $O(n^2)$.',
      whyWrong: [
        'This is the **best** case with an early-exit check, on a list that is already sorted.',
        'Sorting has to look at every item at least once, so it cannot be faster than $O(n)$.',
        'This is the cost of merge sort, which splits the list in half.',
        null,
      ],
      keyIdea: 'Bubble sort uses nested passes over the list, so its worst case is $O(n^2)$.',
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
      solution: 'The inner loop runs $n$ times for each of the $n$ passes of the outer loop. Nested loops multiply: $n \\times n = n^2$, so the complexity is $O(n^2)$.',
      whyWrong: [
        'This is the cost of a single loop. Here the inner loop repeats on every outer pass.',
        null,
        'This adds the two loops, which is right only when one follows the other. Nested loops multiply.',
        'A logarithmic loop halves or doubles its counter. These loops each run $n$ times.',
      ],
      keyIdea: 'Nested loops multiply; loops one after another add.',
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
      solution:
        'The inner loop runs from $j = i$ up to $j = n$, so it runs $n - i + 1$ times (both ends included).\n\n' +
        '| $i$ | inner loop runs |\n' +
        '| --- | --- |\n' +
        '| 1 | 20 |\n' +
        '| 2 | 19 |\n' +
        '| 3 | 18 |\n' +
        '| ... | ... |\n' +
        '| 20 | 1 |\n\n' +
        'Total $= 20 + 19 + \\dots + 1 = \\frac{20 \\times 21}{2} = 210$.\n\n' +
        'In general this is $\\frac{n(n+1)}{2}$, which is $O(n^2)$, but the exact count asked for is $210$.',
      whyWrong: [
        'This is $n^2 = 400$: it assumes the inner loop always runs $n$ times. It starts at $j = i$, so it gets shorter each time.',
        'This is $\\frac{20 \\times 19}{2}$, which is what you get if the inner loop started at $j = i + 1$. Starting at $j = i$ includes one extra run for every $i$.',
        null,
        'This counts only the outer loop. The counted line is inside the inner loop, which runs many times for each value of $i$.',
      ],
      keyIdea: 'A triangular nested loop runs $1 + 2 + \\dots + n = \\frac{n(n+1)}{2}$ times, which is still $O(n^2)$.',
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
      solution:
        '`div(n,2)` is integer division, so it rounds down. Trace the loop:\n\n' +
        '| pass | `n` after the pass | `steps` |\n' +
        '| --- | --- | --- |\n' +
        '| 1 | 100 | 1 |\n' +
        '| 2 | 50 | 2 |\n' +
        '| 3 | 25 | 3 |\n' +
        '| 4 | 12 | 4 |\n' +
        '| 5 | 6 | 5 |\n' +
        '| 6 | 3 | 6 |\n' +
        '| 7 | 1 | 7 |\n\n' +
        'Now `n > 1` is false ($1 > 1$ is false), so the loop stops and 7 is printed.\n\n' +
        'Check: $2^7 = 128 \\le 200 < 256 = 2^8$, so the number of halvings is $\\lfloor \\log_2 200 \\rfloor = 7$. A loop that halves is $O(\\log n)$.',
      whyWrong: [
        'This rounds $\\log_2 200 \\approx 7.6$ **up** to 8. Integer division rounds down at each step, and the loop stops as soon as `n` reaches 1, after 7 passes.',
        null,
        'This assumes `n` goes down by 1 each pass, as in `n = n - 1`. Halving shrinks `n` much faster.',
        '`n` is halved on every pass, so it reaches 1 and the test `n > 1` fails.',
      ],
      keyIdea: 'A loop that halves $n$ until it reaches 1 runs about $\\log_2 n$ times: $O(\\log n)$.',
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
      solution:
        'Count the work line by line:\n\n' +
        '- `total = 0`, `biggest = A[1]` and the `return`: a fixed number of steps, $O(1)$.\n' +
        '- The first `for` loop runs $n$ times with $O(1)$ work each time: $O(n)$.\n' +
        '- The second `for` loop is **after** the first one (not inside it): another $O(n)$.\n\n' +
        'Loops one after another **add**: $O(1) + O(n) + O(n) = O(2n + 1)$. Drop the constants: $O(n)$.',
      whyWrong: [
        'This multiplies the two loops. Loops only multiply when one is **inside** the other. These loops run one after the other, so their costs add: $n + n = 2n$, which is $O(n)$.',
        'This assumes the function is constant time because it only returns one number. It still has to visit all $n$ items (twice) to compute it.',
        '$O(\\log n)$ needs the remaining work to be halved each step. Here every item is visited, so the work grows in proportion to $n$.',
        null,
      ],
      keyIdea: 'Sequential loops add ($n + n = 2n$, so $O(n)$); only nested loops multiply.',
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
      solution:
        'Think about how each structure finds a value: does it have to look through the items one by one, or can it jump straight to the right place?\n\n' +
        '- **Unsorted array:** there is no shortcut, so the value is compared with the items one by one. On average that checks about half the array, and in the worst case all of it: $O(n)$.\n' +
        '- **Hash table:** the value is turned into a number (its **hash**) that points straight to where it would be stored, so only that place is checked: $O(1)$ on average, whatever the size.\n\n' +
        'So: array $O(n)$, hash table $O(1)$. This is why a hash table is the right choice when you need many fast "is this already there?" checks.',
      whyWrong: [
        'Reading an array by position is $O(1)$, but searching for a **value** is not: the items have to be checked one by one.',
        'This treats a hash table like an array. Hashing jumps straight to where the item would be, so it does not scan.',
        null,
        '$O(\\log n)$ would need binary search, which requires sorted data. This array is unsorted, so it needs a plain linear scan.',
      ],
      keyIdea: 'Membership tests are $O(n)$ for an unsorted array (linear scan) but $O(1)$ on average for a hash table.',
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
      solution:
        'If time is proportional to $n^2$, multiplying $n$ by $k$ multiplies the time by $k^2$.\n\n' +
        '1. Scale factor for $n$: $k = \\frac{3000}{1000} = 3$.\n' +
        '2. Scale factor for the time: $k^2 = 3^2 = 9$.\n' +
        '3. New time $= 4 \\times 9 = 36$ seconds.',
      whyWrong: [
        'This multiplies the time by 3, which would be right for an $O(n)$ algorithm. For $O(n^2)$ tripling $n$ multiplies the time by $3^2 = 9$.',
        null,
        'This multiplies the time by $3^3 = 27$, which would be right for an $O(n^3)$ algorithm.',
        'This squares the **time** ($4^2 = 16$) instead of squaring the scale factor of $n$. The square applies to how much bigger $n$ got, which is 3.',
      ],
      keyIdea: 'For $O(n^p)$, multiplying $n$ by $k$ multiplies the running time by $k^p$.',
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
      solution:
        'Work from the inside out.\n\n' +
        '1. **Inner loop:** `j` starts at $n$ and is halved each pass until it reaches 1, so it runs about $\\log_2 n$ times. That is $O(\\log n)$.\n' +
        '2. **Outer loop:** `for i = 1 to n` runs $n$ times, and each time the inner loop starts again from `j = n`.\n' +
        '3. Nested loops **multiply**: $n \\times \\log_2 n$.\n\n' +
        'So the complexity is $O(n\\log n)$. For example, with $n = 1024$ the inner loop runs 10 times, so `count` ends at $1024 \\times 10 = 10\\,240$, far fewer than $1024^2 \\approx 1$ million.',
      whyWrong: [
        'This assumes the inner loop runs $n$ times. It halves `j` each pass, so it runs only about $\\log_2 n$ times.',
        'This is the cost of the inner loop alone. It forgets that the outer loop repeats it $n$ times.',
        null,
        'This treats the inner loop as constant time. Its number of passes grows (slowly) with $n$: about $\\log_2 n$ passes.',
      ],
      keyIdea: 'A halving loop inside an $n$-times loop gives $n \\times \\log_2 n$ steps: $O(n\\log n)$.',
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
      solution:
        'Each inspection of the middle item removes at least half of the remaining items. Count the halvings:\n\n' +
        '$1\\,000\\,000 \\to 500\\,000 \\to 250\\,000 \\to 125\\,000 \\to 62\\,500 \\to 31\\,250 \\to 15\\,625 \\to 7812 \\to 3906 \\to 1953 \\to 976 \\to 488 \\to 244 \\to 122 \\to 61 \\to 30 \\to 15 \\to 7 \\to 3 \\to 1$\n\n' +
        'That is 19 halvings to get down to 1 item, plus 1 inspection of that last item: $20$.\n\n' +
        'Shortcut: the worst case is $\\lfloor \\log_2 n \\rfloor + 1$. Since $2^{19} = 524\\,288 \\le 1\\,000\\,000 < 1\\,048\\,576 = 2^{20}$, $\\lfloor \\log_2 1\\,000\\,000 \\rfloor = 19$, so the answer is $19 + 1 = 20$.',
      whyWrong: [
        'This is the worst case for **linear** search, which checks every item. Binary search halves the list each time.',
        null,
        'This is the average number of checks for linear search ($\\frac{n}{2}$), not binary search.',
        'This is $\\sqrt{1\\,000\\,000}$. Binary search is logarithmic, not square-root: the number of steps is about $\\log_2 n$.',
      ],
      keyIdea: 'Binary search needs at most $\\lfloor \\log_2 n \\rfloor + 1$ inspections: only about 20 for a million items.',
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
      solution:
        'We need $20n + 500 < n^2$, that is $n^2 - 20n - 500 > 0$.\n\n' +
        '1. Solve $n^2 - 20n - 500 = 0$ with the quadratic formula: $n = \\frac{20 + \\sqrt{400 + 2000}}{2} = \\frac{20 + \\sqrt{2400}}{2} \\approx \\frac{20 + 48.99}{2} \\approx 34.49$ (the other root is negative).\n' +
        '2. The inequality holds for $n > 34.49$, so the smallest whole number is $35$.\n' +
        '3. Check: at $n = 34$, A takes $20 \\times 34 + 500 = 1180$ and B takes $34^2 = 1156$, so B is still faster. At $n = 35$, A takes $1200$ and B takes $1225$, so A is faster.\n\n' +
        'Answer: $35$. (This is why Big-O matters: for large inputs the $O(n)$ algorithm wins, even though it is slower for small inputs.)',
      whyWrong: [
        'This ignores the $+ 500$ and solves $20n < n^2$, giving $n > 20$. The 500 extra steps keep A slower for longer.',
        'This rounds the root $34.49$ **down**. At $n = 34$ A takes 1180 steps and B takes 1156, so A is not yet faster.',
        null,
        'This ignores the $20n$ term and solves $500 < n^2$, giving $n > \\sqrt{500} \\approx 22.4$. Both terms of A must be included.',
      ],
      keyIdea: 'A lower-order algorithm can be slower for small $n$ but always wins beyond a crossover point; find it by solving the inequality and checking whole numbers.',
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
      solution:
        'The outer `while` loop halves `i` (rounding down) until it reaches 0. The inner `for` loop always runs from 1 to `n`, which is 16 times.\n\n' +
        '| `i` at start of pass | inner loop runs | `ops` after the pass |\n' +
        '| --- | --- | --- |\n' +
        '| 16 | 16 | 16 |\n' +
        '| 8 | 16 | 32 |\n' +
        '| 4 | 16 | 48 |\n' +
        '| 2 | 16 | 64 |\n' +
        '| 1 | 16 | 80 |\n\n' +
        'After the pass with `i = 1`, `div(i,2)` makes `i` equal to 0, and `0 > 0` is false, so the loop stops.\n\n' +
        'There are 5 outer passes ($\\lfloor \\log_2 16 \\rfloor + 1 = 5$), each doing 16 operations: $5 \\times 16 = 80$. In general this is about $n\\log_2 n$, so $O(n\\log n)$.\n\n' +
        'It prints 80.',
      whyWrong: [
        'This stops the outer loop when `i` reaches 1, as if the condition were `i > 1`. The condition is `i > 0`, so the pass with `i = 1` also runs, adding another 16.',
        null,
        'This is $16^2$: it assumes the outer loop also runs 16 times. The outer loop halves `i`, so it runs only 5 times.',
        'This is $16 + 8 + 4 + 2 + 1$, what you get if the inner loop ran from 1 to `i`. It runs from 1 to `n`, so it always runs 16 times.',
      ],
      keyIdea: 'Halving outer loop ($\\log_2 n + 1$ passes) times a full inner loop ($n$) gives about $n\\log_2 n$ operations.',
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
      solution:
        'The worst case is when no pair adds up to the target, so neither method stops early.\n\n' +
        '**Method 1:** the number of pairs checked is $(n - 1) + (n - 2) + \\dots + 2 + 1 = \\frac{n(n-1)}{2}$. That is about $\\frac{n^2}{2}$, so $O(n^2)$.\n\n' +
        '**Method 2:** one pass over the $n$ items, with an $O(1)$ lookup and an $O(1)$ insert for each. So the total is $n \\times O(1) = O(n)$.\n\n' +
        'So method 1 is $O(n^2)$ and method 2 is $O(n)$: a hash table trades a little extra memory for a big speed-up.',
      whyWrong: [
        null,
        'This treats each lookup as a linear scan, which would be true for an array. A hash table lookup is $O(1)$ on average, so method 2 is $O(n)$.',
        'The number of pairs to check shrinks by one each time, but the total is still $\\frac{n(n-1)}{2}$, which is $O(n^2)$. Shrinking by one each time is not the same as halving.',
        'Each lookup is $O(1)$, but method 2 still loops over all $n$ items in the worst case, so the total is $O(n)$, not $O(1)$.',
      ],
      keyIdea: 'Replacing an inner search loop with an $O(1)$ hash table lookup turns an $O(n^2)$ algorithm into an $O(n)$ one.',
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
      solution:
        '`i` takes the values $1, 2, 4, 8, \\dots$ and the loop stops once $i \\ge n$.\n\n' +
        'After $k$ passes $i = 2^k$, so the loop ends when $2^k \\ge n$, which is after about $\\log_2 n$ passes.\n\n' +
        'Each pass does constant work, so the complexity is $O(\\log n)$.',
      whyWrong: [
        'The number of passes grows with $n$, although slowly, so the time is not constant.',
        'This assumes `i` goes up by 1 on each pass. Doubling reaches $n$ much faster.',
        null,
        'This would need a loop nested inside another loop, or a counter that takes $n^2$ steps. There is one doubling loop here.',
      ],
      keyIdea: 'A loop that doubles its counter up to $n$ runs about $\\log_2 n$ times: $O(\\log n)$.',
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
      solution:
        'The first two loops are nested, so they multiply: $4 \\times 5 = 20$.\n\n' +
        'The third loop comes **after** them, so it adds: $20 + 6 = 26$.',
      whyWrong: [
        null,
        'This multiplies all three loops, $4 \\times 5 \\times 6$. The third loop is not inside the others.',
        'This adds all three loops, $4 + 5 + 6$. The first two are nested, so they multiply.',
        'This counts only the nested loops and misses the 6 passes of the third loop.',
      ],
      keyIdea: 'Multiply the counts of nested loops; add the counts of loops that follow one another.',
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
      solution:
        'Compare at $n = 1024$, where $\\log_2 n = 10$:\n\n' +
        '| Function | Value |\n| --- | --- |\n' +
        '| $\\log_2 n$ | 10 |\n' +
        '| $n$ | 1024 |\n' +
        '| $n\\log_2 n$ | 10 240 |\n' +
        '| $n^2$ | 1 048 576 |\n\n' +
        'So the order is $\\log n$, $n$, $n\\log n$, $n^2$.',
      whyWrong: [
        null,
        'This puts $n$ below $\\log n$. A logarithm grows far more slowly than $n$.',
        'This puts $n\\log n$ below $n$. Multiplying $n$ by $\\log n$ makes it bigger once $\\log n > 1$.',
        'This puts $n^2$ below $n\\log n$. Since $n$ is much bigger than $\\log n$, $n \\times n$ is bigger than $n \\times \\log n$.',
      ],
      keyIdea: 'Growth ladder: $\\log n < n < n\\log n < n^2$.',
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
