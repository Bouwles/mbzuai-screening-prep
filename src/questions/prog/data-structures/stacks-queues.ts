import type { StaticQuestion } from '../../../types';

/** Join source lines into one code string. */
const L = (...lines: string[]) => lines.join('\n');

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

const strip = (o: string) => o.replace(/`/g, '');
const show = (a: number[]) => `[${a.join(', ')}]`;

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
    stem: 'Which data structure removes the most recently added item first?',
    options: ['A queue', 'A stack', 'A circular queue', 'A sorted list'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Removing the most recently added item first is "last in, first out" (LIFO), the rule of a **stack**.\n\n' +
        '- **Push** adds an item on top.\n' +
        '- **Pop** removes the item on top, which is always the newest one still there.\n\n' +
        'A queue does the opposite: it removes the oldest item first.',
      whyWrong: [
        'A queue is first in, first out (FIFO): it removes the *oldest* item, not the most recent one.',
        null,
        'A circular queue is still a queue (FIFO), just stored in a fixed array that wraps around. It removes the oldest item, not the newest.',
        'A sorted list keeps items in order of value, so the order they were added in is lost.',
      ],
      keyIdea: 'Whenever the most recently added item must come out first, use a stack (LIFO).',
    },
  },
  {
    id: 'stacks-queues-004',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'A stack prints from bottom to top. What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('S = []', 'push(S, 1)', 'push(S, 2)', 'push(S, 3)', 'pop(S)', 'push(S, 4)', 'print(S)'),
    },
    options: ['`[2, 3, 4]`', '`[1, 2, 3, 4]`', '`[1, 2, 4]`', '`[4, 2, 1]`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '`push` adds on top and `pop` removes the top item.\n\n' +
        '| Operation | `S` afterwards |\n' +
        '|---|---|\n' +
        '| `push(S, 1)` | `[1]` |\n' +
        '| `push(S, 2)` | `[1, 2]` |\n' +
        '| `push(S, 3)` | `[1, 2, 3]` |\n' +
        '| `pop(S)` | `[1, 2]` |\n' +
        '| `push(S, 4)` | `[1, 2, 4]` |\n\n' +
        'It prints `[1, 2, 4]`.',
      whyWrong: [
        'This assumes `pop` removes the **bottom** item (like a queue). It removes the top item, which is 3.',
        'This forgets that `pop(S)` actually removes the 3.',
        null,
        'This writes the stack with the top first. The stem says it prints from bottom to top, so the bottom item 1 comes first.',
      ],
      keyIdea: 'Push and pop both work at the top of the stack; the bottom items stay where they are.',
    },
    check: {
      optionValues: ['[2, 3, 4]', '[1, 2, 3, 4]', '[1, 2, 4]', '[4, 2, 1]'],
      compute: () => show(stackPops([1, 2, 3, 'pop', 4]).left),
    },
  },
  {
    id: 'stacks-queues-005',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'In a **singly** linked list, what does each node store?',
    options: [
      'A value and pointers to both neighbouring nodes',
      'A value and its index in the list',
      'A value and a pointer to the next node',
      'Only a pointer to the head of the list',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'A linked list is a chain of **nodes**. In a *singly* linked list each node holds two things:\n\n' +
        '1. the **data** (the value stored), and\n' +
        '2. a **pointer** (reference) called `next` to the following node. The last node\'s `next` is `NULL`, meaning "no node".\n\n' +
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
    stem: 'Starting at the head (node 1) of a 50-node singly linked list, how many `next` pointers must you follow to reach node 20?',
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
  {
    id: 'stacks-queues-022',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'Which principle does a queue follow?',
    options: ['First in first out', 'Last in first out', 'First in last out', 'Last in last out'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A queue adds items at the rear and removes them from the front, so the item that has waited longest leaves first: **first in first out (FIFO)**.\n\n' +
        'Think of a line at a shop: the first person to join is the first to be served.',
      whyWrong: [
        null,
        'That is the rule of a stack, which removes the newest item. A queue removes the oldest item.',
        'First in last out is another way of saying last in first out, which is the rule of a stack.',
        'In a queue the last arrival does leave last, so this describes the same behaviour in other words, but the standard name for it is first in first out (FIFO).',
      ],
      keyIdea: 'A queue is FIFO: first in, first out.',
    },
  },
  {
    id: 'stacks-queues-023',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'Which principle does a stack follow?',
    options: ['Last in first out', 'First in last out', 'First in first out', 'Last in last out'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A stack adds and removes at the same end (the top), so the newest item leaves first: **last in first out (LIFO)**.\n\n' +
        '"Last in first out" and "First in last out" describe the same behaviour: if the last item in is the first out, then the first item in must be the last out. If both appear as options, pick the standard name, LIFO.\n\n' +
        'First in first out and last in last out both describe a queue.',
      whyWrong: [
        null,
        'This describes the same behaviour as last in first out, but LIFO is the standard name, so choose it when both appear.',
        'That is the rule of a queue, where the oldest item leaves first. A stack removes the newest item.',
        'That describes a queue, where the newest item leaves last. In a stack the newest item leaves first.',
      ],
      keyIdea: 'A stack is LIFO. FILO means the same thing, but LIFO is the standard name.',
    },
  },
  {
    id: 'stacks-queues-024',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'Which item does `pop` remove from a stack?',
    options: ['The item at the bottom', 'The item on top', 'The largest item', 'The item in the middle'],
    correctIndex: 1,
    markScheme: {
      solution: '`pop` removes and returns the item on **top** of the stack, which is the most recently pushed item still there.',
      whyWrong: [
        'The bottom item is the oldest. It is the last to leave, because only the top can be reached.',
        null,
        'A stack ignores the size of its values. Only the order in which they were pushed matters.',
        'A stack gives access to one end only, the top, so the middle cannot be reached directly.',
      ],
      keyIdea: '`pop` removes the top item of a stack.',
    },
  },
  {
    id: 'stacks-queues-025',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'Which item does `dequeue` remove from a queue?',
    options: ['The item at the rear', 'The smallest item', 'The item at the front', 'The item in the middle'],
    correctIndex: 2,
    markScheme: {
      solution: '`dequeue` removes and returns the item at the **front** of the queue, which is the item that has waited longest.',
      whyWrong: [
        'The rear is where new items join, so the rear item is the newest. It leaves last.',
        'A queue ignores the size of its values. Only the order in which they joined matters.',
        null,
        'A queue only removes from the front, so an item in the middle has to wait its turn.',
      ],
      keyIdea: '`dequeue` removes the front item of a queue.',
    },
  },
  {
    id: 'stacks-queues-026',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'Where does `push` add a new item on a stack?',
    options: ['At the bottom', 'In the middle', 'In sorted position', 'On top'],
    correctIndex: 3,
    markScheme: {
      solution: '`push` puts the new item on **top** of the stack. It is then the first item a `pop` will remove.',
      whyWrong: [
        'Nothing can be added at the bottom without moving the whole stack. New items go on top.',
        'A stack has one working end, the top, so nothing is inserted in the middle.',
        'A stack keeps items in the order they arrived and does not sort them by value.',
        null,
      ],
      keyIdea: '`push` adds to the top of a stack.',
    },
  },
  {
    id: 'stacks-queues-027',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'Where does `enqueue` add a new item in a queue?',
    options: ['At the rear', 'At the front', 'In the middle', 'In sorted position'],
    correctIndex: 0,
    markScheme: {
      solution: '`enqueue` adds the new item at the **rear** of the queue, like joining the back of a line. Items leave from the front.',
      whyWrong: [
        null,
        'The front is where items leave. Joining there would let a new item go ahead of everyone already waiting.',
        'A queue only adds at one end, the rear, so nothing is inserted in the middle.',
        'A queue keeps items in the order they arrived and does not sort them by value.',
      ],
      keyIdea: '`enqueue` adds to the rear of a queue.',
    },
  },
  {
    id: 'stacks-queues-028',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'The values 1, 2, 3 are pushed onto an empty stack in that order, then all popped. In what order do they come out?',
    options: ['1, 2, 3', '3, 2, 1', '2, 1, 3', '3, 1, 2'],
    correctIndex: 1,
    markScheme: {
      solution:
        'After the pushes the stack, bottom to top, is 1, 2, 3.\n\n' +
        'Each pop takes the current top: first 3, then 2, then 1.\n\n' +
        'So a stack gives items back in the reverse of the order they went in.',
      whyWrong: [
        'This is the order a **queue** would give. A stack gives the newest item back first.',
        null,
        'The first pop must return the top item, which is 3, the last value pushed.',
        'After 3 is popped the new top is 2, not 1. The bottom item comes out last.',
      ],
      keyIdea: 'Pushing items and then popping them all reverses their order.',
    },
    check: {
      optionValues: ['1, 2, 3', '3, 2, 1', '2, 1, 3', '3, 1, 2'],
      compute: () => stackPops([1, 2, 3, 'pop', 'pop', 'pop']).popped.join(', '),
    },
  },
  {
    id: 'stacks-queues-029',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
    stem: 'In a queue, insertion and deletion take place at:',
    options: ['The same end', 'Opposite ends', 'The middle', 'Any position'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Insertion** means adding an item (enqueue) and **deletion** means removing one (dequeue).\n\n' +
        'A queue inserts at the rear and deletes at the front, so the two operations work at **opposite ends**. That is what makes it first in, first out.',
      whyWrong: [
        'Inserting and deleting at the same end describes a stack, which gives last in, first out.',
        null,
        'Nothing in a queue happens in the middle. Items join at the rear and leave from the front.',
        'A queue restricts both operations to one end each. Access at any position describes an array.',
      ],
      keyIdea: 'Queue: insert at the rear, delete at the front. Stack: both at the top.',
    },
  },

  // ============================================================ EXAM
  {
    id: 'stacks-queues-002',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('S = []', 'push(S, 5)', 'push(S, 8)', 'push(S, 3)', 'pop(S)', 'push(S, 6)', 'pop(S)', 'print(pop(S))'),
    },
    options: ['8', '3', '6', '5'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Track the stack, writing it bottom to top (the top is on the right):\n\n' +
        '| Operation | Stack (bottom to top) | Returned |\n' +
        '|---|---|---|\n' +
        '| `push(S, 5)` | 5 | |\n' +
        '| `push(S, 8)` | 5, 8 | |\n' +
        '| `push(S, 3)` | 5, 8, 3 | |\n' +
        '| `pop(S)` | 5, 8 | 3 |\n' +
        '| `push(S, 6)` | 5, 8, 6 | |\n' +
        '| `pop(S)` | 5, 8 | 6 |\n' +
        '| `print(pop(S))` | 5 | **8** |\n\n' +
        'It prints 8.',
      whyWrong: [
        null,
        'This is queue thinking: if items left from the *front* (first in, first out), the removals would return 5, 8 and then 3. A stack removes from the top.',
        'This forgets that 6 was already removed by the previous `pop(S)`. Each pop removes the item, it does not just look at it.',
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
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('Q = []', 'enqueue(Q, 4)', 'enqueue(Q, 7)', 'enqueue(Q, 2)', 'dequeue(Q)', 'enqueue(Q, 9)', 'dequeue(Q)', 'print(dequeue(Q))'),
    },
    options: ['9', '7', '4', '2'],
    correctIndex: 3,
    markScheme: {
      solution:
        'In a queue, items join at the **rear** and leave from the **front** (first in, first out).\n\n' +
        '| Operation | Queue (front to rear) | Removed |\n' +
        '|---|---|---|\n' +
        '| `enqueue(Q, 4)` | 4 | |\n' +
        '| `enqueue(Q, 7)` | 4, 7 | |\n' +
        '| `enqueue(Q, 2)` | 4, 7, 2 | |\n' +
        '| `dequeue(Q)` | 7, 2 | 4 |\n' +
        '| `enqueue(Q, 9)` | 7, 2, 9 | |\n' +
        '| `dequeue(Q)` | 2, 9 | 7 |\n' +
        '| `print(dequeue(Q))` | 9 | **2** |\n\n' +
        'It prints 2.',
      whyWrong: [
        '9 is at the **rear** (it joined last). This mixes up the front and the rear of the queue.',
        'This is stack thinking: removing the newest item each time gives 2, then 9, then 7. A queue removes the item that has waited longest.',
        'This treats `dequeue(Q)` as only reading the front item, so 4 never leaves. Each dequeue removes the item.',
        null,
      ],
      keyIdea: 'A queue is FIFO: dequeue removes whichever item has been waiting longest (the front).',
    },
    check: {
      optionValues: [9, 7, 4, 2],
      compute: () => {
        const q: number[] = [4, 7, 2];
        q.shift();
        q.push(9);
        q.shift();
        return q.shift() as number;
      },
    },
  },
  {
    id: 'stacks-queues-007',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'A stack checks brackets: push each opener, each closer must match the popped top, and the stack must end empty. Which string is **balanced**?',
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
    stem: 'Evaluate the postfix (Reverse Polish) expression `6 2 3 + * 4 -` using a stack.',
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
    stem: 'Arrays are indexed from 1, and a queue prints from front to rear. What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'A = [3, 1, 4, 1, 5]',
        'Q = []',
        'for i = 1 to 5',
        '   enqueue(Q, A[i])',
        'end for',
        'dequeue(Q)',
        'dequeue(Q)',
        'enqueue(Q, 9)',
        'print(Q)',
      ),
    },
    options: ['`[3, 1, 4, 9]`', '`[4, 1, 5, 9]`', '`[9, 4, 1, 5]`', '`[3, 1, 4, 1, 5, 9]`'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`enqueue` adds at the rear and `dequeue` removes from the front.\n\n' +
        '| Step | `Q` afterwards |\n' +
        '|---|---|\n' +
        '| the `for` loop | `[3, 1, 4, 1, 5]` |\n' +
        '| first `dequeue(Q)` removes 3 | `[1, 4, 1, 5]` |\n' +
        '| second `dequeue(Q)` removes the first 1 | `[4, 1, 5]` |\n' +
        '| `enqueue(Q, 9)` | `[4, 1, 5, 9]` |\n\n' +
        'It prints `[4, 1, 5, 9]`.',
      whyWrong: [
        'This removes from the rear (stack behaviour), taking off 5 and then 1. `dequeue` removes from the front.',
        null,
        'This adds the 9 at the front. `enqueue` always adds at the rear.',
        'This treats `dequeue` as only looking at the front item. It actually removes the item.',
      ],
      keyIdea: 'In a queue, items join at the rear and leave from the front, so the earliest items go first.',
    },
    check: {
      optionValues: ['[3, 1, 4, 9]', '[4, 1, 5, 9]', '[9, 4, 1, 5]', '[3, 1, 4, 1, 5, 9]'],
      compute: () => {
        const q = [3, 1, 4, 1, 5];
        q.shift();
        q.shift();
        q.push(9);
        return show(q);
      },
    },
  },
  {
    id: 'stacks-queues-011',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'What is the time cost of inserting a new item at the **front** of an $n$-item singly linked list (with a head pointer), and of an $n$-item array?',
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
        '**Array.** Array items sit in consecutive memory slots. To put a new item in the first slot, every one of the $n$ existing items must move one place to the right first. That is about $n$ moves: $O(n)$.\n\n' +
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
    stem: 'A circular queue has capacity 5, with indices 0 to 4 and `rear` starting at 0. After enqueue 10, 20, 30, 40, two dequeues, then enqueue 50 and 60, at which index is 60?',
    options: ['$5$', '$0$', '$3$', '$1$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Each enqueue stores the item at index `rear`, then sets `rear` to $(\\text{rear} + 1) \\bmod 5$. Follow `rear`:\n\n' +
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
        'This assumes the remaining items shift to the start of the array after each dequeue. A circular queue never moves items; only the front and rear indices move.',
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
    stem: 'In a singly linked list, `X = P.next` is the node straight after `P`, and `X` is not the last node. Which statement **deletes** `X` from the list?',
    options: ['`P = P.next.next`', '`X.next = NULL`', '`P.next = P.next.next`', '`P.next = X`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Before: `P → X → Y → ...` where `Y = X.next = P.next.next`.\n\n' +
        'To delete `X`, the node before it must "skip over" it, so `P` must point straight to `Y`:\n\n' +
        '`P.next = P.next.next`\n\n' +
        'After: `P → Y → ...`. Nothing points to `X` any more, so it is no longer part of the list. Only one pointer changed, so deletion (once you have `P`) is $O(1)$.',
      whyWrong: [
        'This only moves the *variable* `P` to point at `Y`. No node\'s `next` pointer changes, so the list itself is unchanged and `X` is still in it.',
        '`NULL` means "no node", so this cuts the list after `X`: `X` stays linked from `P`, and every node after `X` is lost.',
        null,
        'This changes nothing: `P.next` already is `X`.',
      ],
      keyIdea: 'To delete a node from a linked list, make the previous node\'s next pointer skip over it.',
    },
  },
  {
    id: 'stacks-queues-016',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'A circular queue of capacity 8 (indices 0 to 7) has its front item at index 6 and holds 5 items. At which index is the **rear** (last) item?',
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
        'This assumes the items start at index 0, so the last of 5 items would be at index 4. In a circular queue the items start at the front index, here 6.',
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
  {
    id: 'stacks-queues-021',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'In a singly linked list, `N` is a new node. Which pair of statements, **in the order shown**, inserts `N` straight after node `P` without losing any nodes?',
    options: [
      '`P.next = N`, then `N.next = P.next`',
      '`N.next = P.next`, then `P.next = N`',
      '`P.next = N`, then `N.next = NULL`',
      '`N.next = P`, then `P.next = N`',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Before: `P → Q → ...` (where `Q = P.next`).\n\n' +
        '1. `N.next = P.next`: `N` now points to `Q`. Nothing is lost, because `P` still points to `Q` too.\n' +
        '2. `P.next = N`: `P` now points to `N`.\n\n' +
        'After: `P → N → Q → ...`. Two pointer changes, so insertion after a known node is $O(1)$.\n\n' +
        'The order matters: if `P.next` is overwritten first, the only link to `Q` (and everything after it) is gone.',
      whyWrong: [
        'The order is wrong. After `P.next = N`, the value of `P.next` is `N` itself, so `N.next = P.next` makes `N` point to itself (a loop), and `Q` onwards is lost.',
        null,
        '`NULL` means "no node", so this links `P` to `N` but then ends the list at `N`. Every node that used to come after `P` is lost.',
        'This makes `N` point back to `P`, creating a loop `P → N → P`, and the rest of the list after `P` is lost.',
      ],
      keyIdea: 'When inserting into a linked list, connect the new node to the rest of the list first, then point the previous node at it.',
    },
  },
  {
    id: 'stacks-queues-030',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'Arrays are indexed from 1, and so are strings. What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'word = "STACK"',
        'S = []',
        'for i = 1 to length(word)',
        '   push(S, word[i])',
        'end for',
        'out = ""',
        'for i = 1 to 3',
        '   out = out + pop(S)',
        'end for',
        'print(out)',
      ),
    },
    options: ['`KCA`', '`STA`', '`ACK`', '`KKK`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The first loop pushes S, T, A, C, K, so K is on top.\n\n' +
        '| `i` | `pop(S)` | `out` |\n' +
        '|---|---|---|\n' +
        '| 1 | K | K |\n' +
        '| 2 | C | KC |\n' +
        '| 3 | A | KCA |\n\n' +
        'It prints `KCA`.',
      whyWrong: [
        null,
        'This takes letters from the front (queue behaviour). `pop` takes from the top, which is the end of the word.',
        'This takes the right three letters but keeps them in their original order. Popping reverses the order.',
        'This treats `pop` as only reading the top item, so K is read three times. `pop` removes the item.',
      ],
      keyIdea: 'Popping a stack gives items in the reverse of the order they were pushed.',
    },
    check: {
      optionValues: ['KCA', 'STA', 'ACK', 'KKK'],
      compute: () => {
        const s = 'STACK'.split('');
        let out = '';
        for (let i = 1; i <= 3; i++) out += s.pop() as string;
        return out;
      },
    },
  },
  {
    id: 'stacks-queues-031',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('S = []', 'push(S, 2)', 'push(S, 5)', 'push(S, 9)', 't = 0', 'while (length(S) > 1)', '   t = t + pop(S)', 'end while', 'print(t)'),
    },
    options: ['14', '16', '7', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The stack starts as 2, 5, 9 (bottom to top). The loop runs while more than one item is left.\n\n' +
        '| `length(S)` at the test | `pop(S)` | `t` |\n' +
        '|---|---|---|\n' +
        '| 3 | 9 | 9 |\n' +
        '| 2 | 5 | 14 |\n\n' +
        'Now `length(S)` is 1, so $1 > 1$ is false and the loop stops. It prints 14.',
      whyWrong: [
        null,
        'This adds all three values. The test is `length(S) > 1`, so the loop stops with the 2 still on the stack.',
        'This adds 2 and 5, the two oldest values (queue thinking). `pop` takes the newest values first.',
        'Each pass pops one item, so `length(S)` falls by 1 and the test eventually fails.',
      ],
      keyIdea: 'Trace the stack and the loop test together: each pop shrinks the stack, so the test can become false.',
    },
    check: {
      optionValues: [14, 16, 7, 'Infinite loop'],
      compute: () => {
        const s = [2, 5, 9];
        let t = 0;
        let guard = 0;
        while (s.length > 1) {
          if (++guard > 1000) return 'Infinite loop';
          t += s.pop() as number;
        }
        return t;
      },
    },
  },
  {
    id: 'stacks-queues-032',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('S = []', 'push(S, 3)', 'push(S, 8)', 'while (length(S) > 0)', '   x = pop(S)', '   push(S, x)', 'end while', 'print(x)'),
    },
    options: ['8', '3', '2', 'Infinite loop'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Trace the first passes, with the stack written bottom to top:\n\n' +
        '| Pass | `x = pop(S)` | After `push(S, x)` | `length(S)` |\n' +
        '|---|---|---|---|\n' +
        '| 1 | 8 | 3, 8 | 2 |\n' +
        '| 2 | 8 | 3, 8 | 2 |\n' +
        '| 3 | 8 | 3, 8 | 2 |\n\n' +
        'Each pass pops 8 and pushes it straight back, so `length(S)` stays 2 and the test `length(S) > 0` is always true. The loop never ends, so `print(x)` is never reached.',
      whyWrong: [
        '8 is what the first pop returns, but it goes straight back on the stack, so the loop carries on and the `print` is never reached.',
        'This assumes the pops empty the stack, leaving 3 as the last value popped. Each popped value is pushed back, so the stack never shrinks.',
        'This is `length(S)`, which never changes. The code prints `x`, and the `print` is never reached.',
        null,
      ],
      keyIdea: 'A loop that waits for a stack to empty never ends if every pop is undone by a push.',
    },
    check: {
      optionValues: [8, 3, 2, 'Infinite loop'],
      compute: () => {
        const s = [3, 8];
        let x = 0;
        let guard = 0;
        while (s.length > 0) {
          if (++guard > 1000) return 'Infinite loop';
          x = s.pop() as number;
          s.push(x);
        }
        return x;
      },
    },
  },
  {
    id: 'stacks-queues-033',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('Q = []', 'enqueue(Q, 1)', 'enqueue(Q, 2)', 'enqueue(Q, 3)', 'for i = 1 to 2', '   x = dequeue(Q)', '   enqueue(Q, x)', 'end for', 'print(dequeue(Q))'),
    },
    options: ['3', '1', '2', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each pass moves the front item to the rear. The queue is written front to rear:\n\n' +
        '| `i` | `x` | Queue afterwards |\n' +
        '|---|---|---|\n' +
        '| start | | 1, 2, 3 |\n' +
        '| 1 | 1 | 2, 3, 1 |\n' +
        '| 2 | 2 | 3, 1, 2 |\n\n' +
        'The front item is now 3, so it prints 3.',
      whyWrong: [
        null,
        'This assumes moving an item leaves the order unchanged. Each moved item goes to the **rear**, so the front changes.',
        'This does only one pass. `for i = 1 to 2` includes 2, so the loop runs twice.',
        'A `for` loop runs a fixed number of times, here 2, even though the queue never gets shorter.',
      ],
      keyIdea: 'Dequeuing an item and enqueuing it again rotates the queue by one place.',
    },
    check: {
      optionValues: [3, 1, 2, 'Infinite loop'],
      compute: () => {
        const q = [1, 2, 3];
        for (let i = 1; i <= 2; i++) q.push(q.shift() as number);
        return q[0];
      },
    },
  },
];
