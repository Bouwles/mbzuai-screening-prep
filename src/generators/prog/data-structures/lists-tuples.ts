import type { GeneratedCore, Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';

type PyVal = number | PyVal[];

/** Python repr of a (possibly nested) list of ints. */
function repr(v: PyVal): string {
  return Array.isArray(v) ? `[${v.map(repr).join(', ')}]` : String(v);
}

/** 1 -> '1st', 2 -> '2nd', 3 -> '3rd', 4 -> '4th'. */
function ord(k: number): string {
  const t = k % 100;
  if (t >= 11 && t <= 13) return `${k}th`;
  return `${k}${['th', 'st', 'nd', 'rd'][k % 10] ?? 'th'}`;
}

type Cand = { list: PyVal[] | null; why: string };

/** Keep up to 3 candidates whose repr differs from the answer and from each other. */
function pickDistinct(answer: string, pool: Cand[]): { text: string; value: string; why: string }[] {
  const out: { text: string; value: string; why: string }[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (!c.list) continue;
    const r = repr(c.list);
    if (r === answer || out.some((o) => o.value === r)) continue;
    out.push({ text: `\`${r}\``, value: r, why: c.why });
  }
  return out;
}

/** Python-style slice of a flat list (start/stop may be negative or omitted; step non-zero). */
function pySlice(L: number[], start: number | null, stop: number | null, step = 1): number[] {
  const n = L.length;
  const norm = (x: number) => (x < 0 ? x + n : x);
  const out: number[] = [];
  if (step > 0) {
    let s = start === null ? 0 : Math.max(0, Math.min(n, norm(start)));
    const e = stop === null ? n : Math.max(0, Math.min(n, norm(stop)));
    for (; s < e; s += step) out.push(L[s]);
  } else {
    let s = start === null ? n - 1 : Math.max(-1, Math.min(n - 1, norm(start)));
    const e = stop === null ? -1 : Math.max(-1, Math.min(n - 1, norm(stop)));
    for (; s > e; s += step) out.push(L[s]);
  }
  return out;
}

function indexTable(L: number[]): string {
  const n = L.length;
  return (
    `| Value | ${L.join(' | ')} |\n` +
    `| --- | ${L.map(() => '---').join(' | ')} |\n` +
    `| Index | ${L.map((_, i) => i).join(' | ')} |\n` +
    `| Negative index | ${L.map((_, i) => i - n).join(' | ')} |\n\n`
  );
}

// ---------------------------------------------------------------- generator 1: slicing
function genSlice(rng: Rng): GeneratedCore {
  for (;;) {
    const n = rng.int(6, 8);
    const pool1 = Array.from({ length: 39 }, (_, i) => i + 2);
    const L = rng.sample(pool1, n);
    const name = rng.pick(['nums', 'data', 'scores', 'vals', 'marks']);
    const kind = rng.pick(['ab', 'ab', 'neg', 'step', 'rev'] as const);
    let expr: string;
    let correct: number[];
    let explain: string;
    let pool: Cand[];

    if (kind === 'ab') {
      const a = rng.int(1, n - 3);
      const b = rng.int(a + 2, n - 1);
      expr = `${a}:${b}`;
      correct = pySlice(L, a, b);
      const idx = Array.from({ length: b - a }, (_, i) => a + i);
      explain =
        `\`${name}[${a}:${b}]\` starts at index ${a} and goes **up to but not including** index ${b}.\n\n` +
        `1. Indices taken: ${idx.join(', ')} (index ${b} is excluded), which is $${b} - ${a} = ${b - a}$ items.\n` +
        `2. The items at those indices are ${correct.join(', ')}.\n\n`;
      pool = [
        { list: pySlice(L, a, b + 1), why: `This includes the item at the stop index ${b}. The stop index is always excluded, so the slice has $${b} - ${a} = ${b - a}$ items.` },
        { list: pySlice(L, a - 1, b - 1), why: `This counts positions from 1 instead of 0, so every item is one place too far left. Index ${a} is the item ${L[a]}, not ${L[a - 1]}.` },
        { list: pySlice(L, a - 1, b), why: `This counts positions from 1 and also includes the stop position. Python counts from 0 and excludes index ${b}.` },
        {
          // only when a + b stays inside the list, so the "take b items" misreading really gives b items
          list: a + b <= n ? pySlice(L, a, a + b) : null,
          why: `This reads the second number as "how many items to take" (${b} items from index ${a}). It is the stop index: the slice ends just before index ${b}.`,
        },
      ];
    } else if (kind === 'neg') {
      const k = rng.int(2, 4);
      expr = `-${k}:`;
      correct = pySlice(L, -k, null);
      explain =
        `Negative indices count back from the end: \`-1\` is the last item, \`-2\` the second-to-last, and so on.\n\n` +
        `1. Index $-${k}$ is the same as index $${n} - ${k} = ${n - k}$, which holds ${L[n - k]}.\n` +
        `2. \`${name}[-${k}:]\` runs from there to the end, in the normal left-to-right order: the last ${k} items, ${correct.join(', ')}.\n\n`;
      pool = [
        { list: pySlice(L, null, -k), why: `This mixes up \`[-${k}:]\` with \`[:-${k}]\`, which takes everything **except** the last ${k} items.` },
        { list: pySlice(L, k, null), why: `This ignores the minus sign and slices from index ${k}. Index $-${k}$ counts back from the end.` },
        { list: pySlice(L, -k, null).reverse(), why: `This thinks a negative index makes the slice run backwards. Only a negative **step** reverses; \`[-${k}:]\` keeps the normal order.` },
        {
          list: pySlice(L, -(k + 1), null),
          why: `This treats $-1$ as the second-to-last item, so it starts one item too early and takes ${k + 1} items. Index $-1$ is the last item, so $-${k}$ is the ${ord(k)} item from the end and the slice has exactly ${k} items.`,
        },
      ];
    } else if (kind === 'step') {
      const a = rng.int(0, 2);
      const s = rng.int(2, 3);
      expr = a === 0 ? `::${s}` : `${a}::${s}`;
      correct = pySlice(L, a, null, s);
      const idx: number[] = [];
      for (let i = a; i < n; i += s) idx.push(i);
      explain =
        `A slice \`[start:stop:step]\` starts at \`start\` and jumps forward by \`step\` each time; a missing stop means "to the end".\n\n` +
        `1. Start at index ${a} and add ${s} each time: indices ${idx.join(', ')} (the next one, ${idx[idx.length - 1] + s}, is past the end).\n` +
        `2. The items at those indices are ${correct.join(', ')}.\n\n`;
      pool = [
        { list: pySlice(L, a, null, s + 1), why: `This treats step ${s} as "skip ${s} items between picks", which is really a step of ${s + 1}. Step ${s} moves forward ${s} indices each time.` },
        {
          list: a >= 1 ? pySlice(L, a - 1, null, s) : null,
          why: `This counts positions from 1, so it starts at the ${ord(a)} item (index ${a - 1}). Python counts from 0: index ${a} is the item ${L[a]}.`,
        },
        { list: pySlice(L, s - 1, null, s), why: `This picks "every ${ord(s)} item counting from 1" (indices ${s - 1}, ${2 * s - 1}, ...). The slice starts at index ${a}, not at the ${ord(s)} item.` },
        {
          list: pySlice(L, a + 1, null, s),
          why: `This treats the start index as excluded (like the stop), so it begins one place too late at index ${a + 1}. The start index is included: the slice begins with index ${a}, the item ${L[a]}.`,
        },
        { list: pySlice(L, a + s, null, s), why: `This skips the starting item, jumping ${s} places before taking the first one. The slice includes index ${a} itself (the item ${L[a]}).` },
        { list: a < s ? pySlice(L, a, s) : null, why: `This misreads the double colon as a single colon, treating ${s} as the stop index instead of the step.` },
      ];
    } else {
      const s = rng.pick([1, 2]);
      expr = s === 1 ? '::-1' : '::-2';
      correct = pySlice(L, null, null, -s);
      const idx: number[] = [];
      for (let i = n - 1; i >= 0; i -= s) idx.push(i);
      explain =
        `A **negative step** walks backwards. With no start given, it starts at the **last** item and keeps going until it passes the beginning.\n\n` +
        `1. Start at index ${n - 1} and subtract ${s} each time: indices ${idx.join(', ')}.\n` +
        `2. The items at those indices are ${correct.join(', ')}.\n\n`;
      pool =
        s === 1
          ? [
              { list: L.slice(), why: 'This ignores the minus sign. A step of $-1$ walks backwards, so the whole list comes out reversed.' },
              { list: pySlice(L, -2, null, -1), why: `This starts at the second-to-last item. With a negative step and no start, the slice starts at the very last item, ${L[n - 1]}.` },
              { list: pySlice(L, null, 0, -1), why: `This stops before index 0, leaving out the first item ${L[0]}. With no stop given, a reversed slice runs right to the beginning.` },
            ]
          : [
              { list: pySlice(L, null, null, 2), why: 'This ignores the minus sign and takes every 2nd item from the start. A negative step walks backwards from the end.' },
              { list: pySlice(L, -2, null, -2), why: `This starts at the second-to-last item. With a negative step and no start, the slice starts at the very last item, ${L[n - 1]}.` },
              { list: pySlice(L, null, null, 2).reverse(), why: 'This takes every 2nd item counting from the **front**, then reverses them. Counting starts from the last item, so the picked positions are different.' },
              { list: pySlice(L, null, null, -1), why: 'This reverses the whole list but forgets the step size of 2, so it keeps every item instead of every 2nd one.' },
            ];
    }

    const ans = repr(correct);
    const distractors = pickDistinct(ans, pool);
    if (distractors.length < 3) continue; // re-roll parameters
    const answer = `\`${ans}\``;
    const src = `${name} = ${repr(L)}\nprint(${name}[${expr}])`;
    return {
      stem: 'What does this Python code print?',
      code: { lang: 'python', source: src },
      answer,
      answerValue: ans,
      distractors,
      solution: indexTable(L) + explain + `A slice of a list is a new list, printed with square brackets.\n\nAnswer: ${answer}`,
      keyIdea: 'In `a[start:stop:step]` the stop is excluded, negative indices count from the end (`-1` is the last item), and a negative step walks backwards.',
      python: { stdout: ans + '\n' },
    };
  }
}

// ---------------------------------------------------------------- generator 2: list methods trace
type Op =
  | { k: 'append'; x: number }
  | { k: 'insert'; i: number; x: number }
  | { k: 'pop' }
  | { k: 'popi'; i: number }
  | { k: 'remove'; x: number }
  | { k: 'extend'; xs: [number, number] };

type Mistake = 'none' | 'appendFront' | 'insertAfter' | 'insertReplace' | 'popFirst' | 'popNoRemove' | 'popiOneBased' | 'removeByIndex' | 'extendNested';

function opCode(name: string, op: Op): string {
  switch (op.k) {
    case 'append':
      return `${name}.append(${op.x})`;
    case 'insert':
      return `${name}.insert(${op.i}, ${op.x})`;
    case 'pop':
      return `${name}.pop()`;
    case 'popi':
      return `${name}.pop(${op.i})`;
    case 'remove':
      return `${name}.remove(${op.x})`;
    case 'extend':
      return `${name}.extend([${op.xs[0]}, ${op.xs[1]}])`;
  }
}

/** Apply one op (with an optional misunderstanding). Returns false if it would raise an error. */
function applyOp(a: PyVal[], op: Op, mk: Mistake): boolean {
  switch (op.k) {
    case 'append':
      if (mk === 'appendFront') a.unshift(op.x);
      else a.push(op.x);
      return true;
    case 'insert':
      if (mk === 'insertAfter') a.splice(Math.min(op.i + 1, a.length), 0, op.x);
      else if (mk === 'insertReplace') {
        if (op.i >= a.length) return false;
        a[op.i] = op.x;
      } else a.splice(Math.min(op.i, a.length), 0, op.x);
      return true;
    case 'pop':
      if (a.length === 0) return false;
      if (mk === 'popNoRemove') return true;
      if (mk === 'popFirst') a.shift();
      else a.pop();
      return true;
    case 'popi': {
      const i = mk === 'popiOneBased' ? op.i - 1 : op.i;
      if (i < 0 || i >= a.length) return false;
      if (mk === 'popNoRemove') return true;
      a.splice(i, 1);
      return true;
    }
    case 'remove': {
      if (mk === 'removeByIndex') {
        if (op.x >= a.length) return false;
        a.splice(op.x, 1);
        return true;
      }
      const j = a.findIndex((v) => v === op.x);
      if (j < 0) return false;
      a.splice(j, 1);
      return true;
    }
    case 'extend':
      if (mk === 'extendNested') a.push([op.xs[0], op.xs[1]]);
      else a.push(op.xs[0], op.xs[1]);
      return true;
  }
}

/** Simulate the ops; the misunderstanding `mk` is applied only to the op at index `at`. */
function simulate(start: number[], ops: Op[], mk: Mistake, at = -1): PyVal[] | null {
  const a: PyVal[] = start.slice();
  for (let j = 0; j < ops.length; j++) if (!applyOp(a, ops[j], j === at ? mk : 'none')) return null;
  return a;
}

const MISTAKES: Record<Op['k'], { mk: Mistake; why: (op: Op) => string }[]> = {
  append: [{ mk: 'appendFront', why: (op) => `This puts the appended value at the front. \`append(${(op as { x: number }).x})\` always adds to the **end** of the list.` }],
  insert: [
    {
      mk: 'insertAfter',
      why: (op) => {
        const o = op as { i: number; x: number };
        return `This puts ${o.x} **after** index ${o.i}. \`insert(${o.i}, ${o.x})\` places the new item **at** index ${o.i}, shifting the old item there one place right.`;
      },
    },
    {
      mk: 'insertReplace',
      why: (op) => {
        const o = op as { i: number; x: number };
        return `This overwrites the item at index ${o.i}. \`insert\` never replaces anything: it adds ${o.x} and shifts the later items right, so the list gets longer.`;
      },
    },
  ],
  pop: [
    { mk: 'popFirst', why: () => 'This removes the first item. With no argument, `pop()` removes the **last** item; `pop(0)` would remove the first.' },
    { mk: 'popNoRemove', why: () => '`pop()` does not just look at the last item: it **removes** it from the list (and returns it).' },
  ],
  popi: [
    {
      mk: 'popiOneBased',
      why: (op) => {
        const i = (op as { i: number }).i;
        return `This counts positions from 1, removing the ${ord(i)} item. \`pop(${i})\` removes the item at index ${i}, counting from 0.`;
      },
    },
    { mk: 'popNoRemove', why: (op) => `\`pop(${(op as { i: number }).i})\` does not just read the item: it **removes** it from the list (and returns it).` },
  ],
  remove: [
    {
      mk: 'removeByIndex',
      why: (op) => {
        const x = (op as { x: number }).x;
        return `This treats \`remove(${x})\` as "delete the item at index ${x}". \`remove\` deletes by **value**: it removes the first item equal to ${x}.`;
      },
    },
  ],
  extend: [
    {
      mk: 'extendNested',
      why: (op) => {
        const xs = (op as { xs: number[] }).xs;
        return `This adds \`[${xs[0]}, ${xs[1]}]\` as one nested item, which is what \`append\` would do. \`extend\` adds each item separately.`;
      },
    },
  ],
};

function opRule(op: Op): string {
  switch (op.k) {
    case 'append':
      return `adds ${op.x} to the end`;
    case 'insert':
      return `puts ${op.x} at index ${op.i}, shifting later items right`;
    case 'pop':
      return 'removes the last item';
    case 'popi':
      return `removes the item at index ${op.i}`;
    case 'remove':
      return `removes the first item equal to ${op.x}`;
    case 'extend':
      return `adds ${op.xs[0]} and ${op.xs[1]} to the end, one by one`;
  }
}

function genMethods(rng: Rng): GeneratedCore {
  for (;;) {
    const name = rng.pick(['nums', 'items', 'a', 'stack', 'q']);
    const n = rng.int(4, 5);
    const start = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], n);
    const kinds = rng.sample(['append', 'insert', 'pop', 'popi', 'remove', 'extend'] as const, 3);
    const big = rng.shuffle(Array.from({ length: 20 }, (_, i) => i + 10));
    let bi = 0;
    const cur = start.slice();
    const ops: Op[] = [];
    for (const k of kinds) {
      let op: Op;
      if (k === 'append') op = { k, x: big[bi++] };
      else if (k === 'insert') op = { k, i: rng.int(1, cur.length - 1), x: big[bi++] };
      else if (k === 'pop') op = { k };
      else if (k === 'popi') op = { k, i: rng.int(1, cur.length - 2) };
      else if (k === 'remove') op = { k, x: rng.pick(cur.filter((v) => v < 10)) };
      else op = { k, xs: [big[bi++], big[bi++]] };
      applyOp(cur, op, 'none');
      ops.push(op);
    }
    const correct = simulate(start, ops, 'none')!;
    if (correct.length < 3) continue; // keep the final list interesting
    const ans = repr(correct);
    const pool: Cand[] = [];
    ops.forEach((op, j) => {
      for (const m of MISTAKES[op.k]) {
        let list = simulate(start, ops, m.mk, j);
        // the nested-list mistake must still be visible in the final list (not popped off later)
        if (m.mk === 'extendNested' && list && !list.some((v) => Array.isArray(v))) list = null;
        pool.push({ list, why: m.why(op) });
      }
    });
    const distractors = pickDistinct(ans, pool);
    if (distractors.length < 3) continue;

    // trace table
    let rows = `| Line | Rule | \`${name}\` afterwards |\n| --- | --- | --- |\n| \`${name} = ${repr(start)}\` | start | \`${repr(start)}\` |\n`;
    const a: PyVal[] = start.slice();
    for (const op of ops) {
      applyOp(a, op, 'none');
      rows += `| \`${opCode(name, op)}\` | ${opRule(op)} | \`${repr(a)}\` |\n`;
    }
    const answer = `\`${ans}\``;
    return {
      stem: `What does this Python code print?`,
      code: { lang: 'python', source: `${name} = ${repr(start)}\n${ops.map((o) => opCode(name, o)).join('\n')}\nprint(${name})` },
      answer,
      answerValue: ans,
      distractors,
      solution:
        'Trace the list one line at a time. Each method changes the list **in place**.\n\n' +
        rows +
        '\nRemember: `remove` works by value, `pop` and `insert` work by index (counting from 0), and `extend` adds items one by one.\n\n' +
        `Answer: ${answer}`,
      keyIdea: '`append`/`extend` add to the end, `insert(i, x)` puts `x` at index `i`, `pop()` removes the last item (`pop(i)` the item at index `i`), and `remove(x)` deletes the first `x`.',
      python: { stdout: ans + '\n' },
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-lists-tuples-slice',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    title: 'Predict the output of a list slice',
    generate: genSlice,
  },
  {
    id: 'gen-lists-tuples-methods',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    title: 'Trace a sequence of list methods',
    generate: genMethods,
  },
];
