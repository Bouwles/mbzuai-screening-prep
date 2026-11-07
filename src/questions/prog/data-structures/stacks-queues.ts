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
      asking: 'Which structure gives back its newest item before any older ones?',
      solution:
        'Picture a pile of plates. Each new plate goes on top, and you can only lift a plate from the top. So the plate added last is the first one to come off.\n\n' +
        'A data structure that behaves like this pile is called a **stack**.',
      conclusion: 'The item added last comes off first, and that is how A stack behaves.',
      whyWrong: [
        'A queue is first in, first out (FIFO): it removes the *oldest* item, not the most recent one.',
        null,
        'A circular queue is still a queue (FIFO), just stored in a fixed array that wraps around. It removes the oldest item, not the newest.',
        'A sorted list keeps items in order of value, so the order they were added in is lost.',
      ],
      keyIdea: 'Ask which item leaves first. Newest first means a stack (a pile of plates). Oldest first means a queue (people waiting in a line), and a circular queue is still a queue.',
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
      asking: 'What is left on the stack after these pushes and the one pop?',
      solution:
        'A **stack** works like a pile of plates. `push(S, x)` puts `x` on top. `pop(S)` removes whatever is on top.\n\n' +
        'Follow the code line by line. We write the stack from bottom to top, so the rightmost value is the top:\n\n| Line | Code | Stack (bottom to top) |\n|---|---|---|\n| 1 | `S = []` | (empty) |\n| 2 | `push(S, 1)` | 1 |\n| 3 | `push(S, 2)` | 1, 2 |\n| 4 | `push(S, 3)` | 1, 2, 3 |\n| 5 | `pop(S)` | 1, 2 |\n\n' +
        'Line 5 removed 3, because 3 was on top at that moment.\n\n' +
        'Line 6 pushes 4 on top of 1, 2. Line 7 prints the stack from bottom to top, which gives `[1, 2, 4]`.',
      conclusion: 'The pop removed 3, and then 4 went on top, so the answer is `[1, 2, 4]`.',
      whyWrong: [
        'This assumes `pop` removes the **bottom** item (like a queue). It removes the top item, which is 3.',
        'This forgets that `pop(S)` actually removes the 3.',
        null,
        'This writes the stack with the top first. The stem says it prints from bottom to top, so the bottom item 1 comes first.',
      ],
      keyIdea: 'For stack code, write the stack as a row after every line, with the bottom on the left. `push` adds on the right and `pop` removes from the right. The last row is the answer.',
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
      asking: 'What is kept inside each item of a singly linked list?',
      solution:
        'A **linked list** is a chain of separate items called **nodes**. A node can sit anywhere in memory, so it needs a way to find the node after it.\n\n' +
        'A **pointer** is a stored location: it says where another node is. **Singly** means each node has just one link, and that link leads forward.\n\n' +
        'So a node holds two things: its own value, and one pointer to the next node.',
      conclusion: 'A node needs its data and the way forward, so the answer is A value and a pointer to the next node.',
      whyWrong: [
        'Storing pointers to both the previous and the next node describes a **doubly** linked list, not a singly linked one.',
        'Linked-list nodes do not store an index. There is no direct "jump to position k"; that is why reaching a node means walking along the chain from the head.',
        null,
        'The head pointer is stored once, by the list, not inside every node. Nodes must store their data and the link to the next node.',
      ],
      keyIdea: 'Match the word to the links. Singly means one pointer (next). Doubly means two pointers (next and previous). Every node also stores its own value.',
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
      asking: 'How many moves along the chain take you from node 1 to node 20?',
      solution:
        'You are already on node 1. Following one `next` pointer moves you on by exactly one node, and a linked list has no way to jump further than that.\n\n' +
        'Try small cases. Reaching node 2 takes 1 move, node 3 takes 2 moves, and node 4 takes 3 moves. The moves are always one fewer than the node number.\n\n' +
        'So node 20 takes $20 - 1 = 19$ moves. The 30 nodes after node 20 play no part.',
      conclusion: 'You start on node 1 and each pointer moves you one node, so reaching node 20 takes $19$ moves.',
      whyWrong: [
        'This is an off-by-one error: you start *on* node 1, so you need one fewer move than the node number.',
        'This treats the linked list like an array, where any position can be reached in one step by its index. A linked list has no index, so you must walk along the chain.',
        'This counts the nodes **after** node 20 ($50 - 20$), as if you were walking from the far end. A singly linked list can only be walked forwards from the head.',
        null,
      ],
      keyIdea: 'To reach node $k$ from the head of a linked list, follow $k - 1$ pointers. Test any such rule on a small case, such as node 2 taking 1 move.',
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
      asking: 'What rule decides which item leaves a queue next?',
      solution:
        'Think of people waiting in a line at a shop. New people join at the back, and the person at the front is served next.\n\n' +
        'So whoever arrived first leaves first. This rule is called first in first out, often shortened to FIFO.',
      conclusion: 'A queue serves items in the order they arrived, and the standard name for that is First in first out.',
      whyWrong: [
        null,
        'That is the rule of a stack, which removes the newest item. A queue removes the oldest item.',
        'First in last out is another way of saying last in first out, which is the rule of a stack.',
        'In a queue the last arrival does leave last, so this describes the same behaviour in other words, but the standard name for it is first in first out (FIFO).',
      ],
      keyIdea: 'Picture it. A line of people is a queue: first in first out (FIFO). A pile of plates is a stack: last in first out (LIFO).',
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
      asking: 'What rule decides which item leaves a stack next?',
      solution:
        'Think of a pile of plates. A new plate goes on top, and you can only lift a plate from the top.\n\n' +
        'So the plate added last is the first to come off. The standard name for this rule is last in first out, often shortened to LIFO.',
      conclusion: 'The newest item comes off first, and the standard name for that rule is Last in first out.',
      whyWrong: [
        null,
        'This describes the same behaviour as last in first out, but LIFO is the standard name, so choose it when both appear.',
        'That is the rule of a queue, where the oldest item leaves first. A stack removes the newest item.',
        'That describes a queue, where the newest item leaves last. In a stack the newest item leaves first.',
      ],
      keyIdea: 'Picture it. A pile of plates is a stack: last in first out (LIFO). A line of people is a queue: first in first out (FIFO). Choose the standard name when two options mean the same.',
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
      asking: 'Which single item can `pop` reach on a stack?',
      solution:
        'A stack works like a pile of plates, and you can only reach the plate on the top. `pop` removes an item and hands it back.\n\n' +
        'So the only item it can remove is the top one, whatever its value.',
      conclusion: '`pop` can only reach one end of the pile, so it removes The item on top.',
      whyWrong: [
        'The bottom item is the oldest. It is the last to leave, because only the top can be reached.',
        null,
        'A stack ignores the size of its values. Only the order in which they were pushed matters.',
        'A stack gives access to one end only, the top, so the middle cannot be reached directly.',
      ],
      keyIdea: 'Stack operations always act at the top: `push` adds there and `pop` removes from there. An item\'s size or position lower down never matters.',
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
      asking: 'Which item leaves a queue when `dequeue` runs?',
      solution:
        'A queue works like a line of people waiting. `dequeue` means the next person in the line is served and leaves.\n\n' +
        'The next person is whoever has waited longest, and that person is standing at the front.',
      conclusion: 'The item that has waited longest leaves first, so `dequeue` removes The item at the front.',
      whyWrong: [
        'The rear is where new items join, so the rear item is the newest. It leaves last.',
        'A queue ignores the size of its values. Only the order in which they joined matters.',
        null,
        'A queue only removes from the front, so an item in the middle has to wait its turn.',
      ],
      keyIdea: 'A queue uses two ends: `enqueue` adds at the rear and `dequeue` removes from the front. Item values never affect the order.',
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
      asking: 'Where does a new item go when you `push` it?',
      solution:
        'A stack works like a pile of plates. You can only touch one end of the pile, which is the top.\n\n' +
        'So a new plate can only go on the top of the pile, whatever its value.',
      conclusion: 'A stack has one working end, so `push` adds the new item On top.',
      whyWrong: [
        'Nothing can be added at the bottom without moving the whole stack. New items go on top.',
        'A stack has one working end, the top, so nothing is inserted in the middle.',
        'A stack keeps items in the order they arrived and does not sort them by value.',
        null,
      ],
      keyIdea: 'A stack has one working end, the top. Both `push` and `pop` happen there, so nothing is ever added at the bottom, in the middle or by size.',
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
      asking: 'Where does a new item join a queue?',
      solution:
        'A queue works like a line of people. The front is where people leave, and the rear is the back of the line.\n\n' +
        'A new arrival waits behind everyone already there, so `enqueue` adds the item at the back of the line, which is the rear.',
      conclusion: 'New arrivals wait behind everyone already there, so `enqueue` adds the item At the rear.',
      whyWrong: [
        null,
        'The front is where items leave. Joining there would let a new item go ahead of everyone already waiting.',
        'A queue only adds at one end, the rear, so nothing is inserted in the middle.',
        'A queue keeps items in the order they arrived and does not sort them by value.',
      ],
      keyIdea: 'Picture a line at a shop: join at the rear with `enqueue` and leave from the front with `dequeue`. Nobody joins in the middle or by value.',
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
      asking: 'In what order do 1, 2 and 3 come back off a stack?',
      solution:
        'A stack works like a pile of plates: `push` adds on top and `pop` takes the top item off.\n\n' +
        'After the three pushes the pile has 1 at the bottom, then 2, then 3 on top.\n\n' +
        'Now pop one at a time, always taking whatever is on top:\n\n| Pop | Comes out | Left on the stack (bottom to top) |\n|---|---|---|\n| first | 3 | 1, 2 |\n| second | 2 | 1 |\n| third | 1 | (empty) |',
      conclusion: 'Each pop takes the newest item left, so they come out as 3, 2, 1.',
      whyWrong: [
        'This is the order a **queue** would give. A stack gives the newest item back first.',
        null,
        'The first pop must return the top item, which is 3, the last value pushed.',
        'After 3 is popped the new top is 2, not 1. The bottom item comes out last.',
      ],
      keyIdea: 'Pushing everything and then popping everything reverses the order, so a stack can be used to reverse a list. A queue keeps the original order.',
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
      asking: 'Do items join and leave a queue at the same place or at different places?',
      solution:
        'In a queue, insertion (adding an item) happens at the rear, and deletion (removing an item) happens at the front.\n\n' +
        'The rear and the front are the two different ends of the line, so the two actions never share an end.',
      conclusion: 'Items join at the rear and leave from the front, which are Opposite ends.',
      whyWrong: [
        'Inserting and deleting at the same end describes a stack, which gives last in, first out.',
        null,
        'Nothing in a queue happens in the middle. Items join at the rear and leave from the front.',
        'A queue restricts both operations to one end each. Access at any position describes an array.',
      ],
      keyIdea: 'Use this test to tell the two structures apart. Queue: one end to join and the other end to leave. Stack: the same end for both.',
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
      asking: 'Which value does the final `pop` take off the stack?',
      solution:
        'A stack works like a pile of plates. `push(S, x)` puts `x` on top. `pop(S)` takes the top item off and gives it back.\n\n' +
        'On lines 5 and 7 the popped value is not used, so it just disappears. On line 8, `print(pop(S))` removes the top item and prints it.\n\n' +
        'Follow lines 1 to 7, with the stack written bottom to top, so the rightmost value is the top:\n\n| Line | Code | Stack after | Removed |\n|---|---|---|---|\n| 1 | `S = []` | (empty) | |\n| 2 | `push(S, 5)` | 5 | |\n| 3 | `push(S, 8)` | 5, 8 | |\n| 4 | `push(S, 3)` | 5, 8, 3 | |\n| 5 | `pop(S)` | 5, 8 | 3 |\n| 6 | `push(S, 6)` | 5, 8, 6 | |\n| 7 | `pop(S)` | 5, 8 | 6 |\n\n' +
        'Before line 8 the stack is 5, 8, so 8 is on top. Line 8 pops it, and `print` shows it.',
      conclusion: 'The last pop takes the item then on top and `print` shows it, so the answer is 8.',
      whyWrong: [
        null,
        'This is queue thinking: if items left from the *front* (first in, first out), the removals would return 5, 8 and then 3. A stack removes from the top.',
        'This forgets that 6 was already removed by the previous `pop(S)`. Each pop removes the item, it does not just look at it.',
        'This is the value still left at the bottom of the stack at the end, not the value returned by the last pop.',
      ],
      keyIdea: 'Keep a table with one row per line showing the whole stack. Check whether each `pop` only removes or also prints, because only `print` produces output.',
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
      asking: 'Which value does the final `dequeue` take from the queue?',
      solution:
        'A queue works like a line of people. `enqueue(Q, x)` adds `x` at the rear (the back). `dequeue(Q)` removes the item at the front and gives it back.\n\n' +
        'Follow lines 1 to 7, with the queue written front to rear, so the leftmost value is the front:\n\n| Line | Code | Queue after | Removed |\n|---|---|---|---|\n| 1 | `Q = []` | (empty) | |\n| 2 | `enqueue(Q, 4)` | 4 | |\n| 3 | `enqueue(Q, 7)` | 4, 7 | |\n| 4 | `enqueue(Q, 2)` | 4, 7, 2 | |\n| 5 | `dequeue(Q)` | 7, 2 | 4 |\n| 6 | `enqueue(Q, 9)` | 7, 2, 9 | |\n| 7 | `dequeue(Q)` | 2, 9 | 7 |\n\n' +
        'Before line 8 the queue is 2, 9, so 2 is at the front. Line 8 removes it, and `print` shows it.',
      conclusion: 'Each dequeue takes the item that has waited longest, and the last one takes 2, so the answer is 2.',
      whyWrong: [
        '9 is at the **rear** (it joined last). This mixes up the front and the rear of the queue.',
        'This is stack thinking: removing the newest item each time gives 2, then 9, then 7. A queue removes the item that has waited longest.',
        'This treats `dequeue(Q)` as only reading the front item, so 4 never leaves. Each dequeue removes the item.',
        null,
      ],
      keyIdea: 'Keep a table with one row per line showing the whole queue, front on the left. `enqueue` adds on the right and `dequeue` removes from the left.',
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
      asking: 'Which of the four bracket strings passes the stack test?',
      solution:
        'The test reads a string from left to right. An opener, such as `(`, is pushed onto the stack. A closer, such as `)`, must match the opener on top, which is then popped.\n\n' +
        'A string fails in one of three ways. A closer meets the wrong opener, a closer arrives when the stack is empty, or openers are still on the stack at the end.\n\n' +
        'Run the test on each string:\n\n| String | What happens | Result |\n|---|---|---|\n| `([)]` | Push `(`, push `[`. Then `)` arrives with `[` on top. | Wrong match |\n| `(()` | Push `(`, push `(`. Then `)` pops one. One `(` is left over. | Not empty |\n| `{[()()]}` | Push `{`, `[`, `(`. `)` pops `(`. Push `(`. `)` pops `(`. `]` pops `[`. `}` pops `{`. | Empty, every match correct |\n| `())(` | Push `(`. `)` pops it. The next `)` finds the stack empty. | Nothing to match |',
      conclusion: 'Only one string matches every closer and ends with an empty stack, so the balanced string is `{[()()]}`.',
      whyWrong: [
        'It has one of each bracket, but they close in the wrong order: `)` arrives while `[` is on top. Brackets must close in the reverse order to how they opened.',
        'The check fails at the end: one `(` is never closed, so the stack is not empty.',
        null,
        'Equal numbers of `(` and `)` are not enough. The second `)` arrives when the stack is empty, so there is nothing for it to match.',
      ],
      keyIdea: 'For bracket questions, keep a stack as you read. Push openers. Each closer must match the top, which you then pop. Fail on a wrong match, an empty stack, or anything left at the end. Equal counts alone prove nothing.',
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
      asking: 'What single number does this postfix expression work out to?',
      solution:
        '**Postfix** writes each operator after the two values it uses. So `2 3 +` means $2 + 3$.\n\n' +
        'Read the tokens (the numbers and operators) from left to right. Push each number. At an operator, pop the top value $b$, pop the next value $a$, work out $a$ op $b$, and push the result.\n\n' +
        'The value popped second goes on the left. This matters for subtraction, because $a - b$ is not the same as $b - a$.\n\n' +
        'Here is every token before the last one, with the stack written bottom to top:\n\n| Token | Action | Stack |\n|---|---|---|\n| `6` | push | 6 |\n| `2` | push | 6, 2 |\n| `3` | push | 6, 2, 3 |\n| `+` | pop 3 then 2, push $2 + 3 = 5$ | 6, 5 |\n| `*` | pop 5 then 6, push $6 \\times 5 = 30$ | 30 |\n| `4` | push | 30, 4 |\n\n' +
        'The last token is `-`. Pop 4, then pop 30. The one popped second goes on the left, so $30 - 4 = 26$.',
      conclusion: 'In ordinary maths this is $6 \\times (2 + 3) - 4$, so the answer is $26$.',
      whyWrong: [
        'This swaps the operands of the subtraction: it does $4 - 30$. The value popped *second* (30) is the left-hand side, so it is $30 - 4$.',
        'This applies the operators in order to the numbers in order ($6 + 2 = 8$, $8 \\times 3 = 24$, $24 - 4 = 20$), ignoring the stack. In postfix an operator acts on the two most recent values on the stack.',
        null,
        'This stops one step early: $30$ is the stack after the multiplication, but the final `4 -` still has to be applied.',
      ],
      keyIdea: 'For postfix, keep a stack table. Push each number. Each operator pops $b$, then $a$, and pushes $a$ op $b$. The one value left at the end is the answer.',
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
      asking: 'What does the queue hold after two items leave and 9 joins?',
      solution:
        'A queue works like a line of people. `enqueue(Q, x)` adds `x` at the rear (the back). `dequeue(Q)` removes the item at the front.\n\n' +
        'The loop on lines 3 to 5 goes through `A` from index 1 to 5, adding each value at the rear. The queue, written front to rear, grows like this:\n\n| `i` | `A[i]` | Queue after |\n|---|---|---|\n| 1 | 3 | 3 |\n| 2 | 1 | 3, 1 |\n| 3 | 4 | 3, 1, 4 |\n| 4 | 1 | 3, 1, 4, 1 |\n| 5 | 5 | 3, 1, 4, 1, 5 |\n\n' +
        'Line 6 removes the front item, 3. Line 7 removes the new front item, 1. That leaves 4, 1, 5.\n\n' +
        'Line 8 adds 9 at the rear. Line 9 prints the queue from front to rear, which gives `[4, 1, 5, 9]`.',
      conclusion: 'Two items left from the front and 9 joined at the rear, so the answer is `[4, 1, 5, 9]`.',
      whyWrong: [
        'This removes from the rear (stack behaviour), taking off 5 and then 1. `dequeue` removes from the front.',
        null,
        'This adds the 9 at the front. `enqueue` always adds at the rear.',
        'This treats `dequeue` as only looking at the front item. It actually removes the item.',
      ],
      keyIdea: 'For queue code, write the queue as a row after every line, with the front on the left. `enqueue` adds on the right and `dequeue` removes from the left.',
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
      asking: 'How does the work grow when you add an item at the very start of each structure?',
      solution:
        '$O(1)$ means the work stays the same however long the list is. $O(n)$ means the work grows in step with the $n$ items.\n\n' +
        '**Linked list.** The head pointer says where the first node is. Make the new node point at the old first node, then make the head point at the new node.\n\n' +
        'That is 2 pointer changes, whether the list has 10 nodes or 10 million. No other node is touched, so the work does not grow.\n\n' +
        '**Array.** Items sit in numbered slots side by side, so the first slot must be freed. Every one of the $n$ items has to shift one slot to the right, which is $n$ moves.',
      conclusion: 'The list always needs 2 pointer changes and the array needs $n$ moves, so the answer is Linked list: $O(1)$; array: $O(n)$.',
      whyWrong: [
        'This mixes up inserting with accessing by position. An array can *read* any index in $O(1)$, but inserting at the front forces every item to shift; the linked list only needs two pointer changes at the head.',
        'This forgets that inserting at the front of an array needs all $n$ items to shift right by one place.',
        'This assumes the linked list must be walked first. The front is the head, which you already have a pointer to, so no walking is needed.',
        null,
      ],
      keyIdea: 'To find a Big-O, count the items touched as the data grows. An array insert shifts everything after the insertion point. A linked list insert changes a few pointers once you are at the position.',
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
      asking: 'Which array slot does the value 60 end up in?',
      solution:
        'A **circular queue** uses a fixed row of slots, here 0 to 4. `rear` is the next free slot. After slot 4 it goes back to slot 0, as if the row were bent into a ring.\n\n' +
        'The wrap-around uses mod, which means the remainder after dividing. Each enqueue sets `rear` to $(\\text{rear} + 1) \\bmod 5$. For example, $5 \\bmod 5 = 0$, because 5 divided by 5 leaves nothing over.\n\n' +
        'Each enqueue stores its value at `rear`, then moves `rear` on:\n\n| Action | Stored at index | `rear` after |\n|---|---|---|\n| enqueue 10 | 0 | 1 |\n| enqueue 20 | 1 | 2 |\n| enqueue 30 | 2 | 3 |\n| enqueue 40 | 3 | 4 |\n\n' +
        'The two dequeues remove 10 and 20 from the front. Items never shift in a circular queue, and dequeuing does not change `rear`, so `rear` stays at 4.\n\n' +
        'Enqueue 50 goes in index 4. Then `rear` becomes $(4 + 1) \\bmod 5 = 0$.\n\n' +
        'Enqueue 60 is stored at `rear`, and `rear` is now 0, so 60 goes in index 0.',
      conclusion: 'The rear wrapped round after index 4, so 60 is stored at index $0$.',
      whyWrong: [
        'This forgets the "mod 5" wrap-around: $4 + 1 = 5$, but index 5 does not exist. The rear wraps back to index 0.',
        null,
        'This assumes the remaining items shift to the start of the array after each dequeue. A circular queue never moves items; only the front and rear indices move.',
        'This gives the value of `rear` *after* storing 60 (the next free slot), not the index where 60 was stored.',
      ],
      keyIdea: 'For circular queues, track `rear` in a table. Store at `rear`, then set `rear` to (rear + 1) mod capacity. Dequeues only move `front`, and items never shift.',
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
      asking: 'How is $(A + B) \\times C - D$ written with each operator after its two values?',
      solution:
        '**Infix** is the ordinary way of writing maths, with each operator between its two values. **Postfix** puts each operator straight after the two things it acts on. So $A + B$ becomes `A B +`.\n\n' +
        'Work in the order the sum would be calculated. Brackets come first, so start with $A + B$, which is `A B +`.\n\n' +
        'Multiplication comes next. It acts on that result and $C$. Write the result, then $C$, then the operator: `A B + C ×`.\n\n' +
        'Subtraction comes last. It acts on that whole result and $D$. Write the result, then $D$, then the operator: `A B + C × D -`.',
      conclusion: 'Each operator follows the two things it acts on, in the order brackets, multiply, subtract, so the answer is `A B + C × D -`.',
      whyWrong: [
        'This ignores the brackets and multiplies first, so it means $A + B \\times C - D$. The brackets say $A + B$ must be worked out first.',
        null,
        'This subtracts before multiplying, so it means $(A + B) \\times (C - D)$. There are no brackets around $C - D$, so the multiplication comes first.',
        'This is **prefix** (Polish) notation, where operators come *before* their operands. Postfix puts each operator after its operands.',
      ],
      keyIdea: 'To convert to postfix, list the operations in calculation order, brackets first. Turn each one into left part, right part, operator. To test it, put small numbers in both forms and compare the results.',
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
      asking: 'Which single line makes the chain skip over node `X`?',
      solution:
        'The list runs `P` → `X` → `Y`, where `Y` is the node after `X`. Each arrow is a `next` pointer stored inside a node.\n\n' +
        'A node is in the list only while the chain leads to it. So to delete `X`, the pointer that leads to `X` must point somewhere else.\n\n' +
        '`P.next` is the pointer that leads to `X`. `P.next.next` means: go to `X`, then read its `next`, which gives `Y`.\n\n' +
        'So store `Y` in `P.next`. The chain becomes `P` → `Y`, and `X` is skipped. That statement is `P.next = P.next.next`.',
      conclusion: 'Only changing the pointer stored in `P` takes `X` out of the chain, so the answer is `P.next = P.next.next`.',
      whyWrong: [
        'This only moves the *variable* `P` to point at `Y`. No node\'s `next` pointer changes, so the list itself is unchanged and `X` is still in it.',
        '`NULL` means "no node", so this cuts the list after `X`: `X` stays linked from `P`, and every node after `X` is lost.',
        null,
        'This changes nothing: `P.next` already is `X`.',
      ],
      keyIdea: 'For linked-list edits, draw the boxes and arrows, then ask which stored pointer must change. A line such as `P = ...` only moves your finger along the list and changes nothing in it.',
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
      asking: 'With the front at index 6 and 5 items, where does the last item sit?',
      solution:
        'A **circular queue** stores items in a row of slots, here 0 to 7. After slot 7 it goes back to slot 0, as if the row were bent into a ring.\n\n' +
        'The items fill neighbouring slots, starting from the front. The front item is already the first of the 5, so the last item is only 4 slots further on.\n\n' +
        'Count the slots, wrapping after 7:\n\n| Item number | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|\n| Index | 6 | 7 | 0 | 1 | 2 |',
      conclusion: 'Counting 4 slots on from index 6, and wrapping after 7, puts the rear item at index $2$.',
      whyWrong: [
        'This forgets to wrap round: index 10 does not exist in an array of capacity 8. Take the answer mod 8.',
        'This is the next **free** slot, $(6 + 5) \\bmod 8$. The last item is one before that, because the front item itself is the first of the 5.',
        null,
        'This assumes the items start at index 0, so the last of 5 items would be at index 4. In a circular queue the items start at the front index, here 6.',
      ],
      keyIdea: 'In a circular queue, the rear index is $(\\text{front} + \\text{count} - 1) \\bmod \\text{capacity}$, where mod means the remainder after dividing. The $-1$ is there because the front item counts as one of the items. Here $(6 + 5 - 1) \\bmod 8 = 10 \\bmod 8 = 2$.',
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
      asking: 'In what order should the two pointers be set so `N` joins after `P` and nothing is lost?',
      solution:
        '`P.next` is the link stored inside `P`, saying which node comes straight after it. Call the node after `P` node `Q`, so the chain is `P` → `Q`. We want `P` → `N` → `Q`.\n\n' +
        'The only record of where `Q` is lives in `P.next`. If we overwrite `P.next` first, we can no longer find `Q`.\n\n' +
        'So save that link first with `N.next = P.next`. Now `N` points to `Q`, and `P` still points to `Q` too.\n\n' +
        'Only then join `P` to the new node with `P.next = N`. The chain is now `P` → `N` → `Q`.',
      conclusion: 'The new node must take the old link before `P` gives it up, so the answer is `N.next = P.next`, then `P.next = N`.',
      whyWrong: [
        'The order is wrong. After `P.next = N`, the value of `P.next` is `N` itself, so `N.next = P.next` makes `N` point to itself (a loop), and `Q` onwards is lost.',
        null,
        '`NULL` means "no node", so this links `P` to `N` but then ends the list at `N`. Every node that used to come after `P` is lost.',
        'This makes `N` point back to `P`, creating a loop `P → N → P`, and the rest of the list after `P` is lost.',
      ],
      keyIdea: 'When inserting into a linked list, draw the arrows and set the new node\'s pointer first. Test a wrong order by tracing it: does a node become unreachable, or point to itself?',
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
      asking: 'Which three letters come off the stack after every letter of STACK has been pushed?',
      solution:
        '`length(word)` is the number of letters, which is 5. `word[i]` is the letter at position `i`, counting from 1.\n\n' +
        'The first loop (lines 3 to 5) pushes each letter in turn. S goes in first and K goes in last:\n\n| `i` | `word[i]` | Stack (bottom to top) |\n|---|---|---|\n| 1 | S | S |\n| 2 | T | S T |\n| 3 | A | S T A |\n| 4 | C | S T A C |\n| 5 | K | S T A C K |\n\n' +
        'Line 6 sets `out` to empty text. In line 8, `+` joins text together, so each pass removes the top letter and adds it to the end of `out`.\n\n' +
        'The second loop (lines 7 to 9) runs 3 times. Line 10 then prints `out`:\n\n| `i` | `pop(S)` | Stack left | `out` after |\n|---|---|---|---|\n| 1 | K | S T A C | K |\n| 2 | C | S T A | KC |\n| 3 | A | S T | KCA |',
      conclusion: 'Pops give the newest letters first, K then C then A, so the answer is `KCA`.',
      whyWrong: [
        null,
        'This takes letters from the front (queue behaviour). `pop` takes from the top, which is the end of the word.',
        'This takes the right three letters but keeps them in their original order. Popping reverses the order.',
        'This treats `pop` as only reading the top item, so K is read three times. `pop` removes the item.',
      ],
      keyIdea: 'Pushing a word letter by letter and then popping gives the letters in reverse. So the first $k$ pops are the last $k$ letters, backwards.',
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
      asking: 'What total does `t` reach by the time the stack is down to one item?',
      solution:
        'After lines 1 to 4 the stack holds 2, 5, 9 from bottom to top, so 9 is on top. Line 5 sets `t` to 0.\n\n' +
        '`length(S)` is the number of items on the stack. Line 6 keeps the loop going only while there is more than one item.\n\n' +
        'Line 7 pops the top item and adds it to `t`. Popping also removes the item, so the stack gets one shorter each pass.\n\n' +
        'Here is every test of line 6. When the test is false the loop ends, and line 9 prints `t`:\n\n| `length(S)` | `length(S) > 1` | `pop(S)` | `t` after | Stack after |\n|---|---|---|---|---|\n| 3 | true | 9 | 9 | 2, 5 |\n| 2 | true | 5 | 14 | 2 |\n| 1 | false | (loop ends) | 14 | 2 |',
      conclusion: 'The loop stops with 2 still on the stack, and $t = 9 + 5$, so the answer is 14.',
      whyWrong: [
        null,
        'This adds all three values. The test is `length(S) > 1`, so the loop stops with the 2 still on the stack.',
        'This adds 2 and 5, the two oldest values (queue thinking). `pop` takes the newest values first.',
        'Each pass pops one item, so `length(S)` falls by 1 and the test eventually fails.',
      ],
      keyIdea: 'For a `while` loop that pops, make a table of size, test, value popped and running total. Do the test before each pass, because it decides whether the last item gets popped.',
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
      asking: 'Does the loop ever finish, and if so what is `x`?',
      solution:
        'Lines 1 to 3 build a stack holding 3, 8 from bottom to top. `length(S)` is the number of items, so it starts at 2.\n\n' +
        'Line 4 keeps the loop going while `length(S) > 0`, so the loop can only stop when the stack is empty.\n\n' +
        'Look at what one pass does to the stack:\n\n| Pass | Stack at the start | After `x = pop(S)` | After `push(S, x)` |\n|---|---|---|---|\n| 1 | 3, 8 | 3 | 3, 8 |\n| 2 | 3, 8 | 3 | 3, 8 |\n\n' +
        'Line 5 removes 8, and line 6 puts the same 8 straight back. So at every test the length is 2, and $2 > 0$ is true. The stack can never empty, so the loop never ends and line 8 is never reached.',
      conclusion: 'The stack never gets shorter, so the condition can never become false and the answer is Infinite loop.',
      whyWrong: [
        '8 is what the first pop returns, but it goes straight back on the stack, so the loop carries on and the `print` is never reached.',
        'This assumes the pops empty the stack, leaving 3 as the last value popped. Each popped value is pushed back, so the stack never shrinks.',
        'This is `length(S)`, which never changes. The code prints `x`, and the `print` is never reached.',
        null,
      ],
      keyIdea: 'To test for a never-ending loop, find what the condition depends on and see what one pass does to it. If a pass leaves it unchanged, the loop never stops.',
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
      asking: 'After the front item moves to the back twice, which value is at the front?',
      solution:
        'A queue works like a line of people. `dequeue(Q)` removes the front item, and `enqueue(Q, x)` adds `x` at the rear (the back).\n\n' +
        'After lines 1 to 4 the queue is 1, 2, 3 from front to rear, so 1 is at the front.\n\n' +
        '`for i = 1 to 2` runs exactly twice. Each pass takes the front item and puts it on the back:\n\n| `i` | `x = dequeue(Q)` | Queue after `enqueue(Q, x)` |\n|---|---|---|\n| 1 | 1 | 2, 3, 1 |\n| 2 | 2 | 3, 1, 2 |\n\n' +
        'Line 9 removes the item now at the front, which is 3, and prints it.',
      conclusion: 'Moving two items to the rear leaves 3 at the front, so the answer is 3.',
      whyWrong: [
        null,
        'This assumes moving an item leaves the order unchanged. Each moved item goes to the **rear**, so the front changes.',
        'This does only one pass. `for i = 1 to 2` includes 2, so the loop runs twice.',
        'A `for` loop runs a fixed number of times, here 2, even though the queue never gets shorter.',
      ],
      keyIdea: 'Moving the front item to the rear $k$ times rotates the queue by $k$ places. Write the queue after each pass, then read off the front.',
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
