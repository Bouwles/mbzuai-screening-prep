// Tiny Markdown + LaTeX parser (no dependency). Pure functions so the tests can use it too.
// Supported: paragraphs, ### headings, - bullets, 1. numbered lists, | tables |, ``` code fences,
// **bold**, *italic*, `code`, $inline$, $$display$$, \$ for a literal dollar sign.

export type Inline =
  | { t: 'text'; v: string }
  | { t: 'code'; v: string }
  | { t: 'math'; v: string; display: boolean }
  | { t: 'b'; c: Inline[] }
  | { t: 'i'; c: Inline[] };

export type Block =
  | { t: 'p'; c: Inline[] }
  | { t: 'h'; level: number; c: Inline[] }
  | { t: 'ul'; items: Inline[][] }
  | { t: 'ol'; items: Inline[][] }
  | { t: 'mathblock'; v: string }
  | { t: 'code'; lang: string; v: string }
  | { t: 'table'; head: Inline[][]; rows: Inline[][][] };

function findUnescaped(s: string, needle: string, from: number): number {
  for (let i = from; i <= s.length - needle.length; i++) {
    if (s[i] === '\\') {
      i++;
      continue;
    }
    if (s.startsWith(needle, i)) return i;
  }
  return -1;
}

export function parseInline(s: string): Inline[] {
  const out: Inline[] = [];
  let buf = '';
  const flush = () => {
    if (buf) out.push({ t: 'text', v: buf });
    buf = '';
  };
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === '\\' && s[i + 1] === '$') {
      buf += '$';
      i += 2;
      continue;
    }
    if (ch === '`') {
      const j = s.indexOf('`', i + 1);
      if (j > i) {
        flush();
        out.push({ t: 'code', v: s.slice(i + 1, j) });
        i = j + 1;
        continue;
      }
    }
    if (ch === '$') {
      const display = s[i + 1] === '$';
      const open = display ? 2 : 1;
      const j = findUnescaped(s, display ? '$$' : '$', i + open);
      if (j > i) {
        flush();
        out.push({ t: 'math', v: s.slice(i + open, j).trim(), display });
        i = j + open;
        continue;
      }
    }
    if (ch === '*' && s[i + 1] === '*') {
      const j = s.indexOf('**', i + 2);
      if (j > i + 2) {
        flush();
        out.push({ t: 'b', c: parseInline(s.slice(i + 2, j)) });
        i = j + 2;
        continue;
      }
    }
    if (ch === '*' && s[i + 1] && s[i + 1] !== ' ' && s[i + 1] !== '*') {
      // find a closing single * that is not part of **
      let j = i + 1;
      let found = -1;
      while (j < s.length) {
        if (s[j] === '`') {
          const k = s.indexOf('`', j + 1);
          if (k > j) {
            j = k + 1;
            continue;
          }
        }
        if (s[j] === '$') {
          const k = findUnescaped(s, '$', j + 1);
          if (k > j) {
            j = k + 1;
            continue;
          }
        }
        if (s[j] === '*' && s[j + 1] !== '*' && s[j - 1] !== ' ' && s[j - 1] !== '*') {
          found = j;
          break;
        }
        j++;
      }
      if (found > i + 1) {
        flush();
        out.push({ t: 'i', c: parseInline(s.slice(i + 1, found)) });
        i = found + 1;
        continue;
      }
    }
    buf += ch;
    i++;
  }
  flush();
  return out;
}

const isTableLine = (l: string) => /^\s*\|.*\|\s*$/.test(l);
const isSepLine = (l: string) => /^\s*\|(\s*:?-{2,}:?\s*\|)+\s*$/.test(l);
const splitRow = (l: string) =>
  l
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split(/(?<!\\)\|/)
    .map((c) => c.trim().replace(/\\\|/g, '|'));

export function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let para: string[] = [];
  const flushPara = () => {
    if (para.length) blocks.push({ t: 'p', c: parseInline(para.join(' ')) });
    para = [];
  };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === '') {
      flushPara();
      i++;
      continue;
    }
    const fence = trimmed.match(/^```(\w*)/);
    if (fence) {
      flushPara();
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) body.push(lines[i++]);
      i++;
      blocks.push({ t: 'code', lang: fence[1] || 'text', v: body.join('\n') });
      continue;
    }
    if (trimmed.startsWith('$$')) {
      flushPara();
      let acc = trimmed.slice(2);
      let closed = acc.includes('$$');
      i++;
      while (!closed && i < lines.length) {
        acc += '\n' + lines[i];
        closed = lines[i].includes('$$');
        i++;
      }
      const end = acc.lastIndexOf('$$');
      const mathSrc = (end >= 0 ? acc.slice(0, end) : acc).trim();
      blocks.push({ t: 'mathblock', v: mathSrc });
      const rest = end >= 0 ? acc.slice(end + 2).trim() : '';
      if (rest) para.push(rest);
      continue;
    }
    const h = trimmed.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      flushPara();
      blocks.push({ t: 'h', level: h[1].length, c: parseInline(h[2]) });
      i++;
      continue;
    }
    if (/^[-*]\s+/.test(trimmed)) {
      flushPara();
      const items: Inline[][] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        let item = lines[i].trim().replace(/^[-*]\s+/, '');
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i])) item += ' ' + lines[i++].trim();
        items.push(parseInline(item));
      }
      blocks.push({ t: 'ul', items });
      continue;
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      flushPara();
      const items: Inline[][] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        let item = lines[i].trim().replace(/^\d+\.\s+/, '');
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*\d+\.\s+/.test(lines[i])) item += ' ' + lines[i++].trim();
        items.push(parseInline(item));
      }
      blocks.push({ t: 'ol', items });
      continue;
    }
    if (isTableLine(line) && i + 1 < lines.length && isSepLine(lines[i + 1])) {
      flushPara();
      const head = splitRow(line).map(parseInline);
      i += 2;
      const rows: Inline[][][] = [];
      while (i < lines.length && isTableLine(lines[i])) rows.push(splitRow(lines[i++]).map(parseInline));
      blocks.push({ t: 'table', head, rows });
      continue;
    }
    para.push(trimmed);
    i++;
  }
  flushPara();
  return blocks;
}

/** Every LaTeX snippet in a rich-text string (for tests). */
export function extractMath(src: string): { v: string; display: boolean }[] {
  const out: { v: string; display: boolean }[] = [];
  const walk = (xs: Inline[]) =>
    xs.forEach((x) => {
      if (x.t === 'math') out.push({ v: x.v, display: x.display });
      else if (x.t === 'b' || x.t === 'i') walk(x.c);
    });
  for (const b of parseBlocks(src)) {
    if (b.t === 'p' || b.t === 'h') walk(b.c);
    else if (b.t === 'ul' || b.t === 'ol') b.items.forEach(walk);
    else if (b.t === 'mathblock') out.push({ v: b.v, display: true });
    else if (b.t === 'table') [b.head, ...b.rows].forEach((r) => r.forEach(walk));
  }
  return out;
}

/** Every plain-text run (outside maths and code) in a rich-text string (for lint tests). */
export function extractText(src: string): string[] {
  const out: string[] = [];
  const walk = (xs: Inline[]) =>
    xs.forEach((x) => {
      if (x.t === 'text') out.push(x.v);
      else if (x.t === 'b' || x.t === 'i') walk(x.c);
    });
  for (const b of parseBlocks(src)) {
    if (b.t === 'p' || b.t === 'h') walk(b.c);
    else if (b.t === 'ul' || b.t === 'ol') b.items.forEach(walk);
    else if (b.t === 'table') [b.head, ...b.rows].forEach((r) => r.forEach(walk));
  }
  return out;
}

/** Plain-text approximation (used for search and for comparing options). */
export function toPlain(src: string): string {
  return src
    .replace(/\\\$/g, '$')
    .replace(/[`*]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
