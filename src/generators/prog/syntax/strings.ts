import type { Generator, GeneratedCore } from '../../../types';
import { steps, table } from '../../../lib/explanation';
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
    const spaceWord = spaces === 1 ? 'space' : 'spaces';
    const kind = rng.int(1, 4);
    let source: string;
    let ans: number;
    let pool: NumCand[];
    let asking: string;
    let work: string[];
    let conclusion: string;
    let keyIdea: string;
    if (kind === 1) {
      source = `s = "${s}"\nprint(length(s))`;
      ans = n;
      asking = `How many characters are in ${code(s)}, counting spaces?`;
      work = [
        '`length(s)` counts every character between the quote marks. A space is a character too, but the quote marks themselves do not count.',
        `Count the letters in each word: ${words.map((w) => `${code(w)} has ${w.length}`).join(', ')}. Together that makes $${words.map((w) => w.length).join(' + ')} = ${letters}$ letters.`,
        `There ${spaces === 1 ? 'is' : 'are'} ${spaces} ${spaceWord} between the ${words.length} words.`,
        `Add the letters and the ${spaceWord}: $${letters} + ${spaces} = ${n}$.`,
      ];
      conclusion = `The string has ${letters} letters and ${spaces} ${spaceWord}, so the answer is ${code(String(ans))}.`;
      pool = [
        { v: letters, why: 'This forgets to count the spaces. Spaces are characters too, so `length` includes them.' },
        { v: words.length, why: 'This is the number of words. `length(s)` counts characters.' },
        { v: n + 2, why: 'This also counts the two quote marks. The quotes only mark where the string starts and ends.' },
        { v: n - 1, why: 'This leaves out one character. With positions from 1 to the length, the last position equals the length.' },
      ];
      keyIdea = 'To find a length, add up the letters in each word, then add one for every space between words. The quote marks are not counted.';
    } else if (kind === 4) {
      source = `s = "${s}"\nc = 1\nfor i = 1 to length(s)\n   if s[i] == " "\n      c = c + 1\n   end if\nend for\nprint(c)`;
      ans = words.length;
      let place = 0;
      const rows = words.slice(0, -1).map((w, k) => {
        place += w.length + 1;
        return [code(w), place, k + 2];
      });
      asking = `What does ${code('c')} hold after it starts at 1 and goes up once for each space in ${code(s)}?`;
      work = [
        'Line 2 starts `c` at 1, and not at 0. Line 5 adds 1 every time the character at position `i` is a space, written `" "`.',
        `Other characters leave ${code('c')} alone, so look only at the ${spaceWord}:`,
        table(['Space after', 'Position', '`c` becomes'], rows),
        `Line 8 prints ${code('c')}, which holds ${ans}.`,
      ];
      conclusion = `There ${spaces === 1 ? 'is' : 'are'} ${spaces} ${spaceWord} and ${code('c')} starts at 1, so $1 + ${spaces} = ${ans}$ and the answer is ${code(String(ans))}.`;
      pool = [
        { v: spaces, why: `This counts the spaces but forgets that ${code('c')} starts at 1.` },
        { v: n, why: 'This is `length(s)`, the number of characters. The `if` is true only for spaces.' },
        { v: letters, why: 'This counts the characters that are not spaces. The `if` is true only for spaces.' },
        { v: words.length + 1, why: `This adds one too many. There ${spaces === 1 ? 'is 1 space' : `are ${spaces} spaces`}, so ${code('c')} goes up ${spaces === 1 ? 'once' : `${spaces} times`}.` },
      ];
      keyIdea = 'With one space between words, the number of words is the number of spaces plus 1. Whenever a counter is used, look at its starting value: starting at 1 instead of 0 changes the result.';
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
        let running = 0;
        const rows = words.map((w) => {
          const here = w.split('').filter((c) => c === ch).length;
          running += here;
          return [code(w), here, running];
        });
        asking = `How many times does the letter ${code(ch)} appear in ${code(s)}?`;
        work = [
          `${code('count')} starts at 0 on line 2. The loop looks at each character in turn. Line 5 adds 1 only when the ${code('if')} on line 4 is true, which means the character is ${code(ch)}.`,
          `Every other character leaves ${code('count')} alone, so we only need to find each ${code(ch)}. Go word by word:`,
          table(['Word', `Number of ${code(ch)}`, '`count` after this word'], rows),
          `Line 8 prints the final ${code('count')}, which is ${ans}.`,
        ];
        conclusion = `The letter ${code(ch)} appears ${ans} times, so ${code('count')} ends at ${ans} and the answer is ${code(String(ans))}.`;
        pool = [
          { v: pos[0], why: `This is the position of the first ${code(ch)}. The code counts how many there are.` },
          { v: wordsWith, why: `This counts the words that contain ${code(ch)}. The loop looks at characters, so a word with two of them adds 2.` },
          { v: pos[pos.length - 1], why: `This is the position of the last ${code(ch)}, not the number of matches.` },
          { v: n, why: 'This is `length(s)`, the total number of characters. The `if` counts only the matching ones.' },
        ];
        keyIdea = 'A loop with an `if` that adds 1 is a counter: it counts the items that pass the test. Spot this pattern, then go through the string and tally each match.';
      } else {
        source = `s = "${s}"\np = 0\nfor i = 1 to length(s)\n   if s[i] == "${ch}"\n      p = i\n      break\n   end if\nend for\nprint(p)`;
        ans = pos[0];
        const rows = s
          .slice(0, ans)
          .split('')
          .map((c, k) => [k + 1, c === ' ' ? '(space)' : c, k + 1 === ans ? `yes: ${code(`p = ${ans}`)}, then ${code('break')}` : 'no']);
        asking = `At which position is the first ${code(ch)} in ${code(s)}?`;
        work = [
          `The loop looks at each position in turn. When the character is ${code(ch)}, line 5 stores the position in ${code('p')}, and ${code('break')} on line 6 ends the loop straight away. So only the first ${code(ch)} matters.`,
          'Trace from position 1, remembering that a space takes up a position too:',
          table(['`i`', '`s[i]`', `Equal to ${code(ch)}?`], rows),
          `Line 9 prints ${code('p')}, which holds ${ans}.`,
        ];
        conclusion = `The ${code('break')} stops the search at the first ${code(ch)}, at position ${ans}, so the answer is ${code(String(ans))}.`;
        pool = [
          { v: pos[0] - 1, why: 'This counts positions from 0. The stem says strings are indexed from 1.' },
          { v: pos[pos.length - 1], why: `This is the position of the **last** ${code(ch)}, which is what you would get without the ${code('break')}.` },
          { v: pos.length, why: `This is how many times ${code(ch)} appears. The code stores a position.` },
          { v: pos[0] + 1, why: `This is one past the match. ${code('p')} is set to the position of the match itself.` },
        ];
        keyIdea = 'A loop with `break` after a match is a search for the **first** match. Number the characters from 1, counting spaces, and stop at the first match. Without `break`, `p` would end up as the last match.';
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
      asking,
      solution: steps(...work),
      conclusion,
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
    let asking: string;
    let work: string[];
    let conclusion: string;
    let keyIdea: string;
    if (kind === 1) {
      s = rng.pick(WORDS);
      const a = rng.int(2, s.length - 2);
      const b = rng.int(a + 1, s.length - 1);
      source = `s = "${s}"\nprint(s[${a}] + s[${b}])`;
      ans = at(s, a) + at(s, b);
      asking = `Which two letters of ${code(s)} are at positions ${a} and ${b}?`;
      work = [
        '`s[k]` means the character at position `k`, and here positions start at 1. Write the word with its positions:',
        positionTable(s),
        `Line 2 asks for ${code(`s[${a}]`)} and ${code(`s[${b}]`)}. Reading the table, ${code(`s[${a}]`)} is ${code(at(s, a))} and ${code(`s[${b}]`)} is ${code(at(s, b))}.`,
        `${code('+')} joins strings with the left one first, so line 2 prints ${code(ans)}.`,
      ];
      conclusion = `Position ${a} then position ${b} gives ${code(at(s, a))} then ${code(at(s, b))}, so the answer is ${code(ans)}.`;
      pool = [
        { text: at(s, a + 1) + at(s, b + 1), why: 'This counts positions from 0, so each character is one place too far right. The stem says strings are indexed from 1.' },
        { text: at(s, b) + at(s, a), why: `This joins the characters in the wrong order. ${code(`s[${a}]`)} is on the left of the ${code('+')}, so it comes first.` },
        { text: at(s, a - 1) + at(s, b - 1), why: 'This is one place too far left for both characters. Position 1 holds the first character.' },
      ];
      keyIdea = 'Write the word with position numbers under it, starting from the number the question gives. Read off the letters, then join them in the order they appear around `+`.';
    } else if (kind === 2) {
      s = rng.pick(WORDS);
      const j = rng.int(2, 4);
      const n = s.length;
      const i = n - j;
      source = `s = "${s}"\ni = length(s) - ${j}\nprint(s[i] + s[i + 1])`;
      ans = at(s, i) + at(s, i + 1);
      asking = `Which two letters of ${code(s)} are at positions ${code('i')} and ${code('i + 1')}, where ${code('i')} is ${j} less than the length?`;
      work = [
        `${code(s)} has ${n} characters, so ${code('length(s)')} is ${n}. Line 2 gives ${code('i')} the value $${n} - ${j} = ${i}$.`,
        'Write the positions, counting from 1:',
        positionTable(s),
        `${code('s[i]')} is ${code(`s[${i}]`)}, which is ${code(at(s, i))}. ${code('s[i + 1]')} is ${code(`s[${i + 1}]`)}, which is ${code(at(s, i + 1))}.`,
        `${code('+')} joins strings with the left one first, so line 3 prints ${code(ans)}.`,
      ];
      conclusion = `Position ${i} then position ${i + 1} gives ${code(at(s, i))} then ${code(at(s, i + 1))}, so the answer is ${code(ans)}.`;
      pool = [
        { text: at(s, i + 1) + at(s, i + 2), why: 'This counts positions from 0, so both characters are one place too far right. The stem says strings are indexed from 1.' },
        { text: at(s, i - 1) + at(s, i), why: `This takes the length as ${n - 1}, one too few, which makes ${code('i')} one too small. The word has ${n} characters.` },
        { text: at(s, i + 1) + at(s, i), why: `This joins the characters in the wrong order. ${code('s[i]')} comes first.` },
      ];
      keyIdea = 'Work out the index first, as a number. Write the word with positions under it, read the letters, and join them in the order they appear around `+`.';
    } else {
      s = rng.pick(SHORT_WORDS);
      source = `s = "${s}"\nt = ""\nfor i = 1 to length(s)\n   t = s[i] + t\nend for\nprint(t)`;
      ans = s.split('').reverse().join('');
      const word = s;
      asking = `What is in ${code('t')} after adding each letter of ${code(s)} to the front of it?`;
      work = [
        '`t` starts as `""`, the **empty string**: text with no characters yet.',
        'Line 4 says `t = s[i] + t`. The new character is on the left of the `+`, so it goes in **front** of what `t` already holds.',
        `The loop runs once per character, ${s.length} times in all:`,
        table(
          ['`i`', '`s[i]`', '`t` becomes'],
          s.split('').map((c, k) => [k + 1, c, code(word.slice(0, k + 1).split('').reverse().join(''))]),
        ),
        `Line 6 prints ${code('t')}, which is now ${code(ans)}.`,
      ];
      conclusion = `Each letter goes in front of the earlier ones, which reverses the word, so the answer is ${code(ans)}.`;
      pool = [
        { text: s, why: 'This is `t = t + s[i]`, which adds each character at the end. Here the new character is on the left of the `+`.' },
        { text: s[s.length - 1], why: 'This is `t = s[i]`, which overwrites `t` each time. The line also keeps the old `t`.' },
        { text: INFINITE, why: `The loop runs exactly ${s.length} times, once per character, and then stops.` },
      ];
      keyIdea = 'Look at which side of `+` the new character is on. `t = s[i] + t` adds to the front and reverses the string. `t = t + s[i]` adds to the end and copies it.';
    }
    if (ans.length < 2) continue;
    const kept = pool.filter((c, k) => c.text.length > 0 && c.text !== ans && pool.findIndex((o) => o.text === c.text) === k);
    if (kept.length < 3) continue;
    return {
      stem: INDEXED,
      code: { lang: 'pseudocode', source },
      answer: code(ans),
      answerValue: ans,
      distractors: kept.slice(0, 3).map((c) => ({ text: c.text === INFINITE ? INFINITE : code(c.text), value: c.text, why: c.why })),
      asking,
      solution: steps(...work),
      conclusion,
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
