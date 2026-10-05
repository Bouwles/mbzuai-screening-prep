import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'trees',
  know:
    '### What is a tree?\n\n' +
    'A **tree** stores data in a hierarchy, like a family tree or the folders on your computer. Each item is a **node**, and nodes are joined by **edges** (links). Computer scientists draw trees upside down: the **root** is at the top and the tree grows downwards.\n\n' +
    '```\n' +
    '    __A\n' +
    '   /   \\\n' +
    '  B     C\n' +
    ' / \\     \\\n' +
    'D   E     F\n' +
    '```\n\n' +
    '### The vocabulary\n\n' +
    '| Word | Meaning | In the picture |\n| --- | --- | --- |\n' +
    '| Root | the single node at the top, with no parent | A |\n' +
    '| Parent / child | a node directly above / below another, joined by an edge | B is the parent of D and E |\n' +
    '| Siblings | children of the same parent | D and E |\n' +
    '| Leaf | a node with **no** children | D, E, F |\n' +
    '| Internal node | a node with at least one child | A, B, C |\n' +
    '| Subtree | a node together with everything below it | B, D, E |\n' +
    '| Depth of a node | number of edges from the root down to it | depth of A is 0, of E is 2 |\n' +
    '| Height of the tree | number of edges on the **longest** root-to-leaf path | 2 |\n\n' +
    'Careful: some books count height in **levels** (nodes) instead of edges, which gives one more. Exam questions normally say which they mean, so read the definition. A tree with $n$ nodes always has exactly $n - 1$ edges, because every node except the root has one edge coming down into it.\n\n' +
    '### Binary trees and how many nodes fit\n\n' +
    'In a **binary tree** each node has **at most 2 children**, called the left child and the right child. Because each node can have two children, the maximum number of nodes **doubles** at each level: 1, 2, 4, 8, 16, ... With the root at level 0, level $k$ holds at most $2^k$ nodes, and a tree of height $h$ holds at most $1 + 2 + 4 + \\dots + 2^h = 2^{h+1} - 1$ nodes (a **perfect** tree, every level full).\n\n' +
    'Turning that around: the shortest possible tree with $n$ nodes has height $\\lfloor \\log_2 n \\rfloor$, and the tallest is a single chain with height $n - 1$.\n\n' +
    'A **full** binary tree is one where every node has 0 or 2 children. It always has one more leaf than internal nodes.\n\n' +
    '### Traversals: visiting every node\n\n' +
    'A traversal lists every node exactly once. The three depth-first ones differ only in **when you visit the node** compared with its two subtrees (left always comes before right):\n\n' +
    '| Traversal | Order | For the tree above |\n| --- | --- | --- |\n' +
    '| Pre-order | node, left, right | A, B, D, E, C, F |\n' +
    '| In-order | left, node, right | D, B, E, A, C, F |\n' +
    '| Post-order | left, right, node | D, E, B, F, C, A |\n' +
    '| Level-order (breadth-first) | row by row, left to right | A, B, C, D, E, F |\n\n' +
    'Quick checks: pre-order always **starts** with the root, post-order always **ends** with it, and in-order puts it straight after its whole left subtree (so in the middle, unless the root has no left child or no right child). Level-order uses a **queue**: take a node from the front, output it, add its children to the back.\n\n' +
    'To find a traversal reliably, work bottom-up: write the result for each small subtree first, then glue them together using the rule.\n\n' +
    '### Binary search trees (BSTs)\n\n' +
    'A **binary search tree** is a binary tree with an ordering rule: for every node, all keys in its **left** subtree are **smaller** and all keys in its **right** subtree are **larger**.\n\n' +
    '- **Search:** start at the root. If the key equals the node, stop. If it is smaller go left, if larger go right. Repeat until found or you fall off the tree.\n' +
    '- **Insert:** do exactly the same walk; the new key goes into the first empty spot you reach. The **order** of insertion decides the shape.\n' +
    '- **In-order traversal of a BST gives the keys in sorted order.** This is the most tested fact about BSTs.\n\n' +
    'A search makes one comparison per level, so its cost is about the height. A **balanced** BST has height about $\\log_2 n$, so searches are fast ($O(\\log n)$). But if keys are inserted already sorted, every key goes to the right and the tree becomes a chain like a linked list: the worst case is $n$ comparisons, $O(n)$. The smallest key is found by always going left; the largest by always going right.\n\n' +
    '### Heaps (the basic idea)\n\n' +
    'A **heap** is a **complete** binary tree (every level full except possibly the last, which fills from the left) with the **heap property**:\n\n' +
    '- **max-heap:** every parent is $\\ge$ its children, so the **maximum is at the root**.\n' +
    '- **min-heap:** every parent is $\\le$ its children, so the minimum is at the root.\n\n' +
    'A heap is **not** sorted and it is not a BST: left and right children have no order between them. Because it is complete, a heap is stored in a plain list, level by level. With index 0 as the root, the children of index $i$ are at $2i + 1$ and $2i + 2$, and its parent is at $\\left\\lfloor \\frac{i - 1}{2} \\right\\rfloor$.\n\n' +
    'To **insert**, put the new value at the end of the list and **sift up**: swap it with its parent while it is larger (max-heap). Removing the root moves the last element to the top and sifts it down. Both take $O(\\log n)$, which is why heaps are used for priority queues.',
  formulas: [
    { label: 'Edges in a tree', tex: '\\text{edges} = n - 1', note: 'Every node except the root has exactly one edge coming down into it.' },
    { label: 'Maximum nodes on level k (root at level 0)', tex: '2^k' },
    { label: 'Maximum nodes in a binary tree of height h', tex: '1 + 2 + 4 + \\dots + 2^h = 2^{h+1} - 1', note: 'Height counted in edges. If height is counted in levels L, the maximum is 2 to the power L, minus 1.' },
    { label: 'Minimum height of a binary tree with n nodes', tex: 'h_{\\min} = \\lfloor \\log_2 n \\rfloor', note: 'Fill every level before starting the next.' },
    { label: 'Maximum height of a binary tree with n nodes', tex: 'h_{\\max} = n - 1', note: 'The nodes form a single chain.' },
    { label: 'Full binary tree (0 or 2 children)', tex: 'L = I + 1, \\quad n = 2I + 1, \\quad L = \\frac{n + 1}{2}', note: 'L = leaves, I = internal nodes, n = all nodes.' },
    { label: 'Pre-order', tex: '\\text{node} \\to \\text{left} \\to \\text{right}', note: 'The root comes first.' },
    { label: 'In-order', tex: '\\text{left} \\to \\text{node} \\to \\text{right}', note: 'On a BST this gives the keys in ascending order.' },
    { label: 'Post-order', tex: '\\text{left} \\to \\text{right} \\to \\text{node}', note: 'The root comes last.' },
    { label: 'BST search comparisons', tex: '\\text{comparisons} = d + 1', note: 'For a key at depth d. In a balanced BST this is at most about the log base 2 of n; in the worst case (a chain) it is n.' },
    { label: 'Heap stored in a list (index 0 = root)', tex: '\\text{children of } i: 2i + 1, \\; 2i + 2 \\qquad \\text{parent of } i: \\left\\lfloor \\frac{i - 1}{2} \\right\\rfloor' },
  ],
  examples: [
    {
      title: 'Counting nodes in a binary tree',
      problem: 'Height is measured in edges. What is the maximum number of nodes in a binary tree of height 3, and what is the smallest possible height of a binary tree with 12 nodes?',
      steps: [
        'Height 3 means levels 0, 1, 2 and 3: four levels.',
        'The maximum on each level doubles: $1 + 2 + 4 + 8 = 15$. Check with the formula: $2^{3+1} - 1 = 16 - 1 = 15$.',
        'For 12 nodes: height 2 holds at most $2^3 - 1 = 7$ nodes, which is too few.',
        'Height 3 holds up to 15 nodes, which is enough, so the minimum height is 3. (Shortcut: $\\log_2 12 \\approx 3.58$, which rounds down to 3.)',
      ],
      answer: 'At most 15 nodes; the minimum height for 12 nodes is 3.',
    },
    {
      title: 'All three depth-first traversals',
      problem:
        'Find the pre-order, in-order and post-order traversals of this tree.\n\n' +
        '```\n' +
        '    __1\n' +
        '   /   \\\n' +
        '  2     3\n' +
        ' / \\     \\\n' +
        '4   5     6\n' +
        '```',
      steps: [
        'Small subtrees first. The subtree at 2 has children 4 and 5. The subtree at 3 has only a right child 6.',
        'Pre-order (node, left, right): subtree 2 gives 2, 4, 5; subtree 3 gives 3, 6. Whole tree: 1, then 2, 4, 5, then 3, 6.',
        'In-order (left, node, right): subtree 2 gives 4, 2, 5; subtree 3 gives 3, 6 (no left child, so 3 comes first). Whole tree: 4, 2, 5, then 1, then 3, 6.',
        'Post-order (left, right, node): subtree 2 gives 4, 5, 2; subtree 3 gives 6, 3. Whole tree: 4, 5, 2, then 6, 3, then 1.',
        'Sanity check: pre-order starts with the root 1 and post-order ends with it.',
      ],
      answer: 'Pre-order 1, 2, 4, 5, 3, 6; in-order 4, 2, 5, 1, 3, 6; post-order 4, 5, 2, 6, 3, 1.',
    },
    {
      title: 'Building a BST and searching it',
      problem: 'Insert 40, 20, 60, 30, 10, 50, 35 in that order into an empty BST. What is its height (in edges), and how many comparisons does a search for 35 make?',
      steps: [
        '40 is the root. 20 < 40 goes left; 60 > 40 goes right.',
        '30: $30 < 40$ so left, $30 > 20$ so right. It becomes the right child of 20.',
        '10: $10 < 40$, $10 < 20$: left child of 20. 50: $50 > 40$, $50 < 60$: left child of 60.',
        '35: $35 < 40$ left, $35 > 20$ right, $35 > 30$ right. It becomes the right child of 30.',
        'The tree:\n\n```\n     _______40___\n    /            \\\n  _20___         _60\n /      \\       /\n10       30    50\n           \\\n            35\n```',
        'The longest root-to-leaf path is 40, 20, 30, 35: 3 edges, so the height is 3.',
        'Searching for 35 compares 40, 20, 30 and 35: 4 comparisons (depth 3, plus 1).',
      ],
      answer: 'Height 3; the search makes 4 comparisons.',
    },
    {
      title: 'Inserting into a max-heap stored in a list',
      problem: 'The max-heap `[50, 30, 40, 10, 20]` (index 0 is the root) has 45 inserted. What is the list afterwards?',
      steps: [
        'Append 45 at the end, index 5: `[50, 30, 40, 10, 20, 45]`.',
        'Its parent is at index $\\left\\lfloor \\frac{5 - 1}{2} \\right\\rfloor = 2$, which holds 40. Since $45 > 40$, swap: `[50, 30, 45, 10, 20, 40]`.',
        'Now 45 is at index 2; its parent is index $\\left\\lfloor \\frac{1}{2} \\right\\rfloor = 0$, which holds 50. Since $45 < 50$, stop.',
        'Check the heap property: 50 is at least 30 and 45; 30 is at least 10 and 20; 45 is at least 40. Valid.',
      ],
      answer: '`[50, 30, 45, 10, 20, 40]`',
    },
  ],
  traps: [
    '**Edges versus levels.** Height and depth are usually counted in edges, so a single node has height 0. Counting nodes instead gives an answer one too big, and that wrong answer is always one of the options. Read how the question defines height.',
    '**Mixing up the traversals.** Pre-order is not "the reverse of post-order". Use the root as a quick test: first in pre-order, last in post-order, and right after its left subtree for in-order.',
    '**Assuming a BST is balanced.** The shape depends on the insertion order. Inserting sorted keys makes a chain, so worst-case search is $n$ comparisons, not $\\log_2 n$. Always build the tree from the given order.',
    '**Stopping BST insertion too early.** A new key does not attach to the first node where you turn; keep comparing until you reach an empty spot.',
    '**Thinking a heap is sorted, or is a BST.** A max-heap only promises that each parent is at least as big as its children. The largest value is at the root, but the rest of the list is not in order, and left/right have no meaning.',
    '**Off-by-one in heap indices.** With index 0 as the root, children are at $2i + 1$ and $2i + 2$. The formulas $2i$ and $2i + 1$ are for lists that start at index 1.',
  ],
  examTip:
    'Tree questions come as "which list is the traversal?", "what is the height / how many nodes?", "where does this key go in the BST?" or "what does this recursive function return?". To eliminate fast:\n\n' +
    '- **Traversals:** look only at the first and last items. Pre-order starts with the root and post-order ends with it, which usually kills two options at once. For a BST, the in-order list must be sorted.\n' +
    '- **Counting questions:** the wrong options are almost always off by one ($2^h$ versus $2^{h+1} - 1$, levels versus edges). Test your formula on a tiny tree (a root with two children: height 1, 3 nodes) before trusting it.\n' +
    '- **BST questions:** sketch the tree quickly from the insertion order; it takes about 20 seconds and avoids guessing the shape.\n' +
    '- **Recursive functions:** evaluate the leaves first (what does the function return for an empty tree and for a leaf?), then work upwards. "1 + max(left, right)" with 0 for empty counts levels; "1 + left + right" counts nodes.\n' +
    '- **Heaps:** check each option against the heap property (parent at least as big as each child, using $2i + 1$ and $2i + 2$).',
};
