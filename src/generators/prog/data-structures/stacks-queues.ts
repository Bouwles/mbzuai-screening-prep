import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps, table } from '../../../lib/explanation';
import { m, num } from '../../../lib/tex';

type Cand = { v: number; why: string };

/** Up to 3 candidates that differ from the answer and from each other. */
function pickDistinct(answer: number, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(c.v) || c.v === answer) continue;
    if (out.some((x) => x.v === c.v || num(x.v) === num(c.v))) continue;
    out.push(c);
  }
  return out;
}

/** Re-roll (deterministically, with the same rng) until there are 3 genuine distractors. */
function build(rng: Rng, attempt: (rng: Rng) => GeneratedCore | null): GeneratedCore {
  for (let i = 0; i < 200; i++) {
    const core = attempt(rng);
    if (core) return core;
  }
  throw new Error('could not build a variant');
}

// ================================================================ 1. trace stack / queue operations
type Op = { kind: 'add'; v: number } | { kind: 'remove' };

const addCall = (lifo: boolean, v: number) => (lifo ? `push(S, ${v})` : `enqueue(Q, ${v})`);
const removeCall = (lifo: boolean) => (lifo ? 'pop(S)' : 'dequeue(Q)');

/** The operations as dialect lines; with printLast the final removal is printed. */
function opLines(ops: Op[], lifo: boolean, printLast: boolean): string[] {
  return ops.map((op, i) => {
    if (op.kind === 'add') return addCall(lifo, op.v);
    return printLast && i === ops.length - 1 ? `print(${removeCall(lifo)})` : removeCall(lifo);
  });
}

/** The items as text, in the order they are written. */
const listed = (xs: number[]) => (xs.length ? xs.join(', ') : '(empty)');

function simulate(ops: Op[], lifo: boolean, lines: string[] = opLines(ops, lifo, false)): { items: number[]; removed: number[]; rows: string[][] } {
  const items: number[] = [];
  const removed: number[] = [];
  const rows: string[][] = [];
  ops.forEach((op, i) => {
    let out = '';
    if (op.kind === 'add') items.push(op.v);
    else {
      const x = (lifo ? items.pop() : items.shift()) as number;
      removed.push(x);
      out = String(x);
    }
    rows.push([`\`${lines[i]}\``, listed(items), out]);
  });
  return { items, removed, rows };
}

function traceAttempt(rng: Rng): GeneratedCore | null {
  const lifo = rng.bool();
  const nAdd = rng.int(4, 6);
  const nRemove = rng.int(2, nAdd - 2);
  const values = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 17, 18, 19, 21, 23, 25], nAdd);
  // random valid order of adds/removes (never remove from an empty structure)
  const ops: Op[] = [];
  let adds = 0;
  let removes = 0;
  let size = 0;
  while (adds < nAdd || removes < nRemove) {
    const canAdd = adds < nAdd;
    const canRemove = removes < nRemove && size > 0;
    if (canAdd && (!canRemove || rng.bool(0.6))) {
      ops.push({ kind: 'add', v: values[adds++] });
      size++;
    } else {
      ops.push({ kind: 'remove' });
      removes++;
      size--;
    }
  }
  if (ops[ops.length - 1].kind !== 'remove') return null; // end on a removal so the question is about tracing
  const ask = rng.pick(['next', 'last'] as const); // what is at the top/front now, or what did the last removal return

  const lines = opLines(ops, lifo, ask === 'last');
  const real = simulate(ops, lifo, lines);
  const other = simulate(ops, !lifo);
  const top = (r: { items: number[] }, isLifo: boolean) => (isLifo ? r.items[r.items.length - 1] : r.items[0]);
  const bottom = (r: { items: number[] }, isLifo: boolean) => (isLifo ? r.items[0] : r.items[r.items.length - 1]);
  const lastAdded = values[nAdd - 1];
  const S = lifo ? 'stack' : 'queue';
  const end = lifo ? 'top' : 'front';
  const otherEnd = lifo ? 'bottom' : 'rear';
  const removeWord = `\`${removeCall(lifo)}\``;

  let answer: number;
  let question: string;
  let pool: Cand[];
  if (ask === 'next') {
    answer = top(real, lifo);
    question = `Which value is now at the **${end}** of the ${S}?`;
    pool = [
      {
        v: top(other, !lifo),
        why: lifo
          ? 'This is queue thinking: removing the *oldest* item each time (first in, first out) and then giving the item that would leave next. A stack removes the newest item (last in, first out).'
          : 'This is stack thinking: removing the *newest* item each time (last in, first out) and then giving the item that would leave next. A queue removes the oldest item (first in, first out).',
      },
      { v: bottom(real, lifo), why: `This value is at the ${otherEnd} of the ${S}, not the ${end}. It mixes up the two ends.` },
      {
        v: lastAdded,
        why: lifo
          ? `This is the last value pushed, but it has since been removed by a later ${removeWord}. Each removal really takes the item out.`
          : `This is the last value enqueued; it joins at the rear, so it is the last to leave, not the next.`,
      },
      { v: real.removed[real.removed.length - 1], why: `This is the value removed by the final ${removeWord}. It has already left the ${S}, so it cannot be at the ${end}.` },
    ];
  } else {
    answer = real.removed[real.removed.length - 1];
    question = 'What is printed?';
    pool = [
      {
        v: other.removed[other.removed.length - 1],
        why: lifo
          ? 'This is queue thinking: each removal taking the *oldest* item (first in, first out). A stack pops the newest item still on it.'
          : 'This is stack thinking: each removal taking the *newest* item (last in, first out). A queue dequeues the oldest item still in it.',
      },
      { v: top(real, lifo), why: `This is the value at the ${end} *after* the last removal, i.e. the one that would be removed next, not the one just removed.` },
      {
        v: lastAdded,
        why: lifo
          ? 'This assumes a pop always returns the most recently pushed value overall, forgetting that it may already have been popped earlier.'
          : 'This is the most recently enqueued value. A queue returns the oldest waiting item, not the newest.',
      },
      { v: bottom(real, lifo), why: `This value is still in the ${S} (at the ${otherEnd}); it has not been removed.` },
    ];
  }
  const ds = pickDistinct(answer, pool);
  if (ds.length < 3) return null;

  const ans = String(answer);
  const lastLine = lines[lines.length - 1];
  const lastOut = real.removed[real.removed.length - 1];
  // The structure just before the final removal: the removed value goes back where it came from.
  const before = lifo ? [...real.items, lastOut] : [lastOut, ...real.items];
  const fromWhere = lifo ? 'off the top' : 'from the front';
  const solution = steps(
    lifo
      ? 'A **stack** works like a pile of plates. `push(S, x)` puts `x` on top. `pop(S)` takes the top item off and gives it back.'
      : 'A **queue** works like a line of people. `enqueue(Q, x)` adds `x` at the rear (the back). `dequeue(Q)` removes the item at the front and gives it back.',
    lifo
      ? 'So the newest item always leaves first. This rule is called last in, first out.'
      : 'So the oldest item always leaves first. This rule is called first in, first out.',
    `Line 1 starts with an empty ${S}. Follow each line after it, writing the whole ${S} every time. We write it ${
      lifo ? 'from bottom to top, so the rightmost value is the top' : 'from front to rear, so the leftmost value is the front'
    }:`,
    table(['Line of code', lifo ? 'Stack (bottom to top)' : 'Queue (front to rear)', 'Removed'], real.rows.slice(0, -1)),
    ask === 'next'
      ? `The last line is \`${lastLine}\`. The ${S} holds ${listed(before)}, so ${lastOut} comes ${fromWhere}. That leaves ${listed(real.items)}, and the value at the ${end} is now ${ans}.`
      : `The last line is \`${lastLine}\`. The ${S} holds ${listed(before)}, so ${lastOut} comes ${fromWhere}, and \`print\` shows it.`,
  );
  return {
    stem: ask === 'next' ? question : `This code uses a **${S}**. ${question}`,
    code: { lang: 'pseudocode', source: [lifo ? 'S = []' : 'Q = []', ...lines].join('\n') },
    answer: ans,
    answerValue: answer,
    distractors: ds.map((d) => ({ text: String(d.v), value: d.v, why: d.why })),
    asking: ask === 'next' ? `Once every line has run, which value is at the ${end} of the ${S}?` : `Which value does the last ${removeWord} take out?`,
    solution,
    conclusion:
      ask === 'next'
        ? `After the last removal the ${S} holds ${listed(real.items)}, so the value at the ${end} is ${ans}.`
        : `The final ${removeWord} takes ${ans} ${fromWhere}, and \`print\` shows it, so the answer is ${ans}.`,
    keyIdea: lifo
      ? 'For stack code, write the stack as a row after every line, with the bottom on the left. `push` adds on the right and `pop` removes from the right.'
      : 'For queue code, write the queue as a row after every line, with the front on the left. `enqueue` adds on the right and `dequeue` removes from the left.',
  };
}

// ================================================================ 2. evaluate a postfix expression
type Tok = number | '+' | '-' | '*';
const OPS = ['+', '-', '*'] as const;
const opTex = (o: string) => (o === '*' ? '\\times' : o);
const apply = (a: number, o: string, b: number) => (o === '+' ? a + b : o === '-' ? a - b : a * b);

/** The sum an operator works out, as maths: the value popped second goes on the left. */
const sumTex = (a: number, o: string, b: number, r: number) => m(`${num(a)} ${opTex(o)} ${b < 0 ? `(${num(b)})` : num(b)} = ${num(r)}`);

function evalStack(tokens: Tok[], swap: boolean): { value: number; rows: string[][]; beforeLast: number; lastA: number; hasZero: boolean } {
  const s: number[] = [];
  let hasZero = false;
  const rows: string[][] = [];
  let beforeLast = NaN;
  let lastA = NaN;
  tokens.forEach((t, i) => {
    if (typeof t === 'number') {
      s.push(t);
      rows.push([`\`${t}\``, 'push', s.join(', ')]);
    } else {
      const b = s.pop() as number;
      const a = s.pop() as number;
      if (i === tokens.length - 1) {
        beforeLast = b;
        lastA = a;
      }
      const r = swap ? apply(b, t, a) : apply(a, t, b);
      if (r === 0) hasZero = true;
      s.push(r);
      rows.push([`\`${t}\``, `pop ${b} then ${a}, push ${sumTex(a, t, b, r)}`, s.join(', ')]);
    }
  });
  return { value: s[0], rows, beforeLast, lastA, hasZero };
}

function evalLeftToRight(tokens: Tok[]): number {
  const nums = tokens.filter((t): t is number => typeof t === 'number');
  const ops = tokens.filter((t): t is '+' | '-' | '*' => typeof t !== 'number');
  let v = nums[0];
  for (let i = 0; i < ops.length; i++) v = apply(v, ops[i], nums[i + 1]);
  return v;
}

function evalQueue(tokens: Tok[]): number {
  const q: number[] = [];
  for (const t of tokens) {
    if (typeof t === 'number') q.push(t);
    else {
      const a = q.shift() as number;
      const b = q.shift() as number;
      q.push(apply(a, t, b));
    }
  }
  return q[0];
}

function postfixAttempt(rng: Rng): GeneratedCore | null {
  const n = () => rng.int(2, 9);
  const o = () => rng.pick(OPS);
  const shape = rng.int(0, 3);
  let tokens: Tok[];
  let infix: string;
  if (shape === 0) {
    // a b c op1 op2  =  a op2 (b op1 c)
    const [a, b, c, o1, o2] = [n(), n(), n(), o(), o()];
    tokens = [a, b, c, o1, o2];
    infix = `${a} ${opTex(o2)} (${b} ${opTex(o1)} ${c})`;
  } else if (shape === 1) {
    // a b op1 c op2  =  (a op1 b) op2 c
    const [a, b, c, o1, o2] = [n(), n(), n(), o(), o()];
    tokens = [a, b, o1, c, o2];
    infix = `(${a} ${opTex(o1)} ${b}) ${opTex(o2)} ${c}`;
  } else if (shape === 2) {
    // a b op1 c d op2 op3  =  (a op1 b) op3 (c op2 d)
    const [a, b, c, d, o1, o2, o3] = [n(), n(), n(), n(), o(), o(), o()];
    tokens = [a, b, o1, c, d, o2, o3];
    infix = `(${a} ${opTex(o1)} ${b}) ${opTex(o3)} (${c} ${opTex(o2)} ${d})`;
  } else {
    // a b c op1 d op2 op3  =  a op3 ((b op1 c) op2 d)
    const [a, b, c, d, o1, o2, o3] = [n(), n(), n(), n(), o(), o(), o()];
    tokens = [a, b, c, o1, d, o2, o3];
    infix = `${a} ${opTex(o3)} ((${b} ${opTex(o1)} ${c}) ${opTex(o2)} ${d})`;
  }
  if (!tokens.includes('-')) return null; // keep operand order meaningful
  const real = evalStack(tokens, false);
  const answer = real.value;
  if (Math.abs(answer) > 99 || real.hasZero) return null;
  const pool: Cand[] = [
    {
      v: evalStack(tokens, true).value,
      why: 'This swaps the operands: it works out (first value popped) op (second value popped). The value popped *second* is the left-hand operand, which matters for subtraction.',
    },
    {
      v: evalLeftToRight(tokens),
      why: 'This applies the operators, in the order they appear, to the numbers in the order they appear (left to right), ignoring the stack. In postfix each operator acts on the two most recent values on the stack.',
    },
    {
      v: evalQueue(tokens),
      why: 'This combines the two *oldest* values each time (queue style) instead of the two values on top of the stack.',
    },
    {
      v: real.beforeLast,
      why: 'This stops before the final operator and reports the value that was on top of the stack, instead of applying the last operation.',
    },
  ];
  const ds = pickDistinct(answer, pool);
  if (ds.length < 3) return null;
  const expr = tokens.map(String).join(' ');
  const ans = m(num(answer));
  const lastOp = tokens[tokens.length - 1] as string;
  const solution = steps(
    '**Postfix** (also called Reverse Polish) writes each operator after the two values it uses. So `3 4 +` means $3 + 4$.',
    'A stack is a pile where you can only add to the top (**push**) or remove from the top (**pop**). Read the tokens (the numbers and operators) from left to right, and push each number onto the top.',
    'Each operator pops the top value, called $b$, then pops the next value, called $a$. It works out $a$ op $b$, where op is that operator, and pushes the result.',
    'The value popped second goes on the left. This matters for subtraction, because $a - b$ is not the same as $b - a$.',
    'Here is every token before the last one, with the stack written bottom to top, so the rightmost value is the top:',
    table(['Token', 'Action', 'Stack'], real.rows.slice(0, -1)),
    `The last token is \`${lastOp}\`. Pop ${real.beforeLast}, then pop ${real.lastA}. The one popped second goes on the left, so ${sumTex(real.lastA, lastOp, real.beforeLast, answer)}. That is the only value left on the stack.`,
  );
  return {
    stem: `Evaluate the postfix (Reverse Polish) expression below using a stack. (\`*\` means multiply.)\n\n\`${expr}\``,
    answer: ans,
    answerValue: answer,
    distractors: ds.map((d) => ({ text: m(num(d.v)), value: d.v, why: d.why })),
    asking: 'What single number does this postfix expression work out to?',
    solution,
    conclusion: `In ordinary maths this is ${m(`${infix} = ${num(answer)}`)}, so the answer is ${ans}.`,
    keyIdea: 'For postfix, keep a stack table. Push each number. Each operator pops $b$, then $a$, and pushes $a$ op $b$. The one value left at the end is the answer.',
  };
}

// ================================================================ 3. circular queue index arithmetic
function circularAttempt(rng: Rng): GeneratedCore | null {
  const N = rng.pick([5, 6, 7, 8, 10, 12]);
  const f = rng.int(0, N - 1);
  const k = rng.int(2, N - 1);
  const d = rng.int(1, k - 1);
  // Keep at least one slot free at the end, so "the next free slot" (a distractor) really is free
  // and never the front item of a full queue. k - d <= N - 2, so this range is never empty.
  const e = rng.int(1, N - (k - d) - 1);
  const ask = rng.pick(['rear', 'front'] as const);
  const mod = (x: number) => ((x % N) + N) % N;
  const setup =
    `A circular queue of capacity ${N} (indices 0 to ${N - 1}) has its front item at index ${f} and holds ${k} items. ` +
    `After ${d} dequeue${d === 1 ? '' : 's'} and ${e} enqueue${e === 1 ? '' : 's'},`;
  let answer: number;
  let pool: Cand[];
  let working: string[];
  let asking: string;
  let conclusion: string;
  let stem: string;
  const plural = (x: number, word: string) => `${x} ${word}${x === 1 ? '' : 's'}`;
  /** Index by index, moving forward and wrapping after the last slot. */
  const walk = (from: number, moves: number) => m(Array.from({ length: moves + 1 }, (_, i) => mod(from + i)).join(' \\to '));
  if (ask === 'rear') {
    const raw = f + k + e - 1;
    answer = mod(raw);
    stem = `${setup} at which index is the **last item enqueued**?`;
    pool = [
      { v: raw, why: `This forgets to wrap round with mod ${N}: index ${raw} does not exist in an array of capacity ${N}.` },
      { v: mod(raw + 1), why: 'This is the next **free** slot (one past the last item), not the slot holding the last item.' },
      { v: mod(f + k - d + e - 1), why: 'This lets the dequeues pull the rear back. Dequeuing only moves the front; new items still go after the old rear.' },
      { v: k - d + e - 1, why: 'This assumes the items shift down to start at index 0 after dequeuing. In a circular queue items never move; only the indices change.' },
    ];
    const rearNow = mod(f + k - 1);
    const rawNow = f + k - 1;
    asking = 'In which slot does the last new item land?';
    working = [
      `Items never move in a circular queue. A dequeue only moves the front marker forward, so the ${d === 1 ? 'dequeue does' : `${d} dequeues do`} not change where new items go.`,
      `Find the current last item. The ${k} items fill neighbouring slots starting at index ${f}. The front item is the first of them, so the last is ${plural(k - 1, 'slot')} further on: ${m(`(${f} + ${k} - 1) \\bmod ${N} = ${rawNow === rearNow ? '' : `${rawNow} \\bmod ${N} = `}${rearNow}`)}.`,
      `Each enqueue uses the next slot along, wrapping after slot ${N - 1}. Count on ${plural(e, 'slot')} from index ${rearNow}: ${walk(rearNow, e)}.`,
    ];
    conclusion = `As one sum this is ${m(`(${f} + ${k} + ${e} - 1) \\bmod ${N} = ${raw} \\bmod ${N} = ${answer}`)}, so the last item enqueued is at index ${m(num(answer))}.`;
  } else {
    const raw = f + d;
    answer = mod(raw);
    stem = `${setup} at which index is the **front** item?`;
    pool = [
      { v: raw, why: `This forgets to wrap round with mod ${N}: index ${raw} does not exist in an array of capacity ${N}.` },
      { v: mod(raw - 1), why: 'This is the index of the last item that was **dequeued**, not the new front (an off-by-one error).' },
      { v: f, why: 'This assumes the front stays put and the items shift along. In a circular queue the items stay in place and the front index moves on.' },
      { v: mod(f - d), why: 'This moves the front the wrong way. Each dequeue moves the front forwards (towards higher indices, wrapping round).' },
      { v: mod(f + d + e), why: 'This lets the enqueues move the front too. Enqueuing only moves the rear.' },
    ];
    asking = 'Which slot holds the front item once the dequeues and enqueues are done?';
    working = [
      `Items never move in a circular queue. Each dequeue removes the front item and moves the front marker one slot forward.`,
      `An enqueue only adds at the rear, so the ${e === 1 ? 'enqueue does' : `${e} enqueues do`} not change the front.`,
      `The front starts at index ${f}. Move it forward ${plural(d, 'slot')}, wrapping after slot ${N - 1}: ${walk(f, d)}.`,
    ];
    conclusion = `As one sum this is ${m(`(${f} + ${d}) \\bmod ${N} = ${raw >= N ? `${raw} \\bmod ${N} = ` : ''}${answer}`)}, so the front item is at index ${m(num(answer))}.`;
  }
  if (ask === 'rear' && f + k + e - 1 < N) return null; // make sure wrap-around is involved
  if (ask === 'front' && f + d < N && rng.bool(0.7)) return null; // mostly wrap-around cases
  const ds = pickDistinct(answer, pool);
  if (ds.length < 3) return null;
  const ans = m(num(answer));
  return {
    stem,
    answer: ans,
    answerValue: answer,
    distractors: ds.map((x) => ({ text: m(num(x.v)), value: x.v, why: x.why })),
    asking,
    solution: steps(
      `A **circular queue** keeps its items in a fixed row of ${N} slots, numbered 0 to ${N - 1}. After slot ${N - 1} the next slot is 0, as if the row were bent into a ring. An **enqueue** adds an item at the rear (the back), and a **dequeue** removes the item at the front.`,
      `That wrap-around uses mod, which means the remainder after dividing. For example, ${m(`${N + 2} \\bmod ${N} = 2`)}, because ${N + 2} divided by ${N} leaves 2 over.`,
      ...working,
    ),
    conclusion,
    keyIdea:
      'Track two markers. A dequeue moves the front on by 1 and an enqueue moves the rear on by 1, both wrapping with mod capacity. The last item is at $(\\text{front} + \\text{count} - 1) \\bmod \\text{capacity}$.',
  };
}

export const generators: Generator[] = [
  {
    id: 'gen-stacks-queues-trace',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    title: 'Trace push/pop or enqueue/dequeue operations',
    generate: (rng) => build(rng, traceAttempt),
  },
  {
    id: 'gen-stacks-queues-postfix',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    title: 'Evaluate a postfix expression with a stack',
    generate: (rng) => build(rng, postfixAttempt),
  },
  {
    id: 'gen-stacks-queues-circular',
    subtopic: 'stacks-queues',
    difficulty: 'exam',
    title: 'Circular queue front and rear indices',
    generate: (rng) => build(rng, circularAttempt),
  },
];
