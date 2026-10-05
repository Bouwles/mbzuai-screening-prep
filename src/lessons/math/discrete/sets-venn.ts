import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'sets-venn',
  know:
    '### What is a set?\n\n' +
    'A **set** is a collection of distinct objects, called its **elements**. We list them inside curly brackets: $A = \\{2, 4, 6, 8\\}$. Order does not matter and repeats are ignored, so $\\{1, 2, 3\\}$ and $\\{3, 1, 2, 2\\}$ are the same set.\n\n' +
    '- $4 \\in A$ means "4 **is an element of** $A$"; $5 \\notin A$ means "5 is not in $A$".\n' +
    '- $n(A)$ (also written $|A|$) is the **cardinality**: the number of elements. Here $n(A) = 4$.\n' +
    '- $\\varnothing$ is the **empty set**, with $n(\\varnothing) = 0$.\n' +
    '- The **universal set** $U$ contains everything being talked about in the question.\n\n' +
    '**Set-builder notation** describes a set by a rule: $\\{x \\in \\mathbb{Z} : 1 \\le x < 5\\}$ means "integers $x$ with $1 \\le x < 5$", which is $\\{1, 2, 3, 4\\}$. Read $\\le$ (end included) and $<$ (end excluded) carefully. Whole numbers from $a$ to $b$ inclusive: there are $b - a + 1$ of them.\n\n' +
    '### The four basic operations\n\n' +
    '| Symbol | Name | Meaning | Key word |\n' +
    '|---|---|---|---|\n' +
    '| $A \\cup B$ | union | in $A$ or $B$ (or both) | OR |\n' +
    '| $A \\cap B$ | intersection | in both $A$ and $B$ | AND |\n' +
    "| $A'$ | complement | in $U$ but not in $A$ | NOT |\n" +
    '| $A \\setminus B$ | difference | in $A$ but not in $B$ | BUT NOT |\n\n' +
    "Example: $U = \\{1, \\dots, 8\\}$, $A = \\{1, 2, 3, 4\\}$, $B = \\{3, 4, 5, 6\\}$. Then $A \\cup B = \\{1, 2, 3, 4, 5, 6\\}$, $A \\cap B = \\{3, 4\\}$, $A' = \\{5, 6, 7, 8\\}$, $A \\setminus B = \\{1, 2\\}$ and $B \\setminus A = \\{5, 6\\}$. Note that $A \\setminus B \\ne B \\setminus A$: order matters. Also $A \\setminus B = A \\cap B'$.\n\n" +
    'The **symmetric difference** is "in exactly one of the sets": $(A \\cup B) \\setminus (A \\cap B) = \\{1, 2, 5, 6\\}$. If $A \\cap B = \\varnothing$ the sets are **disjoint** (no overlap).\n\n' +
    "**Brackets first**, like in arithmetic: for $(A \\cup B)'$, find the union, then take everything outside it.\n\n" +
    '### De Morgan\'s laws\n\n' +
    "$(A \\cup B)' = A' \\cap B'$ (not in either = outside both) and $(A \\cap B)' = A' \\cup B'$ (not in both = missing from at least one). Flip the symbol and put a dash on each set.\n\n" +
    '### Subsets\n\n' +
    '$A \\subseteq B$ means every element of $A$ is also in $B$ (circle $A$ sits inside circle $B$). A **proper** subset $A \\subset B$ is a subset that is not the whole of $B$. Two facts that are always true: $\\varnothing \\subseteq A$ and $A \\subseteq A$.\n\n' +
    'Do not mix up $\\in$ and $\\subseteq$: $1 \\in \\{1, 2\\}$ (element) but $\\{1\\} \\subseteq \\{1, 2\\}$ (set inside set).\n\n' +
    'If $A \\subseteq B$ then $A \\cap B = A$ and $A \\cup B = B$.\n\n' +
    '### How many subsets?\n\n' +
    'To build a subset of a set with $n$ elements, decide for each element: **in** or **out**. That is 2 choices, $n$ times, so there are $2^{n}$ subsets. For $\\{a, b, c\\}$: $\\varnothing$, $\\{a\\}$, $\\{b\\}$, $\\{c\\}$, $\\{a, b\\}$, $\\{a, c\\}$, $\\{b, c\\}$, $\\{a, b, c\\}$, which is $2^{3} = 8$.\n\n' +
    '- Proper subsets: $2^{n} - 1$ (drop the set itself).\n' +
    '- Non-empty proper subsets: $2^{n} - 2$.\n' +
    '- Elements that are **forced** in or out have only 1 choice: with $k$ free elements the count is $2^{k}$.\n' +
    '- "At least one ..." is fastest by complement: all subsets minus the subsets with none.\n\n' +
    '### Venn diagrams and inclusion-exclusion\n\n' +
    'Two overlapping circles inside a rectangle ($U$) make **4 regions**: $A$ only, both, $B$ only, neither. If you add $n(A) + n(B)$, the overlap is counted twice, so subtract it once:\n\n' +
    '$$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$$\n\n' +
    'Three circles make **8 regions**. Adding the three sets counts each pair overlap twice, so subtract the pairs; but then the centre (in all three) has been added 3 times and subtracted 3 times, so add it back:\n\n' +
    '$$n(A \\cup B \\cup C) = \\Sigma\\,n(\\text{singles}) - \\Sigma\\,n(\\text{pairs}) + n(A \\cap B \\cap C)$$\n\n' +
    '### The fool-proof method for word problems\n\n' +
    '1. Draw the circles and the rectangle.\n' +
    '2. Fill in from the **centre outwards**: all three first, then "two only" regions (pair total minus centre), then "one only" regions.\n' +
    '3. Put the "neither" number outside the circles.\n' +
    '4. Check that all regions add up to the total.\n\n' +
    'If a number is unknown, call it $x$, write every region in terms of $x$, and make the regions add up to $n(U)$.\n\n' +
    'Probability links straight in: $P(A) = \\frac{n(A)}{n(U)}$ when everyone is equally likely to be picked, so a Venn diagram of counts becomes a probability by dividing by the total.\n\n' +
    '### Sets in Python\n\n' +
    'Python has a built-in `set` type: `{1, 2, 3}`. Operators: `A | B` union, `A & B` intersection, `A - B` difference, `A ^ B` symmetric difference, `len(A)` cardinality, `x in A` membership. Duplicates are removed automatically, so `len({1, 1, 2})` is 2.',
  formulas: [
    { label: 'Union (two sets)', tex: 'n(A \\cup B) = n(A) + n(B) - n(A \\cap B)', note: 'Subtract the overlap once because it was counted twice.' },
    {
      label: 'Union (three sets)',
      tex: 'n(A \\cup B \\cup C) = n(A) + n(B) + n(C) - n(A \\cap B) - n(A \\cap C) - n(B \\cap C) + n(A \\cap B \\cap C)',
      note: 'Add the singles, subtract the pairs, add back the triple.',
    },
    { label: 'Complement', tex: "n(A') = n(U) - n(A)" },
    { label: 'Neither', tex: "n(A' \\cap B') = n(U) - n(A \\cup B)" },
    { label: 'Exactly one of two', tex: 'n(A) + n(B) - 2\\,n(A \\cap B)' },
    { label: 'Only A (two sets)', tex: 'n(A \\setminus B) = n(A) - n(A \\cap B)' },
    { label: 'Only A (three sets)', tex: 'n(A) - n(A \\cap B) - n(A \\cap C) + n(A \\cap B \\cap C)' },
    { label: 'Difference', tex: "A \\setminus B = A \\cap B'", note: 'In $A$ but not in $B$; order matters.' },
    { label: "De Morgan's laws", tex: "(A \\cup B)' = A' \\cap B', \\qquad (A \\cap B)' = A' \\cup B'" },
    { label: 'Number of subsets', tex: '2^{n}', note: 'For a set with $n$ elements; includes $\\varnothing$ and the set itself.' },
    { label: 'Proper / non-empty proper subsets', tex: '2^{n} - 1, \\qquad 2^{n} - 2' },
    { label: 'Integers from a to b inclusive', tex: 'b - a + 1' },
    { label: 'Over-count identity (three sets)', tex: 'n(A) + n(B) + n(C) = e_1 + 2e_2 + 3e_3', note: '$e_k$ = number of elements in exactly $k$ of the sets.' },
  ],
  examples: [
    {
      title: 'Set operations from lists',
      problem: "$U = \\{1, 2, \\dots, 10\\}$, $A = \\{1, 2, 3, 4, 5\\}$, $B = \\{2, 4, 6, 8\\}$. Find $A \\cap B$, $A \\setminus B$ and $(A \\cup B)'$.",
      steps: [
        '$A \\cap B$: elements in both. Check each element of $A$ against $B$: only $2$ and $4$ appear in both, so $A \\cap B = \\{2, 4\\}$.',
        '$A \\setminus B$: start with $A$ and cross out $2$ and $4$, leaving $\\{1, 3, 5\\}$.',
        '$A \\cup B = \\{1, 2, 3, 4, 5, 6, 8\\}$.',
        "$(A \\cup B)'$: everything in $U$ not in the union, so remove $1, 2, 3, 4, 5, 6, 8$ from $U$, leaving $\\{7, 9, 10\\}$.",
      ],
      answer: "$A \\cap B = \\{2, 4\\}$, $A \\setminus B = \\{1, 3, 5\\}$, $(A \\cup B)' = \\{7, 9, 10\\}$",
    },
    {
      title: 'Two-set word problem',
      problem: 'In a group of 50 students, 28 play chess, 20 play tennis and 9 play neither. How many play both?',
      steps: [
        'Students who play at least one of the two games: $50 - 9 = 41$.',
        'Inclusion-exclusion: $41 = 28 + 20 - n(C \\cap T) = 48 - n(C \\cap T)$.',
        'So $n(C \\cap T) = 48 - 41 = 7$.',
        'Check the four regions: chess only $= 28 - 7 = 21$, both $= 7$, tennis only $= 20 - 7 = 13$, neither $= 9$; $21 + 7 + 13 + 9 = 50$.',
      ],
      answer: '$7$ students play both.',
    },
    {
      title: 'Counting subsets with a condition',
      problem: 'How many subsets of $\\{1, 2, 3, 4, 5, 6\\}$ contain at least one even number?',
      steps: [
        'All subsets: $2^{6} = 64$.',
        'Subsets with **no** even number use only the odd numbers $\\{1, 3, 5\\}$: $2^{3} = 8$ (including $\\varnothing$).',
        'At least one even $=$ all $-$ none $= 64 - 8 = 56$.',
      ],
      answer: '$56$',
    },
    {
      title: 'Three-set problem (exam level)',
      problem:
        'Of 80 people, 40 like tea, 35 like coffee and 30 like juice. 15 like tea and coffee, 12 like tea and juice, 10 like coffee and juice, and 6 like all three (each pair count includes the 6). How many like none of the drinks, and how many like tea only?',
      steps: [
        'Add the singles: $40 + 35 + 30 = 105$.',
        'Subtract the pairs: $15 + 12 + 10 = 37$, so $105 - 37 = 68$.',
        'Add back the triple: $68 + 6 = 74$ like at least one drink.',
        'None: $80 - 74 = 6$.',
        'Tea only: pair-only regions touching tea are $15 - 6 = 9$ and $12 - 6 = 6$, so tea only $= 40 - 9 - 6 - 6 = 19$.',
        'Shortcut check: $40 - 15 - 12 + 6 = 19$.',
      ],
      answer: '$6$ like none; $19$ like tea only.',
    },
  ],
  traps: [
    'Forgetting to subtract the overlap: $n(A \\cup B)$ is **not** $n(A) + n(B)$ unless the sets are disjoint.',
    'Forgetting the "neither" group: subtract it from the total **before** using inclusion-exclusion, or you will get the wrong overlap.',
    'Three sets: forgetting to **add back** the centre. After adding the singles and subtracting the pairs, the elements in all three have not been counted at all.',
    'Treating a pair total like "Maths and Physics = 10" as the "two only" region. Unless the question says "only", it **includes** the people in all three, so subtract the centre first.',
    'Mixing up $\\in$ and $\\subseteq$, or $A \\setminus B$ and $B \\setminus A$. Also $\\varnothing$ is a subset of every set, but not usually an element.',
    'Number of subsets: it is $2^{n}$, not $n^{2}$ or $2n$, and it already includes $\\varnothing$ and the set itself.',
  ],
  examTip:
    'Most Venn questions on the exam are 2- or 3-set word problems with options built from the classic slips: the answer you get if you forget the overlap, forget the "neither" group, forget to add back the centre, or answer "at least one" instead of "exactly one". So read the last sentence twice and underline the exact region asked for (both, only, exactly one, neither). Sketch the circles and fill from the centre outwards; it takes 20 seconds and makes the final check (all regions add up to the total) almost free. For a three-set problem, type the whole inclusion-exclusion line into your calculator in one go. For subset counts, remember the powers of 2 ($2^{5} = 32$, $2^{6} = 64$, $2^{10} = 1024$). For a plain "how many subsets" question the answer is exactly a power of 2; options like $2^{n} - 1$ and $2^{n} - 2$ are traps unless the question says "proper" or "non-empty". When unsure, plug an option back in: put it in the Venn diagram and see if the totals work.',
};
