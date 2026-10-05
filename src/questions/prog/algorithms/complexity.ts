import type { StaticQuestion } from '../../../types';

// Helpers used only by the answer checks (they re-derive answers by actually running the rule).
const log2 = (x: number) => Math.log(x) / Math.log(2);

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
    stem: 'A program looks through an **unsorted** list of $n$ items one at a time, from the start, until it finds a target value. What is its **worst-case** time complexity (tightest Big-O)?',
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
    stem: 'An algorithm performs $T(n) = 3n^2 + 5n + 7$ steps on an input of size $n$. What is the simplest, tightest Big-O description of its running time?',
    options: ['$O(n)$', '$O(n^2)$', '$O(1)$', '$O(n^3)$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Two rules turn a step count into Big-O:\n\n' +
        '1. Keep only the **fastest-growing term**. Of $3n^2$, $5n$ and $7$, the term $3n^2$ grows fastest: for $n = 1000$ it is $3\\,000\\,000$, while $5n = 5000$ and $7$ stays $7$.\n' +
        '2. **Drop the constant multiplier**: $3n^2 \\to n^2$.\n\n' +
        'So $T(n) = O(n^2)$.',
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
    stem: 'What is the worst-case time complexity (tightest Big-O) of **binary search** on a sorted list of $n$ items?',
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

  // ------------------------------------------------------------------ exam
  {
    id: 'complexity-006',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'Consider this pseudocode with $n = 20$. How many times is the line `count = count + 1` executed?',
    code: {
      lang: 'pseudocode',
      source: 'count = 0\nfor i = 1 to n\n    for j = i to n\n        count = count + 1\n    end for\nend for\nprint(count)',
    },
    options: ['$400$', '$190$', '$210$', '$20$'],
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
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'n = 1000\nsteps = 0\nwhile n > 1:\n    n = n // 2\n    steps += 1\nprint(steps)',
    },
    options: ['`10`', '`9`', '`500`', '`999`'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`n // 2` is integer division (it rounds down). Trace the loop:\n\n' +
        '| pass | `n` after the pass | `steps` |\n' +
        '| --- | --- | --- |\n' +
        '| 1 | 500 | 1 |\n' +
        '| 2 | 250 | 2 |\n' +
        '| 3 | 125 | 3 |\n' +
        '| 4 | 62 | 4 |\n' +
        '| 5 | 31 | 5 |\n' +
        '| 6 | 15 | 6 |\n' +
        '| 7 | 7 | 7 |\n' +
        '| 8 | 3 | 8 |\n' +
        '| 9 | 1 | 9 |\n\n' +
        'Now `n > 1` is false ($1 > 1$ is false), so the loop stops and `9` is printed.\n\n' +
        'Check: $2^9 = 512 \\le 1000 < 1024 = 2^{10}$, so the number of halvings is $\\lfloor \\log_2 1000 \\rfloor = 9$. A loop that halves is $O(\\log n)$.',
      whyWrong: [
        'This rounds $\\log_2 1000 \\approx 9.97$ **up** to 10. Integer division rounds down at each step, and the loop stops as soon as `n` reaches 1, after 9 passes.',
        null,
        'This is the value of `n` after the first pass, not the number of passes.',
        'This assumes `n` goes down by 1 each pass, as in `n = n - 1`. Halving shrinks `n` much faster.',
      ],
      keyIdea: 'A loop that halves $n$ until it reaches 1 runs about $\\log_2 n$ times: $O(\\log n)$.',
    },
    python: { stdout: '9\n' },
  },
  {
    id: 'complexity-008',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'What is the time complexity (tightest Big-O) of this function, where $n$ is the length of `nums`?',
    code: {
      lang: 'python',
      source:
        'def stats(nums):\n    total = 0\n    for x in nums:\n        total += x\n    biggest = nums[0]\n    for x in nums:\n        if x > biggest:\n            biggest = x\n    return total, biggest',
    },
    options: ['$O(n^2)$', '$O(1)$', '$O(\\log n)$', '$O(n)$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Count the work line by line:\n\n' +
        '- `total = 0`, `biggest = nums[0]` and the `return`: a fixed number of steps, $O(1)$.\n' +
        '- The first `for` loop runs $n$ times with $O(1)$ work each time: $O(n)$.\n' +
        '- The second `for` loop is **after** the first one (not inside it): another $O(n)$.\n\n' +
        'Loops one after another **add**: $O(1) + O(n) + O(n) = O(2n + 1)$. Drop the constants: $O(n)$.',
      whyWrong: [
        'This multiplies the two loops. Loops only multiply when one is **inside** the other. These loops run one after the other, so their costs add: $n + n = 2n$, which is $O(n)$.',
        'This assumes the function is constant time because it only returns two numbers. It still has to visit all $n$ items (twice) to compute them.',
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
    stem: 'In Python, `x in data` checks whether `x` is in `data`. What is the average time complexity of this check when `data` is a **list** of $n$ items, and when it is a **set** of $n$ items?',
    options: [
      'List: $O(1)$; set: $O(1)$',
      'List: $O(n)$; set: $O(n)$',
      'List: $O(n)$; set: $O(1)$',
      'List: $O(\\log n)$; set: $O(1)$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        '- **List:** Python has no shortcut, so `in` compares `x` with the items one by one from the start (a linear search). On average it checks about half the list, and in the worst case all of it: $O(n)$.\n' +
        '- **Set:** a set is a **hash table**. Python computes `hash(x)`, which points straight to the place where `x` would be stored, so it checks only that place: $O(1)$ on average, whatever the size of the set.\n\n' +
        'So: list $O(n)$, set $O(1)$. This is why a set (or a dict) is the right choice when you need many fast "is this already there?" checks.',
      whyWrong: [
        'Indexing a list by position (`data[i]`) is $O(1)$, but searching a list for a **value** is not: `in` has to scan the items one by one.',
        'This treats a set like a list. A set uses hashing to jump straight to where the item would be, so it does not scan.',
        null,
        '$O(\\log n)$ would need binary search, which requires sorted data and is not what `in` does. On a list, `in` is a plain linear scan.',
      ],
      keyIdea: 'Membership tests are $O(n)$ for a list (linear scan) but $O(1)$ on average for a set or dict (hashing).',
    },
  },
  {
    id: 'complexity-010',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'A shop has 50,000 products, each with a unique product code such as `"QX-1932"`. A program must look up the **price** for a given code thousands of times per second. Which Python data structure is the best choice?',
    options: [
      'A list of `(code, price)` tuples, searched with a loop',
      'A dict with product codes as keys and prices as values',
      'A set of product codes',
      'A list of prices, sorted from cheapest to most expensive',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'The task is: **given a key (the code), find its value (the price)**, many times.\n\n' +
        '- A dict stores key-value pairs in a hash table, so `prices["QX-1932"]` finds the price in $O(1)$ time on average, no matter how many products there are.\n' +
        '- Searching a list of tuples with a loop is a linear search: up to 50,000 comparisons per lookup, $O(n)$.\n' +
        '- A set can tell you whether a code exists, but it stores no price.\n' +
        '- A sorted list of prices has lost the link between each price and its code.\n\n' +
        'So the dict is the right choice.',
      whyWrong: [
        'This works, but every lookup is a linear search ($O(n)$, up to 50,000 comparisons). With thousands of lookups per second that is far slower than a dict.',
        null,
        'A set gives fast $O(1)$ membership checks, but it only stores the codes. There is nowhere to keep the price that goes with each code.',
        'Sorting by price does not help find a price **by code**; the codes are not stored at all, so the lookup is impossible.',
      ],
      keyIdea: 'For repeated "look up the value for this key" tasks, use a dict: $O(1)$ average lookup.',
    },
  },
  {
    id: 'complexity-011',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'An $O(n^2)$ sorting algorithm takes 4 seconds to sort $n = 1000$ items. Assuming the running time is proportional to $n^2$, roughly how long will it take to sort $n = 3000$ items?',
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
    stem: 'What is the time complexity (tightest Big-O) of this function in terms of $n$?',
    code: {
      lang: 'python',
      source:
        'def f(n):\n    count = 0\n    for i in range(n):\n        j = n\n        while j > 1:\n            j = j // 2\n            count += 1\n    return count',
    },
    options: ['$O(n^2)$', '$O(\\log n)$', '$O(n\\log n)$', '$O(n)$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Work from the inside out.\n\n' +
        '1. **Inner loop:** `j` starts at $n$ and is halved each pass until it reaches 1, so it runs about $\\log_2 n$ times. That is $O(\\log n)$.\n' +
        '2. **Outer loop:** `for i in range(n)` runs $n$ times, and each time the inner loop starts again from `j = n`.\n' +
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
    id: 'complexity-013',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'Let `a` be a Python list with $n$ items. Which of these operations takes $O(n)$ time rather than $O(1)$?',
    options: ['`a.append(x)`', '`a[-1]`', '`len(a)`', '`a.insert(0, x)`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'A Python list stores its items in one block of memory, in order, and remembers its length.\n\n' +
        '- `a.append(x)` puts `x` in the next free slot at the end: $O(1)$ (on average, counting the occasional resize).\n' +
        '- `a[-1]` jumps straight to the last position: indexing is $O(1)$.\n' +
        '- `len(a)` just reads the stored length: $O(1)$.\n' +
        '- `a.insert(0, x)` puts `x` at the **front**, so every one of the $n$ existing items must shift one place to the right first: $O(n)$.\n\n' +
        'So `a.insert(0, x)` is the $O(n)$ operation (and so is `a.pop(0)`, for the same reason).',
      whyWrong: [
        'Appending adds to the **end**, where nothing has to move, so it is $O(1)$ on average.',
        'Indexing (including negative indexes) jumps straight to a position in memory: $O(1)$. It does not walk through the list.',
        'Python stores the length of a list, so `len(a)` reads one number: $O(1)$. It does not count the items.',
        null,
      ],
      keyIdea: 'Changing the front of a list shifts every item ($O(n)$); working at the end or indexing is $O(1)$.',
    },
  },
  {
    id: 'complexity-014',
    subtopic: 'complexity',
    difficulty: 'exam',
    stem: 'A sorted list contains 1,000,000 items. In the **worst case**, how many items does binary search need to inspect to find a target (or decide it is not there)?',
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

  // ------------------------------------------------------------------ challenge
  {
    id: 'complexity-015',
    subtopic: 'complexity',
    difficulty: 'challenge',
    stem: 'Put these functions in order from **slowest-growing** to **fastest-growing** as $n$ becomes very large: $n^3$, $\\log_2 n$, $2^n$, $n\\log_2 n$, $\\sqrt{n}$.',
    options: [
      '$\\sqrt{n} < \\log_2 n < n\\log_2 n < n^3 < 2^n$',
      '$\\log_2 n < \\sqrt{n} < n\\log_2 n < 2^n < n^3$',
      '$\\log_2 n < \\sqrt{n} < n\\log_2 n < n^3 < 2^n$',
      '$\\log_2 n < n\\log_2 n < \\sqrt{n} < n^3 < 2^n$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Compare at a large value such as $n = 1024 = 2^{10}$:\n\n' +
        '| Function | Value at $n = 1024$ |\n' +
        '| --- | --- |\n' +
        '| $\\log_2 n$ | $10$ |\n' +
        '| $\\sqrt{n}$ | $32$ |\n' +
        '| $n\\log_2 n$ | $10\\,240$ |\n' +
        '| $n^3$ | about $1.07 \\times 10^{9}$ |\n' +
        '| $2^n$ | about $1.8 \\times 10^{308}$ |\n\n' +
        'Reasons that hold for all large $n$:\n\n' +
        '- $\\log_2 n$ grows more slowly than any power of $n$, even $\\sqrt{n} = n^{0.5}$.\n' +
        '- $\\sqrt{n}$ is smaller than $n$, so it is certainly smaller than $n\\log_2 n$.\n' +
        '- $n\\log_2 n < n^3$ because $\\log_2 n$ is much smaller than $n^2$.\n' +
        '- Any exponential beats any polynomial, so $n^3 < 2^n$ eventually (from $n = 10$ onwards: $1000 < 1024$).\n\n' +
        'Order: $\\log_2 n < \\sqrt{n} < n\\log_2 n < n^3 < 2^n$.',
      whyWrong: [
        'This puts $\\sqrt{n}$ below $\\log_2 n$, which only looks true for small $n$ (at $n = 8$, $\\sqrt{8} \\approx 2.8 < 3$). Once $n$ is bigger than 16, $\\sqrt{n}$ is always bigger, and the gap keeps growing (at $n = 1024$: 32 versus 10).',
        'This puts $2^n$ below $n^3$, which is only true for small $n$ (at $n = 8$: $256 < 512$). From $n = 10$ onwards $2^n$ is bigger, and exponentials always overtake polynomials.',
        null,
        'This puts $\\sqrt{n}$ above $n\\log_2 n$, which confuses the square **root** of $n$ with $n$ **squared**. $\\sqrt{n}$ is smaller than $n$, so it is smaller than $n\\log_2 n$.',
      ],
      keyIdea: 'Growth ladder: $\\log n < \\sqrt{n} < n < n\\log n < n^2 < n^3 < 2^n < n!$; small-$n$ comparisons can mislead.',
    },
    check: {
      optionValues: ['sqrt<log<nlog<cube<exp', 'log<sqrt<nlog<exp<cube', 'log<sqrt<nlog<cube<exp', 'log<nlog<sqrt<cube<exp'],
      compute: () => {
        const n = 1000;
        const fs: [string, (x: number) => number][] = [
          ['cube', (x) => x ** 3],
          ['log', (x) => log2(x)],
          ['exp', (x) => 2 ** x],
          ['nlog', (x) => x * log2(x)],
          ['sqrt', (x) => Math.sqrt(x)],
        ];
        return fs
          .map(([name, f]) => ({ name, v: f(n) }))
          .sort((a, b) => a.v - b.v)
          .map((x) => x.name)
          .join('<');
      },
    },
  },
  {
    id: 'complexity-016',
    subtopic: 'complexity',
    difficulty: 'challenge',
    stem: 'For this pseudocode with $n = 64$, how many times does the line `j = j + 1` run, and what is the time complexity of the algorithm in terms of $n$?',
    code: {
      lang: 'pseudocode',
      source: 'i = 1\nwhile i < n\n    j = 0\n    while j < i\n        j = j + 1\n    end while\n    i = i * 2\nend while',
    },
    options: [
      '63 times; $O(n\\log n)$',
      '63 times; $O(n)$',
      '384 times; $O(n\\log n)$',
      '6 times; $O(\\log n)$',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'The outer loop doubles `i`: it takes the values $1, 2, 4, 8, 16, 32$ (the next value, 64, fails `i < n`). That is 6 passes, about $\\log_2 n$.\n\n' +
        'For each pass, the inner loop counts `j` from 0 up to `i`, so `j = j + 1` runs exactly `i` times:\n\n' +
        '| `i` | inner runs |\n' +
        '| --- | --- |\n' +
        '| 1 | 1 |\n' +
        '| 2 | 2 |\n' +
        '| 4 | 4 |\n' +
        '| 8 | 8 |\n' +
        '| 16 | 16 |\n' +
        '| 32 | 32 |\n\n' +
        'Total $= 1 + 2 + 4 + 8 + 16 + 32 = 63$.\n\n' +
        'In general the total is $1 + 2 + 4 + \\dots$ up to the largest power of 2 below $n$, which is less than $2n$ (each term is bigger than all the earlier terms put together). So the work is at most about $2n$: the algorithm is $O(n)$, **not** $O(n\\log n)$. The inner loop is not always $n$ long; it is short for most passes.',
      whyWrong: [
        'The count is right, but the complexity is not. $O(n\\log n)$ would need the inner loop to run about $n$ times on every one of the $\\log_2 n$ passes. Here the inner loop runs $1, 2, 4, \\dots$ times, and that doubling sum is less than $2n$, so it is $O(n)$.',
        null,
        'This is $n\\log_2 n = 64 \\times 6$: it assumes the inner loop runs $n = 64$ times on each of the 6 outer passes. The inner loop runs only `i` times, and `i` is small for most passes.',
        'This counts only the outer loop (6 passes, $\\log_2 64$). The question asks about the line inside the inner loop, which runs `i` times per pass.',
      ],
      keyIdea: 'Doubling work $1 + 2 + 4 + \\dots$ up to $n$ sums to less than $2n$, so it is $O(n)$: always add up the actual inner-loop lengths.',
    },
    check: {
      optionValues: ['63|O(nlogn)', '63|O(n)', '384|O(nlogn)', '6|O(logn)'],
      compute: () => {
        const run = (n: number) => {
          let c = 0;
          for (let i = 1; i < n; i *= 2) for (let j = 0; j < i; j++) c++;
          return c;
        };
        // classify growth: compare how the count scales when n is multiplied by 256
        const small = 256;
        const big = 65536;
        const ratio = run(big) / run(small);
        const models: [string, number][] = [
          ['O(logn)', Math.log(big) / Math.log(small)],
          ['O(n)', big / small],
          ['O(nlogn)', (big * Math.log(big)) / (small * Math.log(small))],
          ['O(n^2)', (big / small) ** 2],
        ];
        const best = models.reduce((a, b) => (Math.abs(Math.log(ratio / b[1])) < Math.abs(Math.log(ratio / a[1])) ? b : a));
        return `${run(64)}|${best[0]}`;
      },
    },
  },
  {
    id: 'complexity-017',
    subtopic: 'complexity',
    difficulty: 'challenge',
    stem: 'A print server must handle jobs **in the order they arrive** (first in, first out). New jobs are added at one end and the oldest job is removed from the other end, millions of times. Which choice does this correctly **and** in $O(1)$ time per operation?',
    options: [
      'A list: add with `append(job)`, remove with `pop(0)`',
      'A list: add with `append(job)`, remove with `pop()`',
      'A set: add with `add(job)`, remove with `pop()`',
      'A `collections.deque`: add with `append(job)`, remove with `popleft()`',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'We need a **queue** (first in, first out), and both operations must be $O(1)$.\n\n' +
        '- `list.append` is $O(1)$, but `list.pop(0)` removes the **front** item, so every other item shifts left one place: $O(n)$. Correct order, too slow.\n' +
        '- `list.pop()` removes the **last** item added. That is a stack (last in, first out): wrong order.\n' +
        '- A set has **no order** at all, so `set.pop()` removes an arbitrary item: wrong order.\n' +
        '- A `deque` (double-ended queue) is built so that adding or removing at **either** end is $O(1)$. `append` adds at the right, `popleft` removes from the left: first in, first out, $O(1)$ each.\n\n' +
        'So the deque is the right choice.',
      whyWrong: [
        'The order is correct (first in, first out), but `pop(0)` shifts all the remaining items one place to the left, which is $O(n)$ per removal. With millions of jobs this is very slow.',
        'Both operations are $O(1)$, but `pop()` removes the **newest** job. That is a stack (last in, first out), so jobs would be printed in the wrong order.',
        'Sets are unordered, so `pop()` removes an arbitrary job, not the oldest one. (Identical jobs would also be merged into one.)',
        null,
      ],
      keyIdea: 'Use a `deque` for a queue: `append` and `popleft` are both $O(1)$, whereas `list.pop(0)` is $O(n)$.',
    },
  },
  {
    id: 'complexity-018',
    subtopic: 'complexity',
    difficulty: 'challenge',
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
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source:
        'def count_ops(n):\n    ops = 0\n    i = n\n    while i > 0:\n        for j in range(n):\n            ops += 1\n        i //= 2\n    return ops\n\nprint(count_ops(16))',
    },
    options: ['`64`', '`80`', '`256`', '`31`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The outer `while` loop halves `i` (rounding down) until it reaches 0. The inner `for` loop always runs `range(n)`, which is 16 times.\n\n' +
        '| `i` at start of pass | inner loop runs | `ops` after the pass |\n' +
        '| --- | --- | --- |\n' +
        '| 16 | 16 | 16 |\n' +
        '| 8 | 16 | 32 |\n' +
        '| 4 | 16 | 48 |\n' +
        '| 2 | 16 | 64 |\n' +
        '| 1 | 16 | 80 |\n\n' +
        'After the pass with `i = 1`, `i //= 2` makes `i` equal to 0, and `0 > 0` is false, so the loop stops.\n\n' +
        'There are 5 outer passes ($\\lfloor \\log_2 16 \\rfloor + 1 = 5$), each doing 16 operations: $5 \\times 16 = 80$. In general this is about $n\\log_2 n$, so $O(n\\log n)$.\n\n' +
        'Output: `80`.',
      whyWrong: [
        'This stops the outer loop when `i` reaches 1, as if the condition were `i > 1`. The condition is `i > 0`, so the pass with `i = 1` also runs, adding another 16.',
        null,
        'This is $16^2$: it assumes the outer loop also runs 16 times. The outer loop halves `i`, so it runs only 5 times.',
        'This is $16 + 8 + 4 + 2 + 1$, what you get if the inner loop were `range(i)`. The inner loop is `range(n)`, so it always runs 16 times.',
      ],
      keyIdea: 'Halving outer loop ($\\log_2 n + 1$ passes) times a full inner loop ($n$) gives about $n\\log_2 n$ operations.',
    },
    python: { stdout: '80\n' },
  },
  {
    id: 'complexity-020',
    subtopic: 'complexity',
    difficulty: 'challenge',
    stem: 'Both functions return `True` if two different items of `nums` add up to `target`. Using the average-case cost of set operations, what are their worst-case time complexities, where $n$ is the length of `nums`?',
    code: {
      lang: 'python',
      source:
        'def has_pair_v1(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return True\n    return False\n\n\ndef has_pair_v2(nums, target):\n    seen = set()\n    for x in nums:\n        if target - x in seen:\n            return True\n        seen.add(x)\n    return False',
    },
    options: [
      'v1: $O(n^2)$; v2: $O(n)$',
      'v1: $O(n^2)$; v2: $O(n^2)$',
      'v1: $O(n\\log n)$; v2: $O(n)$',
      'v1: $O(n^2)$; v2: $O(1)$',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'The worst case is when no pair adds up to `target`, so neither function returns early.\n\n' +
        '**v1:** for each `i`, the inner loop checks every later item. The number of pairs checked is $(n - 1) + (n - 2) + \\dots + 2 + 1 =\\frac{n(n-1)}{2}$. That is about $\\frac{n^2}{2}$, so $O(n^2)$.\n\n' +
        '**v2:** one loop over the $n$ items. Inside it, `target - x in seen` and `seen.add(x)` are set operations, each $O(1)$ on average because a set uses hashing. So the total is $n \\times O(1) = O(n)$.\n\n' +
        'So v1 is $O(n^2)$ and v2 is $O(n)$: using a set trades a little extra memory for a big speed-up.',
      whyWrong: [
        null,
        'This treats `in seen` as a linear scan, which would be true for a **list**. For a set the check uses hashing and is $O(1)$ on average, so v2 is $O(n)$.',
        'The inner loop of v1 gets shorter each time, but the total is still $\\frac{n(n-1)}{2}$, which is $O(n^2)$. Shrinking by one each time is not the same as halving.',
        'Each set operation is $O(1)$, but v2 still loops over all $n$ items in the worst case, so the total is $O(n)$, not $O(1)$.',
      ],
      keyIdea: 'Replacing an inner search loop with an $O(1)$ set lookup turns an $O(n^2)$ algorithm into an $O(n)$ one.',
    },
  },
];
