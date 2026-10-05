import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { pyList } from '../../../lib/tex';

type Cand = { text: string; why: string };

/** Keep up to 3 candidates whose text differs from the answer and from each other. */
function pickDistinct(answer: string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  const key = (s: string) => s.replace(/\s+/g, ' ').trim();
  for (const c of pool) {
    if (out.length === 3) break;
    if (key(c.text) === key(answer)) continue;
    if (out.some((o) => key(o.text) === key(c.text))) continue;
    out.push(c);
  }
  return out;
}

const pySet = (xs: number[]) => `{${xs.join(', ')}}`;
const sortNum = (xs: number[]) => [...xs].sort((a, b) => a - b);
const uniq = (xs: number[]) => [...new Set(xs)];

// ------------------------------------------------------------------ set operations
type OpId = '|' | '&' | '-' | '^';
const OPS: { op: OpId; name: string; meaning: string }[] = [
  { op: '|', name: 'union', meaning: 'every value that is in `A` or in `B` (or both)' },
  { op: '&', name: 'intersection', meaning: 'only the values that are in both `A` and `B`' },
  { op: '-', name: 'difference', meaning: 'the values in `A` that are not in `B`' },
  { op: '^', name: 'symmetric difference', meaning: 'the values in exactly one of `A` and `B` (not in both)' },
];

function applyOp(op: OpId, A: number[], B: number[]): number[] {
  const sa = new Set(A);
  const sb = new Set(B);
  switch (op) {
    case '|':
      return sortNum(uniq([...A, ...B]));
    case '&':
      return sortNum(A.filter((x) => sb.has(x)));
    case '-':
      return sortNum(A.filter((x) => !sb.has(x)));
    case '^':
      return sortNum([...A.filter((x) => !sb.has(x)), ...B.filter((x) => !sa.has(x))]);
  }
}

function genSetOps(rng: Rng): GeneratedCore {
  for (;;) {
    // distinct values 1..12; A and B overlap in 1-3 values, each has 1-3 values of its own
    const pool = rng.shuffle(Array.from({ length: 12 }, (_, i) => i + 1));
    const nCommon = rng.int(1, 3);
    const nOnlyA = rng.int(1, 3);
    const nOnlyB = rng.int(1, 3);
    const common = pool.slice(0, nCommon);
    const onlyA = pool.slice(nCommon, nCommon + nOnlyA);
    const onlyB = pool.slice(nCommon + nOnlyA, nCommon + nOnlyA + nOnlyB);
    const A = rng.shuffle([...common, ...onlyA]);
    const B = rng.shuffle([...common, ...onlyB]);
    // sometimes write a duplicate inside the set literal of A (Python silently removes it)
    const dupA = rng.bool(0.4) ? rng.pick(A) : null;
    const litA = dupA === null ? A : [...A, dupA];
    const { op, name, meaning } = rng.pick(OPS);

    const ans = applyOp(op, A, B);
    if (ans.length === 0) continue;
    const answer = `\`${pyList(ans)}\``;

    const cands: Cand[] = [];
    const add = (xs: number[], why: string) => cands.push({ text: `\`${pyList(xs)}\``, why });
    const others = OPS.filter((o) => o.op !== op);
    if (op === '-') add(applyOp('-', B, A), 'This is `B - A` (the values in `B` that are not in `A`). Set difference is not symmetric: `A - B` starts from `A`.');
    // most tempting confusions first
    const order: Record<OpId, OpId[]> = { '|': ['^', '&'], '&': ['|', '-'], '-': ['^', '&', '|'], '^': ['|', '-', '&'] };
    for (const o2 of order[op]) {
      const info = others.find((o) => o.op === o2)!;
      add(applyOp(o2, A, B), `This is the ${info.name} \`A ${o2} B\`, not the ${name}. The operator \`${op}\` gives ${meaning}.`);
    }
    if (op === '|' || op === '^') {
      if (dupA !== null) {
        const withDup = sortNum([...ans, ...(ans.includes(dupA) ? [dupA] : [])]);
        add(withDup, `This keeps the repeated ${dupA} from the set literal. A set stores each value only once, so the duplicate disappears as soon as \`A\` is created.`);
      }
      add(sortNum([...A, ...B]), 'This joins the two sets without removing the shared values, so they appear twice. A set result never contains duplicates.');
    }
    if (op === '&' && dupA !== null && ans.includes(dupA))
      add(sortNum([...ans, dupA]), `This keeps the repeated ${dupA} from the set literal. A set stores each value only once.`);
    add(applyOp('-', A, B), `This is \`A - B\` (the values of \`A\` that are not in \`B\`), not the ${name}.`);
    add(sortNum(A), `This is just the set \`A\` itself; it ignores what \`${op}\` does with \`B\`.`);
    add(sortNum(B), `This is just the set \`B\` itself; it ignores what \`${op}\` does with \`A\`.`);
    const ds = pickDistinct(answer, cands);
    if (ds.length < 3) continue;

    const code = `A = ${pySet(litA)}\nB = ${pySet(B)}\nprint(sorted(A ${op} B))`;
    const sA = sortNum(A);
    const sB = sortNum(B);
    const solution =
      (dupA !== null ? `A set keeps only one copy of each value, so the repeated ${dupA} in the literal for \`A\` is dropped.\n\n` : '') +
      `1. \`A\` = ${pySet(sA)} and \`B\` = ${pySet(sB)} (written in increasing order).\n` +
      `2. Values in both sets: ${common.length ? pySet(sortNum(common)) : 'none'}. Only in \`A\`: ${pySet(sortNum(onlyA))}. Only in \`B\`: ${pySet(sortNum(onlyB))}.\n` +
      `3. \`A ${op} B\` is the ${name}: ${meaning}. That is ${pySet(ans)}.\n` +
      `4. \`sorted\` turns the set into a list in increasing order.\n\n` +
      `Answer: ${answer}`;
    return {
      stem: 'What does this Python code print?',
      code: { lang: 'python', source: code },
      answer,
      answerValue: pyList(ans),
      distractors: ds.map((d) => ({ text: d.text, value: d.text.replace(/`/g, ''), why: d.why })),
      solution,
      keyIdea: '`|` is union, `&` is intersection, `-` is difference (order matters) and `^` is symmetric difference; sets never hold duplicates.',
      python: { stdout: `${pyList(ans)}\n` },
    };
  }
}

// ------------------------------------------------------------------ counting with a dictionary
const WORD_SETS: { label: string; words: string[] }[] = [
  { label: 'fruit', words: ['kiwi', 'fig', 'plum', 'pear', 'lime'] },
  { label: 'animal', words: ['cat', 'dog', 'owl', 'yak', 'emu'] },
  { label: 'colour', words: ['red', 'blue', 'green', 'pink', 'gold'] },
  { label: 'city', words: ['Dubai', 'Doha', 'Muscat', 'Cairo', 'Amman'] },
];

function genCounting(rng: Rng): GeneratedCore {
  for (;;) {
    const set = rng.pick(WORD_SETS);
    const d = rng.int(2, 4);
    const words = rng.sample(set.words, d);
    const n = rng.int(d + 2, 9);
    // every chosen word appears at least once
    const items = rng.shuffle([...words, ...Array.from({ length: n - d }, () => rng.pick(words))]);
    const counts = new Map<string, number>();
    for (const w of items) counts.set(w, (counts.get(w) ?? 0) + 1);
    if (counts.size !== d) continue;
    const repeated = words.filter((w) => counts.get(w)! >= 2);
    if (!repeated.length) continue;
    const target = rng.pick(repeated);
    const c = counts.get(target)!;
    const style = rng.int(0, 1); // 0: get with default, 1: if/else

    const answer = `\`${d} ${c}\``;
    const cands: Cand[] = [
      { text: `\`${n} ${c}\``, why: `This uses the length of the list (${n} items) instead of the number of keys. Each different word is stored only once, so there are ${d} keys.` },
      {
        text: `\`${d} 1\``,
        why:
          style === 0
            ? `This assumes the count is reset to 1 each time. \`counts.get(w, 0)\` returns the count so far, so every repeat adds 1 to it.`
            : `This assumes the \`else\` branch runs every time, resetting the count to 1. Once a word is a key, the \`if\` branch adds 1 to its count.`,
      },
      { text: `\`${d} ${c - 1}\``, why: `This counts only the repeats of '${target}' (the occurrences after the first). The first occurrence also stores a count of 1.` },
      { text: `\`${d} ${n}\``, why: `\`counts['${target}']\` is how many times '${target}' appears, not the total number of items.` },
      { text: `\`${n} ${n}\``, why: `This mixes up both numbers with the list length ${n}. There are ${d} distinct keys, and '${target}' appears ${c} times.` },
    ];
    const ds = pickDistinct(answer, cands);
    if (ds.length < 3) continue;

    const listSrc = `[${items.map((w) => `'${w}'`).join(', ')}]`;
    const loop =
      style === 0
        ? `for w in items:\n    counts[w] = counts.get(w, 0) + 1`
        : `for w in items:\n    if w in counts:\n        counts[w] += 1\n    else:\n        counts[w] = 1`;
    const code = `items = ${listSrc}\ncounts = {}\n${loop}\nprint(len(counts), counts['${target}'])`;
    const final = [...counts.entries()].map(([k, v]) => `'${k}': ${v}`).join(', ');
    // trace table: the count of the current word after each step
    const running = new Map<string, number>();
    const traceRows = items
      .map((w, i) => {
        const before = running.get(w) ?? 0;
        running.set(w, before + 1);
        return `| ${i + 1} | '${w}' | ${before === 0 ? 'no, new key' : 'yes'} | ${before + 1} |`;
      })
      .join('\n');
    const trace = `| step | \`w\` | already a key? | \`counts[w]\` after |\n|---|---|---|---|\n${traceRows}\n\n`;
    const solution =
      (style === 0
        ? '`counts.get(w, 0)` is the count so far (0 if `w` is new); adding 1 and storing it back counts one more occurrence.'
        : 'If `w` is already a key its count goes up by 1; otherwise it is added with count 1.') +
      `\n\nGo through the ${n} items one by one, adding 1 to the current word's count:\n\n` +
      trace +
      `1. Final dictionary (keys in first-seen order): \`{${final}}\`.\n` +
      `2. \`len(counts)\` is the number of keys = ${d} (one per different word).\n` +
      `3. \`counts['${target}']\` = ${c}, because '${target}' appears ${c} times in the list.\n\n` +
      `Answer: ${answer}`;
    return {
      stem: 'What does this Python code print?',
      code: { lang: 'python', source: code },
      answer,
      answerValue: `${d} ${c}`,
      distractors: ds.map((x) => ({ text: x.text, value: x.text.replace(/`/g, ''), why: x.why })),
      solution,
      keyIdea: 'Counting with a dictionary gives one key per distinct item, and each value is how many times that item occurred.',
      python: { stdout: `${d} ${c}\n` },
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-dicts-sets-set-ops',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    title: 'Result of a set operation',
    generate: genSetOps,
  },
  {
    id: 'gen-dicts-sets-counting',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    title: 'Count items with a dictionary',
    generate: genCounting,
  },
];
