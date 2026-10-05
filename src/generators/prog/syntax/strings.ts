import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';

// ---------------------------------------------------------------- helpers

/** Python slicing semantics s[start:stop:step] (null = omitted). */
function pySlice(s: string, start: number | null, stop: number | null, step = 1): string {
  const n = s.length;
  let out = '';
  if (step > 0) {
    let a = start === null ? 0 : start < 0 ? start + n : start;
    let b = stop === null ? n : stop < 0 ? stop + n : stop;
    a = Math.max(0, Math.min(n, a));
    b = Math.max(0, Math.min(n, b));
    for (let i = a; i < b; i += step) out += s[i];
  } else {
    let a = start === null ? n - 1 : start < 0 ? start + n : start;
    let b = stop === null ? -1 : stop < 0 ? stop + n : stop;
    a = Math.max(-1, Math.min(n - 1, a));
    b = Math.max(-1, Math.min(n - 1, b));
    for (let i = a; i > b; i += step) out += s[i];
  }
  return out;
}

/** Indices visited by a slice (same rules as pySlice). */
function sliceIdx(n: number, start: number | null, stop: number | null, step = 1): number[] {
  const out: number[] = [];
  if (step > 0) {
    let a = start === null ? 0 : start < 0 ? start + n : start;
    let b = stop === null ? n : stop < 0 ? stop + n : stop;
    a = Math.max(0, Math.min(n, a));
    b = Math.max(0, Math.min(n, b));
    for (let i = a; i < b; i += step) out.push(i);
  } else {
    let a = start === null ? n - 1 : start < 0 ? start + n : start;
    let b = stop === null ? -1 : stop < 0 ? stop + n : stop;
    a = Math.max(-1, Math.min(n - 1, a));
    b = Math.max(-1, Math.min(n - 1, b));
    for (let i = a; i > b; i += step) out.push(i);
  }
  return out;
}

/** Slice expression as written in Python, e.g. "2:5", "-4:-1", "::-2". */
function sliceExpr(start: number | null, stop: number | null, step?: number): string {
  const a = start === null ? '' : String(start);
  const b = stop === null ? '' : String(stop);
  return step === undefined ? `${a}:${b}` : `${a}:${b}:${step}`;
}

/** Markdown table of characters with positive (and optionally negative) indices. */
function indexTable(s: string, negative: boolean): string {
  const n = s.length;
  const head = `| character | ${s.split('').join(' | ')} |`;
  const sep = `|${'---|'.repeat(n + 1)}`;
  const pos = `| index | ${s.split('').map((_, i) => i).join(' | ')} |`;
  const neg = `| negative index | ${s.split('').map((_, i) => i - n).join(' | ')} |`;
  return [head, sep, pos, ...(negative ? [neg] : [])].join('\n');
}

const code = (t: string) => `\`${t}\``;

// ---------------------------------------------------------------- generator 1: slicing

const WORDS = [
  'ALGORITHM',
  'COMPUTER',
  'NETWORK',
  'DATABASE',
  'FUNCTION',
  'VARIABLE',
  'KEYBOARD',
  'LANGUAGE',
  'SEQUENCE',
  'TRIANGLE',
  'MOUNTAIN',
  'ELEPHANT',
  'HOSPITAL',
  'SANDWICH',
  'DOLPHINS',
  'WATERFALL',
  'BLACKBOARD',
  'PYRAMIDS',
  'MACHINES',
  'GRADIENT',
  'BACKPACK',
  'NOTEBOOK',
];

interface SliceCand {
  text: string;
  why: string;
}

interface SliceSetup {
  start: number | null;
  stop: number | null;
  step?: number;
  rule: string;
  pool: SliceCand[];
}

function sliceSetup(rng: Rng, s: string): SliceSetup {
  const n = s.length;
  const kind = rng.int(1, 5);
  if (kind === 1) {
    // s[a:b], positive
    const a = rng.int(1, n - 4);
    const b = a + rng.int(2, 3);
    return {
      start: a,
      stop: b,
      rule: `Start **at** index ${a} and stop **before** index ${b}, so the slice has $${b} - ${a} = ${b - a}$ characters.`,
      pool: [
        { text: pySlice(s, a, b + 1), why: `This includes the character at index ${b}. The stop index of a slice is excluded.` },
        { text: pySlice(s, a - 1, b - 1), why: 'This counts positions from 1 instead of 0, so every character is one place too far to the left.' },
        { text: pySlice(s, a - 1, b), why: 'This counts positions from 1 **and** includes the stop position. Python counts from 0 and excludes the stop.' },
        { text: pySlice(s, a, a + b), why: `This treats the second number as a **length** (take ${b} characters). It is the index to stop before.` },
      ],
    };
  }
  if (kind === 2) {
    // s[-a:-b], negative
    const a = rng.int(4, Math.min(7, n - 1));
    const b = rng.int(1, a - 2);
    return {
      start: -a,
      stop: -b,
      rule: `$-${a}$ is the same as index $${n} - ${a} = ${n - a}$ and $-${b}$ is the same as index $${n} - ${b} = ${n - b}$. Start at index ${n - a} and stop **before** index ${n - b}.`,
      pool: [
        {
          text: pySlice(s, n - a, n - b + 1),
          why: `This includes the character at the stop index $-${b}$. The stop is excluded even when it is negative.`,
        },
        {
          text: pySlice(s, n - a - 1, n - b - 1),
          why: 'This counts the negative indices one place off, as if $-1$ were the second-to-last character. In Python $-1$ is the last character.',
        },
        {
          text: pySlice(s, n - a, n - b).split('').reverse().join(''),
          why: 'This reads the characters backwards because the indices are negative. The step is $+1$, so the slice still reads left to right.',
        },
        {
          text: pySlice(s, n - a, null),
          why: `This runs on to the end of the string, as if the slice were ${code(`s[-${a}:]`)}. The stop index $-${b}$ cuts the slice off before index ${n - b}.`,
        },
      ],
    };
  }
  if (kind === 3) {
    // s[a:b:k]
    const k = rng.int(2, 3);
    const a = rng.int(0, 2);
    const b = rng.int(Math.min(a + 2 * k + 1, n - 1), n - 1);
    return {
      start: a,
      stop: b,
      step: k,
      rule: `Start at index ${a}, add ${k} each time, and stop as soon as the index reaches ${b} or more (index ${b} itself is excluded).`,
      pool: [
        { text: pySlice(s, a, b + 1, k), why: `This includes index ${b}. The stop index is excluded, even with a step.` },
        { text: pySlice(s, a, b, k + 1), why: `This treats a step of ${k} as "skip ${k} characters", jumping ${k + 1} each time. A step of ${k} means add ${k} to the index.` },
        { text: pySlice(s, a, b), why: 'This forgets the step and takes every character from the start index to the stop index.' },
        ...(a >= 1
          ? [{ text: pySlice(s, a - 1, b - 1, k), why: 'This counts positions from 1 instead of 0, so it starts one character too early.' }]
          : [{ text: pySlice(s, 1, b, k), why: 'This starts from the second character (index 1), as if the first character were number 1. Index 0 is the first character, so the slice starts there.' }]),
      ],
    };
  }
  if (kind === 4) {
    // s[::-k]
    const k = rng.int(2, 3);
    return {
      start: null,
      stop: null,
      step: -k,
      rule: `A negative step with no start or stop begins at the **last** character (index ${n - 1}) and moves left by ${k} each time, all the way down to index 0 if it is reached.`,
      pool: [
        { text: pySlice(s, null, null, k), why: `This takes every ${k === 2 ? 'second' : 'third'} character going **forwards**. The minus sign means start at the end and go backwards.` },
        { text: pySlice(s, null, null, -1), why: `This is the full reverse. It ignores the step size of ${k}.` },
        {
          text: pySlice(s, null, null, k).split('').reverse().join(''),
          why: `This takes every ${k === 2 ? 'second' : 'third'} character from the **front** and then reverses them. A negative step starts counting from the last character instead.`,
        },
        { text: pySlice(s, -2, null, -k), why: 'This starts from the second-to-last character. With no start given, a backwards slice starts at the very last character.' },
      ],
    };
  }
  // s[b:a:-1]
  const a = rng.int(1, n - 5);
  const b = a + rng.int(3, 4);
  return {
    start: b,
    stop: a,
    step: -1,
    rule: `The step is $-1$, so start at index ${b}, move **left** one at a time, and stop **before** index ${a}.`,
    pool: [
      { text: pySlice(s, b, a - 1, -1), why: `This includes the character at the stop index ${a}. The stop is excluded in backwards slices too.` },
      { text: pySlice(s, a + 1, b + 1), why: 'This picks the right characters but writes them in forward order. A step of $-1$ produces them from right to left.' },
      { text: pySlice(s, a, b), why: `This reads it as the forward slice from ${a} to ${b} and ignores the $-1$ step.` },
      { text: pySlice(s, b - 1, a - 1, -1), why: 'This counts positions from 1 instead of 0, so every character is one place too far to the left.' },
    ],
  };
}

function genSlice(rng: Rng): GeneratedCore {
  for (let attempt = 0; ; attempt++) {
    const s = rng.pick(WORDS);
    const st = sliceSetup(rng, s);
    const ans = pySlice(s, st.start, st.stop, st.step ?? 1);
    if (ans.length < 2) continue;
    const picked: SliceCand[] = [];
    for (const c of st.pool) {
      if (picked.length === 3) break;
      if (c.text.length === 0 || c.text === ans || picked.some((p) => p.text === c.text)) continue;
      picked.push(c);
    }
    if (picked.length < 3 && attempt < 200) continue;
    if (picked.length < 3) throw new Error('slice generator could not find 3 distractors');
    const expr = sliceExpr(st.start, st.stop, st.step);
    const idx = sliceIdx(s.length, st.start, st.stop, st.step ?? 1);
    const negTable = st.start !== null && st.start < 0;
    const visited =
      `| index visited | ${idx.join(' | ')} |\n|${'---|'.repeat(idx.length + 1)}\n| character | ${idx.map((i) => s[i]).join(' | ')} |`;
    const solution =
      indexTable(s, negTable) +
      '\n\n' +
      `For ${code(`s[${expr}]`)}: ${st.rule}\n\n` +
      visited +
      '\n\n' +
      `Reading the characters in that order gives ${code(ans)}.\n\n` +
      `Answer: ${code(ans)}`;
    return {
      stem: 'What does this Python code print?',
      code: { lang: 'python', source: `s = "${s}"\nprint(s[${expr}])` },
      answer: code(ans),
      answerValue: ans,
      distractors: picked.map((p) => ({ text: code(p.text), value: p.text, why: p.why })),
      solution,
      keyIdea: 'A slice `s[start:stop:step]` begins at `start`, moves by `step`, and always stops before `stop`; negative indices count from the end.',
      python: { stdout: `${ans}\n` },
    };
  }
}

// ---------------------------------------------------------------- generator 2: len / split / find / count

const SMALL_WORDS = [
  'data',
  'model',
  'learn',
  'python',
  'code',
  'train',
  'test',
  'graph',
  'value',
  'input',
  'output',
  'layer',
  'error',
  'loss',
  'batch',
  'token',
  'vector',
  'neural',
  'logic',
  'loop',
  'string',
  'list',
];

interface NumCand {
  v: number;
  why: string;
}

function genMethods(rng: Rng): GeneratedCore {
  for (;;) {
    const words = rng.sample(SMALL_WORDS, rng.int(3, 5));
    const s = words.join(' ');
    const n = s.length;
    const spaces = words.length - 1;
    const letters = n - spaces;
    const kind = rng.int(1, 5);
    let expr: string;
    let ans: number;
    let pool: NumCand[];
    let steps: string;
    if (kind === 1) {
      expr = 'len(s)';
      ans = n;
      steps =
        `${code('len(s)')} counts **every** character, spaces included.\n\n` +
        `1. Letters: $${words.map((w) => w.length).join(' + ')} = ${letters}$.\n` +
        `2. Spaces between ${words.length} words: ${spaces}.\n` +
        `3. Total: $${letters} + ${spaces} = ${n}$.`;
      pool = [
        { v: letters, why: 'This forgets to count the spaces. Spaces are characters too, so `len` includes them.' },
        { v: words.length, why: 'This is the number of words, `len(s.split())`. `len(s)` counts characters.' },
        { v: n + 2, why: 'This also counts the two quote marks. The quotes only mark where the string starts and ends; they are not part of it.' },
        { v: n - 1, why: 'This is the index of the last character. Indices start at 0, so the length is one more than the last index.' },
      ];
    } else if (kind === 2) {
      expr = 'len(s.split())';
      ans = words.length;
      steps =
        `1. ${code('s.split()')} cuts the string at the spaces and gives a list of the words: ${words.map((w) => code(w)).join(', ')}.\n` +
        `2. ${code('len')} of that list is the number of words: ${words.length}.`;
      pool = [
        { v: spaces, why: `This counts the spaces. ${spaces} spaces separate ${words.length} words, so there is one more word than spaces.` },
        { v: n, why: 'This is `len(s)`, the number of characters. After `split()` the length is the number of items in the list.' },
        { v: words.length + 1, why: 'This adds one piece too many, as if there were an extra piece after the last word. There is no trailing space, so there is no extra piece.' },
        { v: letters, why: 'This counts the letters without the spaces. `split()` makes a list of words, and `len` counts the words.' },
      ];
    } else if (kind === 3 || kind === 4) {
      // a letter that appears at least twice
      const counts = new Map<string, number[]>();
      s.split('').forEach((ch, i) => {
        if (ch === ' ') return;
        counts.set(ch, [...(counts.get(ch) ?? []), i]);
      });
      const multi = [...counts.entries()].filter(([, pos]) => pos.length >= 2);
      if (!multi.length) continue;
      const [ch, pos] = rng.pick(multi);
      const wordsWith = words.filter((w) => w.includes(ch)).length;
      if (kind === 3) {
        expr = `s.find("${ch}")`;
        ans = pos[0];
        steps =
          `1. Count from index 0, remembering that spaces take up an index too.\n` +
          `2. The letter ${code(ch)} appears at indices ${pos.join(', ')}.\n` +
          `3. ${code('find')} returns the index of the **first** one: ${pos[0]}.`;
        pool = [
          { v: pos[0] + 1, why: 'This counts positions from 1. Python indexes from 0, so the answer is one less.' },
          { v: pos[pos.length - 1], why: `This is the index of the **last** ${code(ch)}. \`find\` stops at the first match.` },
          { v: pos.length, why: `This is how many times ${code(ch)} appears (that is \`count\`). \`find\` gives a position.` },
          { v: pos[0] - (s.slice(0, pos[0]).split(' ').length - 1), why: 'This skips the spaces when counting. Every space has its own index.' },
        ];
      } else {
        expr = `s.count("${ch}")`;
        ans = pos.length;
        steps =
          `1. Go through the string and mark every ${code(ch)}.\n` +
          `2. It appears at indices ${pos.join(', ')}.\n` +
          `3. That is ${pos.length} occurrences, so ${code('count')} returns ${pos.length}.`;
        pool = [
          { v: pos[0], why: `This is the index of the first ${code(ch)} (that is \`find\`). \`count\` returns how many there are.` },
          { v: wordsWith, why: `This counts the words that contain ${code(ch)}. A word with two of them contributes 2 to \`count\`.` },
          { v: pos[pos.length - 1], why: `This is the index of the last ${code(ch)}, not the number of occurrences.` },
          { v: n, why: 'This is `len(s)`, the total number of characters.' },
        ];
      }
    } else {
      // find a whole word
      const k = rng.int(1, words.length - 1);
      const w = words[k];
      if (words.slice(0, k).some((x) => x.includes(w)) || words.slice(0, k).join(' ').includes(w)) continue;
      const idx = s.indexOf(w);
      if (idx !== words.slice(0, k).join(' ').length + 1) continue;
      expr = `s.find("${w}")`;
      ans = idx;
      const before = words.slice(0, k);
      steps =
        `1. ${code('find')} returns the index where the first match **starts**.\n` +
        `2. Before ${code(w)} come the words ${before.map((x) => code(x)).join(', ')} and ${k} space${k === 1 ? '' : 's'}.\n` +
        `3. That is $${before.map((x) => x.length).join(' + ')} + ${k} = ${idx}$ characters, at indices 0 to ${idx - 1}.\n` +
        `4. So ${code(w)} starts at index ${idx}.`;
      pool = [
        { v: idx + 1, why: 'This counts positions from 1. Python indexes from 0, so the first character of the word is at one less.' },
        { v: k, why: `This is the position of the word in the list of words (\`s.split()\`). \`find\` counts characters, not words.` },
        { v: idx - k, why: 'This forgets that each space takes up an index.' },
        { v: idx + w.length - 1, why: 'This is the index of the **last** letter of the word. `find` returns where the match starts.' },
      ];
    }
    const picked: NumCand[] = [];
    for (const c of pool) {
      if (picked.length === 3) break;
      if (c.v < 0 || c.v === ans || picked.some((p) => p.v === c.v)) continue;
      picked.push(c);
    }
    if (picked.length < 3) continue;
    return {
      stem: 'What does this Python code print?',
      code: { lang: 'python', source: `s = "${s}"\nprint(${expr})` },
      answer: code(String(ans)),
      answerValue: ans,
      distractors: picked.map((p) => ({ text: code(String(p.v)), value: p.v, why: p.why })),
      solution: `The string is ${code(s)}, which has ${n} characters (indices 0 to ${n - 1}).\n\n${steps}\n\nAnswer: ${code(String(ans))}`,
      keyIdea:
        kind === 1
          ? '`len(s)` counts every character, including spaces.'
          : kind === 2
            ? '`s.split()` returns a list of words, so `len(s.split())` is the number of words.'
            : kind === 4
              ? '`s.count(x)` returns how many times `x` occurs; `s.find(x)` returns where it first occurs.'
              : '`s.find(x)` returns the index (counting from 0, spaces included) where the first match starts.',
      python: { stdout: `${ans}\n` },
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-strings-slice',
    subtopic: 'strings',
    difficulty: 'exam',
    title: 'Predict the output of a string slice',
    generate: genSlice,
  },
  {
    id: 'gen-strings-methods',
    subtopic: 'strings',
    difficulty: 'foundation',
    title: 'len, split, find and count on a sentence',
    generate: genMethods,
  },
];
