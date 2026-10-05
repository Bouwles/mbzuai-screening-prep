import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';
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

function simulate(ops: Op[], lifo: boolean): { items: number[]; removed: number[]; rows: string[] } {
  const items: number[] = [];
  const removed: number[] = [];
  const rows: string[] = [];
  for (const op of ops) {
    let label: string;
    let out = '';
    if (op.kind === 'add') {
      items.push(op.v);
      label = lifo ? `\`push(${op.v})\`` : `\`enqueue(${op.v})\``;
    } else {
      const x = (lifo ? items.pop() : items.shift()) as number;
      removed.push(x);
      out = String(x);
      label = lifo ? '`pop()`' : '`dequeue()`';
    }
    rows.push(`| ${label} | ${items.length ? items.join(', ') : '(empty)'} | ${out} |`);
  }
  return { items, removed, rows };
}

function traceAttempt(rng: Rng): GeneratedCore | null {
  const lifo = rng.bool();
  const nAdd = rng.int(5, 7);
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

  const real = simulate(ops, lifo);
  const other = simulate(ops, !lifo);
  const top = (r: { items: number[] }, isLifo: boolean) => (isLifo ? r.items[r.items.length - 1] : r.items[0]);
  const bottom = (r: { items: number[] }, isLifo: boolean) => (isLifo ? r.items[0] : r.items[r.items.length - 1]);
  const lastAdded = values[nAdd - 1];
  const S = lifo ? 'stack' : 'queue';
  const end = lifo ? 'top' : 'front';
  const otherEnd = lifo ? 'bottom' : 'rear';
  const opList = ops.map((o) => (o.kind === 'add' ? (lifo ? `\`push(${o.v})\`` : `\`enqueue(${o.v})\``) : lifo ? '`pop()`' : '`dequeue()`')).join(', ');
  const removeWord = lifo ? '`pop()`' : '`dequeue()`';

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
    question = `What value is returned by the **last** ${removeWord}?`;
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

  const ans = m(num(answer));
  const header = lifo ? '| Operation | Stack (bottom to top) | Returned |' : '| Operation | Queue (front to rear) | Removed |';
  const solution =
    (lifo
      ? 'A stack is **last in, first out**: `push` adds on top, `pop` removes the top item.\n\n'
      : 'A queue is **first in, first out**: `enqueue` adds at the rear, `dequeue` removes the front item.\n\n') +
    `Trace the ${S} after every operation:\n\n` +
    `${header}\n|---|---|---|\n${real.rows.join('\n')}\n\n` +
    (ask === 'next'
      ? `At the end the ${S} holds ${real.items.join(', ')} (${lifo ? 'bottom to top' : 'front to rear'}), so the ${end} value is ${num(answer)}.\n\n`
      : `The last ${removeWord} returned ${num(answer)}.\n\n`) +
    `Answer: ${ans}`;
  return {
    stem: `Starting with an empty **${S}**, these operations are carried out in order:\n\n${opList}\n\n${question}`,
    answer: ans,
    answerValue: answer,
    distractors: ds.map((d) => ({ text: m(num(d.v)), value: d.v, why: d.why })),
    solution,
    keyIdea: lifo
      ? 'A stack is LIFO: every pop removes the most recently pushed item that is still there.'
      : 'A queue is FIFO: every dequeue removes the item that has waited longest.',
  };
}

// ================================================================ 2. evaluate a postfix expression
type Tok = number | '+' | '-' | '*';
const OPS = ['+', '-', '*'] as const;
const opTex = (o: string) => (o === '*' ? '\\times' : o);
const apply = (a: number, o: string, b: number) => (o === '+' ? a + b : o === '-' ? a - b : a * b);

function evalStack(tokens: Tok[], swap: boolean): { value: number; rows: string[]; beforeLast: number; hasZero: boolean } {
  const s: number[] = [];
  let hasZero = false;
  const rows: string[] = [];
  let beforeLast = NaN;
  tokens.forEach((t, i) => {
    if (typeof t === 'number') {
      s.push(t);
      rows.push(`| \`${t}\` | push | ${s.join(', ')} |`);
    } else {
      const b = s.pop() as number;
      const a = s.pop() as number;
      if (i === tokens.length - 1) beforeLast = b;
      const r = swap ? apply(b, t, a) : apply(a, t, b);
      if (r === 0) hasZero = true;
      s.push(r);
      rows.push(`| \`${t}\` | pop ${b} then ${a}, push ${m(`${num(a)} ${opTex(t)} ${b < 0 ? `(${num(b)})` : num(b)} = ${num(r)}`)} | ${s.join(', ')} |`);
    }
  });
  return { value: s[0], rows, beforeLast, hasZero };
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
  const solution =
    'A **number** is pushed. An **operator** pops the top value $b$, then the next value $a$, and pushes $a \\text{ op } b$.\n\n' +
    '| Token | Action | Stack (bottom to top) |\n|---|---|---|\n' +
    real.rows.join('\n') +
    `\n\nCheck in ordinary notation: ${m(`${infix} = ${num(answer)}`)}.\n\n` +
    `Answer: ${ans}`;
  return {
    stem: `Evaluate the postfix (Reverse Polish) expression below using a stack. (\`*\` means multiply.)\n\n\`${expr}\``,
    answer: ans,
    answerValue: answer,
    distractors: ds.map((d) => ({ text: m(num(d.v)), value: d.v, why: d.why })),
    solution,
    keyIdea: 'In postfix evaluation, each operator pops b then a and pushes a op b, so operand order matters for subtraction.',
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
    `A circular queue is stored in an array with indices 0 to ${N - 1} (capacity ${N}). Items occupy consecutive slots, wrapping from index ${N - 1} back to index 0. ` +
    `The front item is at index ${f} and the queue holds ${k} items.\n\n` +
    `Then ${d} item${d === 1 ? ' is' : 's are'} dequeued and ${e} new item${e === 1 ? ' is' : 's are'} enqueued.`;
  let answer: number;
  let pool: Cand[];
  let steps: string;
  let stem: string;
  if (ask === 'rear') {
    const raw = f + k + e - 1;
    answer = mod(raw);
    stem = `${setup}\n\nAt which index is the **last item that was enqueued** stored?`;
    pool = [
      { v: raw, why: `This forgets to wrap round with mod ${N}: index ${raw} does not exist in an array of capacity ${N}.` },
      { v: mod(raw + 1), why: 'This is the next **free** slot (one past the last item), not the slot holding the last item.' },
      { v: mod(f + k - d + e - 1), why: 'This lets the dequeues pull the rear back. Dequeuing only moves the front; new items still go after the old rear.' },
      { v: k - d + e - 1, why: 'This assumes the items shift down to start at index 0 after dequeuing (like a Python list). In a circular queue items never move; only the indices change.' },
    ];
    steps =
      `Dequeuing only moves the **front**; it does not change where new items go. Before the dequeues the rear item is at ${m(`(${f} + ${k} - 1) \\bmod ${N} = ${mod(f + k - 1)}`)}.\n\n` +
      `Each enqueue puts the new item one slot after the current rear, so after ${e} enqueue${e === 1 ? '' : 's'} the last one is at` +
      `\n\n$$(${f} + ${k} + ${e} - 1) \\bmod ${N} = ${raw} \\bmod ${N} = ${answer}$$\n\n`;
  } else {
    const raw = f + d;
    answer = mod(raw);
    stem = `${setup}\n\nAt which index is the **front** item now?`;
    pool = [
      { v: raw, why: `This forgets to wrap round with mod ${N}: index ${raw} does not exist in an array of capacity ${N}.` },
      { v: mod(raw - 1), why: 'This is the index of the last item that was **dequeued**, not the new front (an off-by-one error).' },
      { v: f, why: 'This assumes the front stays put and the items shift along. In a circular queue the items stay in place and the front index moves on.' },
      { v: mod(f - d), why: 'This moves the front the wrong way. Each dequeue moves the front forwards (towards higher indices, wrapping round).' },
      { v: mod(f + d + e), why: 'This lets the enqueues move the front too. Enqueuing only moves the rear.' },
    ];
    steps =
      `Each dequeue removes the front item and moves the front one slot forward (wrapping round). Enqueues only affect the rear, so they do not change the front.\n\n` +
      (raw >= N
        ? `$$\\text{front} = (${f} + ${d}) \\bmod ${N} = ${raw} \\bmod ${N} = ${answer}$$\n\n`
        : `$$\\text{front} = (${f} + ${d}) \\bmod ${N} = ${answer}$$\n\n(No wrap-around is needed here, because ${raw} is still a valid index.)\n\n`);
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
    solution: `${steps}Answer: ${ans}`,
    keyIdea: 'In a circular queue the front and rear indices move forward and wrap with mod capacity; the items themselves never move.',
  };
}

export const generators: Generator[] = [
  {
    id: 'gen-stacks-queues-trace',
    subtopic: 'stacks-queues',
    difficulty: 'foundation',
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
