import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'stacks-queues',
  know:
    '### Why data structures?\n\n' +
    'A **data structure** is a way of organising data so that the operations you need are quick. Stacks, queues and linked lists are the three simplest ones, and exam questions on them are mostly about **tracing**: following a list of operations carefully and writing down what is stored after each one.\n\n' +
    '### Stacks: last in, first out (LIFO)\n\n' +
    'Think of a pile of plates. You can only add a plate on **top** and only take the plate on **top**.\n\n' +
    '- **push(x)**: put x on top.\n' +
    '- **pop()**: remove the top item and return it.\n' +
    '- **peek()** (or top): look at the top item *without* removing it.\n\n' +
    'The item that went in **last** comes out **first**. In Python a list is a ready-made stack: `s.append(x)` pushes and `s.pop()` pops from the end. Real uses: the Back button, Undo, checking brackets, evaluating postfix expressions, and the "call stack" that keeps track of function calls.\n\n' +
    '### Queues: first in, first out (FIFO)\n\n' +
    'Think of a line at a coffee shop. People join at the **rear** and are served from the **front**.\n\n' +
    '- **enqueue(x)**: add x at the rear.\n' +
    '- **dequeue()**: remove the front item and return it.\n\n' +
    'The item that has waited **longest** leaves first. In Python use `collections.deque`: `q.append(x)` joins at the rear and `q.popleft()` leaves from the front. Real uses: printer jobs, requests to a server, breadth-first search.\n\n' +
    '| | Stack | Queue |\n' +
    '|---|---|---|\n' +
    '| Rule | LIFO | FIFO |\n' +
    '| Add | push (top) | enqueue (rear) |\n' +
    '| Remove | pop (top) | dequeue (front) |\n' +
    '| Python | list: `append`, `pop()` | deque: `append`, `popleft()` |\n\n' +
    '**How to trace:** draw a small table with one row per operation and write the whole structure after each step, always in the same direction (bottom to top for a stack, front to rear for a queue).\n\n' +
    '### Using a stack: reversing and brackets\n\n' +
    '**Reversing.** Push every item, then pop them all: they come out in reverse order. Pushing the letters of `CAT` and popping gives `TAC`.\n\n' +
    '**Bracket matching.** Scan left to right. Push every opening bracket. For every closing bracket, pop the top and check it is the matching opener. The string is balanced only if there is never a mismatch, never a pop from an empty stack, and the stack is **empty at the end**. Equal numbers of opening and closing brackets is *not* enough: `([)]` fails.\n\n' +
    '### Postfix (Reverse Polish) notation\n\n' +
    'In **postfix**, the operator comes *after* its two operands: $3 + 4$ is written `3 4 +`, and $(2 + 3) \\times 4$ is `2 3 + 4 *`. No brackets are ever needed. To evaluate with a stack:\n\n' +
    '1. Read tokens left to right.\n' +
    '2. A number: push it.\n' +
    '3. An operator: pop $b$ (the top), then pop $a$, and push $a \\text{ op } b$.\n' +
    '4. At the end the single value left is the answer.\n\n' +
    'The order matters for $-$ and $\\div$: the value popped **second** is the left-hand side. **Prefix** notation is the opposite style, with the operator first: `+ 3 4`.\n\n' +
    '### Linked lists: nodes and pointers\n\n' +
    'A **linked list** is a chain of **nodes**. In a *singly* linked list each node stores a **value** and a pointer `next` to the following node; the last node\'s `next` is `NULL` (`None` in Python). The list only keeps a pointer to the first node, the **head**. (A *doubly* linked list also stores a pointer to the previous node.)\n\n' +
    '- To reach node $k$ you start at the head and follow $k - 1$ pointers, so access by position costs $O(n)$. Searching for a value is also $O(n)$ in the worst case (you might check every node).\n' +
    '- To **insert** a new node `N` after node `P`: first `N.next ← P.next`, then `P.next ← N`. Doing it the other way round loses the rest of the list.\n' +
    '- To **delete** the node after `P`: `P.next ← P.next.next`.\n\n' +
    'Insertion and deletion are $O(1)$ at the head, or once you already have a pointer to the node **just before** the position (in a singly linked list you cannot step backwards), because only pointers change. Walking to that position first still costs $O(n)$. In an **array** the opposite is true: reading index $k$ is $O(1)$, but inserting or deleting near the front is $O(n)$ because the later items have to shift.\n\n' +
    '### Circular queues\n\n' +
    'A queue stored in a fixed-size array of capacity $N$ would "run off the end" if the front and rear only ever moved forwards. A **circular queue** wraps round: after index $N - 1$ comes index 0, so slots freed by dequeues are reused. Items never move; only the `front` and `rear` indices move, using **mod**:\n\n' +
    '$$\\text{next index} = (i + 1) \\bmod N$$\n\n' +
    'If the front item is at index $f$ and the queue holds $k$ items, the last item is at $(f + k - 1) \\bmod N$. For example, with $N = 8$, $f = 6$, $k = 5$ the items are at 6, 7, 0, 1, 2.',
  formulas: [
    { label: 'Stack (LIFO)', tex: '\\text{push}(x) \\text{ adds on top}, \\quad \\text{pop}() \\text{ removes the top}', note: 'Python list: `append` and `pop()`.' },
    { label: 'Queue (FIFO)', tex: '\\text{enqueue}(x) \\text{ adds at the rear}, \\quad \\text{dequeue}() \\text{ removes the front}', note: 'Python: `collections.deque` with `append` and `popleft()`.' },
    { label: 'Postfix operator step', tex: 'b = \\text{pop}(),\\; a = \\text{pop}(),\\; \\text{push}(a \\text{ op } b)', note: 'The value popped second is the left-hand operand.' },
    { label: 'Circular queue: next index', tex: '\\text{next} = (i + 1) \\bmod N', note: '$N$ is the capacity of the array.' },
    { label: 'Circular queue: rear item', tex: '\\text{rear} = (\\text{front} + \\text{size} - 1) \\bmod N' },
    { label: 'Linked list: reach node k from the head', tex: 'k - 1 \\text{ pointer moves}', note: 'Access and search are $O(n)$.' },
    { label: 'Linked list insert after P', tex: 'N.\\text{next} \\leftarrow P.\\text{next}, \\text{ then } P.\\text{next} \\leftarrow N', note: '$O(1)$ once you have $P$. Order matters.' },
    { label: 'Linked list delete after P', tex: 'P.\\text{next} \\leftarrow P.\\text{next}.\\text{next}', note: '$O(1)$ once you have $P$.' },
    { label: 'Insert at the front: costs', tex: '\\text{linked list } O(1), \\quad \\text{array } O(n)', note: 'Reading index $k$: array $O(1)$, linked list $O(n)$.' },
  ],
  examples: [
    {
      title: 'Tracing a stack',
      problem: 'Starting with an empty stack: `push(4)`, `push(9)`, `pop()`, `push(1)`, `push(7)`, `pop()`. What is on top now?',
      steps: [
        '`push(4)`: stack (bottom to top) is 4.',
        '`push(9)`: 4, 9.',
        '`pop()` removes the top, 9: stack is 4.',
        '`push(1)`: 4, 1. Then `push(7)`: 4, 1, 7.',
        '`pop()` removes 7: stack is 4, 1. The top is the right-hand end.',
      ],
      answer: '$1$ is on top.',
    },
    {
      title: 'Same operations, but a queue',
      problem: 'Starting with an empty queue: `enqueue(4)`, `enqueue(9)`, `dequeue()`, `enqueue(1)`, `enqueue(7)`, `dequeue()`. What is at the front now?',
      steps: [
        '`enqueue(4)`, `enqueue(9)`: queue (front to rear) is 4, 9.',
        '`dequeue()` removes the front, 4: queue is 9.',
        '`enqueue(1)`, `enqueue(7)`: 9, 1, 7.',
        '`dequeue()` removes the front, 9: queue is 1, 7.',
      ],
      answer: '$1$ is at the front (and 7 is at the rear).',
    },
    {
      title: 'Evaluating postfix',
      problem: 'Evaluate `8 3 1 - 2 * -` using a stack.',
      steps: [
        'Push 8, push 3, push 1: stack is 8, 3, 1.',
        '`-`: pop $b = 1$, pop $a = 3$, push $3 - 1 = 2$. Stack: 8, 2.',
        'Push 2: stack is 8, 2, 2.',
        '`*`: pop $b = 2$, pop $a = 2$, push $2 \\times 2 = 4$. Stack: 8, 4.',
        '`-`: pop $b = 4$, pop $a = 8$, push $8 - 4 = 4$. Stack: 4.',
        'Check: in ordinary notation this is $8 - (3 - 1) \\times 2 = 8 - 4 = 4$.',
      ],
      answer: '$4$',
    },
    {
      title: 'Circular queue (exam level)',
      problem: 'A circular queue has capacity 6 (indices 0 to 5). The front item is at index 4 and there are 3 items. Two items are dequeued and then 4 items are enqueued. At which index is the front now, and at which index is the last item enqueued?',
      steps: [
        'Before: the items are at 4, 5, 0 (wrapping after 5). So the rear item is at $(4 + 3 - 1) \\bmod 6 = 0$.',
        'Two dequeues move the front forward twice: $(4 + 2) \\bmod 6 = 0$. One item is left, at index 0.',
        'Each enqueue goes one slot after the current rear: indices 1, 2, 3, 4.',
        'Check with the formula: the queue now holds $1 + 4 = 5$ items starting at front 0, so the rear is at $(0 + 5 - 1) \\bmod 6 = 4$.',
      ],
      answer: 'Front at index $0$, last item at index $4$.',
    },
  ],
  traps: [
    'Mixing up LIFO and FIFO. Say it out loud while tracing: a stack gives back the **newest** item, a queue gives back the **oldest**.',
    'Treating `pop()` like `peek()`. A pop **removes** the item; the next pop returns the item underneath. (In Python, `s.pop()` removes the last item; `s.pop(0)` removes the first.)',
    'Swapping the operands in postfix. For `a b -` the answer is $a - b$: the value popped **first** is the right-hand side.',
    'Thinking equal numbers of opening and closing brackets means "balanced". Order matters: `([)]` and `())(` both fail the stack check.',
    'Forgetting the wrap-around (mod) in a circular queue, or thinking the items shift down to index 0 after a dequeue. In a circular queue only the indices move.',
    'Changing linked-list pointers in the wrong order. When inserting after `P`, set `N.next ← P.next` **before** `P.next ← N`, or the rest of the list is lost.',
  ],
  examTip:
    'These questions are about careful tracing, so spend your 67 seconds on a quick table rather than in your head: one line per operation, writing the whole stack or queue each time. Then eliminate:\n\n' +
    '- Options that are the "other" structure\'s answer (the FIFO answer to a stack question, or vice versa) are the most common distractor; check which end you are removing from.\n' +
    '- Options that are a value already removed earlier cannot be on top/at the front.\n' +
    '- For postfix, check your answer by rewriting it in ordinary notation with brackets, and watch the order of subtraction.\n' +
    '- For circular queues, any index $\\ge N$ is impossible (forgot mod); the next free slot is one after the rear, $(\\text{rear} + 1) \\bmod N$, and is a trap when the question asks where the last item *is*.\n' +
    '- For cost questions remember the pair: linked list = cheap insert/delete at the head or just after a node you already have, slow access by position; array = instant access by index, slow insert/delete near the front.',
};
