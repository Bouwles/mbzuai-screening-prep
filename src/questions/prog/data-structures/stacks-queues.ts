import type { StaticQuestion } from '../../../types';

// ---------------------------------------------------------------- helpers for the answer checks
// (used only by check.compute, never shown to students)

/** Simulate a sequence of stack operations; returns the list of popped values. */
function stackPops(ops: (number | 'pop')[]): { popped: number[]; left: number[] } {
  const s: number[] = [];
  const popped: number[] = [];
  for (const op of ops) {
    if (op === 'pop') popped.push(s.pop() as number);
    else s.push(op);
  }
  return { popped, left: s };
}

/** Stack-based bracket checker. */
function balanced(str: string): boolean {
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const s: string[] = [];
  for (const ch of str) {
    if ('([{'.includes(ch)) s.push(ch);
    else if (ch in pairs) {
      if (s.length === 0 || s.pop() !== pairs[ch]) return false;
    }
  }
  return s.length === 0;
}

/** Evaluate a postfix string with a stack (integers, + - *). */
function postfix(expr: string): number {
  const s: number[] = [];
  for (const t of expr.trim().split(/\s+/)) {
    if (t === '+' || t === '-' || t === '*' || t === '/') {
      const b = s.pop() as number;
      const a = s.pop() as number;
      s.push(t === '+' ? a + b : t === '-' ? a - b : t === '*' ? a * b : a / b);
    } else s.push(Number(t));
  }
  return s.pop() as number;
}

/** Can `order` be produced by pushing 1..n in order and popping at any time? */
function stackPermutationPossible(order: number[]): boolean {
  const s: number[] = [];
  let next = 1;
  for (const want of order) {
    while ((s.length === 0 || s[s.length - 1] !== want) && next <= order.length) s.push(next++);
    if (s[s.length - 1] !== want) return false;
    s.pop();
  }
  return true;
}

const strip = (o: string) => o.replace(/`/g, '');

/** Options of stacks-queues-013, shared with its check so the option values are computed, not typed in. */
const Q13_OPTIONS = ['`A B C × + D -`', '`A B + C × D -`', '`A B + C D - ×`', '`- × + A B C D`'];
/** Evaluate an option as postfix with A=2, B=3, C=4, D=5; null if it is not valid postfix. */
function q13Value(opt: string): number | null {
  const vals: Record<string, string> = { A: '2', B: '3', C: '4', D: '5', '×': '*' };
  const tokens = strip(opt).split(' ').map((t) => vals[t] ?? t);
  const s: number[] = [];
  for (const t of tokens) {
    if ('+-*'.includes(t)) {
      if (s.length < 2) return null;
      const b = s.pop() as number;
      const a = s.pop() as number;
      s.push(t === '+' ? a + b : t === '-' ? a - b : a * b);
    } else s.push(Number(t));
  }
  return s.length === 1 ? s[0] : null;
}

export const questions: StaticQuestion[] = [
  // ============================================================ FOUNDATION
  {
    id: 'stacks-queues-001',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'A web browser\'s **Back** button always takes you to the page you visited *most recently*, then the one before that, and so on. Which data structure is the natural way to store the history of visited pages?',
    options: ['A queue', 'A stack', 'A circular queue', 'A sorted list'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Each time you visit a page it is added to the history. Pressing **Back** must give you the page added **last**.\n\n' +
        '- "Last in, first out" is exactly the rule of a **stack** (LIFO).\n' +
        '- Visiting a page = **push** it on top; pressing Back = **pop** the top page.\n\n' +
        'So the history is a **stack**.',
      whyWrong: [
        'A queue is first in, first out (FIFO): Back would take you to the *oldest* page you visited, not the most recent one.',
        null,
        'A circular queue is still a queue (FIFO), just stored in a fixed array that wraps around. It removes the oldest item, not the newest.',
        'Sorting the pages (for example alphabetically) destroys the order in which they were visited, which is the one thing the Back button needs.',
      ],
      keyIdea: 'Whenever the most recently added item must come out first, use a stack (LIFO).',
    },
  },
  {
    id: 'stacks-queues-002',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'Starting with an empty stack, these operations are carried out in order:\n\n`push(5)`, `push(8)`, `push(3)`, `pop()`, `push(6)`, `pop()`, `pop()`\n\nWhat value is returned by the **last** `pop()`?',
    options: ['$8$', '$3$', '$6$', '$5$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Track the stack, writing it bottom to top (the top is on the right):\n\n' +
        '| Operation | Stack (bottom to top) | Returned |\n' +
        '|---|---|---|\n' +
        '| `push(5)` | 5 | |\n' +
        '| `push(8)` | 5, 8 | |\n' +
        '| `push(3)` | 5, 8, 3 | |\n' +
        '| `pop()` | 5, 8 | 3 |\n' +
        '| `push(6)` | 5, 8, 6 | |\n' +
        '| `pop()` | 5, 8 | 6 |\n' +
        '| `pop()` | 5 | **8** |\n\n' +
        'The last `pop()` returns $8$.',
      whyWrong: [
        null,
        'This is queue thinking: if items left from the *front* (first in, first out), the pops would return 5, 8 and then 3. A stack removes from the top.',
        'This forgets that 6 was already removed by the previous `pop()`. Each pop removes the item, it does not just look at it.',
        'This is the value still left at the bottom of the stack at the end, not the value returned by the last pop.',
      ],
      keyIdea: 'A pop always removes the item that is currently on top, i.e. the most recently pushed item that is still there.',
    },
    check: {
      optionValues: [8, 3, 6, 5],
      compute: () => {
        const { popped } = stackPops([5, 8, 3, 'pop', 6, 'pop', 'pop']);
        return popped[popped.length - 1];
      },
    },
  },
  {
    id: 'stacks-queues-003',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'A queue at a help desk starts empty, and these operations are carried out in order:\n\n`enqueue(Amal)`, `enqueue(Bilal)`, `enqueue(Chen)`, `dequeue()`, `enqueue(Dana)`, `dequeue()`\n\nWho is now at the **front** of the queue?',
    options: ['Dana', 'Bilal', 'Amal', 'Chen'],
    correctIndex: 3,
    markScheme: {
      solution:
        'In a queue, items join at the **rear** and leave from the **front** (first in, first out).\n\n' +
        '| Operation | Queue (front to rear) | Removed |\n' +
        '|---|---|---|\n' +
        '| `enqueue(Amal)` | Amal | |\n' +
        '| `enqueue(Bilal)` | Amal, Bilal | |\n' +
        '| `enqueue(Chen)` | Amal, Bilal, Chen | |\n' +
        '| `dequeue()` | Bilal, Chen | Amal |\n' +
        '| `enqueue(Dana)` | Bilal, Chen, Dana | |\n' +
        '| `dequeue()` | Chen, Dana | Bilal |\n\n' +
        'The front of the queue is now **Chen**.',
      whyWrong: [
        'Dana is at the **rear** (she joined last). This mixes up the front and the rear of the queue.',
        'This is stack thinking: removing the newest person each time (Chen, then Dana) leaves Amal, Bilal with Bilal on top. A queue removes the person who has waited longest.',
        'This comes from removing people from the rear (the end where they join) and then reading the front. Dequeue removes from the front, so Amal is the first to go.',
        null,
      ],
      keyIdea: 'A queue is FIFO: dequeue removes whoever has been waiting longest (the front).',
    },
    check: {
      optionValues: ['Dana', 'Bilal', 'Amal', 'Chen'],
      compute: () => {
        const q: string[] = [];
        const ops = ['Amal', 'Bilal', 'Chen', '-', 'Dana', '-'];
        for (const op of ops) {
          if (op === '-') q.shift();
          else q.push(op);
        }
        return q[0];
      },
    },
  },
  {
    id: 'stacks-queues-004',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'A Python list is used as a stack. What does this code print?',
    code: {
      lang: 'python',
      source: 's = []\ns.append(1)\ns.append(2)\ns.append(3)\ns.pop()\ns.append(4)\nprint(s)',
    },
    options: ['`[2, 3, 4]`', '`[1, 2, 3, 4]`', '`[1, 2, 4]`', '`[4, 2, 1]`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'In Python, `append` adds to the **end** of the list (the top of the stack) and `pop()` with no argument removes the **last** item (the top).\n\n' +
        '1. `s.append(1)`: `s = [1]`\n' +
        '2. `s.append(2)`: `s = [1, 2]`\n' +
        '3. `s.append(3)`: `s = [1, 2, 3]`\n' +
        '4. `s.pop()`: removes 3, `s = [1, 2]`\n' +
        '5. `s.append(4)`: `s = [1, 2, 4]`\n\n' +
        'It prints `[1, 2, 4]`.',
      whyWrong: [
        'This assumes `pop()` removes the **first** item (like a queue). With no argument, `pop()` removes the last item; `pop(0)` would remove the first.',
        'This forgets that `s.pop()` actually removes the 3 from the list.',
        null,
        'This writes the stack with the top on the left. Python prints a list in its stored order, from index 0 to the end, so the bottom item 1 comes first.',
      ],
      keyIdea: 'A Python list works as a stack: `append` pushes onto the end and `pop()` removes from the end.',
    },
    python: { stdout: '[1, 2, 4]\n' },
  },
  {
    id: 'stacks-queues-005',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'In a **singly** linked list, what does each node store?',
    options: [
      'A data value and a reference (pointer) to the previous node and to the next node',
      'A data value and its index position in the list',
      'A data value and a reference (pointer) to the next node',
      'Only a reference (pointer) to the head of the list',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'A linked list is a chain of **nodes**. In a *singly* linked list each node holds two things:\n\n' +
        '1. the **data** (the value stored), and\n' +
        '2. a **pointer** (reference) called `next` to the following node. The last node\'s `next` is `NULL` (`None` in Python).\n\n' +
        'The list itself only remembers the **head** (the first node). To reach any other node you follow the `next` pointers one by one.',
      whyWrong: [
        'Storing pointers to both the previous and the next node describes a **doubly** linked list, not a singly linked one.',
        'Linked-list nodes do not store an index. There is no direct "jump to position k"; that is why reaching a node means walking along the chain from the head.',
        null,
        'The head pointer is stored once, by the list, not inside every node. Nodes must store their data and the link to the next node.',
      ],
      keyIdea: 'A singly linked list node = data + one pointer to the next node; the list is accessed from its head.',
    },
  },
  {
    id: 'stacks-queues-006',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'A singly linked list has 50 nodes and you only have a pointer to the head (node 1). Starting at the head, how many times must you follow a `next` pointer to reach node 20?',
    options: ['$20$', '$1$', '$30$', '$19$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'You are already **at** node 1 when you start.\n\n' +
        '- 1 move takes you to node 2,\n' +
        '- 2 moves take you to node 3,\n' +
        '- in general, $k - 1$ moves take you to node $k$.\n\n' +
        'So reaching node 20 needs $20 - 1 = 19$ moves.\n\n' +
        'Unlike an array, there is no shortcut: the cost of reaching the $k$-th node grows with $k$, which is why access by position in a linked list is $O(n)$.',
      whyWrong: [
        'This is an off-by-one error: you start *on* node 1, so you need one fewer move than the node number.',
        'This treats the linked list like an array, where any position can be reached in one step by its index. A linked list has no index, so you must walk along the chain.',
        'This counts the nodes **after** node 20 ($50 - 20$), as if you were walking from the far end. A singly linked list can only be walked forwards from the head.',
        null,
      ],
      keyIdea: 'In a linked list you reach node $k$ from the head by following $k - 1$ `next` pointers, so access by position is $O(n)$.',
    },
    check: {
      optionValues: [20, 1, 30, 19],
      compute: () => {
        let node = 1;
        let moves = 0;
        while (node !== 20) {
          node += 1;
          moves += 1;
        }
        return moves;
      },
    },
  },

  // ============================================================ EXAM
  {
    id: 'stacks-queues-007',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'A program checks brackets with a stack: each opening bracket is pushed; each closing bracket must match the bracket popped from the top; at the end the stack must be empty. Which string passes the check (is **balanced**)?',
    options: ['`([)]`', '`(()`', '`{[()()]}`', '`())(`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Run the stack check on each string.\n\n' +
        '- `([)]`: push `(`, push `[`. Next `)` but the top is `[`: **mismatch**, fail.\n' +
        '- `(()`: push `(`, push `(`, `)` pops one `(`. End of string but one `(` is still on the stack: **fail**.\n' +
        '- `())(`: push `(`, `)` pops it, next `)` finds the stack **empty**: fail.\n' +
        '- `{[()()]}`: push `{`, push `[`, push `(`, `)` pops `(` (match), push `(`, `)` pops `(` (match), `]` pops `[` (match), `}` pops `{` (match). Stack empty at the end: **balanced**.\n\n' +
        'Only `{[()()]}` passes.',
      whyWrong: [
        'It has one of each bracket, but they close in the wrong order: `)` arrives while `[` is on top. Brackets must close in the reverse order to how they opened.',
        'The check fails at the end: one `(` is never closed, so the stack is not empty.',
        null,
        'Equal numbers of `(` and `)` are not enough. The second `)` arrives when the stack is empty, so there is nothing for it to match.',
      ],
      keyIdea: 'Brackets are balanced only if every closer matches the most recent unmatched opener (the stack top) and the stack is empty at the end.',
    },
    check: {
      optionValues: ['([)]', '(()', '{[()()]}', '())('],
      compute: () => {
        const ok = ['`([)]`', '`(()`', '`{[()()]}`', '`())(`'].map(strip).filter(balanced);
        return ok.length === 1 ? ok[0] : 'none or several';
      },
    },
  },
  {
    id: 'stacks-queues-008',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'Evaluate the postfix (Reverse Polish) expression below using a stack.\n\n`6 2 3 + * 4 -`',
    options: ['$-26$', '$20$', '$26$', '$30$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Rule: a **number** is pushed. An **operator** pops the top two values, the *first* pop is the right-hand operand $b$, the *second* pop is the left-hand operand $a$, and $a \\text{ op } b$ is pushed back.\n\n' +
        '| Token | Action | Stack (bottom to top) |\n' +
        '|---|---|---|\n' +
        '| `6` | push | 6 |\n' +
        '| `2` | push | 6, 2 |\n' +
        '| `3` | push | 6, 2, 3 |\n' +
        '| `+` | pop 3 and 2, push $2 + 3 = 5$ | 6, 5 |\n' +
        '| `*` | pop 5 and 6, push $6 \\times 5 = 30$ | 30 |\n' +
        '| `4` | push | 30, 4 |\n' +
        '| `-` | pop 4 and 30, push $30 - 4 = 26$ | 26 |\n\n' +
        'In ordinary notation this is $6 \\times (2 + 3) - 4 = 26$.',
      whyWrong: [
        'This swaps the operands of the subtraction: it does $4 - 30$. The value popped *second* (30) is the left-hand side, so it is $30 - 4$.',
        'This applies the operators in order to the numbers in order ($6 + 2 = 8$, $8 \\times 3 = 24$, $24 - 4 = 20$), ignoring the stack. In postfix an operator acts on the two most recent values on the stack.',
        null,
        'This stops one step early: $30$ is the stack after the multiplication, but the final `4 -` still has to be applied.',
      ],
      keyIdea: 'In postfix evaluation each operator pops $b$ then $a$ and pushes $a \\text{ op } b$, so the order matters for minus and divide.',
    },
    check: {
      optionValues: [-26, 20, 26, 30],
      compute: () => postfix('6 2 3 + * 4 -'),
    },
  },
  {
    id: 'stacks-queues-009',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'What does this code print?',
    code: {
      lang: 'python',
      source:
        'from collections import deque\n\nq = deque()\nfor x in [3, 1, 4, 1, 5]:\n    q.append(x)\nq.popleft()\nq.popleft()\nq.append(9)\nprint(list(q))',
    },
    options: ['`[3, 1, 4, 9]`', '`[4, 1, 5, 9]`', '`[9, 4, 1, 5]`', '`[3, 1, 4, 1, 5, 9]`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'A `deque` used like this is a **queue**: `append` adds at the rear (right), `popleft` removes from the front (left).\n\n' +
        '1. After the loop: `[3, 1, 4, 1, 5]`\n' +
        '2. `q.popleft()` removes 3: `[1, 4, 1, 5]`\n' +
        '3. `q.popleft()` removes the first 1: `[4, 1, 5]`\n' +
        '4. `q.append(9)`: `[4, 1, 5, 9]`\n\n' +
        'It prints `[4, 1, 5, 9]`.',
      whyWrong: [
        'This removes from the right-hand end (like `pop()`, stack behaviour), taking off 5 and then 1. `popleft` removes from the left, the front of the queue.',
        null,
        'This thinks `append` adds to the front. `append` always adds on the right (the rear); `appendleft` would add on the left.',
        'This treats `popleft()` as only *looking* at the front item (a peek). It actually removes the item and returns it.',
      ],
      keyIdea: 'With `collections.deque`, `append` plus `popleft` gives a FIFO queue: join on the right, leave from the left.',
    },
    python: { stdout: '[4, 1, 5, 9]\n' },
  },
  {
    id: 'stacks-queues-010',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'What does this code print?',
    code: {
      lang: 'python',
      source:
        's = []\nfor ch in "PYTHON":\n    s.append(ch)\n\nout = ""\nfor i in range(3):\n    out += s.pop()\n\nprint(out + "".join(s))',
    },
    options: ['`NOHTYP`', '`PYTHON`', '`NNNPYTHON`', '`NOHPYT`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The first loop pushes the letters, so `s = [\'P\', \'Y\', \'T\', \'H\', \'O\', \'N\']` with `N` on top.\n\n' +
        '| `i` | `s.pop()` returns | `out` | `s` afterwards |\n' +
        '|---|---|---|---|\n' +
        '| 0 | N | N | P Y T H O |\n' +
        '| 1 | O | NO | P Y T H |\n' +
        '| 2 | H | NOH | P Y T |\n\n' +
        'Then `"".join(s)` joins what is left **in list order** (bottom to top): `PYT`.\n\n' +
        'So it prints `NOH` + `PYT` = `NOHPYT`.',
      whyWrong: [
        'This reverses the whole word. Only three letters are popped (and reversed); the letters left in the list are joined in their normal order, bottom to top.',
        'This takes letters from the front of the list (queue behaviour), giving `PYT` + `HON`. `pop()` takes from the end.',
        'This treats `pop()` as only reading the top item without removing it, so `N` would be read three times. `pop()` removes the item.',
        null,
      ],
      keyIdea: 'Popping a stack gives items in reverse order of pushing; what is still in the list keeps its original order.',
    },
    python: { stdout: 'NOHPYT\n' },
  },
  {
    id: 'stacks-queues-011',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'You have $n$ items stored (a) in a singly linked list with a head pointer and (b) in an array (such as a Python list). What is the time cost of inserting a new item at the **very front** in each case?',
    options: [
      'Linked list: $O(n)$; array: $O(1)$',
      'Linked list: $O(1)$; array: $O(1)$',
      'Linked list: $O(n)$; array: $O(n)$',
      'Linked list: $O(1)$; array: $O(n)$',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Linked list.** Make a new node, set its `next` to the current head, then make the head point to the new node. That is two pointer changes, whatever the length of the list: $O(1)$.\n\n' +
        '**Array.** Array items sit in consecutive memory slots. To put a new item at index 0, every one of the $n$ existing items must move one place to the right first. That is about $n$ moves: $O(n)$.\n\n' +
        'Answer: linked list $O(1)$, array $O(n)$. (The opposite is true for *reading* the $k$-th item: an array does it in $O(1)$ by index, a linked list needs $O(n)$.)',
      whyWrong: [
        'This mixes up inserting with accessing by position. An array can *read* any index in $O(1)$, but inserting at the front forces every item to shift; the linked list only needs two pointer changes at the head.',
        'This forgets that inserting at the front of an array needs all $n$ items to shift right by one place.',
        'This assumes the linked list must be walked first. The front is the head, which you already have a pointer to, so no walking is needed.',
        null,
      ],
      keyIdea: 'Linked lists make insertion/deletion at the head, or just after a node you already have, $O(1)$ (just relink pointers), while arrays must shift elements, costing $O(n)$.',
    },
  },
  {
    id: 'stacks-queues-012',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'A circular queue is stored in an array with indices 0 to 4 (capacity 5). It starts empty with `rear = 0`. Each **enqueue** stores the item at index `rear` and then sets `rear = (rear + 1) mod 5`. Each **dequeue** removes the item at the front (the front index also moves on by 1, wrapping the same way).\n\nOperations: enqueue 10, 20, 30, 40; dequeue twice; enqueue 50; enqueue 60.\n\nAt which index is **60** stored?',
    options: ['$5$', '$0$', '$3$', '$1$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Follow `rear` (where the next item goes):\n\n' +
        '| Operation | Stored at | `rear` afterwards |\n' +
        '|---|---|---|\n' +
        '| enqueue 10 | 0 | 1 |\n' +
        '| enqueue 20 | 1 | 2 |\n' +
        '| enqueue 30 | 2 | 3 |\n' +
        '| enqueue 40 | 3 | 4 |\n' +
        '| dequeue, dequeue | (10 and 20 removed; front moves to index 2) | 4 |\n' +
        '| enqueue 50 | 4 | $(4 + 1) \\bmod 5 = 0$ |\n' +
        '| enqueue 60 | **0** | 1 |\n\n' +
        'The dequeues freed indices 0 and 1, and the circular queue reuses them by wrapping round. 60 is stored at index $0$.',
      whyWrong: [
        'This forgets the "mod 5" wrap-around: $4 + 1 = 5$, but index 5 does not exist. The rear wraps back to index 0.',
        null,
        'This assumes the remaining items shift to the start of the array after each dequeue (as in a Python list). A circular queue never moves items; only the front and rear indices move.',
        'This gives the value of `rear` *after* storing 60 (the next free slot), not the index where 60 was stored.',
      ],
      keyIdea: 'In a circular queue the indices wrap with mod capacity, so slots freed at the start of the array are reused.',
    },
    check: {
      optionValues: [5, 0, 3, 1],
      compute: () => {
        const cap = 5;
        const arr: (number | null)[] = Array(cap).fill(null);
        let rear = 0;
        let front = 0;
        const enq = (x: number) => {
          arr[rear] = x;
          rear = (rear + 1) % cap;
        };
        const deq = () => {
          arr[front] = null;
          front = (front + 1) % cap;
        };
        [10, 20, 30, 40].forEach(enq);
        deq();
        deq();
        enq(50);
        enq(60);
        return arr.indexOf(60);
      },
    },
  },
  {
    id: 'stacks-queues-013',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'Which is the postfix (Reverse Polish) form of the infix expression $(A + B) \\times C - D$?',
    options: Q13_OPTIONS,
    correctIndex: 1,
    markScheme: {
      solution:
        'In postfix, each operator comes **after** its two operands, and the order of evaluation is built in (no brackets needed).\n\n' +
        '1. The bracket is done first: $A + B$ becomes `A B +`.\n' +
        '2. That result is multiplied by $C$: `A B + C ×`.\n' +
        '3. Then $D$ is subtracted: `A B + C × D -`.\n\n' +
        '**Check with numbers** $A = 2$, $B = 3$, $C = 4$, $D = 5$: infix gives $(2 + 3) \\times 4 - 5 = 15$. Postfix `2 3 + 4 × 5 -`: $2 + 3 = 5$, $5 \\times 4 = 20$, $20 - 5 = 15$. They agree.',
      whyWrong: [
        'This ignores the brackets and follows normal precedence: it is the postfix of $A + B \\times C - D$ (with the numbers above it gives $2 + 12 - 5 = 9$, not 15).',
        null,
        'This is the postfix of $(A + B) \\times (C - D)$: the subtraction happens before the multiplication (with the numbers above it gives $5 \\times (-1) = -5$).',
        'This is **prefix** (Polish) notation, where operators come *before* their operands. Postfix puts each operator after its operands.',
      ],
      keyIdea: 'To convert to postfix, write each operation as "left operand, right operand, operator", doing brackets first.',
    },
    check: {
      // value of each option when evaluated as postfix with A=2, B=3, C=4, D=5 (prefix option is not valid postfix)
      optionValues: Q13_OPTIONS.map(q13Value),
      compute: () => {
        const A = 2,
          B = 3,
          C = 4,
          D = 5;
        return (A + B) * C - D;
      },
    },
  },
  {
    id: 'stacks-queues-014',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'In a singly linked list, `P` points to a node and `X = P.next` is the node straight after it (`X` is not the last node). Which single pseudocode statement **deletes** `X` from the list?',
    options: ['`P ← P.next.next`', '`X.next ← NULL`', '`P.next ← P.next.next`', '`P.next ← X`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Before: `P → X → Y → ...` where `Y = X.next = P.next.next`.\n\n' +
        'To delete `X`, the node before it must "skip over" it, so `P` must point straight to `Y`:\n\n' +
        '`P.next ← P.next.next`\n\n' +
        'After: `P → Y → ...`. Nothing points to `X` any more, so it is no longer part of the list. Only one pointer changed, so deletion (once you have `P`) is $O(1)$.',
      whyWrong: [
        'This only moves the *variable* `P` to point at `Y`. No node\'s `next` pointer changes, so the list itself is unchanged and `X` is still in it.',
        'This cuts the list after `X`: `X` stays linked from `P`, and every node after `X` is lost.',
        null,
        'This changes nothing: `P.next` already is `X`.',
      ],
      keyIdea: 'To delete a node from a linked list, make the previous node\'s next pointer skip over it.',
    },
  },
  {
    id: 'stacks-queues-015',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'What does this code print?',
    code: {
      lang: 'python',
      source:
        'class Node:\n    def __init__(self, value, nxt=None):\n        self.value = value\n        self.next = nxt\n\nhead = Node(5, Node(3, Node(8, Node(2, Node(2, Node(7))))))\n\nnode = head\ncount = 0\nwhile node.next is not None:\n    if node.value > node.next.value:\n        count += 1\n    node = node.next\nprint(count)',
    },
    options: ['`3`', '`2`', '`5`', '`4`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The list is `5 → 3 → 8 → 2 → 2 → 7`. The loop compares each node with the next one and stops when `node` is the last node (its `next` is `None`).\n\n' +
        '| `node.value` | `node.next.value` | `>`? | `count` |\n' +
        '|---|---|---|---|\n' +
        '| 5 | 3 | yes | 1 |\n' +
        '| 3 | 8 | no | 1 |\n' +
        '| 8 | 2 | yes | 2 |\n' +
        '| 2 | 2 | no | 2 |\n' +
        '| 2 | 7 | no | 2 |\n\n' +
        'Then `node` is the 7 node, whose `next` is `None`, so the loop ends. It prints `2`.',
      whyWrong: [
        'This counts the pair 2, 2 as well, as if the test were `>=`. $2 > 2$ is false.',
        null,
        'This counts every comparison (every loop iteration), not only the ones where the value goes down.',
        'This counts every change of value, up or down (5 to 3, 3 to 8, 8 to 2, 2 to 7). Only decreases are counted.',
      ],
      keyIdea: 'Traversing a linked list means following `next` pointers until `None`, looking at `node.value` and `node.next.value` on the way.',
    },
    python: { stdout: '2\n' },
  },
  {
    id: 'stacks-queues-016',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'A circular queue uses an array with indices 0 to 7 (capacity 8). Its front item is at index 6 and it currently holds 5 items in consecutive slots, wrapping from index 7 back to 0 when needed. At which index is the **rear** (last) item?',
    options: ['$10$', '$3$', '$2$', '$4$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The items sit in 5 consecutive slots starting at the front, wrapping round after index 7:\n\n' +
        '6, 7, 0, 1, 2\n\n' +
        'So the rear item is at index 2. Using the formula:\n\n' +
        '$$\\text{rear} = (\\text{front} + \\text{size} - 1) \\bmod 8 = (6 + 5 - 1) \\bmod 8 = 10 \\bmod 8 = 2$$',
      whyWrong: [
        'This forgets to wrap round: index 10 does not exist in an array of capacity 8. Take the answer mod 8.',
        'This is the next **free** slot, $(6 + 5) \\bmod 8$. The last item is one before that, because the front item itself is the first of the 5.',
        null,
        'This assumes the items start at index 0 (like a normal list), so the last of 5 items would be at index 4. In a circular queue the items start at the front index, here 6.',
      ],
      keyIdea: 'In a circular queue of capacity $N$, the rear item is at $(\\text{front} + \\text{size} - 1) \\bmod N$.',
    },
    check: {
      optionValues: [10, 3, 2, 4],
      compute: () => {
        const cap = 8;
        let idx = 6;
        for (let k = 1; k < 5; k++) idx = (idx + 1) % cap;
        return idx;
      },
    },
  },

  // ============================================================ CHALLENGE
  {
    id: 'stacks-queues-017',
    subtopic: 'stacks-queues',
    difficulty: 'challenge',
    stem: 'The numbers 1, 2, 3, 4 are pushed onto an empty stack **in that order**, but a `pop` (which prints the value removed) may be done at any moment between the pushes. Every number is eventually popped. Which printed sequence is **impossible**?',
    options: ['`4 3 2 1`', '`1 2 3 4`', '`3 1 4 2`', '`2 1 4 3`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Try to produce each sequence.\n\n' +
        '- `4 3 2 1`: push 1, 2, 3, 4, then pop four times. Possible.\n' +
        '- `1 2 3 4`: push 1, pop; push 2, pop; push 3, pop; push 4, pop. Possible.\n' +
        '- `2 1 4 3`: push 1, push 2, pop (2), pop (1), push 3, push 4, pop (4), pop (3). Possible.\n' +
        '- `3 1 4 2`: to print 3 first, push 1, 2, 3 and pop 3. Now the stack is 1, 2 with **2 on top**. The next print must be 2 (or a new number after pushing 4), never 1, because 1 is buried under 2. **Impossible.**\n\n' +
        'Quick test: once a number is printed, any smaller numbers still on the stack must come out in *decreasing* order. In `3 1 4 2`, after 3 the remaining smaller numbers 1 and 2 come out as 1 then 2, which is increasing.',
      whyWrong: [
        'This is possible: push all four, then pop all four. Pushes do not have to be interleaved with pops.',
        'This is possible: pop each number straight after pushing it. A stack can output items in their original order this way.',
        null,
        'This is possible: push 1 and 2, pop both (2 then 1), then push 3 and 4 and pop both (4 then 3).',
      ],
      keyIdea: 'A stack can only release the item on top, so an item cannot come out while a later-pushed item is still above it.',
    },
    check: {
      optionValues: ['4 3 2 1', '1 2 3 4', '3 1 4 2', '2 1 4 3'],
      compute: () => {
        const bad = ['4 3 2 1', '1 2 3 4', '3 1 4 2', '2 1 4 3'].filter(
          (o) => !stackPermutationPossible(o.split(' ').map(Number)),
        );
        return bad.length === 1 ? bad[0] : 'none or several';
      },
    },
  },
  {
    id: 'stacks-queues-018',
    subtopic: 'stacks-queues',
    difficulty: 'challenge',
    stem: 'What does this code print?',
    code: {
      lang: 'python',
      source:
        'def evaluate(tokens):\n    stack = []\n    for t in tokens:\n        if t in "+-*/":\n            b = stack.pop()\n            a = stack.pop()\n            if t == "+":\n                stack.append(a + b)\n            elif t == "-":\n                stack.append(a - b)\n            elif t == "*":\n                stack.append(a * b)\n            else:\n                stack.append(a / b)\n        else:\n            stack.append(int(t))\n    return stack.pop()\n\nprint(evaluate("4 6 2 - * 8 4 / +".split()))',
    },
    options: ['`18`', '`-15.5`', '`3.5`', '`18.0`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`split()` gives the tokens `4`, `6`, `2`, `-`, `*`, `8`, `4`, `/`, `+`. Numbers are pushed; an operator pops `b` (top) then `a` and pushes `a op b`.\n\n' +
        '| Token | Action | `stack` |\n' +
        '|---|---|---|\n' +
        '| `4` | push | [4] |\n' +
        '| `6` | push | [4, 6] |\n' +
        '| `2` | push | [4, 6, 2] |\n' +
        '| `-` | b = 2, a = 6, push $6 - 2 = 4$ | [4, 4] |\n' +
        '| `*` | b = 4, a = 4, push $4 \\times 4 = 16$ | [16] |\n' +
        '| `8` | push | [16, 8] |\n' +
        '| `4` | push | [16, 8, 4] |\n' +
        '| `/` | b = 4, a = 8, push `8 / 4` = `2.0` | [16, 2.0] |\n' +
        '| `+` | b = 2.0, a = 16, push `16 + 2.0` = `18.0` | [18.0] |\n\n' +
        'In Python 3, `/` **always** gives a float, so `8 / 4` is `2.0`, and an int plus a float is a float. It prints `18.0`.',
      whyWrong: [
        'The arithmetic is right, but in Python 3 the `/` operator always returns a float (`8 / 4` is `2.0`), so the final sum is the float `18.0`.',
        'This swaps the operands, computing `b op a` instead of `a op b`: $2 - 6 = -4$, $-4 \\times 4 = -16$, $4 / 8 = 0.5$, $0.5 + (-16) = -15.5$. The value popped first is the right-hand operand.',
        'This takes the two **oldest** values (from the bottom, queue style) instead of the two on top of the stack. A stack always works on the most recent values.',
        null,
      ],
      keyIdea: 'Postfix evaluation pops the right operand first, then the left; and in Python 3, `/` always produces a float.',
    },
    python: { stdout: '18.0\n' },
  },
  {
    id: 'stacks-queues-019',
    subtopic: 'stacks-queues',
    difficulty: 'challenge',
    stem: 'A queue is built from two stacks, `IN` and `OUT`.\n\n- **enqueue(x)**: push x onto `IN`.\n- **dequeue()**: if `OUT` is empty, pop every item from `IN` and push it onto `OUT` (one at a time); then pop and return the top of `OUT`.\n\nStarting with both stacks empty: enqueue 1, enqueue 2, enqueue 3, dequeue, enqueue 4, enqueue 5, dequeue, dequeue.\n\nWhat do the three dequeues return, in order?',
    options: ['1, 4, 5', '3, 5, 4', '3, 2, 1', '1, 2, 3'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Stacks are written bottom to top.\n\n' +
        '| Step | `IN` | `OUT` | Returned |\n' +
        '|---|---|---|---|\n' +
        '| enqueue 1, 2, 3 | 1, 2, 3 | empty | |\n' +
        '| dequeue: `OUT` empty, so move 3, then 2, then 1 | empty | 3, 2, 1 | |\n' +
        '| ...then pop `OUT` | empty | 3, 2 | **1** |\n' +
        '| enqueue 4, 5 | 4, 5 | 3, 2 | |\n' +
        '| dequeue: `OUT` not empty, pop it | 4, 5 | 3 | **2** |\n' +
        '| dequeue: `OUT` not empty, pop it | 4, 5 | empty | **3** |\n\n' +
        'Moving items from one stack to another **reverses** them, so the oldest item ends up on top of `OUT`. The dequeues return 1, 2, 3, exactly the first-in, first-out order of a real queue.',
      whyWrong: [
        'This moves `IN` onto `OUT` on every dequeue, even when `OUT` is not empty. That buries 2 and 3 under 5 and 4. The rule only transfers when `OUT` is empty.',
        'This treats the structure as a single plain stack (always removing the newest item). The two-stack design exists precisely to give queue order.',
        'This forgets that moving items from one stack to another reverses their order: `OUT` becomes 3, 2, 1 with **1** on top, not 3.',
        null,
      ],
      keyIdea: 'Pouring one stack into another reverses the order, which turns LIFO into FIFO: two stacks can make a queue.',
    },
    check: {
      optionValues: ['1, 4, 5', '3, 5, 4', '3, 2, 1', '1, 2, 3'],
      compute: () => {
        const IN: number[] = [];
        const OUT: number[] = [];
        const got: number[] = [];
        const enq = (x: number) => IN.push(x);
        const deq = () => {
          if (OUT.length === 0) while (IN.length) OUT.push(IN.pop() as number);
          got.push(OUT.pop() as number);
        };
        enq(1);
        enq(2);
        enq(3);
        deq();
        enq(4);
        enq(5);
        deq();
        deq();
        return got.join(', ');
      },
    },
  },
  {
    id: 'stacks-queues-020',
    subtopic: 'stacks-queues',
    difficulty: 'challenge',
    stem: 'What does this code print?',
    code: {
      lang: 'python',
      source:
        'class Node:\n    def __init__(self, value, nxt=None):\n        self.value = value\n        self.next = nxt\n\nhead = Node(1, Node(2, Node(3, Node(4))))\nprev = None\ncurr = head\nfor _ in range(2):\n    nxt = curr.next\n    curr.next = prev\n    prev = curr\n    curr = nxt\n\nout = []\nnode = prev\nwhile node is not None:\n    out.append(node.value)\n    node = node.next\nnode = curr\nwhile node is not None:\n    out.append(node.value)\n    node = node.next\nprint(out)',
    },
    options: ['`[2, 1, 3, 4]`', '`[4, 3, 2, 1]`', '`[2, 1]`', '`[1, 2, 3, 4]`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Start: `1 → 2 → 3 → 4`, `prev = None`, `curr` = node 1. Each loop pass turns one node\'s arrow backwards.\n\n' +
        '| Pass | `nxt` | `curr.next` set to | `prev` | `curr` |\n' +
        '|---|---|---|---|---|\n' +
        '| 1 | node 2 | `None` (node 1 now points to nothing) | node 1 | node 2 |\n' +
        '| 2 | node 3 | node 1 (node 2 now points to node 1) | node 2 | node 3 |\n\n' +
        'Now there are two separate chains:\n\n' +
        '- from `prev`: `2 → 1 → None`\n' +
        '- from `curr`: `3 → 4 → None` (nodes 3 and 4 were never touched)\n\n' +
        'The first `while` loop collects 2, 1 and the second collects 3, 4. It prints `[2, 1, 3, 4]`.',
      whyWrong: [
        null,
        'This is the result of a **full** reversal (4 passes). The loop only runs twice, so only the first two arrows are reversed.',
        'This thinks nodes 3 and 4 are lost. They are still reachable through `curr` (saved in `nxt` before the arrow was changed), and the second loop prints them.',
        'This assumes nothing changed, but the loop really does re-point `curr.next`, so nodes 1 and 2 are now linked backwards.',
      ],
      keyIdea: 'Reversing a linked list re-points one next pointer per step, keeping a saved reference (`nxt`) so the rest of the list is not lost.',
    },
    python: { stdout: '[2, 1, 3, 4]\n' },
  },
  {
    id: 'stacks-queues-021',
    subtopic: 'stacks-queues',
    difficulty: 'challenge',
    stem: 'In a singly linked list, `P` points to an existing node and `N` is a new node. Which pair of pseudocode statements, carried out **in the order shown**, correctly inserts `N` straight after `P` without losing any nodes?',
    options: [
      '`P.next ← N`, then `N.next ← P.next`',
      '`N.next ← P.next`, then `P.next ← N`',
      '`P.next ← N`, then `N.next ← NULL`',
      '`N.next ← P`, then `P.next ← N`',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Before: `P → Q → ...` (where `Q = P.next`).\n\n' +
        '1. `N.next ← P.next`: `N` now points to `Q`. Nothing is lost, because `P` still points to `Q` too.\n' +
        '2. `P.next ← N`: `P` now points to `N`.\n\n' +
        'After: `P → N → Q → ...`. Two pointer changes, so insertion after a known node is $O(1)$.\n\n' +
        'The order matters: if `P.next` is overwritten first, the only link to `Q` (and everything after it) is gone.',
      whyWrong: [
        'The order is wrong. After `P.next ← N`, the value of `P.next` is `N` itself, so `N.next ← P.next` makes `N` point to itself (a loop), and `Q` onwards is lost.',
        null,
        'This links `P` to `N` but then ends the list at `N`, so every node that used to come after `P` is lost.',
        'This makes `N` point back to `P`, creating a loop `P → N → P`, and the rest of the list after `P` is lost.',
      ],
      keyIdea: 'When inserting into a linked list, connect the new node to the rest of the list first, then point the previous node at it.',
    },
  },
];
