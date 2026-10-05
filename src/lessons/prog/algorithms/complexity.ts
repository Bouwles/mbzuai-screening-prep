import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'complexity',
  know:
    '### What Big-O is measuring\n\n' +
    'Big-O notation describes **how the amount of work grows as the input gets bigger**. We call the input size $n$ (for example, the number of items in a list). We do not care about exact seconds, which depend on the computer. We care about the *shape* of the growth: if $n$ doubles, does the work stay the same, double, or quadruple?\n\n' +
    'To find the Big-O of a step count $T(n)$, use two rules:\n\n' +
    '1. **Keep only the fastest-growing term.** In $3n^2 + 5n + 7$, the $3n^2$ term swamps the others when $n$ is large.\n' +
    '2. **Drop the constant multiplier.** $3n^2$ becomes $n^2$, so $T(n) = O(n^2)$.\n\n' +
    'Strictly, Big-O is an upper bound, but in exam questions "the complexity" always means the **tightest** simple bound.\n\n' +
    '### The growth ladder\n\n' +
    'Learn this order, from slowest to fastest growth:\n\n' +
    '$$1 < \\log n < \\sqrt{n} < n < n\\log n < n^2 < n^3 < 2^n < n!$$\n\n' +
    '| Big-O | Name | If $n$ doubles, the work... | Typical example |\n' +
    '| --- | --- | --- | --- |\n' +
    '| $O(1)$ | constant | stays the same | `a[i]`, `len(a)`, dict lookup |\n' +
    '| $O(\\log n)$ | logarithmic | goes up by one step | binary search, a loop that halves |\n' +
    '| $O(n)$ | linear | doubles | linear search, one loop over the list |\n' +
    '| $O(n\\log n)$ | "n log n" | slightly more than doubles | merge sort |\n' +
    '| $O(n^2)$ | quadratic | multiplies by 4 | two nested loops, bubble sort |\n' +
    '| $O(2^n)$ | exponential | is squared (huge) | trying every subset |\n\n' +
    'Here $\\log n$ means $\\log_2 n$: **how many times you can halve $n$ before you reach 1**. Since $2^{10} = 1024$, $\\log_2 1024 = 10$; and $\\log_2$ of a million is about 20. That is why logarithmic algorithms are so fast.\n\n' +
    '### Reading the complexity of code\n\n' +
    '- **Simple statements** (assignment, arithmetic, `if`, indexing): $O(1)$.\n' +
    '- **One loop** that runs $n$ times with $O(1)$ work inside: $O(n)$.\n' +
    '- **Loops one after another add:** $O(n) + O(n) = O(2n) = O(n)$.\n' +
    '- **Nested loops multiply:** an $n$-loop inside an $n$-loop gives $n \\times n = O(n^2)$.\n' +
    '- **Triangular loops** (inner loop runs $1, 2, \\dots, n$ times) add up to $\\frac{n(n+1)}{2}$, which is still $O(n^2)$.\n' +
    '- **Loops that halve or double** (`n = n // 2`, `i = i * 2`) run about $\\log_2 n$ times: $O(\\log n)$.\n' +
    '- A halving loop **inside** an $n$-loop: $O(n\\log n)$.\n\n' +
    'Always look at what actually controls each loop. A loop that doubles `i` while an inner loop runs `i` times does $1 + 2 + 4 + \\dots$ work, which totals less than $2n$, so it is $O(n)$, not $O(n\\log n)$.\n\n' +
    '### Exact counts versus Big-O\n\n' +
    'Some questions ask "how many times does this line run?" for a specific $n$. Then you need the exact count, not the Big-O. Be careful with loop boundaries: Python `range(a, b)` gives $b - a$ values, while pseudocode `for i = 1 to n` includes both ends ($n$ values). For a halving loop, trace the values: $1000 \\to 500 \\to 250 \\to \\dots \\to 1$ (9 halvings, because integer division rounds down).\n\n' +
    '### Predicting running times\n\n' +
    'If an algorithm is $O(n^p)$ and $n$ is multiplied by $k$, the time is multiplied by about $k^p$. An $O(n^2)$ sort that takes 4 seconds for 1000 items takes about $4 \\times 3^2 = 36$ seconds for 3000 items. For $O(2^n)$, each extra 1 in $n$ **doubles** the time. For $O(\\log n)$, squaring $n$ only doubles the time.\n\n' +
    '### Python lists, dicts and sets\n\n' +
    '| Operation | List | Dict / set |\n' +
    '| --- | --- | --- |\n' +
    '| access by index `a[i]` | $O(1)$ | (not by position) |\n' +
    '| look up by key `d[k]` | (no keys) | $O(1)$ average |\n' +
    '| `x in ...` | $O(n)$ (linear scan) | $O(1)$ average (hashing) |\n' +
    '| add an item: `a.append(x)` / `s.add(x)`, `d[k] = v` | $O(1)$ (at the end) | $O(1)$ average |\n' +
    '| remove an item by value: `a.remove(x)` / `s.remove(x)`, `del d[k]` | $O(n)$ (search, then shift) | $O(1)$ average |\n' +
    '| `insert(0, x)`, `pop(0)` | $O(n)$ (everything shifts) | not applicable |\n' +
    '| `pop()` from the end | $O(1)$ | not applicable |\n' +
    '| `len(...)` | $O(1)$ | $O(1)$ |\n\n' +
    'Dicts and sets use **hashing**: Python turns the key into a number that points straight to where it is stored, so it never scans.\n\n' +
    '### Searches and sorts\n\n' +
    '- Linear search: $O(n)$ worst case. Works on any list.\n' +
    '- Binary search: $O(\\log n)$ worst case, at most $\\lfloor \\log_2 n \\rfloor + 1$ inspections. Needs a **sorted** list.\n' +
    '- Bubble, insertion and selection sort: $O(n^2)$ worst case. On an already sorted list insertion sort is $O(n)$, and so is bubble sort if it stops early after a pass with no swaps; selection sort is $O(n^2)$ even then.\n' +
    '- Merge sort: $O(n\\log n)$ in every case.\n' +
    '- Quicksort: $O(n\\log n)$ on average, but $O(n^2)$ in the worst case (when the pivot is always the smallest or largest item).\n' +
    '- Python\'s built-in `sorted()` and `list.sort()`: $O(n\\log n)$.\n\n' +
    '### Choosing a data structure\n\n' +
    '- Need "is this already there?" checks many times: use a **set**.\n' +
    '- Need to look up a value from a key (code to price, name to score): use a **dict**.\n' +
    '- Need items in order with access by position: use a **list**.\n' +
    '- First in, first out (a queue): use `collections.deque` with `append` and `popleft`, both $O(1)$.\n' +
    '- Last in, first out (a stack): a list with `append` and `pop()`.',
  formulas: [
    { label: 'Big-O rule', tex: 'T(n) = 3n^2 + 5n + 7 \\;\\Rightarrow\\; O(n^2)', note: 'Keep the fastest-growing term, drop its coefficient.' },
    { label: 'Growth ladder', tex: '1 < \\log n < \\sqrt{n} < n < n\\log n < n^2 < n^3 < 2^n < n!', note: 'From slowest-growing to fastest-growing, for large n.' },
    { label: 'Sequential code adds', tex: 'O(f) + O(g) = O(\\max(f, g))', note: 'Two loops one after the other: $O(n) + O(n) = O(n)$.' },
    { label: 'Nested loops multiply', tex: 'O(f) \\times O(g) = O(f \\times g)', note: 'An $n$-loop inside an $n$-loop is $O(n^2)$.' },
    { label: 'Triangular loop count', tex: '1 + 2 + \\dots + n = \\frac{n(n+1)}{2} = O(n^2)' },
    { label: 'Halving (or doubling) loop', tex: '\\text{passes} \\approx \\log_2 n, \\quad 2^{\\text{passes}} \\approx n', note: 'Halving $n$ until it reaches 1 takes $\\lfloor \\log_2 n \\rfloor$ passes.' },
    { label: 'Binary search worst case', tex: '\\lfloor \\log_2 n \\rfloor + 1 \\text{ inspections}', note: 'About 20 for a million items.' },
    { label: 'Doubling sum', tex: '1 + 2 + 4 + \\dots + 2^k = 2^{k+1} - 1 < 2 \\times 2^k', note: 'Why a doubling outer loop with an inner loop of length $i$ is only $O(n)$.' },
    { label: 'Time scaling', tex: 'O(n^p): \\; n \\to kn \\;\\Rightarrow\\; \\text{time} \\times k^p', note: 'For $O(2^n)$, each increase of 1 in $n$ doubles the time.' },
    { label: 'Common complexities', tex: '\\text{linear search } O(n), \\; \\text{binary search } O(\\log n), \\; \\text{merge sort } O(n\\log n), \\; \\text{bubble sort } O(n^2)' },
    { label: 'Python operations', tex: '\\texttt{x in list}: O(n), \\quad \\texttt{x in set}: O(1), \\quad \\texttt{d[k]}: O(1), \\quad \\texttt{list.insert(0, x)}: O(n)', note: 'Dict and set costs are averages (hashing).' },
  ],
  examples: [
    {
      title: 'Simplifying a step count',
      problem: 'An algorithm performs $T(n) = 6n + 2n^3 + 400$ steps. What is its Big-O?',
      steps: [
        'List the terms: $6n$, $2n^3$ and the constant $400$.',
        'Compare growth, ignoring coefficients: on the ladder $1 < n < n^3$, so $n^3$ is the fastest-growing.',
        'The dominant term is $2n^3$, even though 400 is the biggest number written down.',
        'Drop the coefficient 2: $O(n^3)$.',
      ],
      answer: '$O(n^3)$',
    },
    {
      title: 'Counting a halving loop',
      problem: 'How many times does the body of `while n > 1: n = n // 2` run when `n` starts at 100? What is the complexity?',
      steps: [
        'Trace the values of `n`: $100 \\to 50 \\to 25 \\to 12 \\to 6 \\to 3 \\to 1$.',
        'Count the arrows: 6 passes. Then `n > 1` is false ($1 > 1$ is false), so the loop stops.',
        'Check with powers of 2: $2^6 = 64 \\le 100 < 128 = 2^7$, so $\\lfloor \\log_2 100 \\rfloor = 6$.',
        'The number of passes grows like $\\log_2 n$, so the loop is $O(\\log n)$.',
      ],
      answer: '6 passes; $O(\\log n)$',
    },
    {
      title: 'A triangular nested loop',
      problem: 'In pseudocode `for i = 1 to n` / `for j = 1 to i` / `count = count + 1`, how many times does the counting line run when $n = 10$? What is the complexity?',
      steps: [
        'For $i = 1$ the inner loop runs once, for $i = 2$ twice, ..., for $i = 10$ ten times.',
        'Total $= 1 + 2 + \\dots + 10$.',
        'Use the triangular formula: $\\frac{10 \\times 11}{2} = 55$.',
        'In general $\\frac{n(n+1)}{2} = \\frac{n^2}{2} + \\frac{n}{2}$; keep the dominant term and drop $\\frac{1}{2}$: $O(n^2)$.',
      ],
      answer: '55 times; $O(n^2)$',
    },
    {
      title: 'Predicting a running time',
      problem: 'An $O(n^3)$ algorithm takes 5 seconds when $n = 200$. Estimate the time when $n = 800$.',
      steps: [
        'Scale factor for $n$: $k = \\frac{800}{200} = 4$.',
        'For $O(n^3)$ the time is multiplied by $k^3 = 4^3 = 64$.',
        'New time $= 5 \\times 64 = 320$ seconds.',
        'Sanity check: a linear algorithm would only take $5 \\times 4 = 20$ seconds; cubic growth is much worse.',
      ],
      answer: 'About 320 seconds',
    },
  ],
  traps: [
    '**Multiplying sequential loops.** Two loops one after the other are $n + n = 2n$, which is $O(n)$. Only a loop **inside** another loop multiplies.',
    '**Choosing the term with the biggest coefficient or the biggest constant.** In $500n + n^2 + 9000$ the dominant term is $n^2$; coefficients and constants never change the Big-O.',
    '**Trusting small values of $n$.** At $n = 8$, $n^3 = 512$ is bigger than $2^n = 256$, and $\\sqrt{8} < \\log_2 8$. Big-O is about very large $n$, where $2^n$ beats every polynomial and $\\sqrt{n}$ beats $\\log n$.',
    '**Assuming `x in` is always fast.** `x in my_list` scans the list ($O(n)$); `x in my_set` and dict key lookups are $O(1)$ on average.',
    '**Off-by-one counts.** `range(1, n)` runs $n - 1$ times, pseudocode `for i = 1 to n` runs $n$ times, and `while n > 1` stops one pass earlier than `while n > 0`.',
    '**Forgetting that binary search needs sorted data**, or using `list.pop(0)` for a queue: it is $O(n)$ per removal, so use `collections.deque` and `popleft()`.',
  ],
  examTip:
    'Complexity questions usually offer four Big-O options such as $O(1)$, $O(\\log n)$, $O(n)$, $O(n^2)$, so work out the *shape* first: count the loop levels, and ask whether each loop goes up by 1 (that is $n$ passes) or halves/doubles ($\\log n$ passes). Check whether loops are nested (multiply) or one after another (add). For "how many times does this run" questions, trace small values or use $\\frac{n(n+1)}{2}$ and powers of 2 ($2^{10} = 1024$, $2^{20} \\approx$ one million); wrong options are usually $n^2$ (inner loop assumed full length), the outer-loop count alone, or an off-by-one. For timing questions, compute $k = \\frac{\\text{new } n}{\\text{old } n}$ on your calculator and multiply the time by $k^p$; if an option equals old time $\\times k$, it is the "linear" trap. For data-structure choices, ask what the task does most often (look up by key, membership test, add/remove at the front) and pick the structure where that operation is $O(1)$.',
};
