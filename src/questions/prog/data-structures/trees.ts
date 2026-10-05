import type { StaticQuestion } from '../../../types';

// ---------------------------------------------------------------- tiny tree toolkit
// Each tree below is defined ONCE; the same structure draws the picture shown to the
// student and drives the independent answer checks, so the two can never disagree.

type Key = string | number;
type T = { v: Key; l?: T; r?: T };
const N = (v: Key, l?: T, r?: T): T => ({ v, l, r });

const pre = (t?: T): Key[] => (t ? [t.v, ...pre(t.l), ...pre(t.r)] : []);
const ino = (t?: T): Key[] => (t ? [...ino(t.l), t.v, ...ino(t.r)] : []);
const post = (t?: T): Key[] => (t ? [...post(t.l), ...post(t.r), t.v] : []);
function levelOrder(t: T): Key[] {
  const out: Key[] = [];
  const queue: T[] = [t];
  while (queue.length) {
    const x = queue.shift()!;
    out.push(x.v);
    if (x.l) queue.push(x.l);
    if (x.r) queue.push(x.r);
  }
  return out;
}
/** Height in edges (empty tree = -1, single node = 0). */
const height = (t?: T): number => (t ? 1 + Math.max(height(t.l), height(t.r)) : -1);
const allNodes = (t?: T): T[] => (t ? [t, ...allNodes(t.l), ...allNodes(t.r)] : []);
const seq = (xs: Key[]) => xs.join(', ');

function bst(keys: number[]): T {
  const root = N(keys[0]);
  for (const k of keys.slice(1)) {
    let cur = root;
    for (;;) {
      const side = k < (cur.v as number) ? 'l' : 'r';
      const next = cur[side];
      if (!next) {
        cur[side] = N(k);
        break;
      }
      cur = next;
    }
  }
  return root;
}

/** ASCII drawing of a binary tree (underscore style). */
function box(t?: T): { lines: string[]; width: number; start: number; end: number } {
  if (!t) return { lines: [], width: 0, start: 0, end: 0 };
  const label = String(t.v);
  const w = label.length;
  let gap = w;
  let line1 = '';
  let line2 = '';
  const L = box(t.l);
  const R = box(t.r);
  let start = 0;
  if (L.width > 0) {
    const lr = Math.floor((L.start + L.end) / 2) + 1;
    line1 += ' '.repeat(lr + 1) + '_'.repeat(L.width - lr);
    line2 += ' '.repeat(lr) + '/' + ' '.repeat(L.width - lr);
    start = L.width + 1;
    gap += 1;
  }
  line1 += label;
  line2 += ' '.repeat(w);
  if (R.width > 0) {
    const rr = Math.floor((R.start + R.end) / 2);
    line1 += '_'.repeat(rr) + ' '.repeat(R.width - rr + 1);
    line2 += ' '.repeat(rr) + '\\' + ' '.repeat(R.width - rr);
    gap += 1;
  }
  const lines = [line1, line2];
  for (let i = 0; i < Math.max(L.lines.length, R.lines.length); i++) {
    const a = i < L.lines.length ? L.lines[i] : ' '.repeat(L.width);
    const b = i < R.lines.length ? R.lines[i] : ' '.repeat(R.width);
    lines.push(a + ' '.repeat(gap) + b);
  }
  return { lines, width: lines[0].length, start, end: start + w - 1 };
}
function draw(t: T): string {
  const lines = box(t).lines.map((l) => l.replace(/\s+$/, ''));
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
}
const fence = (s: string) => '```\n' + s + '\n```';

// ---------------------------------------------------------------- the trees used below
const T001 = N('A', N('B', N('D'), N('E', N('G'), N('H'))), N('C', undefined, N('F', undefined, N('I'))));
const T004 = N('P', N('Q', N('S', undefined, N('V', undefined, N('W')))), N('R', N('T'), N('U')));
const T006 = N('M', N('F', N('B'), N('H', N('G'))), N('T', N('P'), N('W')));
const T007 = N(1, N(2, N(4), N(5, undefined, N(7))), N(3, undefined, N(6, N(8))));
const T008 = N(10, N(6, N(3), N(8, N(7), N(9))), N(15, undefined, N(20, N(17))));
const T011 = N(40, N(25, N(10), N(30, N(28), N(35))), N(60, N(50), N(75, undefined, N(90))));
const T015 = N('A', N('B', N('D', N('F')), N('E')), N('C'));

const Q009_KEYS = [50, 30, 70, 20, 40, 60, 80, 35];
const Q017_KEYS = [30, 10, 50, 20, 40, 25, 22, 60];
const Q016_PRE = ['K', 'D', 'B', 'G', 'E', 'H', 'P', 'S', 'Q'];
const Q016_IN = ['B', 'D', 'E', 'G', 'H', 'K', 'P', 'Q', 'S'];
const Q013_HEAP = [95, 80, 90, 45, 70, 85, 60, 20, 30, 65];
const Q019_HEAP = [90, 70, 80, 40, 60, 50, 30, 20];

const NODE_CLASS =
  'class Node:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n';

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------ foundation
  {
    id: 'trees-001',
    subtopic: 'trees',
    difficulty: 'foundation',
    stem: 'How many **leaves** does the binary tree below have?',
    code: { lang: 'pseudocode', source: draw(T001) },
    options: ['5', '4', '3', '6'],
    correctIndex: 1,
    markScheme: {
      solution:
        'A **leaf** is a node with **no children** at all. Check every node:\n\n' +
        '| Node | Children | Leaf? |\n| --- | --- | --- |\n' +
        '| A | B and C | no |\n| B | D and E | no |\n| C | F | no |\n| D | none | **yes** |\n| E | G and H | no |\n' +
        '| F | I | no |\n| G | none | **yes** |\n| H | none | **yes** |\n| I | none | **yes** |\n\n' +
        'The leaves are D, G, H and I. Notice D is a leaf even though it is not on the bottom row.\n\n' +
        'Answer: 4',
      whyWrong: [
        'This counts the **internal** nodes (A, B, C, E, F), the nodes that do have children, instead of the leaves.',
        null,
        'This only counts the nodes on the bottom row (G, H, I) and misses D, which also has no children even though it sits higher up.',
        'This also counts C and F as leaves because they have only one child. A node with one child is still an internal node; a leaf has no children.',
      ],
      keyIdea: 'A leaf is any node with zero children, wherever it sits in the tree.',
    },
    check: { optionValues: [5, 4, 3, 6], compute: () => allNodes(T001).filter((n) => !n.l && !n.r).length },
  },
  {
    id: 'trees-002',
    subtopic: 'trees',
    difficulty: 'foundation',
    stem: 'In a binary tree the root is at **level 0**, its children are at level 1, their children at level 2, and so on. What is the **maximum** number of nodes that can be at **level 4**?',
    options: ['16', '8', '31', '32'],
    correctIndex: 0,
    markScheme: {
      solution:
        'In a binary tree every node has **at most 2 children**, so the maximum number of nodes doubles from one level to the next:\n\n' +
        '| Level | Max nodes |\n| --- | --- |\n| 0 | 1 |\n| 1 | 2 |\n| 2 | 4 |\n| 3 | 8 |\n| 4 | 16 |\n\n' +
        'In general level $k$ holds at most $2^k$ nodes, and $2^4 = 16$.\n\n' +
        'Answer: 16',
      whyWrong: [
        null,
        'This treats the root as level 1, so it only doubles three times ($2^3 = 8$). With the root at level 0, level 4 needs four doublings: $2^4$.',
        'This is the maximum number of nodes in the **whole tree** from level 0 to level 4 ($1 + 2 + 4 + 8 + 16 = 31$), not on level 4 alone.',
        'This doubles one time too many: $2^5 = 32$ is the maximum for level 5.',
      ],
      keyIdea: 'With the root at level 0, level $k$ of a binary tree holds at most $2^k$ nodes.',
    },
    check: {
      optionValues: [16, 8, 31, 32],
      compute: () => {
        let count = 1; // level 0
        for (let level = 1; level <= 4; level++) count *= 2; // each node has at most 2 children
        return count;
      },
    },
  },
  {
    id: 'trees-003',
    subtopic: 'trees',
    difficulty: 'foundation',
    stem: 'Which traversal of a **binary search tree** (BST) always visits the keys in ascending order (smallest to largest)?',
    options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'],
    correctIndex: 2,
    markScheme: {
      solution:
        'In a BST, for every node: all keys in its **left** subtree are smaller, and all keys in its **right** subtree are larger.\n\n' +
        'In-order traversal visits **left subtree, then the node, then right subtree**. So at every node the smaller keys are output first, then the node itself, then the larger keys. Applied recursively, this lists every key in ascending order.\n\n' +
        'Example: a BST with root 5, left child 3 and right child 8.\n\n' +
        '- In-order: 3, 5, 8 (sorted)\n- Pre-order: 5, 3, 8\n- Post-order: 3, 8, 5\n- Level-order: 5, 3, 8\n\n' +
        'Answer: In-order',
      whyWrong: [
        'Pre-order outputs the root **first**, before the smaller keys in its left subtree, so the output starts with the root, which is usually not the smallest key.',
        'Post-order outputs the root **last**, after the larger keys in its right subtree, so the output is not sorted.',
        null,
        'Level-order goes row by row from the top. A key deep in the left subtree can be smaller than a key higher up on the right, so the output is not sorted.',
      ],
      keyIdea: 'In-order (left, node, right) on a BST outputs the keys in sorted order.',
    },
  },
  {
    id: 'trees-004',
    subtopic: 'trees',
    difficulty: 'foundation',
    stem: 'The **height** of a tree is the number of **edges** on the longest path from the root down to a leaf (so a tree with only a root has height 0). What is the height of the binary tree below?',
    code: { lang: 'pseudocode', source: draw(T004) },
    options: ['5', '2', '7', '4'],
    correctIndex: 3,
    markScheme: {
      solution:
        'List the root-to-leaf paths and count the **edges** (the links), not the nodes:\n\n' +
        '- P to Q to S to V to W: 4 edges\n- P to R to T: 2 edges\n- P to R to U: 2 edges\n\n' +
        'The longest path has 4 edges, so the height is 4. (Equivalently: W is at depth 4, the deepest node.)\n\n' +
        'Answer: 4',
      whyWrong: [
        'This counts the **nodes** on the longest path (P, Q, S, V, W) instead of the edges between them. With the definition given, a single node has height 0, so you count links.',
        'This is the **shortest** root-to-leaf path (P to R to T). Height uses the **longest** path.',
        'This is the total number of edges in the whole tree (8 nodes, so $8 - 1 = 7$ edges), not the length of the longest path.',
        null,
      ],
      keyIdea: 'Height = number of edges on the longest root-to-leaf path = depth of the deepest node.',
    },
    check: { optionValues: [5, 2, 7, 4], compute: () => height(T004) },
  },
  {
    id: 'trees-005',
    subtopic: 'trees',
    difficulty: 'foundation',
    stem: 'In a **max-heap**, where is the largest value always found?',
    options: [
      'At the root',
      'At the rightmost node, found by following right children from the root',
      'At the last position of the array that stores the heap',
      'At a leaf on the bottom level',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'A max-heap is a complete binary tree with the **heap property**: every parent is greater than or equal to each of its children.\n\n' +
        'Follow any path from a leaf up to the top: the values never decrease as you go up. Every path ends at the root, so the root is at least as large as every other node.\n\n' +
        'That is why a heap is used as a priority queue: the maximum is always available at the root (index 0 of the array).\n\n' +
        'Answer: At the root',
      whyWrong: [
        null,
        'That is where the largest key is in a **binary search tree**, not a heap. A heap only orders parents above children; it says nothing about left versus right.',
        'This assumes the heap array is sorted in ascending order. A heap array is not sorted; only the first element (the root) is guaranteed to be the maximum.',
        'This is backwards: in a max-heap values never increase as you go down, so a node on the bottom level can never be larger than the nodes above it, including the root.',
      ],
      keyIdea: 'Heap property: in a max-heap every parent is at least as large as its children, so the maximum sits at the root.',
    },
  },

  // ------------------------------------------------------------ exam
  {
    id: 'trees-006',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'What is the **pre-order** traversal of the binary tree below?',
    code: { lang: 'pseudocode', source: draw(T006) },
    options: [seq(ino(T006)), seq(post(T006)), seq(pre(T006)), seq(levelOrder(T006))],
    correctIndex: 2,
    markScheme: {
      solution:
        'Pre-order means: **visit the node first**, then traverse its left subtree, then its right subtree.\n\n' +
        '1. Visit M. Go to its left subtree (rooted at F).\n' +
        '2. Visit F. Go to its left subtree: visit B (a leaf).\n' +
        '3. Back to F, now its right subtree (rooted at H): visit H, then its left child G.\n' +
        '4. The whole left subtree of M is done: M, F, B, H, G. Now the right subtree of M (rooted at T).\n' +
        '5. Visit T, then its left child P, then its right child W.\n\n' +
        'Answer: M, F, B, H, G, T, P, W',
      whyWrong: [
        'This is the **in-order** traversal (left, node, right). Pre-order visits each node **before** its subtrees, so it must start with the root M.',
        'This is the **post-order** traversal (left, right, node), which ends with the root rather than starting with it.',
        null,
        'This is the **level-order** (breadth-first) traversal, row by row. Pre-order goes deep first: after F it visits all of the subtree under F before moving to T.',
      ],
      keyIdea: 'Pre-order = node, left subtree, right subtree; the root always comes first.',
    },
    check: {
      optionValues: [seq(ino(T006)), seq(post(T006)), seq(pre(T006)), seq(levelOrder(T006))],
      compute: () => seq(pre(T006)),
    },
  },
  {
    id: 'trees-007',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'What is the **post-order** traversal of the binary tree below?',
    code: { lang: 'pseudocode', source: draw(T007) },
    options: ['1, 2, 4, 5, 7, 3, 6, 8', '4, 7, 5, 2, 8, 6, 3, 1', '4, 2, 5, 7, 1, 3, 8, 6', '8, 6, 3, 7, 5, 4, 2, 1'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Post-order means: traverse the **left subtree**, then the **right subtree**, then **visit the node** last. Work out each subtree first:\n\n' +
        '- Subtree at 5: 5 has no left child and right child 7, so it gives 7, 5.\n' +
        '- Subtree at 2: left (4), then right (7, 5), then 2, giving 4, 7, 5, 2.\n' +
        '- Subtree at 6: left child 8, no right child, so it gives 8, 6.\n' +
        '- Subtree at 3: no left child, right gives 8, 6, then 3, giving 8, 6, 3.\n' +
        '- Whole tree: left (4, 7, 5, 2), right (8, 6, 3), then the root 1.\n\n' +
        'Answer: 4, 7, 5, 2, 8, 6, 3, 1',
      whyWrong: [
        'This is the **pre-order** traversal (node first). In post-order the root 1 must come **last**.',
        null,
        'This is the **in-order** traversal (left, node, right), where the root appears in the middle.',
        'This is the pre-order traversal written backwards. Reversing pre-order gives "right, left, node", which visits the right subtree first; post-order visits the **left** subtree first.',
      ],
      keyIdea: 'Post-order = left subtree, right subtree, node; the root is always last.',
    },
    check: {
      optionValues: ['1, 2, 4, 5, 7, 3, 6, 8', '4, 7, 5, 2, 8, 6, 3, 1', '4, 2, 5, 7, 1, 3, 8, 6', '8, 6, 3, 7, 5, 4, 2, 1'],
      compute: () => seq(post(T007)),
    },
  },
  {
    id: 'trees-008',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'What is the **level-order** (breadth-first) traversal of the binary tree below?',
    code: { lang: 'pseudocode', source: draw(T008) },
    options: ['10, 6, 3, 8, 7, 9, 15, 20, 17', '3, 6, 7, 8, 9, 10, 15, 17, 20', '10, 15, 6, 20, 8, 3, 17, 9, 7', '10, 6, 15, 3, 8, 20, 7, 9, 17'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Level-order visits the tree **one level at a time from the top**, and **left to right** within each level. It is usually done with a queue: take a node from the front, output it, and add its children (left, then right) to the back.\n\n' +
        '- Level 0: 10\n- Level 1: 6, 15\n- Level 2: 3, 8 (children of 6), then 20 (child of 15)\n- Level 3: 7, 9 (children of 8), then 17 (child of 20)\n\n' +
        'Answer: 10, 6, 15, 3, 8, 20, 7, 9, 17',
      whyWrong: [
        'This is the **pre-order** (depth-first) traversal: it goes all the way down the left side before visiting 15. Level-order finishes each whole level before going deeper.',
        'This is the **in-order** traversal, which for this BST gives the keys in sorted order.',
        'This goes level by level but **right to left** within each level. Standard level-order reads each level left to right.',
        null,
      ],
      keyIdea: 'Level-order (BFS) uses a queue and outputs the tree row by row, left to right.',
    },
    check: {
      optionValues: ['10, 6, 3, 8, 7, 9, 15, 20, 17', '3, 6, 7, 8, 9, 10, 15, 17, 20', '10, 15, 6, 20, 8, 3, 17, 9, 7', '10, 6, 15, 3, 8, 20, 7, 9, 17'],
      compute: () => seq(levelOrder(T008)),
    },
  },
  {
    id: 'trees-009',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'The keys 50, 30, 70, 20, 40, 60, 80, 35 are inserted, **in that order**, into an empty binary search tree. Which node is the **parent** of 35?',
    options: ['40', '30', '20', '60'],
    correctIndex: 0,
    markScheme: {
      solution:
        'To insert a key, start at the root and go **left if the key is smaller, right if it is larger**, until you reach an empty spot.\n\n' +
        '1. 50 becomes the root.\n2. 30 < 50: left child of 50.\n3. 70 > 50: right child of 50.\n4. 20 < 50, 20 < 30: left child of 30.\n' +
        '5. 40 < 50, 40 > 30: right child of 30.\n6. 60 > 50, 60 < 70: left child of 70.\n7. 80 > 50, 80 > 70: right child of 70.\n' +
        '8. 35 < 50 (go left to 30), 35 > 30 (go right to 40), 35 < 40 (go left: empty). So 35 becomes the **left child of 40**.\n\n' +
        fence(draw(bst(Q009_KEYS))) +
        '\n\nAnswer: 40',
      whyWrong: [
        null,
        'This stops one step too early. At 30 you go right, but that spot is already taken by 40, so you must keep comparing: 35 < 40, so 35 goes below 40.',
        'This goes the wrong way at 30. Since 35 > 30, the search must go **right** (towards 40), not left towards 20.',
        'This goes the wrong way at the root. Since 35 < 50, the search must go **left**; going right leads to 70 and then 60.',
      ],
      keyIdea: 'BST insertion follows the search path (smaller: left, larger: right) and attaches the new key at the first empty spot.',
    },
    check: {
      optionValues: [40, 30, 20, 60],
      compute: () => {
        const tree = bst(Q009_KEYS);
        const parent = allNodes(tree).find((n) => n.l?.v === 35 || n.r?.v === 35)!;
        return parent.v as number;
      },
    },
  },
  {
    id: 'trees-010',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'The height of a binary tree is the number of edges on the longest path from the root to a leaf (a single node has height 0). What is the **maximum** number of nodes in a binary tree of height 4?',
    options: ['16', '15', '31', '32'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A tree of height 4 has levels 0, 1, 2, 3 and 4 (five levels). The most nodes you can fit is when every level is completely full:\n\n' +
        '$$1 + 2 + 4 + 8 + 16 = 31$$\n\n' +
        'This matches the formula for the maximum number of nodes in a binary tree of height $h$:\n\n' +
        '$$2^{h+1} - 1 = 2^5 - 1 = 32 - 1 = 31$$\n\n' +
        'Answer: 31',
      whyWrong: [
        'This is only the maximum on the **bottom level** (level 4 holds at most $2^4 = 16$ nodes); it forgets all the levels above it.',
        'This treats height 4 as four levels (0 to 3), giving $2^4 - 1 = 15$. With height measured in edges, height 4 means **five** levels.',
        null,
        'This forgets to subtract 1: the formula is $2^{h+1} - 1$, not $2^{h+1}$.',
      ],
      keyIdea: 'A binary tree of height $h$ has at most $2^{h+1} - 1$ nodes (a perfect tree, every level full).',
    },
    check: {
      optionValues: [16, 15, 31, 32],
      compute: () => {
        let total = 0;
        for (let level = 0; level <= 4; level++) total += 2 ** level;
        return total;
      },
    },
  },
  {
    id: 'trees-011',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'You search the binary search tree below for the key **35**. Counting one comparison for every node whose key is compared with 35 (including the node where 35 is found), how many comparisons are made?',
    code: { lang: 'pseudocode', source: draw(T011) },
    options: ['3', '4', '5', '10'],
    correctIndex: 1,
    markScheme: {
      solution:
        'BST search starts at the root and at each node either finds the key, goes left (key is smaller) or goes right (key is larger).\n\n' +
        '| Step | Node | Comparison | Action |\n| --- | --- | --- | --- |\n' +
        '| 1 | 40 | $35 < 40$ | go left |\n| 2 | 25 | $35 > 25$ | go right |\n| 3 | 30 | $35 > 30$ | go right |\n| 4 | 35 | $35 = 35$ | found |\n\n' +
        'Four nodes are compared. (35 is at depth 3, and a search for a node at depth $d$ makes $d + 1$ comparisons.)\n\n' +
        'Answer: 4',
      whyWrong: [
        'This counts the **edges** travelled (40 to 25 to 30 to 35 is 3 moves), or forgets the final comparison that actually finds 35. The question counts every node compared.',
        null,
        'This is the position of 35 in sorted order (10, 25, 28, 30, 35): the cost of scanning the sorted keys one by one, not of a BST search.',
        'This checks every node, as if searching an unordered list. A BST lets you discard a whole subtree at each comparison.',
      ],
      keyIdea: 'A BST search compares one node per level along a single root-to-node path: $d + 1$ comparisons for a node at depth $d$.',
    },
    check: {
      optionValues: [3, 4, 5, 10],
      compute: () => {
        let comparisons = 0;
        let cur: T | undefined = T011;
        while (cur) {
          comparisons++;
          if (cur.v === 35) break;
          cur = 35 < (cur.v as number) ? cur.l : cur.r;
        }
        return comparisons;
      },
    },
  },
  {
    id: 'trees-012',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source:
        NODE_CLASS +
        '\ndef f(node):\n    if node is None:\n        return 0\n    if node.left is None and node.right is None:\n        return node.val\n    return f(node.left) + f(node.right)\n\n' +
        'root = Node(1, Node(2, Node(4), Node(5)), Node(3, None, Node(6)))\nprint(f(root))',
    },
    options: ['`21`', '`12`', '`3`', '`15`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'First draw the tree: 1 is the root; its left child 2 has children 4 and 5; its right child 3 has only a right child 6.\n\n' +
        fence(draw(N(1, N(2, N(4), N(5)), N(3, undefined, N(6))))) +
        '\n\n`f` returns 0 for an empty spot, returns the node\'s own value for a **leaf** (no left and no right child), and otherwise adds up `f` of the two children. So `f` adds up the values of the leaves only.\n\n' +
        '- `f(4) = 4`, `f(5) = 5` (leaves), so `f(2) = 4 + 5 = 9`. The value 2 itself is **not** added.\n' +
        '- `f(6) = 6` (leaf). Node 3 is not a leaf (it has a right child), so `f(3) = f(None) + f(6) = 0 + 6 = 6`.\n' +
        '- `f(1) = f(2) + f(3) = 9 + 6 = 15`.\n\n' +
        'Answer: `15`',
      whyWrong: [
        'This adds up **every** node ($1 + 2 + 3 + 4 + 5 + 6 = 21$). The function never adds the value of a node that has children; it only returns `node.val` at a leaf.',
        'This treats node 3 as a leaf because one of its children is missing, as if the test were `or`. With `and`, node 3 (which has a right child) is not a leaf, so the function continues down to 6.',
        'This counts the leaves (there are 3) instead of adding their values. At a leaf the function returns `node.val`, not 1.',
        null,
      ],
      keyIdea: 'A recursive tree function combines the results of the two subtrees; here the base cases make it sum only the leaf values.',
    },
    check: {
      optionValues: [21, 12, 3, 15],
      compute: () => {
        const t = N(1, N(2, N(4), N(5)), N(3, undefined, N(6)));
        const f = (n?: T): number => (!n ? 0 : !n.l && !n.r ? (n.v as number) : f(n.l) + f(n.r));
        return f(t);
      },
    },
    python: { stdout: '15\n' },
  },
  {
    id: 'trees-013',
    subtopic: 'trees',
    difficulty: 'exam',
    stem:
      'A max-heap is stored in a Python list in the standard way: index 0 is the root, and the tree is filled level by level, left to right.\n\n' +
      '`heap = [95, 80, 90, 45, 70, 85, 60, 20, 30, 65]`\n\nWhich value is the **right child** of 80?',
    options: ['70', '45', '90', '85'],
    correctIndex: 0,
    markScheme: {
      solution:
        'With 0-based indexing, the node at index $i$ has its left child at index $2i + 1$ and its right child at index $2i + 2$.\n\n' +
        '80 is at index $i = 1$, so:\n\n- left child: index $2 \\times 1 + 1 = 3$, which holds 45\n- right child: index $2 \\times 1 + 2 = 4$, which holds 70\n\n' +
        'You can confirm by drawing the tree row by row:\n\n' +
        fence(draw(N(95, N(80, N(45, N(20), N(30)), N(70, N(65))), N(90, N(85), N(60))))) +
        '\n\nAnswer: 70',
      whyWrong: [
        null,
        'This is the **left** child of 80 (index $2i + 1 = 3$). The right child is the next one along, at index $2i + 2 = 4$.',
        'This uses the 1-based formula $2i$ on a 0-based list: index 2 holds 90, which is actually the **sibling** of 80 (the other child of the root).',
        'This mixes the two conventions: it takes 80 as position 2 (counting from 1), uses $2i + 1 = 5$, and then reads index 5 of the 0-based list.',
      ],
      keyIdea: 'In a 0-based heap array, the children of index $i$ are at $2i + 1$ and $2i + 2$, and its parent is at $\\left\\lfloor \\frac{i - 1}{2} \\right\\rfloor$.',
    },
    check: {
      optionValues: [70, 45, 90, 85],
      compute: () => Q013_HEAP[2 * Q013_HEAP.indexOf(80) + 2],
    },
  },
  {
    id: 'trees-014',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'A binary tree has **20 nodes**. Taking the height as the number of edges on the longest root-to-leaf path, what is the **smallest possible height** of the tree?',
    options: ['5', '19', '4', '3'],
    correctIndex: 2,
    markScheme: {
      solution:
        'To make the tree as short as possible, fill each level completely before starting the next. A tree of height $h$ holds at most $2^{h+1} - 1$ nodes:\n\n' +
        '| Height $h$ | Max nodes $2^{h+1} - 1$ |\n| --- | --- |\n| 2 | 7 |\n| 3 | 15 |\n| 4 | 31 |\n\n' +
        'Height 3 can hold only 15 nodes, which is fewer than 20. Height 4 can hold up to 31, which is enough. So the smallest possible height is 4.\n\n' +
        'Shortcut: the minimum height is $\\lfloor \\log_2 n \\rfloor$, and $\\log_2 20 \\approx 4.32$, which rounds down to 4.\n\n' +
        'Answer: 4',
      whyWrong: [
        'This counts **levels** (a height-4 tree has 5 levels, 0 to 4) instead of edges.',
        'This is the **largest** possible height, when the 20 nodes form a single chain. The question asks for the smallest.',
        null,
        'This is the tallest tree that can be **completely full** with at most 20 nodes ($2^{h+1} - 1 \\le 20$), not the shortest tree that can hold all 20. A tree of height 3 holds at most $2^4 - 1 = 15$ nodes, so the other 5 nodes need one more level.',
      ],
      keyIdea: 'The shortest binary tree with $n$ nodes has height $\\lfloor \\log_2 n \\rfloor$; the tallest is a chain with height $n - 1$.',
    },
    check: {
      optionValues: [5, 19, 4, 3],
      compute: () => {
        let h = 0;
        while (2 ** (h + 1) - 1 < 20) h++;
        return h;
      },
    },
  },
  {
    id: 'trees-015',
    subtopic: 'trees',
    difficulty: 'exam',
    stem:
      'The function `mystery` is applied to the root (A) of this binary tree. What value does it return?\n\n' + fence(draw(T015)),
    code: {
      lang: 'pseudocode',
      source:
        'FUNCTION mystery(node)\n    IF node = NULL THEN\n        RETURN 0\n    END IF\n    RETURN 1 + MAX(mystery(node.left), mystery(node.right))\nEND FUNCTION',
    },
    options: ['3', '4', '6', '2'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Work from the bottom up. An empty child (NULL) gives 0, so every **leaf** gives $1 + \\max(0, 0) = 1$.\n\n' +
        '- F, E and C are leaves: each returns 1.\n' +
        '- D has left child F and no right child: $1 + \\max(1, 0) = 2$.\n' +
        '- B: $1 + \\max(\\text{mystery}(D), \\text{mystery}(E)) = 1 + \\max(2, 1) = 3$.\n' +
        '- A: $1 + \\max(\\text{mystery}(B), \\text{mystery}(C)) = 1 + \\max(3, 1) = 4$.\n\n' +
        'The function counts the number of **levels** (nodes on the longest root-to-leaf path A, B, D, F). That is the height in edges plus 1.\n\n' +
        'Answer: 4',
      whyWrong: [
        'This is the height measured in **edges**. Because NULL returns 0, a leaf returns 1, so this function counts nodes on the longest path, which is one more than the number of edges.',
        null,
        'This is the total number of nodes. That would need `1 + mystery(left) + mystery(right)`; using `MAX` follows only the deeper subtree.',
        'This follows the **shorter** branch (A to C), as if the function used `MIN`. `MAX` always takes the deeper subtree.',
      ],
      keyIdea: 'A recursive function "1 + max(left, right)" with 0 for an empty tree returns the number of levels of the tree.',
    },
    check: {
      optionValues: [3, 4, 6, 2],
      compute: () => {
        const mystery = (n?: T): number => (n ? 1 + Math.max(mystery(n.l), mystery(n.r)) : 0);
        return mystery(T015);
      },
    },
  },
  {
    id: 'trees-016',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'In the **worst case**, how many key comparisons are needed to search for a key in a binary search tree with $n$ nodes? (The tree is not guaranteed to be balanced.)',
    options: ['$n$', '$\\log_2 n$', '$\\frac{n}{2}$', '$n \\log_2 n$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A BST search follows one path down from the root, making one comparison per level, so the cost is about the **height** of the tree.\n\n' +
        'The height depends on the shape. If the keys were inserted already sorted (for example 1, 2, 3, 4, 5), every new key goes to the right of the previous one and the "tree" is a single chain:\n\n' +
        fence(draw(bst([1, 2, 3, 4, 5]))) +
        '\n\nSearching for the bottom key (or for a key larger than all of them) then compares with every one of the $n$ nodes. So the worst case is $n$ comparisons, which is $O(n)$, just like a linked list.\n\n' +
        'Only a **balanced** BST guarantees about $\\log_2 n$ comparisons.\n\n' +
        'Answer: $n$',
      whyWrong: [
        null,
        'This assumes the tree is **balanced**. An unbalanced BST can be a chain, so in the worst case every node is compared.',
        'This is roughly the **average** number of comparisons for a linear search of a list, not the worst case for a BST.',
        'This is the cost of a good **sorting** algorithm. A search makes at most one comparison per node, so it can never exceed $n$.',
      ],
      keyIdea: 'BST search costs about the height of the tree: $\\log_2 n$ if balanced, but $n$ in the worst case when the tree degenerates into a chain.',
    },
  },

  // ------------------------------------------------------------ challenge
  {
    id: 'trees-017',
    subtopic: 'trees',
    difficulty: 'challenge',
    stem:
      'A binary tree (with all labels different) has these traversals:\n\n' +
      `- Pre-order: ${seq(Q016_PRE)}\n- In-order: ${seq(Q016_IN)}\n\nWhat is its **post-order** traversal?`,
    options: ['Q, S, P, H, E, G, B, D, K', 'K, D, P, B, G, S, E, H, Q', 'Q, S, P, B, E, H, G, D, K', 'B, E, H, G, D, Q, S, P, K'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Rebuild the tree. The **first** item of pre-order is the root; in the in-order list, everything to its left is the left subtree and everything to its right is the right subtree.\n\n' +
        '1. Pre-order starts with K, so K is the root. In-order: B, D, E, G, H | K | P, Q, S. Left subtree has {B, D, E, G, H}, right subtree has {P, Q, S}.\n' +
        '2. Left subtree: the next item in pre-order is D, so D is its root. In-order B | D | E, G, H: B is the left child of D; {E, G, H} is on the right.\n' +
        '3. Of {E, G, H}, G comes first in pre-order, so G is the root of that part. In-order E | G | H: E is the left child, H the right child.\n' +
        '4. Right subtree {P, Q, S}: P comes first in pre-order, so P is its root. In-order P | Q, S: P has no left child; {Q, S} is on the right.\n' +
        '5. Of {Q, S}, S comes first in pre-order, so S is the root. In-order Q | S: Q is the left child of S.\n\n' +
        fence(draw(N('K', N('D', N('B'), N('G', N('E'), N('H'))), N('P', undefined, N('S', N('Q')))))) +
        '\n\nNow post-order (left, right, node): subtree D gives B, E, H, G, D; subtree P gives Q, S, P; then the root K.\n\n' +
        'Answer: B, E, H, G, D, Q, S, P, K',
      whyWrong: [
        'This is the pre-order list written backwards. Reversing pre-order gives "right, left, node", which visits the right subtree **before** the left one; post-order goes left first.',
        'This is the **level-order** traversal of the rebuilt tree (row by row), not post-order.',
        'This traverses the root\'s **right** subtree (Q, S, P) before its left subtree. Post-order always finishes the left subtree first.',
        null,
      ],
      keyIdea: 'Pre-order gives the root (first item); in-order splits the remaining nodes into left and right subtrees; repeat on each part.',
    },
    check: {
      optionValues: ['Q, S, P, H, E, G, B, D, K', 'K, D, P, B, G, S, E, H, Q', 'Q, S, P, B, E, H, G, D, K', 'B, E, H, G, D, Q, S, P, K'],
      compute: () => {
        const build = (p: Key[], i: Key[]): T | undefined => {
          if (!p.length) return undefined;
          const k = i.indexOf(p[0]);
          return N(p[0], build(p.slice(1, k + 1), i.slice(0, k)), build(p.slice(k + 1), i.slice(k + 1)));
        };
        return seq(post(build(Q016_PRE, Q016_IN)));
      },
    },
  },
  {
    id: 'trees-018',
    subtopic: 'trees',
    difficulty: 'challenge',
    stem:
      'The keys 30, 10, 50, 20, 40, 25, 22, 60 are inserted, **in that order**, into an empty binary search tree. Taking height as the number of edges on the longest root-to-leaf path, what is the height of the resulting tree?',
    options: ['4', '3', '5', '7'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Insert each key by going left if smaller, right if larger:\n\n' +
        '1. 30 is the root.\n2. 10 < 30: left child of 30.\n3. 50 > 30: right child of 30.\n4. 20: < 30, > 10: right child of 10.\n' +
        '5. 40: > 30, < 50: left child of 50.\n6. 25: < 30, > 10, > 20: right child of 20.\n7. 22: < 30, > 10, > 20, < 25: left child of 25.\n8. 60: > 30, > 50: right child of 50.\n\n' +
        fence(draw(bst(Q017_KEYS))) +
        '\n\nThe longest root-to-leaf path is 30, 10, 20, 25, 22, which has **4 edges**. The other leaves (40 and 60) are only at depth 2.\n\n' +
        'Answer: 4',
      whyWrong: [
        null,
        'This assumes the tree is perfectly balanced ($\\lfloor \\log_2 8 \\rfloor = 3$). The insertion order makes the left side much deeper, so you must actually build the tree.',
        'This counts the **nodes** on the longest path (30, 10, 20, 25, 22) instead of the edges between them.',
        'This assumes the tree becomes a single chain ($8 - 1 = 7$), which only happens when the keys arrive in sorted order.',
      ],
      keyIdea: 'The shape (and height) of a BST depends on the insertion order, so build it step by step before measuring.',
    },
    check: { optionValues: [4, 3, 5, 7], compute: () => height(bst(Q017_KEYS)) },
  },
  {
    id: 'trees-019',
    subtopic: 'trees',
    difficulty: 'challenge',
    stem: 'A **full** binary tree is one in which every node has either 0 or 2 children. A full binary tree has **41 nodes** in total. How many of them are leaves?',
    options: ['20', '40', '21', '42'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Let $I$ be the number of internal nodes (2 children each) and $L$ the number of leaves.\n\n' +
        '1. Every node except the root has exactly one edge coming down into it, so there are $41 - 1 = 40$ edges.\n' +
        '2. Every edge comes out of an internal node, and each internal node has exactly 2 children, so the number of edges is also $2I$. So $2I = 40$, giving $I = 20$.\n' +
        '3. Leaves are the rest: $L = 41 - 20 = 21$.\n\n' +
        'This is the general rule for full binary trees: $L = I + 1$, so $n = 2L - 1$ and $L = \\frac{n + 1}{2} = \\frac{42}{2} = 21$.\n\n' +
        'Check with a tiny full tree: a root with two leaf children has $n = 3$ and $L = \\frac{3 + 1}{2} = 2$. Correct.\n\n' +
        'Answer: 21',
      whyWrong: [
        'This is the number of **internal** nodes. In a full binary tree there is always one more leaf than internal nodes.',
        'This is the number of **edges** ($n - 1$), not the number of leaves.',
        null,
        'This forgets to divide by 2 in $L = \\frac{n + 1}{2}$: it stops at $n + 1 = 42$.',
      ],
      keyIdea: 'In a full binary tree, leaves = internal nodes + 1, so a tree with $n$ nodes has $\\frac{n + 1}{2}$ leaves.',
    },
    check: {
      optionValues: [20, 40, 21, 42],
      compute: () => {
        // grow a full binary tree: start with one leaf; turning a leaf into an internal node adds 2 new leaves
        let nodes = 1;
        let leaves = 1;
        while (nodes < 41) {
          leaves = leaves - 1 + 2;
          nodes += 2;
        }
        return leaves;
      },
    },
  },
  {
    id: 'trees-020',
    subtopic: 'trees',
    difficulty: 'challenge',
    stem:
      'A max-heap is stored in a list (index 0 is the root, filled level by level, left to right):\n\n' +
      '`[90, 70, 80, 40, 60, 50, 30, 20]`\n\nThe value **85** is inserted using the standard heap insertion (add it at the end, then sift it up). What is the list afterwards?',
    options: [
      '`[90, 70, 80, 40, 60, 50, 30, 20, 85]`',
      '`[90, 85, 80, 70, 60, 50, 30, 20, 40]`',
      '`[90, 70, 80, 85, 60, 50, 30, 20, 40]`',
      '`[85, 90, 80, 70, 60, 50, 30, 20, 40]`',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Heap insertion: put the new value in the next free position (the end of the list), then **sift up**: while it is larger than its parent, swap it with the parent. With 0-based indexing the parent of index $i$ is at $\\left\\lfloor \\frac{i - 1}{2} \\right\\rfloor$.\n\n' +
        '1. Append 85 at index 8: `[90, 70, 80, 40, 60, 50, 30, 20, 85]`.\n' +
        '2. Parent of index 8 is index $\\left\\lfloor \\frac{7}{2} \\right\\rfloor = 3$, which holds 40. Since $85 > 40$, swap: `[90, 70, 80, 85, 60, 50, 30, 20, 40]`.\n' +
        '3. Parent of index 3 is index 1, which holds 70. Since $85 > 70$, swap: `[90, 85, 80, 70, 60, 50, 30, 20, 40]`.\n' +
        '4. Parent of index 1 is index 0, which holds 90. Since $85 < 90$, stop.\n\n' +
        'Answer: `[90, 85, 80, 70, 60, 50, 30, 20, 40]`',
      whyWrong: [
        'This appends 85 but never sifts it up. It is larger than its parent 40, so the heap property is broken.',
        null,
        'This does only **one** swap. After moving above 40, 85 is still larger than its new parent 70, so it must keep moving up.',
        'This keeps swapping past the root. Sifting up stops as soon as the parent is larger: $85 < 90$, so 90 stays at the root.',
      ],
      keyIdea: 'Heap insert = add at the end, then repeatedly swap with the parent while the new value is larger (for a max-heap).',
    },
    check: {
      optionValues: [
        '[90, 70, 80, 40, 60, 50, 30, 20, 85]',
        '[90, 85, 80, 70, 60, 50, 30, 20, 40]',
        '[90, 70, 80, 85, 60, 50, 30, 20, 40]',
        '[85, 90, 80, 70, 60, 50, 30, 20, 40]',
      ],
      compute: () => {
        const h = [...Q019_HEAP, 85];
        let i = h.length - 1;
        while (i > 0) {
          const p = Math.floor((i - 1) / 2);
          if (h[i] <= h[p]) break;
          [h[i], h[p]] = [h[p], h[i]];
          i = p;
        }
        return `[${h.join(', ')}]`;
      },
    },
  },
  {
    id: 'trees-021',
    subtopic: 'trees',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source:
        NODE_CLASS +
        '\ndef walk(node, out):\n    if node is None:\n        return\n    walk(node.right, out)\n    out.append(node.val)\n    walk(node.left, out)\n\n' +
        'root = Node(5, Node(3, Node(1), Node(4)), Node(8, None, Node(9)))\nresult = []\nwalk(root, result)\nprint(result)',
    },
    options: ['`[1, 3, 4, 5, 8, 9]`', '`[5, 8, 9, 3, 4, 1]`', '`[9, 8, 4, 1, 3, 5]`', '`[9, 8, 5, 4, 3, 1]`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The tree is a BST:\n\n' +
        fence(draw(N(5, N(3, N(1), N(4)), N(8, undefined, N(9))))) +
        '\n\n`walk` is an in-order traversal with the sides swapped: **right subtree, then the node, then left subtree**. On a BST that gives the keys from largest to smallest.\n\n' +
        '| Call | What happens | `out` afterwards |\n| --- | --- | --- |\n' +
        '| `walk(5)` | first walk the right subtree (8) | |\n| `walk(8)` | first walk its right subtree (9) | |\n' +
        '| `walk(9)` | right is None, append 9, left is None | `[9]` |\n| back in `walk(8)` | append 8, left is None | `[9, 8]` |\n' +
        '| back in `walk(5)` | append 5, then walk the left subtree (3) | `[9, 8, 5]` |\n| `walk(3)` | walk right (4): append 4 | `[9, 8, 5, 4]` |\n' +
        '| back in `walk(3)` | append 3, then walk left (1): append 1 | `[9, 8, 5, 4, 3, 1]` |\n\n' +
        'The list is passed by reference, so every call appends to the same `result` list.\n\n' +
        'Answer: `[9, 8, 5, 4, 3, 1]`',
      whyWrong: [
        'This is the ordinary in-order traversal (left, node, right). The code walks `node.right` **first**, so the order is reversed.',
        'This appends each node **before** walking its subtrees (node, right, left). In the code the `append` happens between the two recursive calls.',
        'This appends each node **after** both recursive calls (right, left, node). In the code the `append` comes between the right call and the left call.',
        null,
      ],
      keyIdea: 'The position of the "visit" step relative to the two recursive calls decides the traversal; right-node-left on a BST gives descending order.',
    },
    python: { stdout: '[9, 8, 5, 4, 3, 1]\n' },
  },
];
