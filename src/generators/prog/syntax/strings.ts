import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';

const code = (t: string) => `\`${t}\``;
const INDEXED = 'What does this pseudocode print? Strings are indexed from 1.';
const INFINITE = 'Infinite loop';

/** Markdown table of positions (counted from 1) and characters. */
function positionTable(s: string): string {
  const chars = s.split('');
  return [
    `| position | ${chars.map((_, i) => i + 1).join(' | ')} |`,
    `|${'---|'.repeat(chars.length + 1)}`,
    `| character | ${chars.map((c) => (c === ' ' ? '(space)' : c)).join(' | ')} |`,
  ].join('\n');
}

// ---------------------------------------------------------------- generator 1: length, counting and searching

const SMALL_WORDS = [
  'data',
  'model',
  'learn',
  'robot',
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
    const words = rng.sample(SMALL_WORDS, rng.int(2, 3));
    const s = words.join(' ');
    const n = s.length;
    const spaces = words.length - 1;
    const letters = n - spaces;
    const kind = rng.int(1, 4);
    let source: string;
    let ans: number;
    let pool: NumCand[];
    let steps: string;
    let keyIdea: string;
    if (kind === 1) {
      source = `s = "${s}"\nprint(length(s))`;
      ans = n;
      steps =
        `${code('length(s)')} counts **every** character, spaces included.\n\n` +
        `1. Letters: $${words.map((w) => w.length).join(' + ')} = ${letters}$.\n` +
        `2. Spaces between ${words.length} words: ${spaces}.\n` +
        `3. Total: $${letters} + ${spaces} = ${n}$.`;
      pool = [
        { v: letters, why: 'This forgets to count the spaces. Spaces are characters too, so `length` includes them.' },
        { v: words.length, why: 'This is the number of words. `length(s)` counts characters.' },
        { v: n + 2, why: 'This also counts the two quote marks. The quotes only mark where the string starts and ends.' },
        { v: n - 1, why: 'This leaves out one character. With positions from 1 to the length, the last position equals the length.' },
      ];
      keyIdea = '`length(s)` counts every character, including spaces.';
    } else if (kind === 4) {
      source = `s = "${s}"\nc = 1\nfor i = 1 to length(s)\n   if s[i] == " "\n      c = c + 1\n   end if\nend for\nprint(c)`;
      ans = words.length;
      steps =
        `1. The loop adds 1 to ${code('c')} for each space, and the string has ${spaces} space${spaces === 1 ? '' : 's'}.\n` +
        `2. ${code('c')} starts at 1, so it ends at $1 + ${spaces} = ${ans}$, which is the number of words.`;
      pool = [
        { v: spaces, why: `This counts the spaces but forgets that ${code('c')} starts at 1.` },
        { v: n, why: 'This is `length(s)`, the number of characters. The `if` is true only for spaces.' },
        { v: letters, why: 'This counts the characters that are not spaces. The `if` is true only for spaces.' },
        { v: words.length + 1, why: `This adds one too many. There are ${spaces} spaces, so ${code('c')} goes up ${spaces} times.` },
      ];
      keyIdea = 'With single spaces between words, the number of words is the number of spaces plus 1.';
    } else {
      // a letter that appears at least twice
      const counts = new Map<string, number[]>();
      s.split('').forEach((ch, i) => {
        if (ch === ' ') return;
        counts.set(ch, [...(counts.get(ch) ?? []), i + 1]);
      });
      const multi = [...counts.entries()].filter(([, pos]) => pos.length >= 2);
      if (!multi.length) continue;
      const [ch, pos] = rng.pick(multi);
      const wordsWith = words.filter((w) => w.includes(ch)).length;
      if (kind === 2) {
        source = `s = "${s}"\ncount = 0\nfor i = 1 to length(s)\n   if s[i] == "${ch}"\n      count = count + 1\n   end if\nend for\nprint(count)`;
        ans = pos.length;
        steps =
          `1. The loop adds 1 to ${code('count')} for every ${code(ch)}.\n` +
          `2. ${code(ch)} appears at positions ${pos.join(', ')}.\n` +
          `3. That is ${pos.length} matches.`;
        pool = [
          { v: pos[0], why: `This is the position of the first ${code(ch)}. The code counts how many there are.` },
          { v: wordsWith, why: `This counts the words that contain ${code(ch)}. The loop looks at characters, so a word with two of them adds 2.` },
          { v: pos[pos.length - 1], why: `This is the position of the last ${code(ch)}, not the number of matches.` },
          { v: n, why: 'This is `length(s)`, the total number of characters. The `if` counts only the matching ones.' },
        ];
        keyIdea = 'A loop over positions with an `if` inside counts the characters that match.';
      } else {
        source = `s = "${s}"\np = 0\nfor i = 1 to length(s)\n   if s[i] == "${ch}"\n      p = i\n      break\n   end if\nend for\nprint(p)`;
        ans = pos[0];
        steps =
          `1. Count from position 1, remembering that a space takes up a position too.\n` +
          `2. The letter ${code(ch)} appears at positions ${pos.join(', ')}.\n` +
          `3. ${code('break')} ends the loop at the **first** one: ${pos[0]}.`;
        pool = [
          { v: pos[0] - 1, why: 'This counts positions from 0. The stem says strings are indexed from 1.' },
          { v: pos[pos.length - 1], why: `This is the position of the **last** ${code(ch)}, which is what you would get without the ${code('break')}.` },
          { v: pos.length, why: `This is how many times ${code(ch)} appears. The code stores a position.` },
          { v: pos[0] + 1, why: `This is one past the match. ${code('p')} is set to the position of the match itself.` },
        ];
        keyIdea = 'A search with `break` keeps the position of the first match.';
      }
    }
    const picked: NumCand[] = [];
    for (const c of pool) {
      if (picked.length === 3) break;
      if (c.v < 0 || c.v === ans || picked.some((p) => p.v === c.v)) continue;
      picked.push(c);
    }
    if (picked.length < 3) continue;
    return {
      stem: kind === 1 ? 'What does this pseudocode print?' : INDEXED,
      code: { lang: 'pseudocode', source },
      answer: code(String(ans)),
      answerValue: ans,
      distractors: picked.map((p) => ({ text: code(String(p.v)), value: p.v, why: p.why })),
      solution: `The string is ${code(s)}, which has ${n} characters (positions 1 to ${n}).\n\n${steps}\n\nAnswer: ${code(String(ans))}`,
      keyIdea,
    };
  }
}

// ---------------------------------------------------------------- generator 2: positions and joining

const WORDS = [
  'ALGORITHM',
  'COMPUTER',
  'NETWORK',
  'DATABASE',
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

/** Short words whose last letter can stand alone as an option without reading like a label. */
const SHORT_WORDS = ['ROBOT', 'GRAPH', 'TRAIN', 'TOKEN', 'MODEL', 'LAYER', 'INPUT', 'LOOP', 'CODE', 'NODE', 'TREE', 'BYTE', 'MOUSE', 'PIXEL'];

interface TextCand {
  text: string;
  why: string;
}

const at = (s: string, i: number) => s[i - 1] ?? '';

function genPosition(rng: Rng): GeneratedCore {
  for (;;) {
    const kind = rng.int(1, 3);
    let s: string;
    let source: string;
    let ans: string;
    let pool: TextCand[];
    let steps: string;
    let keyIdea: string;
    if (kind === 1) {
      s = rng.pick(WORDS);
      const a = rng.int(2, s.length - 2);
      const b = rng.int(a + 1, s.length - 1);
      source = `s = "${s}"\nprint(s[${a}] + s[${b}])`;
      ans = at(s, a) + at(s, b);
      steps = `1. ${code(`s[${a}]`)} is ${code(at(s, a))} and ${code(`s[${b}]`)} is ${code(at(s, b))}.\n2. ${code('+')} joins them with the left one first.`;
      pool = [
        { text: at(s, a + 1) + at(s, b + 1), why: 'This counts positions from 0, so each character is one place too far right. The stem says strings are indexed from 1.' },
        { text: at(s, b) + at(s, a), why: `This joins the characters in the wrong order. ${code(`s[${a}]`)} is on the left of the ${code('+')}, so it comes first.` },
        { text: at(s, a - 1) + at(s, b - 1), why: 'This is one place too far left for both characters. Position 1 holds the first character.' },
      ];
      keyIdea = 'Indexed from 1, `s[k]` is the $k$-th character from the left, and `+` joins strings left to right.';
    } else if (kind === 2) {
      s = rng.pick(WORDS);
      const j = rng.int(2, 4);
      const n = s.length;
      const i = n - j;
      source = `s = "${s}"\ni = length(s) - ${j}\nprint(s[i] + s[i + 1])`;
      ans = at(s, i) + at(s, i + 1);
      steps =
        `1. ${code('length(s)')} is ${n}, so ${code('i')} is $${n} - ${j} = ${i}$.\n` +
        `2. ${code(`s[${i}]`)} is ${code(at(s, i))} and ${code(`s[${i + 1}]`)} is ${code(at(s, i + 1))}.\n` +
        `3. ${code('+')} joins them with the left one first.`;
      pool = [
        { text: at(s, i + 1) + at(s, i + 2), why: 'This counts positions from 0, so both characters are one place too far right. The stem says strings are indexed from 1.' },
        { text: at(s, i - 1) + at(s, i), why: `This takes the length as ${n - 1}, one too few, which makes ${code('i')} one too small. The word has ${n} characters.` },
        { text: at(s, i + 1) + at(s, i), why: `This joins the characters in the wrong order. ${code('s[i]')} comes first.` },
      ];
      keyIdea = 'Work out the index first, then read the characters off a table of positions.';
    } else {
      s = rng.pick(SHORT_WORDS);
      source = `s = "${s}"\nt = ""\nfor i = 1 to length(s)\n   t = s[i] + t\nend for\nprint(t)`;
      ans = s.split('').reverse().join('');
      steps =
        'Each new character goes in **front** of what is already in `t`.\n\n' +
        `| i | s[i] | t |\n|---|---|---|\n${s
          .split('')
          .map((c, k) => `| ${k + 1} | ${c} | ${s.slice(0, k + 1).split('').reverse().join('')} |`)
          .join('\n')}`;
      pool = [
        { text: s, why: 'This is `t = t + s[i]`, which adds each character at the end. Here the new character is on the left of the `+`.' },
        { text: s[s.length - 1], why: 'This is `t = s[i]`, which overwrites `t` each time. The line also keeps the old `t`.' },
        { text: INFINITE, why: `The loop runs exactly ${s.length} times, once per character, and then stops.` },
      ];
      keyIdea = '`t = s[i] + t` builds the string in reverse, while `t = t + s[i]` copies it.';
    }
    if (ans.length < 2) continue;
    const kept = pool.filter((c, k) => c.text.length > 0 && c.text !== ans && pool.findIndex((o) => o.text === c.text) === k);
    if (kept.length < 3) continue;
    const answer = code(ans);
    return {
      stem: INDEXED,
      code: { lang: 'pseudocode', source },
      answer,
      answerValue: ans,
      distractors: kept.slice(0, 3).map((c) => ({ text: c.text === INFINITE ? INFINITE : code(c.text), value: c.text, why: c.why })),
      solution: `${positionTable(s)}\n\n${steps}\n\nAnswer: ${answer}`,
      keyIdea,
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-strings-methods',
    subtopic: 'strings',
    difficulty: 'foundation',
    title: 'Length, counting and searching in a string',
    generate: genMethods,
  },
  {
    id: 'gen-strings-position',
    subtopic: 'strings',
    difficulty: 'exam',
    title: 'Characters at stated positions and joining strings',
    generate: genPosition,
  },
];
