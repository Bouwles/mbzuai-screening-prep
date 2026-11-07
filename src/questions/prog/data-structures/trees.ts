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
      asking: 'How many nodes in this tree have nothing below them?',
      solution:
        'A **leaf** is a node with no children, which means no lines lead down from it. A node with even one child is not a leaf.\n\n' +
        'Check every node, not only the ones on the bottom row:\n\n| Node | Children | Leaf? |\n|---|---|---|\n| A | B, C | no |\n| B | D, E | no |\n| C | F | no |\n| D | none | yes |\n| E | G, H | no |\n| F | I | no |\n| G | none | yes |\n| H | none | yes |\n| I | none | yes |\n\n' +
        'Count the yes rows: D, G, H and I. That makes 4 leaves. D sits higher up than the others, but it still has no children.',
      conclusion: 'Only D, G, H and I have no children, so the tree has 4 leaves.',
      whyWrong: [
        'This counts the **internal** nodes (A, B, C, E, F), the nodes that do have children, instead of the leaves.',
        null,
        'This only counts the nodes on the bottom row (G, H, I) and misses D, which also has no children even though it sits higher up.',
        'This also counts C and F as leaves because they have only one child. A node with one child is still an internal node; a leaf has no children.',
      ],
      keyIdea: 'To count leaves, check every node, not only the bottom row. A leaf has no children at all, so a node with one child does not count, and a leaf can sit at any height.',
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
      asking: 'At most how many nodes can sit on level 4, four rows below the root?',
      solution:
        '**Level** says how many rows a node is below the root. The root is at level 0, its children are at level 1, and so on.\n\n' +
        'In a binary tree each node has at most 2 children. So each level can hold at most double the level above:\n\n| Level | Most nodes |\n|---|---|\n| 0 | 1 |\n| 1 | 2 |\n| 2 | 4 |\n| 3 | 8 |\n\n' +
        'Level 4 is one more doubling: $8 \\times 2 = 16$. That is the same as $2^4$.',
      conclusion: 'Four doublings from the single root give $2^4$, so the answer is 16.',
      whyWrong: [
        null,
        'This treats the root as level 1, so it only doubles three times ($2^3 = 8$). With the root at level 0, level 4 needs four doublings: $2^4$.',
        'This is the maximum number of nodes in the **whole tree** from level 0 to level 4 ($1 + 2 + 4 + 8 + 16 = 31$), not on level 4 alone.',
        'This doubles one time too many: $2^5 = 32$ is the maximum for level 5.',
      ],
      keyIdea: 'With the root at level 0, level $k$ holds at most $2^k$ nodes. See how the question numbers the root, because starting at level 1 shifts the power by one.',
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
      asking: 'Which way of walking through a binary search tree gives the keys from smallest to largest?',
      solution:
        'In a **binary search tree** (BST), every key in a node\'s left part is smaller than the node, and every key in its right part is larger.\n\n' +
        'So to get sorted order, we need all of the left part, then the node, then all of the right part.\n\n' +
        'Try a tiny BST: 5 with left child 3 and right child 8. Going left, node, right gives 3, 5, 8, which is sorted.\n\n' +
        'The walk that goes left, node, right at every node is called **in-order**.',
      conclusion: 'Left, node, right lists smaller keys before each node and larger keys after it, so the answer is In-order.',
      whyWrong: [
        'Pre-order outputs the root **first**, before the smaller keys in its left subtree, so the output starts with the root, which is usually not the smallest key.',
        'Post-order outputs the root **last**, after the larger keys in its right subtree, so the output is not sorted.',
        null,
        'Level-order goes row by row from the top. A key deep in the left subtree can be smaller than a key higher up on the right, so the output is not sorted.',
      ],
      keyIdea: 'Look at where the node goes: pre-order puts it first, in-order in the middle, post-order last. In a BST, in-order always lists the keys in sorted order.',
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
      asking: 'How many lines are on the longest route from P down to a node with no children?',
      solution:
        'An **edge** is one line joining two nodes. A **leaf** is a node with no children. Height counts the edges on the longest route from the root to a leaf, so we count lines, not nodes.\n\n' +
        'The root is P, and the leaves are T, U and W. So there are three routes to compare.\n\n' +
        'Follow the lines to each leaf and count them:\n\n| Route | Nodes | Edges |\n|---|---|---|\n| P, R, T | 3 | 2 |\n| P, R, U | 3 | 2 |\n| P, Q, S, V, W | 5 | 4 |',
      conclusion: 'The longest route is P, Q, S, V, W, which has 5 nodes but only 4 edges, so the height is 4.',
      whyWrong: [
        'This counts the **nodes** on the longest path (P, Q, S, V, W) instead of the edges between them. Height counts links, so a single node has height 0.',
        'This is the **shortest** root-to-leaf path (P to R to T). Height uses the **longest** path.',
        'This is the total number of edges in the whole tree (8 nodes, so $8 - 1 = 7$ edges), not the length of the longest path.',
        null,
      ],
      keyIdea: 'For height in edges, find the deepest leaf and count the lines to it from the root. A route always has one fewer edge than nodes, so a single node has height 0.',
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
      asking: 'Where must the biggest value in a max-heap be?',
      solution:
        'A **max-heap** is a tree with one rule: every parent is at least as large as its children.\n\n' +
        'Start at any node and move up to its parent. The value can only stay the same or get bigger.\n\n' +
        'Keep moving up and you always end at the very top node, the root. Nothing can be larger than the value there.',
      conclusion: 'Every route upwards ends at the top with the largest value, so the answer is At the root.',
      whyWrong: [
        null,
        'That is where the largest key is in a **binary search tree**, not a heap. A heap only orders parents above children; it says nothing about left versus right.',
        'This assumes the heap array is sorted in ascending order. A heap array is not sorted; only the first element (the root) is guaranteed to be the maximum.',
        'This is backwards: in a max-heap values never increase as you go down, so a node on the bottom level can never be larger than the nodes above it, including the root.',
      ],
      keyIdea: 'A heap\'s rule only compares parents with children, so reason from that rule. Max-heap: largest at the root. Min-heap: smallest at the root. Left and right order tell you nothing.',
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
      asking: 'What name is given to a tree node that has nothing below it?',
      solution:
        'Think of a real tree. Branches split into smaller branches, and each one ends at an outer tip, with nothing growing beyond it.\n\n' +
        'What grows at those tips gives us the name: a node with no children is called a **leaf**.',
      conclusion: 'Nothing grows from a node with no children, so it is called A leaf.',
      whyWrong: [
        'The root is the node with no **parent**, at the top of the tree. It usually has children.',
        'A parent has at least one child by definition.',
        null,
        'An internal node has at least one child, so it is the opposite of a leaf.',
      ],
      keyIdea: 'Learn tree words by position. The root is the top node with no parent. A leaf has no children. An internal node has at least one child.',
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
      asking: 'How many children is one node in a binary tree allowed, at most?',
      solution:
        '"Binary" means made of two, just as binary numbers use only two digits.\n\n' +
        'Each node in a binary tree has room for one left child and one right child. It may use 0, 1 or both of those places, so the limit is 2.',
      conclusion: 'Each node has one left place and one right place, so the maximum is 2.',
      whyWrong: [
        'A node with one child is allowed, but it can have a second one as well.',
        null,
        'Three children would make a ternary tree, not a binary tree.',
        'General trees have no limit, but a binary tree allows at most 2 children per node.',
      ],
      keyIdea: 'The name of a tree gives its limit: binary means at most 2 children per node, and ternary means at most 3. Picture the left and right places under each node.',
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
      asking: 'At what point does a post-order walk reach the top node?',
      solution:
        '"Post" means after. **Post-order** means: visit the left subtree, then the right subtree, and only after those visit the node itself.\n\n' +
        'A **subtree** is a child and everything below it. The root\'s two subtrees contain every other node, so all of them are visited before the root.',
      conclusion: 'The root waits until both of its subtrees are finished, so it is visited Last.',
      whyWrong: [
        'That describes pre-order (node, left, right).',
        'In post-order every other node is visited before the root, so the root is only second in a tree with exactly two nodes.',
        'That describes in-order (left, node, right).',
        null,
      ],
      keyIdea: 'Read the prefix: pre means the node comes before its subtrees, in means between them, post means after them. So the root is first in pre-order and last in post-order.',
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
      asking: 'On which side of a node does a binary search tree keep the smaller keys?',
      solution:
        'A **key** is the value stored in a node. A **binary search tree** (BST) keeps its keys in order, so a search always knows which way to go.\n\n' +
        'The rule is that smaller keys go left and larger keys go right. A **subtree** is a child and everything below it, so all the smaller keys are in the left subtree.',
      conclusion: 'The BST rule sends smaller keys to the left, so they are stored In its left subtree.',
      whyWrong: [
        null,
        'The right subtree holds the **larger** keys.',
        'If smaller keys could be on either side, a search could not decide which way to go.',
        'Keys above a node can be larger or smaller than it. Every key below it on the left is smaller.',
      ],
      keyIdea: 'Picture a number line: a BST reads from left to right in increasing order. Smaller means left and larger means right, and this holds at every node, not only at the root.',
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
      asking: 'How many connecting lines does a tree with $n$ nodes have?',
      solution:
        'An **edge** is a line joining a node to its parent. Every node has exactly one parent, except the root, which has none.\n\n' +
        'Try a small tree: a root with two children has 3 nodes and 2 lines.\n\n' +
        'In general, each node apart from the root has one line going up to its parent. So the number of edges is the number of nodes minus the root: $n - 1$.',
      conclusion: 'There is one edge for every node except the root, which gives $n - 1$.',
      whyWrong: [
        'This gives the root an edge as well, but the root has no parent.',
        'This is two more than the true count. Every edge belongs to exactly one non-root node.',
        null,
        'This counts two possible child links per node, but most nodes do not use both, and leaves use none.',
      ],
      keyIdea: 'To count something in general, match each one to exactly one other thing. Here each edge matches the non-root node it leads to. Then test the formula on a tree of 3 nodes.',
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
      asking: 'What route through a binary search tree finds the smallest key?',
      solution:
        'In a **binary search tree** (BST), moving to a left child always gives a smaller key, and moving to a right child always gives a larger key.\n\n' +
        'Try a small BST where 5 has a left child 3, and 3 has a left child 1. The smallest key is 1, and the route to it is 5, 3, 1.\n\n' +
        'That route only ever moved left. In general, keep going left from the root and stop when there is no left child, because nothing smaller exists.',
      conclusion: 'Each move left reaches a smaller key until none remain, so the answer is Keep going left from the root.',
      whyWrong: [
        null,
        'Going right leads to larger keys, so this finds the **largest** key.',
        'The root has no special size in a BST. Every key in its left subtree is smaller.',
        'The last leaf is the rightmost one, and keys grow from left to right, so in general it is not the smallest key. The smallest key need not even be a leaf.',
      ],
      keyIdea: 'In a BST, the smallest key is reached by going left until you cannot, and the largest by going right until you cannot. Both follow one route down from the root.',
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
      asking: 'What is the name for a binary tree with no gaps on any level?',
      solution:
        'Each level of a binary tree can hold double the level above: 1 node, then 2, then 4, and so on.\n\n' +
        'When every level holds as many as it can, the tree makes a perfect triangle with no gaps. That shape is called a **perfect binary tree**.',
      conclusion: 'Every level being full is the definition of A perfect binary tree.',
      whyWrong: [
        'A skewed tree is the opposite: its nodes form a long chain with one child each.',
        null,
        'A binary search tree is defined by the order of its keys, not by its shape.',
        'A max-heap is defined by parents being at least as large as their children, and its last level need not be full.',
      ],
      keyIdea: 'Tree names describe either shape or key order. Perfect and skewed describe shape. BST and heap describe how keys are ordered. Decide which the stem describes, then choose from that group.',
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
      asking: 'In what order does a pre-order walk visit the nodes of this tree?',
      solution:
        '**Pre-order** means: visit the node first, then its left subtree, then its right subtree. A **subtree** is a child and everything below it. The same rule applies inside each subtree.\n\n' +
        'Start at the root, M, and write it down. M\'s left subtree starts at F, so finish all of that before going right.\n\n' +
        'Inside F\'s subtree: write F, then its left child B, which has no children. Then go right to H: write H, then its left child G. This part gives F, B, H, G.\n\n' +
        'Now M\'s right subtree, which starts at T: write T, then its left child P, then its right child W. This part gives T, P, W.\n\n' +
        'Join the parts in order: M, then F, B, H, G, then T, P, W.',
      conclusion: 'Each node is written before its subtrees, left before right, so the answer is M, F, B, H, G, T, P, W.',
      whyWrong: [
        'This is the **in-order** traversal (left, node, right). Pre-order visits each node **before** its subtrees, so it must start with the root M.',
        'This is the **post-order** traversal (left, right, node), which ends with the root rather than starting with it.',
        null,
        'This is the **level-order** (breadth-first) traversal, row by row. Pre-order goes deep first: after F it visits all of the subtree under F before moving to T.',
      ],
      keyIdea: 'For pre-order, apply node, left, right at every node. The first name must be the root, which rules out many wrong lists. Split the tree at the root and solve each side the same way.',
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
      asking: 'In what order does a post-order walk visit the nodes of this tree?',
      solution:
        '**Post-order** means: visit the left subtree, then the right subtree, and the node last. A **subtree** is a child and everything below it. The same rule applies inside each subtree.\n\n' +
        'The root is 1. Its left subtree starts at 2, and its right subtree starts at 3. Work out each one, then put 1 at the very end.\n\n' +
        'Left subtree at 2. Its left child 4 has no children, so that gives 4. Its right child 5 has only a right child, 7, so that gives 7, 5. Put 2 last: 4, 7, 5, 2.\n\n' +
        'Right subtree at 3. It has no left child. Its right child 6 has only a left child, 8, so that gives 8, 6. Put 3 last: 8, 6, 3.\n\n' +
        'Join left, right, root: 4, 7, 5, 2, then 8, 6, 3, then 1.',
      conclusion: 'Each node comes after both of its subtrees, and the root comes last, so the answer is 4, 7, 5, 2, 8, 6, 3, 1.',
      whyWrong: [
        'This is the **pre-order** traversal (node first). In post-order the root 1 must come **last**.',
        null,
        'This is the **in-order** traversal (left, node, right), where the root appears in the middle.',
        'This is the pre-order traversal written backwards. Reversing pre-order gives "right, left, node", which visits the right subtree first; post-order visits the **left** subtree first.',
      ],
      keyIdea: 'For post-order, apply left, right, node at every node. The last name must be the root, which rules out many wrong lists. Solve the smallest subtrees first, then join them.',
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
      asking: 'What order do the nodes come in if you read the tree one row at a time?',
      solution:
        '**Level-order** (also called breadth-first) visits the tree one row at a time, from the top row down. Within each row it goes from left to right.\n\n' +
        'Read off each row:\n\n| Level | Nodes, left to right |\n|---|---|\n| 0 | 10 |\n| 1 | 6, 15 |\n| 2 | 3, 8, 20 |\n| 3 | 7, 9, 17 |\n\n' +
        'Now write the rows one after another: 10, then 6, 15, then 3, 8, 20, then 7, 9, 17.',
      conclusion: 'Reading row by row, left to right, gives 10, 6, 15, 3, 8, 20, 7, 9, 17.',
      whyWrong: [
        'This is the **pre-order** (depth-first) traversal: it goes all the way down the left side before visiting 15. Level-order finishes each whole level before going deeper.',
        'This is the **in-order** traversal, which for this BST gives the keys in sorted order.',
        'This goes level by level but **right to left** within each level. Standard level-order reads each level left to right.',
        null,
      ],
      keyIdea: 'For level-order, write each row of the tree on its own line and read from left to right. A queue does the same job: take a node out, then add its children at the rear.',
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
      asking: 'Once all the keys are in, which node sits directly above 35?',
      solution:
        'In a **binary search tree** (BST), a new key starts at the top node, the root. If it is smaller, go left. If it is larger, go right. It goes into the first empty spot, and the node above that spot is its **parent**.\n\n' +
        'The first seven keys build this tree:\n\n| Key | Route from the root | Placed as |\n|---|---|---|\n| 50 | the tree is empty | root |\n| 30 | $30 < 50$ left | left child of 50 |\n| 70 | $70 > 50$ right | right child of 50 |\n| 20 | $20 < 50$ left, $20 < 30$ left | left child of 30 |\n| 40 | $40 < 50$ left, $40 > 30$ right | right child of 30 |\n| 60 | $60 > 50$ right, $60 < 70$ left | left child of 70 |\n| 80 | $80 > 50$ right, $80 > 70$ right | right child of 70 |\n\n' +
        'Now insert 35. $35 < 50$, so go left to 30. Then $35 > 30$, so go right to the node there.\n\n' +
        'That node is 40, and $35 < 40$, so go left. That spot is empty, so 35 becomes the left child of 40.',
      conclusion: '35 stops below the last node it was compared with, so its parent is 40.',
      whyWrong: [
        null,
        'This stops one step too early. At 30 you go right, but that spot is already taken by 40, so you must keep comparing: 35 < 40, so 35 goes below 40.',
        'This goes the wrong way at 30. Since 35 > 30, the search must go **right** (towards 40), not left towards 20.',
        'This goes the wrong way at the root. Since 35 < 50, the search must go **left**; going right leads to 70 and then 60.',
      ],
      keyIdea: 'To find a parent in a BST, walk the new key down from the root: smaller goes left, larger goes right. The last node you compare it with, just before an empty spot, is its parent.',
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
      asking: 'How many nodes fit in a binary tree of height 4 if every level is full?',
      solution:
        'Height 4 means the longest route has 4 edges (lines between nodes). That route passes through levels 0, 1, 2, 3 and 4, so the tree has 5 levels, not 4.\n\n' +
        'The most nodes fit when every level is full. Each node can have 2 children, so each level holds double the one above:\n\n| Level | 0 | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|---|\n| Most nodes | 1 | 2 | 4 | 8 | 16 |\n\n' +
        'Add all the levels together: $1 + 2 + 4 + 8 + 16 = 31$.',
      conclusion: 'Five full levels hold 31 nodes in total, so the answer is 31.',
      whyWrong: [
        'This is only the maximum on the **bottom level** (level 4 holds at most $2^4 = 16$ nodes); it forgets all the levels above it.',
        'This treats height 4 as four levels (0 to 3), giving $2^4 - 1 = 15$. With height measured in edges, height 4 means **five** levels.',
        null,
        'This forgets to subtract 1: the formula is $2^{h+1} - 1$, not $2^{h+1}$.',
      ],
      keyIdea: 'A binary tree of height $h$ holds at most $2^{h+1} - 1$ nodes. Here $2^5 - 1 = 31$. See whether height is given in edges, because that decides the number of levels.',
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
      asking: 'How many nodes does a search for 35 look at, counting the one holding 35?',
      solution:
        'In a **binary search tree**, smaller keys are on the left and larger keys are on the right. A search starts at the top and uses this rule to choose one direction at each node.\n\n' +
        'Compare 35 with each node on the way down:\n\n| Comparison | Node | Result | Go |\n|---|---|---|---|\n| 1st | 40 | $35 < 40$ | left |\n| 2nd | 25 | $35 > 25$ | right |\n| 3rd | 30 | $35 > 30$ | right |\n\n' +
        'The next node is 35 itself. That is the 4th comparison, and it matches, so the search stops.',
      conclusion: 'The search looked only at 40, 25, 30 and 35, so the answer is 4.',
      whyWrong: [
        'This counts the **edges** travelled (40 to 25 to 30 to 35 is 3 moves), or forgets the final comparison that actually finds 35. The question counts every node compared.',
        null,
        'This is the position of 35 in sorted order (10, 25, 28, 30, 35): the cost of scanning the sorted keys one by one, not of a BST search.',
        'This checks every node, as if searching an unordered list. A BST lets you discard a whole subtree at each comparison.',
      ],
      keyIdea: 'A BST search visits one node per level along a single route. Make a table of comparisons. The count includes the final match, so it is one more than the edges travelled.',
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
      asking: 'Using the array positions, which value is the right-hand child of 80?',
      solution:
        'A heap is a tree stored in an array, one level at a time. With indexes from 1, the item at index $i$ has its left child at index $2i$ and its right child at index $2i + 1$.\n\n' +
        'Write each index beside its value:\n\n| Index | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |\n|---|---|---|---|---|---|---|---|---|---|---|\n| Value | 95 | 80 | 90 | 45 | 70 | 85 | 60 | 20 | 30 | 65 |\n\n' +
        '80 is at index 2, so $i = 2$.\n\n' +
        'Its right child is at index $2i + 1 = 2 \\times 2 + 1 = 5$, and index 5 holds 70.',
      conclusion: 'The right child of index 2 is at index 5, so the answer is 70.',
      whyWrong: [
        null,
        'This is the **left** child of 80 (index $2i = 4$). The right child is the next one along, at index $2i + 1 = 5$.',
        'This is simply the next array item, which is the **sibling** of 80 (the other child of the root). Children are at $2i$ and $2i + 1$, not $i + 1$.',
        'This is the left child of 90, found by using index 3 instead of index 2 for the position of 80.',
      ],
      keyIdea: 'For a heap in an array indexed from 1: left child at $2i$, right child at $2i + 1$, parent at $i / 2$ rounded down. Find the value\'s index first, then apply the formula.',
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
      asking: 'How short can a binary tree with 20 nodes be?',
      solution:
        'A tree is as short as possible when every level is filled before a new one starts. Height counts the edges on the longest route, so a tree of height $h$ has $h + 1$ levels.\n\n' +
        'Each level can hold double the one above. Add up the levels to see how many nodes each height can hold:\n\n| Height | Levels added up | Most nodes |\n|---|---|---|\n| 0 | $1$ | 1 |\n| 1 | $1 + 2$ | 3 |\n| 2 | $1 + 2 + 4$ | 7 |\n| 3 | $1 + 2 + 4 + 8$ | 15 |\n\n' +
        'Height 3 holds at most 15 nodes. We have 20, so 5 nodes still need somewhere to go.\n\n' +
        'Height 4 adds a level that can hold 16 more nodes, making 31 in total. 20 nodes fit, so height 4 is the first that works.',
      conclusion: 'A tree of height 3 holds too few and height 4 holds enough, so the smallest possible height is 4.',
      whyWrong: [
        'This counts **levels** (a height-4 tree has 5 levels, 0 to 4) instead of edges.',
        'This is the **largest** possible height, when the 20 nodes form a single chain. The question asks for the smallest.',
        null,
        'This is the tallest tree that can be **completely full** with at most 20 nodes ($2^{h+1} - 1 \\le 20$), not the shortest tree that can hold all 20. A tree of height 3 holds at most $2^4 - 1 = 15$ nodes, so the other 5 nodes need one more level.',
      ],
      keyIdea: 'For smallest height, find the first $h$ where $2^{h+1} - 1$ is at least the number of nodes, using a small table of heights and maximum nodes. The largest possible height is always nodes minus 1.',
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
      asking: 'What number does the function give back when it starts at the top node A?',
      solution:
        '`mystery` calls itself on smaller parts of the tree, which is called **recursion**. Lines 2 and 3 are the stopping point: a missing node returns 0.\n\n' +
        'Line 5 says: count this node as 1, then add the bigger of the answers from its two children. `max` picks the larger number.\n\n' +
        'Each node needs its children\'s answers first, so work from the bottom up:\n\n| Node | Left returns | Right returns | `1 + max(left, right)` |\n|---|---|---|---|\n| F | 0 (empty) | 0 (empty) | 1 |\n| D | 1 (F) | 0 (empty) | 2 |\n| E | 0 (empty) | 0 (empty) | 1 |\n| B | 2 (D) | 1 (E) | 3 |\n| C | 0 (empty) | 0 (empty) | 1 |\n\n' +
        'Last is A. Its left child B returned 3 and its right child C returned 1. So `mystery(A)` is $1 + \\max(3, 1) = 1 + 3 = 4$.',
      conclusion: 'The function counts the nodes on the longest route down, A, B, D, F, so it returns 4.',
      whyWrong: [
        'This is the height measured in **edges**. Because an empty node returns 0, a leaf returns 1, so this function counts nodes on the longest path, which is one more than the number of edges.',
        null,
        'This is the total number of nodes. That would need `1 + mystery(left(t)) + mystery(right(t))`; using `max` follows only the deeper subtree.',
        'This follows the **shorter** branch (A to C), as if the function used `min`. `max` always takes the deeper subtree.',
      ],
      keyIdea: 'For recursive tree code, make a table that starts at the leaves and works upward. An empty tree returning 0 means counting nodes, and $-1$ means counting edges. `max` follows the deepest route.',
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
      asking: 'In the worst possible tree shape, how many nodes might a search have to check?',
      solution:
        'A search in a binary search tree (BST) compares the target with one node, then moves to one child. So it makes one comparison per node on its route down.\n\n' +
        'The tree may be unbalanced, meaning one side can be much longer. The worst shape comes from inserting keys in sorted order, such as 1, 2, 3, 4. Each key becomes the right child of the last, forming one long chain.\n\n' +
        'Now search for the key at the very bottom of that chain. Every node is on the route, so a chain of $n$ nodes takes $n$ comparisons.',
      conclusion: 'An unbalanced tree can be a single chain, and searching to its end compares every node, so the answer is $n$.',
      whyWrong: [
        null,
        'This assumes the tree is **balanced**. An unbalanced BST can be a chain, so in the worst case every node is compared.',
        'This is roughly the **average** number of comparisons for a linear search of a list, not the worst case for a BST.',
        'This is the cost of a good **sorting** algorithm. A search makes at most one comparison per node, so it can never exceed $n$.',
      ],
      keyIdea: 'When a question says a tree may be unbalanced, picture one long chain, which gives $n$ comparisons. A balanced tree halves the remaining keys at each step, so it takes about $\\log_2 n$ comparisons, the number of times $n$ can be halved.',
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
      asking: 'How many edges are on the longest route down the tree built from these keys?',
      solution:
        'In a **binary search tree**, each new key starts at the top node. If it is smaller, go left. If it is larger, go right. It goes in the first empty spot.\n\n' +
        'Insert the keys in the given order. Each move down one line is one **edge**, so the moves in the route tell us how deep the key sits:\n\n| Key | Route from the root | Placed as | Edges from the root |\n|---|---|---|---|\n| 30 | the tree is empty | root | 0 |\n| 10 | $10 < 30$ left | left child of 30 | 1 |\n| 50 | $50 > 30$ right | right child of 30 | 1 |\n| 20 | $20 < 30$ left, $20 > 10$ right | right child of 10 | 2 |\n| 40 | $40 > 30$ right, $40 < 50$ left | left child of 50 | 2 |\n| 25 | $25 < 30$ left, $25 > 10$ right, $25 > 20$ right | right child of 20 | 3 |\n| 22 | $22 < 30$ left, $22 > 10$ right, $22 > 20$ right, $22 < 25$ left | left child of 25 | 4 |\n\n' +
        'The deepest key is 22. Its route is 30, 10, 20, 25, 22, which is 5 nodes joined by 4 edges.',
      conclusion: 'The longest root-to-leaf route has 4 edges, so the height is 4.',
      whyWrong: [
        null,
        'This assumes the tree is perfectly balanced ($\\lfloor \\log_2 7 \\rfloor = 2$). The insertion order makes the left side much deeper, so you must actually build the tree.',
        'This counts the **nodes** on the longest path (30, 10, 20, 25, 22) instead of the edges between them.',
        'This assumes the tree becomes a single chain ($7 - 1 = 6$), which only happens when the keys arrive in sorted order.',
      ],
      keyIdea: 'The insertion order sets a BST\'s shape, so build it key by key in a table and count the moves each key makes. The largest count is the height in edges. Never assume the tree is balanced.',
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
      asking: 'If every node has 0 or 2 children and 7 nodes have 2, how many have 0?',
      solution:
        'An **internal node** has children, and a **leaf** has none. In a full binary tree, every internal node has exactly 2 children.\n\n' +
        'Count the child links. 7 internal nodes with 2 children each make $7 \\times 2 = 14$ links, and each link leads to a different node.\n\n' +
        'Every node except the root is somebody\'s child. So the tree has those 14 children plus the root: $14 + 1 = 15$ nodes in total.\n\n' +
        'Take away the internal nodes, and what remains are the leaves: $15 - 7 = 8$.',
      conclusion: 'The tree has 15 nodes and 7 are internal, which leaves 8 leaves.',
      whyWrong: [
        null,
        'This assumes equal numbers of leaves and internal nodes. A full binary tree always has one more leaf.',
        'This is $2 \\times 7$, the number of child links. Most of those links lead to other internal nodes, not to leaves.',
        'This is the total number of nodes, $7 + 8 = 15$, not the number of leaves.',
      ],
      keyIdea: 'A full binary tree always has one more leaf than internal nodes. Test the rule on the smallest case: 1 internal node has 2 leaves. To derive it, count the child links.',
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
      asking: 'In what order does an in-order walk visit the nodes of this tree?',
      solution:
        '**In-order** means: visit the left subtree, then the node, then the right subtree. A **subtree** is a child and everything below it. The same rule applies inside each subtree.\n\n' +
        'The root K has its left subtree at C and its right subtree at M. So all of C\'s part comes first, then K, then M\'s part.\n\n' +
        'C\'s part: left child P, then C, then right child A. That gives P, C, A.\n\n' +
        'M\'s part: M has no left child, so write M, then its right child T. That gives M, T.\n\n' +
        'Join left part, root, right part: P, C, A, then K, then M, T.',
      conclusion: 'Each node comes between its left and right parts, so the answer is P, C, A, K, M, T.',
      whyWrong: [
        'This is the **pre-order** traversal (node, left, right), which starts with the root K.',
        'This is the **post-order** traversal (left, right, node), which ends with the root K.',
        null,
        'This is the **level-order** traversal, row by row. In-order finishes the whole left subtree before visiting the root.',
      ],
      keyIdea: 'For in-order, apply left, node, right at every node. The root splits the list into its left part and right part. In a BST this order lists the keys from smallest to largest.',
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
      asking: 'What total does `c` hold once `i` has climbed up to the root?',
      solution:
        'In a heap stored in an array, the parent of index `i` is at index `div(i,2)`. `div` means divide and round down, so `div(7,2)` is 3.\n\n' +
        'So line 5 moves `i` up to its parent, and line 6 adds the value there to `c`. `i` moves before anything is added, so `A[6]` is never added.\n\n' +
        'Write each index beside its value:\n\n| Index | 1 | 2 | 3 | 4 | 5 | 6 |\n|---|---|---|---|---|---|---|\n| `A[i]` | 9 | 7 | 8 | 3 | 5 | 6 |\n\n' +
        'Pass 1: $6 > 1$ is true. Line 5 sets `i` to `div(6,2)`, which is 3. Line 6 adds `A[3]`, which is 8, so `c` is 8.\n\n' +
        'Pass 2: $3 > 1$ is true. Line 5 sets `i` to `div(3,2)`, which is 1. Line 6 adds `A[1]`, which is 9, so `c` is $8 + 9 = 17$. Now $1 > 1$ is false, so the loop ends and line 8 prints 17.',
      conclusion: 'The loop adds the parent value 8 and the root value 9, so the answer is 17.',
      whyWrong: [
        null,
        'This also adds the starting item `A[6]`, which is 6. The loop moves `i` before adding, so `A[6]` is never added.',
        'This stops after the first parent. After that pass `i` is 3, and $3 > 1$ is true, so the loop runs again.',
        '`i` is halved on every pass, so it reaches 1 and the test fails.',
      ],
      keyIdea: 'In a heap array, repeating `div(i,2)` climbs from a node to the root. Make a table of `i` and the running total, and see whether the starting item is ever added.',
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
      asking: 'Once the keys are in the tree, what does a pre-order walk of it give?',
      solution:
        'In a **binary search tree**, each new key starts at the top node. If it is smaller, go left. If it is larger, go right. It goes in the first empty spot.\n\n' +
        'Build the tree:\n\n| Key | Route from the root | Placed as |\n|---|---|---|\n| 5 | the tree is empty | root |\n| 3 | $3 < 5$ left | left child of 5 |\n| 8 | $8 > 5$ right | right child of 5 |\n| 1 | $1 < 5$ left, $1 < 3$ left | left child of 3 |\n| 4 | $4 < 5$ left, $4 > 3$ right | right child of 3 |\n\n' +
        '**Pre-order** means: visit the node first, then its left subtree, then its right subtree.\n\n' +
        'Start at the root and write 5. Its left subtree starts at 3, so write 3, then its left child 1, then its right child 4.\n\n' +
        'Last comes the right subtree of 5, which is just 8. In order, that gives 5, 3, 1, 4, 8.',
      conclusion: 'Each node comes before its subtrees, and 3\'s whole subtree comes before 8, so the answer is 5, 3, 1, 4, 8.',
      whyWrong: [
        'This is the **in-order** traversal, which lists a BST in sorted order.',
        null,
        'This is the **post-order** traversal (left, right, node), which ends with the root 5.',
        'This is the **level-order** traversal, row by row. It is the same as the insertion order here, but pre-order finishes the subtree at 3 before visiting 8.',
      ],
      keyIdea: 'For a two-stage question, build the BST in a table first, then apply the traversal rule. Pre-order always starts with the first key inserted, because that key is the root.',
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
      asking: 'In which array is every parent at least as big as its children?',
      solution:
        'A **max-heap** needs every parent to be at least as large as its children. In an array of 5 items, only indexes 1 and 2 have children. Index 1\'s children are at 2 and 3, and index 2\'s are at 4 and 5.\n\n' +
        'So each array needs just those two checks:\n\n| Array | Index 1 against 2 and 3 | Index 2 against 4 and 5 | Valid? |\n|---|---|---|---|\n| `[9, 5, 8, 2, 4]` | $9 \\ge 5$ and $9 \\ge 8$ | $5 \\ge 2$ and $5 \\ge 4$ | yes |\n| `[9, 5, 8, 6, 4]` | $9 \\ge 5$ and $9 \\ge 8$ | $5 < 6$ | no |\n| `[5, 9, 8, 2, 4]` | $5 < 9$ | $9 \\ge 2$ and $9 \\ge 4$ | no |\n| `[2, 4, 5, 8, 9]` | $2 < 4$ | $4 < 8$ | no |',
      conclusion: 'Only one array passes every parent check, so the answer is `[9, 5, 8, 2, 4]`.',
      whyWrong: [
        null,
        'Index 2 holds 5 and its left child at index 4 holds 6, so a parent is smaller than its child.',
        'The root must be the largest value, but 5 is smaller than its child 9.',
        'This is sorted in ascending order, which makes it a **min-heap**: the smallest value is at the root.',
      ],
      keyIdea: 'To test a max-heap array of $n$ items, take each parent $i$ from index 1 to $n / 2$, rounded down, and compare it with indexes $2i$ and $2i + 1$. One failure rules the array out. It need not be sorted.',
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
