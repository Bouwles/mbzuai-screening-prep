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
const strip = (o: string) => o.replace(/`/g, '');

// ---------------------------------------------------------------- the trees used below
const T001 = N('A', N('B', N('D'), N('E', N('G'), N('H'))), N('C', undefined, N('F', undefined, N('I'))));
const T004 = N('P', N('Q', N('S', undefined, N('V', undefined, N('W')))), N('R', N('T'), N('U')));
const T006 = N('M', N('F', N('B'), N('H', N('G'))), N('T', N('P'), N('W')));
const T007 = N(1, N(2, N(4), N(5, undefined, N(7))), N(3, undefined, N(6, N(8))));
const T008 = N(10, N(6, N(3), N(8, N(7), N(9))), N(15, undefined, N(20, N(17))));
const T011 = N(40, N(25, N(10), N(30, N(28), N(35))), N(60, N(50), N(75, undefined, N(90))));
const T015 = N('A', N('B', N('D', N('F')), N('E')), N('C'));

const Q009_KEYS = [50, 30, 70, 20, 40, 60, 80, 35];
const Q017_KEYS = [30, 10, 50, 20, 40, 25, 22];
const Q013_HEAP = [95, 80, 90, 45, 70, 85, 60, 20, 30, 65];
const T028 = N('K', N('C', N('P'), N('A')), N('M', undefined, N('T')));
const T031 = bst([5, 3, 8, 1, 4]);

/** Whether an array, read as a tree level by level with the root at position 1, is a max-heap. */
const isMaxHeap = (a: number[]) => a.every((v, k) => k === 0 || a[Math.floor((k + 1) / 2) - 1] >= v);

const HEAP_OPTIONS = ['`[9, 5, 8, 2, 4]`', '`[9, 5, 8, 6, 4]`', '`[5, 9, 8, 2, 4]`', '`[2, 4, 5, 8, 9]`'];
const parseList = (o: string) => o.replace(/[`[\]]/g, '').split(', ').map(Number);

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------ foundation
  {
    id: 'trees-001',
    subtopic: 'trees',
    difficulty: 'foundation',
    stem: `How many **leaves** does the binary tree below have?\n\n${fence(draw(T001))}`,
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
    stem: 'With the root at **level 0**, what is the **maximum** number of nodes at **level 4** of a binary tree?',
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
    stem: `Height is the number of **edges** on the longest path from the root to a leaf. What is the height of the binary tree below?\n\n${fence(draw(T004))}`,
    options: ['5', '2', '7', '4'],
    correctIndex: 3,
    markScheme: {
      solution:
        'List the root-to-leaf paths and count the **edges** (the links), not the nodes:\n\n' +
        '- P to Q to S to V to W: 4 edges\n- P to R to T: 2 edges\n- P to R to U: 2 edges\n\n' +
        'The longest path has 4 edges, so the height is 4. (Equivalently: W is at depth 4, the deepest node.)\n\n' +
        'Answer: 4',
      whyWrong: [
        'This counts the **nodes** on the longest path (P, Q, S, V, W) instead of the edges between them. Height counts links, so a single node has height 0.',
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
    options: ['At the root', 'At the rightmost node', 'At the last array position', 'At a bottom-level leaf'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A max-heap is a complete binary tree with the **heap property**: every parent is greater than or equal to each of its children.\n\n' +
        'Follow any path from a leaf up to the top: the values never decrease as you go up. Every path ends at the root, so the root is at least as large as every other node.\n\n' +
        'That is why a heap is used as a priority queue: the maximum is always available at the root (the first position of the array).\n\n' +
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
  {
    id: 'trees-022',
    subtopic: 'trees',
    difficulty: 'foundation',
    stem: 'What is a node with no children called?',
    options: ['A root', 'A parent', 'A leaf', 'An internal node'],
    correctIndex: 2,
    markScheme: {
      solution: 'A **leaf** is a node with no children. The **root** is the single node at the top, with no parent. An **internal node** is any node with at least one child.',
      whyWrong: [
        'The root is the node with no **parent**, at the top of the tree. It usually has children.',
        'A parent has at least one child by definition.',
        null,
        'An internal node has at least one child, so it is the opposite of a leaf.',
      ],
      keyIdea: 'A leaf is a node with zero children.',
    },
  },
  {
    id: 'trees-023',
    subtopic: 'trees',
    difficulty: 'foundation',
    stem: 'What is the maximum number of children a node can have in a binary tree?',
    options: ['1', '2', '3', 'No limit'],
    correctIndex: 1,
    markScheme: {
      solution: '"Binary" means two: each node of a binary tree has at most **2** children, called the left child and the right child.',
      whyWrong: [
        'A node with one child is allowed, but it can have a second one as well.',
        null,
        'Three children would make a ternary tree, not a binary tree.',
        'General trees have no limit, but a binary tree allows at most 2 children per node.',
      ],
      keyIdea: 'In a binary tree every node has at most 2 children.',
    },
  },
  {
    id: 'trees-024',
    subtopic: 'trees',
    difficulty: 'foundation',
    stem: 'In a post-order traversal, the root of the tree is visited:',
    options: ['First', 'Second', 'Straight after its left subtree', 'Last'],
    correctIndex: 3,
    markScheme: {
      solution: 'Post-order means left subtree, right subtree, then the node. Both subtrees of the root must finish first, so the root is visited **last**.',
      whyWrong: [
        'That describes pre-order (node, left, right).',
        'In post-order every other node is visited before the root, so the root is only second in a tree with exactly two nodes.',
        'That describes in-order (left, node, right).',
        null,
      ],
      keyIdea: 'Post-order = left, right, node, so the root comes last.',
    },
  },
  {
    id: 'trees-025',
    subtopic: 'trees',
    difficulty: 'foundation',
    stem: 'In a binary search tree, where are the keys smaller than a node\'s key stored?',
    options: ['In its left subtree', 'In its right subtree', 'In either subtree', 'Only above it'],
    correctIndex: 0,
    markScheme: {
      solution: 'The BST rule: for every node, all keys in its **left** subtree are smaller and all keys in its **right** subtree are larger.',
      whyWrong: [
        null,
        'The right subtree holds the **larger** keys.',
        'If smaller keys could be on either side, a search could not decide which way to go.',
        'Keys above a node can be larger or smaller than it. Every key below it on the left is smaller.',
      ],
      keyIdea: 'BST: smaller keys to the left, larger keys to the right.',
    },
  },
  {
    id: 'trees-026',
    subtopic: 'trees',
    difficulty: 'foundation',
    stem: 'A tree with $n$ nodes has how many edges?',
    options: ['$n$', '$n + 1$', '$n - 1$', '$2n$'],
    correctIndex: 2,
    markScheme: {
      solution: 'Every node except the root has exactly one edge coming down into it from its parent. So there is one edge for each of the other $n - 1$ nodes.',
      whyWrong: [
        'This gives the root an edge as well, but the root has no parent.',
        'This is two more than the true count. Every edge belongs to exactly one non-root node.',
        null,
        'This counts two possible child links per node, but most nodes do not use both, and leaves use none.',
      ],
      keyIdea: 'A tree with $n$ nodes always has exactly $n - 1$ edges.',
    },
    check: {
      optionValues: [8, 9, 7, 16],
      compute: () => allNodes(T004).filter((x) => x.l).length + allNodes(T004).filter((x) => x.r).length,
    },
  },
  {
    id: 'trees-030',
    subtopic: 'trees',
    difficulty: 'foundation',
    stem: 'How do you find the smallest key in a binary search tree?',
    options: ['Keep going left from the root', 'Keep going right from the root', 'Read the root', 'Read the last leaf'],
    correctIndex: 0,
    markScheme: {
      solution: 'Smaller keys are always to the left, so keep following left children from the root until there is no left child. That node holds the smallest key.',
      whyWrong: [
        null,
        'Going right leads to larger keys, so this finds the **largest** key.',
        'The root has no special size in a BST. Every key in its left subtree is smaller.',
        'The last leaf is the rightmost one, and keys grow from left to right, so in general it is not the smallest key. The smallest key need not even be a leaf.',
      ],
      keyIdea: 'In a BST the smallest key is the leftmost node and the largest key is the rightmost node.',
    },
  },
  {
    id: 'trees-033',
    subtopic: 'trees',
    difficulty: 'foundation',
    stem: 'A binary tree with every level completely filled is called:',
    options: ['A skewed binary tree', 'A perfect binary tree', 'A binary search tree', 'A max-heap'],
    correctIndex: 1,
    markScheme: {
      solution: 'A **perfect** binary tree has every level completely filled, so a perfect tree of height $h$ has $2^{h+1} - 1$ nodes.',
      whyWrong: [
        'A skewed tree is the opposite: its nodes form a long chain with one child each.',
        null,
        'A binary search tree is defined by the order of its keys, not by its shape.',
        'A max-heap is defined by parents being at least as large as their children, and its last level need not be full.',
      ],
      keyIdea: 'Perfect binary tree: every level is full.',
    },
  },

  // ------------------------------------------------------------ exam
  {
    id: 'trees-006',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: `What is the **pre-order** traversal of the binary tree below?\n\n${fence(draw(T006))}`,
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
    stem: `What is the **post-order** traversal of the binary tree below?\n\n${fence(draw(T007))}`,
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
    stem: `What is the **level-order** (breadth-first) traversal of the binary tree below?\n\n${fence(draw(T008))}`,
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
    stem: 'Taking height as the number of edges on the longest root-to-leaf path, what is the **maximum** number of nodes in a binary tree of height 4?',
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
    stem: `The binary search tree below is searched for **35**. How many nodes are compared with 35, including the node where it is found?\n\n${fence(draw(T011))}`,
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
    id: 'trees-013',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'A max-heap is stored level by level in the array `[95, 80, 90, 45, 70, 85, 60, 20, 30, 65]`, indexed from 1. Which value is the **right child** of 80?',
    options: ['70', '45', '90', '85'],
    correctIndex: 0,
    markScheme: {
      solution:
        'With an array indexed from 1, the node at index $i$ has its left child at index $2i$ and its right child at index $2i + 1$.\n\n' +
        '80 is at index $i = 2$, so:\n\n- left child: index $2 \\times 2 = 4$, which holds 45\n- right child: index $2 \\times 2 + 1 = 5$, which holds 70\n\n' +
        'You can confirm by drawing the tree row by row:\n\n' +
        fence(draw(N(95, N(80, N(45, N(20), N(30)), N(70, N(65))), N(90, N(85), N(60))))) +
        '\n\nAnswer: 70',
      whyWrong: [
        null,
        'This is the **left** child of 80 (index $2i = 4$). The right child is the next one along, at index $2i + 1 = 5$.',
        'This is simply the next array item, which is the **sibling** of 80 (the other child of the root). Children are at $2i$ and $2i + 1$, not $i + 1$.',
        'This is the left child of 90, found by using index 3 instead of index 2 for the position of 80.',
      ],
      keyIdea: 'In a heap array indexed from 1, the children of index $i$ are at $2i$ and $2i + 1$, and its parent is at $\\left\\lfloor \\frac{i}{2} \\right\\rfloor$.',
    },
    check: {
      optionValues: [70, 45, 90, 85],
      compute: () => {
        const i = Q013_HEAP.indexOf(80) + 1;
        return Q013_HEAP[2 * i + 1 - 1];
      },
    },
  },
  {
    id: 'trees-014',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'Taking height as the number of edges on the longest root-to-leaf path, what is the **smallest possible height** of a binary tree with 20 nodes?',
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
    stem: `Here \`left(t)\` and \`right(t)\` are the children of node \`t\`, and \`t\` is empty where there is no node. What does \`mystery\` return for the root A of this tree?\n\n${fence(draw(T015))}`,
    code: {
      lang: 'pseudocode',
      source:
        'function mystery(t)\n   if isEmpty(t)\n      return 0\n   end if\n   return 1 + max(mystery(left(t)), mystery(right(t)))\nend function',
    },
    options: ['3', '4', '6', '2'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Work from the bottom up. An empty child gives 0, so every **leaf** gives $1 + \\max(0, 0) = 1$.\n\n' +
        '- F, E and C are leaves: each returns 1.\n' +
        '- D has left child F and no right child: $1 + \\max(1, 0) = 2$.\n' +
        '- B: $1 + \\max(\\text{mystery}(D), \\text{mystery}(E)) = 1 + \\max(2, 1) = 3$.\n' +
        '- A: $1 + \\max(\\text{mystery}(B), \\text{mystery}(C)) = 1 + \\max(3, 1) = 4$.\n\n' +
        'The function counts the number of **levels** (nodes on the longest root-to-leaf path A, B, D, F). That is the height in edges plus 1.\n\n' +
        'Answer: 4',
      whyWrong: [
        'This is the height measured in **edges**. Because an empty node returns 0, a leaf returns 1, so this function counts nodes on the longest path, which is one more than the number of edges.',
        null,
        'This is the total number of nodes. That would need `1 + mystery(left(t)) + mystery(right(t))`; using `max` follows only the deeper subtree.',
        'This follows the **shorter** branch (A to C), as if the function used `min`. `max` always takes the deeper subtree.',
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
    stem: 'In the **worst case**, how many key comparisons does a search make in a binary search tree of $n$ nodes that may be unbalanced?',
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
  {
    id: 'trees-018',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'The keys 30, 10, 50, 20, 40, 25, 22 are inserted, **in that order**, into an empty binary search tree. What is its height, counted in edges on the longest root-to-leaf path?',
    options: ['4', '2', '5', '6'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Insert each key by going left if smaller, right if larger:\n\n' +
        '1. 30 is the root.\n2. 10 < 30: left child of 30.\n3. 50 > 30: right child of 30.\n4. 20: < 30, > 10: right child of 10.\n' +
        '5. 40: > 30, < 50: left child of 50.\n6. 25: < 30, > 10, > 20: right child of 20.\n7. 22: < 30, > 10, > 20, < 25: left child of 25.\n\n' +
        fence(draw(bst(Q017_KEYS))) +
        '\n\nThe longest root-to-leaf path is 30, 10, 20, 25, 22, which has **4 edges**. The other leaf (40) is only at depth 2.\n\n' +
        'Answer: 4',
      whyWrong: [
        null,
        'This assumes the tree is perfectly balanced ($\\lfloor \\log_2 7 \\rfloor = 2$). The insertion order makes the left side much deeper, so you must actually build the tree.',
        'This counts the **nodes** on the longest path (30, 10, 20, 25, 22) instead of the edges between them.',
        'This assumes the tree becomes a single chain ($7 - 1 = 6$), which only happens when the keys arrive in sorted order.',
      ],
      keyIdea: 'The shape (and height) of a BST depends on the insertion order, so build it step by step before measuring.',
    },
    check: { optionValues: [4, 2, 5, 6], compute: () => height(bst(Q017_KEYS)) },
  },
  {
    id: 'trees-027',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'A full binary tree, where every node has 0 or 2 children, has 7 internal nodes. How many leaves does it have?',
    options: ['8', '7', '14', '15'],
    correctIndex: 0,
    markScheme: {
      solution:
        'An **internal node** is a node with at least one child.\n\n' +
        'Start with a single node, which is 1 leaf. Giving a leaf two children turns it into an internal node and adds 2 new leaves, so each internal node adds exactly 1 leaf overall.\n\n' +
        'So leaves $=$ internal nodes $+ 1 = 7 + 1 = 8$.\n\n' +
        'Check with 1 internal node: a root with two children has 2 leaves.',
      whyWrong: [
        null,
        'This assumes equal numbers of leaves and internal nodes. A full binary tree always has one more leaf.',
        'This is $2 \\times 7$, the number of child links. Most of those links lead to other internal nodes, not to leaves.',
        'This is the total number of nodes, $7 + 8 = 15$, not the number of leaves.',
      ],
      keyIdea: 'A full binary tree has one more leaf than it has internal nodes.',
    },
    check: {
      optionValues: [8, 7, 14, 15],
      compute: () => {
        let leaves = 1;
        for (let internal = 1; internal <= 7; internal++) leaves = leaves - 1 + 2;
        return leaves;
      },
    },
  },
  {
    id: 'trees-028',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: `What is the **in-order** traversal of the binary tree below?\n\n${fence(draw(T028))}`,
    options: [seq(pre(T028)), seq(post(T028)), seq(ino(T028)), seq(levelOrder(T028))],
    correctIndex: 2,
    markScheme: {
      solution:
        'In-order means: traverse the **left subtree**, then **visit the node**, then traverse the **right subtree**.\n\n' +
        '- Subtree at C: left P, then C, then right A, giving P, C, A.\n' +
        '- Subtree at M: no left child, then M, then right T, giving M, T.\n' +
        '- Whole tree: P, C, A, then the root K, then M, T.\n\n' +
        `Answer: ${seq(ino(T028))}`,
      whyWrong: [
        'This is the **pre-order** traversal (node, left, right), which starts with the root K.',
        'This is the **post-order** traversal (left, right, node), which ends with the root K.',
        null,
        'This is the **level-order** traversal, row by row. In-order finishes the whole left subtree before visiting the root.',
      ],
      keyIdea: 'In-order = left subtree, node, right subtree; the root sits between its two subtrees.',
    },
    check: {
      optionValues: [seq(pre(T028)), seq(post(T028)), seq(ino(T028)), seq(levelOrder(T028))],
      compute: () => seq(ino(T028)),
    },
  },
  {
    id: 'trees-029',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'The max-heap `A` is stored level by level. Arrays are indexed from 1. What is printed?',
    code: {
      lang: 'pseudocode',
      source:
        'A = [9, 7, 8, 3, 5, 6]\ni = 6\nc = 0\nwhile (i > 1)\n   i = div(i,2) // div is integer division\n   c = c + A[i]\nend while\nprint(c)',
    },
    options: ['17', '23', '8', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`div(i,2)` moves from a node to its parent, so the loop walks up the heap, adding each parent.\n\n' +
        '| `i` after `div` | `A[i]` | `c` |\n|---|---|---|\n' +
        '| 3 | 8 | 8 |\n' +
        '| 1 | 9 | 17 |\n\n' +
        'Now `i` is 1, so $1 > 1$ is false and the loop stops. It prints 17.',
      whyWrong: [
        null,
        'This also adds the starting item `A[6]`, which is 6. The loop moves `i` before adding, so `A[6]` is never added.',
        'This stops after the first parent. After that pass `i` is 3, and $3 > 1$ is true, so the loop runs again.',
        '`i` is halved on every pass, so it reaches 1 and the test fails.',
      ],
      keyIdea: 'In a heap array indexed from 1, `div(i,2)` gives the position of the parent of node `i`.',
    },
    check: {
      optionValues: [17, 23, 8, 'Infinite loop'],
      compute: () => {
        const a = [9, 7, 8, 3, 5, 6];
        let i = 6;
        let c = 0;
        let guard = 0;
        while (i > 1) {
          if (++guard > 1000) return 'Infinite loop';
          i = Math.floor(i / 2);
          c += a[i - 1];
        }
        return c;
      },
    },
  },
  {
    id: 'trees-031',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'The keys 5, 3, 8, 1, 4 are inserted, **in that order**, into an empty binary search tree. What is its **pre-order** traversal?',
    options: [seq(ino(T031)), seq(pre(T031)), seq(post(T031)), seq(levelOrder(T031))],
    correctIndex: 1,
    markScheme: {
      solution:
        'Build the tree: 5 is the root; 3 goes left of 5; 8 goes right of 5; 1 goes left of 3; 4 goes right of 3.\n\n' +
        fence(draw(T031)) +
        '\n\nPre-order is node, left, right: 5, then the subtree at 3 (3, 1, 4), then 8.\n\n' +
        `Answer: ${seq(pre(T031))}`,
      whyWrong: [
        'This is the **in-order** traversal, which lists a BST in sorted order.',
        null,
        'This is the **post-order** traversal (left, right, node), which ends with the root 5.',
        'This is the **level-order** traversal, row by row. It is the same as the insertion order here, but pre-order finishes the subtree at 3 before visiting 8.',
      ],
      keyIdea: 'Build the BST from the insertion order first, then apply the traversal rule.',
    },
    check: {
      optionValues: [seq(ino(T031)), seq(pre(T031)), seq(post(T031)), seq(levelOrder(T031))],
      compute: () => seq(pre(T031)),
    },
  },
  {
    id: 'trees-032',
    subtopic: 'trees',
    difficulty: 'exam',
    stem: 'Which array is a valid max-heap stored level by level? (With arrays indexed from 1, the children of index $i$ are at $2i$ and $2i + 1$.)',
    options: HEAP_OPTIONS,
    correctIndex: 0,
    markScheme: {
      solution:
        'Check that every parent is at least as large as its children. For five items the parent-child pairs are index 1 with 2 and 3, and index 2 with 4 and 5.\n\n' +
        '`[9, 5, 8, 2, 4]`: $9 \\ge 5$, $9 \\ge 8$, $5 \\ge 2$, $5 \\ge 4$. All hold, so it is a max-heap.\n\n' +
        'The array need not be sorted: only each parent and its children are compared.',
      whyWrong: [
        null,
        'Index 2 holds 5 and its left child at index 4 holds 6, so a parent is smaller than its child.',
        'The root must be the largest value, but 5 is smaller than its child 9.',
        'This is sorted in ascending order, which makes it a **min-heap**: the smallest value is at the root.',
      ],
      keyIdea: 'A max-heap needs every parent to be at least as large as its children; the rest of the array can be in any order.',
    },
    check: {
      optionValues: HEAP_OPTIONS.map(strip),
      compute: () => {
        const ok = HEAP_OPTIONS.filter((o) => isMaxHeap(parseList(o)));
        return ok.length === 1 ? strip(ok[0]) : 'none or several';
      },
    },
  },
];
