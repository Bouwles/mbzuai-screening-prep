import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps, table } from '../../../lib/explanation';
import { m } from '../../../lib/tex';

// ---------------------------------------------------------------- tiny tree toolkit
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
/** Height in edges (empty = -1, single node = 0). */
const height = (t?: T): number => (t ? 1 + Math.max(height(t.l), height(t.r)) : -1);
/** Depth (in edges) of the shallowest leaf. */
const minLeafDepth = (t: T): number => {
  if (!t.l && !t.r) return 0;
  const ds: number[] = [];
  if (t.l) ds.push(minLeafDepth(t.l));
  if (t.r) ds.push(minLeafDepth(t.r));
  return 1 + Math.min(...ds);
};
/** One longest root-to-leaf path (list of keys). */
const longestPath = (t: T): Key[] => {
  if (!t.l && !t.r) return [t.v];
  const a = t.l ? longestPath(t.l) : [];
  const b = t.r ? longestPath(t.r) : [];
  return [t.v, ...(a.length >= b.length ? a : b)];
};
const seq = (xs: Key[]) => xs.join(', ');

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

/** Random binary tree with the given labels and depth at most maxDepth. */
function randomTree(rng: Rng, labels: Key[], maxDepth: number): T {
  const root = N(labels[0]);
  const slots: { p: T; side: 'l' | 'r'; depth: number }[] = [
    { p: root, side: 'l', depth: 1 },
    { p: root, side: 'r', depth: 1 },
  ];
  for (const lab of labels.slice(1)) {
    const k = rng.int(0, slots.length - 1);
    const s = slots.splice(k, 1)[0];
    const node = N(lab);
    s.p[s.side] = node;
    if (s.depth < maxDepth) slots.push({ p: node, side: 'l', depth: s.depth + 1 }, { p: node, side: 'r', depth: s.depth + 1 });
  }
  return root;
}

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

/** One row per key, in insertion order: its route down the tree, where it lands and how many edges that is. */
function insertionRows(keys: number[]): string[][] {
  const rows = [[String(keys[0]), 'the tree is empty', 'root', '0']];
  const root = N(keys[0]);
  for (const k of keys.slice(1)) {
    let cur = root;
    const moves: string[] = [];
    for (;;) {
      const cv = cur.v as number;
      const side = k < cv ? 'l' : 'r';
      moves.push(k < cv ? `${m(`${k} < ${cv}`)} left` : `${m(`${k} > ${cv}`)} right`);
      const next = cur[side];
      if (!next) {
        cur[side] = N(k);
        rows.push([String(k), moves.join(', '), `${side === 'l' ? 'left' : 'right'} child of ${cv}`, String(moves.length)]);
        break;
      }
      cur = next;
    }
  }
  return rows;
}

type Cand = { text: string; value: number | string; why: string };
/** Up to 3 candidates that differ from the answer and from each other, by value and by text. */
function pickDistinct(answerText: string, answerValue: number | string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (c.value === answerValue || c.text === answerText) continue;
    if (out.some((x) => x.value === c.value || x.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W'];

type Order = 'pre' | 'in' | 'post';
const ORDER_NAME: Record<Order, string> = { pre: 'pre-order', in: 'in-order', post: 'post-order' };
const ORDER_RULE: Record<Order, string> = {
  pre: 'visit the **node first**, then its left subtree, then its right subtree',
  in: 'visit the **left subtree** first, then the node, then the right subtree',
  post: 'visit the left subtree, then the right subtree, and the **node last**',
};
/** The order to join the pieces in, as a short phrase. */
const ORDER_WORDS: Record<Order, string> = { pre: 'node, left, right', in: 'left, node, right', post: 'left, right, node' };

export const generators: Generator[] = [
  // ------------------------------------------------------------ traversal of a drawn tree
  {
    id: 'gen-trees-traversal',
    subtopic: 'trees',
    difficulty: 'exam',
    title: 'Pre-order, in-order or post-order traversal of a binary tree',
    generate(rng) {
      for (;;) {
        const n = rng.int(6, 9);
        const labels = rng.sample(LETTERS, n);
        const tree = randomTree(rng, labels, 3);
        const order = rng.pick(['pre', 'in', 'post'] as const);
        const P = seq(pre(tree));
        const I = seq(ino(tree));
        const Po = seq(post(tree));
        const Lv = seq(levelOrder(tree));
        const answer = order === 'pre' ? P : order === 'in' ? I : Po;
        const root = String(tree.v);
        const rev = (s: Key[]) => seq([...s].reverse());
        // In-order puts the root first if it has no left child, last if it has no right child.
        const inRootPos = !tree.l ? 'first' : !tree.r ? 'last' : 'in the middle';
        let pool: Cand[];
        if (order === 'pre')
          pool = [
            {
              text: I,
              value: I,
              why: tree.l
                ? `This is the **in-order** traversal (left, node, right). Pre-order visits each node before its subtrees, so it must start with the root ${root}.`
                : 'This is the **in-order** traversal (left, node, right), which visits each node only after its left subtree. Pre-order visits each node **before** both of its subtrees.',
            },
            { text: Po, value: Po, why: `This is the **post-order** traversal (left, right, node), which ends with the root ${root} instead of starting with it.` },
            { text: Lv, value: Lv, why: 'This is the **level-order** traversal (row by row). Pre-order goes deep first: it finishes each subtree completely before moving on to the next one.' },
            { text: rev(post(tree)), value: rev(post(tree)), why: 'This visits each node first but then goes to the **right** subtree before the left one (node, right, left). Standard pre-order always goes left first.' },
          ];
        else if (order === 'in')
          pool = [
            {
              text: P,
              value: P,
              why: tree.l
                ? `This is the **pre-order** traversal (node, left, right), which starts with the root ${root}. In-order visits the root only after its whole left subtree.`
                : 'This is the **pre-order** traversal (node, left, right), which visits each node before its left subtree. In-order visits each node **between** its left and right subtrees.',
            },
            { text: Po, value: Po, why: 'This is the **post-order** traversal (left, right, node). In-order visits each node between its left and right subtrees.' },
            { text: Lv, value: Lv, why: 'This is the **level-order** traversal (row by row), not a depth-first traversal.' },
            { text: rev(ino(tree)), value: rev(ino(tree)), why: 'This is in-order done backwards (right, node, left): it visits the right subtree first. In-order goes left first.' },
          ];
        else
          pool = [
            { text: P, value: P, why: `This is the **pre-order** traversal (node, left, right). In post-order the root ${root} must come **last**.` },
            {
              text: I,
              value: I,
              why:
                inRootPos === 'last'
                  ? 'This is the **in-order** traversal (left, node, right), which visits each node before its right subtree. Post-order visits each node only **after** both of its subtrees.'
                  : `This is the **in-order** traversal (left, node, right), where the root ${root} appears ${inRootPos} instead of last.`,
            },
            { text: rev(pre(tree)), value: rev(pre(tree)), why: 'This is the pre-order list written backwards, which gives right, left, node: the right subtree is visited before the left. Post-order goes left first.' },
            { text: Lv, value: Lv, why: 'This is the **level-order** traversal (row by row), not post-order.' },
          ];
        const distractors = pickDistinct(answer, answer, pool);
        if (distractors.length < 3) continue; // shape too simple: re-roll

        // bottom-up working: every internal node below the root, children before parents
        const res = new Map<T, string>();
        const rows: string[][] = [];
        const visit = (t?: T): void => {
          if (!t) return;
          visit(t.l);
          visit(t.r);
          const own = seq(order === 'pre' ? pre(t) : order === 'in' ? ino(t) : post(t));
          res.set(t, own);
          if ((t.l || t.r) && t !== tree) rows.push([String(t.v), t.l ? res.get(t.l)! : 'nothing', t.r ? res.get(t.r)! : 'nothing', own]);
        };
        visit(tree);
        const words = ORDER_WORDS[order];
        const leftPart = tree.l ? `Its left subtree gives ${res.get(tree.l)}` : 'It has no left subtree';
        const rightPart = tree.r ? `its right subtree gives ${res.get(tree.r)}` : 'it has no right subtree';

        return {
          stem: `What is the **${ORDER_NAME[order]}** traversal of the binary tree below?\n\n${fence(draw(tree))}`,
          answer,
          answerValue: answer,
          distractors,
          asking: `In what order does a ${ORDER_NAME[order]} walk visit the nodes of this tree?`,
          solution: steps(
            'A **node** is one item in the tree, and the **root** is the node at the top. A **traversal** visits every node once. A **subtree** is a child and everything below it. A **leaf** is a node with no children, so on its own it just gives itself.',
            `${ORDER_NAME[order].charAt(0).toUpperCase() + ORDER_NAME[order].slice(1)} means: ${ORDER_RULE[order]}. The same rule applies inside every subtree.`,
            `Work from the bottom of the tree upwards, so each subtree is finished before the node above it. Each row joins its pieces in the order ${words}:`,
            table(['Node', 'Left gives', 'Right gives', 'Subtree gives'], rows),
            `Last comes the root, ${root}. ${leftPart}, and ${rightPart}. Joining them as ${words} gives ${answer}.`,
          ),
          conclusion: `Joining the pieces as ${words} at every node gives ${answer}.`,
          keyIdea:
            order === 'pre'
              ? 'Pre-order is node, left, right at every node, so the root comes first. Solve the small subtrees, then join the pieces. A list that does not start with the root is wrong.'
              : order === 'in'
                ? 'In-order is left, node, right at every node, so the root sits between its two subtrees. Solve the small subtrees, then join the pieces.'
                : 'Post-order is left, right, node at every node, so the root comes last. Solve the small subtrees, then join the pieces. A list that does not end with the root is wrong.',
        };
      }
    },
  },

  // ------------------------------------------------------------ build a BST from an insertion order
  {
    id: 'gen-trees-bst-build',
    subtopic: 'trees',
    difficulty: 'exam',
    title: 'Build a BST from an insertion order: height or search cost',
    generate(rng) {
      for (;;) {
        const n = rng.int(6, 8);
        const pool10: number[] = [];
        for (let k = 10; k <= 99; k++) pool10.push(k);
        const keys = rng.sample(pool10, n);
        const tree = bst(keys);
        const h = height(tree);
        const kind = rng.pick(['height', 'search'] as const);
        const intro = `The keys ${keys.join(', ')} are inserted in that order into an empty binary search tree.`;
        const bstRule = 'In a **binary search tree** (BST), each new key starts at the top node, the root. If it is smaller than a node, it goes left. If it is larger, it goes right. It lands in the first empty spot.';
        const insertion = insertionRows(keys);

        if (kind === 'height') {
          const path = longestPath(tree);
          const balanced = Math.floor(Math.log2(n));
          const shortest = minLeafDepth(tree);
          const pool: Cand[] = [
            { text: String(h + 1), value: h + 1, why: `This counts the **nodes** on the longest path (${path.join(', ')}) instead of the edges between them.` },
            { text: String(balanced), value: balanced, why: `This assumes the tree is perfectly balanced (${m(`\\lfloor \\log_2 ${n} \\rfloor = ${balanced}`)}). The insertion order decides the shape, so you have to build the tree.` },
            { text: String(n - 1), value: n - 1, why: `This assumes the tree becomes one long chain (${m(`${n} - 1 = ${n - 1}`)}), which only happens when the keys arrive in sorted order.` },
            { text: String(shortest), value: shortest, why: 'This is the depth of the **shallowest** leaf. Height is measured along the **longest** root-to-leaf path.' },
          ];
          const distractors = pickDistinct(String(h), h, pool);
          if (distractors.length < 3) continue;
          return {
            stem: `${intro} What is its height, counted in **edges** on the longest root-to-leaf path?`,
            answer: String(h),
            answerValue: h,
            distractors,
            asking: 'How many edges are on the longest route down the tree built from these keys?',
            solution: steps(
              bstRule,
              'Insert the keys in the given order. Each move down one line is one **edge**, so the moves in a route tell us how deep that key sits:',
              table(['Key', 'Route from the root', 'Placed as', 'Edges from the root'], insertion),
              `The largest number in the last column is ${h}, reached by key ${path[path.length - 1]}. Nothing sits below that key, which makes it a **leaf**. Its route is ${path.join(', ')}, which is ${path.length} nodes joined by ${h} edges.`,
            ),
            conclusion: `The longest route from the root to a leaf has ${h} edges, so the height is ${h}.`,
            keyIdea: 'The insertion order sets a BST\'s shape, so build it key by key in a table and count the moves each key makes. The largest count is the height in edges. Never assume the tree is balanced.',
          };
        }

        // search cost for a key at depth >= 2
        const deep: { key: number; path: number[] }[] = [];
        const collect = (t: T | undefined, path: number[]) => {
          if (!t) return;
          const p = [...path, t.v as number];
          if (p.length >= 3) deep.push({ key: t.v as number, path: p });
          collect(t.l, p);
          collect(t.r, p);
        };
        collect(tree, []);
        if (!deep.length) continue;
        const target = rng.pick(deep);
        const comps = target.path.length;
        const insPos = keys.indexOf(target.key) + 1;
        const sorted = [...keys].sort((a, b) => a - b);
        const rankPos = sorted.indexOf(target.key) + 1;
        const pool: Cand[] = [
          { text: String(comps - 1), value: comps - 1, why: `This counts the edges travelled (or forgets the final comparison that finds ${target.key}). Every node on the path is compared, including ${target.key} itself.` },
          { text: String(insPos), value: insPos, why: `This is the position of ${target.key} in the insertion list: the cost of a linear search through the keys in the order given, not a BST search.` },
          { text: String(rankPos), value: rankPos, why: `This is the position of ${target.key} in sorted order: the cost of scanning the sorted keys one by one, not a BST search.` },
          { text: String(n), value: n, why: 'This compares with every node, as if the keys were in an unordered list. A BST search only follows one path down from the root.' },
        ];
        const distractors = pickDistinct(String(comps), comps, pool);
        if (distractors.length < 3) continue;
        const rows = target.path.map((v, i) => {
          const res = v === target.key ? 'found, so stop' : target.key < v ? 'go left' : 'go right';
          const rel = v === target.key ? '=' : target.key < v ? '<' : '>';
          return [i + 1, v, m(`${target.key} ${rel} ${v}`), res];
        });
        return {
          stem: `${intro} How many nodes are compared when searching for **${target.key}**, including ${target.key} itself?`,
          answer: String(comps),
          answerValue: comps,
          distractors,
          asking: `How many nodes does a search for ${target.key} look at on its way down the tree?`,
          solution: steps(
            bstRule,
            'Build the tree by inserting the keys in the given order:',
            table(['Key', 'Route from the root', 'Placed as'], insertion.map((r) => r.slice(0, 3))),
            `A search follows the same rule from the root, comparing ${target.key} with one node at a time. Each row of this table is one comparison:`,
            table(['Comparison', 'Node', 'Result', 'Next'], rows),
          ),
          conclusion: `The search only looked at ${target.path.join(', ')}. That is ${comps} nodes, so the answer is ${comps}.`,
          keyIdea: 'A BST search compares one node per level along a single route, so build the tree first and then walk down it. A key at depth $d$ (edges from the root) costs $d + 1$ comparisons.',
        };
      }
    },
  },

  // ------------------------------------------------------------ node-count formulas
  {
    id: 'gen-trees-node-counts',
    subtopic: 'trees',
    difficulty: 'exam',
    title: 'Maximum nodes at a level / in a tree, and minimum height',
    generate(rng) {
      for (;;) {
        const kind = rng.pick(['level', 'total', 'minHeight'] as const);
        const heightDef = 'Taking height as the number of edges on the longest root-to-leaf path,';
        if (kind === 'level') {
          const k = rng.int(3, 10);
          const ans = 2 ** k;
          const pool: Cand[] = [
            { text: String(2 ** (k - 1)), value: 2 ** (k - 1), why: `This treats the root as level 1, so it only doubles ${k - 1} times (${m(`2^{${k - 1}}`)}). With the root at level 0, level ${k} needs ${k} doublings.` },
            { text: String(2 ** (k + 1) - 1), value: 2 ** (k + 1) - 1, why: `This is the maximum number of nodes in the **whole tree** from level 0 to level ${k} (${m(`2^{${k + 1}} - 1`)}), not on level ${k} alone.` },
            { text: String(2 ** (k + 1)), value: 2 ** (k + 1), why: `This doubles one time too many: ${m(`2^{${k + 1}}`)} is the maximum for level ${k + 1}.` },
            { text: String(2 * k), value: 2 * k, why: 'This adds 2 nodes per level instead of doubling. Each node can have 2 children, so the count **multiplies** by 2 every level.' },
          ];
          const distractors = pickDistinct(String(ans), ans, pool);
          if (distractors.length < 3) continue;
          const rows = Array.from({ length: k }, (_, x) => [x, 2 ** x]);
          return {
            stem: `In a binary tree the root is at **level 0**, its children are at level 1, and so on. What is the **maximum** number of nodes that can be at level ${k}?`,
            answer: String(ans),
            answerValue: ans,
            distractors,
            asking: `How many nodes fit on level ${k} if every level above it is completely full?`,
            solution: steps(
              '**Level** says how many rows a node is below the root. The root is at level 0, its children are at level 1, and so on.',
              'Each node can have at most 2 children, so each level can hold at most double the level above:',
              table(['Level', 'Most nodes'], rows),
              `Level ${k} is one more doubling: ${m(`${2 ** (k - 1)} \\times 2 = ${ans}`)}. That is the same as ${m(`2^{${k}}`)}, because we start from 1 node and double ${k} times.`,
            ),
            conclusion: `Doubling ${k} times from the single root gives ${m(`2^{${k}}`)}, so the answer is ${ans}.`,
            keyIdea: 'With the root at level 0, level $k$ holds at most $2^k$ nodes, because the count doubles each level. See how the question numbers the root: starting at level 1 shifts the power by one.',
          };
        }
        if (kind === 'total') {
          const h = rng.int(3, 9);
          const ans = 2 ** (h + 1) - 1;
          const pool: Cand[] = [
            { text: String(2 ** h - 1), value: 2 ** h - 1, why: `This treats height ${h} as ${h} levels, giving ${m(`2^{${h}} - 1`)}. Height ${h} measured in edges means ${h + 1} levels (0 to ${h}).` },
            { text: String(2 ** (h + 1)), value: 2 ** (h + 1), why: `This forgets to subtract 1: the formula is ${m('2^{h+1} - 1')}, not ${m('2^{h+1}')}.` },
            { text: String(2 ** h), value: 2 ** h, why: `This is only the bottom level (level ${h} holds at most ${m(`2^{${h}}`)} nodes); it forgets all the levels above.` },
            { text: String(2 * h + 1), value: 2 * h + 1, why: 'This adds 2 nodes per level instead of doubling the number of nodes on each level.' },
          ];
          const distractors = pickDistinct(String(ans), ans, pool);
          if (distractors.length < 3) continue;
          const terms: string[] = [];
          const rows: number[][] = [];
          for (let x = 0; x <= h; x++) {
            terms.push(String(2 ** x));
            rows.push([x, 2 ** x]);
          }
          return {
            stem: `${heightDef} what is the **maximum** number of nodes in a binary tree of height ${h}?`,
            answer: String(ans),
            answerValue: ans,
            distractors,
            asking: `How many nodes fit in a binary tree of height ${h} if every level is full?`,
            solution: steps(
              `Height counts the edges (lines between nodes) on the longest route. Height ${h} means the levels run from 0 to ${h}, which is ${h + 1} levels, not ${h}.`,
              'The most nodes fit when every level is full. Each node can have 2 children, so each level holds double the level above:',
              table(['Level', 'Most nodes'], rows),
              'Add all the levels together:',
              `$$${terms.join(' + ')} = ${ans}$$`,
            ),
            conclusion: `${h + 1} full levels hold ${ans} nodes in total, so the answer is ${ans}.`,
            keyIdea: 'A binary tree of height $h$ (in edges) has $h + 1$ levels and at most $2^{h+1} - 1$ nodes. See whether height is given in edges, because that decides the number of levels.',
          };
        }
        // minimum height for n nodes
        const n = rng.int(10, 500);
        if (Number.isInteger(Math.log2(n + 1))) continue; // perfect-tree sizes make two mistakes coincide
        let h = 0;
        while (2 ** (h + 1) - 1 < n) h++;
        const perfectFit = Math.floor(Math.log2(n + 1)) - 1;
        const pool: Cand[] = [
          { text: String(h + 1), value: h + 1, why: `This counts **levels** (a height-${h} tree has ${h + 1} levels) instead of edges.` },
          { text: String(n - 1), value: n - 1, why: `This is the **largest** possible height, when the ${n} nodes form one chain. The question asks for the smallest.` },
          { text: String(perfectFit), value: perfectFit, why: `This is the tallest tree that can be **completely full** with at most ${n} nodes (${m(`2^{h+1} - 1 \\le ${n}`)}), not the shortest tree that can hold all ${n}. A tree of height ${perfectFit} holds at most ${m(`2^{${perfectFit + 1}} - 1 = ${2 ** (perfectFit + 1) - 1}`)} nodes, fewer than ${n}, so the leftover nodes need another level.` },
        ];
        const distractors = pickDistinct(String(h), h, pool);
        if (distractors.length < 3) continue;
        const tooShort = Array.from({ length: h }, (_, x) => [x, 2 ** (x + 1) - 1, 'no']);
        return {
          stem: `${heightDef} what is the **smallest possible height** of a binary tree with ${n} nodes?`,
          answer: String(h),
          answerValue: h,
          distractors,
          asking: `How short can a binary tree with ${n} nodes be?`,
          solution: steps(
            'A tree is as short as possible when every level is filled before a new one starts. So we want the first height with enough room.',
            'Height counts the edges (lines between nodes) on the longest route, so a tree of height $h$ has $h + 1$ levels. When all of them are full, the total $1 + 2 + 4 + \\dots$ comes to $2^{h+1} - 1$ nodes.',
            `Try the heights in turn, looking for room for ${n} nodes:`,
            table(['Height', 'Most nodes', `Room for ${n}?`], tooShort),
            `Height ${h} holds at most ${m(`2^{${h + 1}} - 1 = ${2 ** (h + 1) - 1}`)} nodes. That is at least ${n}, so it is the first height with enough room.`,
          ),
          conclusion: `Height ${h - 1} holds only ${2 ** h - 1} nodes and height ${h} holds ${2 ** (h + 1) - 1}, so the smallest possible height is ${h}.`,
          keyIdea: 'For smallest height, find the first $h$ where $2^{h+1} - 1$ is at least the number of nodes. As a shortcut, that is $\\lfloor \\log_2 n \\rfloor$. The tallest possible tree is a chain of height $n - 1$.',
        };
      }
    },
  },
];
